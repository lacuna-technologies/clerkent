import React, { useCallback } from 'react'
import SelectInput from '../../../components/SelectInput'
import Constants from '../../../utils/Constants'
import type { OptionsSettings } from '../../../utils/OptionsStorage'
import type { updateOptionsType } from '../../Options'

const institutionOptions = Object.entries(Constants.INSTITUTIONAL_LOGINS).map(
  ([key, value]) => ({ content: value, value: key }),
)

interface Props {
  value: OptionsSettings[`OPTIONS_INSTITUTIONAL_LOGIN`],
  updateOptions: updateOptionsType
}

const Institution: React.FC<Props> = ({ value, updateOptions }) => {
  const onChange = useCallback((value) => updateOptions(`institutionalLogin`, value), [updateOptions])

  return (
    <section id="institution-option">
      <div className="label">
        <strong>Institutional Login</strong>
        <label>
          Do you have login credentials for any of the following institutions? Setting this option allows Clerkent to redirect you to the appropriate WestLaw / LexisNexis / LawNet login page
        </label>
      </div>
      <SelectInput
        options={institutionOptions}
        value={value}
        onChange={onChange}
        defaultValue="NONE"
      />
    </section>
  )
}

export default Institution