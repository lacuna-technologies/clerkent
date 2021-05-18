const DEBUG_MODE = process?.env?.NODE_ENV === `development`

const log = (...arguments_: unknown[]) => {
  if(DEBUG_MODE){
    console.log(`Clerkent:`, ...arguments_)
  }
}

const error = (...arguments_: unknown[]) => {
  if(DEBUG_MODE){
    console.error(`Clerkent:`, ...arguments_)
  }
}

const warn = (...arguments_: unknown[]) => {
  if(DEBUG_MODE){
    console.warn(`Clerkent:`, ...arguments_)
  }
}

const Logger = {
  error,
  log,
  warn,
}

export default Logger