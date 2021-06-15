import React from 'react'
import Browser from '../../utils/Browser'
import './Guide.scss'

const Guide = () => {

  const isChrome = Browser.isChrome()
  
  return (
    <main id="clerkent-guide">
      <span id="celebration-emoji">🎉</span>
      <h1>Great job!</h1>
      <h2>You've successfully installed&nbsp;<img src="/assets/clerkent.png" alt="Clerkent logo" id="clerkent-logo" /> Clerkent.</h2>
      

      <p>
        It should now appear in your browser toolbar (at the top-right corner of your browser window).
        Click the Clerkent icon and try searching for something (e.g. "carbolic smoke ball").
      </p>
      <div id="arrow-indicator">
        <span className="emoji">↗️</span>
        <span>(somewhere here)</span>
      </div>
      
      {
        isChrome ? (
          <section className="chrome-clarifications">
            <p>
              On Chrome, newly-installed extensions might not immediately be visible. You can find hidden extensions by clicking the 3 dots in your browser toolbar. To save yourself a click each time, you can then pin Clerkent to your browser toolbar by clicking the pin icon.
            </p>
            <img src="/assets/chrome_toolbar_screenshot.png" alt="chrome screenshot" />
          </section>
        ) : null
      }

      <p>
        Once you've clicked the icon and found the Clerkent search box, you can close this tab.
      </p>

      <footer>
        <a href="https://clerkent.huey.xyz/help">Get Help</a>
      </footer>
    </main>
  )
}

export default Guide