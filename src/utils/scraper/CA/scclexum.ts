import { Request } from "../.."
import Helpers from "../../Helpers"
import Logger from "../../Logger"

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  const judgmentLink = Helpers.getJudgmentLink(inputCase.links)?.url
  try {
    const { request: initialRequest } = await Request.head(judgmentLink
      .replace(/^http:/, `https:`),
    )
    const updatedLink = initialRequest.responseURL
    const pdfURL = updatedLink
      .replace(/\/en\/item\//, `/en/`)
      .replace(/\/index\.do/, `/1/document.do`)
    const { request } = await Request.head(pdfURL)
    return request.responseURL
  } catch {
    Logger.log(`scc-lexum: getPDF - no PDF available`)
  }

  return null
}

const scclexum = {
  getPDF,
}

export default scclexum