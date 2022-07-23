import type { FunctionComponent } from 'preact'
import { useCallback } from 'preact/hooks'

type DatabaseOptionProps = {
  name: string,
  id: string,
  enabled: boolean,
  toggleDatabase: (id: string) => Promise<void>,
}

const DatabaseOption: FunctionComponent<DatabaseOptionProps> = ({ id, name, enabled, toggleDatabase }) => {
  const enabledClass = enabled ? `border-neutral-800 border-solid` : `text-neutral-500 border-neutral-500 border-dashed`
  const onClick = useCallback(() => {
    toggleDatabase(id)
  }, [toggleDatabase, id])
  return (
    <div className={`flex items-center py-1 px-2 border ${enabledClass}`} onClick={onClick}>
      {name}
    </div>
  )
}

export default DatabaseOption