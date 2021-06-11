declare namespace Law {
  interface Database {
    icon: string,
    name: string, 
    url: string,
    id: string,
  }

  interface Link {
    doctype: `Summary` | `Judgment` | `Opinion` | `Legislation`,
    filetype: `PDF` | `HTML`,
    url: string,
  }
  interface Case {
    name: string,
    citation: string,
    links: Link[]
    jurisdiction?: JursidictionCode
    database: Database
    type?: Type
  }
  interface Legislation {
    provisionType: string,
    provisionNumber: string,
    statute: string,
    links: Link[],
    jurisdiction?: JursidictionCode,
    content?: string,
    database: Database
    type?: Type
  }

  // ISO 3166-1 alpha-2
  type JursidictionCode = `SG` | `UK` | `EU` | `HK` | `CA` | `AU` | `NZ` | `MY` | `IN`

  type SearchMode = `case` | `legislation`
  type Type = `case-citation` | `case-name` | `legislation`
}

export default Law