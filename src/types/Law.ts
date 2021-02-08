declare namespace Law {
  interface Case {
    name: string,
    citation: string,
    link: string
  }

  type JursidictionCode = `SG` | `EW`
}

export default Law