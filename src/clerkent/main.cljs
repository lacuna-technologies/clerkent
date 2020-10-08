(ns clerkent.main
  (:require [dotenv :refer [env]]))

(def SHIBBOLETH_USERNAME (env :SHIBBOLETH_USERNAME))
(def SHIBBOLETH_PASSWORD (env :SHIBBOLETH_PASSWORD))

(defn get-case-citations [input-string]
  (re-seq #"(\[[1-2]{1}[0-9]{3}\] ([0-9]{1,2} )?(UKHL|WLR|EG|All ER|WTLR|AC|Ch|Lloyd'?s Rep|KB|QB) [0-9]{1,3})" input-string))

(defn main []
  (prn "hello world!"))