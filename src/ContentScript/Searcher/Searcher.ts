import LawNet from './LawNet'
import LexisUK from './LexisUK'
import Logger from '../../utils/Logger'

const init = () => {
  // TODO: handle situation when user is initially logged out
  switch(window.location.hostname){
    case `www.lawnet.sg`:
    case `www-lawnet-sg.lawproxy1.nus.edu.sg`:
    case `www-lawnet-sg.libproxy.smu.edu.sg`: {
      const queryParameters = new URLSearchParams(window.location.search)
      const query = queryParameters.get(`clerkent-query`)
      if(query && query.length > 0){
        Logger.log(`running LawNet searcher for query:`, query)
        LawNet.init(decodeURIComponent(decodeURIComponent(query)))
      }
      break
    }

    case `www-lexisnexis-com.libproxy.ucl.ac.uk`:
    case `www.lexisnexis.com`:
      const queryParameters = new URLSearchParams(window.location.search)
      const query = queryParameters.get(`clerkent-query`)
      const homePaths = [
        `/uk/legal/search/flap.do`,
        `/uk/legal/home/home.do`,
      ]
      if(homePaths.includes(window.location.pathname)  && query && query.length > 0){
        LexisUK.init(decodeURIComponent(decodeURIComponent(query)))
      }
  }
}

const Searcher = {
  init,
}

export default Searcher