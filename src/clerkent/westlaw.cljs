(ns clerkent.westlaw
  (:require ["dotenv" :as dotenv]
            [fs :as fs]
            [oops.core :refer [oget]]
            ["playwright-chromium" :refer (chromium)]
            [cljs.core.async :refer [go]]
            [cljs.core.async.interop :refer-macros [<p!]]
            [clojure.string :as str]))

(.config dotenv)

(def WESTLAW_URL "https://signon.thomsonreuters.com/federation/UKF?entityID=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&returnto=https%3A%2F%2Fwestlawuk.thomsonreuters.co.uk%2FBrowse%2FHome%2FWestlawUK%3FskipAnonymous%3Dtrue")
(def WESTLAW_CASE_SEARCH_URL "https://uk.westlaw.com/Browse/Home/WestlawUK/Cases?transitionType=Default&contextData=%28sc.Default%29")

(def SHIBBOLETH_USERNAME (oget js/process.env :SHIBBOLETH_USERNAME))
(def SHIBBOLETH_PASSWORD (oget js/process.env :SHIBBOLETH_PASSWORD))

(def DATA_FILE "login.json")

(defn write-cookies [cookies]
  ; ())
  (.writeFileSync fs DATA_FILE (.stringify js/JSON cookies)))

(defn read-cookies []
  (if (.existsSync fs DATA_FILE)
    (.parse js/JSON (.readFileSync fs DATA_FILE #js{:encoding "utf-8"}))
    nil))

(defn clean-case-name [case-name]
  (js/console.log case-name)
  (-> case-name
      (str/replace (re-pattern "(\\(.*\\))|(Ltd|UK)") "")
      (str/replace (re-pattern "( ){2,}") " ")
      (str/trim)))

(defn do-shibboleth-login [page context]
  (go
    (try
          ; do Shibboleth login
      (<p! (.goto page WESTLAW_URL))
      (<p! (.fill page "css=#username" SHIBBOLETH_USERNAME))
      (<p! (.fill page "css=#password" SHIBBOLETH_PASSWORD))
      (<p! (.click page "css=button[name=_eventId_proceed]"))
      (let [current-cookies (<p! (.cookies context))]
        (write-cookies current-cookies))
      (catch js/Error err (js/console.error err)))))

(defn is-signed-in? [page]
  (go
    (try
      (<p! (.waitForSelector page "#co_oneClickSignoutContainer"))
      true
      (catch js/Error err
        (js/console.error err)
        false))))

(defn download-case [citation]
  (go
    (let [browser (<p! (.launch chromium #js{:headless false}))
          context (<p! (.newContext browser #js{:acceptDownloads true}))
          page (<p! (.newPage context))
          cookies (read-cookies)]
      (if (nil? cookies)
        (<p! (do-shibboleth-login page context))
        (try
          (.addCookies context cookies)
          (<p! (.goto page WESTLAW_URL))
          (if (is-signed-in? page)
            ()
            (do-shibboleth-login context cookies))
          ; TODO: check if cookies still valid, and do shibboleth login if not
          (catch js/Error err (js/console.error err))))
      (try
          ; search for case by citation
        (<p! (.waitForSelector page "#searchInputId"))
        (<p! (.goto page WESTLAW_CASE_SEARCH_URL))
        (<p! (.fill page "#co_search_advancedSearch_CI" citation))
        (<p! (.press page "#co_search_advancedSearch_CI" "Enter"))

        ; download PDF
        (<p! (.waitForSelector page ".co_search_detailLevel_2"))
        (<p! (.waitForSelector page "#cobalt_result_ukCase_title1"))
        (let [case-name (<p! (.innerText page "#cobalt_result_ukCase_title1"))
              result (<p! (js/Promise.all [(.waitForEvent page "download") (.click page ".co_search_detailLevel_2 a span.icon_colour_pdf")]))
              download (get result 0)
              path (<p! (.saveAs download (str "./downloads/" (clean-case-name case-name) ".pdf")))]
          (js/console.log path))
        (catch js/Error err (js/console.error err)))
      (<p! (.close browser)))))