import Constants from "../Constants"

const SGAbbrs = [
  {
    abbrs: [`pofma`, `pofma 2019`, `pofma 19`, `fake news law`],
    name: `Protection from Online Falsehoods and Manipulation Act 2019`,
  },
  {
    abbrs: [`cntma`, `c19tma`],
    name: `COVID-19 (Temporary Measures) Act 2020`,
  },
  {
    abbrs: [`ta`, `telecoms act`],
    name: `Telecommunications Act`,
  },
  {
    abbrs: [`bcisopa`, `sop`],
    name: `Building and Construction Industry Security of Payment Act`,
  },
  {
    abbrs: [`bcisopr`, `sop`],
    name: `Building and Construction Industry Security of Payment Regulations`,
  },
  {
    abbrs: [`pc`],
    name: `Penal Code`,
  },
  {
    abbrs: [`cpc`],
    name: `Criminal Procedure Code`,
  },
  {
    abbrs: [`mda`],
    name: `Misuse of Drugs Act`,
  },
  {
    abbrs: [`da`],
    name: `Defamation Act`,
  },
  {
    abbrs: [`clpa`],
    name: `Conveyancing and Law of Property Act`,
  },
  {
    abbrs: [`lpa`],
    name: `Legal Profession Act`,
  },
  {
    abbrs: [`lpcr`, `lp(pc)r`, `lp(pc)r`, `lppcr`],
    name: `Legal Profession (Professional Conduct) Rules`,
  },
].map(abbr => ({ ...abbr, jurisdiction: Constants.JURISDICTIONS.SG.id }))

const UKAbbrs = [
  {
    abbrs: [`lpa`, `lpa 1925`],
    name: `Law of Property Act 1925`,
  },
  {
    abbrs: [`lpmpa`, `lp(mp)a`, `lm(mp)a 1989`],
    name: `Law of Property (Miscellaneous Provisions) Act 1989`,
  },
  {
    abbrs: [`dpa`, `dpa 1988`],
    name: `Data Protection Act 1988`,
  },
  {
    abbrs: [`ea`, `ea 2010`],
    name: `Equality Act 2010`,
  },
  {
    abbrs: [`hra`, `hra 1998`],
    name: `Human Rights Act 1998`,
  },
  {
    abbrs: [`ca`, `ca 2006`],
    name: `Companies Act 2006`,
  },
  {
    abbrs: [`hswa`, `hswa 1974`],
    name: `Health and Safety at Work etc. Act 1974`,
  },
  {
    abbrs: [`sga`, `sga 1979`],
    name: `Sale of Goods Act 1979`,
  },
  {
    abbrs: [`foia`, `foia 2000`],
    name: `Freedom of Information Act 2000`,
  },
  {
    abbrs: [`euwa`, `euwa 2020`, `euwaa`, `euwaa 2020`, `eu(wa)`, `eu(wa) 2020`, `eu(wa)a`, `eu(wa)a 2020`],
    name: `European Union (Withdrawal Agreement) Act 2020`,
  },
  {
    abbrs: [`ipa`, `ipa 2016`],
    name: `Investigatory Powers Act 2016`,
  },
  {
    abbrs: [`eqa`, `eqa 2010`],
    name: `Equality Act 2010`,
  },
  {
    abbrs: [`lra`, `lra 2002`],
    name: `Land Registration Act 2002`,
  },
  {
    abbrs: [`lra`, `lra 1997`],
    name: `Land Registration Act 1997`,
  },
  {
    abbrs: [`pa`, `pa 2004`],
    name: `Patents Act 2004`,
  },
  {
    abbrs: [`cdpa`, `cdpa 1988`],
    name: `Copyright, Designs and Patents Act 1988`,
  },
].map(abbr => ({ ...abbr, jurisdiction: Constants.JURISDICTIONS.UK.id }))

const StatuteAbbrs = [
  ...SGAbbrs,
  ...UKAbbrs,
]

export default StatuteAbbrs