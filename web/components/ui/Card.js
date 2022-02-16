import {
  Avatar,
  Box,
  Center,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { formatDate } from '../../near/utils'

const Card = ({ onClick = () => {}, project }) => {
  return (
    <Center py={6}>
      <Box
        maxW={'445px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
        cursor='pointer'
        onClick={() => onClick(project.identifier)}
      >
        <Box
          boxShadow={'sm'}
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          pos={'relative'}
          height='300px'
        >
          <Image src={project.image} fit='cover' w={'100%'} height={'100%'} />
        </Box>
        <Stack>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}
          >
            NEAR
          </Text>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}
          >
            {project.title}
          </Heading>
          <Text color={'gray.500'}>{project.description}</Text>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          <Avatar
            src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
            alt={'Author'}
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontWeight={600}>{project.owner}</Text>
            <Text color={'gray.500'}>{formatDate(project.created_at)}</Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  )
}

export default Card
