import { render } from '@testing-library/preact'
import Constants from '../../utils/Constants'
import QueryResult from '../components/QueryResult'
import useClipboard from 'Popup/hooks/useClipboard'

jest.mock(`Popup/hooks/useClipboard`)
const useClipboardMock = useClipboard as jest.Mock

const mockDownloadPDF = () => () => null
const mockUpdateResults = () => null
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
  beforeAll(() => {
    useClipboardMock.mockImplementation(() => ({
      permissionGranted: true,
      promptGrant: jest.fn(),
    }))
  })
  it(`renders no cases found`, () => {
    const tree = render(
      <QueryResult
        searchResults={[]}
        downloadPDF={mockDownloadPDF}
        isSearching={false}
        updatePending={false}
        updateResults={mockUpdateResults}
      />,
    )
    expect(tree).toMatchSnapshot()
  })

  it(`renders loading`, () => {
    const treeCase = render(
      <QueryResult
        searchResults={[]}
        downloadPDF={mockDownloadPDF}
        isSearching={true}
        updatePending={false}
        updateResults={mockUpdateResults}
      />,
    )
    expect(treeCase).toMatchSnapshot()
  })

  it(`renders list of UK cases`, () => {
    const tree = render(
      <QueryResult
        searchResults={mockCases}
        downloadPDF={mockDownloadPDF}
        isSearching={false}
        updatePending={false}
        updateResults={mockUpdateResults}
      />,
    )
    expect(tree).toMatchSnapshot()
  })
})