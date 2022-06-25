import { useState } from "react"
import type Law from 'types/Law'

type SearchResult = Law.Case | Law.Legislation

const useSearch = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState([] as SearchResult[])
  const onSearchDone = (data) => {
    setIsSearching(false)
    setSearchResult(Array.isArray(data) ? data : [data])
  }

  return {
    isSearching,
    onSearchDone,
    searchResult,
    setIsSearching,
    setSearchResult,
  }
}

export default useSearch