import type { FunctionComponent, ComponentChildren } from 'preact'
import { useEffect, useState , useCallback } from 'preact/hooks'
import Constants from '../utils/Constants'
import OptionsStorage from '../utils/OptionsStorage'
import type { OptionsSettings } from '../utils/OptionsStorage'
import SearcherStorage from '../ContentScript/Searcher/SearcherStorage'

interface Props {
  jurisdiction: Law.JursidictionCode
  type: Law.Type
  query: string
}

const getLawNetURL = (
  institution: OptionsSettings[`OPTIONS_INSTITUTIONAL_LOGIN`],
  query: string,
) => (new Proxy({
  NTU: `http://www.lawnet.sg.remotexs.ntu.edu.sg/lawnet/group/lawnet/legal-research/basic-search?clerkent-query=${query}`,
  NUS: `https://proxylogin.nus.edu.sg/lawproxy1/public/login.asp?logup=false&url=https://www.lawnet.sg/lawnet/web/lawnet/ip-access?clerkent-query=${query}`,
  SMU: `https://login.libproxy.smu.edu.sg/login?auth=shibboleth&url=https://www.lawnet.sg/lawnet/web/lawnet/ip-access?clerkent-query=${query}`,
}, {
  get(target, property) {
    if(property in target) {return target[property as string]}
    return `https://www.lawnet.sg/?clerkent-query=${query}`
  },
})[institution])

const ExternalButton: FunctionComponent<{
  href: string,
  onClick?: () => void
}> = ({ href, children, onClick = () => {} }) => {
  return (
    <a
      className="py-1 px-2 border border-solid border-gray-400 rounded hover:bg-gray-200"
      href={href}
      onClick={onClick}
      target="_blank" rel="noreferrer"
    >{children}</a>
  )
}

const ExternalLinks: FunctionComponent<Props> = ({
  jurisdiction,
  query,
  type,
}) => {
  const [institution, setInstitution] = useState(OptionsStorage.defaultOptions.OPTIONS_INSTITUTIONAL_LOGIN)

  const onLawnetClick = useCallback(() => {
    // this is necessary because the NUS and SMU proxies don't pass query params
    // and the redirect occurs before content scripts have time to run
    if([`NUS`, `SMU`, `NTU`].includes(institution)){
      SearcherStorage.storeLawNetQuery(query)
    }
  }, [query, institution])

  useEffect(() => {
    (async () => {
      const institutionSelection = await OptionsStorage.institutionalLogin.get() as InstitutionalLogin
      setInstitution(institutionSelection)
    })()
  }, [])

  return (
    <div className="select-none mt-4">
      <small>Search on:</small>
      <div className="flex flex-row justify-center mt-2 gap-4">
        <ExternalButton
          href={`https://google.com/search?hl=en&q=${query}`}
        >Google</ExternalButton>
        {
          jurisdiction === Constants.JURISDICTIONS.UK.id ? (
            <>
              <ExternalButton
                href={`https://uk.westlaw.com/Browse/Home/WestlawUK/Cases?clerkent-query=${query}&clerkent-type=${type}`}
              >Westlaw UK</ExternalButton>

              <ExternalButton
                href={`https://www.lexisnexis.com/uk/legal/home/home.do?clerkent-query=${query}`}
              >LexisNexis UK</ExternalButton>

              <ExternalButton
                href={`https://app.justis.com/search/${query}/1/Relevance`}
              >Justis</ExternalButton>
            </>
          ) : null
        }
        {
          jurisdiction === Constants.JURISDICTIONS.SG.id ? (
            <>
              <ExternalButton
                href={getLawNetURL(institution, query)}
                onClick={onLawnetClick}
              >LawNet</ExternalButton>
            </>
          ) : null
        }
        {
          [
            Constants.JURISDICTIONS.CA.id,
            Constants.JURISDICTIONS.HK.id,
            Constants.JURISDICTIONS.AU.id,
            Constants.JURISDICTIONS.NZ.id,
            Constants.JURISDICTIONS.EU.id,
            Constants.JURISDICTIONS.ECHR.id,
            Constants.JURISDICTIONS.UN.id,
          ].includes(jurisdiction) ? (
            <>
              <ExternalButton
                href={`https://app.justis.com/search/${query}/1/Relevance`}
              >Justis</ExternalButton>
            </>
          ) : null
        }
      </div>
    </div>
  )
}

export default ExternalLinks