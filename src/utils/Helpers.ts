import Finder from "./Finder"
import type Law from '../types/Law'

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
  return null
}

const isCitationValid = (citation: string) => (
  typeof citation === `string` && citation.length > 0
)

const uniqueBy = (array: any[], attribute: string) =>  [
  ...new Set(array.map(r => r[attribute])),
].map(((attribute_) => array.find((c) => c[attribute] === attribute_)))

const getRandomInteger = (min: number, max: number): number => Math.floor(Math.random()*(max-min)) + min

const getRandomElement = (array: any[]) => array[getRandomInteger(0, array.length)]

const getBestLink = (links: Law.Link[]): Law.Link => {
  const htmlJudgment = links.find(({ doctype, filetype }) => doctype === `Judgment` && filetype === `HTML`)
  if(htmlJudgment){ return htmlJudgment }

  const summary = links.find(({ doctype} ) => doctype === `Summary`)
  if(summary){ return summary }

  return links[0]
}

const getPDFLink = (links: Law.Link[]): Law.Link => links.find(({ filetype }) => filetype === `PDF`)

const Helpers = {
  classnames,
  debounce,
  findCitation,
  getBestLink,
  getPDFLink,
  getRandomElement,
  getRandomInteger,
  isCitationValid,
  sanitiseFilename,
  uniqueBy,
}

export default Helpers