import CaseCitationFinder from '../CaseCitationFinder'

describe(`Finder`, () => {
  it(`🇸🇬 citations`, () => {
    const citations = [
      `[2021] SGCA 34`,
      `[2020] SGHC 228`,
      `[2020] SGHC 100 (2010)`,
      `[2011] 2 SLR 47`,
      `[2020] SGDC 95`,
      `[1994] SGCA 128`,
      `[1988] SGCA 16`,
      `[2001] 2 SLR 253`,
      `[2001] 2 SLR 253`,
    ]

    for(const citation of citations){
      const parsedCitation = CaseCitationFinder.findCaseCitation(citation)
      expect(parsedCitation.length).toEqual(1)
      expect(parsedCitation[0].jurisdiction).toEqual(`SG`)
      expect(parsedCitation).toMatchSnapshot()
    }
  })

  it(`🇬🇧 citations`, () => {
    const citations = [
      `(1754) 2 Ves Sen 547`,
      `[1843-60] All ER 249`,
      `[1948] 1 KB 223`,
      `[1965] 1 QB 456`,
      `(1951) 35 Cr App R 164`,
      `[2007] UKHL 17`,
      `O/328/22`,
      `O/002/22`,
    ]

    for (const citation of citations) {
      const parsedCitation = CaseCitationFinder.findCaseCitation(citation)
      expect(parsedCitation.length).toEqual(1)
      expect(parsedCitation[0].jurisdiction).toEqual(`UK`)
      expect(parsedCitation).toMatchSnapshot()
    }
  })
})