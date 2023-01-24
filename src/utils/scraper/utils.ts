import Fuse from 'fuse.js'
import { Mutex } from 'async-mutex'
import Helpers from '../Helpers'
import Constants from 'utils/Constants'
import Storage from 'utils/Storage'
import Finder from "../Finder"
import Logger from 'utils/Logger'

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

type DatabaseUseFunction = () => Promise<Law.Case[]>
export const databaseUse = async (jurisdictionId: Law.JurisdictionCode, databaseId: string, function_: DatabaseUseFunction): Promise<Law.Case[]> => {
  const databasesStatus: typeof Constants.DEFAULT_DATABASES_STATUS = await Storage.get(`DATABASES_STATUS`) || Constants.DEFAULT_DATABASES_STATUS
  if(databasesStatus[jurisdictionId][databaseId]){
    return function_()
  } 
  return []
}

export const databaseUseJurisdiction = (jurisdictionId: Law.JurisdictionCode) =>
  (...arguments_: [string, DatabaseUseFunction]): Promise<Law.Case[]> =>
  databaseUse(jurisdictionId, ...arguments_)
export const databaseUseDatabase = (databaseId: string, databaseUseJurisdictionFunction) =>
  (_function: DatabaseUseFunction): Promise<Law.Case[]> =>
  databaseUseJurisdictionFunction(databaseId, _function)

export const makeEventTarget = (
  query: string,
  requests: Promise<Law.Case[]>[],
  jurisdictionId: Law.JurisdictionCode,
  sortCitations: (citationsArray: Law.Case[], attribute: string) => Law.Case[],
  sortByQuery: boolean,
): EventTarget => {
  const eventTarget = new EventTarget()
  let count = 0

  if(requests.length === 0){
    const newEvent = new CustomEvent(
      Constants.EVENTS.CASE_RESULTS,
      {
        detail: {
          done: true,
          results: [],
        },
      },
    )
    eventTarget.dispatchEvent(newEvent)
    return eventTarget
  }

  const promises = requests.map((request) => new Promise((resolve, reject) => {
    request
      .then(result => {
        count += 1
        const filteredResult = result.filter(
          ({ jurisdiction }) => jurisdiction === jurisdictionId,
        )
        const event = new CustomEvent(
          `${Constants.EVENTS.RAW_CASE_RESULT}-${query}`,
          { detail: { count, result: filteredResult } },
        )
        eventTarget.dispatchEvent(event)
        resolve(event)
      })
      .catch(error => reject(error))
  }))

  const mutex = new Mutex()
  let aggregateResults: Law.Case[] = []

  eventTarget.addEventListener(`${Constants.EVENTS.RAW_CASE_RESULT}-${query}`, async (event: CustomEvent) => {
    event.stopImmediatePropagation()

    if(mutex.isLocked()){
      await mutex.waitForUnlock()
    }

    await mutex.acquire()

    try {
      const { detail: { count, result } }: { detail: { count: number, result: Law.Case[] } } = event
      aggregateResults = sortByQuery ? sortByName(
        query,
        sortCitations(
          Helpers.uniqueBy([...aggregateResults, ...result], `citation`),
          `citation`,
        ),
      ) : sortCitations(
        Helpers.uniqueBy([...aggregateResults, ...result], `citation`),
        `citation`,
      )
      
      const newEvent = new CustomEvent(`${Constants.EVENTS.CASE_RESULTS}-${query}`, {
        detail: {
          done: promises.length === count,
          results: aggregateResults,
        },
      })
      eventTarget.dispatchEvent(newEvent)
    } catch (error){
      Logger.error(error)
    } finally {
      await mutex.release()
    }
  })

  Promise.allSettled(promises)
    .catch(error => Logger.error(error))

  return eventTarget
}