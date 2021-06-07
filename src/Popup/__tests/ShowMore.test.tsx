import React from 'react'
import renderer from 'react-test-renderer'
import ShowMore from '../ShowMore'

describe(`ShowMore`, () => {
  it(`renders without error`, () => {
    const tree = renderer.create(
      <ShowMore
        onClick={() => {}}
      />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})