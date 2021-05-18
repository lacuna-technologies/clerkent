import Constants from "../Constants"

const unabbreviateStatute = (abbrStatute) => {
  const abbrs = [
    {
      abbrs: [`pofma`, `pofma 2019`, `pofma 19`, `fake news law`],
      jurisdiction: Constants.JURISDICTIONS.SG,
      name: `Protection from Online Falsehoods and Manipulation Act 2019`,
    },
  ]
  const isMatch = abbrs.filter(abbr => abbr.abbrs.includes(abbrStatute.trim().toLowerCase()))

  if(isMatch.length === 0){
    return [abbrStatute]
  }
  return isMatch.map(a => a.name)
}

const findLegislation = (citation: string) => {
  const regex = new RegExp(/((?<provision>(s|sec|section|r|rule|art|article) ?\d{1,4})[ ,]*)?(?<statute>[A-Z]{2,}[ ,A-Z]*( ?[12]\d{3})?)/, `gi`)
  const cleanedCitation = citation.trim()
  const matches = [...cleanedCitation.matchAll(regex)]
    .map(([_1, _2, provision, _3, statute]) => ({
      provision,
      statute,
      type: `legislation`,
    }))
  return matches.reduce((current, { statute, ...attributes }) => {
    return [
      ...current,
      ...unabbreviateStatute(statute).map((s, index) => ({ jurisdiction: index, statute: s, ...attributes })),
    ]
  }, [])
}

const LegislationFinder = {
  findLegislation,
}

export default LegislationFinder