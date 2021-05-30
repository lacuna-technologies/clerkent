const createInput = (key: string, value: string) => {
  const newInput = document.createElement(`input`)
  newInput.setAttribute(`type`,`hidden`)
  newInput.setAttribute(`name`,key)
  newInput.setAttribute(`value`, value)
  return newInput
}

const init = (query: string) => {
  const f = document.createElement(`form`)
  f.setAttribute(`method`,`post`)
  // eslint-disable-next-line no-secrets/no-secrets
  f.setAttribute(`action`,`/lawnet/group/lawnet/result-page?p_p_id=legalresearchresultpage_WAR_lawnet3legalresearchportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_legalresearchresultpage_WAR_lawnet3legalresearchportlet_action=basicSeachActionURL&_legalresearchresultpage_WAR_lawnet3legalresearchportlet_searchType=0`)

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

  for (const attribute of attributes) {
    const [key] = Object.keys(attribute)
    const [value] = Object.values(attribute)
    const newInput = createInput(key, value)
    f.append(newInput)
  }

  document.querySelectorAll(`body`)[0].append(f)
  f.submit()
}

const LawNet = {
  init,
}

export default LawNet