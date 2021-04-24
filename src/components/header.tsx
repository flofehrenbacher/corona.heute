import { Search2Icon } from '@chakra-ui/icons'
import { Heading } from '@chakra-ui/layout'
import { IconButton } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'
import { css } from '@emotion/react'
import React from 'react'

export function Header(props: unknown) {
  return (
    <header css={styles.header} {...props}>
      <Heading as="h1" color="whiteAlpha.800">
        Aktuelle Coronazahlen
      </Heading>
      <IconButton colorScheme="blue" aria-label="Search database" icon={<Search2Icon />} />
    </header>
  )
}

const styles = {
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${theme.colors.blue[600]};
    padding: ${theme.space[3]};
    color: ${theme.colors.blackAlpha[900]};
  `,
}
