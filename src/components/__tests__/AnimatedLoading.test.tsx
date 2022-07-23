import AnimatedLoading from 'components/AnimatedLoading'
import { render } from '@testing-library/preact'

describe(`AnimatedLoading`, () => {
  it(`should render without errors`, () => {
    const tree = render(
      <AnimatedLoading />,
    )
    expect(tree).toMatchSnapshot()
  })
})