import React, { useCallback } from 'react'
import Toggle from '../../../components/Toggle'
import './Highlight.scss'

const Highlight = ({ value, updateOptions }) => {

  const onChangeHighlight = useCallback(
    (value: boolean) => updateOptions(`highlight`, value),
    [updateOptions],
  )

  return (
    <section id="highlight-option">
      <div className="label">
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