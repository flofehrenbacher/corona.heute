import axios from 'axios'
import { useQuery } from 'react-query'

export function useCurrentRKIData() {
  const { data, isLoading } = useQuery<{
    lastUpdate: string
    districts: Record<AGS, HistoryDistrict>
  } | null>(['current-data', new Date().toLocaleDateString('de')], getCurrentRKIData)

  return { isLoading, lastUpdate: data?.lastUpdate, districts: data?.districts ?? {} }
}

async function getCurrentRKIData(): Promise<{
  lastUpdate: string
  districts: Record<AGS, HistoryDistrict>
} | null> {
  const result = await axios.get<{ meta: Meta; data: Record<AGS, District> }>(
    'https://api.corona-zahlen.org/districts',
  )

  const historyResult = await axios.get<{
    meta: Meta
    data: Record<AGS, HistoryCases>
  }>('https://api.corona-zahlen.org/districts/history/cases/7')

  const weekIncidenceResult = await axios.get<{
    meta: Meta
    data: Record<AGS, HistoryWeekIncidence>
  }>('https://api.corona-zahlen.org/districts/history/incidence/7')

  const returnValue = {
    lastUpdate: result.data.meta.lastUpdate,
    districts: mergeDistrictResults(
      result.data.data,
      historyResult.data.data,
      weekIncidenceResult.data.data,
    ),
  }

  return returnValue
}

function mergeDistrictResults(
  districts: Record<AGS, District>,
  casesHistories: Record<AGS, HistoryCases>,
  weekIncidenceHistories: Record<AGS, HistoryWeekIncidence>,
) {
  const merged = Object.keys(districts).map((d) => {
    const caseHistory = casesHistories[d]
    const weekIncidenceHistory = weekIncidenceHistories[d]

    if (caseHistory?.history.length > 6 && weekIncidenceHistory?.history.length > 6) {
      const updated: HistoryDistrict = {
        ...districts[d],
        weekIncidence: Math.round(districts[d].weekIncidence),
        casesHistory: { value: caseHistory.history[0].cases, date: caseHistory.history[0].date },
        weekIncidenceHistory: {
          value: Math.round(weekIncidenceHistory.history[0].weekIncidence),
          date: weekIncidenceHistory.history[0].date,
        },
      }
      return updated
    } else {
      return districts[d]
    }
  })

  const mergedDistricts: Record<AGS, HistoryDistrict> = {}

  merged.forEach((d) => {
    mergedDistricts[d.ags] = d
  })

  return mergedDistricts
}

interface HistoryWeekIncidence {
  history: { weekIncidence: number; date: string }[]
}

interface HistoryCases {
  history: { cases: number; date: string }[]
}
interface Meta {
  source: string
  contact: string
  info: string
  lastUpdate: string
  lastCheckedForUpdate: string
}

/** Allgemeiner Gemeindeschlüssel */
export type AGS = string
interface District {
  ags: AGS
  name: string
  county: string
  state: string
  population: number
  deaths: number
  casesPerWeek: number
  deathsPerWeek: number
  stateAbbreviation: string
  recovered: number
  weekIncidence: number
  casesPer100k: number
  delta: { cases: number; deaths: number; revocered: number }
}

export interface HistoryDistrict extends District {
  casesHistory?: { value: number; date: string }
  weekIncidenceHistory?: { value: number; date: string }
}
