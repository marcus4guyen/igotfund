import {
  Flex,
  useColorModeValue,
  FormControl,
  FormLabel,
  Textarea,
  FormErrorMessage,
  FormHelperText,
  Stack,
  Button,
} from '@chakra-ui/react'
import { useState } from 'react'
import { _addComment } from '../../redux/actions/contract'
import { lorem } from '../../utils/helper'

const NewComment = ({ onAddComment }) => {
  const [newComment, setNewComment] = useState(lorem.generateSentences(5))
  const isCommentTooLong = newComment.length > 500
  const canSubmit = newComment.length > 10 && !isCommentTooLong

  return (
    <Flex
      boxShadow='lg'
      maxW='640px'
      direction={{ base: 'column-reverse', md: 'row' }}
      width='full'
      rounded='xl'
      p='10'
      justifyContent='space-between'
      position='relative'
      bg={useColorModeValue('white', 'gray.800')}
      _after={{
        content: '""',
        position: 'absolute',
        height: '24px',
        width: '29px',
        left: '35px',
        top: '-10px',
        backgroundSize: 'cover',
        backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADAUlEQVRoge2Yz0sUYRjHv8/+aLUiEqy03YKiQ13qErWbGSyBl6CIpEtFSTAu/SAiOvUP1CVI1Fw1Ci956ZCXCiTJw7rGHoIu3QrTlRRZD5nuTs7TZcnmp7PvvENQ8z0+7zOf5/ky77w/BggUKFCgQP+zyMvDBaXYqJKWAUgB8/tUf6JdVmNu+RER8Ni1uc31q+pdFXwHoE0AQEQ/vDYswq/ZQD5TPMerajcDTdVQCaCeSoW6PPQszHc9hfI3F7awWu4C8+XfQcawFgrfaulrmvPWtjjflYGC8qVZpegrAIeqoVUA91LZ+AMvTcvgr2sgpxT3E/EbALurIY0IF5J98WHhjiXyHb+BXOZrnJjHsDYfAabbyexOOc1L4Nu+gbErn+vqYrF3AB9Zg2Mk1R8/I9ivL3zbN1AX29D9J5yARWgRRahbH/khq2Cuc/okgKt/xpi4Nzm441vNnfrMNxlgMBHTQ0N4RUPkUa1wK8nmmwxMZGZOgXBQXxTjMtZ6P/jmKcShjDFExK9F4JaSzNcZKCjFRgLajEkaIy9awG++zkAFWhrgqCmJwrOiBfzm6wxQiI5bJW1connRAn7z9d8A44BVklq/JHTsNskHvvHBfVZJFYodnsxMs8Z0EYxWEJqrQ58YGAlHuOdoT2LBRT3pfN1RIt85U2Jgq4tGjCoR0JHMxl86JfnB100hrt5+BNTAwItcpnjWKckPvmEf4LJgAQAIE/OT8Y7ZbfYp8vnGjczratMQjWnXHcal8w0GJCyXjNP2g/L5xin00XMB0F6H6tL5+o0MMs48bLum+8HXGVguq6MAlr3xMWU35AdfZyD9bM8iQI898Qlv7cb84JuO02qF7gMoifJZ40GnBNl8k4ETT5vnoeE8gJ8144mGWgYSH5xSZPMt78SpgfgoES4BcP2/k4HCSihyw02uTL6lAQBI9sWHQ+BjAE2uByfgeTkcTad7t39325Asvqtfi3ml2MbE7QBaAewCwACmABrXoA21ZBMTbhv/G/xAgQIFCvTv6hfaiJoHpVZbZgAAAABJRU5ErkJggg==")`,
      }}
      _before={{
        content: '""',
        position: 'absolute',
        zIndex: '-1',
        height: 'full',
        maxW: '640px',
        width: 'full',
        filter: 'blur(40px)',
        transform: 'scale(0.98)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        top: 0,
        left: 0,
      }}
    >
      <Flex
        direction={'column'}
        textAlign='left'
        justifyContent={'space-between'}
        w='full'
      >
        <FormControl id='newComment' isRequired isInvalid={isCommentTooLong}>
          <FormLabel>Comment</FormLabel>
          <Textarea
            value={newComment}
            onChange={({ target }) => setNewComment(target.value)}
            placeholder='Say something about this project...'
          />
          {isCommentTooLong ? (
            <FormErrorMessage>
              Comment should be between 10 & 500 characters.
            </FormErrorMessage>
          ) : (
            <FormHelperText>
              Comment should be between 10 & 500 characters.
            </FormHelperText>
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
            isDisabled={!canSubmit}
            onClick={() => onAddComment(newComment)}
          >
            Comment
          </Button>
        </Stack>
      </Flex>
    </Flex>
  )
}

export default NewComment
