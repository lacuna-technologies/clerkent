
import ICJCIJ from './ICJCIJ'
import Constants from '../../Constants'
import Logger from '../../Logger'
import { databaseUseDatabase, databaseUseJurisdiction } from '../utils'

const databaseUseUN = databaseUseJurisdiction(`UN`)
const databaseUseICJCIJ = databaseUseDatabase(`icjcij`, databaseUseUN)

const getLegislation = () => null

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    return (await Promise.allSettled([
      databaseUseICJCIJ(() => ICJCIJ.getCaseByName(caseName)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({
      jurisdiction,
    }) => (
      jurisdiction === Constants.JURISDICTIONS.UN.id
    ))
  } catch (error) {
    Logger.error(error)
    return []
  }
}

const getCaseByCitation = async (
  citation: string,
  court: string,
): Promise<Law.Case[]> => {
  return []
}

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
  getLegislation,
  getPDF,
}

export default UN