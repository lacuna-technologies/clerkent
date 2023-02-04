import austlii from './austlii'
import Common from '../common'
import Constants from '../../Constants'
import { findAUCaseCitation, sortAUCases } from '../../Finder/CaseCitationFinder/AU'
import { databaseUseJurisdiction, databaseUseDatabase, makeEventTarget } from '../utils'
import CommonLII from '../common/CommonLII'
import QueenslandJudgments from './QueenslandJudgments'
import QueenslandSCL from './QueenslandSCL'
import NSWCaseLaw from './NSWCaseLaw'
import VictoriaLawLibrary from './VictoriaLawLibrary'
import HCA from './HCA'
import Logger from 'utils/Logger'

const databaseUseAU = databaseUseJurisdiction(`AU`)
const databaseUseAustLII = databaseUseDatabase(`austlii`, databaseUseAU)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseAU)
const databaseUseQueenslandJudgments = databaseUseDatabase(`queensland_judgments`, databaseUseAU)
const databaseUseQueenslandSCL = databaseUseDatabase(`queensland_scl`, databaseUseAU)
const databaseUseNSWCaseLaw = databaseUseDatabase(`nsw_caselaw`, databaseUseAU)
const databaseUseVictoriaLawLibrary = databaseUseDatabase(`victoria_lawlibrary`, databaseUseAU)
const databaseUseHCA = databaseUseDatabase(`hca`, databaseUseAU)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseHCA(() => HCA.getCaseByName(caseName)),
    databaseUseQueenslandJudgments(() => QueenslandJudgments.getCaseByName(caseName)),
    databaseUseQueenslandSCL(() => QueenslandSCL.getCaseByName(caseName)),
    databaseUseNSWCaseLaw(() => NSWCaseLaw.getCaseByName(caseName)),
    databaseUseVictoriaLawLibrary(() => VictoriaLawLibrary.getCaseByName(caseName)),
    databaseUseAustLII(() => austlii.getCaseByName(caseName)),
    databaseUseCommonLII(() => CommonLII.getCaseByName(caseName)),
  ],
  `AU`,
  sortAUCases,
  true,
)

const getApplicableDatabases = (citation: string) => {
  const [{ abbr }] = findAUCaseCitation(citation)
  const defaultDatabases = [
    databaseUseAustLII(() => austlii.getCaseByCitation(citation)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
  ]

  switch(abbr){
    // HCA
    case `HCA`: {
      return [
        databaseUseHCA(() => HCA.getCaseByCitation(citation)),
        ...defaultDatabases,
      ]
    }

    // New South Wales
    case `NSWSC`:
    case `NSWCA`:
    case `NSWCCA`:
    case `NSWDC`:
    case `NSWLEC`:
    case `NSWLC`:
    case `NSWIRComm`:
    case `NSWDRGC`:
    case `NSWCC`:
    case `NSWChC`:
    case `NSWADTAP`:
    case `NSWADT`:
    case `NSWCATAP`:
    case `NSWCATAD`:
    case `NSWCATCD`:
    case `NSWCATGD`:
    case `NSWCATOD`:
    case `NSWDDT`:
    case `NSWEOT`:
    case `NSWFTT`:
    case `NSWLST`:
    case `NSWMT`:
    case `NSWTAB`: {
      return [
        databaseUseNSWCaseLaw(() => NSWCaseLaw.getCaseByCitation(citation)),
        ...defaultDatabases,
      ]
    }
    // Queensland
    case `QR`:
    case `QCA`:
    case `QSC`:
    case `QSCPR`:
    case `QSCFC`:
    case `QDC`:
    case `QDCPR`:
    case `QMC`:
    case `QCATA`:
    case `QCAT`:
    case `QPEC`:
    case `QLAC`:
    case `QLC`:
    case `ICQ`:
    case `QIRC`:
    case `QChC`:
    case `QChCM`:
    case `QHPT`: {
      return [
        databaseUseQueenslandJudgments(() => QueenslandJudgments.getCaseByCitation(citation)),
        databaseUseQueenslandSCL(() => QueenslandSCL.getCaseByCitation(citation)),
        ...defaultDatabases,
      ]
    }
    // Victoria
    case `VSCA`:
    case `VicSC`:
    case `VSC`:
    case `VR`:
    case `VicCorC`:
    case `VCC`:
    case `VMC`:
    case `VicRp`:
    case `VicLawRp`:
    case `VLR`: {
      return [
        databaseUseVictoriaLawLibrary(() => VictoriaLawLibrary.getCaseByCitation(citation)),
        ...defaultDatabases,
      ]
    }
    default: {
      return defaultDatabases
    }
  }
}

const getCaseByCitation = (citation: string): EventTarget => makeEventTarget(
  citation,
  getApplicableDatabases(citation),
  `AU`,
  sortAUCases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.AU_austlii.id]: austlii,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
  [Constants.DATABASES.AU_victoria_lawlibrary.id]: VictoriaLawLibrary,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const AU = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default AU