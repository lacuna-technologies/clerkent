import Constants from "../../Constants"

const CustomDBCases: RawCase[] = [
  {
    citations: [
      `[1957] 1 WLR 582`,
      `[1957] 2 All ER 118`,
    ],
    database: Constants.DATABASES.custom,
    jurisdiction: Constants.JURISDICTIONS.UK.id,
    links: [
      {
        doctype: `Judgment`,
        filetype: `HTML`,
        url: `https://web.archive.org/web/20160122042428/http://oxcheps.new.ox.ac.uk:80/casebook/Resources/BOLAMV_1%20DOC.pdf`,
      },
      {
        doctype: `Judgment`,
        filetype: `PDF`,
        url: `https://web.archive.org/web/20160122042428if_/http://oxcheps.new.ox.ac.uk:80/casebook/Resources/BOLAMV_1%20DOC.pdf`,
      },
    ],
    name: `Bolam v Friern Hospital Management Committee`,
  },
]

const CustomDB = {
  cases: CustomDBCases,
}

export default CustomDB