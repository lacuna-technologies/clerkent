import React from 'react'
import { createRoot } from 'react-dom/client'
import Browser from '../utils/Browser'
import 'styles/tailwind.css'

const Guide = () => {

  const isChrome = Browser.isChrome()
  
  return (
    <main className="max-w-[60rem] w-full my-0 mx-auto py-8 px-4 font-sans text-lg select-none">
      <span className="text-5xl">🎉</span>
      <h1 className="text-5xl font-black mt-4">Great job!</h1>
      <h2 className="text-3xl font-bold mt-6">
        You've successfully installed&nbsp;
        <img src="/assets/clerkent.png" alt="Clerkent logo" className="inline-block w-8" />
        &nbsp;Clerkent.
      </h2>
      
      <p className="mt-8">
        It should now appear in your browser toolbar (at the top-right corner of your browser window).
        Click the Clerkent icon and try searching for something (e.g. "<span className="select-text">[1892] EWCA Civ 1</span>").
      </p>

      <p className="mt-8">
        You can also open the search popup via the keyboard shortcut <kbd>Ctrl</kbd><kbd>Space</kbd>.
      </p>

      <div className="fixed right-40 top-8 flex flex-col items-center">
        <span className="text-4xl mb-2">↗️</span>
        <span>(somewhere here)</span>
      </div>
      
      {
        isChrome ? (
          <section className="text-center">
            <p className="text-left">
              On Chrome, newly-installed extensions might not immediately be visible. You can find hidden extensions by clicking the 3 dots in your browser toolbar. To save yourself a click each time, you can then pin Clerkent to your browser toolbar by clicking the pin icon.
            </p>
            <img
              className="mt-4"
              src="/assets/chrome_toolbar_screenshot.png"
              alt="chrome screenshot"
            />
          </section>
        ) : null
      }

      <p className="mt-8">
        <strong>Tip:&nbsp;</strong>If you use an institutional login for proprietary databases (e.g. WestLaw or LawNet), you should set it on the&nbsp;
        <a className="text-black underline decoration-dotted hover:blue-600 hover:no-underline" href="/options.html">Options page</a>
        &nbsp;so Clerkent can redirect you to the appropriate login page.
      </p>

      <p className="mt-8">
        Once you've clicked the icon and found the Clerkent search box, you can close this tab.
      </p>

      <footer className="mt-8 text-center">
        <a
          className="text-black underline decoration-dotted hover:blue-600 hover:no-underline"
          href="https://clerkent.huey.xyz/help"
        >
          Get Help
        </a>
      </footer>
    </main>
  )
}

const container = document.querySelector(`#clerkent-guide-root`)
const root = createRoot(container)

root.render(<Guide /> )
