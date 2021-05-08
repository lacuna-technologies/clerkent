import Finder from '../Finder'

describe(`Finder`, () => {
  it(`🇸🇬 citations`, () => {
    const citations = [
      `[2021] SGCA 1`,
      `[2020] SGHC 2`,
    ]

    for(const citation of citations){
      expect(Finder.findSGCase(citation)).toMatchSnapshot()
    }
  })
})