import React from 'react'
import { browser } from 'webextension-polyfill-ts'
import QueryResult from './QueryResult'
import { Constants } from '../utils'
import Toggle from '../components/Toggle'
import SelectInput from '../components/SelectInput'
import ExternalLinks from './ExternalLinks'
import ClipboardSuggestion from './ClipboardSuggestion'
import useMessenger from './hooks/useMessenger'
import usePopup from './hooks/usePopup'
import useSearch from './hooks/useSearch'

import 'styles/tailwind.css'

const Popup: React.FC = () => {
  const {
    isSearching,
    onSearchDone,
    searchResult,
    setIsSearching,
    setSearchResult,
  } = useSearch()
  const {
    search,
    downloadPDF,
  } = useMessenger( { onSearchDone })
  const {
    applyClipboardText,
    lastSearchQuery,
    mode,
    onChangeJurisdiction,
    onEnter,
    onModeChange,
    onSearchQueryChange,
    query,
    selectedJurisdiction,
    modeToBool,
  } = usePopup({
    search,
    setIsSearching,
    setSearchResult,
  })

  const supportedJurisdictions = mode === `case`
    ? Object.values(Constants.JURISDICTIONS)
    : [
      Constants.JURISDICTIONS.EU,
      Constants.JURISDICTIONS.UK,
      Constants.JURISDICTIONS.SG,
    ]

  return (
    <section className="overflow-x-hidden overflow-y-scroll h-min w-112 min-h-32 p-4">
      <div className="flex flex-row justify-between content-center items-stretch gap-8">
        <Toggle
          leftText="Cases"
          rightText="Legislation"
          onChange={onModeChange}
          value={modeToBool(mode)}
        />
        <SelectInput
          className="flex-1"
          options={Object.values(supportedJurisdictions).map(({ id, emoji, name }) => ({
            content: `${emoji} ${name}`,
            value: id,
          }))}
          value={selectedJurisdiction}
          onChange={onChangeJurisdiction}
        />
      </div>
      <input
        className="w-full p-2 my-4 outline-none rounded border border-solid border-gray-400"
        type="search"
        placeholder="case citation, party name, or legislation"
        onChange={onSearchQueryChange}
        onKeyDown={onEnter}
        value={query}
      />
      {
        query === lastSearchQuery ? (
          <ClipboardSuggestion query={query} applyClipboardText={applyClipboardText} />
        ) : null
      }
      {
        (!isSearching && query.length > 0 && searchResult.length === 0 && lastSearchQuery !== query) ? (
          <span>Press enter to search</span>
        ) : (
          <QueryResult
            searchResult={searchResult}
            downloadPDF={downloadPDF}
            isSearching={isSearching}
            mode={mode}
          />
        )
      }
      {
        (query.length > 0 && !isSearching && mode === `case`) ? (
          <ExternalLinks
            jurisdiction={selectedJurisdiction}
            type={searchResult[0]?.type}
            query={query}
          />
        ) : null
      }
      <div className="mt-8 border-t border-solid border-gray-400 pt-6 flex flex-row justify-between select-none">
        <a
          className="text-blue-700 border-0 bg-none outline-none p-0 underline cursor-pointer select-text hover:text-blue-900"
          href={browser.runtime.getURL(`/options.html`)}
          target="_blank"
          rel="noreferrer"
        >
          Options
        </a>
        <a 
          className="text-blue-700 border-0 bg-none outline-none p-0 underline cursor-pointer select-text hover:text-blue-900"
          href="https://clerkent.huey.xyz/help"
          target="_blank"
          rel="noreferrer"
        >
          Help
        </a>
      </div>
      {/* <div className="buttons">
        <button id="mass-citations" onClick={onMassCitations}>Want to paste in a large amount of text?</button>
      </div> */}
    </section>
  )
}

export default Popup
