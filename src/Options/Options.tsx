import React, { useCallback, useEffect, useState } from 'react'
import { browser } from 'webextension-polyfill-ts'
import OptionsStorage from '../utils/OptionsStorage'
import type { OptionShortName, OptionStorageContentType } from '../utils/OptionsStorage'
import Highlight from './components/Highlight'
import Institution from './components/Institution'
import ClipboardPaste from './components/ClipboardPaste'
import 'styles/tailwind.css'
import KeyboardShortcut from './components/KeyboardShortcut'

export type updateOptionsType = <K extends OptionShortName>(
  key: K,
  value: ThenArgument<ReturnType<OptionStorageContentType[K][`get`]>>
) => void

const Options: React.FC = () => {
  const [optionsState, setOptionsState] = useState(OptionsStorage.defaultOptions)
  const {
    OPTIONS_HIGHLIGHT_ENABLED,
    OPTIONS_INSTITUTIONAL_LOGIN,
    OPTIONS_CLIPBOARD_PASTE_ENABLED,
  } = optionsState

  const fetchOptions = useCallback(() => {
    (async () => {
      const fetchedOptions = await OptionsStorage.getAll()
      setOptionsState(fetchedOptions)
    })()
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateOptions = useCallback(((key, value) => {
    OptionsStorage[key].set(value as any)
    fetchOptions()
  }) as updateOptionsType, [fetchOptions])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  return (
    <div className="w-full h-full min-h-screen bg-gray-100 py-8 select-none">
      <div className="bg-white w-full max-w-5xl mx-auto my-0 p-8 text-lg flex flex-col gap-8">
        <h1 className="text-5xl font-black mt-0 mb-4">
          Clerkent Setup
        </h1>
        <Institution
          value={OPTIONS_INSTITUTIONAL_LOGIN}
          updateOptions={updateOptions}
        />
        <Highlight
          value={OPTIONS_HIGHLIGHT_ENABLED}
          updateOptions={updateOptions}
        />
        <ClipboardPaste
          value={OPTIONS_CLIPBOARD_PASTE_ENABLED}
          updateOptions={updateOptions}
        />

        <KeyboardShortcut />

        <p>
          To open the Welcome Guide again, click&nbsp;
          <a
            className="text-blue-700 border-0 bg-none outline-none p-0 underline cursor-pointer select-text hover:text-blue-900"
            href={browser.runtime.getURL(`/guide.html`)}
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </p>
        
      </div>
    </div>
  )
}

export default Options
