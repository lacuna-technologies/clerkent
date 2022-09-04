import PopupContainer from "Popup/components/PopupContainer"
import { Link } from "preact-router/match"
import type { FunctionComponent } from 'preact'
import DatabaseOption from 'Popup/components/DatabaseOption'
import useCustomiseDatabase from 'Popup/hooks/useCustomiseDatabase'
import { Constants } from 'utils'

const getName = (jurisdictionCode: Law.JurisdictionCode, databaseId: string): string => {
  if(databaseId === `commonlii`){
    return Constants.DATABASES.commonlii.name
  }
  return Constants.DATABASES[`${jurisdictionCode}_${databaseId}`].name
}

const CustomiseDatabase: FunctionComponent = () => {
  const {
    selectedJurisdiction,
    databasesStatus,
    toggleDatabase,
  } = useCustomiseDatabase()

  return (
    <PopupContainer>
      <div className="flex justify-between items-center select-none">
        <Link
          className="text-blue-700 border-0 bg-none outline-none p-0 underline cursor-pointer select-text hover:text-blue-900"
          href="/"
        >
          Back
        </Link>
        <div className="px-3 py-1">
          {selectedJurisdiction.emoji}&nbsp;&nbsp;{selectedJurisdiction.name}
        </div>
      </div>
      <p className="py-4 select-none">
        Search the following databases:
      </p>
      <div className="grid grid-cols-2 gap-2 select-none">
        {Object.entries(databasesStatus[selectedJurisdiction.id]).map(([id, enabled]) => {
          const name = getName(selectedJurisdiction.id, id)
          return (
            <DatabaseOption
              key={id}
              id={id}
              name={name}
              enabled={enabled}
              toggleDatabase={toggleDatabase}
            />
          )
        })}
      </div>
    </PopupContainer>
  )
}

export default CustomiseDatabase