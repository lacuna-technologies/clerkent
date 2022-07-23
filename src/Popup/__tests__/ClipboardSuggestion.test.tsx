import { render } from '@testing-library/preact'
import ClipboardSuggestion from 'Popup/components/ClipboardSuggestion'
import Clipboard from 'utils/Clipboard'
import OptionsStorage from 'utils/OptionsStorage'

jest.mock(`utils/Clipboard`)
const getPopupSearchText = Clipboard.getPopupSearchText as jest.Mock

jest.mock(`utils/OptionsStorage`)
const clipboardPasteGet = OptionsStorage.clipboardPaste.get as jest.Mock

const QUERY = `abc123`
const CLIPBOARD_TEXT = `xyz789`
const applyClipboardText = () => null

describe(`ExternalLinks`, () => {
  it(`renders without error`, () => {
    getPopupSearchText.mockImplementation(() => Promise.resolve(CLIPBOARD_TEXT))
    clipboardPasteGet.mockImplementation(() => Promise.resolve(true))
    const tree = render(
      <ClipboardSuggestion
        query={QUERY}
        applyClipboardText={applyClipboardText}
      />,
    )
    expect(tree).toMatchSnapshot()
  })
})