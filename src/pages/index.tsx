import { Box, Heading } from '@chakra-ui/layout'
import { DistrictList } from 'components/district-swiper'
import { BottomDrawer } from 'components/drawer'
import { MoveDistricts } from 'components/move-districts'
import { useMyDistricts } from 'hooks/use-my-districts'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { mobileViewportGap } from 'style/tokens'

export default function HomePage() {
  const { myDistricts } = useMyDistricts()
  const { push } = useRouter()

  useEffect(() => {
    if (myDistricts.length < 1) {
      push('/suche')
    }
  }, [myDistricts.length, push])

  return (
    <Box px={mobileViewportGap}>
      <Head>
        <title>Corona heute - Zahlen</title>
      </Head>
      <Heading as="h2" textAlign="center">
        Meine Zahlen
      </Heading>
      <BottomDrawer mt="4" buttonText="Reihenfolge verändern" headline="Reihenfolge verändern">
        <MoveDistricts />
      </BottomDrawer>
      <DistrictList mt="4" districts={myDistricts} />
    </Box>
  )
}
