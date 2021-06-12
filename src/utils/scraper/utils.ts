import GestaltSimilarity from 'gestalt-pattern-matcher'
import Law from '../../types/Law'

export const sortByNameSimilarity = (query: string, cases: Law.Case[]) => cases.sort((a, b) => {
  const similarityA = GestaltSimilarity(query, a.name)
  const similarityB = GestaltSimilarity(query, b.name)
  return similarityB - similarityA
})