import { Box, Heading } from '@chakra-ui/layout'
import { Map } from 'components/map'
import React from 'react'

export default function HomePage() {
  return (
    <Box p="3">
      <Heading as="h2">Deutschland</Heading>
      <Map />
    </Box>
  )
}
