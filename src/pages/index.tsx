import { Box, Heading } from '@chakra-ui/layout'
import { DistrictSwiper } from 'components/district-swiper'
import { useMyDistricts } from 'hooks/use-my-districts'
import { useRouter } from 'next/router'
import React from 'react'
import { mobileViewportGap } from 'style/tokens'

export default function HomePage() {
  const { myDistricts } = useMyDistricts()
  const { push } = useRouter()

  React.useEffect(() => {
    if (myDistricts.length < 1) {
      push('/suche')
    }
  }, [myDistricts.length])

  return (
    <Box>
      <Heading p={mobileViewportGap} as="h2">
        Meine Zahlen
      </Heading>
      <DistrictSwiper districts={myDistricts} />
    </Box>
  )
}
