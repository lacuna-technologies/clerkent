import type Law from '../../../types/Law'

export interface CaseCitationFinderResult {
  jurisdiction: Law.JursidictionCode
  citation: string,
  index: number,
  court? : string,
  type: `case-citation`
}