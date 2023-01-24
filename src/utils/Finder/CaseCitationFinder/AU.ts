import Constants from '../../Constants'
import { formatAbbrs, sortCasesByVolume } from './utils'

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

  { abbr: `NSWSC` },
  { abbr: `QSC` },
  { abbr: `QSCPR` },
  { abbr: `QSCFC` },
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
  { abbr: `NSWLC` },
  { abbr: `NSWLEC` },
  { abbr: `NSWIRComm` },
  { abbr: `NSWDRGC` },
  { abbr: `NSWChC` },
  { abbr: `NSWADTAP` },
  { abbr: `NSWADT` },
  { abbr: `NSWCATAP` },
  { abbr: `NSWCATAD` },
  { abbr: `NSWCATCD` },
  { abbr: `NSWCATGD` },
  { abbr: `NSWCATOD ` },
  { abbr: `NSWDDT` },
  { abbr: `NSWEOT` },
  { abbr: `NSWFTT` },
  { abbr: `NSWLST` },
  { abbr: `NSWMT` },
  { abbr: `NSWTAB` },
  { abbr: `QDC` },
  { abbr: `QDCPR` },
  { abbr: `QMC` },
  { abbr: `QCATA` },
  { abbr: `QCAT` },
  { abbr: `QPEC` },
  { abbr: `QLAC` },
  { abbr: `QLC` },
  { abbr: `ICQ` },
  { abbr: `QIRC` },
  { abbr: `QChC` },
  { abbr: `QChCM` },
  { abbr: `QMHC` },
  { abbr: `QIC` },
  { abbr: `QLC` },
  { abbr: `QHPT` },
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
  { abbr: `ACLR` },
]

export const sortAUCases = (
  citationsArray: Law.Case[],
  attribute: string,
): Law.Case[] => sortCasesByVolume(AUAbbrs, citationsArray, attribute)

export const findAUCaseCitationMatches = (query: string) => {
   // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,3})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs(AUAbbrs)
  const regex = new RegExp(
    `(?<year>${yearRegex.source})`+
    `(?<volume>${volumeRegex.source}) `+
    `(?<abbr>${abbrs}) `+
    `${pageRegex.source}`, `gi`)

  return [...query.matchAll(regex)]
}

export const findAUCaseCitation = (query: string): Finder.CaseCitationFinderResult[] => {
  const matches = findAUCaseCitationMatches(query)
  if (matches.length > 0) {
    return matches.map((match) => ({
      abbr: match.groups.abbr,
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
      year: match.groups.year,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}