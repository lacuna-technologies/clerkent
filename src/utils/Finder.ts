import Constants from './Constants'
import type Law from '../types/Law'
export interface FinderResult {
  jurisdiction: Law.JursidictionCode
  citation: string,
  index: number,
  court? : string
}

// const emptyParseResult: ParseResult = {
//   citation: undefined,
//   jurisdiction: undefined,
// }

// const parseQuery = (query: string): ParseResult => {
//   const cleanedQuery = query.trim()
//   return parseSGCase(cleanedQuery) || emptyParseResult
// }

// const inSLW = (query: string) => {
//   const eligibleCourt = Array.isArray(query.match(/SGCA|SGHC/))

//   const yearRegex = /^\[(2\d{3})]/
//   const yearMatch = query.match(yearRegex)
//   const eligibleYear = Array.isArray(yearMatch) && Number.parseInt(yearMatch[1]) >= 2000

//   return eligibleCourt && eligibleYear
// }

// const inSGSC = (query: string) => inSLW(query)

const findCase = (query: string): FinderResult[] => {
  return [
    ...findSGCase(query),
    ...findUKCase(query),
    ...findEUCase(query),
    ...findHKCase(query),
  ]
}

const findSGCase = (query: string): FinderResult[] => {
  const regex = /\[[12]\d{3}]( \d{1,2})? (sgca|sghc|sgdc|sgmc|slr(\(r\))?) \d{1,4}/gi
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
    }))
  }
  return []
}

const findUKCase = (query:string): FinderResult[] => {
  const abbrs = [
    {
      abbr: `EWCA`,
      appendum: `( Civ)?`,
    },
    {
      abbr: `EWHC`,
      appendum: `( Patents)?`,
    },
    {
      abbr: `UKSC`,
    },
    {
      abbr: `UKPC`,
    },
    {
      abbr: `UKHL`,
    },
    {
      abbr: `AC`,
    },
    {
      abbr: `UKHL`,
    },
    {
      abbr: `Ch`,
      appendum: `( D)?`,
    },
    {
      abbr: `QB`,
      appendum: `(D)?`,
    },
    {
      abbr: `KB`,
    },
    {
      abbr: `WLR`,
      appendum: `( \\(D\\))?`,
    },
    {
      abbr: `All ER`,
      appendum: `( \\(D\\))?`,
    },
    {
      abbr: `BCLC`,
    },
    {
      abbr: `BCC`,
    },
    {
      abbr: `HL Cas`,
    },
    {
      abbr: `App Cas`,
    },
    {
      abbr: `Ld Raym`,
    },
    {
      abbr: `FSR`,
    },
    {
      abbr: `ECC`,
    },
    {
      abbr: `ITCLR`,
    },
    {
      abbr: `RPC`,
    },
    {
      abbr: `Ex Rep`,
    },
    {
      abbr: `ER`,
    },
  ].map(({ abbr, appendum }) => `${abbr
    .split(``)
    .map(letter =>
      /[a-z]/i.test(letter)
        ? letter+`\\.?`
        : letter,
    ).join(``)
    }${appendum ? appendum : ``}`,
  ).join(`|`)
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/((\[|\()[12]\d{3}(-[12]\d{3})?(\]|\)))/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.UK.id,
    }))
  }
  return []
}

export const epoRegex = new RegExp(/T ?\d{1,4}\/\d{1,2}/)
export const cjeuRegex = new RegExp(/[CT]-\d{1,3}\/\d{1,2}/)

const findEUCase = (query: string): FinderResult[] => {
  const regex = new RegExp(`(${epoRegex.source})|(${cjeuRegex.source})`, `gi`)
  const cleanedQuery = query.replaceAll(`‑`, `-`)

  const matches = [...cleanedQuery.matchAll(regex)]
  if(matches.length > 0){
    return matches.map((match) => ({
      citation: match[0],
      court: match[1] ? Constants.COURTS.EU_epo.id : Constants.COURTS.EU_cjeu.id,
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.EU.id,
    }))
  }
  return []
}

const findHKCase = (query: string): FinderResult[] => {
  const regex = /\[[12]\d{3}] (HKCA|HKCFA|HKCFI) \d{1,4}/g
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.HK.id,
    }))
  }
  return []
}

const Finder = {
  findCase,
  findEUCase,
  findHKCase,
  findSGCase,
  findUKCase,
}

export default Finder