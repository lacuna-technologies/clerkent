(ns clerkent.westlaw
  (:require [oops.core :refer [oget]]
            ["playwright-chromium" :as playwright]
            [cljs.core.async :refer [go]]
            [cljs.core.async.interop :refer-macros [<p!]]))

(def WESTLAW_URL "http://libproxy.ucl.ac.uk/login?url=https://login.westlaw.co.uk/wluk/app/main?sp=ukucl-107")

(def chromium (oget playwright "chromium"))

(defn download-case [citation]
  (go
    (let [browser (<p! (.launch chromium #js{:headless false :slowMo 500}))
          page (<p! (.newPage browser))]
      (try
        (<p! (.goto page WESTLAW_URL))
        (<p! (.screenshot page #js{:path "screenshot.png"}))
        (catch js/Error err (js/console.error err)))
      (<p! (.close browser)))))