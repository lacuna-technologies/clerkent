const sanitiseFilename = (fileName: string) => fileName.replace(/[^\d -,a-z]/gi, ``)
const debounce = (function_: (...arguments_: any[]) => unknown, timeout = 500) => {
  let timer: NodeJS.Timer
  return (...arguments_: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => function_.apply(this, arguments_), timeout)
  }
}

const classnames = (...arguments_: string[]) => [...new Set([...arguments_])].join(` `)

const Helpers = {
  classnames,
  debounce,
  sanitiseFilename,
}

export default Helpers