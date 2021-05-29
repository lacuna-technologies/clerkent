import Constants from '../../Constants'
import { formatAbbrs, sortCitationsByVolume } from './utils'
import type { CaseCitationFinderResult } from './types'

export const AUAbbrs = [
  { abbr: `HCA` },
  { abbr: `UKPCHCA` },
  { abbr: `FamCA` },
  { abbr: `HCASum` },
  { abbr: `NSWSC` },
  { abbr: `NSWCA` },
  { abbr: `NSWCCA` },
  { abbr: `NSWCIMC` },
  { abbr: `NSWCC` },
  { abbr: `NSWDC` },
  { abbr: `NSWDRGC` },
  { abbr: `NSWIC` },
  { abbr: `NSWKnoxRp` },
  { abbr: `NSWLR` },
  { abbr: `NSWR` },
  { abbr: `SR \\(NSW\\)`},
  { abbr: `CLR` },
  { abbr: `FCA` },
  { abbr: `FCAFC` },
  { abbr: `FCCA` },
  { abbr: `FMCA` },
  { abbr: `FMCAfam` },
  { abbr: `IRCA` },
  { abbr: `FCR` },
  { abbr: `ALR` },
  { abbr: `QCA` },
  { abbr: `QSC` },
  { abbr: `QDC` },
  { abbr: `QChC` },
  { abbr: `QChCM` },
  { abbr: `ICQ` },
  { abbr: `QIC` },
  { abbr: `QLC` },
  { abbr: `VSC` },
  { abbr: `VicSC` },
  { abbr: `VSCA` },
  { abbr: `VicCorC` },
  { abbr: `VCC` },
  { abbr: `VMC` },
  { abbr: `VicRp` },
  { abbr: `VicLawRp` },
  { abbr: `WASC` },
  { abbr: `WASCA` },
  { abbr: `WALawRp` },
  { abbr: `WADC` },
  { abbr: `FWCA` },
  { abbr: `FCWAM` },
  { abbr: `WACIC` },
  { abbr: `WAGAB` },
  { abbr: `WASupC` },
  { abbr: `WAR` },
  { abbr: `TASSC` },
  { abbr: `TASFC` },
  { abbr: `TASCCA` },
  { abbr: `TASMC` },
  { abbr: `TASSupC` },
  { abbr: `TASLawRp` },
  { abbr: `TASStRp` },
  { abbr: `TASRp` },
  { abbr: `TASADT` },
  { abbr: `TASFPT` },
  { abbr: `SASC` },
  { abbr: `SASCA` },
  { abbr: `SASCFC` },
  { abbr: `SADC` },
  { abbr: `SAERDC` },
  { abbr: `SALC` },
  { abbr: `SAPelhamRp` },
  { abbr: `SAIRC` },
  { abbr: `SAIndRp` },
  { abbr: `SALawRp` },
  { abbr: `SAStRp` },
  { abbr: `SAWC` },
  { abbr: `SACAT` },
  { abbr: `NTSC` },
  { abbr: `NTCA` },
  { abbr: `NTCCA` },
  { abbr: `NTMC` },
  { abbr: `NTJud` },
  { abbr: `NTLC` },
  { abbr: `ACTCA` },
  { abbr: `ACTSCFC` },
  { abbr: `ACTSC` },
  { abbr: `ACTCD` },
  { abbr: `ACTIC` },
  { abbr: `ACTMC` },
  { abbr: `ACAT` },
  { abbr: `ADO` },
  { abbr: `AUDND` },
  { abbr: `NFSC` },
]

export const sortAUCitations = (citationsArray: any[], attribute = null) => sortCitationsByVolume(AUAbbrs, citationsArray, attribute)

export const findAUCaseCitationMatches = (query: string) => {
   // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs(AUAbbrs)
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  return [...query.matchAll(regex)]
}

export const findAUCaseCitation = (query: string): CaseCitationFinderResult[] => {
  const matches = findAUCaseCitationMatches(query)
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}