import { Messenger, Helpers, Finder, Constants, Logger } from '../../utils'
import type { Runtime } from 'webextension-polyfill-ts'
import { browser } from 'webextension-polyfill-ts'
import type { Message } from '../../utils/Messenger'
import Law from '../../types/Law'
import Tooltip from '../Tooltip'
import PDFSvg from '../../assets/icons/pdf.svg'

let port: Runtime.Port

const NODE_TYPES = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
}

const downloadPDF = (
  { law, doctype }: { law: Law.Case | Law.Legislation, doctype: Law.Link[`doctype`]},
) => async (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  port.postMessage({
    action: Messenger.ACTION_TYPES.downloadPDF,
    doctype,
    law,
    source: Messenger.TARGETS.contentScript,
    target: Messenger.TARGETS.background,
  })
}

const setOpenInNewTab = (element: HTMLElement): HTMLElement => {
  element.setAttribute(`target`, `_blank`)
  element.setAttribute(`rel`, `noopener noreferrer`)
  return element
}

const handleViewCitation = (message: Message) => {
  const data = message.data as Law.Case[]
  const tooltip: HTMLElement = document.querySelector(`#clerkent-tooltip`)

  if(data.length === 0){
    tooltip.textContent = `Could not find case`
  } else {
    const { name, citation, links, jurisdiction, database } = data[0] as Law.Case

    tooltip.innerHTML = ``

    // meta
    const metaDiv = document.createElement(`div`)
    metaDiv.classList.add(`clerkent-meta`)
    const jurisSpan = document.createElement(`span`)
    jurisSpan.textContent = Constants.JURISDICTIONS[jurisdiction].emoji
    metaDiv.append(jurisSpan)

    const databaseSpan = document.createElement(`span`)
    databaseSpan.textContent = database.name
    metaDiv.append(databaseSpan)

    const summaryURL = Helpers.getSummaryLink(links)?.url
    const judgmentLink = Helpers.getJudgmentLink(links)
    const opinionLink = Helpers.getOpinionLink(links)
    
    const caseNameElement = document.createElement(`a`)
    if(summaryURL){
      caseNameElement.href = summaryURL
      setOpenInNewTab(caseNameElement)
    }
    caseNameElement.textContent = `${name} ${citation}`

    tooltip.append(metaDiv)
    tooltip.append(caseNameElement)

    const linksDiv = document.createElement(`div`)
    linksDiv.className = `clerkent-links`
    if(judgmentLink){
      const judgmentLinkElement = document.createElement(`a`)
      judgmentLinkElement.href = judgmentLink?.url
      judgmentLinkElement.textContent = `Judgment`
      setOpenInNewTab(judgmentLinkElement)

      const judgmentPDFElement = document.createElement(`a`)
      judgmentPDFElement.className = `clerkent-pdf`
      judgmentPDFElement.href = judgmentLink?.url
      const judgmentPDFIcon = document.createElement(`img`)
      judgmentPDFIcon.src = browser.runtime.getURL(PDFSvg) 
      judgmentPDFIcon.alt = `download PDF of judgment`
      judgmentPDFElement.append(judgmentPDFIcon)
      judgmentPDFElement.addEventListener(
        `click`,
        downloadPDF({ doctype: `Judgment`, law: data[0] as Law.Case }),
      )

      linksDiv.append(judgmentLinkElement)
      linksDiv.append(judgmentPDFElement)
    }
    if(opinionLink){
      const opinionLinkElement = document.createElement(`a`)
      opinionLinkElement.href = opinionLink?.url
      opinionLinkElement.textContent = `Opinion`
      setOpenInNewTab(opinionLinkElement)

      const opinionPDFElement = document.createElement(`a`)
      opinionPDFElement.className = `clerkent-pdf`
      opinionPDFElement.href = opinionLink?.url
      const opinionPDFIcon = document.createElement(`img`)
      opinionPDFIcon.src = browser.runtime.getURL(PDFSvg) 
      opinionPDFIcon.alt = `download PDF of opinion`
      opinionPDFElement.append(opinionPDFIcon)
      opinionPDFElement.addEventListener(
        `click`,
        downloadPDF({ doctype: `Opinion`, law: data[0] as Law.Case }),
      )

      linksDiv.append(opinionLinkElement)
      linksDiv.append(opinionPDFElement)
    }

    tooltip.append(linksDiv)
  }
}

const mouseOverCitation = (event: MouseEvent) => {
  const tooltip: HTMLElement = document.querySelector(`#clerkent-tooltip`)
  tooltip.style.display = `block`
  const { target } = event
  const citation = (target as HTMLElement).textContent
  tooltip.textContent = `Loading...`
  port.postMessage({
    action: Messenger.ACTION_TYPES.viewCitation,
    citation,
    source: Messenger.TARGETS.contentScript,
    target: Messenger.TARGETS.background,
  })

  const maxWidth = 300
  const bodyWidth = document.body.getBoundingClientRect().width
  const boundingRect =  (target as HTMLElement).getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const top = (boundingRect.top - tooltipRect.height) <= tooltipRect.height
    ? (boundingRect.bottom)
    : (boundingRect.top - tooltipRect.height) 
  let left = boundingRect.left + boundingRect.width / 2 - tooltipRect.width / 2
  if((left + maxWidth) > bodyWidth) { // citation is so far right to be almost off-screen
    left = bodyWidth-maxWidth+tooltipRect.width / 2
  }
  if(boundingRect.width > maxWidth){
    left = boundingRect.left
  }
  tooltip.style.top = `${top}px`
  tooltip.style.left = `${left}px`

  Tooltip.stopTimer()
}

const mouseOutCitation = () => Tooltip.startTimer()

const highlightNode = async (node: Text, { citation, index }) => {
  const mark = document.createElement(`span`)
  mark.className = `clerkent case`
  mark.addEventListener(`mouseover`, mouseOverCitation)
  mark.addEventListener(`mouseout`, mouseOutCitation)

  if(node.length >= index){
    const highlighted = node.splitText(index)
    highlighted.splitText(citation.length)
  
    const highlightedClone = highlighted.cloneNode(true)
    mark.append(highlightedClone)
    highlighted.parentNode.replaceChild(mark, highlighted)
  }
}


const handleNode = (node: Node) => {
  const { nodeType, nodeValue } = node
  if (nodeType === NODE_TYPES.TEXT_NODE) {
    const matches = Finder.findCaseCitation(nodeValue)

    for (const match of matches) {
      Logger.log(`highlighting`, node)
      highlightNode(node as Text, match)
    }
  }
}

// const isElementNode = (node: Node) => node.nodeType === NODE_TYPES.ELEMENT_NODE
// const isTextNode = (node: Node) => node.nodeType === NODE_TYPES.TEXT_NODE
const isHiddenNode = (node: Node) => {
  let parentElement: HTMLElement
  while (parentElement !== null && parentElement?.nodeName?.toLowerCase() !== `body`) {
    parentElement = typeof parentElement === `undefined` ? node.parentElement : parentElement.parentElement
    const isStyleHidden = [`none`, `hidden`].includes(parentElement?.style?.display)
    const isComputedStyleHidden = [`none`, `hidden`].includes(window.getComputedStyle(parentElement).getPropertyValue(`display`).toLowerCase())
    if (isStyleHidden || isComputedStyleHidden) {
      return true
    } else {
      continue
    }
  }
  return false
}
const isEmptyNode = (node: Node) => node.textContent.trim().length === 0
const validParentNode = (node: Node) => (
  ![`script`, `noscript`, `style`, `textarea`, `math`].includes(node.parentElement.nodeName.toLowerCase()) &&
  !node.parentElement.classList.contains(`clerkent`)
)

const nodeFilter = (node: Node) => {
  if (!isEmptyNode(node) && validParentNode(node) && !isHiddenNode(node)) {
    return NodeFilter.FILTER_ACCEPT
  }
  return NodeFilter.FILTER_REJECT
}

const scanForCitations = (inputPort: Runtime.Port) => {
  port = inputPort

  Logger.log(`scanning for citations`)
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    { acceptNode: nodeFilter },
  )

  let hasHits = false

  while (treeWalker.nextNode() !== null) {
    if (!hasHits) {
      hasHits = true
    }
    const currentNode = treeWalker.currentNode
    handleNode(currentNode)
  }

  return hasHits
}

const Highlighter = {
  handleViewCitation,
  scanForCitations,
}

export default Highlighter