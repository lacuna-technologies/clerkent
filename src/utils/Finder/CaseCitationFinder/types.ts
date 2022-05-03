import type Law from '../../../types/Law'

export interface CaseCitationFinderResult {
  jurisdiction: Law.JursidictionCode
  citation: string,
  index: number,
  year?: string,
  court? : string,
  abbr?: string,
  type: `case-citation`
}