import { render } from '@testing-library/preact'
import ShowMore from '../components/ShowMore'

describe(`ShowMore`, () => {
  it(`renders without error`, () => {
    const tree = render(
      <ShowMore
        onClick={() => null}
      />,
    )
    expect(tree).toMatchSnapshot()
  })
})