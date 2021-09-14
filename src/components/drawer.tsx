import { CloseIcon } from '@chakra-ui/icons'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FlexProps,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import { ReactNode } from 'react'

interface BottomDrawerProps extends FlexProps {
  children: ReactNode
  buttonText: string
  headline: string
}
export function BottomDrawer({ children, buttonText, headline, ...props }: BottomDrawerProps) {
  const { onClose, onOpen, isOpen } = useDisclosure()

  return (
    <Flex justifyContent="flex-end" {...props}>
      <Button colorScheme="gray" size="sm" onClick={onOpen}>
        {buttonText}
      </Button>
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      <Drawer autoFocus={false} placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        {/* transform of 0 breaks beautiful dnd... */}
        <DrawerContent css={{ transform: 'none !important' }}>
          <DrawerHeader
            borderBottomWidth="1px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            {headline}
            <IconButton
              as="a"
              colorScheme="gray"
              aria-label="Search database"
              onClick={() => onClose()}
              icon={<CloseIcon />}
            />
          </DrawerHeader>
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}
