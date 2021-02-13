declare namespace Law {
  interface Database {
    icon: string,
    name: string, 
    url: string
  }
  interface Case {
    name: string,
    citation: string,
    link: string
    pdf?: string
    jurisdiction: JursidictionCode
    database: Database
  }

  type JursidictionCode = `SG` | `EW`
}

export default Law