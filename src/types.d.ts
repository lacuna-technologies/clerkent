// eslint-disable-next-line quotes
declare module '*.svg' {
  const content: any
  export default content
}

declare module Law {
  type Database = {
    icon: string,
    name: string, 
    url: string,
    id: string,
  }

  type Link = {
    doctype: `Summary` | `Judgment` | `Opinion` | `Legislation` | `Order`,
    filetype: `PDF` | `HTML`,
    url: string,
  }
  type Case = {
    name: string,
    citation: string,
    links: Link[]
    jurisdiction?: JursidictionCode
    database: Database
    type?: Type
  }
  type Legislation = {
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
  // except for ECHR
  type JursidictionCode = `SG` | `UK` | `EU` | `HK` | `CA` | `AU` | `NZ` | `MY` | `IN` | `ECHR` | `UN`

  type SearchMode = `case` | `legislation`
  type Type = `case-citation` | `case-name` | `legislation`
}

interface RawCase extends Omit<Law.Case, `citation`> {
  citations: Law.Case[`citation`][],
}

type ValueOf<T> = T[keyof T]

declare module Messenger {
  type Message = {
    action: ValueOf<typeof ACTION_TYPES>
    source: ValueOf<typeof TARGETS>
    target: ValueOf<typeof TARGETS>
    data?: unknown
  }

  type OtherProperties = {
    [x: string]: any
  }
}

declare module Finder {
  type CaseNameFinderResult = {
    name: string,
    type: `case-name`
  }

  type FinderResult = CaseCitationFinderResult | LegislationFinderResult | CaseNameFinderResult

  type CaseCitationFinderResult = {
    jurisdiction: Law.JursidictionCode
    citation: string,
    index: number,
    year?: string,
    court? : string,
    abbr?: string,
    type: `case-citation`
  }

  type LegislationFinderResult = {
    provisionType: string,
    provisionNumber: string,
    statute: string,
    type: `legislation`,
    jurisdiction: Law.JursidictionCode
  }
}

type InstitutionalLogin = `KCL` | `LSE` | `UCL` | `NTU` | `NUS` |  `SMU` | `None`

type ThenArgument<T> = T extends PromiseLike<infer U> ? U : T

type downloadPDFType = (
  { law, doctype }: { law: Law.Case | Law.Legislation, doctype: Law.Link[`doctype`]}
) => () => void