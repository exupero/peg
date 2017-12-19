(ns peg.cmu
  (:require [clojure.java.io :as io]
            [clojure.string :as string]
            [cognitect.transit :as transit])
  (:import [java.io ByteArrayOutputStream]))

(def numbers
  {"B" [9]
   "CH" [6]
   "D" [1]
   "DH" [1]
   "ER" [4]
   "F" [8]
   "G" [7]
   "JH" [6]
   "K" [7]
   "L" [5]
   "M" [3]
   "N" [2]
   "NG" [2 7]
   "P" [9]
   "R" [4]
   "S" [0]
   "SH" [6]
   "T" [1]
   "TH" [1]
   "V" [8]
   "Z" [0]
   "ZH" [6]})

(def words
  (-> "/usr/share/dict/words" slurp
    (string/split #"\n")
    (->> (into {} (map (juxt string/upper-case identity))))))

(def dictionary
  (-> "http://svn.code.sf.net/p/cmusphinx/code/trunk/cmudict/cmudict.0.7a"
    slurp
    (string/split #"\n")
    (->>
      (into {}
        (comp
          (remove #(string/starts-with? % ";;;"))
          (filter #(re-matches #"^[A-Za-z].*" %))
          (map #(string/split % #"  "))
          (map (fn [[word phonemes]]
                 [(sequence
                    (comp
                      (map #(string/replace % #"[0-9]" ""))
                      (mapcat numbers))
                    (string/split phonemes #" "))
                  (words word)]))
          (filter second))))))

(defn serialize-to-file [filename data]
  (with-open [out (io/output-stream filename)]
    (-> out
      (transit/writer :json)
      (transit/write data))))

(defn phrases [nums]
  (->> (range 1 (inc (count nums)))
    (sequence
      (comp
        (map (juxt #(take % nums) #(drop % nums)))
        (mapcat (fn [[prefix suffix]]
                  (when-let [word (dictionary prefix)]
                    (if (seq suffix)
                      (for [phrase (phrases suffix)]
                        (cons word phrase))
                      (list (list word))))))))
    (sort-by count)
    (take 10)))

(comment

  (serialize-to-file "resources/dictionary.json" dictionary)

  )
