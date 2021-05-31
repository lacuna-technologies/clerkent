import LawNet from './LawNet'
import LexisUK from './LexisUK'
import WestlawUK from './WestlawUK'
import type Law from '../../types/Law'

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

const init = () => {
  // TODO: handle situation when user is initially logged out
  switch(window.location.hostname){
    case `www.lawnet.sg`:
    case `www-lawnet-sg.lawproxy1.nus.edu.sg`:
    case `www-lawnet-sg.libproxy.smu.edu.sg`: {
      const query = getClerkentQuery()
      if(isQueryValid(query)){
        LawNet.init(query)
      }
      break
    }

    case `uk.westlaw.com`: {
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
    

    case `www-lexisnexis-com.libproxy.ucl.ac.uk`:
    case `www.lexisnexis.com`: {
      const query = getClerkentQuery()
      const homePaths = [
        `/uk/legal/search/flap.do`,
        `/uk/legal/home/home.do`,
      ]
      if(homePaths.includes(window.location.pathname)  && isQueryValid(query)){
        LexisUK.init(query)
      }
      break
    }
  }
}

const Searcher = {
  init,
}

export default Searcher