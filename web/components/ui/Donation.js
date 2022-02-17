import { Flex, useColorModeValue, chakra } from '@chakra-ui/react'
import { asNear, formatDate } from '../../near/utils'

const Donation = ({ created_at, donor, amount }) => {
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
    >
      <Flex
        direction={'column'}
        textAlign='left'
        justifyContent={'space-between'}
      >
        <chakra.p
          fontFamily={'Inter'}
          fontWeight='medium'
          fontSize={'15px'}
          pb={4}
        >
          {donor} donated&nbsp;
          <chakra.span fontFamily={'Work Sans'} fontWeight='bold' fontSize={14}>
            {asNear(amount)}
          </chakra.span>
        </chakra.p>

        <chakra.span
          fontFamily={'Inter'}
          fontWeight='medium'
          color={'gray.500'}
        >
          {' '}
          {formatDate(created_at)}
        </chakra.span>
      </Flex>
    </Flex>
  )
}

export default Donation
