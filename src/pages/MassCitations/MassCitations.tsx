import React, { useState, useCallback, useEffect } from 'react'
import { Constants, Finder, Storage, Logger } from '../../utils'
import type { CaseCitationFinderResult } from '../../utils/Finder/CaseCitationFinder'
import './MassCitations.scss'

const keys = {
  MASS_CITATION_INPUT: `MASS_CITATION_INPUT`,
}

const MassCitations = () => {
  const [inputText, setInputText] = useState(``)
  const [parseResult, setParseResult] = useState([] as CaseCitationFinderResult[])
  const [pressedDone, setPressedDone] = useState(false)
  const onInputChange = useCallback(({ target: { value }}) => {
    setInputText(value)
    setPressedDone(false)
  }, [])
  const onDone = useCallback(() => {
    setPressedDone(true)
    setParseResult(Finder.findCase(inputText))
    Storage.set(keys.MASS_CITATION_INPUT, inputText)
  }, [inputText])

  const removeCase = useCallback(citation => () => setParseResult(parseResult.filter(result => result.citation !== citation)), [parseResult])

  useEffect(() => {
    (async () => {
      const storedInput = await Storage.get(keys.MASS_CITATION_INPUT)
      Logger.log(storedInput)
      if(storedInput !== null && storedInput.length > 0){
        onInputChange({ target: { value: storedInput }})
      }
    })()
  }, [onInputChange])

  return (
    <div id="mass-citations">
      <p>
        You can paste in text from Word documents, PowerPoint presentations, and other files to download all the judgments cited therein.
      </p>
      <p>
        Tip: most programs allow you to select all text by pressing Ctrl-A and copy the selected text by pressing Ctrl-C
      </p>
      <textarea
        id="mass-citations-input"
        onChange={onInputChange}
        value={inputText}
      />
      <button onClick={onDone}>DONE</button>
      {
        parseResult.length > 0 ? (
          <div id="results-container">
            <p>
              The following cases were found. Click on any case to remove it from the list. When you're done, click the download button below.
            </p>
            <div id="results">
            {
              parseResult.map(result => (
                <div className="case" onClick={removeCase(result.citation)}>
                  <span
                    className="jurisdiction"
                    title={Constants.JURISDICTIONS[result.jurisdiction].name}
                  >
                    {Constants.JURISDICTIONS[result.jurisdiction].emoji}
                  </span>
                  &nbsp;&nbsp;
                  <span className="citation">{result.citation}</span>
                </div>
              ))
            }
            </div>
          </div>
        ) : 
          (pressedDone ? (
            <p>No case citations found. Check to make sure the text does contain citations (note that Clerkent is as yet unable to recognise case names alone).</p>
          ) : null)
      }
    </div>
  )
}

export default MassCitations