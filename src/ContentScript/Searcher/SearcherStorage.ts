import Storage from '../../utils/Storage'

const KEYS = {
  LEXIS_UK_QUERY: `SEARCHER_LEXIS_UK_QUERY`,
}

const storeLexisUKQuery = (query: string) => Storage.set(KEYS.LEXIS_UK_QUERY, query)
const getLexisUKQuery = () => Storage.get(KEYS.LEXIS_UK_QUERY)
const removeLexisUKQuery = () => Storage.remove(KEYS.LEXIS_UK_QUERY)

const SearcherStorage = {
  getLexisUKQuery,
  removeLexisUKQuery,
  storeLexisUKQuery,
}

export default SearcherStorage