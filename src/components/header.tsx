import { ArrowBackIcon, Search2Icon } from '@chakra-ui/icons'
import { Heading, Text } from '@chakra-ui/layout'
import { IconButton, Spinner } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'
import { css } from '@emotion/react'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export function Header(props: unknown) {
  const { lastUpdate } = useCurrentRKIData()
  const { pathname } = useRouter()

  return (
    <>
      <header css={styles.header} {...props}>
        <Link href="/">
          <Heading as="h1" color="whiteAlpha.800">
            Aktuelle Coronazahlen
          </Heading>
        </Link>

        {pathname.includes('suche') ? (
          <Link href="/">
            <IconButton
              as="a"
              colorScheme="blue"
              aria-label="Search database"
              icon={<ArrowBackIcon />}
            />
          </Link>
        ) : (
          <Link href="/suche">
            <IconButton
              as="a"
              colorScheme="blue"
              aria-label="Search database"
              icon={<Search2Icon />}
            />
          </Link>
        )}
      </header>
      <aside css={styles.aside}>
        <Text color="whiteAlpha.700">
          Daten zuletzt aktualisiert am {lastUpdate ? formatLastUpdate(lastUpdate) : null}
        </Text>
      </aside>
    </>
  )
}

const styles = {
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${theme.colors.blue[600]};
    padding: ${theme.space[3]};
  `,
  aside: css`
    background-color: ${theme.colors.blue[400]};
    padding: ${theme.space[1]} ${theme.space[3]};
  `,
}

function formatLastUpdate(lastUpdate: string | undefined) {
  if (!lastUpdate) return null

  return new Date(lastUpdate).toLocaleDateString('de', { hour: '2-digit', minute: '2-digit' })
}
