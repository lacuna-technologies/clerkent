import React from 'react'
import './SelectInput.scss'

interface Props {
  options: {
    value: string,
    content: string,
  }[],
  value: string,
  onChange: ({ target: { value }}: { target: { value: string } }) => void
}

const SelectInput: React.FC<Props> = ({
  options,
  value = options[0].value,
  onChange = () => {},
}) => {
  return (
    <div className="select-input">
      <select value={value} onChange={onChange}>
        {options.map(({ value, content }) => (
          <option value={value} key={value}>{content}</option>
        ))}
      </select>
    </div>
  )
}

export default SelectInput