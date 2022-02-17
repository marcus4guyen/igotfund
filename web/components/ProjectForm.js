import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useState } from 'react'
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  HStack,
  FormControl,
  FormLabel,
  InputGroup,
  FormHelperText,
  Textarea,
  InputLeftAddon,
  FormErrorMessage,
} from '@chakra-ui/react'

import { createNewProject } from '../redux/actions/contract'
import { lorem } from '../utils/helper'

const images = [
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1495055154266-57bbdeada43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1525338078858-d762b5e32f2c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80',
]

const ProjectForm = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { contract } = useSelector((state) => state.near)

  // when create new project successfully, should back to the home page
  if (router.query.transactionHashes) {
    router.push('/')
  }

  // State
  const [identifier, setIdentifier] = useState(lorem.generateWords(1))
  const [title, setTitle] = useState(lorem.generateWords(2))
  const [description, setDescription] = useState(lorem.generateSentences(5))
  const [imageUrl, setImageUrl] = useState(
    images[Math.floor(Math.random() * 5)]
  )
  const [amount, setAmount] = useState(10)
  // Error
  const isDescriptionTooLong = description.length > 500
  const isAmountEnough = amount >= 10
  const isFormValid =
    !isDescriptionTooLong &&
    isAmountEnough &&
    identifier &&
    title &&
    description &&
    imageUrl &&
    amount

  const onSubmitHandler = useCallback(async (event) => {
    event.preventDefault()

    dispatch(
      createNewProject({
        contract,
        identifier,
        title,
        description,
        imageUrl,
        amount,
      })
    )
  })

  return (
    <Box position={'relative'}>
      <Container spacing={{ base: 10, lg: 32 }}>
        <Stack
          bg={'gray.50'}
          rounded={'xl'}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
        >
          <Stack spacing={4}>
            <Heading
              color={'gray.800'}
              lineHeight={1.1}
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            >
              Add New Project
            </Heading>
            <Text
              color={'gray.500'}
              fontSize={{ base: 'sm', sm: 'md' }}
              fontStyle='italic'
            >
              Add your project to attract donors here. Note that you must attach
              at least 10 NEAR to be able to create the project.
            </Text>
          </Stack>
          <Stack spacing={4}>
            <HStack>
              <FormControl id='identifier' isRequired>
                <FormLabel>ID</FormLabel>
                <Input
                  type='text'
                  value={identifier}
                  onChange={({ target }) => setIdentifier(target.value)}
                />
              </FormControl>

              <FormControl id='title' isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  type='text'
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}
                />
              </FormControl>
            </HStack>
            <FormControl
              id='description'
              isRequired
              isInvalid={isDescriptionTooLong}
            >
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={({ target }) => setDescription(target.value)}
                placeholder='Describe your project here...'
              />
              {isDescriptionTooLong ? (
                <FormErrorMessage>
                  Description should be less than 500 characters.
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  Description should be less than 500 characters.
                </FormHelperText>
              )}
            </FormControl>
            <FormControl id='image' isRequired>
              <FormLabel>Image URL</FormLabel>
              <InputGroup>
                <InputLeftAddon>https://</InputLeftAddon>
                <Input
                  value={imageUrl}
                  onChange={({ target }) => setImageUrl(target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl id='amount' isRequired isInvalid={!isAmountEnough}>
              <FormLabel>Initial Amount</FormLabel>
              <Input
                type='number'
                value={amount}
                onChange={({ target }) => setAmount(target.value)}
              />
              {isAmountEnough ? (
                <FormHelperText>
                  You must attach at least 10 NEAR for the initial deposit of
                  the project.
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  You must attach at least 10 NEAR for the initial deposit of
                  the project.
                </FormErrorMessage>
              )}
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                fontFamily={'heading'}
                mt={8}
                w={'full'}
                bgGradient='linear(to-r, red.400,pink.400)'
                color={'white'}
                _hover={{
                  bgGradient: 'linear(to-r, red.400,pink.400)',
                  boxShadow: 'xl',
                }}
                isDisabled={!isFormValid}
                onClick={onSubmitHandler}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default ProjectForm
