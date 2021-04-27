import axios from 'axios'
import { isDev } from 'config'
import { developmentData } from 'development-data'
import { useQuery } from 'react-query'

export function useCurrentRKIData() {
  const { data, isLoading } = useQuery<{
    lastUpdate: string
    districts: Record<AGS, HistoryDistrict>
  } | null>(['current-data', new Date().toLocaleDateString('de')], getCurrentRKIData)

  return { isLoading, lastUpdate: data?.lastUpdate, districts: data?.districts ?? {} }
}

export async function getCurrentRKIData(): Promise<{
  lastUpdate: string
  districts: Record<AGS, HistoryDistrict>
} | null> {
  if (isDev) return developmentData

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

    if (caseHistory?.history.length > 0 && weekIncidenceHistory?.history.length > 0) {
      const updated: HistoryDistrict = {
        ...districts[d],
        weekIncidence: Math.round(districts[d].weekIncidence),
        casesHistory: caseHistory.history,
        weekIncidenceHistory: weekIncidenceHistory.history.map(({ date, weekIncidence }) => ({
          date,
          weekIncidence: Math.round(weekIncidence),
        })),
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
  cases: number
  casesPerWeek: number
  deathsPerWeek: number
  stateAbbreviation: string
  recovered: number
  weekIncidence: number
  casesPer100k: number
  delta: { cases: number; deaths: number; recovered: number }
}

export interface HistoryDistrict extends District {
  casesHistory?: {
    cases: number
    date: string
  }[]
  weekIncidenceHistory?: {
    weekIncidence: number
    date: string
  }[]
}
