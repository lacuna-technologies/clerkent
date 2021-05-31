import { postFormData } from './utils'

const init = (query: string) => {
  // eslint-disable-next-line no-secrets/no-secrets
  const url = `/lawnet/group/lawnet/result-page?p_p_id=legalresearchresultpage_WAR_lawnet3legalresearchportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_legalresearchresultpage_WAR_lawnet3legalresearchportlet_action=basicSeachActionURL&_legalresearchresultpage_WAR_lawnet3legalresearchportlet_searchType=0`

  const attributes = [
    { basicSearchKey: query },
    { grouping: 1 },
    { category: 1 },
    { category: 2 },
    { category: 4 },
    { category: 6 },
    { category: 7 },
    { category: 8 },
    { category: 26 },
    { category: 27 },
  ]

  postFormData(url, attributes)
}

const LawNet = {
  init,
}

export default LawNet