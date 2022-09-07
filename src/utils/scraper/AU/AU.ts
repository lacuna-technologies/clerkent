import austlii from './austlii'
import Common from '../common'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { findAUCaseCitation, sortAUCitations } from '../../Finder/CaseCitationFinder/AU'
import Helpers from '../../Helpers'
import { sortByName, databaseUseJurisdiction, databaseUseDatabase } from '../utils'
import CommonLII from '../common/CommonLII'
import QueenslandJudgments from './QueenslandJudgments'
import QueenslandSCL from './QueenslandSCL'
import NSWCaseLaw from './NSWCaseLaw'

const databaseUseAU = databaseUseJurisdiction(`AU`)
const databaseUseAustLII = databaseUseDatabase(`austlii`, databaseUseAU)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseAU)
const databaseUseQueenslandJudgments = databaseUseDatabase(`queensland_judgments`, databaseUseAU)
const databaseUseQueenslandSCL = databaseUseDatabase(`queensland_scl`, databaseUseAU)
const databaseUseNSWCaseLaw = databaseUseDatabase(`nsw_caselaw`, databaseUseAU)

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUseQueenslandJudgments(() => QueenslandJudgments.getCaseByCitation(caseName)),
      databaseUseQueenslandSCL(() => QueenslandSCL.getCaseByCitation(caseName)),
      databaseUseNSWCaseLaw(() => NSWCaseLaw.getCaseByCitation(caseName)),
      databaseUseAustLII(() => austlii.getCaseByName(caseName)),
      databaseUseCommonLII(() => CommonLII.getCaseByName(caseName)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.AU.id)

    return sortByName(
      caseName,
      sortAUCitations(
        Helpers.uniqueBy(results, `citation`),
        `citation`,
      ),
    ) 
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getApplicableDatabases = (citation: string) => {
  const [{ abbr }] = findAUCaseCitation(citation)
  const defaultDatabases = [
    databaseUseAustLII(() => austlii.getCaseByCitation(citation)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
  ]
  switch(abbr){
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
    case `NSWTAB`:
      return [
        databaseUseNSWCaseLaw(() => NSWCaseLaw.getCaseByCitation(citation)),
        ...defaultDatabases,
      ]
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
    case `QHPT`:
      return [
        databaseUseQueenslandJudgments(() => QueenslandJudgments.getCaseByCitation(citation)),
        databaseUseQueenslandSCL(() => QueenslandSCL.getCaseByCitation(citation)),
        ...defaultDatabases,
      ]
    default: {
      return defaultDatabases
    }
  }
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled(
      getApplicableDatabases(citation),
    )).filter(({ status }) => status === `fulfilled`)
      .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
      .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.AU.id)

    return sortAUCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error){
    Logger.error(error)
  }
  return []
}

const databaseMap = {
  [Constants.DATABASES.AU_austlii.id]: austlii,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
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