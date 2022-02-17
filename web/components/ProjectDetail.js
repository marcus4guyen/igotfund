import { useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import {
  _initProjectContract,
  _getProject,
  _getComments,
  _getLikeCount,
  _donate,
  _addComment,
  _like,
  _releaseDonations,
  _getDonations,
} from '../redux/actions/contract'
import { FaDonate, FaShare, FaThumbsUp } from 'react-icons/fa'
import {
  Button,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import Card from './ui/Card'
import Comment from './ui/Comment'
import NewComment from './ui/NewComment'
import Donation from './ui/Donation'
import DonationModal from './ui/DonationModal'
import { asNear } from '../near/utils'

const ProjectDetail = ({ identifier }) => {
  const { walletConnection, nearConfig } = useSelector((state) => state.near)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const near = useSelector((state) => state.near)

  // contract
  const [contract, setContract] = useState({})
  // state
  const [project, setProject] = useState({})
  const [comments, setComments] = useState([])
  const [donations, setDonations] = useState([])
  const [likes, setLikes] = useState(0)

  useEffect(async () => {
    if (identifier) {
      const projectContract = await _initProjectContract({
        wallet: walletConnection,
        nearConfig,
        identifier,
      })
      setContract(projectContract)

      _getProject({ contract: projectContract }).then((project) =>
        setProject(project)
      )
      _getComments({ contract: projectContract, offset: 0, limit: 10 }).then(
        (comments) => setComments(comments)
      )
      _getDonations({ contract: projectContract, offset: 0, limit: 10 }).then(
        (donations) => setDonations(donations)
      )
      _getLikeCount({ contract: projectContract }).then((likes) =>
        setLikes(likes)
      )
    }
  }, [identifier])

  const donateHandler = useCallback((amount) => _donate({ contract, amount }))

  const addCommentHandler = useCallback((newComment) =>
    _addComment({ contract, newComment })
  )

  const likeHandler = useCallback(() => _like({ contract }))

  const releaseDonationsHandler = useCallback(() =>
    _releaseDonations({
      contract: near.contract,
      identifier: project.identifier,
    })
  )

  return (
    <>
      <SimpleGrid columns='3' minChildWidth='445px' spacing={5}>
        <Flex alignItems={'flex-start'} margin={{ base: '0 auto' }}>
          <Stack>
            <Card project={project} />
            <Flex
              as={SimpleGrid}
              boxShadow='lg'
              maxW='640px'
              direction={'column'}
              width='full'
              rounded='xl'
              p={6}
              justifyContent='space-between'
              position='relative'
              bg={useColorModeValue('white', 'gray.800')}
              top={-12}
              spacing={1}
            >
              <Flex
                as={SimpleGrid}
                direction={'row'}
                textAlign='center'
                justifyContent={'space-between'}
                w='full'
                spacing={5}
              >
                <Text>
                  {likes} like{likes > 1 ? 's' : ''}
                </Text>
                <Text>{asNear(project.total_donations)}</Text>
              </Flex>
              <Divider />
              <Flex
                as={SimpleGrid}
                direction={'row'}
                textAlign='center'
                justifyContent={'space-between'}
                w='full'
                spacing={5}
              >
                <Button
                  flex={1}
                  variant='outline'
                  border='none'
                  leftIcon={<FaThumbsUp />}
                  onClick={likeHandler}
                >
                  Like
                </Button>
                <Button
                  flex={1}
                  variant='outline'
                  border='none'
                  leftIcon={<FaShare />}
                >
                  Share
                </Button>
                <Button
                  flex={1}
                  variant='outline'
                  border='none'
                  leftIcon={<FaDonate />}
                  onClick={onOpen}
                  disabled={!project.funding}
                >
                  Donate
                </Button>
              </Flex>
              <Divider />
              <Flex
                as={SimpleGrid}
                direction={'row'}
                textAlign='center'
                justifyContent={'space-between'}
                w='full'
                spacing={5}
              >
                <Button
                  flex={1}
                  variant='outline'
                  border='none'
                  leftIcon={<FaDonate />}
                  onClick={releaseDonationsHandler}
                  disabled={!project.funding}
                >
                  Release Donations
                </Button>
              </Flex>
              <Divider />
            </Flex>
          </Stack>
        </Flex>

        <Tabs align='center' margin={{ base: '0 auto' }}>
          <TabList>
            <Tab>Comments</Tab>
            <Tab>Donations</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Flex
                textAlign={'center'}
                justifyContent={'center'}
                direction={'column'}
              >
                <SimpleGrid
                  spacing={6}
                  minChildWidth='445px'
                  mx={'auto'}
                  pt={6}
                >
                  <NewComment onAddComment={addCommentHandler} />
                  {comments.map((comment) => (
                    <Comment key={comment.created_at} {...comment} />
                  ))}
                </SimpleGrid>
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex
                textAlign={'center'}
                justifyContent={'center'}
                direction={'column'}
              >
                <SimpleGrid
                  spacing={6}
                  minChildWidth='445px'
                  mx={'auto'}
                  pt={6}
                >
                  {donations.map((donation) => (
                    <Donation key={donation.created_at} {...donation} />
                  ))}
                </SimpleGrid>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SimpleGrid>

      <DonationModal
        isOpen={isOpen}
        onClose={onClose}
        onDonate={donateHandler}
      />
    </>
  )
}

export default ProjectDetail
