const findLegislation = (citation: string) => {
  const regex = new RegExp(/(s ?\d{1,4})[ ,]*([ A-Z]+( ?[12]\d{3})?)/, `gi`)
  const cleanedCitation = citation.trim()
  return [...cleanedCitation.matchAll(regex)]
    .map(([_, provision, statute]) => ({
      provision,
      statute,
      type: `legislation`,
    }))
}

const LegislationFinder = {
  findLegislation,
}

export default LegislationFinder