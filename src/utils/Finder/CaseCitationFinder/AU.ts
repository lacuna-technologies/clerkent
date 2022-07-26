import Constants from '../../Constants'
import { formatAbbrs, sortCitationsByVolume } from './utils'

export const AUAbbrs = [
  // approximate order only
  // TODO: put this in a proper, definitive order
  { abbr: `HCA` },
  { abbr: `UKPCHCA` },
  { abbr: `FCA` },
  { abbr: `FCAFC` },
  { abbr: `FCCA` },
  { abbr: `FamCA` },
  { abbr: `HCASum` },

  { abbr: `NSWSC` },
  { abbr: `QSC` },
  { abbr: `VicSC` },
  { abbr: `VSC` },
  { abbr: `SASC` },
  { abbr: `WASC` },
  { abbr: `WASupC` },
  { abbr: `TASSC` },
  { abbr: `TASSupC` },
  { abbr: `NTSC` },
  { abbr: `ACTSC` },
  { abbr: `NFSC` },

  { abbr: `NSWCA` },
  { abbr: `VSCA` },
  { abbr: `QCA` },
  { abbr: `NSWCCA` },
  { abbr: `WASCA` },
  { abbr: `FMCA` },
  { abbr: `FMCAfam` },
  { abbr: `TASCCA` },
  { abbr: `IRCA` },
  { abbr: `FWCA` },
  { abbr: `NTCA` },
  { abbr: `NTCCA` },
  { abbr: `ACTCA` },

  { abbr: `NSWLR` },
  { abbr: `NSWR` },
  { abbr: `CLR` },
  { abbr: `WALawRp` },
  { abbr: `SR \\(NSW\\)`},
  { abbr: `FCR` },
  { abbr: `ALR` },
  { abbr: `ALJ` },
  { abbr: `ALJR` },

  { abbr: `NSWCIMC` },
  { abbr: `NSWCC` },
  { abbr: `NSWDC` },
  { abbr: `NSWDRGC` },
  { abbr: `NSWIC` },
  { abbr: `NSWKnoxRp` },
  { abbr: `QDC` },
  { abbr: `QChC` },
  { abbr: `QChCM` },
  { abbr: `ICQ` },
  { abbr: `QIC` },
  { abbr: `QLC` },
  { abbr: `VR` },
  { abbr: `VicCorC` },
  { abbr: `VCC` },
  { abbr: `VMC` },
  { abbr: `VicRp` },
  { abbr: `VicLawRp` },
  { abbr: `VLR` },
  { abbr: `TASFC` },
  { abbr: `WADC` },
  { abbr: `FCWAM` },
  { abbr: `WACIC` },
  { abbr: `WAGAB` },
  { abbr: `WAR` },
  { abbr: `SASCA` },
  { abbr: `TASMC` },
  { abbr: `TASLawRp` },
  { abbr: `TASStRp` },
  { abbr: `TASRp` },
  { abbr: `TASADT` },
  { abbr: `TASFPT` },
  { abbr: `Tas SR` },
  { abbr: `SASCFC` },
  { abbr: `SASR` },
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
  { abbr: `NTMC` },
  { abbr: `NTJud` },
  { abbr: `NTLC` },
  { abbr: `ACTSCFC` },
  { abbr: `ACTCD` },
  { abbr: `ACTIC` },
  { abbr: `ACTMC` },
  { abbr: `ACAT` },
  { abbr: `ADO` },
  { abbr: `AUDND` },
  { abbr: `ACSR` },
  { abbr: `ACLC` },
  { abbr: `ATC` }, // Australian Tax Cases
]

export const sortAUCitations = (citationsArray: any[], attribute = null) => sortCitationsByVolume(AUAbbrs, citationsArray, attribute)

export const findAUCaseCitationMatches = (query: string) => {
   // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,3})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs(AUAbbrs)
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  return [...query.matchAll(regex)]
}

export const findAUCaseCitation = (query: string): Finder.CaseCitationFinderResult[] => {
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