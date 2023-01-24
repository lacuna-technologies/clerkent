import { databaseUseDatabase, databaseUseJurisdiction, makeEventTarget } from '../utils'
import { sortSGCases } from 'utils/Finder/CaseCitationFinder/SG'
import Common from '../common'
import Constants from 'utils/Constants'
import eLitigation from './eLitigation'
import Finder from 'utils/Finder'
import IPOS from './IPOS'
import Logger from 'utils/Logger'
import OpenLaw from './OpenLaw'
import SLW from './SLW'
import STB from './STB'
import { Downloads } from 'webextension-polyfill-ts'
import LawNet from './LawNet'

const databaseUseSG = databaseUseJurisdiction(`SG`)
const databaseUseeLitigation = databaseUseDatabase(`elitigation`, databaseUseSG)
const databaseUseOpenLaw = databaseUseDatabase(`openlaw`, databaseUseSG)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseSG)
const databaseUseIPOS = databaseUseDatabase(`ipos`, databaseUseSG)
const databaseUseSTB = databaseUseDatabase(`stb`, databaseUseSG)
const databaseUseSLW = databaseUseDatabase(`slw`, databaseUseSG)
const databaseUseLawNet = databaseUseDatabase(`lawnetsg`, databaseUseSG)

const getCaseByName = (caseName: string): EventTarget => makeEventTarget(
  caseName,
  [
    databaseUseeLitigation(() => eLitigation.getCaseByName(caseName)),
    databaseUseOpenLaw(() => OpenLaw.getCaseByName(caseName)),
    databaseUseCommonLII(() => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.SG.name)),
    databaseUseLawNet(() => LawNet.getCaseByName(caseName)),
    databaseUseIPOS(() => IPOS.getCaseByName(caseName)),
    databaseUseSTB(() => STB.getCaseByName(caseName)),
  ],
  `SG`,
  sortSGCases,
  true,
)

const getApplicableDatabases = (citation: string) => {
  const [{ year, abbr }] = Finder.findCaseCitation(citation)
  switch (abbr) {
    case `SGIPOS`: {
      return [databaseUseIPOS(() => IPOS.getCaseByCitation(citation))]
    }
    case `SGPDPC`: 
    case `SGPDPCR`: {
      // SLW is best source for now
      // PDPC's website does not include citations
      return [databaseUseSLW(() => SLW.getCaseByCitation(citation))]
    }
    case `SGSTB`: {
      return [databaseUseSTB(() => STB.getCaseByCitation(citation))]
    }
    default: {
      return Number.parseInt(year, 10) >= 2000 ? [
          databaseUseeLitigation(() => eLitigation.getCaseByCitation(citation)),
          databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
          databaseUseLawNet(() => LawNet.getCaseByCitation(citation)),
        ] : [
          databaseUseOpenLaw(() => OpenLaw.getCaseByCitation(citation)),
          databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
        ]
    }
  }
}

const getCaseByCitation = (citation: string): EventTarget => makeEventTarget(
  citation,
  getApplicableDatabases(citation),
  `SG`,
  sortSGCases,
  false,
)

const databaseMap = {
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
  [Constants.DATABASES.SG_openlaw.id]: OpenLaw,
  [Constants.DATABASES.SG_lawnetsg.id]: LawNet,
}

const getPDF = async (
  inputCase: Law.Case,
  inputDocumentType: Law.Link[`doctype`],
): Promise<string | Downloads.DownloadOptionsType> => {
  Logger.log(`SG: getPDF`, inputCase, inputDocumentType)
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const SG = {
  OpenLaw,
  SLW,
  eLitigation,
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default SG