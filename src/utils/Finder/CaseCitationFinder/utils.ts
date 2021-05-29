export const formatAbbr = ({ abbr, appendum = null }) => `${abbr
    .split(``)
    .map((letter: string) =>
      /[a-z]/i.test(letter)
        ? letter+`\\.?`
        : letter,
    ).join(``)
    }${appendum ? appendum : ``}`

export const formatAbbrs = (abbrArray) => abbrArray.map(({ abbr, appendum }) => formatAbbr({ abbr, appendum})).join(`|`)

export const cleanVolume = (volumeString: string) => volumeString.replace(/\./g, ``).toLowerCase().trim()
