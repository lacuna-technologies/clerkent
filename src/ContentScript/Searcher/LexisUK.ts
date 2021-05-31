import { Logger } from '../../utils'
import { waitTillReady } from './utils'

const getInputBox = () => document.querySelector(`#inputTextId2`) as HTMLInputElement
const getFindButton = () => document.querySelector(`#inputTextId3 + a`) as HTMLInputElement

const isReady = () => (
  document.querySelector(`body`).classList.contains(`yui-skin-sam`) &&
  getInputBox() !== null && getFindButton() !== null
)

const init = async (query: string) => {
  await waitTillReady(isReady)
  const inputBox = getInputBox()
  inputBox.value = query

  const findButton = getFindButton()
  findButton.click()
  Logger.log(inputBox, findButton)
}

const LexisUK = {
  init,
}

export default LexisUK