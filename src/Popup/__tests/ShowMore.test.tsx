import { render } from '@testing-library/preact'
import ShowMore from '../ShowMore'

describe(`ShowMore`, () => {
  it(`renders without error`, () => {
    const tree = render(
      <ShowMore
        onClick={() => {}}
      />,
    )
    expect(tree).toMatchSnapshot()
  })
})