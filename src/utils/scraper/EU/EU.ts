import CURIA from './CURIA'
import EPO from './EPO'
import Constants from '../../Constants'
import { databaseUseDatabase, databaseUseJurisdiction, makeEventTarget } from '../utils'
import { sortEUCases } from 'utils/Finder/CaseCitationFinder/EU'

const databaseUseEU = databaseUseJurisdiction(`EU`)
const databaseUseCURIA = databaseUseDatabase(`curia`, databaseUseEU)
const databaseUseEPO = databaseUseDatabase(`epo`, databaseUseEU)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseCURIA(() => CURIA.getCaseByName(caseName)),
  ],
  `EU`,
  sortEUCases,
  true,
)

const getCaseByCitation = (citation: string, court: string): EventTarget => makeEventTarget(
  citation,
  court === `EPO` ? [
    databaseUseEPO(() => EPO.getCaseByCitation(citation)),
  ] : [
    databaseUseCURIA(() => CURIA.getCaseByCitation(citation)),
  ],
  `EU`,
  sortEUCases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.EU_curia.id]: CURIA,
  [Constants.DATABASES.EU_epo.id]: EPO,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const EU = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default EU