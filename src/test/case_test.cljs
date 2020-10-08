(ns test.case-test
  (:require [cljs.test :refer (deftest testing is run-tests)]))

(deftest math-test
  (testing "does math make sense?" (is (= 1 5))))

(defn run [] (run-tests))