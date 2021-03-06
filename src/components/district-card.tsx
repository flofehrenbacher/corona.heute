import {
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
  InfoIcon,
  StarIcon,
  TimeIcon,
} from '@chakra-ui/icons'
import { Box, FlexProps, Text, TextProps, VStack } from '@chakra-ui/layout'
import { Flex, IconButton, theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import { useMyDistricts } from 'hooks/use-my-districts'
import { WeekChart } from './week-chart'
import { last, head } from 'ramda'
import { useState } from 'react'

interface DistrictCardProps extends FlexProps {
  ags: string
}
export function DistrictCard({ ags, ...props }: DistrictCardProps) {
  const { districts } = useCurrentRKIData()
  const { myDistricts, addDistrict, removeDistrict } = useMyDistricts()

  const district = districts[ags]

  const [view, setView] = useState<'chart' | 'overview'>('overview')
  function toggleView() {
    setView((prev) => (prev === 'chart' ? 'overview' : 'chart'))
  }

  const weekIncidenceLastWeek = head(district.weekIncidenceHistory ?? [])
  const casesLastWeek = head(district.casesHistory ?? [])

  const weekIncidenceCurrent = last(district.weekIncidenceHistory ?? [])
  const casesCurrent = last(district.casesHistory ?? [])

  if (!district) return <Box>Unbekannter Allgemeiner Gemeindeschlüssel: {ags}</Box>
  return (
    <Flex justify="space-between" css={styles.container} align="start" p="4" {...props}>
      <Box w="90%">
        <Text fontSize="larger">{district.county}</Text>
        {view === 'overview' ? (
          <>
            <Text mt="2">Bundesland: {district.state}</Text>
            <Text mb="2">Einwohner: {district.population}</Text>
            <CompareLastWeek
              title="7-Tage-Inzidenz"
              current={
                weekIncidenceCurrent
                  ? { value: weekIncidenceCurrent.weekIncidence, date: weekIncidenceCurrent.date }
                  : undefined
              }
              lastWeek={
                weekIncidenceLastWeek
                  ? { value: weekIncidenceLastWeek.weekIncidence, date: weekIncidenceLastWeek.date }
                  : undefined
              }
            />
            <CompareLastWeek
              mt="1"
              title="Neue Fälle"
              current={
                casesCurrent ? { value: casesCurrent.cases, date: casesCurrent.date } : undefined
              }
              lastWeek={
                casesLastWeek ? { value: casesLastWeek.cases, date: casesLastWeek.date } : undefined
              }
            />
          </>
        ) : (
          <WeekChart
            width={200}
            height={80}
            casesHistory={[...(district.casesHistory ?? [])]}
            weekIncidenceHistory={[...(district.weekIncidenceHistory ?? [])]}
          />
        )}
      </Box>
      <VStack>
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
        <IconButton
          as="a"
          colorScheme="gray"
          aria-label="Search database"
          onClick={toggleView}
          icon={view === 'chart' ? <InfoIcon /> : <TimeIcon />}
        />
      </VStack>
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
  current?: { value: number; date: string }
  lastWeek?: { value: number; date: string }
}
export function CompareLastWeek({ current, lastWeek, title, ...props }: CompareLastWeekProps) {
  const sinceLastWeek = lastWeek && current ? current.value - lastWeek.value : NaN

  const CompareLastWeek = lastWeek ? (
    <>
      <Text fontSize="smaller">
        {sinceLastWeek}{' '}
        {sinceLastWeek === 0 ? (
          <ArrowForwardIcon />
        ) : sinceLastWeek > 0 ? (
          <ArrowUpIcon color="red.600" />
        ) : (
          <ArrowDownIcon color="green.600" />
        )}{' '}
        (am {new Date(lastWeek.date).toLocaleDateString('de')} waren es {lastWeek.value})
      </Text>
    </>
  ) : null

  return (
    <Text {...props}>
      {title}: {current?.value} ({current ? new Date(current.date).toLocaleDateString('de') : ''})
      {CompareLastWeek}
    </Text>
  )
}
