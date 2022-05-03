import fs from 'fs'
import path from 'path'
import Request from 'utils/Request'
import OpenLaw from '../OpenLaw'

jest.mock(`utils/Request`)
const RequestPost = Request.post as jest.Mock

const CITATION = `[1999] SGHC 283`

describe(`SG OpenLaw`, () => {
  it(`should send valid request for getCaseByCitation`, () => {
    RequestPost.mockImplementationOnce(() => Promise.resolve({
      data: ``,
    }))
    OpenLaw.getCaseByCitation(CITATION)
    expect(RequestPost.mock.calls).toMatchSnapshot()
  })
  it(`should parse getCaseByCitation result correctly`, async () => {
    const mockResponse = JSON.parse(fs.readFileSync(
      path.join(__dirname, `responses`, `OpenLaw`, `getCaseByCitation-result.txt`),
    ).toString())
    RequestPost.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }))
    const result = await OpenLaw.getCaseByCitation(CITATION)
    expect(result).toMatchSnapshot()
  })
})