import { useCallback, useState } from 'preact/hooks'
import Helpers from '../utils/Helpers'

const Admonition = ({
  className = ``,
  title = ``,
  children = null,
  onClick = null,
}) => {
  const [shouldHide, setShouldHide] = useState(false)
  const dismissAdmonition = useCallback((event) => {
    event.stopPropagation()
    setShouldHide(true)
  }, [])

  return shouldHide ? null : (
    <div
      className={Helpers.classnames(
        `border border-solid border-gray-400 px-2 py-1 flex flex-row hover:bg-gray-100`,
        className,
        onClick ? `cursor-pointer hover:bg-100` : ``,
      )}
      onClick={onClick ? onClick : () => {}}
    >
      <div className="grow">
        <div className="inline-flex flex-row">
          <strong>{title}</strong>
        </div>
        <div>
          {children}
        </div>
      </div>
      <div className="cursor-pointer text-xs p-1" onClick={dismissAdmonition}>✕</div>
    </div>
  )
}

export default Admonition