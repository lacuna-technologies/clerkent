import LawNet from './LawNet'
import Logger from '../../utils/Logger'

const init = () => {
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
  }
}

const Searcher = {
  init,
}

export default Searcher