import { useCallback } from 'preact/hooks'
import Select from 'react-select'
import JurisdictionFlag from 'components/JurisdictionFlag'
import { Constants } from '../../utils'
import { FunctionComponent } from 'preact'

const supportedJurisdictions = Constants.JURISDICTIONS
const options = Object.values(supportedJurisdictions).map(({ id, name }) => ({
  label: name,
  value: id,
}))

interface OptionProps {
  label: string,
  value: Law.JurisdictionCode
}

const Option: FunctionComponent<OptionProps> = ({ label, value }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <JurisdictionFlag id={value} />
      {label}
    </div>
  )
}

type Props = {
  value: Law.JurisdictionCode,
  onChangeJurisdiction: (v: Law.JurisdictionCode) => void
}

const JurisdictionSelect = ({ value, onChangeJurisdiction }: Props) => {

  const onChange = useCallback(({ value }) => onChangeJurisdiction(value), [onChangeJurisdiction])
  const optionValue = options.find(o => o.value === value)

  return (
    // @ts-ignore
    <Select
      className="flex-1"
      options={options}
      formatOptionLabel={Option as any}
      value={optionValue}
      onChange={onChange}
    />
  )
}

export default JurisdictionSelect