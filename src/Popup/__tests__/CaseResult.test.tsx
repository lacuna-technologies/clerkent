import { render } from '@testing-library/preact'
import Constants from 'utils/Constants'
import CaseResult from '../components/CaseResult'

const mockCase: Law.Case = {
  citation: `[2006] EWCA Civ 145`,
  database: Constants.DATABASES.UK_bailii,
  jurisdiction: Constants.JURISDICTIONS.UK.id,
  links: [
    {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: `https://www.bailii.org/ew/cases/EWCA/Civ/2006/145.html`,
    },
  ],
  name: `IDA v University of Southampton`,
  type: `case-name`,
}
const mockDownloadPDF = () => () => null

describe(`CaseResult`, () => {
  it(`renders without error`, () => {
    const tree = render(
      <CaseResult
        downloadPDF={mockDownloadPDF}
        case={mockCase}
      />,
    )
    expect(tree).toMatchSnapshot()
  })
})