import Fuse from 'fuse.js'
import Helpers from '../Helpers'
import Constants from 'utils/Constants'
import Storage from 'utils/Storage'
import Finder from "../Finder"

export const findCitation = (function_ = Finder.findCaseCitation, inputText: string) => {
  const results = function_(inputText)
  if(results.length > 0){
    return results[0].citation
  }
  return null
}

const longestCommonSubstring = (stringA: string, stringB: string) => {
  if (!stringA || !stringB) {
    return {
      length: 0,
      str: ``,
    }
  }

  let longestSubstr = ``
  let currentSubstr = ``
  for (const element of stringA) {
    currentSubstr += element
    if (!stringB.toLowerCase().includes(currentSubstr.toLowerCase())) {
      if (currentSubstr.length > longestSubstr.length) {
        longestSubstr = currentSubstr
      }
      currentSubstr = ``
    }
  }
  return currentSubstr.length > longestSubstr.length ? {
    length: currentSubstr.length,
    str: currentSubstr,
  } : {
    length: longestSubstr.length,
    str: longestSubstr,
  }
}

const probablySameCase = (caseNameA: string, caseNameB: string) => {
  const {
    length: longestSubstrLength,
  } = longestCommonSubstring(
    caseNameA,
    caseNameB,
  )
  const sameCaseProbability = longestSubstrLength / Math.min(caseNameA.length, caseNameB.length)
  return sameCaseProbability >= 0.8
}

export const sortByName = (query: string, cases: Law.Case[]) => {
  const cleanQuery = Helpers.removeCommonAppends(query.toLowerCase())
  const fuse = new Fuse(cases.map(({ name }) => Helpers.removeCommonAppends(name.toLowerCase())), { ignoreLocation: true })
  return fuse
    .search(cleanQuery)
    .map(({ refIndex }) => cases[refIndex])
}

export const databaseUse = async (jurisdictionId: Law.JurisdictionCode, databaseId: string, function_: () => Promise<Law.Case[]>): Promise<Law.Case[]> => {
  const databasesStatus: typeof Constants.DEFAULT_DATABASES_STATUS = await Storage.get(`DATABASES_STATUS`) || Constants.DEFAULT_DATABASES_STATUS
  if(databasesStatus[jurisdictionId][databaseId]){
    return function_()
  } 
  return []
}