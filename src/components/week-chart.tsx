import { Heading, theme, Tooltip } from '@chakra-ui/react'
import { scaleLinear } from 'd3-scale'
import { HistoryDistrict } from 'hooks/use-current-rki-data'
import * as React from 'react'

interface Props {
  casesHistory: NonNullable<HistoryDistrict['casesHistory']>
  weekIncidenceHistory: NonNullable<HistoryDistrict['weekIncidenceHistory']>
  width: number
  height: number
}

export function WeekChart({ width, height, casesHistory, weekIncidenceHistory }: Props) {
  const yScaleWeekIncidence = scaleLinear()
    .domain([0, Math.max(...weekIncidenceHistory.map((h) => h.weekIncidence))])
    .rangeRound([height, 0])

  const yScaleCases = scaleLinear()
    .domain([0, Math.max(...casesHistory.map((h) => h.cases))])
    .rangeRound([height, 0])

  const barWidthWeekIncidence = Math.floor(width / casesHistory.length)
  const barWidthCases = Math.floor(width / weekIncidenceHistory.length)

  return (
    <div>
      <Heading fontSize="small">Verlauf (inklusive heute)</Heading>
      <Heading fontSize="smaller" my={2}>
        7-Tage-Inzidenz
      </Heading>
      <svg width={width} height={height}>
        {weekIncidenceHistory.map((d, i) => (
          <Tooltip
            label={`7-Tage-Inzidenz am ${new Date(d.date).toLocaleDateString('de')}: ${
              d.weekIncidence
            }`}
          >
            <rect
              fill={theme.colors.blue[700]}
              key={i}
              x={i * barWidthWeekIncidence}
              y={yScaleWeekIncidence(d.weekIncidence)}
              width={barWidthWeekIncidence - 1}
              height={height - yScaleWeekIncidence(d.weekIncidence)}
            />
          </Tooltip>
        ))}
      </svg>
      <Heading fontSize="smaller" my={2}>
        Neue Fälle
      </Heading>
      <svg width={width} height={height}>
        {casesHistory.map((d, i) => (
          <Tooltip label={`Neue Fälle am ${new Date(d.date).toLocaleDateString('de')}: ${d.cases}`}>
            <rect
              fill={theme.colors.purple[700]}
              key={i}
              x={i * barWidthCases}
              y={yScaleCases(d.cases)}
              width={barWidthCases - 1}
              height={height - yScaleCases(d.cases)}
            />
          </Tooltip>
        ))}
      </svg>
    </div>
  )
}
