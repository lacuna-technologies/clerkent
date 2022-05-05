import {
  SGSTBIsLongFormat,
  SGSTBIsSquareBracketFormat,
} from '../STB'

describe(`SG STB`, () => {
  const LONG_CITATIONS = [
    `STB 31 of 2021`,
    `STB 117 of 2018`,
    `STB No.65 of 2016`,
    `STB 77 and 95 of 2012`,
    `STB 59A of 2011`,
    `STB No 52/64/65/66 of 2011`,
  ]
  const SQUARE_BRACKET_CITATIONS = [
    `[2021] SGSTB 31`,
    `[2018] SGSTB 117`,
    `[2016] SGSTB 65`,
    `[2012] SGSTB 77`,
    `[2011] SGSTB 59A`,
    `[2011] SGSTB 52`,
  ]

  test.concurrent.each(
    LONG_CITATIONS,
  )(`should correctly identify %s as a long citation`, (citation) => {
    expect(SGSTBIsLongFormat(citation)).toBe(true)
  })

  test.concurrent.each(
    SQUARE_BRACKET_CITATIONS,
  )(`should correctly identify %s as not a long citation`, (citation) => {
    expect(SGSTBIsLongFormat(citation)).toBe(false)
  })

  test.concurrent.each(
    SQUARE_BRACKET_CITATIONS,
  )(`should correctly identify %s as a square bracket citation`, (citation) => {
    expect(SGSTBIsSquareBracketFormat(citation)).toBe(true)
  })

  // test.concurrent.each(
  //   LONG_CITATIONS,
  // )(`should correctly identify %s as not a square bracket citation`, (citation) => {
  //   expect(SGSTBIsSquareBracketFormat(citation)).toBe(false)
  // })

  // test.concurrent.each(
  //   LONG_CITATIONS.map((c, index) => ([c, SQUARE_BRACKET_CITATIONS[index]])),
  // )(`should correctly convert %s to %s`, (longCitation, squareBracketCitation) => {
  //   expect(SGSTBSquareBracketFormat(longCitation)).toBe(squareBracketCitation)
  // })
})