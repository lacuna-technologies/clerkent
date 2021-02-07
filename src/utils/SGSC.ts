import axios from 'axios'

const getSearchResults = (citation: string) => `https://www.supremecourt.gov.sg/search-judgment?q=${citation}&y=All`

const getPDF = async (citation: string) => {
  const { data } = await axios.get(getSearchResults(citation))
  return data
}

const SGSC = {
  getPDF,
  getSearchResults,
}

export default SGSC