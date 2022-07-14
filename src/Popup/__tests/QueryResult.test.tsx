import React from 'react'
import renderer from 'react-test-renderer'
import Constants from '../../utils/Constants'
import QueryResult from '../QueryResult'

const mockDownloadPDF = () => () => {}
const mockCases: Law.Case[] = [
  {
    citation: `[1884] EWHC 2 (QB)`,
    database: Constants.DATABASES.UK_bailii,
    jurisdiction: Constants.JURISDICTIONS.UK.id,
    links: [
      {
        doctype: `Judgment`,
        filetype: `HTML`,
        url: `http://www.bailii.org/ew/cases/EWHC/QB/1884/2.html`,
      },
      {
        doctype: `Judgment`,
        filetype: `PDF`,
        url: `http://www.bailii.org/ew/cases/EWHC/QB/1884/2.pdf`,
      },
    ],
    name: `R v Dudley and Stephens`,
    type: `case-name`,
  },
]

describe(`QueryResult`, () => {
  it(`renders no cases found`, () => {
    const tree = renderer.create(
      <QueryResult
        searchResult={[]}
        downloadPDF={mockDownloadPDF}
        isSearching={false}
      />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it(`renders loading`, () => {
    const treeCase = renderer.create(
      <QueryResult
        searchResult={[]}
        downloadPDF={mockDownloadPDF}
        isSearching={true}
      />,
    ).toJSON()
    expect(treeCase).toMatchSnapshot()
  })

  it(`renders list of UK cases`, () => {
    const tree = renderer.create(
      <QueryResult
        searchResult={mockCases}
        downloadPDF={mockDownloadPDF}
        isSearching={false}
      />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})