(ns peg.core
  (:require-macros [peg.macros :refer [spy]])
  (:require [clojure.string :as string]
            [reagent.core :as r]
            [re-frame.core :as rf]
            [ajax.core :as http]))

(enable-console-print!)

;; LOGIC

(defn mnemonics [dictionary digits]
  (sequence
    (comp
      (map (juxt #(subs digits 0 %) #(subs digits %)))
      (mapcat (fn [[prefix suffix]]
                (when-let [word (dictionary prefix)]
                  (if (string/blank? suffix)
                    (list (list word))
                    (for [mnemonic (mnemonics dictionary suffix)]
                      (cons word mnemonic)))))))
    (range 1 (inc (count digits)))))

;; EVENTS

(rf/reg-event-fx
  :peg/init
  (fn [_ _]
    {:db {:peg/mnemonics []}
     :ajax {:http/url js/window.dictionaryUrl
            :http/on-success #(rf/dispatch [:peg/dictionary %])}}))

(rf/reg-event-db
  :peg/dictionary
  (fn [db [_ dictionary]]
    (println dictionary)
    (assoc db :peg/dictionary dictionary)))

(rf/reg-event-db
  :peg/digits
  (fn [db [_ digits]]
    (assoc db
           :peg/digits digits
           :peg/mnemonics (mnemonics (db :peg/dictionary) digits))))

;; EFFECTS

(rf/reg-fx
  :ajax
  (fn [{:keys [http/url http/on-success]}]
    (http/GET url {:handler on-success
                   :response-format :transit})))

;; SUBSCRIPTIONS

(rf/reg-sub
  :peg/digits
  (fn [db]
    (db :peg/digits)))

(rf/reg-sub
  :peg/mnemonics
  (fn [db]
    (spy (count (db :peg/mnemonics)))
    (->> (db :peg/mnemonics)
      (sort-by count)
      (take 12))))

;; UI

(defn ui []
  (let [digits @(rf/subscribe [:peg/digits])
        mnemonics @(rf/subscribe [:peg/mnemonics])]
    [:main
     [:input {:placeholder "Number"
              :defaultValue digits
              :onKeyUp #(rf/dispatch [:peg/digits (.. % -target -value)])}]
     [:div
      [:aside
       "To translate the following phrases back into numbers, see "
       [:a {:href "https://en.wikipedia.org/wiki/Mnemonic_major_system"}
        "this Wikipedia article"]
       "."]
      (for [[i mnemonic] (map-indexed vector mnemonics)]
        [:div {:key i} (string/join " " mnemonic)])]]))

(defn mount-root []
  (r/render [ui] (.getElementById js/document "app")))

(defonce init
  (do
    (rf/dispatch-sync [:peg/init])
    (mount-root)))
