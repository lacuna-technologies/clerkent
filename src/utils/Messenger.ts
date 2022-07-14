const ACTION_TYPES = {
  downloadFile: `downloadFile`,
  downloadPDF: `downloadPDF`,
  lawnetSearch: `lawnetSearch`, 
  search: `search`,
  test: `test`,
  test2: `test2`,
  viewCitation: `viewCitation`,
}

const TARGETS = {
  background: `background`,
  contentScript: `contentScript`,
  popup: `popup`,
}

const Messenger = {
  ACTION_TYPES,
  TARGETS,
}

export default Messenger