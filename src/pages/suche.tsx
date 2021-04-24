import { Box, Center, Heading, Text } from '@chakra-ui/layout'
import { Input, theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { DistrictCard } from 'components/district-card'
import { debounce } from 'debounce'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import React from 'react'

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
    <Box p="4">
      <Heading as="h2">Suche</Heading>
      <Input mt="4" mb="4" placeholder="Region suchen" onChange={debounce(handleChange, 300)} />
      {showNoResultsFound ? (
        <Center>
          <Text>Keine Suchergebnisse gefunden</Text>
        </Center>
      ) : (
        <Box css={styles.searchResults}>
          {searchResults.map((district) => {
            return <DistrictCard key={district.ags} css={{ margin: '0 auto' }} ags={district.ags} />
          })}
        </Box>
      )}
    </Box>
  )
}

const styles = {
  searchResults: css`
    > * {
      :not(:first-of-type) {
        margin-top: ${theme.space[4]};
      }
    }
  `,
}
