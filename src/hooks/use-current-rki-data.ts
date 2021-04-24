import axios from 'axios'
import { useQuery } from 'react-query'

export function useCurrentRKIData() {
  const { data, isLoading } = useQuery<{
    lastUpdate: string
    districts: Record<AGS, District>
  } | null>(['current-data', new Date().toLocaleDateString('de')], getCurrentRKIData)

  return { isLoading, lastUpdate: data?.lastUpdate, districts: data?.districts ?? {} }
}

async function getCurrentRKIData(): Promise<{
  lastUpdate: string
  districts: Record<AGS, District>
} | null> {
  const result = await axios.get<{ meta: Meta; data: Record<AGS, District> }>(
    'https://api.corona-zahlen.org/districts',
  )

  if (result.status === 200) {
    return { lastUpdate: result.data.meta.lastUpdate, districts: result.data.data }
  }

  return null
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
