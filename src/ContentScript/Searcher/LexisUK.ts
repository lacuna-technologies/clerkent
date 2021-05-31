const init = (query: string) => {
  const inputBox = document.querySelector(`#inputTextId2`) as HTMLInputElement
  inputBox.value = query

  const findButton = document.querySelector(`#inputTextId3 + a`) as HTMLInputElement
  findButton.click()
}

const LexisUK = {
  init,
}

export default LexisUK