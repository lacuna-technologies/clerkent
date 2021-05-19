import Law from "../../types/Law"
import Constants from "../Constants"

export interface LegislationFinderResult {
  provisionType: string,
  provisionNumber: string,
  statute: string,
  type: `legislation`,
  jurisdiction: Law.JursidictionCode
}

const unabbreviateStatute = (abbrStatute: string) => {
  const abbrs = [
    {
      abbrs: [`pofma`, `pofma 2019`, `pofma 19`, `fake news law`],
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      name: `Protection from Online Falsehoods and Manipulation Act 2019`,
    },
  ]
  const isMatch = abbrs.filter(abbr => abbr.abbrs.includes(abbrStatute.trim().toLowerCase()))

  if(isMatch.length === 0){
    return [{ name: abbrStatute }]
  }
  return isMatch.map(({ name, jurisdiction }) => ({ jurisdiction, name }))
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
]
const provisionRegex = provisionAbbreviations.map((a) => a.abbrs.join(`|`)).join(`|`)

const unabbreviateProvision = (provisionType) => {
  const isMatch = provisionAbbreviations.filter(({ abbrs }) => abbrs.includes(provisionType.trim().toLowerCase()))
  if(isMatch.length === 1){
    return isMatch[0].name
  }
  return provisionType
}

const findLegislation = (citation: string): LegislationFinderResult[] => {
  // eslint-disable-next-line unicorn/better-regex
  const regex = new RegExp(`((?<provision>(${provisionRegex}) ?\\d{1,4})[ ,]*)?(?<statute>[A-Z]{2,}[ ,A-Z]*( ?[12]\\d{3})?)`, `gi`)
  const cleanedCitation = citation.trim()
  const matches = [...cleanedCitation.matchAll(regex)]
    .map(([_1, _2, provision, _3, statute]) => {
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