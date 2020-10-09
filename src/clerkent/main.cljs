(ns clerkent.main
  (:require ["dotenv" :as dotenv]
            [oops.core :refer [oget]]))

(.config dotenv)

(def SHIBBOLETH_USERNAME (oget js/process.env :SHIBBOLETH_USERNAME))
(def SHIBBOLETH_PASSWORD (oget js/process.env :SHIBBOLETH_PASSWORD))

(defn get-case-citations [input-string]
  (let [result (re-seq #"(\[[1-2]{1}[0-9]{3}\] ([0-9]{1,2} )?(UKHL|EWCA|WLR|EG|All ER|WTLR|AC|Ch|Lloyd'?s Rep|KB|QB) [0-9]{1,3})" input-string)]
    (if (nil? result)
      nil
      (-> result
          (nth 0)
          (nth 0)))))

(defn main []
  (prn "hello world!"))