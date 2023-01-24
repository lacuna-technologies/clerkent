
import HUDOC from './HUDOC'
import Constants from '../../Constants'
import { databaseUseDatabase, databaseUseJurisdiction, makeEventTarget } from '../utils'
import { sortECHRCases } from 'utils/Finder/CaseCitationFinder/ECHR'

const databaseUseECHR = databaseUseJurisdiction(`ECHR`)
const databaseUseHUDOC = databaseUseDatabase(`hudoc`, databaseUseECHR)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseHUDOC(() => HUDOC.getCaseByName(caseName)),
  ],
  `ECHR`,
  sortECHRCases,
  true,
)

const getCaseByCitation = (
  citation: string,
): EventTarget => makeEventTarget(
  citation,
  [
    databaseUseHUDOC(() => HUDOC.getCaseByCitation(citation)),
  ],
  `ECHR`,
  sortECHRCases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.ECHR_hudoc.id]: HUDOC,
}

const getPDF = async (
  inputCase: Law.Case,
  inputDocumentType: Law.Link[`doctype`],
): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const ECHR = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default ECHR