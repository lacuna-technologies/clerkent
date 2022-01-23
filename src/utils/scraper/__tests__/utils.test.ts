import Law from "../../../types/Law"
import { sortByNameSimilarity } from "../utils"

const randomSort = (array) => array.slice(0, array.length).sort((a, b) => (Math.random() - 0.5))

const sampleCases = [
  {
    cases: [
      { name: `RANGE CONSTRUCTION PTE LTD v GOLDBELL ENGINEERING PTE LTD` },
      { name: `Re: Aathar Ah Kong Andrew` },
      { name: `Aathar Ah Kong Andrew v CIMB Securities (Singapore) Pte Ltd` },
      { name: `Azman bin Kamis v Saag Oilfield Engineering (S) Pte Ltd (formerly known as Derrick Services Singapore Pte Ltd) and another suit` },
      { name: `Lee Tat Development Pte Ltd v Management Corporation of Grange Heights Strata Title No 301 (No 2)` },
    ],
    query: `range`,
  },
]

describe(`scraper utils`, () => {
  it(`TODO: add tests`, () => {})
  // temporarily disabled because leven does not play well with Jest
  // it(`sorts case names correctly`, () => {
  //   for (const input of sampleCases) {
  //     const { query, cases } = input
  //     const shuffledCases = randomSort(cases) as Law.Case[]
  //     expect(sortByNameSimilarity(query, shuffledCases)[0].name).toBe(cases[0].name)
  //   }
  // })
})