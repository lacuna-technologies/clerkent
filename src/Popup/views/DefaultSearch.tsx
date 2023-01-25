import { browser } from 'webextension-polyfill-ts'
import QueryResult from '../components/QueryResult'
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
import JurisdictionSelect from 'Popup/components/JurisdictionSelect'

const DefaultSearch: FunctionComponent = () => {
  const {
    isSearching,
    onReceiveSearchResults,
    searchResults,
    setIsSearching,
    resetSearchResults,
    updatePending,
    updateResults,
  } = useSearch()
  const {
    search,
    downloadPDF,
  } = useMessenger( { onReceiveSearchResults })
  const {
    applyClipboardText,
    lastSearchQuery,
    onChangeJurisdiction,
    onEnter,
    onSearchQueryInput,
    query,
    selectedJurisdiction,
    onPaste,
  } = usePopup({
    resetSearchResults,
    search,
    setIsSearching,
  })
  const inputReference = useFocusInput()

  return (
    <PopupContainer>
      <div className="flex flex-row justify-between content-center items-stretch gap-2">
        <JurisdictionSelect
          value={selectedJurisdiction}
          onChangeJurisdiction={onChangeJurisdiction}
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
        onInput={onSearchQueryInput}
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
        (!isSearching && query.length > 0 && searchResults.length === 0 && lastSearchQuery !== query) ? (
          <div className="flex-grow">Press enter to search</div>
        ) : (
          <QueryResult
            searchResults={searchResults}
            downloadPDF={downloadPDF}
            isSearching={isSearching}
            updatePending={updatePending}
            updateResults={updateResults}
          />
        )
      }
      {
        (query.length > 0 && !isSearching) ? (
          <ExternalLinks
            jurisdiction={selectedJurisdiction}
            type={searchResults[0]?.type}
            query={query}
          />
        ) : null
      }
      <div className="mt-4 pt-2 border-t border-solid border-gray-400 flex flex-row justify-between select-none">
        <a
          className="text-slate-600 border-0 bg-none outline-none p-0 hover:underline cursor-pointer select-text hover:text-blue-900"
          href={browser.runtime.getURL(`/options.html`)}
          target="_blank"
          rel="noreferrer"
        >
          Options
        </a>
        <div className="flex flex-row gap-4">
          <a
            className="text-slate-600 border-0 bg-none outline-none p-0 hover:underline cursor-pointer select-text hover:text-blue-900"
            href="https://clerkent.huey.xyz/feedback/"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </a>
          <a 
            className="text-slate-600 border-0 bg-none outline-none p-0 hover:underline cursor-pointer select-text hover:text-blue-900"
            href="https://clerkent.huey.xyz/help"
            target="_blank"
            rel="noreferrer"
          >
            Help
          </a>
        </div>
      </div>
    </PopupContainer>
  )
}

export default DefaultSearch
