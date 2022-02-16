import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useCallback } from 'react'
import NextLink from 'next/link'
import {
  Avatar,
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import {
  FiBell,
  FiChevronDown,
  FiHome,
  FiMenu,
  FiSettings,
  FiTrendingUp,
} from 'react-icons/fi'

import { initFundContract } from '../../redux/actions/contract'
import { signIn, signOut } from '../../redux/actions/authentication'
import Intro from '../Intro'

const LinkItems = [
  { name: 'Home', icon: FiHome },
  { name: 'Trending', icon: FiTrendingUp },
  { name: 'Settings', icon: FiSettings },
]

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentUser } = useSelector((state) => state.near)

  useEffect(() => {
    dispatch(initFundContract())
  }, [dispatch])

  return (
    <Box minH='100vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobile */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p='4'>
        {currentUser ? children : <Intro />}
      </Box>
    </Box>
  )
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition='3s ease'
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <NextLink href='/'>
          <Text
            fontSize='2xl'
            fontFamily='monospace'
            fontWeight='bold'
            cursor='pointer'
          >
            igotfund
          </Text>
        </NextLink>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <NextLink href='/'>
      <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <Flex
          align='center'
          p='4'
          mx='4'
          borderRadius='lg'
          role='group'
          cursor='pointer'
          _hover={{
            bg: 'cyan.400',
            color: 'white',
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr='4'
              fontSize='16'
              _groupHover={{ color: 'white' }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </NextLink>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  const dispatch = useDispatch()
  const { currentUser, walletConnection, nearConfig } = useSelector(
    (state) => state.near
  )

  const signInHandler = useCallback(() =>
    dispatch(signIn({ wallet: walletConnection, nearConfig }))
  )

  const signOutHandler = useCallback(() => {
    dispatch(signOut({ wallet: walletConnection }))
    window.location.replace(window.location.origin + window.location.pathname)
  })

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height='20'
      alignItems='center'
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant='outline'
        aria-label='open menu'
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize='2xl'
        fontFamily='monospace'
        fontWeight='bold'
      >
        igotfund
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size='lg'
          variant='ghost'
          aria-label='open menu'
          icon={<FiBell />}
        />

        <Flex
          alignItems={'center'}
          style={{ display: currentUser ? 'flex' : 'none' }}
        >
          <Menu>
            <MenuButton
              py={2}
              transition='all 0.3s'
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size={'sm'}
                  src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems='flex-start'
                  spacing='1px'
                  ml='2'
                >
                  <Text fontSize='sm'>{currentUser?.accountId}</Text>
                  <Text fontSize='xs' color='gray.600'>
                    testnet
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>

            <MenuList
              bg={useColorModeValue('white', 'gray/900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem onClick={signOutHandler}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Flex
          alignItems={'center'}
          style={{ display: !currentUser ? 'flex' : 'none' }}
        >
          <Link
            fontSize='sm'
            pr='3'
            style={{
              textDecoration: 'none',
            }}
            onClick={signInHandler}
          >
            Sign in
          </Link>
        </Flex>
      </HStack>
    </Flex>
  )
}

export default Layout
