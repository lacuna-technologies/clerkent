const ACTION_TYPES = {
  downloadFile: `downloadFile`,
  test: `test`,
  test2: `test2`, 
  viewCitation: `viewCitation`,
}

const TARGETS = {
  background: `background`,
  contentScript: `contentScript`,
  popup: `popup`,
}

type ValueOf<T> = T[keyof T]

export interface Message {
  action: ValueOf<typeof ACTION_TYPES>
  source: ValueOf<typeof TARGETS>
  target: ValueOf<typeof TARGETS>
  data?: unknown
}

const Messenger = {
  ACTION_TYPES,
  TARGETS,
}

export default Messenger