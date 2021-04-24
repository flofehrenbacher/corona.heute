import { Box, Heading } from '@chakra-ui/layout'
import theme from '@chakra-ui/theme'
import { css } from '@emotion/react'
import { DistrictCard, districtCardHeight } from 'components/district-card'
import { useMyDistricts } from 'hooks/use-my-districts'
import { useRouter } from 'next/router'
import React from 'react'
import { mediaQuery } from 'style/media-query'

const viewportGap = 4
export default function HomePage() {
  const { myDistricts } = useMyDistricts()
  const { push } = useRouter()

  React.useEffect(() => {
    if (myDistricts.length < 1) {
      alert('Wähle mindestens eine Region')
      push('/suche')
    }
  }, [myDistricts.length])

  return (
    <Box>
      <Heading p={viewportGap} as="h2">
        Meine Zahlen
      </Heading>
      <Box mt="5" css={styles.swipeWrapper}>
        <Box css={styles.list}>
          {myDistricts.map((ags) => {
            return <DistrictCard ags={ags} />
          })}
        </Box>
      </Box>
    </Box>
  )
}

const maxScrollbarHeight = 30
const styles = {
  swipeWrapper: css`
    height: ${districtCardHeight}px;
    overflow-y: hidden;
    /* fix "iOS disappearing of elements while scrolling"-bug (see https://jira.swmh.de/browse/SZDE-7747) */
    transform: translate3d(0, 0, 0);

    ${mediaQuery.md} {
      overflow-y: initial;
      height: auto;
    }
  `,
  list: css`
    box-sizing: content-box; /* needs to be 'content-box' in order for the padding-bottom solution to work */
    display: flex;
    list-style-type: none;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: ${maxScrollbarHeight}px;

    > *:first-of-type {
      margin-left: ${theme.space[viewportGap]};
    }

    > * {
      margin-right: ${theme.space[5]};
      margin-bottom: ${theme.space[5]};

      :last-of-type {
        margin-right: ${theme.space[viewportGap]};
      }
      box-sizing: border-box; /* reset box-sizing again */
    }

    ${mediaQuery.md} {
      flex-wrap: wrap;

      > *:first-of-type {
        margin-left: 0;
      }
    }
  `,
}
