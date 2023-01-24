import LawNet from './LawNet'
import LexisUK from './LexisUK'
import WestlawUK from './WestlawUK'
import SearcherStorage from './SearcherStorage'

const getClerkentQuery = (): string | null => {
  const queryParameters = new URLSearchParams(window.location.search)
  const query = queryParameters.get(`clerkent-query`)
  if(query === null){
    return null
  }
  return decodeURIComponent(decodeURIComponent(query))
}

const getClerkentType = (): Law.Type | null => {
  const queryParameters = new URLSearchParams(window.location.search)
  const clerkentType = queryParameters.get(`clerkent-type`)
  if(clerkentType === null){
    return null
  }
  return decodeURIComponent(decodeURIComponent(clerkentType)) as Law.Type
}

const isQueryValid = (query: string) => (query && query.length > 0)

// eslint-disable-next-line sonarjs/cognitive-complexity
const init = async () => {
  switch(window.location.hostname){
    case `www.lawnet.sg`:
    case `www-lawnet-sg.lawproxy1.nus.edu.sg`:
    case `www-lawnet-sg.libproxy.smu.edu.sg`:
    case `www.lawnet.sg.remotexs.ntu.edu.sg`: {
      const queryDonePaths = [
        `/lawnet/group/lawnet/result-page`,
      ]
      const urlParameterQuery = getClerkentQuery()
      if (queryDonePaths.includes(window.location.pathname)){
        // search result page
        await SearcherStorage.removeLawNetQuery()
      } else if(document.querySelector(`#_58_login`) !== null && isQueryValid(urlParameterQuery)){
        // login page
        const query = getClerkentQuery()
        await SearcherStorage.storeLawNetQuery(query)
      } else {
        // first post-login page
        const query = urlParameterQuery || (await SearcherStorage.getLawNetQuery())
        if(isQueryValid(query)){
          LawNet.init(query)
        }
      }
      break
    }

    case `uk.westlaw.com`: {
      // Westlaw UK passes query strings through login process 😀
      const query = getClerkentQuery()
      const clerkentType = getClerkentType()
      if(window.location.pathname === `/Browse/Home/WestlawUK/Cases` && isQueryValid(query) && clerkentType){
        if(clerkentType === `case-citation`){
          WestlawUK.initCaseCitation(query)
        }
        if(clerkentType === `case-name`){
          WestlawUK.initPartyName(query)
        }
      }
      break
    }
    
    case `www-lexisnexis-com.gate2.library.lse.ac.uk`:
    case `www-lexisnexis-com.libproxy.kcl.ac.uk`:
    case `www-lexisnexis-com.libproxy.ucl.ac.uk`:
    case `www.lexisnexis.com`: {
      // annoyingly, lexis does not pass query strings through login
      const homePaths = [
        `/uk/legal/search/flap.do`,
        `/uk/legal/home/home.do`,
        `/uk/legal/auth/checkbrowser.do`,
      ]

      if(homePaths.includes(window.location.pathname)){
        if(document.querySelector(`#signInSubmit`) !== null){
          const query = getClerkentQuery()
          await SearcherStorage.storeLexisUKQuery(query)
          return
        }

        const query = getClerkentQuery() || (await SearcherStorage.getLexisUKQuery())
        return LexisUK.init(query)
      }

      const queryDonePaths = [
        `/uk/legal/search/homesubmitForm.do`,
      ]

      if(queryDonePaths.includes(window.location.pathname)){
        SearcherStorage.removeLexisUKQuery()
      }

      break
    }
  }
}

const Searcher = {
  init,
}

export default Searcher