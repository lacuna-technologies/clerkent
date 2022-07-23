import Fuse from 'fuse.js'
import Leven from '../Leven'
import Helpers from '../Helpers'
import Constants from 'utils/Constants'
import Storage from 'utils/Storage'

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

// eslint-disable-next-line sonarjs/cognitive-complexity
export const sortByNameSimilarity = (query: string, cases: Law.Case[]) => cases.sort((a, b) => {
  const cleanQuery = Helpers.removeCommonAppends(query.toLowerCase())
  const cleanAName = Helpers.removeCommonAppends(a.name.toLowerCase())
  const cleanBName = Helpers.removeCommonAppends(b.name.toLowerCase())

  if (probablySameCase(cleanAName, cleanBName)) {
    // probably the same case
    // keep sort order
    return 0
  }

  const {
    str: longestSubstrA,
    length: lengthScoreA,
  } = longestCommonSubstring(cleanQuery, cleanAName)
  const {
    str: longestSubstrB,
    length: lengthScoreB,
  } = longestCommonSubstring(cleanQuery, cleanBName)

  if (Math.max(lengthScoreA, lengthScoreB) >= 0.8 * query.length) {
    const wholeWordA = (new RegExp(`\\b${longestSubstrA}\\b`, `i`)).test(cleanAName)
    const wholeWordB = (new RegExp(`\\b${longestSubstrB}\\b`, `i`)).test(cleanBName)

    if (wholeWordA === wholeWordB || lengthScoreA !== lengthScoreB) {
      return lengthScoreA > lengthScoreB ? -1
        : (lengthScoreA === lengthScoreB ? 0 : 1)
    } 
      return wholeWordA ? -1 : 1
  } 
    const levenScoreA = Leven(query, cleanAName)
    const levenScoreB = Leven(query, cleanBName)
    return levenScoreA > levenScoreB ? 1
      : (levenScoreA === levenScoreB ? 0 : -1)
  
})

export const sortByName = (query: string, cases: Law.Case[]) => {
  const fuse = new Fuse(cases.map(({ name }) => name), { ignoreLocation: true })
  return fuse
    .search(query)
    .map(({ refIndex }) => cases[refIndex])
}

export const databaseUse = async (jurisdictionId: Law.JursidictionCode, databaseId: string, function_: () => Promise<Law.Case[]>): Promise<Law.Case[]> => {
  const databasesStatus: typeof Constants.DEFAULT_DATABASES_STATUS = await Storage.get(`DATABASES_STATUS`) || Constants.DEFAULT_DATABASES_STATUS
  if(databasesStatus[jurisdictionId][databaseId]){
    return function_()
  } 
  return []
}