(ns clerkent.westlaw
  (:require ["dotenv" :as dotenv]
            [fs :as fs]
            [oops.core :refer [oget]]
            ["playwright-chromium" :as playwright]
            [cljs.core.async :refer [go]]
            [cljs.core.async.interop :refer-macros [<p!]]))

(.config dotenv)

(def WESTLAW_URL "https://signon.thomsonreuters.com/federation/UKF?entityID=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&returnto=https%3A%2F%2Fwestlawuk.thomsonreuters.co.uk%2FBrowse%2FHome%2FWestlawUK%3FskipAnonymous%3Dtrue")
(def WESTLAW_CASE_SEARCH_URL "https://uk.westlaw.com/Browse/Home/WestlawUK/Cases?transitionType=Default&contextData=%28sc.Default%29")

(def SHIBBOLETH_USERNAME (oget js/process.env :SHIBBOLETH_USERNAME))
(def SHIBBOLETH_PASSWORD (oget js/process.env :SHIBBOLETH_PASSWORD))

(def DATA_FILE "login.json")

(def chromium (oget playwright "chromium"))

(defn write-cookies [cookies]
  (.writeFileSync fs DATA_FILE (.stringify js/JSON cookies)))

(defn read-cookies []
  (if (.existsSync fs DATA_FILE)
    (.parse js/JSON (.readFileSync fs DATA_FILE #js{:encoding "utf-8"}))
    nil))

(defn download-case [citation]
  (go
    (let [browser (<p! (.launch chromium #js{:headless false :slowMo 500}))
          context (<p! (.newContext browser))
          page (<p! (.newPage context))
          cookies (read-cookies)]
      (if (nil? cookies)
        (try
          ; do Shibboleth login
          (<p! (.goto page WESTLAW_URL))
          (<p! (.fill page "#username" SHIBBOLETH_USERNAME))
          (<p! (.fill page "#password" SHIBBOLETH_PASSWORD))
          (<p! (.click page "css=button[name=_eventId_proceed]"))

          (let [current-cookies (<p! (.cookies context))]
            (write-cookies current-cookies))
          (catch js/Error err (js/console.error err)))
        ())
      (try
          ; search for case by citation
        (<p! (.waitForSelector page "#searchInputId"))
        (<p! (.goto page WESTLAW_CASE_SEARCH_URL))
        (<p! (.fill page "#co_search_advancedSearch_CI" citation))
        (<p! (.press page "#co_search_advancedSearch_CI" "Enter"))

        ; download PDF
        (<p! (.waitForSelector page "#coid_website_searchAvailableFacets"))
        (<p! (.click page "css=.co_search_detailLevel_2:last-of-type a span.icon_colour_pdf"))
        (<p! (.screenshot page #js{:path "screenshot.png"}))
        (catch js/Error err (js/console.error err)))
      (<p! (.close browser)))))