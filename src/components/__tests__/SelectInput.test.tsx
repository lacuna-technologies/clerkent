import SelectInput from "components/SelectInput"
import { render } from '@testing-library/preact'

const OPTIONS = [
  { content: `Jack Cloth`, value: `cloth` },
  { content: `Anne Oldman`, value: `oldman` },
  { content: `Tom Boss`, value: `boss` },
  { content: `Asap Qureshi`, value: `qureshi` },
]

const ON_CHANGE = jest.fn()

describe(`SelectInput`, () => {

  it(`should render without errors`, () => {
    const tree = render(
      <SelectInput
        options={OPTIONS}
        value={OPTIONS[0].value}
        onChange={ON_CHANGE}
        defaultValue={OPTIONS[0].value}
      />,
    )
    expect(tree).toMatchSnapshot()
  })
})