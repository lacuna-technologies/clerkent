import { browser } from 'webextension-polyfill-ts'

const readText = async () => {
  const permissionsRequest = await browser.permissions.request({
    permissions: [`clipboardRead`],
  })
  if(permissionsRequest){
    return navigator.clipboard.readText()
  }
  return ``
}

const isURI = (string: string) => (new RegExp(/.*(:\/\/|about:|chrome:).*/, `gi`)).test(string)
const hasTooLongWord = (string: string) => {
  const matches = string.match(/\w+/g)
  if(matches === null){
    return false
  }
  return matches.sort(
    (a, b) => b.length - a.length,
  )[0].length > 30
}
const isTooLong = (string: string) => string.length > 300
const hasInvalidCharacters = (string: string) => (new RegExp(/.*[<>\\{|}].*/, `gi`)).test(string)

const getPopupSearchText = async (): Promise<string> => {
  const clipboardText = await readText()
  const isValid = (
    clipboardText && clipboardText.length > 0 &&
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