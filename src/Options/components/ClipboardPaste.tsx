import { useCallback } from 'preact/hooks'
import Toggle from 'components/Toggle'
import type { OptionsSettings } from 'utils/OptionsStorage'
import type { updateOptionsType } from '../Options'
import type { FunctionComponent } from 'preact'

interface Props {
  value: OptionsSettings[`OPTIONS_CLIPBOARD_PASTE_ENABLED`],
  updateOptions: updateOptionsType
}

const ClipboardPaste: FunctionComponent<Props> = ({ value, updateOptions }) => {

  const onChangeClipboardPaste = useCallback(
    (value: boolean) => updateOptions(`clipboardPaste`, value),
    [updateOptions],
  )

  return (
    <section className="flex flex-row justify-between items-center gap-8">
      <div className="flex flex-col">
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