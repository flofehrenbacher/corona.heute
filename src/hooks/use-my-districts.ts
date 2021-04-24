import React from 'react'
import useLocalStorageState, { createLocalStorageStateHook } from 'use-local-storage-state'
import { AGS } from './use-current-rki-data'

const myDistrictsKey = 'my-districts'
const useDistricts = createLocalStorageStateHook<AGS[]>(myDistrictsKey, [])

export function useMyDistricts() {
  const [myDistricts, setMyDistricts] = useDistricts()

  const addDistrict = React.useCallback((district: AGS) => {
    setMyDistricts((prev) => [district, ...(prev ?? [])])
  }, [])

  const removeDistrict = React.useCallback((district: AGS) => {
    setMyDistricts((prev) => prev?.filter((d) => d !== district))
  }, [])

  return { myDistricts: myDistricts ?? [], addDistrict, removeDistrict }
}
