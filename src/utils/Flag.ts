import { browser } from 'webextension-polyfill-ts'
import Constants from 'utils/Constants'
import AUFlag from 'svg-country-flags/svg/au.svg'
import CAFlag from 'svg-country-flags/svg/ca.svg'
import EUFlag from 'svg-country-flags/svg/eu.svg'
import HKFlag from 'svg-country-flags/svg/hk.svg'
import MYFlag from 'svg-country-flags/svg/my.svg'
import NZFlag from 'svg-country-flags/svg/nz.svg'
import SGFlag from 'svg-country-flags/svg/sg.svg'
import GBFlag from 'svg-country-flags/svg/gb.svg'

export const getFlagSource = (id: Law.Jurisdiction[`id`]) => {
  let source
  switch(id){
    case Constants.JURISDICTIONS.AU.id: {
      source = AUFlag
      break
    }
    case Constants.JURISDICTIONS.CA.id: {
      source = CAFlag
      break
    }
    case Constants.JURISDICTIONS.ECHR.id: {
      source = `/assets/ecthr.png`
      break
    }
    case Constants.JURISDICTIONS.EU.id: {
      source = EUFlag
      break
    }
    case Constants.JURISDICTIONS.HK.id: {
      source = HKFlag
      break
    }
    case Constants.JURISDICTIONS.MY.id: {
      source = MYFlag
      break
    }
    case Constants.JURISDICTIONS.NZ.id: {
      source = NZFlag
      break
    }
    case Constants.JURISDICTIONS.SG.id: {
      source = SGFlag
      break
    }
    case Constants.JURISDICTIONS.UK.id: {
      source = GBFlag
      break
    }
    case Constants.JURISDICTIONS.UN.id: {
      source = `/assets/icj.png`
      break
    }
    default:
      source = ``
      break
  }
  return browser.runtime.getURL(source)
}