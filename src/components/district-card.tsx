import { CloseIcon, StarIcon } from '@chakra-ui/icons'
import { Box, FlexProps, Text } from '@chakra-ui/layout'
import { Flex, IconButton, theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import { useMyDistricts } from 'hooks/use-my-districts'
import React from 'react'

export const districtCardWidth = 280
export const districtCardHeight = districtCardWidth

interface DistrictCardProps extends FlexProps {
  ags: string
}
export function DistrictCard({ ags, ...props }: DistrictCardProps) {
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
      {...props}
    >
      <Box w="80%">
        <Text fontSize="larger">{district.county}</Text>
        <Text mt="2">Bundesland: {district.state}</Text>
        <Text>Einwohner: {district.population}</Text>
        <Text mt="2">7-Tage-Inzidenz: {Math.round(district.weekIncidence)}</Text>
        <Text>Neue Fälle: {district.delta.cases}</Text>
      </Box>
      <IconButton
        as="a"
        colorScheme="gray"
        aria-label="Search database"
        onClick={() => (myDistricts.includes(ags) ? removeDistrict(ags) : addDistrict(ags))}
        icon={
          <StarIcon
            color={myDistricts.includes(ags) ? undefined : 'white'}
            stroke={myDistricts.includes(ags) ? undefined : 'blackAlpha.600'}
          />
        }
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
}
