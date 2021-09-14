import { useToast } from '@chakra-ui/toast'
import { useCallback } from 'react'

import { createLocalStorageStateHook } from 'use-local-storage-state'
import { AGS } from './use-current-rki-data'

const myDistrictsKey = 'my-districts'
const useDistricts = createLocalStorageStateHook<AGS[]>(myDistrictsKey, [])

export function useMyDistricts() {
  const [myDistricts, setMyDistricts] = useDistricts()
  const toast = useToast()

  const addDistrict = useCallback(
    (district: AGS) => {
      setMyDistricts((prev) => [district, ...(prev ?? [])])
      toast({
        title: 'Erfolgreich hinzugefügt',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    [setMyDistricts, toast],
  )

  const removeDistrict = useCallback(
    (district: AGS) => {
      const confirmation = confirm('Wirklich entfernen?')

      if (confirmation) {
        setMyDistricts((prev) => prev?.filter((d) => d !== district))
        toast({
          title: 'Erfolgreich entfernt',
          status: 'info',
          duration: 3000,
          isClosable: true,
        })
      }
    },
    [setMyDistricts, toast],
  )

  return { myDistricts: myDistricts ?? [], addDistrict, removeDistrict, setMyDistricts }
}
