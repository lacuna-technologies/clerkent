import Helpers from 'utils/Helpers'
import StatuteAbbrs from './StatuteAbbrs'

const unabbreviateStatute = (abbrStatute: string) => {
  const makeRegex = (string: string) => {
    const escapedString = Helpers.escapeRegExp(string)
    return (new RegExp(`\\b${escapedString}\\b`, `i`))
  }
  const isMatch = StatuteAbbrs
    .map(abbr => ({ ...abbr, match: abbr.abbrs.find((currentAbbr) => makeRegex(currentAbbr).test(abbrStatute)) }))
    .filter(({ match }) => match)

  if(isMatch.length === 0){
    return [{ name: abbrStatute }]
  }
  return isMatch.map(({ name, jurisdiction, match }) => ({
    jurisdiction,
    name: abbrStatute.replace(makeRegex(match), name),
  }))
}

const provisionAbbreviations = [
  {
    abbrs: [`s`, `sec`, `section`],
    name: `Section`,
  },
  {
    abbrs: [`r`, `rule`],
    name: `Rule`,
  },
  {
    abbrs: [`art`, `article`],
    name: `Article`,
  },
  {
    abbrs: [`o`, `order`],
    name: `Order`,
  },
  {
    abbrs: [`reg`, `regulation`],
    name: `Regulation`,
  },
]
const provisionTypeRegex = provisionAbbreviations.map((a) => a.abbrs.join(`|`)).join(`|`)
const provisionSubsectionRegex = new RegExp(`\\(\\d{1,2}[A-Z]{0,2}\\)`)

const unabbreviateProvision = (provisionType: string) => {
  const isMatch = provisionAbbreviations.filter(({ abbrs }) => abbrs.includes(provisionType.trim().toLowerCase()))
  if(isMatch.length === 1){
    return isMatch[0].name
  }
  return provisionType
}

const findLegislation = (citation: string): Finder.LegislationFinderResult[] => {
  // eslint-disable-next-line unicorn/better-regex
  const regex = new RegExp(`((?<provision>(${provisionTypeRegex}) ?\\d{1,4}(${provisionSubsectionRegex.source})*)[ ,]*)?(?<statute>[A-Z]{2,}[ ,A-Z]*( ?[12]\\d{3})?)`, `gi`)
  const cleanedCitation = citation.trim()
  const matches = [...cleanedCitation.matchAll(regex)]
    .map(([_1, _2, provision, _3, _4, statute]) => {
      if(!provision){
        return {
          provisionNumber: false,
          provisionType: false,
          statute,
          type: `legislation`,
        }
      }
      const [_, provisionType, provisionNumber] = provision.match(/([a-z]+) ?(\d+[a-z]*)/i)
      return {
        provisionNumber,
        provisionType: unabbreviateProvision(provisionType),
        statute,
        type: `legislation`,
      }
    })

  return matches.reduce((current, { statute, ...attributes }) => {
    return [
      ...current,
      ...unabbreviateStatute(statute)
        .map(({ name, jurisdiction }) => ({
          ...attributes,
          ...(jurisdiction ? { jurisdiction } : {}),
          statute: name,
        })),
    ]
  }, [])
}

const LegislationFinder = {
  findLegislation,
}

export default LegislationFinder