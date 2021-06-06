const readText = () => navigator.clipboard.readText()

const isURI = (string: string) => (new RegExp(/.*(:\/\/|about:|chrome:).*/, `gi`)).test(string)
const hasTooLongWord = (string: string) => string.match(/\w+/g).sort((a, b) => b.length - a.length)[0].length > 30
const isTooLong = (string: string) => string.length > 300
const hasInvalidCharacters = (string: string) => (new RegExp(/.*[<>\\{|}].*/, `gi`)).test(string)

const getPopupSearchText = async (): Promise<string> => {
  const clipboardText = await readText()
  const isValid = (
    !isTooLong(clipboardText) && !isURI(clipboardText) &&
    !hasTooLongWord(clipboardText) && !hasInvalidCharacters(clipboardText)
  )
  if(isValid){
    return clipboardText
  }
  return ``
}

const Clipboard = {
  getPopupSearchText,
  readText,
}

export default Clipboard