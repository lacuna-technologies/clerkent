import Storage from './Storage'

export type InstitutionalLogin = `KCL` | `LSE` | `UCL` | `NTU` | `NUS` |  `SMU` | `None`

const keysObject = {
  OPTIONS_CLIPBOARD_PASTE_ENABLED: {
    defaultValue: false as boolean,
    shortName: `clipboardPaste`,
  },
  OPTIONS_HIGHLIGHT_ENABLED: {
    defaultValue: true as boolean,
    shortName: `highlight`,
  },
  OPTIONS_INSTITUTIONAL_LOGIN: {
    defaultValue: `None` as InstitutionalLogin,
    shortName: `institutionalLogin`,
  },
} as const
export type OptionFullKey = keyof typeof keysObject
export type OptionShortName = typeof keysObject[OptionFullKey][`shortName`]
export type OptionType<T extends OptionFullKey> = typeof keysObject[T][`defaultValue`]
export type OptionsSettings = {
  [K in OptionFullKey]: OptionType<K>
}

const defaultOptions = Object.entries(keysObject).reduce((accumulator, [key, { defaultValue }]) => ({
  ...accumulator,
  [key]: defaultValue,
}), {} as OptionsSettings)

const makeGet = <K extends OptionFullKey>(settingKey: K) => async (): Promise<OptionsSettings[K]> => {
  const result = await Storage.get(settingKey)
  if(result === null){
    return defaultOptions[settingKey]
  }
  return result
}

const makeSet = <K extends OptionFullKey>(settingKey: K) => (
  value: typeof keysObject[K][`defaultValue`],
) => Storage.set(
  settingKey,
  value,
)

export type OptionStorageContentType = {
  [Property in OptionFullKey as typeof keysObject[OptionFullKey][`shortName`]]: {
    get: () => Promise<OptionType<Property>>,
    set: (value: OptionType<Property>) => void,
  }
}

const optionStorageContent = Object.entries(keysObject).reduce((
  accumulator,
  [key, { shortName }] : [OptionFullKey, typeof keysObject[OptionFullKey]]) => ({
  ...accumulator,
  [shortName]: {
    get: makeGet(key as OptionFullKey),
    set: makeSet(key as OptionFullKey),
  },
}), {} as OptionStorageContentType)

const getAll = async () => {
  const allResults = await Promise.all(
    Object.values(keysObject).map(({ shortName }) => optionStorageContent[shortName].get()),
  )

  return Object.entries(keysObject).reduce((accumulator, [key], index) => ({
    ...accumulator,
    [key]: allResults[index],
  }), {} as OptionsSettings)
}

const OptionsStorage = {
  ...optionStorageContent,
  defaultOptions,
  getAll,
}

export default OptionsStorage