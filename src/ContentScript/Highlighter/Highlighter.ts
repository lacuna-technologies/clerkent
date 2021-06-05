import { Messenger, Helpers, Finder, Constants, Logger } from '../../utils'
import type { Runtime } from 'webextension-polyfill-ts'
import type { Message } from '../../utils/Messenger'
import Law from '../../types/Law'
import Tooltip from '../Tooltip'

let port: Runtime.Port

const NODE_TYPES = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
}

const downloadFile = ({ name, citation, pdf }) => async (event: Event) => {
  event.preventDefault()
  port.postMessage({
    action: Messenger.ACTION_TYPES.downloadFile,
    filename: `${Helpers.sanitiseFilename(name)} ${citation}.pdf`,
    source: Messenger.TARGETS.contentScript,
    target: Messenger.TARGETS.background,
    url: pdf,
  })
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

    const judgmentLink = Helpers.getBestLink(links)
    
    const caseName = document.createElement(`a`)
    if(judgmentLink){
      caseName.href = judgmentLink.url
      caseName.setAttribute(`target`, `_blank`)
      caseName.setAttribute(`rel`, `noopener noreferrer`)
    }
    caseName.textContent = `${name} ${citation}`

    tooltip.append(metaDiv)
    tooltip.append(caseName)

    const linksDiv = document.createElement(`div`)
    const pdfLink = Helpers.getPDFLink(links)
    if(pdfLink){
      const pdfLinkElement = document.createElement(`a`)
      pdfLinkElement.href = pdfLink.url
      pdfLinkElement.addEventListener(`click`, downloadFile({ citation, name, pdf: pdfLink.url }))
      pdfLinkElement.textContent = `PDF`
      pdfLinkElement.setAttribute(`target`, `_blank`)
      pdfLinkElement.setAttribute(`rel`, `noopener noreferrer`)
      linksDiv.append(pdfLinkElement)
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