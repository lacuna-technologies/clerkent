const ACTION_TYPES = {
  // download all citations given file
  downloadFile: `downloadFile`,
  // download all citations in selection
  downloadSelection: `downloadSelection`,
  test: `test`, 
  test2: `test2`, 
}

type ValueOf<T> = T[keyof T]
type Action = ValueOf<typeof ACTION_TYPES>

export interface Message {
  action: Action
}

// eslint-disable-next-line quotes
const makeActionMessage = (action: Message['action']): Message => ({ action })

const Messenger = {
  ACTION_TYPES,
  makeActionMessage,
}

export default Messenger