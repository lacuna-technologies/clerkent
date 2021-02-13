import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import Finder from '../utils/Finder'
import Messenger from '../utils/Messenger'
import type { Message } from '../utils/Messenger'
import Tooltip from './Tooltip'
import './ContentScript.scss'
import Law from '../types/Law'
import { JURISDICTIONS } from '../utils/Constants'

let port: Runtime.Port

const NODE_TYPES = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
}

const downloadFile = ({ name, link, citation }) => async (event: Event) => {
  event.preventDefault()
  port.postMessage({
    action: Messenger.ACTION_TYPES.downloadFile,
    filename: `${name} ${citation}.pdf`,
    target: Messenger.TARGETS.background,
    url: link,
  })
}

const handleViewCitation = (message: Message) => {
  const { data } = message
  const tooltip: HTMLElement = document.querySelector(`#clerkent-tooltip`)
  if(data === false){
    tooltip.textContent = `Could not find case`
  } else {
    const { name, link, pdf, jurisdiction, database } = data as Law.Case

    tooltip.innerHTML = ``

    const caseName = document.createElement(`strong`)
    caseName.textContent = name

    // meta
    const metaDiv = document.createElement(`div`)
    metaDiv.classList.add(`clerkent-meta`)
    const jurisSpan = document.createElement(`span`)
    jurisSpan.textContent = JURISDICTIONS[jurisdiction].emoji
    metaDiv.append(jurisSpan)
    
    if(link){
      const databaseLink = document.createElement(`a`)
      databaseLink.href = link
      databaseLink.setAttribute(`target`, `_blank`)
      databaseLink.setAttribute(`rel`, `noopener noreferrer`)
      databaseLink.textContent = database.name
      metaDiv.append(databaseLink)
    } else {
      const databaseSpan = document.createElement(`span`)
      databaseSpan.textContent = database.name
      metaDiv.append(databaseSpan)
    }
    
    tooltip.append(metaDiv)

    const linksDiv = document.createElement(`div`)
    if(pdf){
      const pdfLink = document.createElement(`a`)
      pdfLink.href = pdf
      pdfLink.addEventListener(`click`, downloadFile(data as Law.Case))
      pdfLink.textContent = `PDF`
      pdfLink.setAttribute(`target`, `_blank`)
      pdfLink.setAttribute(`rel`, `noopener noreferrer`)
      linksDiv.append(pdfLink)
    }

    tooltip.append(caseName)
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
    target: Messenger.TARGETS.background,
  })

  const boundingRect =  (target as HTMLElement).getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const top = (boundingRect.top - tooltipRect.height) <= tooltipRect.height
    ? (boundingRect.bottom)
    : (boundingRect.top - tooltipRect.height) 
  const left = boundingRect.left + boundingRect.width / 2 - tooltipRect.width / 2
  tooltip.style.top = `${top}px`
  tooltip.style.left = `${left}px`

  Tooltip.stopTimer()
}

const mouseOutCitation = () => Tooltip.startTimer()

const highlightNode = (node: Text, { citation, index }) => {
  const mark = document.createElement(`span`)
  mark.className = `clerkent case`
  mark.addEventListener(`mouseover`, mouseOverCitation)
  mark.addEventListener(`mouseout`, mouseOutCitation)

  const highlighted = node.splitText(index)
  highlighted.splitText(citation.length)

  const highlightedClone = highlighted.cloneNode(true)
  mark.append(highlightedClone)
  highlighted.parentNode.replaceChild(mark, highlighted)
}


const handleNode = (node: Node) => {
  if (node.nodeType === NODE_TYPES.TEXT_NODE) {
    const { textContent } = node
    const matches = Finder.findCase(textContent)

    for (const match of matches) {
      console.log(`highlighting`, node)
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

const scanForCitations = () => {
  console.log(`scanning for citations`)
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

  if (hasHits) {
    Tooltip.init()
  }
}

const init = (() => {
  port = browser.runtime.connect(``, { name: `contentscript-port` })

  const onMessage = (message: Message) => {
    console.log(`content script received:`, message)
    if(message.target !== Messenger.TARGETS.contentScript){
      return null // ignore
    }
    if(message.action === Messenger.ACTION_TYPES.viewCitation){
      handleViewCitation(message)
    }
    
  }
  port.onMessage.addListener(onMessage)

  scanForCitations()
})()

export default init