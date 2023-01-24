import HKLIIORG from './HKLIIORG'
import LRS from './LRS'
import Common from '../common'
import Constants from '../../Constants'
import { sortHKCases } from '../../Finder/CaseCitationFinder/HK'
import { databaseUseDatabase, databaseUseJurisdiction, makeEventTarget } from '../utils'

const databaseUseHK = databaseUseJurisdiction(`HK`)
const databaseUseLRS = databaseUseDatabase(`lrs`, databaseUseHK)
const databaseUseHKLIIIORG = databaseUseDatabase(`hkliiorg`, databaseUseHK)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseHK)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseLRS(() => LRS.getCaseByName(caseName)),
    databaseUseHKLIIIORG(() => HKLIIORG.getCaseByName(caseName)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.HK.name)),
  ],
  `HK`,
  sortHKCases,
  true,
)

const getCaseByCitation = (citation: string): EventTarget => makeEventTarget(
  citation,
  [
    databaseUseLRS(() => LRS.getCaseByCitation(citation)),
    databaseUseHKLIIIORG(() => HKLIIORG.getCaseByCitation(citation)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
  ],
  `HK`,
  sortHKCases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.HK_lrs.id]: LRS,
  [Constants.DATABASES.HK_hkliiorg.id]: HKLIIORG,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const HK = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default HK