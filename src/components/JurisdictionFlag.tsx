import { getFlagSource } from 'utils/Flag'

type Props = {
  id: Law.JurisdictionCode
}

const JurisdictionFlag = ({ id }: Props) => {
  const source = getFlagSource(id)
  const props = { className: `h-[20px]` }
  return (
    <img src={source} {...props} />
  )
}

export default JurisdictionFlag