import canlii from './canlii'
import Common from '../common'
import Constants from '../../Constants'
import { sortCACases } from '../../Finder/CaseCitationFinder/CA'
import { databaseUseDatabase, databaseUseJurisdiction, makeEventTarget } from '../utils'

const databaseUseCA = databaseUseJurisdiction(`CA`)
const databaseUseCanlii = databaseUseDatabase(`canlii`, databaseUseCA)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseCA)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseCanlii(() => canlii.getCaseByName(caseName)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.CA.name)),
  ],
  `CA`,
  sortCACases,
  true,
)

const getCaseByCitation = (citation: string ): EventTarget => makeEventTarget(
  citation,
  [
    databaseUseCanlii(() => canlii.getCaseByCitation(citation)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
  ],
  `CA`,
  sortCACases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.CA_canlii.id]: canlii,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const CA = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default CA