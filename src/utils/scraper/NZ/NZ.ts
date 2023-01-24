import nzlii from './nzlii'
import Common from '../common'
import Constants from '../../Constants'
import { sortNZCases } from '../../Finder/CaseCitationFinder/NZ'
import { databaseUseDatabase, databaseUseJurisdiction, makeEventTarget } from '../utils'

const databaseUseNZ = databaseUseJurisdiction(`NZ`)
const databaseUseNZLII = databaseUseDatabase(`nzlii`, databaseUseNZ)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseNZ)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseNZLII(() => nzlii.getCaseByName(caseName)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.NZ.name)),
  ],
  `NZ`,
  sortNZCases,
  true,
)

const getCaseByCitation = (citation: string): EventTarget => makeEventTarget(
  citation,
  [
    databaseUseNZLII(() => nzlii.getCaseByCitation(citation)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
  ],
  `NZ`,
  sortNZCases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.NZ_nzlii.id]: nzlii,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const NZ = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default NZ