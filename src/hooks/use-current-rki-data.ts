import axios from 'axios'
import { useQuery } from 'react-query'

export function useCurrentRKIData() {
  const { data, isLoading } = useQuery<{
    lastUpdate: string
    districts: Record<AGS, District & { casesYesterday?: number; weekIncidenceYesterday?: number }>
  } | null>(['current-data', new Date().toLocaleDateString('de')], getCurrentRKIData)

  return { isLoading, lastUpdate: data?.lastUpdate, districts: data?.districts ?? {} }
}

async function getCurrentRKIData(): Promise<{
  lastUpdate: string
  districts: Record<AGS, District & { casesYesterday?: number; weekIncidenceYesterDay?: number }>
} | null> {
  const result = await axios.get<{ meta: Meta; data: Record<AGS, District> }>(
    'https://api.corona-zahlen.org/districts',
  )

  const historyResult = await axios.get<{
    meta: Meta
    data: Record<AGS, { history: { cases: number }[] }>
  }>('https://api.corona-zahlen.org/districts/history/cases/7')

  const weekIncidenceResult = await axios.get<{
    meta: Meta
    data: Record<AGS, { history: { weekIncidence: number }[] }>
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
  casesHistories: Record<AGS, { history: { cases: number }[] }>,
  weekIncidenceHistories: Record<AGS, { history: { weekIncidence: number }[] }>,
) {
  const merged = Object.keys(districts).map((d) => {
    const caseHistory = casesHistories[d]
    const weekIncidenceHistory = weekIncidenceHistories[d]

    if (caseHistory?.history.length > 6 && weekIncidenceHistory?.history.length > 6) {
      return {
        ...districts[d],
        weekIncidence: Math.round(districts[d].weekIncidence),
        casesYesterday: caseHistory.history[0].cases,
        weekIncidenceYesterday: Math.round(weekIncidenceHistory.history[0].weekIncidence),
      }
    } else {
      return districts[d]
    }
  })

  const mergedDistricts: Record<AGS, District & { casesYesterday?: number }> = {}

  merged.forEach((d) => {
    mergedDistricts[d.ags] = d
  })

  return mergedDistricts
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
