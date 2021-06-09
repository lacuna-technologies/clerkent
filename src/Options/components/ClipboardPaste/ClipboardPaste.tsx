import React, { useCallback } from 'react'
import Toggle from '../../../components/Toggle'
import { OptionsSettings } from '../../../utils/OptionsStorage'
import { updateOptionsType } from '../../Options'
import './ClipboardPaste.scss'

interface Props {
  value: OptionsSettings[`OPTIONS_CLIPBOARD_PASTE_ENABLED`],
  updateOptions: updateOptionsType
}

const ClipboardPaste: React.FC<Props> = ({ value, updateOptions }) => {

  const onChangeClipboardPaste = useCallback(
    (value: boolean) => updateOptions(`clipboardPaste`, value),
    [updateOptions],
  )

  return (
    <section id="clipboard-paste-option">
      <div className="label">
        <strong>Automatically paste clipboard contents</strong>
        <label>Display the contents of your clipboard and allow you to use it as a search query with a single click?</label>
      </div>
      <Toggle
        leftText="DISABLE"
        rightText="ENABLE"
        value={value}
        onChange={onChangeClipboardPaste}
      />
    </section>
  )
}

  export default ClipboardPaste