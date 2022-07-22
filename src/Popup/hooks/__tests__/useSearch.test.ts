import { renderHook, act } from "@testing-library/preact"
import { Constants } from "utils"
import useSearch from "../useSearch"

const SEARCH_RESULTS: Law.Case[] = [
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
]

describe(`useSearch`, () => {
  it(`has correct initial state`, () => {
    const { result } = renderHook(() => useSearch())
    const { current: { isSearching, searchResult } } = result
    expect(isSearching).toBe(false)
    expect(searchResult.length).toBe(0)
  })
  it(`correctly sets search results`, () => {
    const { result } = renderHook(() => useSearch())
    const { current: { onSearchDone } } = result
    
    act(() => {
      onSearchDone(SEARCH_RESULTS)
    })

    const { current: { searchResult } } = result
    expect(searchResult).toMatchSnapshot()
  })
})