import Helpers from '../Helpers'

const commonAppendsTestCases = [
  [`Altus Technologies Pte Ltd (under judicial management) v Oversea-Chinese Banking Corp Ltd`, `Altus Technologies v Oversea-Chinese Banking Corp`],
  [`Kong Chee Chui and others v Soh Ghee Hong`, `Kong Chee Chui v Soh Ghee Hong`],
  [`Fustar Chemicals Ltd v Ong Soo Hwa (liquidator of Fustar Chemicals Pte Ltd)`, `Fustar Chemicals v Ong Soo Hwa (liquidator of Fustar Chemicals)`],
  [`Good Property Land Development Pte Ltd (in liquidation) v Societe-Generale`, `Good Property Land Development v Societe-Generale`],
  [`G.W.L. Properties Ltd. v. W.R. Grace & Co. of Canada Ltd.`, `G.W.L. Properties v. W.R. Grace of Canada`],
  [`PEX International Pte Ltd v Lim Seng Chye & Anor`, `PEX International v Lim Seng Chye`],
  [`SCK SERIJADI SDN BHD v ARTISON INTERIOR PTE LTD`, `SCK SERIJADI v ARTISON INTERIOR`],
  [`Wong Kwei Cheong v ABN-AMRO Bank NV`, `Wong Kwei Cheong v ABN-AMRO Bank`],
  [`Wham Kwok Han Jolovan v AG`, `Wham Kwok Han Jolovan v AG`],
]

describe(`Helpers`, () => {
  test.concurrent
    .each(commonAppendsTestCases)(`removeCommonAppends: %s`, (input, output) => {
      const processed = Helpers.removeCommonAppends(input)
      expect(processed).toBe(output)
    })
})