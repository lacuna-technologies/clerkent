import React, { useCallback, useEffect, useState } from 'react'
import OptionsStorage, { OptionShortName, OptionStorageContentType } from '../utils/OptionsStorage'
import Highlight from './components/Highlight'
import Institution from './components/Institution'
import ClipboardPaste from './components/ClipboardPaste'
import 'styles/tailwind.css'

type ThenArgument<T> = T extends PromiseLike<infer U> ? U : T
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
      </div>
    </div>
  )
}

export default Options
