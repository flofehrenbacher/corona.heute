import { ArrowDownIcon, ArrowForwardIcon, ArrowUpIcon, StarIcon } from '@chakra-ui/icons'
import { Box, FlexProps, Text, TextProps } from '@chakra-ui/layout'
import { Flex, IconButton, theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import { useMyDistricts } from 'hooks/use-my-districts'
import React from 'react'

export const districtCardWidth = 300
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
        <Text mb="2">Einwohner: {district.population}</Text>
        <CompareLastWeek
          title="7-Tage-Inzidenz"
          current={district.weekIncidence}
          yesterday={district.weekIncidenceYesterday}
        />
        <CompareLastWeek
          mt="1"
          title="Neue Fälle"
          current={district.delta.cases}
          yesterday={district.casesYesterday}
        />
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

interface CompareLastWeekProps extends TextProps {
  title: string
  current: number
  yesterday?: number
}
export function CompareLastWeek({ current, yesterday, title, ...props }: CompareLastWeekProps) {
  const sinceYesterday = yesterday ? current - yesterday : NaN

  const CompareLastWeek = yesterday ? (
    <>
      ({sinceYesterday}{' '}
      {sinceYesterday === 0 ? (
        <ArrowForwardIcon />
      ) : sinceYesterday > 0 ? (
        <ArrowUpIcon color="red.600" />
      ) : (
        <ArrowDownIcon color="green.600" />
      )}
      )<Text fontSize="small">Vergleich zu letzter Woche</Text>
    </>
  ) : null

  return (
    <Text {...props}>
      {title}: {current}
      <br />
      {CompareLastWeek}
    </Text>
  )
}
