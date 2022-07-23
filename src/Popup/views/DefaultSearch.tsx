import { browser } from 'webextension-polyfill-ts'
import QueryResult from '../components/QueryResult'
import { Constants } from '../../utils'
import SelectInput from '../../components/SelectInput'
import ExternalLinks from '../components/ExternalLinks'
import ClipboardSuggestion from '../components/ClipboardSuggestion'
import useMessenger from '../hooks/useMessenger'
import usePopup from '../hooks/usePopup'
import useSearch from '../hooks/useSearch'
import useFocusInput from '../hooks/useFocusInput'
import type { FunctionComponent } from 'preact'

import 'styles/tailwind.css'
import PopupContainer from 'Popup/components/PopupContainer'
import DatabaseStatus from 'Popup/components/DatabaseStatus'

const supportedJurisdictions = Constants.JURISDICTIONS

const DefaultSearch: FunctionComponent = () => {
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
    onChangeJurisdiction,
    onEnter,
    onSearchQueryChange,
    query,
    selectedJurisdiction,
    onPaste,
  } = usePopup({
    search,
    setIsSearching,
    setSearchResult,
  })
  const inputReference = useFocusInput()

  return (
    <PopupContainer>
      <div className="flex flex-row justify-between content-center items-stretch gap-2">
        <SelectInput
          className="flex-1"
          options={Object.values(supportedJurisdictions).map(({ id, emoji, name }) => ({
            content: `${emoji}  ${name}`,
            value: id,
          }))}
          value={selectedJurisdiction}
          onChange={onChangeJurisdiction}
        />
        <DatabaseStatus
          selectedJurisdiction={selectedJurisdiction}
        />
      </div>
      <input
        ref={inputReference}
        className="w-full p-2 my-4 outline-none rounded border border-solid border-gray-400"
        type="search"
        placeholder="case citation, party name, or legislation"
        onChange={onSearchQueryChange}
        onKeyDown={onEnter}
        value={query}
        onPaste={onPaste}
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
          />
        )
      }
      {
        (query.length > 0 && !isSearching) ? (
          <ExternalLinks
            jurisdiction={selectedJurisdiction}
            type={searchResult[0]?.type}
            query={query}
          />
        ) : null
      }
      <div className="mt-4 pt-2 border-t border-solid border-gray-400 flex flex-row justify-between select-none">
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
    </PopupContainer>
  )
}

export default DefaultSearch