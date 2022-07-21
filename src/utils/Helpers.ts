import Finder from "./Finder"

// eslint-disable-next-line unicorn/better-regex, no-useless-escape
const sanitiseFilename = (fileName: string) => fileName.replace(/[^\d --\.\[\]a-z]/gi, ``)
const sanitiseCaseCitation = (citation: string) => citation.replace(/[^\d --[\]a-z]/gi, ` `)
const debounce = (function_: (...arguments_: any[]) => unknown, timeout = 500) => {
  let timer: NodeJS.Timer
  return (...arguments_: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => function_.apply(this, arguments_), timeout)
  }
}

const classnames = (...arguments_: string[]) => [...new Set(arguments_)].filter(item => item && item.length > 0).join(` `)

const escapeRegExp = (string: string) => string.replace(/[$()*+.?[\\\]^{|}]/g, `\\$&`)

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

const getSummaryLink = (links: Law.Link[]): Law.Link => links.find(({ doctype }) => doctype === `Summary`)
const getJudgmentLink = (links: Law.Link[]): Law.Link => links.find(({ doctype }) => doctype === `Judgment`)
const getOpinionLink = (links: Law.Link[]): Law.Link => links.find(({ doctype }) => doctype === `Opinion`)
const getOrderLink = (links: Law.Link[]): Law.Link => links.find(({ doctype }) => doctype === `Order`)

const getBestLink = (links: Law.Link[]): Law.Link => {
  const htmlJudgment = links.find(({ doctype, filetype }) => doctype === `Judgment` && filetype === `HTML`)
  if(htmlJudgment){ return htmlJudgment }

  const summary = getSummaryLink(links)
  if(summary){ return summary }

  return links[0]
}

const getPDFLink = (links: Law.Link[]): Law.Link => links.find(({ filetype }) => filetype === `PDF`)

const getFileName = (law: Law.Case | Law.Legislation, doctype: Law.Link[`doctype`]): string => {
  if([`case-name`, `case-citation`].includes(law.type)){
    const { name, citation } = law as Law.Case
    return `${sanitiseFilename(name)} ${sanitiseCaseCitation(citation)} - ${doctype}.pdf`
  } else {
    const { statute } = law as Law.Legislation
    return `${sanitiseFilename(statute)}.pdf`
  }
}

const commonAppendsRegex = / ?(\(?pte\.?\)?|private|ltd|limited|llp|sdn|bhd|co|company|corp|\(s\)|inc|gmbh|and others|and (another|other)( (suits?|appeals?|matters?))?|& \d{1,2} ors|& anor|\(interim judicial managers appointed\)|\(in liquidation\)|, singapore branch)\b$/gi
const removeCommonAppends = (caseName: string) => (caseName+``).replaceAll(commonAppendsRegex, ``)

const Helpers = {
  classnames,
  debounce,
  escapeRegExp,
  findCitation,
  getBestLink,
  getFileName,
  getJudgmentLink,
  getOpinionLink,
  getOrderLink,
  getPDFLink,
  getRandomElement,
  getRandomInteger,
  getSummaryLink,
  isCitationValid,
  removeCommonAppends,
  sanitiseFilename,
  uniqueBy,
}

export default Helpers