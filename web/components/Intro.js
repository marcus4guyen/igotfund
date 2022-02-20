import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import {
  Box,
  Button,
  Container,
  createIcon,
  Heading,
  Icon,
  Stack,
  VStack,
  List,
  ListItem,
  ListIcon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import { signIn } from '../redux/actions/authentication'

const Intro = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { walletConnection, nearConfig } = useSelector((state) => state.near)

  const signInHandler = useCallback(() =>
    dispatch(signIn({ wallet: walletConnection, nearConfig }))
  )

  return router.route === '/rules' ? (
    <Rules />
  ) : (
    <GetStarted signInHandler={signInHandler} />
  )
}

const GetStarted = ({ signInHandler }) => {
  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap'
          rel='stylesheet'
        />
      </Head>
      <Container>
        <Stack
          as={Box}
          textAlign='center'
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight='110%'
          >
            Crowdfunding <br />
            <Text as={'span'} color='green.400'>
              igotfund
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            You can create crowdfunding projects that have a base fund of 10
            NEAR. You can post as many projects as you want. Once your project
            reaches 1000 NEAR fund or 100 likes from our community, you can take
            donations out of the system to your wallet.
          </Text>
          <Stack
            direction={'column'}
            spacing='3'
            align='center'
            alignSelf='center'
            position='relative'
          >
            <Button
              colorScheme='green'
              bg='green.400'
              rounded='full'
              px='6'
              _hover={{ bg: 'green.500' }}
              onClick={signInHandler}
            >
              Get Started
            </Button>
            <NextLink href='/rules'>
              <Button variant='link' colorScheme='blue' size='sm'>
                Learn more
              </Button>
            </NextLink>
            <Box>
              <Icon
                as={Arrow}
                color={useColorModeValue('gray.800', 'gray.300')}
                w={71}
                position='absolute'
                right='-63px'
                top='10px'
              />
              <Text
                fontSize='lg'
                fontFamily='Caveat'
                position='absolute'
                right='-125px'
                top='-15px'
                transform={'rotate(20deg)'}
              >
                Starting at 10 NEAR/project
              </Text>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}

const Rules = () => {
  const BoxWrapper = ({ children }) => {
    return (
      <Box
        mb={4}
        shadow='base'
        borderWidth='1px'
        alignSelf={{ base: 'center', lg: 'flex-start' }}
        borderColor={useColorModeValue('gray.200', 'gray.500')}
        borderRadius={'xl'}
      >
        {children}
      </Box>
    )
  }

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign='center'>
        <Heading as='h1' fontSize='4xl'>
          igotfund
        </Heading>
        <Text fontSize='lg' color={'gray.500'}>
          There are three roles in the platform: project owners, contract
          owners, and donors.
        </Text>
      </VStack>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign='center'
        justify='center'
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        <BoxWrapper>
          <Box position='relative'>
            <Box
              position='absolute'
              top='-16px'
              left='50%'
              style={{ transform: 'translate(-50%)' }}
            ></Box>
            <Box py={4} px={12}>
              <Text fontWeight='500' fontSize='2xl'>
                Contract Owner
              </Text>
            </Box>
            <VStack
              bg={useColorModeValue('gray.50', 'gray.700')}
              py={4}
              borderBottomRadius={'xl'}
            >
              <List spacing={3} textAlign='start' px={12}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color='green.500' />
                  can deploy and initialize contracts, which require a minimum
                  of 10 NEAR deposits to be staked
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color='green.500' />
                  will be rewarded with 5 NEAR tokens when the Project owner
                  decides to release the donations fund
                </ListItem>
              </List>
            </VStack>
          </Box>
        </BoxWrapper>

        <BoxWrapper>
          <Box py={4} px={12}>
            <Text fontWeight='500' fontSize='2xl'>
              Project Owner
            </Text>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}
          >
            <List spacing={3} textAlign='start' px={12}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color='green.500' />
                can set up as many projects as they like, with each project
                costing 10 NEAR
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color='green.500' />
                the donations will be released once the project has raised at
                least 100 NEAR or has reached 10 likes on the community board
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color='green.500' />
                once the project is marked complete, it&apos;s no longer
                eligible for donation
              </ListItem>
            </List>
          </VStack>
        </BoxWrapper>

        <BoxWrapper>
          <Box py={4} px={12}>
            <Text fontWeight='500' fontSize='2xl'>
              Donor
            </Text>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}
          >
            <List spacing={3} textAlign='start' px={12}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color='green.500' />
                can donate, like, and comment on any project that they find
                appealing
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color='green.500' />
                the minimum donation amount is 1 NEAR
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color='green.500' />
                must donate, like, and comment directly (not through a
                cross-contract call)
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color='green.500' />
                can&apos;t like the same project multiple times
              </ListItem>
            </List>
          </VStack>
        </BoxWrapper>
      </Stack>
    </Box>
  )
}

const Arrow = createIcon({
  displayName: 'Arrow',
  viewBox: '0 0 72 24',
  path: (
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z'
      fill='currentColor'
    />
  ),
})

export default Intro
