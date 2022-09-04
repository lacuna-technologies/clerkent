import Constants from 'utils/Constants'
import Flag from 'react-world-flags'

type Props = {
  id: Law.JurisdictionCode
}

const JurisdictionFlag = ({ id }: Props) => {
  const props = { className: `h-[20px]` }
  switch(id){
    case Constants.JURISDICTIONS.AU.id: {
      return <Flag code="au" {...props} />
    }
    case Constants.JURISDICTIONS.CA.id: {
      return <Flag code="ca" {...props} />
    }
    case Constants.JURISDICTIONS.ECHR.id: {
      return <img src="/assets/ecthr.png" {...props} />
    }
    case Constants.JURISDICTIONS.EU.id: {
      return <Flag code="EU" {...props} />
    }
    case Constants.JURISDICTIONS.HK.id: {
      return <Flag code="hk" {...props} />
    }
    case Constants.JURISDICTIONS.MY.id: {
      return <Flag code="my" {...props} />
    }
    case Constants.JURISDICTIONS.NZ.id: {
      return <Flag code="nz" {...props} />
    }
    case Constants.JURISDICTIONS.SG.id: {
      return <Flag code="sg" {...props} />
    }
    case Constants.JURISDICTIONS.UK.id: {
      return <Flag code="gb" {...props} />
    }
    case Constants.JURISDICTIONS.UN.id: {
      return <img src="/assets/icj.png" {...props} />
    }
    default:
      return null
  }
}

export default JurisdictionFlag