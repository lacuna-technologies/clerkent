const sanitiseFilename = (fileName: string) => fileName.replace(/[^\d -,a-z]/gi, ``)

const Helpers = {
  sanitiseFilename,
}

export default Helpers