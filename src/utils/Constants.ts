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
  ECHR: {
    emoji: `🇪🇺`,
    id: `ECHR` as Law.JursidictionCode,
    name: `ECHR`,
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
  // ID: {
  //   emoji: ``,
  //   id: `IN` as Law.JursidictionCode,
  //   name: `India`
  // },
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
  UN: {
    emoji: `🌐`,
    id: `UN` as Law.JursidictionCode,
    name: `United Nations (ICJ)`,
  },
}

type CountryDatabases = Record<string, Omit<Law.Database, `id`>>

const SG_DATABASES: CountryDatabases = {
  elitigation: {
    icon: ``,
    name: `eLitigation`,
    url: `https://www.elitigation.sg/gdviewer/Home/Index`,
  },
  ipos: {
    icon: ``,
    name: `IPOS`,
    url: `https://www.ipos.gov.sg/manage-ip/resolve-ip-disputes/legal-decisions`,
  },
  lawnetsg: {
    icon: ``,
    name: `Lawnet.sg`,
    url: `https://www.lawnet.sg/lawnet/web/lawnet/home`,
  },
  lexis: {
    icon: ``,
    name: `Lexread`,
    url: `https://www.lexread.lexisnexis.com/`,
  },
  openlaw: {
    icon: ``,
    name: `OpenLaw`,
    url: `https://www.lawnet.com/openlaw`,
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
  stb: {
    icon: ``,
    name: `Strata Titles Board`,
    url: `https://www.stratatb.gov.sg/resources-judgments.html`,
  },
  westlaw: {
    icon: ``,
    name: `Westlaw Asia`,
    url: `https://www.westlawasia.com/singapore/`,
  },
}

const UK_DATABASES: CountryDatabases = {
  bailii: {
    icon: ``,
    name: `BAILII`,
    url: `https://bailii.org/`,
  },
  ipo: {
    icon: ``,
    name: `IPO`,
    url: `https://www.gov.uk/government/organisations/intellectual-property-office`,
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

const EU_DATABASES: CountryDatabases = {
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
  eurlex: {
    icon: ``,
    name: `EUR-Lex`,
    url: `https://eur-lex.europa.eu/homepage.html`,
  },
}

const HK_DATABASES: CountryDatabases = {
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
  lrs: {
    icon: ``,
    name: `Legal Reference System`,
    url: `https://www.judiciary.hk/en/legal_ref/judgments.htm`,
  },
}

const CA_DATABASES: CountryDatabases = {
  canlii: {
    icon: ``,
    name: `CanLII`,
    url: `https://www.canlii.org/en`,
  },
}

const AU_DATABASES: CountryDatabases = {
  austlii: {
    icon: ``,
    name: `AustLII`,
    url: `https://www8.austlii.edu.au`,
  },
}

const NZ_DATABASES: CountryDatabases = {
  nzlii: {
    icon: ``,
    name: `NZLII`,
    url: `https://www.nzlii.org`,
  },
}

const MY_DATABASES: CountryDatabases = {
  kehakiman: {
    icon: ``,
    name: `Kehakiman`,
    url: `https://ejudgment.kehakiman.gov.my/portal/ap_list_all.php`,
  },
}

const ECHR_DATABASES: CountryDatabases = {
  hudoc: {
    icon: ``,
    name: `HUDOC`,
    url: `https://hudoc.echr.coe.int/eng`,
  },
}

const UN_DATABASES: CountryDatabases = {
  icjcij: {
    icon: ``,
    name: `ICJ`,
    url: `https://www.icj-cij.org/en/decisions`,
  },
}

const MISC_DATABASES: Record<string, Law.Database> = {
  commonlii: {
    icon: ``,
    id: `commonlii`,
    name: `CommonLII`,
    url: `http://www.commonlii.org`,
  },
  custom: {
    icon: ``,
    id: `custom`,
    name: `Clerkent`,
    url: `#`,
  },
}

const INSTITUTIONAL_LOGINS = {
  KCL: `King's College London`,
  LSE: `London School of Economics`,
  NONE: `None`,
  NTU: `Nanyang Technological University`,
  NUS: `National University of Singapore`,
  SMU: `Singapore Management University`,
  UCL: `University College London`,
}

const dedupeObjects = (inputObject: Record<string, Record<string, string>>, jurisdictionCode: Law.JursidictionCode) =>
  Object.fromEntries(Object.entries(inputObject)
  .map(( [id, object]: [string, Record<string, string>]) => [`${jurisdictionCode}_${id}`, {
      id: `${jurisdictionCode}_${id}`,
      ...object,
    }]))

const DATABASES: Record<string, Law.Database> = {
  ...dedupeObjects(SG_DATABASES, `SG`) as Record<string, Law.Database>,
  ...dedupeObjects(UK_DATABASES, `UK`) as Record<string, Law.Database>,
  ...dedupeObjects(EU_DATABASES, `EU`) as Record<string, Law.Database>,
  ...dedupeObjects(HK_DATABASES, `HK`) as Record<string, Law.Database>,
  ...dedupeObjects(CA_DATABASES, `CA`) as Record<string, Law.Database>,
  ...dedupeObjects(AU_DATABASES, `AU`) as Record<string, Law.Database>,
  ...dedupeObjects(NZ_DATABASES, `NZ`) as Record<string, Law.Database>,
  ...dedupeObjects(MY_DATABASES, `MY`) as Record<string, Law.Database>,
  ...dedupeObjects(ECHR_DATABASES, `ECHR`) as Record<string, Law.Database>,
  ...dedupeObjects(UN_DATABASES, `UN`) as Record<string, Law.Database>,
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
  INSTITUTIONAL_LOGINS,
  JURISDICTIONS,
}

export default Constants