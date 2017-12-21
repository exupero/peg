(ns peg.macros)

(defmacro spy [x]
  `(let [x# ~x]
     (js/console.log "%c%s\n%c%s" "color:mediumseagreen" (pr-str '~x) "color:black" (pr-str x#))
     x#))
