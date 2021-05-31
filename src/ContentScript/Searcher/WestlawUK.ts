import { waitTillReady } from './utils'

const getSubmitButton = () => document.querySelector(`#co_search_advancedSearchButton_bottom`) as HTMLButtonElement
const getCaseCitationInput = () => document.querySelector(`#co_search_advancedSearch_CI`) as HTMLInputElement
const getPartyNameInput = () => document.querySelector(`#co_search_advancedSearch_TI`) as HTMLInputElement

const isReady = () => (
  document.querySelector(`body`).classList.contains(`keyboard-focus`) &&
  getCaseCitationInput() !== null && getPartyNameInput() !== null && getSubmitButton() !== null
)

const initCaseCitation = async (citation: string) => {
  await waitTillReady(isReady)
  const citationField = getCaseCitationInput()
  citationField.value = citation
  const searchButton = getSubmitButton()
  searchButton.click()
}

const initPartyName = async (partyName: string) => {
  await waitTillReady(isReady)
  const partyField = getPartyNameInput()
  partyField.value = partyName
  const searchButton = getSubmitButton()
  searchButton.click()
}

const WestlawUK = {
  initCaseCitation,
  initPartyName,
}

export default WestlawUK
