import { useState } from "preact/hooks"

const useSearch = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState([] as Law.Case[])
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