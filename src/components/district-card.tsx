import { CloseIcon, StarIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/layout'
import { Flex, IconButton, theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import { useMyDistricts } from 'hooks/use-my-districts'
import React from 'react'

const ratio = 3 / 4
export const districtCardWidth = 280
export const districtCardHeight = Math.ceil(districtCardWidth * ratio)

export function DistrictCard({ ags, ...props }: { ags: string }) {
  const { districts } = useCurrentRKIData()
  const { myDistricts, addDistrict, removeDistrict } = useMyDistricts()

  const district = districts[ags]

  if (!district) return <Box>Unbekannter Allgemeiner Gemeindeschlüssel: {ags}</Box>
  return (
    <Flex
      justify="space-between"
      css={styles.container}
      w={districtCardWidth}
      h={districtCardHeight}
      align="start"
      p="4"
    >
      <Box w="80%">
        <Text fontSize="larger" whiteSpace="nowrap" textOverflow="ellipsis" css={styles.title}>
          {district.county}
        </Text>
        <Text>7-Tage-Inzidenz: {Math.round(district.weekIncidence)}</Text>
        <Text>Einwohner: {district.population}</Text>
        <Text>Neue Fälle: {district.delta.cases}</Text>
      </Box>
      <IconButton
        as="a"
        colorScheme="gray"
        aria-label="Search database"
        onClick={() => (myDistricts.includes(ags) ? removeDistrict(ags) : addDistrict(ags))}
        icon={myDistricts.includes(ags) ? <CloseIcon /> : <StarIcon />}
      />
    </Flex>
  )
}

const styles = {
  container: css`
    border: ${theme.borders['1px']} ${theme.colors.blackAlpha[400]};
    border-radius: ${theme.radii['2xl']};
    position: relative;
    overflow: hidden;
  `,
  title: css`
    overflow: hidden;
    text-overflow: ellipsis;
  `,
}
