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
  const today = new Date()
  const [month, day, year] = [today.getMonth(), today.getDate(), today.getFullYear()]
  const lastWeekDates = Array.from({ length: 7 })
    .map((_, i) => new Date(year, month, day - (i + 1)))
    .reverse()

  const yScaleWeekIncidence = scaleLinear()
    .domain([0, Math.max(...weekIncidenceHistory.map((h) => h.weekIncidence))])
    .rangeRound([height, 0])

  const yScaleCases = scaleLinear()
    .domain([0, Math.max(...casesHistory.map((h) => h.cases))])
    .rangeRound([height, 0])

  const barWidth = Math.floor(width / lastWeekDates.length)

  const { lineColor, lineValue } = getInterestingLine(
    Math.max(...weekIncidenceHistory.map((d) => d.weekIncidence)),
  )

  return (
    <div>
      <Heading fontSize="small">Verlauf</Heading>
      <Heading fontSize="smaller" my={2}>
        7-Tage-Inzidenz
        <br />
        (rot = 100, orange = 50, gelb = 35, grün = 10)
      </Heading>
      <svg width={width} height={height}>
        {lastWeekDates.map((d, i) => (
          <Tooltip
            key={d.toISOString()}
            placement="top"
            label={`7-Tage-Inzidenz am ${new Date(d).toLocaleDateString(
              'de',
            )}: ${findWeekIncidenceOfDate(weekIncidenceHistory, d)}`}
          >
            <rect
              fill={theme.colors.blue[700]}
              key={i}
              x={i * barWidth}
              y={yScaleWeekIncidence(findWeekIncidenceOfDate(weekIncidenceHistory, d))}
              width={barWidth - 2}
              height={
                height - yScaleWeekIncidence(findWeekIncidenceOfDate(weekIncidenceHistory, d))
              }
            />
          </Tooltip>
        ))}
        <line
          x1={0}
          x2={width}
          y1={yScaleWeekIncidence(lineValue)}
          y2={yScaleWeekIncidence(lineValue)}
          stroke={lineColor}
          strokeWidth={2}
        />
      </svg>
      <Heading fontSize="smaller" my={2}>
        Neue Fälle
      </Heading>
      <svg width={width} height={height}>
        {casesHistory.map((d, i) => (
          <Tooltip
            key={d.date}
            placement="top"
            label={`Neue Fälle am ${new Date(d.date).toLocaleDateString('de')}: ${d.cases}`}
          >
            <rect
              fill={theme.colors.purple[700]}
              key={i}
              x={i * barWidth}
              y={yScaleCases(d.cases)}
              width={barWidth - 2}
              height={height - yScaleCases(d.cases)}
            />
          </Tooltip>
        ))}
      </svg>
    </div>
  )
}

function getInterestingLine(maxInWeek: number): { lineValue: number; lineColor: string } {
  if (maxInWeek < 35) {
    return { lineValue: 10, lineColor: theme.colors.green[500] }
  }
  if (maxInWeek < 50) {
    return { lineValue: 35, lineColor: theme.colors.yellow[300] }
  }
  if (maxInWeek < 100) {
    return { lineValue: 50, lineColor: theme.colors.orange[500] }
  }
  return { lineValue: 100, lineColor: theme.colors.red[500] }
}

function findWeekIncidenceOfDate(
  weekIncidenceHistory: NonNullable<HistoryDistrict['weekIncidenceHistory']>,
  dateOfInterest: Date,
) {
  return (
    weekIncidenceHistory.find(({ date }) => new Date(date).getDate() === dateOfInterest.getDate())
      ?.weekIncidence ?? 0
  )
}
