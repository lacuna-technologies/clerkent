import Kehakiman from './Kehakiman'
import Common from '../common'
import Constants from '../../Constants'
import { sortMYCases } from '../../Finder/CaseCitationFinder/MY'
import { databaseUseDatabase, databaseUseJurisdiction, makeEventTarget } from '../utils'

const databaseUseMY = databaseUseJurisdiction(`MY`)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseMY)
const databaseUseKehakiman = databaseUseDatabase(`kehakiman`, databaseUseMY)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseCommonLII(() => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.MY.name)),
    databaseUseKehakiman(() => Kehakiman.getCaseByName(caseName)),
  ],
  `MY`,
  sortMYCases,
  true,
)

const getCaseByCitation = (citation: string): EventTarget => makeEventTarget(
  citation,
  [
    databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
    databaseUseKehakiman(() => Kehakiman.getCaseByCitation(citation)),
  ],
  `MY`,
  sortMYCases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const MY = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default MY