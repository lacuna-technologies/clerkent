import React, { useCallback } from 'react'
import {browser, Tabs} from 'webextension-polyfill-ts'

import './Popup.scss'

const  openWebPage = (url: string): Promise<Tabs.Tab> =>  browser.tabs.create({url})

const westlawURL = `https://signon.thomsonreuters.com/federation/UKF?entityID=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&returnto=https%3A%2F%2Fwestlawuk.thomsonreuters.co.uk%2FBrowse%2FHome%2FWestlawUK%3FskipAnonymous%3Dtrue`

const Popup: React.FC = () => {
  const openWestlaw = useCallback(() => openWebPage(westlawURL), [])

  return (
    <section id="popup">
      <button
        type="button"
        onClick={openWestlaw}
      >
        Open Westlaw
      </button>
    </section>
  )
}

export default Popup
