import { useCallback } from 'preact/hooks'
import type { FunctionComponent, JSX } from 'preact'
import { Helpers } from 'utils'

interface Props {
  className?: string,
  options: {
    value: string,
    content: string,
  }[],
  value: string,
  onChange: (value: string) => void,
  defaultValue?: string,
}

const SelectInput: FunctionComponent<Props> = ({
  className = ``,
  options,
  value,
  onChange = (v) => {},
  defaultValue,
}) => {
  const onSelect = useCallback(({ target }: Event) => {
    if(target instanceof HTMLSelectElement){
      onChange(target.value)
    }
  }, [onChange])
  const valueWithDefault = (((!value || !options.map(({ value }) => value).includes(value)) && defaultValue)
    ? defaultValue
    : value
  )

  return (
    <select
      className={Helpers.classnames(
        `text-base h-full font-sans border border-solid border-gray-400 rounded px-2 py-1 outline-none bg-gray-100`,
        className,
      )}
      value={valueWithDefault}
      onChange={onSelect}
    >
      {options.map(({ value, content }) => (
        <option
          value={value}
          key={value}
        >
          {content}
        </option>
      ))}
    </select>
  )
}

export default SelectInput