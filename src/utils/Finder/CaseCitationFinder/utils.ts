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

export const sortCitationsByVolume = (abbrsList, citationsArray: any[], attribute = null) => {
  if(attribute === null){
    return citationsArray.sort((a, b) => {
      const indexA = abbrsList.findIndex(currentAbbr => new RegExp(formatAbbr(currentAbbr), `i`).test(a))
      const indexB = abbrsList.findIndex(currentAbbr =>  new RegExp(formatAbbr(currentAbbr), `i`).test(b))
      return indexA - indexB
    })
  }
  return sortCitationsByVolume(
    abbrsList,
    citationsArray.map(c => c[attribute]),
  ).map(c => citationsArray.find(v => v[attribute] === c))
}
