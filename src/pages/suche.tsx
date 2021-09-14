import { Box, Center, Heading, Text } from '@chakra-ui/layout'
import { Input } from '@chakra-ui/react'
import { DistrictList } from 'components/district-swiper'
import { debounce } from 'debounce'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'

import { mobileViewportGap } from 'style/tokens'
import Head from 'next/head'
import { useState, useMemo, useEffect, ChangeEvent } from 'react'

export default function SearchPage() {
  const { districts } = useCurrentRKIData()

  const [searchTerm, setSearchTerm] = useState('')
  const [showNoResultsFound, setShowNoResultsFound] = useState(true)

  const searchResults = useMemo(
    () =>
      searchTerm.length > 1
        ? Object.values(districts).filter((d) =>
            d.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
          )
        : [],
    [districts, searchTerm],
  )

  useEffect(() => {
    setShowNoResultsFound(searchTerm.length > 1 && searchResults.length < 1)
  }, [searchTerm, searchResults])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.trim()
    setSearchTerm(value)
  }

  return (
    <Box>
      <Head>
        <title>Corona heute - Suche</title>
      </Head>
      <Heading px={mobileViewportGap} as="h2">
        Suche
      </Heading>
      <Box mt="4" px={mobileViewportGap}>
        <Input placeholder="Landkreis/Stadtkreis suchen" onChange={debounce(handleChange, 300)} />
      </Box>
      {showNoResultsFound ? (
        <Center>
          <Text>Keine Suchergebnisse gefunden</Text>
        </Center>
      ) : (
        <DistrictList mt="4" districts={searchResults.map((d) => d.ags)} />
      )}
    </Box>
  )
}
