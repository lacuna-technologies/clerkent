import React, { useCallback } from 'react'
import './SelectInput.scss'

interface Props {
  options: {
    value: string,
    content: string,
  }[],
  value: string,
  onChange: (value: string) => void,
  defaultValue?: string,
}

const SelectInput: React.FC<Props> = ({
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
    <div className="select-input">
      <select
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
    </div>
  )
}

export default SelectInput