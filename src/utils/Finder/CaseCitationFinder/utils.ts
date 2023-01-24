import Logger from "utils/Logger"

export const formatAbbr = (
  { abbr, appendum = null }:
  { abbr: string, appendum?: string },
) => {
  const end = appendum || ``
  return `${abbr
    .split(``)
    .map((letter: string) =>
      /[a-z]/i.test(letter)
        ? `${letter}\\.?`
        : letter,
    ).join(``)
    }${end}`
}

export const formatAbbrs = (
  abbrArray: { abbr: string, appendum?: string }[],
) => abbrArray.map(
  ({ abbr, appendum }) => formatAbbr({ abbr, appendum}),
).join(`|`)

export const cleanVolume = (volumeString: string) => volumeString.replace(/\./g, ``).toLowerCase().trim()

export const sortCitationsByVolume = (
  abbrsList: { abbr: string, appendum?: string }[],
  citationsArray: string[],
): string[] => {
  const lastIfNotFound = (index: number) => (
    index === -1
      ? citationsArray.length + 1
      : index
  )
  return citationsArray.sort((a, b) => {
    const indexA = lastIfNotFound(
      abbrsList.findIndex(
        currentAbbr => new RegExp(
          formatAbbr(currentAbbr),
          `i`,
        ).test(a),
      ),
    )
    const indexB = lastIfNotFound(
      abbrsList.findIndex(currentAbbr => 
        new RegExp(formatAbbr(currentAbbr), `i`).test(b),
      ),
    )
    return indexA - indexB
  })
}

export const sortCasesByVolume = (
  abbrsList: { abbr: string, appendum?: string }[],
  citationsArray: Law.Case[],
  attribute = `citation`,
): Law.Case[] => sortCitationsByVolume(
    abbrsList,
    (citationsArray).map(c => c[attribute]),
  ).map(c => (citationsArray).find(v => v[attribute] === c))