import React, { useCallback } from 'react'
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

const SelectInput: React.FC<Props> = ({
  className = ``,
  options,
  value,
  onChange = () => {},
  defaultValue,
}) => {
  const onSelect = useCallback(({ target: { value } }) => onChange(value), [onChange])
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