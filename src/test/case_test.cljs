(ns test.case-test
  (:require [cljs.test :refer (deftest testing is run-tests)]
            [clerkent.main]))

(defn get-random-integer [start stop]
  (if (>= start stop)
    (+ start (rand-int (- stop start)))
    (throw js/Error "stop must be larger or equal to start")))

(defn generate-citation [journal-abbr]
  (str
   "[" (get-random-integer 1800 2999) "] "
   (get {0 (str (get-random-integer 1 99) " ") 1 ""} (get-random-integer 0 1))
   journal-abbr
   " "
   (get-random-integer 1 999)))

(defn pad-citation [citation] (str "abc " citation " sfd"))
(defn test-citation [citation]
  (= (clerkent.main/get-case-citations (pad-citation citation)) citation))

(deftest case-citations-test
  (testing "neutral citations"
    (testing "UKHL" (is (test-citation (generate-citation "UKHL"))))
    (testing "EWCA" (is (test-citation (generate-citation "EWCA"))))))

(defn run [] (run-tests))