import { Box, Heading } from '@chakra-ui/layout'
import { css } from '@emotion/react'
import { DistrictSwiper } from 'components/district-swiper'
import { useMyDistricts } from 'hooks/use-my-districts'
import { useRouter } from 'next/router'
import React from 'react'
import { mediaQuery } from 'style/media-query'
import { mobileViewportGap } from 'style/tokens'
import Head from 'next/head'
import { MoveDistricts } from 'components/move-districts'

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
      <Head>
        <title>Corona heute - Zahlen</title>
      </Head>
      <Heading p={mobileViewportGap} as="h2" textAlign="center">
        Meine Zahlen
      </Heading>
      <DistrictSwiper districts={myDistricts} />
      <Heading p={mobileViewportGap} as="h2" textAlign="center" fontSize="2xl">
        Verschieben
      </Heading>
      <Box px={mobileViewportGap}>
        <MoveDistricts />
      </Box>
    </Box>
  )
}
