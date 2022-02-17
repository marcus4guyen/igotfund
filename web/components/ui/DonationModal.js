import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import React, { useState } from 'react'

const DonationModal = ({ isOpen, onClose, onDonate }) => {
  const initialRef = React.useRef()

  const [amount, setAmount] = useState(1)
  const canDonate = amount >= 1

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialRef}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Donation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id='amount' isRequired isInvalid={!canDonate}>
            <FormLabel>Initial Amount</FormLabel>
            <Input
              type='number'
              ref={initialRef}
              value={amount}
              onChange={({ target }) => setAmount(target.value)}
            />
            {canDonate ? (
              <></>
            ) : (
              <FormErrorMessage>
                The minimum amount should be 0.1 NEAR.
              </FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant='outline'>
            Close
          </Button>
          <Button
            colorScheme='blue'
            onClick={() => onDonate(amount)}
            isDisabled={!canDonate}
          >
            Donate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DonationModal
