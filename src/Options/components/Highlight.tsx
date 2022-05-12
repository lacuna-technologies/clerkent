import React, { useCallback } from 'react'
import Toggle from 'components/Toggle'
import { OptionsSettings } from 'utils/OptionsStorage'
import { updateOptionsType } from '../Options'

interface Props {
  value: OptionsSettings[`OPTIONS_HIGHLIGHT_ENABLED`],
  updateOptions: updateOptionsType
}

const Highlight: React.FC<Props> = ({ value, updateOptions }) => {

  const onChangeHighlight = useCallback(
    (value: boolean) => updateOptions(`highlight`, value),
    [updateOptions],
  )

  return (
    <section className="flex flex-row justify-between items-center gap-8">
      <div className="flex flex-col">
        <strong>Highlighting</strong>
        <label>Underline case citations and show the case name on hover on supported websites?</label>
      </div>
      <Toggle
        leftText="DISABLE"
        rightText="ENABLE"
        value={value}
        onChange={onChangeHighlight}
      />
    </section>
  )
}

  export default Highlight