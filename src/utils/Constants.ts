import type Law from '../types/Law'

const JURISDICTIONS = {
  AU: {
    emoji: `🇦🇺`,
    id: `AU` as Law.JursidictionCode,
    name: `Australia`,
  },
  CA: {
    emoji: `🇨🇦`,
    id: `CA` as Law.JursidictionCode,
    name: `Canada`,
  },
  EU: {
    emoji: `🇪🇺`,
    id: `EU` as Law.JursidictionCode,
    name: `European Union`,
  },
  HK: {
    emoji: `🇭🇰`,
    id: `HK` as Law.JursidictionCode,
    name: `Hong Kong`,
  },
  MY: {
    emoji: `🇲🇾`,
    id: `MY` as Law.JursidictionCode,
    name: `Malaysia`,
  },
  NZ: {
    emoji: `🇳🇿`,
    id: `NZ` as Law.JursidictionCode,
    name: `New Zealand`,
  },
  SG: {
    emoji: `🇸🇬`,
    id: `SG` as Law.JursidictionCode,
    name: `Singapore`,
  },
  UK: {
    emoji: `🇬🇧`,
    id: `UK` as Law.JursidictionCode,
    name: `United Kingdom`,
  },
}


const SG_DATABASES = {
  lawnet: {
    icon: ``,
    name: `Lawnet`,
    url: `https://www.lawnet.sg/lawnet/web/lawnet/home`,
  },
  lexis: {
    icon: ``,
    name: `Lexread`,
    url: `https://www.lexread.lexisnexis.com/`,
  },
  sc: {
    icon: ``,
    name: `Supreme Court`,
    url: `https://www.supremecourt.gov.sg/news/supreme-court-judgments`,
  },
  slw: {
    icon: ``,
    name: `Singapore Law Watch`,
    url: `https://www.singaporelawwatch.sg/Judgments`,
  },
  sso: {
    icon: ``,
    name: `Singapore Statutes Online`,
    url: `https://sso.agc.gov.sg/`,
  },
  westlaw: {
    icon: ``,
    name: `Westlaw Asia`,
    url: `https://www.westlawasia.com/singapore/`,
  },
}

const UK_DATABASES = {
  bailii: {
    icon: ``,
    name: `BAILII`,
    url: `https://bailii.org/`,
  },
  legislation: {
    icon: ``,
    name: `legislation.gov.uk`,
    url: `https://www.legislation.gov.uk/`,
  },
  lexis: {
    icon: ``,
    name: `LexisNexis`,
    url: `http://www.lexisnexis.com/uk/legal`,
  },
  westlaw: {
    icon: ``,
    name: `Westlaw`,
    url: `https://uk.westlaw.com/Browse/Home/WestlawUK`,
  },
}

const EU_DATABASES = {
  curia: {
    icon: ``,
    name: `CURIA`,
    url: `https://curia.europa.eu/juris/recherche.jsf?language=en`,
  },
  epo: {
    icon: ``,
    name: `EPO`,
    url: `https://www.epo.org/law-practice/case-law-appeals`,
  },
}

const HK_DATABASES = {
  hkliihk: {
    icon: ``,
    name: `HKLII.hk`,
    url: `https://www.hklii.hk/`,
  },
  hkliiorg: {
    icon: ``,
    name: `HKLII.org`,
    url: `https://www.hklii.org/eng/`,
  },
}

const CA_DATABASES = {
  canlii: {
    icon: ``,
    name: `CanLII`,
    url: `https://www.canlii.org/en`,
  },
}

const AU_DATABASES = {
  austlii: {
    icon: ``,
    name: `AustLII`,
    url: `https://www8.austlii.edu.au`,
  },
}

const MISC_DATABASES = {
  commonlii: {
    icon: ``,
    name: `CommonLII`,
    url: `http://www.commonlii.org`,
  },
}

const dedupeObjects = (inputObject: Record<string, Record<string, string>>, jurisdictionCode: Law.JursidictionCode) =>
  Object.entries(inputObject)
  .reduce((accumulator, [id, object]: [string, Record<string, string>]) => ({
    ...accumulator,
    [`${jurisdictionCode}_${id}`]: object,
  }), {})

const DATABASES: Record<string, Law.Database> = {
  ...dedupeObjects(SG_DATABASES, `SG`),
  ...dedupeObjects(UK_DATABASES, `UK`),
  ...dedupeObjects(EU_DATABASES, `EU`),
  ...dedupeObjects(HK_DATABASES, `HK`),
  ...dedupeObjects(CA_DATABASES, `CA`),
  ...dedupeObjects(AU_DATABASES, `AU`),
  ...MISC_DATABASES,
}

const SG_COURTS = {
  sgca: {
    id: `SGCA`,
    name: `Court of Appeal`,
  },
  sghc: {
    id: `SGHC`,
    name: `High Court`,
  },
}

const EU_COURTS = {
  cjeu: {
    id: `CJEU`,
    name: `Court of Justice of the European Union`,
  },
  epo: {
    id: `EPO`,
    name: `European Patent Office`,
  },
}

const COURTS: Record<string, Record<string, string>> = {
  ...dedupeObjects(SG_COURTS, `SG`),
  ...dedupeObjects(EU_COURTS, `EU`),
}

const Constants = {
  COURTS,
  DATABASES,
  JURISDICTIONS,
}

export default Constants