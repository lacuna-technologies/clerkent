const JURISDICTIONS: Record<Law.JurisdictionCode, Law.Jurisdiction> = {
  AU: {
    emoji: `🇦🇺`,
    id: `AU` as Law.JurisdictionCode,
    name: `Australia`,
  },
  CA: {
    emoji: `🇨🇦`,
    id: `CA` as Law.JurisdictionCode,
    name: `Canada`,
  },
  ECHR: {
    emoji: `🇪🇺`,
    id: `ECHR` as Law.JurisdictionCode,
    name: `ECHR`,
  },
  EU: {
    emoji: `🇪🇺`,
    id: `EU` as Law.JurisdictionCode,
    name: `European Union`,
  },
  HK: {
    emoji: `🇭🇰`,
    id: `HK` as Law.JurisdictionCode,
    name: `Hong Kong`,
  },
  // ID: {
  //   emoji: ``,
  //   id: `IN` as Law.JurisdictionCode,
  //   name: `India`
  // },
  MY: {
    emoji: `🇲🇾`,
    id: `MY` as Law.JurisdictionCode,
    name: `Malaysia`,
  },
  NZ: {
    emoji: `🇳🇿`,
    id: `NZ` as Law.JurisdictionCode,
    name: `New Zealand`,
  },
  SG: {
    emoji: `🇸🇬`,
    id: `SG` as Law.JurisdictionCode,
    name: `Singapore`,
  },
  UK: {
    emoji: `🇬🇧`,
    id: `UK` as Law.JurisdictionCode,
    name: `United Kingdom`,
  },
  UN: {
    emoji: `🌐`,
    id: `UN` as Law.JurisdictionCode,
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
} as const

const UK_DATABASES: CountryDatabases = {
  bailii: {
    icon: ``,
    name: `BAILII`,
    url: `https://www.bailii.org/`,
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
} as const

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
} as const

const CA_DATABASES: CountryDatabases = {
  canlii: {
    icon: ``,
    name: `CanLII`,
    url: `https://www.canlii.org/en`,
  },
} as const

const AU_DATABASES: CountryDatabases = {
  austlii: {
    icon: ``,
    name: `AustLII`,
    url: `https://www8.austlii.edu.au`,
  },
  nsw_caselaw: {
    icon: ``,
    name: `New South Wales Caselaw`,
    url: `https://www.caselaw.nsw.gov.au`,
  },
  queensland_judgments: {
    icon: ``,
    name: `Queensland Judgments`,
    url: `https://www.queenslandjudgments.com.au`,
  },
  queensland_scl: {
    icon: ``,
    name: `Queensland Supreme Court Library`,
    url: `https://www.sclqld.org.au`,
  },
  victoria_lawlibrary: {
    icon: ``,
    name: `Law Library Victoria`,
    url: `https://www.lawlibrary.vic.gov.au/`,
  },
} as const

const NZ_DATABASES: CountryDatabases = {
  nzlii: {
    icon: ``,
    name: `NZLII`,
    url: `https://www.nzlii.org`,
  },
} as const

const MY_DATABASES: CountryDatabases = {
  kehakiman: {
    icon: ``,
    name: `Kehakiman`,
    url: `https://ejudgment.kehakiman.gov.my/portal/ap_list_all.php`,
  },
} as const

const ECHR_DATABASES: CountryDatabases = {
  hudoc: {
    icon: ``,
    name: `HUDOC`,
    url: `https://hudoc.echr.coe.int/eng`,
  },
} as const

const UN_DATABASES: CountryDatabases = {
  icjcij: {
    icon: ``,
    name: `ICJ`,
    url: `https://www.icj-cij.org/en/decisions`,
  },
} as const

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
} as const

const INSTITUTIONAL_LOGINS = {
  KCL: `King's College London`,
  LSE: `London School of Economics`,
  NONE: `None`,
  NTU: `Nanyang Technological University`,
  NUS: `National University of Singapore`,
  SMU: `Singapore Management University`,
  UCL: `University College London`,
} as const

const dedupeObjects = (inputObject: Record<string, Record<string, string>>, jurisdictionCode: Law.JurisdictionCode) =>
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
} as const

const EU_COURTS = {
  cjeu: {
    id: `CJEU`,
    name: `Court of Justice of the European Union`,
  },
  epo: {
    id: `EPO`,
    name: `European Patent Office`,
  },
} as const

const COURTS: Record<string, Record<string, string>> = {
  ...dedupeObjects(SG_COURTS, `SG`),
  ...dedupeObjects(EU_COURTS, `EU`),
}

const DEFAULT_DATABASES_STATUS= {
  AU: {
    austlii: true,
    commonlii: true,
    nsw_caselaw: true,
    queensland_judgments: true,
    queensland_scl: true,
    victoria_lawlibrary: true,
  },
  CA: {
    canlii: true,
    commonlii: true,
  },
  ECHR: {
    hudoc: true,
  },
  EU: {
    curia: true,
    epo: true,
  },
  HK: {
    commonlii: true,
    hkliihk: true,
    hkliiorg: true,
    lrs: true,
  },
  MY: {
    commonlii: true,
    kehakiman: true,
  },
  NZ: {
    commonlii: true,
    nzlii: true,
  },
  SG: {
    commonlii: true,
    elitigation: true,
    ipos: true,
    lawnetsg: true,
    openlaw: true,
    stb: true,
  },
  UK: {
    bailii: true,
    commonlii: true,
    ipo: false,
  },
  UN: {
    icjcij: true,
  },
}

const Constants = {
  COURTS,
  DATABASES,
  DEFAULT_DATABASES_STATUS,
  INSTITUTIONAL_LOGINS,
  JURISDICTIONS,
}

export default Constants