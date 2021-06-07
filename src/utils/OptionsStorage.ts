import Storage from './Storage'

type InstitutionalLogin = `UCL` | `SMU` | `NUS` | `None`

export interface OptionsSettings {
  highlightEnabled: boolean,
  institutionalLogin: InstitutionalLogin
}

const defaultOptions: OptionsSettings = {
  highlightEnabled: true,
  institutionalLogin: `None`,
}

const keys = {
  OPTIONS_HIGHLIGHT_ENABLED: `OPTIONS_HIGHLIGHT_ENABLED`,
  OPTIONS_INSTITUTIONAL_LOGIN: `OPTIONS_INSTITUTIONAL_LOGIN`,
}

const highlight = {
  get: async (): Promise<OptionsSettings[`highlightEnabled`]> => {
    const result = await Storage.get(keys.OPTIONS_HIGHLIGHT_ENABLED)
    if(result === null){
      return defaultOptions.highlightEnabled
    }
    return result
  },
  set: (value: OptionsSettings[`highlightEnabled`]) => Storage.set(keys.OPTIONS_HIGHLIGHT_ENABLED, value),
}

const institutionalLogin = {
  get: async () => {
    const result = await Storage.get(keys.OPTIONS_INSTITUTIONAL_LOGIN)
    if(result === null){
      return defaultOptions.institutionalLogin
    }
    return result
  },
  set: (value: OptionsSettings[`institutionalLogin`]) =>  Storage.set(keys.OPTIONS_INSTITUTIONAL_LOGIN, value),
}

const getAll = async () => {
  const highlightEnabled = await highlight.get()
  const institutionalLoginValue = await institutionalLogin.get()
  return {
    highlightEnabled,
    institutionalLogin: institutionalLoginValue,
  }
}

const OptionsStorage = {
  defaultOptions,
  getAll,
  highlight,
  institutionalLogin,
}

export default OptionsStorage