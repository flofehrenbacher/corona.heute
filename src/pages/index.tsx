import { Box, Heading } from '@chakra-ui/layout'
import { css } from '@emotion/react'
import { DistrictSwiper } from 'components/district-swiper'
import { useMyDistricts } from 'hooks/use-my-districts'
import { useRouter } from 'next/router'
import React from 'react'
import { mediaQuery } from 'style/media-query'
import { mobileViewportGap } from 'style/tokens'
import Head from 'next/head'

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
      <Heading p={mobileViewportGap} as="h2" css={styles.title}>
        Meine Zahlen
      </Heading>
      <DistrictSwiper districts={myDistricts} />
    </Box>
  )
}

const styles = {
  title: css`
    ${mediaQuery.md} {
      text-align: center;
    }
  `,
}
