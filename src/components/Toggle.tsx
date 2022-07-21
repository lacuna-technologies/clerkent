import { useCallback } from 'preact/hooks'
import Helpers from '../utils/Helpers'

const { classnames } = Helpers

const Toggle = ({
  leftText,
  rightText,
  value = false,
  onChange = (_: boolean): void => {},
}) => {
  const onChangeFalse = useCallback(() => value ? onChange(false) : null, [value, onChange])
  const onChangeTrue = useCallback(() => value ? null : onChange(true), [value, onChange])

  const divClass = `px-2 py-0.5 cursor-pointer flex items-center`
  const activeClass = `bg-slate-600 text-white`

  return (
    <div className="inline-flex flex-row justify-start border border-solid border-gray-400 w-fit rounded">
      <div
        className={classnames(
          divClass,
          value ?  `` : activeClass,
        )}
        onClick={onChangeFalse}
      >
        {leftText}
      </div>
      <div
        className={classnames(
          divClass,
          value ?  activeClass : ``,
        )}
        onClick={onChangeTrue}
      >
        {rightText}
      </div>
    </div>
  )
}

export default Toggle