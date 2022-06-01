import React from 'react'
import Browser from 'utils/Browser'

const KeyboardShortcut = () => {
  return (
    <section className="flex flex-row justify-between items-center gap-8">
      <div className="flex flex-col">
        <strong>Keyboard shortcut</strong>
        <label>
          The default keyboard shortcut for opening the search popup is&nbsp;
          <kbd>Ctrl</kbd><kbd>Space</kbd>
          . To customise it,&nbsp;
          {
            Browser.isChrome ?
              (
                <>
                  click&nbsp;
                  <a
                    className="text-blue-700 border-0 bg-none outline-none p-0 underline cursor-pointer select-text hover:text-blue-900"
                    href="chrome://extensions/shortcuts"
                    target="_blank"
                    rel="noreferrer"
                  >
                    here
                  </a>
                  .
                </>
              ) : (
                <>
                  visit&nbsp;
                  <a
                    className="text-blue-700 border-0 bg-none outline-none p-0 underline cursor-pointer select-text hover:text-blue-900"
                    href="about:addons"
                    target="_blank"
                    rel="noreferrer"
                  >
                    about:addons
                  </a>
                  &nbsp;and click "Manage Extension Shortcuts", as shown in&nbsp;
                  <a
                    className="text-blue-700 border-0 bg-none outline-none p-0 underline cursor-pointer select-text hover:text-blue-900"
                    href="https://bug1303384.bmoattachments.org/attachment.cgi?id=9051647"
                    target="_blank"
                    rel="noreferrer"
                  >
                    this video
                  </a>
                </>
              )
          }
        </label>
      </div>
    </section>
  )
}

export default KeyboardShortcut