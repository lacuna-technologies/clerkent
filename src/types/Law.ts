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
    provisionType: string,
    provisionNumber: string,
    statute: string,
    link: string,
    pdf?: string,
    jurisdiction?: JursidictionCode,
    content?: string,
    database: Database
  }

  type JursidictionCode = `SG` | `UK` | `EU` | `HK` | `CA` | `AU` | `NZ` | `MY`

  type SearchMode = `case` | `legislation`
  type Type = `case-citation` | `case-name` | `legislation`
}

export default Law