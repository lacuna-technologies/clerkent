import CaseCitationFinder from '../CaseCitationFinder'

describe(`Finder`, () => {
  const SGCitations = [
    `[2021] SGCA 34`,
    `[2020] SGHC 228`,
    `[2020] SGHC 100 (2010)`,
    `[2011] 2 SLR 47`,
    `[2020] SGDC 95`,
    `[1994] SGCA 128`,
    `[1988] SGCA 16`,
    `[2001] 2 SLR 253`,
    `[2001] 2 SLR 253`,
    `[2022] SGIPOS 4`,
    `[2022] SGHCR 1`,
    `[2020] SGHCF 18`,
    `[2022] SGHC(A) 17`,
    `[2020] SGCA(I) 2`,
  ]

  const UKCitations = [
    `(1754) 2 Ves Sen 547`,
    `[1843-60] All ER 249`,
    `[1948] 1 KB 223`,
    `[1965] 1 QB 456`,
    `(1951) 35 Cr App R 164`,
    `[2007] UKHL 17`,
    `O/328/22`,
    `O/002/22`,
    `O01422`,
    `[2021] EWHC 2168 (QB)`,
    `[2016] EWHC 3151 (IPEC)`,
    `[2001] ECDR 5`,
  ]

  const EUCitations: [string, number][] = [
    [`C-40/17`, 1],
    [`Cases C-403/08 and C-429/08`, 2],
    [`Case C-145/10`, 1],
    [`Case C-5/08`, 1],
  ]

  const AUCitations = [
    `[2010] FCA 984`,
    `(1990) 171 CLR 30`,
    `(1992) 7 ACSR 759`,
    `(2003) 200 ALJ 1`,
    `[1989] HCA 9`,
    `(1982) 7 ACLR 171`,
  ]

  const CACitations = [
    `[1999] 2 SCR 534`,
    `(2008) 91 OR (3d) 353`,
    `(1973) 40 DLR (3d) 371`,
    `[1983] 4 WWR 762`,
    `[2006] SCC 39`,
  ]

  const HKCitations = [
    `(2013) 16 HKCFAR 366`,
    `[2015] HKCFI 1856`,
    `[1999] HKCA 585`,
    `[2000] 1 HKLRD 595`,
    `[2012] HKDC 911`,
  ]

  const citations: [string, string, number][] = [
    ...SGCitations.map((citation): [string, string, number] => ([citation, `SG`, 1])),
    ...UKCitations.map((citation): [string, string, number] => ([citation, `UK`, 1])),
    ...EUCitations.map(([citation, count]): [string, string, number] => ([citation, `EU`, count])),
    ...AUCitations.map((citation): [string, string, number] => ([citation, `AU`, 1])),
    ...CACitations.map((citation): [string, string, number] => ([citation, `CA`, 1])),
    ...HKCitations.map((citation): [string, string, number] => ([citation, `HK`, 1])),
  ]
  
  test.concurrent.each(citations)(`%s`, (citation, jurisdictionId, count) => {
    const parsedCitation = CaseCitationFinder.findCaseCitation(citation)
    expect(parsedCitation.length).toEqual(count)
    expect(parsedCitation[0].jurisdiction).toEqual(jurisdictionId)
    expect(parsedCitation).toMatchSnapshot()
  })
})