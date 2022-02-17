import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { Box, Button, Flex, SimpleGrid, Spacer } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'

import { initProjectContracts } from '../redux/actions/contract'
import Card from '../components/ui/Card'

const ProjectList = ({ projectIdentifiers }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { walletConnection, nearConfig, projects } = useSelector(
    (state) => state.near
  )

  useEffect(() => {
    dispatch(
      initProjectContracts({
        wallet: walletConnection,
        nearConfig,
        projectIdentifiers: projectIdentifiers.map(
          (project) => project.identifier
        ),
      })
    )
  }, [dispatch, projectIdentifiers])

  const navigateToDetailPage = useCallback((identifier) => {
    router.push(`/project/${identifier}`)
  })

  const navigateToProjectForm = useCallback(() => {
    router.push('/project/new')
  })

  return (
    <>
      <Flex align='end'>
        <Spacer />
        <Box>
          <Button
            leftIcon={<FiPlus />}
            bg={'blue.400'}
            color={'white'}
            flex={'1 0 auto'}
            _hover={{ bg: 'blue.500' }}
            _focus={{ bg: 'blue.500' }}
            onClick={navigateToProjectForm}
          >
            Add New Project
          </Button>
        </Box>
      </Flex>
      <SimpleGrid minChildWidth='445px' spacing={5}>
        {projects.map((project) => (
          <Card
            key={project.identifier}
            project={project}
            onClick={navigateToDetailPage}
          />
        ))}
      </SimpleGrid>
    </>
  )
}

export default ProjectList
