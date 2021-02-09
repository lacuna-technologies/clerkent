const ACTION_TYPES = {
  // download all citations given file
  downloadFile: `downloadFile`,
  
  // download all citations in selection
  downloadSelection: `downloadSelection`,
  
  test: `test`,
  test2: `test2`, 
  viewCitation: `viewCitation`, 
}

const TARGETS = {
  background: `backgroun`,
  contentScript: `contentScript`,
  popup: `popup`,
}

type ValueOf<T> = T[keyof T]

export interface Message {
  action: ValueOf<typeof ACTION_TYPES>
  target: ValueOf<typeof TARGETS>
}

const Messenger = {
  ACTION_TYPES,
  TARGETS,
}

export default Messenger