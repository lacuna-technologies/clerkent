import React, { useCallback, useEffect, useState } from 'react'
import OptionsStorage from '../utils/OptionsStorage'
import './Options.scss'
import Highlight from './components/Highlight'
import Institution from './components/Institution'

const Options: React.FC = () => {
  const [optionsState, setOptionsState] = useState(OptionsStorage.defaultOptions)
  const { highlightEnabled, institutionalLogin } = optionsState

  const fetchOptions = useCallback(() => {
    (async () => {
      const fetchedOptions = await OptionsStorage.getAll()
      setOptionsState(fetchedOptions)
    })()
  }, [])

  const updateOptions = useCallback((key, value) => {
    OptionsStorage[key].set(value)
    fetchOptions()
  }, [fetchOptions])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  return (
    <div id="options-page">
      <h1>Clerkent Setup</h1>
      <Institution
        value={institutionalLogin}
        updateOptions={updateOptions}
      />
      <Highlight
        value={highlightEnabled}
        updateOptions={updateOptions}
      />
    </div>
  )
}

export default Options
