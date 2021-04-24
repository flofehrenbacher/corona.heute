import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Link } from '@chakra-ui/layout'
import { theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'

export function DataReference() {
  return (
    <aside css={styles.aside}>
      <p>
        Alle Daten werden über die{' '}
        <Link color="teal.500" href="https://github.com/marlon360/rki-covid-api">
          rki-covid-api
          <ExternalLinkIcon mx="2px" />
        </Link>{' '}
        von Marlon Lückert bezogen.
      </p>
    </aside>
  )
}

const styles = {
  aside: css`
    background: ${theme.colors.blackAlpha[800]};
    color: ${theme.colors.whiteAlpha[800]};
    padding: ${theme.space[6]};
    text-align: center;
  `,
}
