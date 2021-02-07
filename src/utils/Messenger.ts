const ACTION_TYPES = {
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