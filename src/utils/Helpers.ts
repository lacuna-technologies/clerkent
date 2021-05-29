import Finder from "./Finder"

const sanitiseFilename = (fileName: string) => fileName.replace(/[^\d -,a-z]/gi, ``)
const debounce = (function_: (...arguments_: any[]) => unknown, timeout = 500) => {
  let timer: NodeJS.Timer
  return (...arguments_: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => function_.apply(this, arguments_), timeout)
  }
}

const classnames = (...arguments_: string[]) => [...new Set([...arguments_])].join(` `)

const findCitation = (function_ = Finder.findCaseCitation, inputText: string) => {
  const results = function_(inputText)
  if(results.length > 0){
    return results[0].citation
  }
  return ``
}

const Helpers = {
  classnames,
  debounce,
  findCitation,
  sanitiseFilename,
}

export default Helpers