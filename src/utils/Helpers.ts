// eslint-disable-next-line unicorn/better-regex, no-useless-escape
const sanitiseFilename = (fileName: string) => fileName.replaceAll(/[^\d --\.\[\]a-z]|"/gi, ``)
const sanitiseCaseCitation = (citation: string) => citation.replaceAll(/[^\d --[\]a-z]|"/gi, ` `)
const debounce = (function_: (...arguments_: any[]) => unknown, timeout = 500) => {
  let timer: NodeJS.Timer
  return (...arguments_: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => function_.apply(this, arguments_), timeout)
  }
}
const cleanQuery = (query: string) => query.replaceAll(/\s+/g, ` `).trim()
const cleanQueryPreserveLength = (query: string) => query.replaceAll(/\s/g, ` `)

const classnames = (...arguments_: string[]) => [...new Set(arguments_)].filter(item => item && item.length > 0).join(` `)

const escapeRegExp = (string: string) => string.replaceAll(/[$()*+.?[\\\]^{|}]/g, `\\$&`)

const htmlDecode = (input: string) => {
  const document_ = new DOMParser().parseFromString(input, `text/html`)
  return document_.documentElement.textContent
}

const isCitationValid = (citation: string) => (
  typeof citation === `string` && citation.length > 0
)

const uniqueBy = <T>(array: T[], attribute: string): T[] =>  [
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
  } 
    const { statute } = law as Law.Legislation
    return `${sanitiseFilename(statute)}.pdf`
}

const commonAppends = [
  /\(?pte\.?\)?/,
  /private/,
  /ltd\.?|limited/,
  /l\.?l\.?p\.?/,
  /sdn|bhd/,
  /company|co\.?|& co\.?/,
  /n\.?v\.?|gmbh/,
  /inc\.?/,
  /\(s\)|\(m\)|\(singapore\)/,
  /(and|&) others|(and|&) (another|other)( (suits?|appeals?|matters?))?|(and|&) \d{1,2} ors|& anor/,
  /\(interim judicial managers appointed\)|\(in liquidation\)|\(under judicial management\)/,
  /, singapore branch/,
]
const commonAppendsPartialRegex = commonAppends.map(append => append.source).join(`|`)
const commonAppendsRegex = new RegExp(`(\\b|\\s)(${commonAppendsPartialRegex})(\\b|\\s|$)`, `gi`)
const removeCommonAppends = (caseName: string) => (
  (`${caseName}`)
    .replaceAll(commonAppendsRegex, ` `)
    .replaceAll(/ {2,}/g, ` `)
    .replaceAll(/([\da-z])\s\)/g, `$1)`)
    .trim()
)

const randomSort = (array) => array.slice(0, array.length).sort(() => (Math.random() - 0.5))

const Helpers = {
  classnames,
  cleanQuery,
  cleanQueryPreserveLength,
  debounce,
  escapeRegExp,
  getBestLink,
  getFileName,
  getJudgmentLink,
  getOpinionLink,
  getOrderLink,
  getPDFLink,
  getRandomElement,
  getRandomInteger,
  getSummaryLink,
  htmlDecode,
  isCitationValid,
  randomSort,
  removeCommonAppends,
  sanitiseFilename,
  uniqueBy,
}

export default Helpers