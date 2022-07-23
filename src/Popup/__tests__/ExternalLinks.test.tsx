import { render } from '@testing-library/preact'
import ExternalLinks from 'Popup/components/ExternalLinks'
import { Constants } from 'utils'
import OptionsStorage from 'utils/OptionsStorage'
import SearcherStorage from 'ContentScript/Searcher/SearcherStorage'

jest.mock(`utils/OptionsStorage`)
const institutionalLoginGet = OptionsStorage.institutionalLogin.get as jest.Mock

jest.mock(`ContentScript/Searcher/SearcherStorage`)
const storeLawNetQuery = SearcherStorage.storeLawNetQuery as jest.Mock

const TYPE: Law.Type = `case-name`
const QUERY = `abc123`

describe(`ExternalLinks`, () => {

  beforeAll(() => {
    institutionalLoginGet.mockImplementation(() => Promise.resolve(`None`))
    storeLawNetQuery.mockImplementation(() => Promise.resolve())
  })

  it(`renders without error for UK`, () => {
    const tree = render(
      <ExternalLinks
        jurisdiction={Constants.JURISDICTIONS.UK.id}
        type={TYPE}
        query={QUERY}
      />,
    )
    expect(tree).toMatchSnapshot()
  })

  it(`renders without error for Singapore`, () => {
    const tree = render(
      <ExternalLinks
        jurisdiction={Constants.JURISDICTIONS.SG.id}
        type={TYPE}
        query={QUERY}
      />,
    )
    expect(tree).toMatchSnapshot()
  })

  it(`renders without error for EU`, () => {
    const tree = render(
      <ExternalLinks
        jurisdiction={Constants.JURISDICTIONS.EU.id}
        type={TYPE}
        query={QUERY}
      />,
    )
    expect(tree).toMatchSnapshot()
  })
})