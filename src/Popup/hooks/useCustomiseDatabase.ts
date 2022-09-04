import { useState, useEffect, useCallback } from "preact/hooks"
import { Constants, Storage } from "utils"

const keys = {
  DATABASES_STATUS: `DATABASES_STATUS`,
  SELECTED_JURISDICTION: `POPUP_SELECTED_JURISDICTION`,
}

const useCustomiseDatabase = () => {
  const [selectedJurisdictionCode, setSelectedJurisdictionCode] = useState<Law.JurisdictionCode>(Constants.JURISDICTIONS.UK.id)
  const [databasesStatus, setDatabasesStatus] = useState<typeof Constants.DEFAULT_DATABASES_STATUS>(Constants.DEFAULT_DATABASES_STATUS)

  const toggleDatabase = useCallback(async (id: string) => {
    const newStatus = {
      ...databasesStatus,
      [selectedJurisdictionCode]: {
        ...databasesStatus[selectedJurisdictionCode],
        [id]: !databasesStatus[selectedJurisdictionCode][id],
      },
    }

    await Storage.set(keys.DATABASES_STATUS, newStatus)
    setDatabasesStatus(newStatus)
  }, [selectedJurisdictionCode, databasesStatus])

  useEffect(() => {
    (async () => {
      const jurisdictionCode = await Storage.get(keys.SELECTED_JURISDICTION)
      setSelectedJurisdictionCode(jurisdictionCode)

      const databaseStatus: typeof Constants.DEFAULT_DATABASES_STATUS = await Storage.get(keys.DATABASES_STATUS) || Constants.DEFAULT_DATABASES_STATUS
      setDatabasesStatus(databaseStatus)
    })()
  }, [])

  const selectedJurisdiction = Constants.JURISDICTIONS[selectedJurisdictionCode]

  return {
    databasesStatus,
    selectedJurisdiction,
    toggleDatabase,
  }
}

export default useCustomiseDatabase