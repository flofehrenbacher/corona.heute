import { Box, theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { AGS } from 'hooks/use-current-rki-data'
import React from 'react'
import { mediaQuery } from 'style/media-query'
import { mobileViewportGap } from 'style/tokens'
import { DistrictCard, districtCardHeight } from './district-card'

interface DistrictSwiperProps {
  districts: AGS[]
}
export function DistrictSwiper({ districts, ...props }: DistrictSwiperProps) {
  return (
    <Box mt="5" css={styles.swipeWrapper} {...props}>
      <Box css={styles.list}>
        {districts.map((ags) => {
          return <DistrictCard key={ags} ags={ags} flexShrink={0} />
        })}
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
      margin-left: ${theme.space[mobileViewportGap]};
    }

    > * {
      margin-right: ${theme.space[5]};
      margin-bottom: ${theme.space[5]};

      :last-of-type {
        margin-right: ${theme.space[mobileViewportGap]};
      }
      box-sizing: border-box; /* reset box-sizing again */
    }

    ${mediaQuery.md} {
      flex-wrap: wrap;
      justify-content: center;

      > *:first-of-type {
        margin-left: 0;
      }
    }
  `,
}
