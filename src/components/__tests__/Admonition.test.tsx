import Admonition from "components/Admonition"
import { render } from '@testing-library/preact'

describe(`Admonition`, () => {
  it(`should render without errors`, () => {
    const tree = render(
      <Admonition title="Warning">
        <p>
          Fun will now commence
        </p>
      </Admonition>,
    )
    expect(tree).toMatchSnapshot()
  })
})