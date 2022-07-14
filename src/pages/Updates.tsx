import React, { useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import 'styles/tailwind.css'
import { Storage } from 'utils'
import { browser } from 'webextension-polyfill-ts'

const Updates: React.FC = () => {

  const setDoNotRemind = useCallback(async () => {
    Storage.set(`DO_NOT_REMIND_SUBSCRIBE`, true)
    const tab = await browser.tabs.getCurrent()
    browser.tabs.remove(tab.id)
  }, [])

  return (
    <main className="max-w-screen-md w-full my-0 mx-auto py-8 px-4 font-sans text-lg">
      <h1 className="text-2xl font-bold">Hey there</h1>
      <p className="my-4">
        I hope Clerkent has been useful for you.
        If you'd like to receive an email once in a
        few weeks about the latest changes and upcoming features,
        just pop your email address into the box below.
      </p>
      
      <form
        className="my-4 flex items-center"
        action="http://updates.clerkent.huey.xyz/add_subscriber"
        method="post"
        id="revue-form"
        name="revue-form"
        target="_blank"
      >
        <input className="p-2 grow border border-solid border-slate-600 rounded-l" placeholder="Your email address..." type="email" name="member[email]" id="member_email" />
        <input
          className="py-2 px-4 my-4 bg-slate-800 border border-solid border-slate-800 text-white rounded-r outline-none cursor-pointer"
          type="submit" value="Subscribe" name="member[subscribe]" id="member_submit"
          onClick={setDoNotRemind}
        />
      </form>
      <div className="text-sm self-start my-4">
        By subscribing, you agree with Revue's&nbsp;
        <a target="_blank" href="https://www.getrevue.co/terms" rel="noreferrer">Terms of Service</a>
        &nbsp;and&nbsp;
        <a target="_blank" href="https://www.getrevue.co/privacy" rel="noreferrer">Privacy Policy</a>.&nbsp;
        Your email address will only be used for this purpose and will be deleted if you unsubscribe (which you can do at any time).
      </div>
      <div className="mt-6 text-slate-600 cursor-pointer underline decoration-dotted" onClick={setDoNotRemind}>
        Don't ask me to subscribe again
      </div>
    </main>
  )
}

const container = document.querySelector(`#clerkent-updates-root`)
const root = createRoot(container)

root.render(<Updates /> )
