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
    jurisdiction?: JursidictionCode
    database: Database
  }
  interface Legislation {
    provision: string,
    statute: string,
    link: string,
    pdf?: string,
    jurisdiction?: JursidictionCode
  }

  type JursidictionCode = `SG` | `UK` | `EU` | `HK`
}

export default Law