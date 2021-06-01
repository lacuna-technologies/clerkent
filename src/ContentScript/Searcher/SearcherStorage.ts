import Storage from '../../utils/Storage'

const KEYS = {
  LAWNET_QUERY: `LAWNET_QUERY`,
  LEXIS_UK_QUERY: `SEARCHER_LEXIS_UK_QUERY`,
}

const storeLexisUKQuery = (query: string) => Storage.set(KEYS.LEXIS_UK_QUERY, query)
const getLexisUKQuery = () => Storage.get(KEYS.LEXIS_UK_QUERY)
const removeLexisUKQuery = () => Storage.remove(KEYS.LEXIS_UK_QUERY)

const storeLawNetQuery = (query: string) => Storage.set(KEYS.LAWNET_QUERY, query)
const getLawNetQuery = () => Storage.get(KEYS.LAWNET_QUERY)
const removeLawNetQuery = () => Storage.remove(KEYS.LAWNET_QUERY)

const SearcherStorage = {
  getLawNetQuery,
  getLexisUKQuery,
  removeLawNetQuery,
  removeLexisUKQuery,
  storeLawNetQuery,
  storeLexisUKQuery,
}

export default SearcherStorage