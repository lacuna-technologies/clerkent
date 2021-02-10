declare namespace Law {
  interface Case {
    name: string,
    citation: string,
    link: string
    pdf?: string
    jurisdiction?: JursidictionCode
  }

  type JursidictionCode = `SG` | `EW`
}

export default Law