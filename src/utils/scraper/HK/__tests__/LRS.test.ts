import fs from 'fs'
import path from 'path'
import Request from '../../../Request'
import LRS from '../LRS'

jest.mock(`../../../Request`)
const RequestGet = Request.get as jest.Mock

const citationQuery = `[2021] HKCFA 14`

describe(`HK LRS`, () => {
  it(`should send valid request for getCaseByCitation`, () => {
    RequestGet.mockImplementation(() => Promise.resolve({ data: `` }))
    
    LRS.getCaseByCitation(citationQuery)
    expect(RequestGet.mock.calls).toMatchSnapshot()
  })

  it(`should parse getCaseByCitation result correctly`, async () => {
    const mockSearchResponse = fs.readFileSync(
      path.join(__dirname, `responses`, `LRS`, `getCaseByCitation-search.txt`),
      `utf-8`,
    )
    const mockResultResponse = fs.readFileSync(
      path.join(__dirname, `responses`, `LRS`, `getCaseByCitation-result.txt`),
      `utf-8`,
    )
    RequestGet
      .mockImplementationOnce(() => Promise.resolve({ data: mockSearchResponse }))
      .mockImplementationOnce(() => Promise.resolve({ data: mockResultResponse }))

    const result = await LRS.getCaseByCitation(citationQuery)
    expect(result).toMatchSnapshot()
  })
})