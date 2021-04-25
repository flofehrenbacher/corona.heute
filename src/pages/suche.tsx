import { Box, Center, Heading, Text } from '@chakra-ui/layout'
import { Input } from '@chakra-ui/react'
import { DistrictSwiper } from 'components/district-swiper'
import { debounce } from 'debounce'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import React from 'react'
import { mobileViewportGap } from 'style/tokens'

export default function HomePage() {
  const { districts } = useCurrentRKIData()

  const [searchTerm, setSearchTerm] = React.useState('')
  const [showNoResultsFound, setShowNoResultsFound] = React.useState(true)

  const searchResults =
    searchTerm.length > 1
      ? Object.values(districts).filter((d) =>
          d.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
        )
      : []

  React.useEffect(() => {
    setShowNoResultsFound(searchTerm.length > 1 && searchResults.length < 1)
  }, [searchTerm, searchResults])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.trim()
    setSearchTerm(value)
  }

  return (
    <Box>
      <Heading p={mobileViewportGap} as="h2">
        Suche
      </Heading>
      <Box px={mobileViewportGap}>
        <Input placeholder="Landkreis/Stadtkreis suchen" onChange={debounce(handleChange, 300)} />
      </Box>
      {showNoResultsFound ? (
        <Center>
          <Text>Keine Suchergebnisse gefunden</Text>
        </Center>
      ) : (
        <DistrictSwiper districts={searchResults.map((d) => d.ags)} />
      )}
    </Box>
  )
}
