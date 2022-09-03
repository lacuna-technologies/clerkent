import { sortByName } from "../utils"

type TestCase = {
  cases: string[],
  index: number,
  query: string,
}

const testCases: TestCase[] = [
  {
    cases: [
      `RANGE CONSTRUCTION PTE LTD v GOLDBELL ENGINEERING PTE LTD`,
      `Re: Aathar Ah Kong Andrew`,
      `Aathar Ah Kong Andrew v CIMB Securities (Singapore) Pte Ltd`,
      `Azman bin Kamis v Saag Oilfield Engineering (S) Pte Ltd (formerly known as Derrick Services Singapore Pte Ltd) and another suit`,
      `Lee Tat Development Pte Ltd v Management Corporation of Grange Heights Strata Title No 301 (No 2)`,
    ],
    index: 0,
    query: `range`,
  },
  {
    cases: [
      `UJF v UJG`,
      `Azman bin Kamis v Saag Oilfield Engineering (S) Pte Ltd (formerly known as Derrick Services Singapore Pte Ltd) and another suit`,
      `Tribune Investment Trust Inc v Soosan Trading Co Ltd`,
      `Lee Tat Development Pte Ltd v Management Corporation of Grange Heights Strata Title No 301 (No 2)`,
    ],
    index: 2,
    query: `tribune investment v soosan`,
  },
  {
    cases: [
      `Chua Choon Lim Robert v MN Swami and Others`,
      `Chua Teck Chew Robert v Goh Eng Wah`,
      `KOH CHEW CHEE v LIU SHU MING & Anor`,
      `Goh Nellie v Goh Lian Teck and Others`,
    ],
    index: 1,
    query: `Chua Teck Chew Robert v Goh Eng Wah`,
  },
  {
    cases: [
      `Choong Peng Kong v Koh Hong Son`,
      `China Airlines Ltd v Philips Hong Kong Ltd`,
      `China Airlines Limited v Philips Hong Kong Limited`,
      `Kong Chee Chui and others v Soh Ghee Hong`,
      `CRRC (HONG KONG) CO. LIMITED & Anor v CHEN WEIPING`,
      `Fustar Chemicals Ltd (Hong Kong) v Liquidator of Fustar Chemicals Pte Ltd`,
      `Fustar Chemicals Ltd v Ong Soo Hwa (liquidator of Fustar Chemicals Pte Ltd)`,
    ],
    index: 5,
    query: `Fustar Chemicals (Hong Kong)`,
  },
  {
    cases: [
      `PEX International Pte Ltd v Lim Seng Chye & Anor`,
      `Tan Chi Min v The Royal Bank of Scotland Plc`,
      `WestLB AG v Philippine National Bank & Others`,
      `Cousins Scott William v The Royal Bank of Scotland plc`,
      `The Royal Bank of Scotland NV (formerly known as ABN Amro Bank NV) and others v TT International Ltd and another appeal`,
      `The Royal Bank of Scotland NV (formerly known as ABN Amro Bank NV) and others v TT International Ltd (nTan Corporate Advisory Pte Ltd and others, other parties) and another appeal`,
    ],
    index: 4,
    query: `Royal Bank of Scotland v TT International`,
  },
]

describe(`scraper utils`, () => {

  test.concurrent
    .each(testCases.map((test) => [test.query, test.cases, test.index]))(`sort case names: %s`, (query, cases, id) => {
    const sorted = sortByName(query, cases.map(c => ({ name: c }) as Law.Case))
    expect(sorted[0].name).toBe(cases[id])
  })
})