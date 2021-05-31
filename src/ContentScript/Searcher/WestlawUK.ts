const initCaseCitation = (citation: string) => {
  const citationField = document.querySelector(`#co_search_advancedSearch_CI`) as HTMLInputElement
  citationField.value = citation
  const searchButton = document.querySelector(`#co_search_advancedSearchButton_bottom`) as HTMLButtonElement
  searchButton.click()
}

const initPartyName = (partyName: string) => {
  const partyField = document.querySelector(`#co_search_advancedSearch_TI`) as HTMLInputElement
  partyField.value = partyName
  const searchButton = document.querySelector(`#co_search_advancedSearchButton_bottom`) as HTMLButtonElement
  searchButton.click()
}

const WestlawUK = {
  initCaseCitation,
  initPartyName,
}

export default WestlawUK
