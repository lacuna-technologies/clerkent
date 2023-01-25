import { useCallback, useMemo, useRef, useState } from "preact/hooks"

const useSearch = () => {
  const [isSearching, setIsSearchingRaw] = useState(false)
  const [newSearchResults, setNewSearchResults] = useState([] as Law.Case[])
  const [searchResults, setSearchResults] = useState([] as Law.Case[])
  const [initialTimerDone, setInitialTimerDone] = useState(false)
  const timer = useRef(null)

  const updateResults = useCallback(() => {
    if(newSearchResults.length > 0){
      setSearchResults(newSearchResults)
      setNewSearchResults([])
    }
  }, [newSearchResults])

  const setIsSearching = useCallback((value: boolean) => {
    setIsSearchingRaw(value)

    setInitialTimerDone(false)
    if(timer?.current){
      clearTimeout(timer.current)
    }

    if(value === true){
      timer.current = setTimeout(() => {
        setInitialTimerDone(true)
        updateResults()
      }, 1000)
    }
  }, [updateResults])

  const onReceiveSearchResults = useCallback((data: { done: boolean, results: Law.Case[] }) => {
    const { done, results } = data

    if(done){
      setIsSearchingRaw(false)
      setInitialTimerDone(true)
    }

    // avoid sudden shifts in the layout
    if(searchResults.length === 0 && !initialTimerDone){
      setSearchResults(results)
      setNewSearchResults([])
    } else {
      setNewSearchResults(results)
    }
  }, [searchResults.length, setIsSearchingRaw, initialTimerDone, setInitialTimerDone])

  const updatePending = useMemo(() => (newSearchResults.length > 0), [newSearchResults])

  const resetSearchResults = useCallback(() => {
    setSearchResults([])
    setNewSearchResults([])
  }, [])

  return {
    isSearching,
    onReceiveSearchResults,
    resetSearchResults,
    searchResults,
    setIsSearching,
    updatePending,
    updateResults,
  }
}

export default useSearch