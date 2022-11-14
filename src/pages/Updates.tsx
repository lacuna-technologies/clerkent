import type { FunctionComponent } from 'preact'
import { render } from 'preact'
import { useCallback } from 'preact/hooks'
import 'styles/tailwind.css'
import { Storage } from 'utils'
import { browser } from 'webextension-polyfill-ts'

const Updates: FunctionComponent = () => {

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
        few weeks about the latest changes and upcoming features,&nbsp;
        <a
          className="text-slate-600 underline decoration-dotted hover:blue-600 hover:no-underline"
          href="https://updates.clerkent.huey.xyz/#/portal/"
        >click here to subscribe to Clerkent Updates</a>.&nbsp;
        Alternatively, you can subscribe to&nbsp;
        <a
          className="text-slate-600 underline decoration-dotted hover:blue-600 hover:no-underline"
          href="https://updates.clerkent.huey.xyz/rss/">this RSS feed</a>.
      </p>

      <div className="mt-6 text-slate-600 cursor-pointer underline decoration-dotted" onClick={setDoNotRemind}>
        Don't ask me to subscribe again
      </div>
    </main>
  )
}

const container = document.querySelector(`#clerkent-updates-root`)
render(<Updates />, container)