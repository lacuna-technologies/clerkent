import { renderHook, act } from "@testing-library/preact"
import { Constants } from "utils"
import useSearch from "../useSearch"

const SEARCH_RESULTS = {
  done: true,
  results: [
    {
      citation: `[2022] EWHC 160`,
      database: Constants.DATABASES.UK_bailii,
      jurisdiction: Constants.JURISDICTIONS.UK.id,
      links: [],
      name: `Stadler v Currys Group`,
      type: `case-citation`,
    },
    {
      citation: `[2022] EWHC 1379 (IPEC)`,
      database: Constants.DATABASES.UK_bailii,
      jurisdiction: Constants.JURISDICTIONS.UK.id,
      links: [],
      name: `Shazam Productions v Only Fools the Dining Experience`,
      type: `case-citation`,
    },
  ] as Law.Case[],
}

describe(`useSearch`, () => {
  it(`has correct initial state`, () => {
    const { result } = renderHook(() => useSearch())
    const { current: { isSearching, searchResults } } = result
    expect(isSearching).toBe(false)
    expect(searchResults.length).toBe(0)
  })
  it(`correctly sets search results`, () => {
    const { result } = renderHook(() => useSearch())
    const { current: { onReceiveSearchResults } } = result
    
    act(() => {
      onReceiveSearchResults(SEARCH_RESULTS)
    })

    const { current: { searchResults } } = result
    expect(searchResults).toMatchSnapshot()
  })
})