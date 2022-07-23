import type { FunctionComponent } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { Link } from 'preact-router/match'
import { Constants, Storage } from "utils"

const keys = {
  DATABASES_STATUS: `DATABASES_STATUS`,
}

type Props = {
  selectedJurisdiction: Law.JursidictionCode,
}

const DatabaseStatus: FunctionComponent<Props> = ({ selectedJurisdiction }) => {
  const [databaseStatusString, setDatabaseStatusString] = useState(`0/0`)
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
    (async () => {
      const databasesStatus: typeof Constants.DEFAULT_DATABASES_STATUS = await Storage.get(keys.DATABASES_STATUS) || Constants.DEFAULT_DATABASES_STATUS
      const relevantDatabases  = databasesStatus[selectedJurisdiction]
      const totalDatabasesCount: number = Object.keys(relevantDatabases).length
      const enabledDatabasesCount: number = Object.entries(relevantDatabases).filter(([, enabled]) => enabled).length

      setEmpty(enabledDatabasesCount === 0)
      setDatabaseStatusString(`${
        enabledDatabasesCount
      }/${totalDatabasesCount}`)
    })()
  }, [selectedJurisdiction])

  return (
    <Link
      className={`px-3 py-1 text-sm bg-neutral-200 border border-solid border-neutral-400 rounded cursor-pointer flex justify-center items-center select-none ${
        empty ? `bg-red-200` : `bg-neutral-200`
      }`}
      href="/customise-database"
    >
      {databaseStatusString}
    </Link>
  )
}

export default DatabaseStatus