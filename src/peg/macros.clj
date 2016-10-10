(ns peg.macros)

(defmacro spy [x]
  `(let [x# ~x]
     (println '~x " => " x#)
     x#))