(ns peg.grammar)

(defn triple [pattern noun verb adjective]
  [[pattern :subject-noun noun]
   [pattern :object-noun noun]
   [pattern :verb verb]
   [pattern :subject-adjective adjective]
   [pattern :object-adjective adjective]])

(def pegwords
  (concat
   (triple "0" "hose" "sew" "easy")
   (triple "1" "hat" "hate" "hot")
   (triple "2" "hen" "know" "new")
   (triple "3" "home" "aim" "yummy")
   (triple "4" "arrow" "row" "hairy")
   (triple "5" "whale" "heal" "oily")
   (triple "6" "shoe" "chew" "itchy")
   (triple "7" "cow" "hook" "coy")
   (triple "8" "hoof" "weave" "heavy")
   (triple "9" "pie" "buy" "happy")
   (triple "00" "sauce" "assess" "sissy")
   (triple "01" "seed" "swat" "sad")
   (triple "02" "sun" "assign" "snowy")
   (triple "03" "sumo" "assume" "awesome")
   (triple "04" "sierra" "sorrow" "sorry")
   (triple "05" "soil" "sell" "slow")
   (triple "06" "sewage" "switch" "swishy")
   (triple "07" "sky" "soak" "sick")
   (triple "08" "sofa" "save" "savvy")
   (triple "09" "soap" "sob" "sappy")
   (triple "10" "daisy" "tease" "dizzy")
   (triple "11" "tattoo" "edit" "tight")
   (triple "12" "tuna" "widen" "wooden")
   (triple "13" "dome" "time" "tame")
   (triple "14" "diary" "draw" "dry")
   (triple "15" "tail" "tell" "tall")
   (triple "16" "dish" "teach" "whitish")
   (triple "17" "dog" "take" "thick")
   (triple "18" "dove" "defy" "deaf")
   (triple "19" "tuba" "type" "deep")
   (triple "20" "nose" "ionize" "noisy")
   (triple "21" "net" "unite" "neat")
   (triple "22" "onion" "nanny" "neon")
   (triple "23" "enemy" "name" "numb")
   (triple "24" "winery" "honor" "narrow")
   (triple "25" "nail" "inhale" "annual")
   (triple "26" "nacho" "enjoy" "nudgy")
   (triple "27" "neck" "knock" "naggy")
   (triple "28" "knife" "envy" "naive")
   (triple "29" "honeybee" "nab" "wannabe")
   (triple "30" "mouse" "amuse" "messy")
   (triple "31" "meadow" "meet" "mute")
   (triple "32" "moon" "mine" "mean")
   (triple "33" "mummy" "mime" "mum")
   (triple "34" "emery" "marry" "merry")
   (triple "35" "mole" "mail" "male")
   (triple "36" "match" "mash" "mushy")
   (triple "37" "mug" "mock" "mucky")
   (triple "38" "movie" "move" "mauve")
   (triple "39" "map" "mop" "wimpy")
   (triple "40" "rice" "erase" "rosy")
   (triple "41" "road" "read" "ready")
   (triple "42" "urine" "ruin" "runny")
   (triple "43" "rum" "ram" "haram")
   (triple "44" "aurora" "rear" "rare")
   (triple "45" "railway" "rule" "royal")
   (triple "46" "roach" "reach" "rich")
   (triple "47" "rag" "rake" "rocky")
   (triple "48" "roof" "arrive" "rough")
   (triple "49" "rope" "wrap" "ripe")
   (triple "50" "louse" "lose" "lazy")
   (triple "51" "lady" "let" "elite")
   (triple "52" "lion" "align" "alien")
   (triple "53" "lime" "loom" "lame")
   (triple "54" "lorry" "lure" "leery")
   (triple "55" "lily" "lull" "loyal")
   (triple "56" "leech" "latch" "yellowish")
   (triple "57" "leg" "lick" "lucky")
   (triple "58" "lava" "love" "leafy")
   (triple "59" "lip" "help" "loopy")
   (triple "60" "cheese" "chase" "choosy")
   (triple "61" "cheetah" "cheat" "chatty")
   (triple "62" "chin" "chain" "shiny")
   (triple "63" "gem" "jam" "sham")
   (triple "64" "shrew" "jury" "cherry")
   (triple "65" "chilli" "chill" "jolly")
   (triple "66" "cha-cha" "judge" "Jewish")
   (triple "67" "chick" "check" "shaky")
   (triple "68" "chef" "achieve" "chief")
   (triple "69" "jeep" "chop" "cheap")
   (triple "70" "goose" "kiss" "cosy")
   (triple "71" "cat" "quote" "good")
   (triple "72" "coin" "weaken" "keen")
   (triple "73" "game" "comb" "gummy")
   (triple "74" "crow" "carry" "grey")
   (triple "75" "clay" "kill" "cool")
   (triple "76" "cage" "coach" "catchy")
   (triple "77" "cake" "cook" "quick")
   (triple "78" "cave" "give" "goofy")
   (triple "79" "cube" "copy" "agape")
   (triple "80" "vase" "fuse" "fussy")
   (triple "81" "video" "fight" "fat")
   (triple "82" "fan" "fine" "funny")
   (triple "83" "ovum" "fume" "foamy")
   (triple "84" "fairy" "fry" "furry")
   (triple "85" "fool" "fly" "foul")
   (triple "86" "veggie" "fetch" "fishy")
   (triple "87" "fig" "fake" "foggy")
   (triple "88" "fife" "viva" "fave")
   (triple "89" "vibe" "fob" "fab")
   (triple "90" "boss" "oppose" "busy")
   (triple "91" "bead" "bite" "bad")
   (triple "92" "pony" "ban" "bony")
   (triple "93" "puma" "bomb" "balmy")
   (triple "94" "berry" "bury" "pro")
   (triple "95" "bell" "peel" "blue")
   (triple "96" "pouch" "patch" "bushy")
   (triple "97" "bike" "poke" "back")
   (triple "98" "Biff" "pave" "puffy")
   (triple "99" "pipe" "pop" "baby")))

(def SENTENCE ::SENTENCE)
(def COMMA ::COMMA)
(def PERIOD ::PERIOD)

(def grammar
  {SENTENCE           #{:subject-noun :subject-adjective}
   :subject-noun      #{[COMMA :subject-noun] :verb PERIOD}
   :subject-adjective #{[COMMA :subject-adjective] :subject-noun}
   :verb              #{:object-adjective :object-noun [COMMA :verb] PERIOD}
   :object-noun       #{[COMMA :object-noun] PERIOD}
   :object-adjective  #{:object-adjective :object-noun}})

(defn sentence [statement grammar vocab]
  (if (string/blank? statement)
    (when (get (grammar SENTENCE) PERIOD)
        ["."])
    (for [point (grammar SENTENCE)
          :let [[point comma?] (if (and (vector? point)
                                        (= COMMA (first point)))
                                 [(second point) true]
                                 [point false])]
          [head new-point remaining] (vocab statement point)
          :let [head (if comma? (str head ",") head)]
          tail (sentence remaining (assoc grammar SENTENCE (grammar point)) vocab)]
      (cons (str head " ") tail))))

(defn vocab [entries statement point]
  (into []
        (comp
         (filter (fn [[pattern point' phrase]]
                   (and (= point point')
                        (string/starts-with? statement pattern))))
         (map (fn [[pattern point' phrase]]
                [phrase point' (string/replace-first statement pattern "")])))
        entries))

(defn generate [statement]
  (swap! model assoc :mnemonics
         (as-> pegwords x
               (partial vocab x)
               (sentence statement grammar x)
               (sort-by count x)
               (take-while #(= (count %) (count (first x))) x)
               (map string/join x))))
