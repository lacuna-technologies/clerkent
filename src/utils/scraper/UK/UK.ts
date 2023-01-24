import BAILII from './BAILII'
import Common from '../common'
import Custom from '../custom'
import { sortUKCases } from '../../Finder/CaseCitationFinder/UK'
import Constants from '../../Constants'
import { databaseUseDatabase, databaseUseJurisdiction, makeEventTarget } from '../utils'
import UKIPO from './UKIPO'

const databaseUseUK = databaseUseJurisdiction(`UK`)
const databaseUseBailii = databaseUseDatabase(`bailii`, databaseUseUK)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseUK)
const databaseUseIPO = databaseUseDatabase(`ipo`, databaseUseUK)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseBailii(() => BAILII.getCaseByName(caseName)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.UK.name)),
    databaseUseIPO(() => UKIPO.getCaseByName(caseName)),
    Custom.getCaseByName(caseName),
  ],
  `UK`,
  sortUKCases,
  true,
)

const getCaseByCitation = (citation: string, court: string): EventTarget => makeEventTarget(
  citation,
  court === `UKIPO` ? [
    databaseUseIPO(() => UKIPO.getCaseByCitation(citation)),
  ] : [
    Custom.getCaseByCitation(citation, court),
    databaseUseBailii(() => BAILII.getCaseByCitation(citation)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
  ],
  `UK`,
  sortUKCases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.UK_bailii.id]: BAILII,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
  [Constants.DATABASES.UK_ipo.id]: UKIPO,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const UK = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default UK