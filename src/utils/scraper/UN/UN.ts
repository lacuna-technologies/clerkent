
import ICJCIJ from './ICJCIJ'
import Constants from '../../Constants'
import { databaseUseDatabase, databaseUseJurisdiction, makeEventTarget } from '../utils'
import { sortUNCases } from 'utils/Finder/CaseCitationFinder/UN'

const databaseUseUN = databaseUseJurisdiction(`UN`)
const databaseUseICJCIJ = databaseUseDatabase(`icjcij`, databaseUseUN)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseICJCIJ(() => ICJCIJ.getCaseByName(caseName)),
  ],
  `UN`,
  sortUNCases,
  true,
)

const getCaseByCitation = (
  citation: string,
): EventTarget => makeEventTarget(
  citation,
  [],
  `UN`,
  sortUNCases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.UN_icjcij.id]: ICJCIJ,
}

const getPDF = async (
  inputCase: Law.Case,
  inputDocumentType: Law.Link[`doctype`],
): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const UN = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default UN