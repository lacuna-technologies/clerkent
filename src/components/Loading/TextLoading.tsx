import React, { useCallback, useEffect, useState } from 'react'
import Helpers from '../../utils/Helpers'

const thingsToLoad = [
  `Loading`,
  `Refreshing the Supreme Court website`,
  `Searching BAILII`,
  `Looking very hard`,
  `Reading the judgment`,
  `Briefly entertaining the dissent`,
  `Binging it`,
  `Looking for PDFs`,
  `Grumbling about bad WiFi`,
  `Looking up journal abbreviations`,
  `Looking up an obscure latin term`,
  `Scouring the archives`,
  `Typesetting the judgment`,
  `Reading the search engine help page`,
  `Formulating a research question`,
  `Marvelling at Denning's way with words`,
  `Hoping this will load soon`,
  `Formatting the judgment`,
  `Waiting for the page to load`,
  `Clicking links`,
  `Consolidating findings`,
]

const TextLoading = () => {

  const [loadingMessage, setLoadingMessage] = useState(`Loading`)

  const getAnotherLoadingMessage = useCallback(() => {
    setLoadingMessage(Helpers.getRandomElement(thingsToLoad))
    setTimeout(getAnotherLoadingMessage, Helpers.getRandomInteger(50, 500))
  }, [])

  useEffect(() => {
    getAnotherLoadingMessage()
  }, [getAnotherLoadingMessage])

  return (
    <span className="clerkent-loading-text">
      {loadingMessage}...
    </span>
  )
}

export default TextLoading