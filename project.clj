(defproject peg "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :source-paths ["src"]
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.9.229" :exclusions [org.apache.ant/ant]]
                 [vdom "0.2.0-SNAPSHOT"]]
  :profiles {:dev {:dependencies [[figwheel-sidecar "0.5.0-2" :scope "provided"]
                                  [com.cognitect/transit-clj "0.8.300"]]}})
