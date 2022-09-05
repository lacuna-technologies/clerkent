import Constants from 'utils/Constants'
import AUFlag from 'svg-country-flags/svg/au.svg'
import CAFlag from 'svg-country-flags/svg/ca.svg'
import EUFlag from 'svg-country-flags/svg/eu.svg'
import HKFlag from 'svg-country-flags/svg/hk.svg'
import MYFlag from 'svg-country-flags/svg/my.svg'
import NZFlag from 'svg-country-flags/svg/nz.svg'
import SGFlag from 'svg-country-flags/svg/sg.svg'
import GBFlag from 'svg-country-flags/svg/gb.svg'

type Props = {
  id: Law.JurisdictionCode
}

const JurisdictionFlag = ({ id }: Props) => {

  const props = { className: `h-[20px]` }
  switch(id){
    case Constants.JURISDICTIONS.AU.id: {
      return <img src={AUFlag} {...props} />
    }
    case Constants.JURISDICTIONS.CA.id: {
      return <img src={CAFlag} {...props} />
    }
    case Constants.JURISDICTIONS.ECHR.id: {
      return <img src="/assets/ecthr.png" {...props} />
    }
    case Constants.JURISDICTIONS.EU.id: {
      return <img src={EUFlag} {...props} />
    }
    case Constants.JURISDICTIONS.HK.id: {
      return <img src={HKFlag} {...props} />
    }
    case Constants.JURISDICTIONS.MY.id: {
      return <img src={MYFlag} {...props} />
    }
    case Constants.JURISDICTIONS.NZ.id: {
      return <img src={NZFlag} {...props} />
    }
    case Constants.JURISDICTIONS.SG.id: {
      return <img src={SGFlag} {...props} />
    }
    case Constants.JURISDICTIONS.UK.id: {
      return <img src={GBFlag} {...props} />
    }
    case Constants.JURISDICTIONS.UN.id: {
      return <img src="/assets/icj.png" {...props} />
    }
    default:
      return null
  }
}

export default JurisdictionFlag