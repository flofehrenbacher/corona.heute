import { CloseIcon, StarIcon } from '@chakra-ui/icons'
import { AspectRatio, Box, Text } from '@chakra-ui/layout'
import { IconButton, theme, VStack } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import { useMyDistricts } from 'hooks/use-my-districts'
import React from 'react'

export const districtCardWidth = 352
export const districtCardHeight = Math.floor(352 * (9 / 16))

export function DistrictCard({ ags, ...props }: { ags: string }) {
  const { districts } = useCurrentRKIData()
  const { myDistricts, addDistrict, removeDistrict } = useMyDistricts()

  const district = districts[ags]

  if (!district) return <Box>Unbekannter Allgemeiner Gemeindeschlüssel: {ags}</Box>
  return (
    <AspectRatio ratio={16 / 9} w={districtCardWidth} flexShrink={0} {...props}>
      <VStack css={styles.container}>
        <Text fontSize="2xl" whiteSpace="nowrap" textOverflow="ellipsis">
          {district.county}
        </Text>
        <Text>7-Tage-Inzidenz: {Math.round(district.weekIncidence)}</Text>
        <Text>Einwohner: {district.population}</Text>
        <Text>Neue Fälle: {district.delta.cases}</Text>
        <IconButton
          css={styles.saveButton}
          as="a"
          colorScheme="gray"
          aria-label="Search database"
          onClick={() => (myDistricts.includes(ags) ? removeDistrict(ags) : addDistrict(ags))}
          icon={myDistricts.includes(ags) ? <CloseIcon /> : <StarIcon />}
        />
      </VStack>
    </AspectRatio>
  )
}

const styles = {
  container: css`
    border: ${theme.borders['1px']} ${theme.colors.blackAlpha[400]};
    border-radius: ${theme.radii['2xl']};
    position: relative;
  `,
  saveButton: css`
    position: absolute;
    top: ${theme.space[2]};
    right: ${theme.space[3]};
  `,
}
