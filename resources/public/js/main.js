if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":13}],3:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":36}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":7}],6:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":6}],8:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],9:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],10:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],11:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":16}],12:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":27,"is-object":9}],13:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":25,"../vnode/is-vnode.js":28,"../vnode/is-vtext.js":29,"../vnode/is-widget.js":30,"./apply-properties":12,"global/document":8}],14:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":30,"../vnode/vpatch.js":33,"./apply-properties":12,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":13,"./dom-index":14,"./patch-op":15,"global/document":8,"x-is-array":10}],17:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":30}],18:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],19:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":5}],20:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],21:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":26,"../vnode/is-vhook":27,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vnode.js":32,"../vnode/vtext.js":34,"./hooks/ev-hook.js":19,"./hooks/soft-set-hook.js":20,"./parse-tag.js":22,"x-is-array":10}],22:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],23:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],24:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":18,"./index.js":21,"./svg-attribute-namespace":23,"x-is-array":10}],25:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":26,"./is-vnode":28,"./is-vtext":29,"./is-widget":30}],26:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],27:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":31}],29:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":31}],30:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],31:[function(require,module,exports){
module.exports = "2"

},{}],32:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":26,"./is-vhook":27,"./is-vnode":28,"./is-widget":30,"./version":31}],33:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":31}],34:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":31}],35:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":27,"is-object":9}],36:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":25,"../vnode/is-thunk":26,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vpatch":33,"./diff-props":35,"x-is-array":10}],37:[function(require,module,exports){
return VDOM = {
  diff: require("virtual-dom/diff"),
  patch: require("virtual-dom/patch"),
  create: require("virtual-dom/create-element"),
  VHtml: require("virtual-dom/vnode/vnode"),
  VText: require("virtual-dom/vnode/vtext"),
  VSvg: require("virtual-dom/virtual-hyperscript/svg"),
  isVirtualNode: require("virtual-dom/vnode/is-vnode")
}

},{"virtual-dom/create-element":2,"virtual-dom/diff":3,"virtual-dom/patch":11,"virtual-dom/virtual-hyperscript/svg":24,"virtual-dom/vnode/is-vnode":28,"virtual-dom/vnode/vnode":32,"virtual-dom/vnode/vtext":34}]},{},[37]);

var h;
function v(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var aa="closure_uid_"+(1E9*Math.random()>>>0),ca=0;function ea(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function fa(a,b){this.U=[];this.Ua=b;for(var c=!0,d=a.length-1;0<=d;d--){var e=a[d]|0;c&&e==b||(this.U[d]=e,c=!1)}}var ga={};function ia(a){if(-128<=a&&128>a){var b=ga[a];if(b)return b}b=new fa([a|0],0>a?-1:0);-128<=a&&128>a&&(ga[a]=b);return b}function la(a){if(isNaN(a)||!isFinite(a))return ma;if(0>a)return la(-a).ra();for(var b=[],c=1,d=0;a>=c;d++)b[d]=a/c|0,c*=oa;return new fa(b,0)}var oa=4294967296,ma=ia(0),pa=ia(1),qa=ia(16777216);h=fa.prototype;
h.xc=function(){return 0<this.U.length?this.U[0]:this.Ua};h.rb=function(){if(this.Aa())return-this.ra().rb();for(var a=0,b=1,c=0;c<this.U.length;c++)var d=ra(this,c),a=a+(0<=d?d:oa+d)*b,b=b*oa;return a};
h.toString=function(a){a=a||10;if(2>a||36<a)throw Error("radix out of range: "+a);if(this.Ka())return"0";if(this.Aa())return"-"+this.ra().toString(a);for(var b=la(Math.pow(a,6)),c=this,d="";;){var e=ta(c,b),f=(c.Jb(e.multiply(b)).xc()>>>0).toString(a),c=e;if(c.Ka())return f+d;for(;6>f.length;)f="0"+f;d=""+f+d}};function ra(a,b){return 0>b?0:b<a.U.length?a.U[b]:a.Ua}h.Ka=function(){if(0!=this.Ua)return!1;for(var a=0;a<this.U.length;a++)if(0!=this.U[a])return!1;return!0};h.Aa=function(){return-1==this.Ua};
h.pc=function(a){return 0<this.compare(a)};h.qc=function(a){return 0<=this.compare(a)};h.Rb=function(){return 0>this.compare(qa)};h.Sb=function(a){return 0>=this.compare(a)};h.compare=function(a){a=this.Jb(a);return a.Aa()?-1:a.Ka()?0:1};h.ra=function(){return this.uc().add(pa)};
h.add=function(a){for(var b=Math.max(this.U.length,a.U.length),c=[],d=0,e=0;e<=b;e++){var f=d+(ra(this,e)&65535)+(ra(a,e)&65535),g=(f>>>16)+(ra(this,e)>>>16)+(ra(a,e)>>>16),d=g>>>16,f=f&65535,g=g&65535;c[e]=g<<16|f}return new fa(c,c[c.length-1]&-2147483648?-1:0)};h.Jb=function(a){return this.add(a.ra())};
h.multiply=function(a){if(this.Ka()||a.Ka())return ma;if(this.Aa())return a.Aa()?this.ra().multiply(a.ra()):this.ra().multiply(a).ra();if(a.Aa())return this.multiply(a.ra()).ra();if(this.Rb()&&a.Rb())return la(this.rb()*a.rb());for(var b=this.U.length+a.U.length,c=[],d=0;d<2*b;d++)c[d]=0;for(d=0;d<this.U.length;d++)for(var e=0;e<a.U.length;e++){var f=ra(this,d)>>>16,g=ra(this,d)&65535,k=ra(a,e)>>>16,l=ra(a,e)&65535;c[2*d+2*e]+=g*l;ua(c,2*d+2*e);c[2*d+2*e+1]+=f*l;ua(c,2*d+2*e+1);c[2*d+2*e+1]+=g*k;
ua(c,2*d+2*e+1);c[2*d+2*e+2]+=f*k;ua(c,2*d+2*e+2)}for(d=0;d<b;d++)c[d]=c[2*d+1]<<16|c[2*d];for(d=b;d<2*b;d++)c[d]=0;return new fa(c,0)};function ua(a,b){for(;(a[b]&65535)!=a[b];)a[b+1]+=a[b]>>>16,a[b]&=65535}
function ta(a,b){if(b.Ka())throw Error("division by zero");if(a.Ka())return ma;if(a.Aa())return b.Aa()?ta(a.ra(),b.ra()):ta(a.ra(),b).ra();if(b.Aa())return ta(a,b.ra()).ra();if(30<a.U.length){if(a.Aa()||b.Aa())throw Error("slowDivide_ only works with positive integers.");for(var c=pa,d=b;d.Sb(a);)c=c.shiftLeft(1),d=d.shiftLeft(1);for(var e=c.ab(1),f=d.ab(1),g,d=d.ab(2),c=c.ab(2);!d.Ka();)g=f.add(d),g.Sb(a)&&(e=e.add(c),f=g),d=d.ab(1),c=c.ab(1);return e}c=ma;for(d=a;d.qc(b);){e=Math.max(1,Math.floor(d.rb()/
b.rb()));f=Math.ceil(Math.log(e)/Math.LN2);f=48>=f?1:Math.pow(2,f-48);g=la(e);for(var k=g.multiply(b);k.Aa()||k.pc(d);)e-=f,g=la(e),k=g.multiply(b);g.Ka()&&(g=pa);c=c.add(g);d=d.Jb(k)}return c}h.uc=function(){for(var a=this.U.length,b=[],c=0;c<a;c++)b[c]=~this.U[c];return new fa(b,~this.Ua)};h.shiftLeft=function(a){var b=a>>5;a%=32;for(var c=this.U.length+b+(0<a?1:0),d=[],e=0;e<c;e++)d[e]=0<a?ra(this,e-b)<<a|ra(this,e-b-1)>>>32-a:ra(this,e-b);return new fa(d,this.Ua)};
h.ab=function(a){var b=a>>5;a%=32;for(var c=this.U.length-b,d=[],e=0;e<c;e++)d[e]=0<a?ra(this,e+b)>>>a|ra(this,e+b+1)<<32-a:ra(this,e+b);return new fa(d,this.Ua)};function wa(a,b){null!=a&&this.append.apply(this,arguments)}h=wa.prototype;h.Qa="";h.set=function(a){this.Qa=""+a};h.append=function(a,b,c){this.Qa+=String(a);if(null!=b)for(var d=1;d<arguments.length;d++)this.Qa+=arguments[d];return this};h.clear=function(){this.Qa=""};h.toString=function(){return this.Qa};function xa(a,b){a.sort(b||ya)}function Aa(a,b){for(var c=Array(a.length),d=0;d<a.length;d++)c[d]={index:d,value:a[d]};var e=b||ya;xa(c,function(a,b){return e(a.value,b.value)||a.index-b.index});for(d=0;d<a.length;d++)a[d]=c[d].value}function ya(a,b){return a>b?1:a<b?-1:0};var Ba;if("undefined"===typeof Ca)var Ca=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Da)var Da=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Ea=null;if("undefined"===typeof Fa)var Fa=null;function Ga(){return new Ha(null,5,[Ia,!0,Ja,!0,Ka,!1,Ma,!1,Na,null],null)}function y(a){return null!=a&&!1!==a}function Oa(a){return null==a}function Pa(a){return a instanceof Array}
function Qa(a){return null==a?!0:!1===a?!0:!1}function z(a,b){return a[v(null==b?null:b)]?!0:a._?!0:!1}function B(a,b){var c=null==b?null:b.constructor,c=y(y(c)?c.Gb:c)?c.mb:v(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Sa(a){var b=a.mb;return y(b)?b:""+C(a)}var Ta="undefined"!==typeof Symbol&&"function"===v(Symbol)?Symbol.iterator:"@@iterator";function Ua(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}
function Va(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return Wa(arguments[0]);case 2:return Wa(arguments[1]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}function Xa(a){return Wa(a)}function Wa(a){function b(a,b){a.push(b);return a}var c=[];return Ya?Ya(b,c,a):$a.call(null,b,c,a)}function ab(){}
var bb=function bb(b){if(null!=b&&null!=b.V)return b.V(b);var c=bb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=bb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("ICounted.-count",b);};function cb(){}var eb=function eb(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=eb[v(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=eb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw B("ICollection.-conj",b);};function fb(){}
var D=function D(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return D.b(arguments[0],arguments[1]);case 3:return D.f(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
D.b=function(a,b){if(null!=a&&null!=a.O)return a.O(a,b);var c=D[v(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=D._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw B("IIndexed.-nth",a);};D.f=function(a,b,c){if(null!=a&&null!=a.za)return a.za(a,b,c);var d=D[v(null==a?null:a)];if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);d=D._;if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);throw B("IIndexed.-nth",a);};D.F=3;function gb(){}
var hb=function hb(b){if(null!=b&&null!=b.na)return b.na(b);var c=hb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=hb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("ISeq.-first",b);},jb=function jb(b){if(null!=b&&null!=b.sa)return b.sa(b);var c=jb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=jb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("ISeq.-rest",b);};function kb(){}function lb(){}
var mb=function mb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return mb.b(arguments[0],arguments[1]);case 3:return mb.f(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
mb.b=function(a,b){if(null!=a&&null!=a.L)return a.L(a,b);var c=mb[v(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=mb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw B("ILookup.-lookup",a);};mb.f=function(a,b,c){if(null!=a&&null!=a.I)return a.I(a,b,c);var d=mb[v(null==a?null:a)];if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);d=mb._;if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);throw B("ILookup.-lookup",a);};mb.F=3;
var nb=function nb(b,c){if(null!=b&&null!=b.yb)return b.yb(b,c);var d=nb[v(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=nb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw B("IAssociative.-contains-key?",b);},ob=function ob(b,c,d){if(null!=b&&null!=b.cb)return b.cb(b,c,d);var e=ob[v(null==b?null:b)];if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);e=ob._;if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);throw B("IAssociative.-assoc",b);};function pb(){}
function qb(){}var rb=function rb(b){if(null!=b&&null!=b.Db)return b.Db();var c=rb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=rb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IMapEntry.-key",b);},sb=function sb(b){if(null!=b&&null!=b.Eb)return b.Eb();var c=sb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=sb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IMapEntry.-val",b);};function tb(){}function ub(){}
var vb=function vb(b,c,d){if(null!=b&&null!=b.Fb)return b.Fb(b,c,d);var e=vb[v(null==b?null:b)];if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);e=vb._;if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);throw B("IVector.-assoc-n",b);},wb=function wb(b){if(null!=b&&null!=b.Wb)return b.state;var c=wb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=wb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IDeref.-deref",b);};function xb(){}
var yb=function yb(b){if(null!=b&&null!=b.K)return b.K(b);var c=yb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=yb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IMeta.-meta",b);},zb=function zb(b,c){if(null!=b&&null!=b.M)return b.M(b,c);var d=zb[v(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=zb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw B("IWithMeta.-with-meta",b);};function Bb(){}
var Cb=function Cb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Cb.b(arguments[0],arguments[1]);case 3:return Cb.f(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
Cb.b=function(a,b){if(null!=a&&null!=a.la)return a.la(a,b);var c=Cb[v(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Cb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw B("IReduce.-reduce",a);};Cb.f=function(a,b,c){if(null!=a&&null!=a.ma)return a.ma(a,b,c);var d=Cb[v(null==a?null:a)];if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);d=Cb._;if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);throw B("IReduce.-reduce",a);};Cb.F=3;
var Db=function Db(b,c){if(null!=b&&null!=b.v)return b.v(b,c);var d=Db[v(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Db._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw B("IEquiv.-equiv",b);},Eb=function Eb(b){if(null!=b&&null!=b.J)return b.J(b);var c=Eb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Eb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IHash.-hash",b);};function Fb(){}
var Gb=function Gb(b){if(null!=b&&null!=b.S)return b.S(b);var c=Gb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Gb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("ISeqable.-seq",b);};function Hb(){}function Ib(){}function Jb(){}
var Kb=function Kb(b){if(null!=b&&null!=b.ub)return b.ub(b);var c=Kb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Kb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IReversible.-rseq",b);},Lb=function Lb(b,c){if(null!=b&&null!=b.Pb)return b.Pb(0,c);var d=Lb[v(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Lb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw B("IWriter.-write",b);},Mb=function Mb(b,c,d){if(null!=b&&null!=b.Ob)return b.Ob(0,c,d);
var e=Mb[v(null==b?null:b)];if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);e=Mb._;if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);throw B("IWatchable.-notify-watches",b);},Nb=function Nb(b,c,d){if(null!=b&&null!=b.Nb)return b.Nb(0,c,d);var e=Nb[v(null==b?null:b)];if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);e=Nb._;if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);throw B("IWatchable.-add-watch",b);},Ob=function Ob(b){if(null!=b&&null!=b.fb)return b.fb(b);var c=Ob[v(null==b?null:
b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IEditableCollection.-as-transient",b);},Pb=function Pb(b,c){if(null!=b&&null!=b.kb)return b.kb(b,c);var d=Pb[v(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Pb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw B("ITransientCollection.-conj!",b);},Qb=function Qb(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=Qb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("ITransientCollection.-persistent!",b);},Rb=function Rb(b,c,d){if(null!=b&&null!=b.jb)return b.jb(b,c,d);var e=Rb[v(null==b?null:b)];if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);e=Rb._;if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);throw B("ITransientAssociative.-assoc!",b);},Sb=function Sb(b,c,d){if(null!=b&&null!=b.Mb)return b.Mb(0,c,d);var e=Sb[v(null==b?null:b)];if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);e=Sb._;
if(null!=e)return e.f?e.f(b,c,d):e.call(null,b,c,d);throw B("ITransientVector.-assoc-n!",b);};function Tb(){}
var Ub=function Ub(b,c){if(null!=b&&null!=b.Wa)return b.Wa(b,c);var d=Ub[v(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ub._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw B("IComparable.-compare",b);},Vb=function Vb(b){if(null!=b&&null!=b.Kb)return b.Kb();var c=Vb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Vb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IChunk.-drop-first",b);},Xb=function Xb(b){if(null!=b&&null!=b.Ab)return b.Ab(b);var c=
Xb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Xb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IChunkedSeq.-chunked-first",b);},Yb=function Yb(b){if(null!=b&&null!=b.Bb)return b.Bb(b);var c=Yb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Yb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IChunkedSeq.-chunked-rest",b);},Zb=function Zb(b){if(null!=b&&null!=b.zb)return b.zb(b);var c=Zb[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Zb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IChunkedNext.-chunked-next",b);},$b=function $b(b){if(null!=b&&null!=b.hb)return b.hb(b);var c=$b[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=$b._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("INamed.-name",b);},ac=function ac(b){if(null!=b&&null!=b.ib)return b.ib(b);var c=ac[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ac._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("INamed.-namespace",
b);},bc=function bc(b,c){if(null!=b&&null!=b.fc)return b.fc(b,c);var d=bc[v(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=bc._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw B("IReset.-reset!",b);},cc=function cc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return cc.b(arguments[0],arguments[1]);case 3:return cc.f(arguments[0],arguments[1],arguments[2]);case 4:return cc.w(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return cc.G(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};cc.b=function(a,b){if(null!=a&&null!=a.hc)return a.hc(a,b);var c=cc[v(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=cc._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw B("ISwap.-swap!",a);};
cc.f=function(a,b,c){if(null!=a&&null!=a.ic)return a.ic(a,b,c);var d=cc[v(null==a?null:a)];if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);d=cc._;if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);throw B("ISwap.-swap!",a);};cc.w=function(a,b,c,d){if(null!=a&&null!=a.jc)return a.jc(a,b,c,d);var e=cc[v(null==a?null:a)];if(null!=e)return e.w?e.w(a,b,c,d):e.call(null,a,b,c,d);e=cc._;if(null!=e)return e.w?e.w(a,b,c,d):e.call(null,a,b,c,d);throw B("ISwap.-swap!",a);};
cc.G=function(a,b,c,d,e){if(null!=a&&null!=a.kc)return a.kc(a,b,c,d,e);var f=cc[v(null==a?null:a)];if(null!=f)return f.G?f.G(a,b,c,d,e):f.call(null,a,b,c,d,e);f=cc._;if(null!=f)return f.G?f.G(a,b,c,d,e):f.call(null,a,b,c,d,e);throw B("ISwap.-swap!",a);};cc.F=5;var dc=function dc(b){if(null!=b&&null!=b.Ja)return b.Ja(b);var c=dc[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=dc._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IIterable.-iterator",b);};
function ec(a){this.wc=a;this.i=1073741824;this.A=0}ec.prototype.Pb=function(a,b){return this.wc.append(b)};function fc(a){var b=new wa;a.N(null,new ec(b),Ga());return""+C(b)}var gc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function hc(a){a=gc(a|0,-862048943);return gc(a<<15|a>>>-15,461845907)}
function ic(a,b){var c=(a|0)^(b|0);return gc(c<<13|c>>>-13,5)+-430675100|0}function jc(a,b){var c=(a|0)^b,c=gc(c^c>>>16,-2048144789),c=gc(c^c>>>13,-1028477387);return c^c>>>16}function kc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=ic(c,hc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^hc(a.charCodeAt(a.length-1)):b;return jc(b,gc(2,a.length))}var lc={},mc=0;
function nc(a){255<mc&&(lc={},mc=0);if(null==a)return 0;var b=lc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=gc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;lc[a]=b;mc+=1}return a=b}
function oc(a){if(null!=a&&(a.i&4194304||a.Bc))return a.J(null);if("number"===typeof a){if(y(isFinite(a)))return Math.floor(a)%2147483647;switch(a){case Infinity:return 2146435072;case -Infinity:return-1048576;default:return 2146959360}}else return!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=nc(a),0!==a&&(a=hc(a),a=ic(0,a),a=jc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Eb(a),a}function pc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}
function qc(a,b){if(a.Ga===b.Ga)return 0;var c=Qa(a.oa);if(y(c?b.oa:c))return-1;if(y(a.oa)){if(Qa(b.oa))return 1;c=ya(a.oa,b.oa);return 0===c?ya(a.name,b.name):c}return ya(a.name,b.name)}function rc(a,b,c,d,e){this.oa=a;this.name=b;this.Ga=c;this.Va=d;this.ya=e;this.i=2154168321;this.A=4096}h=rc.prototype;h.toString=function(){return this.Ga};h.equiv=function(a){return this.v(null,a)};h.v=function(a,b){return b instanceof rc?this.Ga===b.Ga:!1};
h.call=function(){function a(a,b,c){return sc.f?sc.f(b,this,c):sc.call(null,b,this,c)}function b(a,b){return sc.b?sc.b(b,this):sc.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.f=a;return c}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.a=function(a){return sc.b?sc.b(a,this):sc.call(null,a,this)};
h.b=function(a,b){return sc.f?sc.f(a,this,b):sc.call(null,a,this,b)};h.K=function(){return this.ya};h.M=function(a,b){return new rc(this.oa,this.name,this.Ga,this.Va,b)};h.J=function(){var a=this.Va;return null!=a?a:this.Va=a=pc(kc(this.name),nc(this.oa))};h.hb=function(){return this.name};h.ib=function(){return this.oa};h.N=function(a,b){return Lb(b,this.Ga)};
var tc=function tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return tc.a(arguments[0]);case 2:return tc.b(arguments[0],arguments[1]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};tc.a=function(a){if(a instanceof rc)return a;var b=a.indexOf("/");return 1>b?tc.b(null,a):tc.b(a.substring(0,b),a.substring(b+1,a.length))};tc.b=function(a,b){var c=null!=a?[C(a),C("/"),C(b)].join(""):b;return new rc(a,b,c,null,null)};
tc.F=2;function G(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.gc))return a.S(null);if(Pa(a)||"string"===typeof a)return 0===a.length?null:new H(a,0,null);if(z(Fb,a))return Gb(a);throw Error([C(a),C(" is not ISeqable")].join(""));}function I(a){if(null==a)return null;if(null!=a&&(a.i&64||a.Xa))return a.na(null);a=G(a);return null==a?null:hb(a)}function uc(a){return null!=a?null!=a&&(a.i&64||a.Xa)?a.sa(null):(a=G(a))?jb(a):vc:vc}
function J(a){return null==a?null:null!=a&&(a.i&128||a.tb)?a.qa(null):G(uc(a))}var wc=function wc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return wc.a(arguments[0]);case 2:return wc.b(arguments[0],arguments[1]);default:return wc.m(arguments[0],arguments[1],new H(c.slice(2),0,null))}};wc.a=function(){return!0};wc.b=function(a,b){return null==a?null==b:a===b||Db(a,b)};
wc.m=function(a,b,c){for(;;)if(wc.b(a,b))if(J(c))a=b,b=I(c),c=J(c);else return wc.b(b,I(c));else return!1};wc.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return wc.m(b,a,c)};wc.F=2;function xc(a){this.C=a}xc.prototype.next=function(){if(null!=this.C){var a=I(this.C);this.C=J(this.C);return{value:a,done:!1}}return{value:null,done:!0}};function yc(a){return new xc(G(a))}function zc(a,b){var c=hc(a),c=ic(0,c);return jc(c,b)}
function Ac(a){var b=0,c=1;for(a=G(a);;)if(null!=a)b+=1,c=gc(31,c)+oc(I(a))|0,a=J(a);else return zc(c,b)}var Bc=zc(1,0);function Cc(a){var b=0,c=0;for(a=G(a);;)if(null!=a)b+=1,c=c+oc(I(a))|0,a=J(a);else return zc(c,b)}var Dc=zc(0,0);ab["null"]=!0;bb["null"]=function(){return 0};Date.prototype.v=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.eb=!0;
Date.prototype.Wa=function(a,b){if(b instanceof Date)return ya(this.valueOf(),b.valueOf());throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};Db.number=function(a,b){return a===b};xb["function"]=!0;yb["function"]=function(){return null};Eb._=function(a){return a[aa]||(a[aa]=++ca)};function K(a){return wb(a)}function Ec(a,b){var c=bb(a);if(0===c)return b.o?b.o():b.call(null);for(var d=D.b(a,0),e=1;;)if(e<c)var f=D.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f),e=e+1;else return d}
function Fc(a,b,c){var d=bb(a),e=c;for(c=0;;)if(c<d){var f=D.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);c+=1}else return e}function Gc(a,b){var c=a.length;if(0===a.length)return b.o?b.o():b.call(null);for(var d=a[0],e=1;;)if(e<c)var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f),e=e+1;else return d}function Hc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);c+=1}else return e}
function Jc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);d+=1}else return c}function Kc(a){return null!=a?a.i&2||a.Vb?!0:a.i?!1:z(ab,a):z(ab,a)}function Lc(a){return null!=a?a.i&16||a.Lb?!0:a.i?!1:z(fb,a):z(fb,a)}function L(a,b,c){var d=M.a?M.a(a):M.call(null,a);if(c>=d)return-1;!(0<c)&&0>c&&(c+=d,c=0>c?0:c);for(;;)if(c<d){if(wc.b(Mc?Mc(a,c):Nc.call(null,a,c),b))return c;c+=1}else return-1}
function N(a,b,c){var d=M.a?M.a(a):M.call(null,a);if(0===d)return-1;0<c?(--d,c=d<c?d:c):c=0>c?d+c:c;for(;;)if(0<=c){if(wc.b(Mc?Mc(a,c):Nc.call(null,a,c),b))return c;--c}else return-1}function Oc(a,b){this.c=a;this.l=b}Oc.prototype.ta=function(){return this.l<this.c.length};Oc.prototype.next=function(){var a=this.c[this.l];this.l+=1;return a};function H(a,b,c){this.c=a;this.l=b;this.s=c;this.i=166592766;this.A=8192}h=H.prototype;h.toString=function(){return fc(this)};
h.equiv=function(a){return this.v(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M.a?M.a(this):M.call(null,this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.O=function(a,b){var c=b+this.l;return c<this.c.length?this.c[c]:null};h.za=function(a,b,c){a=b+this.l;return a<this.c.length?this.c[a]:c};h.Ja=function(){return new Oc(this.c,this.l)};h.K=function(){return this.s};
h.qa=function(){return this.l+1<this.c.length?new H(this.c,this.l+1,null):null};h.V=function(){var a=this.c.length-this.l;return 0>a?0:a};h.ub=function(){var a=bb(this);return 0<a?new Pc(this,a-1,null):null};h.J=function(){return Ac(this)};h.v=function(a,b){return Qc.b?Qc.b(this,b):Qc.call(null,this,b)};h.la=function(a,b){return Jc(this.c,b,this.c[this.l],this.l+1)};h.ma=function(a,b,c){return Jc(this.c,b,c,this.l)};h.na=function(){return this.c[this.l]};
h.sa=function(){return this.l+1<this.c.length?new H(this.c,this.l+1,null):vc};h.S=function(){return this.l<this.c.length?this:null};h.M=function(a,b){return new H(this.c,this.l,b)};h.R=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};H.prototype[Ta]=function(){return yc(this)};function Rc(a,b){return b<a.length?new H(a,b,null):null}
function Sc(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return Rc(arguments[0],0);case 2:return Rc(arguments[0],arguments[1]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}function Pc(a,b,c){this.sb=a;this.l=b;this.s=c;this.i=32374990;this.A=8192}h=Pc.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M.a?M.a(this):M.call(null,this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.s};h.qa=function(){return 0<this.l?new Pc(this.sb,this.l-1,null):null};h.V=function(){return this.l+1};h.J=function(){return Ac(this)};
h.v=function(a,b){return Qc.b?Qc.b(this,b):Qc.call(null,this,b)};h.la=function(a,b){return Tc?Tc(b,this):Uc.call(null,b,this)};h.ma=function(a,b,c){return Vc?Vc(b,c,this):Uc.call(null,b,c,this)};h.na=function(){return D.b(this.sb,this.l)};h.sa=function(){return 0<this.l?new Pc(this.sb,this.l-1,null):vc};h.S=function(){return this};h.M=function(a,b){return new Pc(this.sb,this.l,b)};h.R=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};Pc.prototype[Ta]=function(){return yc(this)};
Db._=function(a,b){return a===b};var Wc=function Wc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Wc.o();case 1:return Wc.a(arguments[0]);case 2:return Wc.b(arguments[0],arguments[1]);default:return Wc.m(arguments[0],arguments[1],new H(c.slice(2),0,null))}};Wc.o=function(){return Xc};Wc.a=function(a){return a};Wc.b=function(a,b){return null!=a?eb(a,b):eb(vc,b)};
Wc.m=function(a,b,c){for(;;)if(y(c))a=Wc.b(a,b),b=I(c),c=J(c);else return Wc.b(a,b)};Wc.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Wc.m(b,a,c)};Wc.F=2;function M(a){if(null!=a)if(null!=a&&(a.i&2||a.Vb))a=a.V(null);else if(Pa(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.gc))a:{a=G(a);for(var b=0;;){if(Kc(a)){a=b+bb(a);break a}a=J(a);b+=1}}else a=bb(a);else a=0;return a}
function Yc(a,b,c){for(;;){if(null==a)return c;if(0===b)return G(a)?I(a):c;if(Lc(a))return D.f(a,b,c);if(G(a))a=J(a),--b;else return c}}function Nc(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return Mc(arguments[0],arguments[1]);case 3:return Zc(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}
function Mc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Lb))return a.O(null,b);if(Pa(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Xa)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(G(c)){c=I(c);break a}throw Error("Index out of bounds");}if(Lc(c)){c=D.b(c,d);break a}if(G(c))c=J(c),--d;else throw Error("Index out of bounds");
}}return c}if(z(fb,a))return D.b(a,b);throw Error([C("nth not supported on this type "),C(Sa(null==a?null:a.constructor))].join(""));}
function Zc(a,b,c){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return c;if(null!=a&&(a.i&16||a.Lb))return a.za(null,b,c);if(Pa(a))return b<a.length?a[b]:c;if("string"===typeof a)return b<a.length?a.charAt(b):c;if(null!=a&&(a.i&64||a.Xa))return Yc(a,b,c);if(z(fb,a))return D.b(a,b);throw Error([C("nth not supported on this type "),C(Sa(null==a?null:a.constructor))].join(""));}
var sc=function sc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return sc.b(arguments[0],arguments[1]);case 3:return sc.f(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};sc.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.$b)?a.L(null,b):Pa(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:z(lb,a)?mb.b(a,b):null};
sc.f=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.$b)?a.I(null,b,c):Pa(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:z(lb,a)?mb.f(a,b,c):c:c};sc.F=3;var $c=function $c(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return $c.f(arguments[0],arguments[1],arguments[2]);default:return $c.m(arguments[0],arguments[1],arguments[2],new H(c.slice(3),0,null))}};
$c.f=function(a,b,c){if(null!=a)a=ob(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Ob(ad);;)if(d<b){var f=d+1;e=e.jb(null,a[d],c[d]);d=f}else{a=Qb(e);break a}}return a};$c.m=function(a,b,c,d){for(;;)if(a=$c.f(a,b,c),y(d))b=I(d),c=I(J(d)),d=J(J(d));else return a};$c.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return $c.m(b,a,c,d)};$c.F=3;function bd(a,b){this.g=a;this.s=b;this.i=393217;this.A=0}h=bd.prototype;h.K=function(){return this.s};
h.M=function(a,b){return new bd(this.g,b)};
h.call=function(){function a(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w,E,F,S){a=this;return cd.gb?cd.gb(a.g,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w,E,F,S):cd.call(null,a.g,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w,E,F,S)}function b(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w,E,F){a=this;return a.g.fa?a.g.fa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w,E,F):a.g.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w,E,F)}function c(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w,E){a=this;return a.g.ea?a.g.ea(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w,
E):a.g.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w,E)}function d(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w){a=this;return a.g.da?a.g.da(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w):a.g.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,w)}function e(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A){a=this;return a.g.ca?a.g.ca(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A):a.g.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A)}function f(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x){a=this;return a.g.ba?a.g.ba(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x):a.g.call(null,
b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x)}function g(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u){a=this;return a.g.aa?a.g.aa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u):a.g.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u)}function k(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){a=this;return a.g.$?a.g.$(b,c,d,e,f,g,k,l,m,n,p,q,r,t):a.g.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,k,l,m,n,p,q,r){a=this;return a.g.Z?a.g.Z(b,c,d,e,f,g,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,k,l,m,n,p,q){a=this;return a.g.Y?
a.g.Y(b,c,d,e,f,g,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,g,k,l,m,n,p,q)}function n(a,b,c,d,e,f,g,k,l,m,n,p){a=this;return a.g.X?a.g.X(b,c,d,e,f,g,k,l,m,n,p):a.g.call(null,b,c,d,e,f,g,k,l,m,n,p)}function p(a,b,c,d,e,f,g,k,l,m,n){a=this;return a.g.W?a.g.W(b,c,d,e,f,g,k,l,m,n):a.g.call(null,b,c,d,e,f,g,k,l,m,n)}function q(a,b,c,d,e,f,g,k,l,m){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,g,k,l,m):a.g.call(null,b,c,d,e,f,g,k,l,m)}function r(a,b,c,d,e,f,g,k,l){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,g,k,l):a.g.call(null,
b,c,d,e,f,g,k,l)}function t(a,b,c,d,e,f,g,k){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,g,k):a.g.call(null,b,c,d,e,f,g,k)}function u(a,b,c,d,e,f,g){a=this;return a.g.ga?a.g.ga(b,c,d,e,f,g):a.g.call(null,b,c,d,e,f,g)}function x(a,b,c,d,e,f){a=this;return a.g.G?a.g.G(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;return a.g.w?a.g.w(b,c,d,e):a.g.call(null,b,c,d,e)}function E(a,b,c,d){a=this;return a.g.f?a.g.f(b,c,d):a.g.call(null,b,c,d)}function F(a,b,c){a=this;return a.g.b?a.g.b(b,c):a.g.call(null,
b,c)}function S(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function ka(a){a=this;return a.g.o?a.g.o():a.g.call(null)}var w=null,w=function(va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w,La,Ra,Za,ib,db,Wb,Ic,ge){switch(arguments.length){case 1:return ka.call(this,va);case 2:return S.call(this,va,R);case 3:return F.call(this,va,R,U);case 4:return E.call(this,va,R,U,V);case 5:return A.call(this,va,R,U,V,Y);case 6:return x.call(this,va,R,U,V,Y,W);case 7:return u.call(this,va,R,U,V,Y,W,ba);case 8:return t.call(this,
va,R,U,V,Y,W,ba,da);case 9:return r.call(this,va,R,U,V,Y,W,ba,da,ha);case 10:return q.call(this,va,R,U,V,Y,W,ba,da,ha,ja);case 11:return p.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na);case 12:return n.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa);case 13:return m.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za);case 14:return l.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w);case 15:return k.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w,La);case 16:return g.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w,La,Ra);case 17:return f.call(this,
va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w,La,Ra,Za);case 18:return e.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w,La,Ra,Za,ib);case 19:return d.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w,La,Ra,Za,ib,db);case 20:return c.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w,La,Ra,Za,ib,db,Wb);case 21:return b.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w,La,Ra,Za,ib,db,Wb,Ic);case 22:return a.call(this,va,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,w,La,Ra,Za,ib,db,Wb,Ic,ge)}throw Error("Invalid arity: "+arguments.length);
};w.a=ka;w.b=S;w.f=F;w.w=E;w.G=A;w.ga=x;w.ha=u;w.ia=t;w.ja=r;w.W=q;w.X=p;w.Y=n;w.Z=m;w.$=l;w.aa=k;w.ba=g;w.ca=f;w.da=e;w.ea=d;w.fa=c;w.Cb=b;w.gb=a;return w}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.o=function(){return this.g.o?this.g.o():this.g.call(null)};h.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};h.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};
h.f=function(a,b,c){return this.g.f?this.g.f(a,b,c):this.g.call(null,a,b,c)};h.w=function(a,b,c,d){return this.g.w?this.g.w(a,b,c,d):this.g.call(null,a,b,c,d)};h.G=function(a,b,c,d,e){return this.g.G?this.g.G(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};h.ga=function(a,b,c,d,e,f){return this.g.ga?this.g.ga(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};h.ha=function(a,b,c,d,e,f,g){return this.g.ha?this.g.ha(a,b,c,d,e,f,g):this.g.call(null,a,b,c,d,e,f,g)};
h.ia=function(a,b,c,d,e,f,g,k){return this.g.ia?this.g.ia(a,b,c,d,e,f,g,k):this.g.call(null,a,b,c,d,e,f,g,k)};h.ja=function(a,b,c,d,e,f,g,k,l){return this.g.ja?this.g.ja(a,b,c,d,e,f,g,k,l):this.g.call(null,a,b,c,d,e,f,g,k,l)};h.W=function(a,b,c,d,e,f,g,k,l,m){return this.g.W?this.g.W(a,b,c,d,e,f,g,k,l,m):this.g.call(null,a,b,c,d,e,f,g,k,l,m)};h.X=function(a,b,c,d,e,f,g,k,l,m,n){return this.g.X?this.g.X(a,b,c,d,e,f,g,k,l,m,n):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n)};
h.Y=function(a,b,c,d,e,f,g,k,l,m,n,p){return this.g.Y?this.g.Y(a,b,c,d,e,f,g,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n,p)};h.Z=function(a,b,c,d,e,f,g,k,l,m,n,p,q){return this.g.Z?this.g.Z(a,b,c,d,e,f,g,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q)};h.$=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r){return this.g.$?this.g.$(a,b,c,d,e,f,g,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r)};
h.aa=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){return this.g.aa?this.g.aa(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t)};h.ba=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u){return this.g.ba?this.g.ba(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u)};h.ca=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x){return this.g.ca?this.g.ca(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x)};
h.da=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A){return this.g.da?this.g.da(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A)};h.ea=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E){return this.g.ea?this.g.ea(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E)};
h.fa=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F){return this.g.fa?this.g.fa(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F):this.g.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F)};h.Cb=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S){return cd.gb?cd.gb(this.g,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S):cd.call(null,this.g,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S)};function dd(a,b){return"function"==v(a)?new bd(a,b):null==a?null:zb(a,b)}
function ed(a){var b=null!=a;return(b?null!=a?a.i&131072||a.cc||(a.i?0:z(xb,a)):z(xb,a):b)?yb(a):null}function fd(a){return null==a?!1:null!=a?a.i&4096||a.Fc?!0:a.i?!1:z(tb,a):z(tb,a)}function gd(a){return null!=a?a.i&16777216||a.Ec?!0:a.i?!1:z(Hb,a):z(Hb,a)}function hd(a){return null==a?!1:null!=a?a.i&1024||a.ac?!0:a.i?!1:z(pb,a):z(pb,a)}function id(a){return null!=a?a.i&16384||a.Gc?!0:a.i?!1:z(ub,a):z(ub,a)}function jd(a){return null!=a?a.A&512||a.zc?!0:!1:!1}
function kd(a){var b=[];ea(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function ld(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var md={};function nd(a){return null==a?!1:null!=a?a.i&64||a.Xa?!0:a.i?!1:z(gb,a):z(gb,a)}function od(a){return null==a?!1:!1===a?!1:!0}function pd(a,b){return sc.f(a,b,md)===md?!1:!0}
function qd(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return ya(a,b);throw Error([C("Cannot compare "),C(a),C(" to "),C(b)].join(""));}if(null!=a?a.A&2048||a.eb||(a.A?0:z(Tb,a)):z(Tb,a))return Ub(a,b);if("string"!==typeof a&&!Pa(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([C("Cannot compare "),C(a),C(" to "),C(b)].join(""));return ya(a,b)}
function rd(a,b){var c=M(a),d=M(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=qd(Mc(a,d),Mc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function sd(a){return wc.b(a,qd)?qd:function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return"number"===typeof d?d:y(d)?-1:y(a.b?a.b(c,b):a.call(null,c,b))?1:0}}function td(a,b){if(G(b)){var c=ud.a?ud.a(b):ud.call(null,b),d=sd(a);Aa(c,d);return G(c)}return vc}
function vd(a){var b=M;return td(function(a,d){return sd(qd).call(null,b.a?b.a(a):b.call(null,a),b.a?b.a(d):b.call(null,d))},a)}function Uc(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return Tc(arguments[0],arguments[1]);case 3:return Vc(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}
function Tc(a,b){var c=G(b);if(c){var d=I(c),c=J(c);return Ya?Ya(a,d,c):$a.call(null,a,d,c)}return a.o?a.o():a.call(null)}function Vc(a,b,c){for(c=G(c);;)if(c){var d=I(c);b=a.b?a.b(b,d):a.call(null,b,d);c=J(c)}else return b}
function $a(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return b=arguments[0],c=arguments[1],null!=c&&(c.i&524288||c.ec)?c.la(null,b):Pa(c)?Gc(c,b):"string"===typeof c?Gc(c,b):z(Bb,c)?Cb.b(c,b):Tc(b,c);case 3:return Ya(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}
function Ya(a,b,c){return null!=c&&(c.i&524288||c.ec)?c.ma(null,a,b):Pa(c)?Hc(c,a,b):"string"===typeof c?Hc(c,a,b):z(Bb,c)?Cb.f(c,a,b):Vc(a,b,c)}function wd(a){return a}function xd(a,b,c,d){a=a.a?a.a(b):a.call(null,b);c=Ya(a,c,d);return a.a?a.a(c):a.call(null,c)}function yd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function zd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return C.o();case 1:return C.a(arguments[0]);default:return C.m(arguments[0],new H(c.slice(1),0,null))}};C.o=function(){return""};C.a=function(a){return null==a?"":""+a};C.m=function(a,b){for(var c=new wa(""+C(a)),d=b;;)if(y(d))c=c.append(""+C(I(d))),d=J(d);else return c.toString()};C.B=function(a){var b=I(a);a=J(a);return C.m(b,a)};C.F=1;
function Qc(a,b){var c;if(gd(b))if(Kc(a)&&Kc(b)&&M(a)!==M(b))c=!1;else a:{c=G(a);for(var d=G(b);;){if(null==c){c=null==d;break a}if(null!=d&&wc.b(I(c),I(d)))c=J(c),d=J(d);else{c=!1;break a}}}else c=null;return od(c)}function Ad(a,b,c,d,e){this.s=a;this.first=b;this.La=c;this.count=d;this.u=e;this.i=65937646;this.A=8192}h=Ad.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,this.count)}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.s};h.qa=function(){return 1===this.count?null:this.La};h.V=function(){return this.count};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Ac(this)};h.v=function(a,b){return Qc(this,b)};
h.la=function(a,b){return Tc(b,this)};h.ma=function(a,b,c){return Vc(b,c,this)};h.na=function(){return this.first};h.sa=function(){return 1===this.count?vc:this.La};h.S=function(){return this};h.M=function(a,b){return new Ad(b,this.first,this.La,this.count,this.u)};h.R=function(a,b){return new Ad(this.s,b,this,this.count+1,null)};Ad.prototype[Ta]=function(){return yc(this)};function Bd(a){this.s=a;this.i=65937614;this.A=8192}h=Bd.prototype;h.toString=function(){return fc(this)};
h.equiv=function(a){return this.v(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.s};h.qa=function(){return null};h.V=function(){return 0};h.J=function(){return Bc};h.v=function(a,b){return(null!=b?b.i&33554432||b.Cc||(b.i?0:z(Ib,b)):z(Ib,b))||gd(b)?null==G(b):!1};
h.la=function(a,b){return Tc(b,this)};h.ma=function(a,b,c){return Vc(b,c,this)};h.na=function(){return null};h.sa=function(){return vc};h.S=function(){return null};h.M=function(a,b){return new Bd(b)};h.R=function(a,b){return new Ad(this.s,b,null,1,null)};var vc=new Bd(null);Bd.prototype[Ta]=function(){return yc(this)};function Cd(a){return(null!=a?a.i&134217728||a.Dc||(a.i?0:z(Jb,a)):z(Jb,a))?Kb(a):Ya(Wc,vc,a)}
function Dd(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;a:{c=0<b.length?new H(b.slice(0),0,null):null;if(c instanceof H&&0===c.l)b=c.c;else b:for(b=[];;)if(null!=c)b.push(c.na(null)),c=c.qa(null);else break b;for(var c=b.length,e=vc;;)if(0<c)d=c-1,e=e.R(null,b[c-1]),c=d;else break a}return e}function Ed(a,b,c,d){this.s=a;this.first=b;this.La=c;this.u=d;this.i=65929452;this.A=8192}h=Ed.prototype;h.toString=function(){return fc(this)};
h.equiv=function(a){return this.v(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.s};h.qa=function(){return null==this.La?null:G(this.La)};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Ac(this)};h.v=function(a,b){return Qc(this,b)};h.la=function(a,b){return Tc(b,this)};
h.ma=function(a,b,c){return Vc(b,c,this)};h.na=function(){return this.first};h.sa=function(){return null==this.La?vc:this.La};h.S=function(){return this};h.M=function(a,b){return new Ed(b,this.first,this.La,this.u)};h.R=function(a,b){return new Ed(null,b,this,null)};Ed.prototype[Ta]=function(){return yc(this)};function O(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.Xa))?new Ed(null,a,b,null):new Ed(null,a,G(b),null)}
function Fd(a,b){if(a.Ea===b.Ea)return 0;var c=Qa(a.oa);if(y(c?b.oa:c))return-1;if(y(a.oa)){if(Qa(b.oa))return 1;c=ya(a.oa,b.oa);return 0===c?ya(a.name,b.name):c}return ya(a.name,b.name)}function P(a,b,c,d){this.oa=a;this.name=b;this.Ea=c;this.Va=d;this.i=2153775105;this.A=4096}h=P.prototype;h.toString=function(){return[C(":"),C(this.Ea)].join("")};h.equiv=function(a){return this.v(null,a)};h.v=function(a,b){return b instanceof P?this.Ea===b.Ea:!1};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return sc.b(c,this);case 3:return sc.f(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return sc.b(c,this)};a.f=function(a,c,d){return sc.f(c,this,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.a=function(a){return sc.b(a,this)};h.b=function(a,b){return sc.f(a,this,b)};
h.J=function(){var a=this.Va;return null!=a?a:this.Va=a=pc(kc(this.name),nc(this.oa))+2654435769|0};h.hb=function(){return this.name};h.ib=function(){return this.oa};h.N=function(a,b){return Lb(b,[C(":"),C(this.Ea)].join(""))};var Gd=function Gd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gd.a(arguments[0]);case 2:return Gd.b(arguments[0],arguments[1]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
Gd.a=function(a){if(a instanceof P)return a;if(a instanceof rc){var b;if(null!=a&&(a.A&4096||a.dc))b=a.ib(null);else throw Error([C("Doesn't support namespace: "),C(a)].join(""));return new P(b,Hd.a?Hd.a(a):Hd.call(null,a),a.Ga,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new P(b[0],b[1],a,null):new P(null,b[0],a,null)):null};Gd.b=function(a,b){return new P(a,b,[C(y(a)?[C(a),C("/")].join(""):null),C(b)].join(""),null)};Gd.F=2;
function Id(a,b,c,d){this.s=a;this.Za=b;this.C=c;this.u=d;this.i=32374988;this.A=1}h=Id.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};function Jd(a){null!=a.Za&&(a.C=a.Za.o?a.Za.o():a.Za.call(null),a.Za=null);return a.C}
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.s};h.qa=function(){Gb(this);return null==this.C?null:J(this.C)};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Ac(this)};h.v=function(a,b){return Qc(this,b)};h.la=function(a,b){return Tc(b,this)};
h.ma=function(a,b,c){return Vc(b,c,this)};h.na=function(){Gb(this);return null==this.C?null:I(this.C)};h.sa=function(){Gb(this);return null!=this.C?uc(this.C):vc};h.S=function(){Jd(this);if(null==this.C)return null;for(var a=this.C;;)if(a instanceof Id)a=Jd(a);else return this.C=a,G(this.C)};h.M=function(a,b){return new Id(b,this.Za,this.C,this.u)};h.R=function(a,b){return O(b,this)};Id.prototype[Ta]=function(){return yc(this)};function Kd(a,b){this.xb=a;this.end=b;this.i=2;this.A=0}
Kd.prototype.add=function(a){this.xb[this.end]=a;return this.end+=1};Kd.prototype.wa=function(){var a=new Ld(this.xb,0,this.end);this.xb=null;return a};Kd.prototype.V=function(){return this.end};function Ld(a,b,c){this.c=a;this.T=b;this.end=c;this.i=524306;this.A=0}h=Ld.prototype;h.V=function(){return this.end-this.T};h.O=function(a,b){return this.c[this.T+b]};h.za=function(a,b,c){return 0<=b&&b<this.end-this.T?this.c[this.T+b]:c};
h.Kb=function(){if(this.T===this.end)throw Error("-drop-first of empty chunk");return new Ld(this.c,this.T+1,this.end)};h.la=function(a,b){return Jc(this.c,b,this.c[this.T],this.T+1)};h.ma=function(a,b,c){return Jc(this.c,b,c,this.T)};function Md(a,b,c,d){this.wa=a;this.Fa=b;this.s=c;this.u=d;this.i=31850732;this.A=1536}h=Md.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.s};h.qa=function(){if(1<bb(this.wa))return new Md(Vb(this.wa),this.Fa,this.s,null);var a=Gb(this.Fa);return null==a?null:a};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Ac(this)};
h.v=function(a,b){return Qc(this,b)};h.na=function(){return D.b(this.wa,0)};h.sa=function(){return 1<bb(this.wa)?new Md(Vb(this.wa),this.Fa,this.s,null):null==this.Fa?vc:this.Fa};h.S=function(){return this};h.Ab=function(){return this.wa};h.Bb=function(){return null==this.Fa?vc:this.Fa};h.M=function(a,b){return new Md(this.wa,this.Fa,b,this.u)};h.R=function(a,b){return O(b,this)};h.zb=function(){return null==this.Fa?null:this.Fa};Md.prototype[Ta]=function(){return yc(this)};
function Nd(a,b){return 0===bb(a)?b:new Md(a,b,null,null)}function Od(a,b){a.add(b)}function ud(a){for(var b=[];;)if(G(a))b.push(I(a)),a=J(a);else return b}function Pd(a,b){if(Kc(b))return M(b);for(var c=0,d=G(b);;)if(null!=d&&c<a)c+=1,d=J(d);else return c}
var Qd=function Qd(b){return null==b?null:null==J(b)?G(I(b)):O(I(b),Qd(J(b)))},Rd=function Rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Rd.o();case 1:return Rd.a(arguments[0]);case 2:return Rd.b(arguments[0],arguments[1]);default:return Rd.m(arguments[0],arguments[1],new H(c.slice(2),0,null))}};Rd.o=function(){return new Id(null,function(){return null},null,null)};
Rd.a=function(a){return new Id(null,function(){return a},null,null)};Rd.b=function(a,b){return new Id(null,function(){var c=G(a);return c?jd(c)?Nd(Xb(c),Rd.b(Yb(c),b)):O(I(c),Rd.b(uc(c),b)):b},null,null)};Rd.m=function(a,b,c){return function e(a,b){return new Id(null,function(){var c=G(a);return c?jd(c)?Nd(Xb(c),e(Yb(c),b)):O(I(c),e(uc(c),b)):y(b)?e(I(b),J(b)):null},null,null)}(Rd.b(a,b),c)};Rd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Rd.m(b,a,c)};Rd.F=2;
var Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Sd.o();case 1:return Sd.a(arguments[0]);case 2:return Sd.b(arguments[0],arguments[1]);default:return Sd.m(arguments[0],arguments[1],new H(c.slice(2),0,null))}};Sd.o=function(){return Ob(Xc)};Sd.a=function(a){return a};Sd.b=function(a,b){return Pb(a,b)};Sd.m=function(a,b,c){for(;;)if(a=Pb(a,b),y(c))b=I(c),c=J(c);else return a};
Sd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Sd.m(b,a,c)};Sd.F=2;
function Td(a,b,c){var d=G(c);if(0===b)return a.o?a.o():a.call(null);c=hb(d);var e=jb(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=hb(e),f=jb(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=hb(f),g=jb(f);if(3===b)return a.f?a.f(c,d,e):a.f?a.f(c,d,e):a.call(null,c,d,e);var f=hb(g),k=jb(g);if(4===b)return a.w?a.w(c,d,e,f):a.w?a.w(c,d,e,f):a.call(null,c,d,e,f);var g=hb(k),l=jb(k);if(5===b)return a.G?a.G(c,d,e,f,g):a.G?a.G(c,d,e,f,g):a.call(null,c,d,e,f,g);var k=hb(l),
m=jb(l);if(6===b)return a.ga?a.ga(c,d,e,f,g,k):a.ga?a.ga(c,d,e,f,g,k):a.call(null,c,d,e,f,g,k);var l=hb(m),n=jb(m);if(7===b)return a.ha?a.ha(c,d,e,f,g,k,l):a.ha?a.ha(c,d,e,f,g,k,l):a.call(null,c,d,e,f,g,k,l);var m=hb(n),p=jb(n);if(8===b)return a.ia?a.ia(c,d,e,f,g,k,l,m):a.ia?a.ia(c,d,e,f,g,k,l,m):a.call(null,c,d,e,f,g,k,l,m);var n=hb(p),q=jb(p);if(9===b)return a.ja?a.ja(c,d,e,f,g,k,l,m,n):a.ja?a.ja(c,d,e,f,g,k,l,m,n):a.call(null,c,d,e,f,g,k,l,m,n);var p=hb(q),r=jb(q);if(10===b)return a.W?a.W(c,d,
e,f,g,k,l,m,n,p):a.W?a.W(c,d,e,f,g,k,l,m,n,p):a.call(null,c,d,e,f,g,k,l,m,n,p);var q=hb(r),t=jb(r);if(11===b)return a.X?a.X(c,d,e,f,g,k,l,m,n,p,q):a.X?a.X(c,d,e,f,g,k,l,m,n,p,q):a.call(null,c,d,e,f,g,k,l,m,n,p,q);var r=hb(t),u=jb(t);if(12===b)return a.Y?a.Y(c,d,e,f,g,k,l,m,n,p,q,r):a.Y?a.Y(c,d,e,f,g,k,l,m,n,p,q,r):a.call(null,c,d,e,f,g,k,l,m,n,p,q,r);var t=hb(u),x=jb(u);if(13===b)return a.Z?a.Z(c,d,e,f,g,k,l,m,n,p,q,r,t):a.Z?a.Z(c,d,e,f,g,k,l,m,n,p,q,r,t):a.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t);var u=
hb(x),A=jb(x);if(14===b)return a.$?a.$(c,d,e,f,g,k,l,m,n,p,q,r,t,u):a.$?a.$(c,d,e,f,g,k,l,m,n,p,q,r,t,u):a.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,u);var x=hb(A),E=jb(A);if(15===b)return a.aa?a.aa(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x):a.aa?a.aa(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x):a.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x);var A=hb(E),F=jb(E);if(16===b)return a.ba?a.ba(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A):a.ba?a.ba(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A):a.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A);var E=hb(F),S=jb(F);if(17===
b)return a.ca?a.ca(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E):a.ca?a.ca(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E):a.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E);var F=hb(S),ka=jb(S);if(18===b)return a.da?a.da(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F):a.da?a.da(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F):a.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F);S=hb(ka);ka=jb(ka);if(19===b)return a.ea?a.ea(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S):a.ea?a.ea(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S):a.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,u,
x,A,E,F,S);var w=hb(ka);jb(ka);if(20===b)return a.fa?a.fa(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S,w):a.fa?a.fa(c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S,w):a.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S,w);throw Error("Only up to 20 arguments supported on functions");}
function cd(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return Ud(arguments[0],arguments[1]);case 3:return Vd(arguments[0],arguments[1],arguments[2]);case 4:return Wd(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Xd(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return Yd(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new H(b.slice(5),0,null))}}
function Ud(a,b){var c=a.F;if(a.B){var d=Pd(c+1,b);return d<=c?Td(a,d,b):a.B(b)}return a.apply(a,ud(b))}function Vd(a,b,c){b=O(b,c);c=a.F;if(a.B){var d=Pd(c+1,b);return d<=c?Td(a,d,b):a.B(b)}return a.apply(a,ud(b))}function Wd(a,b,c,d){b=O(b,O(c,d));c=a.F;return a.B?(d=Pd(c+1,b),d<=c?Td(a,d,b):a.B(b)):a.apply(a,ud(b))}function Xd(a,b,c,d,e){b=O(b,O(c,O(d,e)));c=a.F;return a.B?(d=Pd(c+1,b),d<=c?Td(a,d,b):a.B(b)):a.apply(a,ud(b))}
function Yd(a,b,c,d,e,f){b=O(b,O(c,O(d,O(e,Qd(f)))));c=a.F;return a.B?(d=Pd(c+1,b),d<=c?Td(a,d,b):a.B(b)):a.apply(a,ud(b))}
var Zd=function Zd(){"undefined"===typeof Ba&&(Ba=function(b,c){this.tc=b;this.rc=c;this.i=393216;this.A=0},Ba.prototype.M=function(b,c){return new Ba(this.tc,c)},Ba.prototype.K=function(){return this.rc},Ba.prototype.ta=function(){return!1},Ba.prototype.next=function(){return Error("No such element")},Ba.prototype.remove=function(){return Error("Unsupported operation")},Ba.oc=function(){return new Q(null,2,5,$d,[dd(ae,new Ha(null,1,[be,Dd(ce,Dd(Xc))],null)),de],null)},Ba.Gb=!0,Ba.mb="cljs.core/t_cljs$core10484",
Ba.Qb=function(b,c){return Lb(c,"cljs.core/t_cljs$core10484")});return new Ba(Zd,ee)};function fe(a,b){for(;;){if(null==G(b))return!0;var c;c=I(b);c=a.a?a.a(c):a.call(null,c);if(y(c)){c=a;var d=J(b);a=c;b=d}else return!1}}
function he(a){return function(){function b(b,c){return Qa(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Qa(a.a?a.a(b):a.call(null,b))}function d(){return Qa(a.o?a.o():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new H(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Qa(Wd(a,b,d,e))}b.F=2;b.B=function(a){var b=I(a);a=J(a);var d=I(a);a=uc(a);return c(b,d,a)};b.m=c;
return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new H(n,0)}return f.m(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.F=2;e.B=f.B;e.o=d;e.a=c;e.b=b;e.m=f.m;return e}()}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ie.o();case 1:return ie.a(arguments[0]);case 2:return ie.b(arguments[0],arguments[1]);case 3:return ie.f(arguments[0],arguments[1],arguments[2]);default:return ie.m(arguments[0],arguments[1],arguments[2],new H(c.slice(3),0,null))}};ie.o=function(){return wd};ie.a=function(a){return a};
ie.b=function(a,b){return function(){function c(c,d,e){c=b.f?b.f(c,d,e):b.call(null,c,d,e);return a.a?a.a(c):a.call(null,c)}function d(c,d){var e=b.b?b.b(c,d):b.call(null,c,d);return a.a?a.a(e):a.call(null,e)}function e(c){c=b.a?b.a(c):b.call(null,c);return a.a?a.a(c):a.call(null,c)}function f(){var c=b.o?b.o():b.call(null);return a.a?a.a(c):a.call(null,c)}var g=null,k=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+
3],++g;g=new H(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=Xd(b,c,e,f,g);return a.a?a.a(c):a.call(null,c)}c.F=3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=uc(a);return d(b,c,e,a)};c.m=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new H(r,0)}return k.m(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.F=3;g.B=k.B;g.o=f;g.a=e;g.b=d;g.f=c;g.m=k.m;return g}()};
ie.f=function(a,b,c){return function(){function d(d,e,f){d=c.f?c.f(d,e,f):c.call(null,d,e,f);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}function e(d,e){var f;f=c.b?c.b(d,e):c.call(null,d,e);f=b.a?b.a(f):b.call(null,f);return a.a?a.a(f):a.call(null,f)}function f(d){d=c.a?c.a(d):c.call(null,d);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}function g(){var d;d=c.o?c.o():c.call(null);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}var k=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new H(k,0)}return e.call(this,a,b,c,g)}function e(d,f,g,k){d=Xd(c,d,f,g,k);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}d.F=3;d.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var d=I(a);a=uc(a);return e(b,c,d,a)};d.m=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,t=Array(arguments.length-3);r<t.length;)t[r]=arguments[r+3],++r;r=new H(t,0)}return l.m(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};k.F=3;k.B=l.B;k.o=g;k.a=f;k.b=e;k.f=d;k.m=l.m;return k}()};
ie.m=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new H(e,0)}return c.call(this,d)}function c(b){b=Ud(I(a),b);for(var d=J(a);;)if(d)b=I(d).call(null,b),d=J(d);else return b}b.F=0;b.B=function(a){a=G(a);return c(a)};b.m=c;return b}()}(Cd(O(a,O(b,O(c,d)))))};ie.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return ie.m(b,a,c,d)};ie.F=3;
function je(){var a=ke,b=le;return function(){function c(c,d,e){return a.w?a.w(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.f?a.f(b,c,d):a.call(null,b,c,d)}function e(c){return a.b?a.b(b,c):a.call(null,b,c)}function f(){return a.a?a.a(b):a.call(null,b)}var g=null,k=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new H(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return Yd(a,b,c,e,f,Sc([g],
0))}c.F=3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=uc(a);return d(b,c,e,a)};c.m=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new H(r,0)}return k.m(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.F=3;g.B=k.B;g.o=
f;g.a=e;g.b=d;g.f=c;g.m=k.m;return g}()}function me(a,b,c,d){this.state=a;this.s=b;this.yc=c;this.vb=d;this.A=16386;this.i=6455296}h=me.prototype;h.equiv=function(a){return this.v(null,a)};h.v=function(a,b){return this===b};h.Wb=function(){return this.state};h.K=function(){return this.s};
h.Ob=function(a,b,c){a=G(this.vb);for(var d=null,e=0,f=0;;)if(f<e){var g=d.O(null,f),k=Zc(g,0,null),g=Zc(g,1,null);g.w?g.w(k,this,b,c):g.call(null,k,this,b,c);f+=1}else if(a=G(a))jd(a)?(d=Xb(a),a=Yb(a),k=d,e=M(d),d=k):(d=I(a),k=Zc(d,0,null),g=Zc(d,1,null),g.w?g.w(k,this,b,c):g.call(null,k,this,b,c),a=J(a),d=null,e=0),f=0;else return null};h.Nb=function(a,b,c){this.vb=$c.f(this.vb,b,c);return this};h.J=function(){return this[aa]||(this[aa]=++ca)};
function ne(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return oe(arguments[0]);default:return c=arguments[0],b=new H(b.slice(1),0,null),d=null!=b&&(b.i&64||b.Xa)?Ud(pe,b):b,b=sc.b(d,Ka),d=sc.b(d,qe),new me(c,b,d,null)}}function oe(a){return new me(a,null,null,null)}
function re(a,b){if(a instanceof me){var c=a.yc;if(null!=c&&!y(c.a?c.a(b):c.call(null,b)))throw Error("Validator rejected reference state");c=a.state;a.state=b;null!=a.vb&&Mb(a,c,b);return b}return bc(a,b)}
var se=function se(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return se.b(arguments[0],arguments[1]);case 3:return se.f(arguments[0],arguments[1],arguments[2]);case 4:return se.w(arguments[0],arguments[1],arguments[2],arguments[3]);default:return se.m(arguments[0],arguments[1],arguments[2],arguments[3],new H(c.slice(4),0,null))}};
se.b=function(a,b){var c;a instanceof me?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=re(a,c)):c=cc.b(a,b);return c};se.f=function(a,b,c){if(a instanceof me){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=re(a,b)}else a=cc.f(a,b,c);return a};se.w=function(a,b,c,d){if(a instanceof me){var e=a.state;b=b.f?b.f(e,c,d):b.call(null,e,c,d);a=re(a,b)}else a=cc.w(a,b,c,d);return a};se.m=function(a,b,c,d,e){return a instanceof me?re(a,Xd(b,a.state,c,d,e)):cc.G(a,b,c,d,e)};
se.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),e=J(e);return se.m(b,a,c,d,e)};se.F=4;
var te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return te.a(arguments[0]);case 2:return te.b(arguments[0],arguments[1]);case 3:return te.f(arguments[0],arguments[1],arguments[2]);case 4:return te.w(arguments[0],arguments[1],arguments[2],arguments[3]);default:return te.m(arguments[0],arguments[1],arguments[2],arguments[3],new H(c.slice(4),0,null))}};
te.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.o?b.o():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new H(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=Vd(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.F=2;c.B=function(a){var b=
I(a);a=J(a);var c=I(a);a=uc(a);return d(b,c,a)};c.m=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new H(p,0)}return g.m(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.F=2;f.B=g.B;f.o=e;f.a=d;f.b=c;f.m=g.m;return f}()}};
te.b=function(a,b){return new Id(null,function(){var c=G(b);if(c){if(jd(c)){for(var d=Xb(c),e=M(d),f=new Kd(Array(e),0),g=0;;)if(g<e)Od(f,function(){var b=D.b(d,g);return a.a?a.a(b):a.call(null,b)}()),g+=1;else break;return Nd(f.wa(),te.b(a,Yb(c)))}return O(function(){var b=I(c);return a.a?a.a(b):a.call(null,b)}(),te.b(a,uc(c)))}return null},null,null)};
te.f=function(a,b,c){return new Id(null,function(){var d=G(b),e=G(c);if(d&&e){var f=O,g;g=I(d);var k=I(e);g=a.b?a.b(g,k):a.call(null,g,k);d=f(g,te.f(a,uc(d),uc(e)))}else d=null;return d},null,null)};te.w=function(a,b,c,d){return new Id(null,function(){var e=G(b),f=G(c),g=G(d);if(e&&f&&g){var k=O,l;l=I(e);var m=I(f),n=I(g);l=a.f?a.f(l,m,n):a.call(null,l,m,n);e=k(l,te.w(a,uc(e),uc(f),uc(g)))}else e=null;return e},null,null)};
te.m=function(a,b,c,d,e){var f=function k(a){return new Id(null,function(){var b=te.b(G,a);return fe(wd,b)?O(te.b(I,b),k(te.b(uc,b))):null},null,null)};return te.b(function(){return function(b){return Ud(a,b)}}(f),f(Wc.m(e,d,Sc([c,b],0))))};te.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),e=J(e);return te.m(b,a,c,d,e)};te.F=4;
function ue(a){return function(b){return function(){function c(c,d){return y(a.a?a.a(d):a.call(null,d))?b.b?b.b(c,d):b.call(null,c,d):c}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.o?b.o():b.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.o=e;f.a=d;f.b=c;return f}()}}
function ve(a,b){return new Id(null,function(){var c=G(b);if(c){if(jd(c)){for(var d=Xb(c),e=M(d),f=new Kd(Array(e),0),g=0;;)if(g<e){var k;k=D.b(d,g);k=a.a?a.a(k):a.call(null,k);y(k)&&(k=D.b(d,g),f.add(k));g+=1}else break;return Nd(f.wa(),ve(a,Yb(c)))}d=I(c);c=uc(c);return y(a.a?a.a(d):a.call(null,d))?O(d,ve(a,c)):ve(a,c)}return null},null,null)}
function we(a){return function c(a){return new Id(null,function(){var e=O,f;y(nd.a?nd.a(a):nd.call(null,a))?(f=Sc([G.a?G.a(a):G.call(null,a)],0),f=Ud(Rd,Vd(te,c,f))):f=null;return e(a,f)},null,null)}(a)}function xe(a,b,c){return null!=a&&(a.A&4||a.Xb)?dd(Qb(xd(b,Sd,Ob(a),c)),ed(a)):xd(b,Wc,a,c)}function ye(a,b){this.H=a;this.c=b}
function ze(a){return new ye(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ae(a){a=a.j;return 32>a?0:a-1>>>5<<5}function Be(a,b,c){for(;;){if(0===b)return c;var d=ze(a);d.c[0]=c;c=d;b-=5}}var Ce=function Ce(b,c,d,e){var f=new ye(d.H,Ua(d.c)),g=b.j-1>>>c&31;5===c?f.c[g]=e:(d=d.c[g],b=null!=d?Ce(b,c-5,d,e):Be(null,c-5,e),f.c[g]=b);return f};
function De(a,b){throw Error([C("No item "),C(a),C(" in vector of length "),C(b)].join(""));}function Ee(a,b){if(b>=Ae(a))return a.pa;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.c[b>>>d&31],d=e;else return c.c}function Fe(a,b){return 0<=b&&b<a.j?Ee(a,b):De(b,a.j)}var Ge=function Ge(b,c,d,e,f){var g=new ye(d.H,Ua(d.c));if(0===c)g.c[e&31]=f;else{var k=e>>>c&31;b=Ge(b,c-5,d.c[k],e,f);g.c[k]=b}return g};function He(a,b,c,d,e,f){this.l=a;this.wb=b;this.c=c;this.Ha=d;this.start=e;this.end=f}
He.prototype.ta=function(){return this.l<this.end};He.prototype.next=function(){32===this.l-this.wb&&(this.c=Ee(this.Ha,this.l),this.wb+=32);var a=this.c[this.l&31];this.l+=1;return a};function Q(a,b,c,d,e,f){this.s=a;this.j=b;this.shift=c;this.root=d;this.pa=e;this.u=f;this.i=167668511;this.A=8196}h=Q.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.L=function(a,b){return mb.f(this,b,null)};h.I=function(a,b,c){return"number"===typeof b?D.f(this,b,c):c};h.O=function(a,b){return Fe(this,b)[b&31]};h.za=function(a,b,c){return 0<=b&&b<this.j?Ee(this,b)[b&31]:c};
h.Fb=function(a,b,c){if(0<=b&&b<this.j)return Ae(this)<=b?(a=Ua(this.pa),a[b&31]=c,new Q(this.s,this.j,this.shift,this.root,a,null)):new Q(this.s,this.j,this.shift,Ge(this,this.shift,this.root,b,c),this.pa,null);if(b===this.j)return eb(this,c);throw Error([C("Index "),C(b),C(" out of bounds  [0,"),C(this.j),C("]")].join(""));};h.Ja=function(){var a=this.j;return new He(0,0,0<M(this)?Ee(this,0):null,this,0,a)};h.K=function(){return this.s};h.V=function(){return this.j};
h.Db=function(){return D.b(this,0)};h.Eb=function(){return D.b(this,1)};h.ub=function(){return 0<this.j?new Pc(this,this.j-1,null):null};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Ac(this)};h.v=function(a,b){if(b instanceof Q)if(this.j===M(b))for(var c=dc(this),d=dc(b);;)if(y(c.ta())){var e=c.next(),f=d.next();if(!wc.b(e,f))return!1}else return!0;else return!1;else return Qc(this,b)};
h.fb=function(){return new Ie(this.j,this.shift,Je.a?Je.a(this.root):Je.call(null,this.root),Ke.a?Ke.a(this.pa):Ke.call(null,this.pa))};h.la=function(a,b){return Ec(this,b)};h.ma=function(a,b,c){a=0;for(var d=c;;)if(a<this.j){var e=Ee(this,a);c=e.length;a:for(var f=0;;)if(f<c)var g=e[f],d=b.b?b.b(d,g):b.call(null,d,g),f=f+1;else{e=d;break a}a+=c;d=e}else return d};h.cb=function(a,b,c){if("number"===typeof b)return vb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
h.S=function(){if(0===this.j)return null;if(32>=this.j)return new H(this.pa,0,null);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.c[0];else{a=a.c;break a}}return Le?Le(this,a,0,0):Me.call(null,this,a,0,0)};h.M=function(a,b){return new Q(b,this.j,this.shift,this.root,this.pa,this.u)};
h.R=function(a,b){if(32>this.j-Ae(this)){for(var c=this.pa.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.pa[e],e+=1;else break;d[c]=b;return new Q(this.s,this.j+1,this.shift,this.root,d,null)}c=(d=this.j>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=ze(null),d.c[0]=this.root,e=Be(null,this.shift,new ye(null,this.pa)),d.c[1]=e):d=Ce(this,this.shift,this.root,new ye(null,this.pa));return new Q(this.s,this.j+1,c,d,[b],null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.za(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.O(null,c)};a.f=function(a,c,d){return this.za(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.a=function(a){return this.O(null,a)};h.b=function(a,b){return this.za(null,a,b)};
var $d=new ye(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Xc=new Q(null,0,5,$d,[],Bc);Q.prototype[Ta]=function(){return yc(this)};function Ne(a,b,c,d,e,f){this.xa=a;this.node=b;this.l=c;this.T=d;this.s=e;this.u=f;this.i=32375020;this.A=1536}h=Ne.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.s};h.qa=function(){if(this.T+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.l,d=this.T+1;a=Le?Le(a,b,c,d):Me.call(null,a,b,c,d);return null==a?null:a}return Zb(this)};
h.J=function(){var a=this.u;return null!=a?a:this.u=a=Ac(this)};h.v=function(a,b){return Qc(this,b)};h.la=function(a,b){var c;c=this.xa;var d=this.l+this.T,e=M(this.xa);c=Oe?Oe(c,d,e):Pe.call(null,c,d,e);return Ec(c,b)};h.ma=function(a,b,c){a=this.xa;var d=this.l+this.T,e=M(this.xa);a=Oe?Oe(a,d,e):Pe.call(null,a,d,e);return Fc(a,b,c)};h.na=function(){return this.node[this.T]};
h.sa=function(){if(this.T+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.l,d=this.T+1;a=Le?Le(a,b,c,d):Me.call(null,a,b,c,d);return null==a?vc:a}return Yb(this)};h.S=function(){return this};h.Ab=function(){var a=this.node;return new Ld(a,this.T,a.length)};h.Bb=function(){var a=this.l+this.node.length;if(a<bb(this.xa)){var b=this.xa,c=Ee(this.xa,a);return Le?Le(b,c,a,0):Me.call(null,b,c,a,0)}return vc};
h.M=function(a,b){return Qe?Qe(this.xa,this.node,this.l,this.T,b):Me.call(null,this.xa,this.node,this.l,this.T,b)};h.R=function(a,b){return O(b,this)};h.zb=function(){var a=this.l+this.node.length;if(a<bb(this.xa)){var b=this.xa,c=Ee(this.xa,a);return Le?Le(b,c,a,0):Me.call(null,b,c,a,0)}return null};Ne.prototype[Ta]=function(){return yc(this)};
function Me(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 3:return b=arguments[0],c=arguments[1],d=arguments[2],new Ne(b,Fe(b,c),c,d,null,null);case 4:return Le(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Qe(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}function Le(a,b,c,d){return new Ne(a,b,c,d,null,null)}
function Qe(a,b,c,d,e){return new Ne(a,b,c,d,e,null)}function Re(a,b,c,d,e){this.s=a;this.Ha=b;this.start=c;this.end=d;this.u=e;this.i=167666463;this.A=8192}h=Re.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.L=function(a,b){return mb.f(this,b,null)};h.I=function(a,b,c){return"number"===typeof b?D.f(this,b,c):c};h.O=function(a,b){return 0>b||this.end<=this.start+b?De(b,this.end-this.start):D.b(this.Ha,this.start+b)};
h.za=function(a,b,c){return 0>b||this.end<=this.start+b?c:D.f(this.Ha,this.start+b,c)};h.Fb=function(a,b,c){var d=this.start+b;a=this.s;c=$c.f(this.Ha,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Se.G?Se.G(a,c,b,d,null):Se.call(null,a,c,b,d,null)};h.K=function(){return this.s};h.V=function(){return this.end-this.start};h.ub=function(){return this.start!==this.end?new Pc(this,this.end-this.start-1,null):null};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Ac(this)};
h.v=function(a,b){return Qc(this,b)};h.la=function(a,b){return Ec(this,b)};h.ma=function(a,b,c){return Fc(this,b,c)};h.cb=function(a,b,c){if("number"===typeof b)return vb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};h.S=function(){var a=this;return function(b){return function d(e){return e===a.end?null:O(D.b(a.Ha,e),new Id(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
h.M=function(a,b){return Se.G?Se.G(b,this.Ha,this.start,this.end,this.u):Se.call(null,b,this.Ha,this.start,this.end,this.u)};h.R=function(a,b){var c=this.s,d=vb(this.Ha,this.end,b),e=this.start,f=this.end+1;return Se.G?Se.G(c,d,e,f,null):Se.call(null,c,d,e,f,null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.za(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.O(null,c)};a.f=function(a,c,d){return this.za(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.a=function(a){return this.O(null,a)};h.b=function(a,b){return this.za(null,a,b)};Re.prototype[Ta]=function(){return yc(this)};
function Se(a,b,c,d,e){for(;;)if(b instanceof Re)c=b.start+c,d=b.start+d,b=b.Ha;else{var f=M(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Re(a,b,c,d,e)}}function Pe(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return b=arguments[0],Oe(b,arguments[1],M(b));case 3:return Oe(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}
function Oe(a,b,c){return Se(null,a,b,c,null)}function Te(a,b){return a===b.H?b:new ye(a,Ua(b.c))}function Je(a){return new ye({},Ua(a.c))}function Ke(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];ld(a,0,b,0,a.length);return b}var Ue=function Ue(b,c,d,e){d=Te(b.root.H,d);var f=b.j-1>>>c&31;if(5===c)b=e;else{var g=d.c[f];b=null!=g?Ue(b,c-5,g,e):Be(b.root.H,c-5,e)}d.c[f]=b;return d};
function Ie(a,b,c,d){this.j=a;this.shift=b;this.root=c;this.pa=d;this.A=88;this.i=275}h=Ie.prototype;
h.kb=function(a,b){if(this.root.H){if(32>this.j-Ae(this))this.pa[this.j&31]=b;else{var c=new ye(this.root.H,this.pa),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.pa=d;if(this.j>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Be(this.root.H,this.shift,c);this.root=new ye(this.root.H,d);this.shift=e}else this.root=Ue(this,this.shift,this.root,c)}this.j+=1;return this}throw Error("conj! after persistent!");};h.lb=function(){if(this.root.H){this.root.H=null;var a=this.j-Ae(this),b=Array(a);ld(this.pa,0,b,0,a);return new Q(null,this.j,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
h.jb=function(a,b,c){if("number"===typeof b)return Sb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
h.Mb=function(a,b,c){var d=this;if(d.root.H){if(0<=b&&b<d.j)return Ae(this)<=b?d.pa[b&31]=c:(a=function(){return function f(a,k){var l=Te(d.root.H,k);if(0===a)l.c[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.c[m]);l.c[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.j)return Pb(this,c);throw Error([C("Index "),C(b),C(" out of bounds for TransientVector of length"),C(d.j)].join(""));}throw Error("assoc! after persistent!");};
h.V=function(){if(this.root.H)return this.j;throw Error("count after persistent!");};h.O=function(a,b){if(this.root.H)return Fe(this,b)[b&31];throw Error("nth after persistent!");};h.za=function(a,b,c){return 0<=b&&b<this.j?D.b(this,b):c};h.L=function(a,b){return mb.f(this,b,null)};h.I=function(a,b,c){return"number"===typeof b?D.f(this,b,c):c};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.L(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.L(null,c)};a.f=function(a,c,d){return this.I(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.a=function(a){return this.L(null,a)};h.b=function(a,b){return this.I(null,a,b)};function Ve(){this.i=2097152;this.A=0}
Ve.prototype.equiv=function(a){return this.v(null,a)};Ve.prototype.v=function(){return!1};var We=new Ve;function Xe(a,b){return od(hd(b)?M(a)===M(b)?fe(function(a){return wc.b(sc.f(b,I(a),We),I(J(a)))},a):null:null)}function Ye(a){this.C=a}Ye.prototype.next=function(){if(null!=this.C){var a=I(this.C),b=Zc(a,0,null),a=Zc(a,1,null);this.C=J(this.C);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Ze(a){this.C=a}
Ze.prototype.next=function(){if(null!=this.C){var a=I(this.C);this.C=J(this.C);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function $e(a,b){var c;if(b instanceof P)a:{c=a.length;for(var d=b.Ea,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof P&&d===a[e].Ea){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof rc)a:for(c=a.length,d=b.Ga,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof rc&&d===a[e].Ga){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(wc.b(b,a[d])){c=d;break a}d+=2}return c}function af(a,b,c){this.c=a;this.l=b;this.ya=c;this.i=32374990;this.A=0}h=af.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.ya};h.qa=function(){return this.l<this.c.length-2?new af(this.c,this.l+2,this.ya):null};h.V=function(){return(this.c.length-this.l)/2};h.J=function(){return Ac(this)};
h.v=function(a,b){return Qc(this,b)};h.la=function(a,b){return Tc(b,this)};h.ma=function(a,b,c){return Vc(b,c,this)};h.na=function(){return new Q(null,2,5,$d,[this.c[this.l],this.c[this.l+1]],null)};h.sa=function(){return this.l<this.c.length-2?new af(this.c,this.l+2,this.ya):vc};h.S=function(){return this};h.M=function(a,b){return new af(this.c,this.l,b)};h.R=function(a,b){return O(b,this)};af.prototype[Ta]=function(){return yc(this)};function bf(a,b,c){this.c=a;this.l=b;this.j=c}
bf.prototype.ta=function(){return this.l<this.j};bf.prototype.next=function(){var a=new Q(null,2,5,$d,[this.c[this.l],this.c[this.l+1]],null);this.l+=2;return a};function Ha(a,b,c,d){this.s=a;this.j=b;this.c=c;this.u=d;this.i=16647951;this.A=8196}h=Ha.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};h.keys=function(){return yc(cf.a?cf.a(this):cf.call(null,this))};h.entries=function(){return new Ye(G(G(this)))};
h.values=function(){return yc(df.a?df.a(this):df.call(null,this))};h.has=function(a){return pd(this,a)};h.get=function(a,b){return this.I(null,a,b)};h.forEach=function(a){for(var b=G(this),c=null,d=0,e=0;;)if(e<d){var f=c.O(null,e),g=Zc(f,0,null),f=Zc(f,1,null);a.b?a.b(f,g):a.call(null,f,g);e+=1}else if(b=G(b))jd(b)?(c=Xb(b),b=Yb(b),g=c,d=M(c),c=g):(c=I(b),g=Zc(c,0,null),f=Zc(c,1,null),a.b?a.b(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};h.L=function(a,b){return mb.f(this,b,null)};
h.I=function(a,b,c){a=$e(this.c,b);return-1===a?c:this.c[a+1]};h.Ja=function(){return new bf(this.c,0,2*this.j)};h.K=function(){return this.s};h.V=function(){return this.j};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Cc(this)};h.v=function(a,b){if(null!=b&&(b.i&1024||b.ac)){var c=this.c.length;if(this.j===b.V(null))for(var d=0;;)if(d<c){var e=b.I(null,this.c[d],md);if(e!==md)if(wc.b(this.c[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Xe(this,b)};
h.fb=function(){return new ef({},this.c.length,Ua(this.c))};h.la=function(a,b){return Tc(b,this)};h.ma=function(a,b,c){return Vc(b,c,this)};
h.cb=function(a,b,c){a=$e(this.c,b);if(-1===a){if(this.j<ff){a=this.c;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new Ha(this.s,this.j+1,e,null)}a=ad;a=null!=a?null!=a&&(a.A&4||a.Xb)?dd(Qb(Ya(Pb,Ob(a),this)),ed(a)):Ya(eb,a,this):Ya(Wc,vc,this);return zb(ob(a,b,c),this.s)}if(c===this.c[a+1])return this;b=Ua(this.c);b[a+1]=c;return new Ha(this.s,this.j,b,null)};h.yb=function(a,b){return-1!==$e(this.c,b)};
h.S=function(){var a=this.c;return 0<=a.length-2?new af(a,0,null):null};h.M=function(a,b){return new Ha(b,this.j,this.c,this.u)};h.R=function(a,b){if(id(b))return ob(this,D.b(b,0),D.b(b,1));for(var c=this,d=G(b);;){if(null==d)return c;var e=I(d);if(id(e))c=ob(c,D.b(e,0),D.b(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.L(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.L(null,c)};a.f=function(a,c,d){return this.I(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.a=function(a){return this.L(null,a)};h.b=function(a,b){return this.I(null,a,b)};var ee=new Ha(null,0,[],Dc),ff=8;Ha.prototype[Ta]=function(){return yc(this)};
function ef(a,b,c){this.Ya=a;this.Ta=b;this.c=c;this.i=258;this.A=56}h=ef.prototype;h.V=function(){if(y(this.Ya))return yd(this.Ta);throw Error("count after persistent!");};h.L=function(a,b){return mb.f(this,b,null)};h.I=function(a,b,c){if(y(this.Ya))return a=$e(this.c,b),-1===a?c:this.c[a+1];throw Error("lookup after persistent!");};
h.kb=function(a,b){if(y(this.Ya)){if(null!=b?b.i&2048||b.bc||(b.i?0:z(qb,b)):z(qb,b))return Rb(this,gf.a?gf.a(b):gf.call(null,b),hf.a?hf.a(b):hf.call(null,b));for(var c=G(b),d=this;;){var e=I(c);if(y(e))c=J(c),d=Rb(d,gf.a?gf.a(e):gf.call(null,e),hf.a?hf.a(e):hf.call(null,e));else return d}}else throw Error("conj! after persistent!");};h.lb=function(){if(y(this.Ya))return this.Ya=!1,new Ha(null,yd(this.Ta),this.c,null);throw Error("persistent! called twice");};
h.jb=function(a,b,c){if(y(this.Ya)){a=$e(this.c,b);if(-1===a){if(this.Ta+2<=2*ff)return this.Ta+=2,this.c.push(b),this.c.push(c),this;a=jf.b?jf.b(this.Ta,this.c):jf.call(null,this.Ta,this.c);return Rb(a,b,c)}c!==this.c[a+1]&&(this.c[a+1]=c);return this}throw Error("assoc! after persistent!");};function jf(a,b){for(var c=Ob(ad),d=0;;)if(d<a)c=Rb(c,b[d],b[d+1]),d+=2;else return c}function kf(){this.Ia=!1}
function lf(a,b){return a===b?!0:a===b||a instanceof P&&b instanceof P&&a.Ea===b.Ea?!0:wc.b(a,b)}function mf(a,b,c){a=Ua(a);a[b]=c;return a}function nf(a,b,c,d){a=a.Ra(b);a.c[c]=d;return a}function of(a,b,c,d){this.c=a;this.l=b;this.qb=c;this.Da=d}of.prototype.advance=function(){for(var a=this.c.length;;)if(this.l<a){var b=this.c[this.l],c=this.c[this.l+1];null!=b?b=this.qb=new Q(null,2,5,$d,[b,c],null):null!=c?(b=dc(c),b=b.ta()?this.Da=b:!1):b=!1;this.l+=2;if(b)return!0}else return!1};
of.prototype.ta=function(){var a=null!=this.qb;return a?a:(a=null!=this.Da)?a:this.advance()};of.prototype.next=function(){if(null!=this.qb){var a=this.qb;this.qb=null;return a}if(null!=this.Da)return a=this.Da.next(),this.Da.ta()||(this.Da=null),a;if(this.advance())return this.next();throw Error("No such element");};of.prototype.remove=function(){return Error("Unsupported operation")};function pf(a,b,c){this.H=a;this.P=b;this.c=c}h=pf.prototype;
h.Ra=function(a){if(a===this.H)return this;var b=zd(this.P),c=Array(0>b?4:2*(b+1));ld(this.c,0,c,0,2*b);return new pf(a,this.P,c)};h.ob=function(){return qf?qf(this.c):rf.call(null,this.c)};h.Oa=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.P&e))return d;var f=zd(this.P&e-1),e=this.c[2*f],f=this.c[2*f+1];return null==e?f.Oa(a+5,b,c,d):lf(c,e)?f:d};
h.Ca=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),k=zd(this.P&g-1);if(0===(this.P&g)){var l=zd(this.P);if(2*l<this.c.length){a=this.Ra(a);b=a.c;f.Ia=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.P|=g;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=sf.Ca(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.P>>>d&1)&&(k[d]=null!=this.c[e]?sf.Ca(a,b+5,oc(this.c[e]),this.c[e],this.c[e+1],f):this.c[e+1],e+=2),d+=1;else break;return new tf(a,l+1,k)}b=Array(2*(l+4));ld(this.c,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;ld(this.c,2*k,b,2*(k+1),2*(l-k));f.Ia=!0;a=this.Ra(a);a.c=b;a.P|=g;return a}l=this.c[2*k];g=this.c[2*k+1];if(null==l)return l=g.Ca(a,b+5,c,d,e,f),l===g?this:nf(this,a,2*k+1,l);if(lf(d,l))return e===g?this:nf(this,a,2*k+1,e);f.Ia=!0;f=b+5;d=uf?uf(a,f,l,g,c,d,e):vf.call(null,a,f,l,g,c,d,e);e=2*k;k=
2*k+1;a=this.Ra(a);a.c[e]=null;a.c[k]=d;return a};
h.Ba=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=zd(this.P&f-1);if(0===(this.P&f)){var k=zd(this.P);if(16<=k){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=sf.Ba(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.P>>>c&1)&&(g[c]=null!=this.c[d]?sf.Ba(a+5,oc(this.c[d]),this.c[d],this.c[d+1],e):this.c[d+1],d+=2),c+=1;else break;return new tf(null,k+1,g)}a=Array(2*(k+1));ld(this.c,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;ld(this.c,2*g,a,2*(g+1),2*(k-g));e.Ia=!0;return new pf(null,this.P|f,a)}var l=this.c[2*g],f=this.c[2*g+1];if(null==l)return k=f.Ba(a+5,b,c,d,e),k===f?this:new pf(null,this.P,mf(this.c,2*g+1,k));if(lf(c,l))return d===f?this:new pf(null,this.P,mf(this.c,2*g+1,d));e.Ia=!0;e=this.P;k=this.c;a+=5;a=wf?wf(a,l,f,b,c,d):vf.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Ua(k);d[c]=null;d[g]=a;return new pf(null,e,d)};h.Ja=function(){return new of(this.c,0,null,null)};
var sf=new pf(null,0,[]);function xf(a,b,c){this.c=a;this.l=b;this.Da=c}xf.prototype.ta=function(){for(var a=this.c.length;;){if(null!=this.Da&&this.Da.ta())return!0;if(this.l<a){var b=this.c[this.l];this.l+=1;null!=b&&(this.Da=dc(b))}else return!1}};xf.prototype.next=function(){if(this.ta())return this.Da.next();throw Error("No such element");};xf.prototype.remove=function(){return Error("Unsupported operation")};function tf(a,b,c){this.H=a;this.j=b;this.c=c}h=tf.prototype;
h.Ra=function(a){return a===this.H?this:new tf(a,this.j,Ua(this.c))};h.ob=function(){return yf?yf(this.c):zf.call(null,this.c)};h.Oa=function(a,b,c,d){var e=this.c[b>>>a&31];return null!=e?e.Oa(a+5,b,c,d):d};h.Ca=function(a,b,c,d,e,f){var g=c>>>b&31,k=this.c[g];if(null==k)return a=nf(this,a,g,sf.Ca(a,b+5,c,d,e,f)),a.j+=1,a;b=k.Ca(a,b+5,c,d,e,f);return b===k?this:nf(this,a,g,b)};
h.Ba=function(a,b,c,d,e){var f=b>>>a&31,g=this.c[f];if(null==g)return new tf(null,this.j+1,mf(this.c,f,sf.Ba(a+5,b,c,d,e)));a=g.Ba(a+5,b,c,d,e);return a===g?this:new tf(null,this.j,mf(this.c,f,a))};h.Ja=function(){return new xf(this.c,0,null)};function Af(a,b,c){b*=2;for(var d=0;;)if(d<b){if(lf(c,a[d]))return d;d+=2}else return-1}function Bf(a,b,c,d){this.H=a;this.Na=b;this.j=c;this.c=d}h=Bf.prototype;
h.Ra=function(a){if(a===this.H)return this;var b=Array(2*(this.j+1));ld(this.c,0,b,0,2*this.j);return new Bf(a,this.Na,this.j,b)};h.ob=function(){return qf?qf(this.c):rf.call(null,this.c)};h.Oa=function(a,b,c,d){a=Af(this.c,this.j,c);return 0>a?d:lf(c,this.c[a])?this.c[a+1]:d};
h.Ca=function(a,b,c,d,e,f){if(c===this.Na){b=Af(this.c,this.j,d);if(-1===b){if(this.c.length>2*this.j)return b=2*this.j,c=2*this.j+1,a=this.Ra(a),a.c[b]=d,a.c[c]=e,f.Ia=!0,a.j+=1,a;c=this.c.length;b=Array(c+2);ld(this.c,0,b,0,c);b[c]=d;b[c+1]=e;f.Ia=!0;d=this.j+1;a===this.H?(this.c=b,this.j=d,a=this):a=new Bf(this.H,this.Na,d,b);return a}return this.c[b+1]===e?this:nf(this,a,b+1,e)}return(new pf(a,1<<(this.Na>>>b&31),[null,this,null,null])).Ca(a,b,c,d,e,f)};
h.Ba=function(a,b,c,d,e){return b===this.Na?(a=Af(this.c,this.j,c),-1===a?(a=2*this.j,b=Array(a+2),ld(this.c,0,b,0,a),b[a]=c,b[a+1]=d,e.Ia=!0,new Bf(null,this.Na,this.j+1,b)):wc.b(this.c[a],d)?this:new Bf(null,this.Na,this.j,mf(this.c,a+1,d))):(new pf(null,1<<(this.Na>>>a&31),[null,this])).Ba(a,b,c,d,e)};h.Ja=function(){return new of(this.c,0,null,null)};
function vf(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 6:return wf(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return uf(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}
function wf(a,b,c,d,e,f){var g=oc(b);if(g===d)return new Bf(null,g,2,[b,c,e,f]);var k=new kf;return sf.Ba(a,g,b,c,k).Ba(a,d,e,f,k)}function uf(a,b,c,d,e,f,g){var k=oc(c);if(k===e)return new Bf(null,k,2,[c,d,f,g]);var l=new kf;return sf.Ca(a,b,k,c,d,l).Ca(a,b,e,f,g,l)}function Cf(a,b,c,d,e){this.s=a;this.Pa=b;this.l=c;this.C=d;this.u=e;this.i=32374860;this.A=0}h=Cf.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.s};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Ac(this)};h.v=function(a,b){return Qc(this,b)};h.la=function(a,b){return Tc(b,this)};h.ma=function(a,b,c){return Vc(b,c,this)};
h.na=function(){return null==this.C?new Q(null,2,5,$d,[this.Pa[this.l],this.Pa[this.l+1]],null):I(this.C)};h.sa=function(){var a=this,b=null==a.C?function(){var b=a.Pa,d=a.l+2;return Df?Df(b,d,null):rf.call(null,b,d,null)}():function(){var b=a.Pa,d=a.l,e=J(a.C);return Df?Df(b,d,e):rf.call(null,b,d,e)}();return null!=b?b:vc};h.S=function(){return this};h.M=function(a,b){return new Cf(b,this.Pa,this.l,this.C,this.u)};h.R=function(a,b){return O(b,this)};Cf.prototype[Ta]=function(){return yc(this)};
function rf(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return qf(arguments[0]);case 3:return Df(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}function qf(a){return Df(a,0,null)}
function Df(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Cf(null,a,b,null,null);var d=a[b+1];if(y(d)&&(d=d.ob(),y(d)))return new Cf(null,a,b+2,d,null);b+=2}else return null;else return new Cf(null,a,b,c,null)}function Ef(a,b,c,d,e){this.s=a;this.Pa=b;this.l=c;this.C=d;this.u=e;this.i=32374860;this.A=0}h=Ef.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.s};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Ac(this)};h.v=function(a,b){return Qc(this,b)};h.la=function(a,b){return Tc(b,this)};h.ma=function(a,b,c){return Vc(b,c,this)};h.na=function(){return I(this.C)};
h.sa=function(){var a;a=this.Pa;var b=this.l,c=J(this.C);a=Ff?Ff(null,a,b,c):zf.call(null,null,a,b,c);return null!=a?a:vc};h.S=function(){return this};h.M=function(a,b){return new Ef(b,this.Pa,this.l,this.C,this.u)};h.R=function(a,b){return O(b,this)};Ef.prototype[Ta]=function(){return yc(this)};
function zf(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return yf(arguments[0]);case 4:return Ff(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([C("Invalid arity: "),C(b.length)].join(""));}}function yf(a){return Ff(null,a,0,null)}function Ff(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(y(e)&&(e=e.ob(),y(e)))return new Ef(a,b,c+1,e,null);c+=1}else return null;else return new Ef(a,b,c,d,null)}
function Gf(a,b,c){this.va=a;this.Tb=b;this.Ib=c}Gf.prototype.ta=function(){return this.Ib&&this.Tb.ta()};Gf.prototype.next=function(){if(this.Ib)return this.Tb.next();this.Ib=!0;return this.va};Gf.prototype.remove=function(){return Error("Unsupported operation")};function Hf(a,b,c,d,e,f){this.s=a;this.j=b;this.root=c;this.ua=d;this.va=e;this.u=f;this.i=16123663;this.A=8196}h=Hf.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.keys=function(){return yc(cf.a?cf.a(this):cf.call(null,this))};h.entries=function(){return new Ye(G(G(this)))};h.values=function(){return yc(df.a?df.a(this):df.call(null,this))};h.has=function(a){return pd(this,a)};h.get=function(a,b){return this.I(null,a,b)};
h.forEach=function(a){for(var b=G(this),c=null,d=0,e=0;;)if(e<d){var f=c.O(null,e),g=Zc(f,0,null),f=Zc(f,1,null);a.b?a.b(f,g):a.call(null,f,g);e+=1}else if(b=G(b))jd(b)?(c=Xb(b),b=Yb(b),g=c,d=M(c),c=g):(c=I(b),g=Zc(c,0,null),f=Zc(c,1,null),a.b?a.b(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};h.L=function(a,b){return mb.f(this,b,null)};h.I=function(a,b,c){return null==b?this.ua?this.va:c:null==this.root?c:this.root.Oa(0,oc(b),b,c)};
h.Ja=function(){var a=this.root?dc(this.root):Zd;return this.ua?new Gf(this.va,a,!1):a};h.K=function(){return this.s};h.V=function(){return this.j};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Cc(this)};h.v=function(a,b){return Xe(this,b)};h.fb=function(){return new If({},this.root,this.j,this.ua,this.va)};
h.cb=function(a,b,c){if(null==b)return this.ua&&c===this.va?this:new Hf(this.s,this.ua?this.j:this.j+1,this.root,!0,c,null);a=new kf;b=(null==this.root?sf:this.root).Ba(0,oc(b),b,c,a);return b===this.root?this:new Hf(this.s,a.Ia?this.j+1:this.j,b,this.ua,this.va,null)};h.yb=function(a,b){return null==b?this.ua:null==this.root?!1:this.root.Oa(0,oc(b),b,md)!==md};h.S=function(){if(0<this.j){var a=null!=this.root?this.root.ob():null;return this.ua?O(new Q(null,2,5,$d,[null,this.va],null),a):a}return null};
h.M=function(a,b){return new Hf(b,this.j,this.root,this.ua,this.va,this.u)};h.R=function(a,b){if(id(b))return ob(this,D.b(b,0),D.b(b,1));for(var c=this,d=G(b);;){if(null==d)return c;var e=I(d);if(id(e))c=ob(c,D.b(e,0),D.b(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.L(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.L(null,c)};a.f=function(a,c,d){return this.I(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.a=function(a){return this.L(null,a)};h.b=function(a,b){return this.I(null,a,b)};var ad=new Hf(null,0,null,!1,null,Dc);Hf.prototype[Ta]=function(){return yc(this)};
function If(a,b,c,d,e){this.H=a;this.root=b;this.count=c;this.ua=d;this.va=e;this.i=258;this.A=56}function Jf(a,b,c){if(a.H){if(null==b)a.va!==c&&(a.va=c),a.ua||(a.count+=1,a.ua=!0);else{var d=new kf;b=(null==a.root?sf:a.root).Ca(a.H,0,oc(b),b,c,d);b!==a.root&&(a.root=b);d.Ia&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}h=If.prototype;h.V=function(){if(this.H)return this.count;throw Error("count after persistent!");};
h.L=function(a,b){return null==b?this.ua?this.va:null:null==this.root?null:this.root.Oa(0,oc(b),b)};h.I=function(a,b,c){return null==b?this.ua?this.va:c:null==this.root?c:this.root.Oa(0,oc(b),b,c)};
h.kb=function(a,b){var c;a:if(this.H)if(null!=b?b.i&2048||b.bc||(b.i?0:z(qb,b)):z(qb,b))c=Jf(this,gf.a?gf.a(b):gf.call(null,b),hf.a?hf.a(b):hf.call(null,b));else{c=G(b);for(var d=this;;){var e=I(c);if(y(e))c=J(c),d=Jf(d,gf.a?gf.a(e):gf.call(null,e),hf.a?hf.a(e):hf.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};h.lb=function(){var a;if(this.H)this.H=null,a=new Hf(null,this.count,this.root,this.ua,this.va,null);else throw Error("persistent! called twice");return a};
h.jb=function(a,b,c){return Jf(this,b,c)};var pe=function pe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return pe.m(0<c.length?new H(c.slice(0),0,null):null)};pe.m=function(a){for(var b=G(a),c=Ob(ad);;)if(b){a=J(J(b));var d=I(b),b=I(J(b)),c=Rb(c,d,b),b=a}else return Qb(c)};pe.F=0;pe.B=function(a){return pe.m(G(a))};function Kf(a,b){this.D=a;this.ya=b;this.i=32374988;this.A=0}h=Kf.prototype;h.toString=function(){return fc(this)};
h.equiv=function(a){return this.v(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.ya};h.qa=function(){var a=(null!=this.D?this.D.i&128||this.D.tb||(this.D.i?0:z(kb,this.D)):z(kb,this.D))?this.D.qa(null):J(this.D);return null==a?null:new Kf(a,this.ya)};h.J=function(){return Ac(this)};
h.v=function(a,b){return Qc(this,b)};h.la=function(a,b){return Tc(b,this)};h.ma=function(a,b,c){return Vc(b,c,this)};h.na=function(){return this.D.na(null).Db()};h.sa=function(){var a=(null!=this.D?this.D.i&128||this.D.tb||(this.D.i?0:z(kb,this.D)):z(kb,this.D))?this.D.qa(null):J(this.D);return null!=a?new Kf(a,this.ya):vc};h.S=function(){return this};h.M=function(a,b){return new Kf(this.D,b)};h.R=function(a,b){return O(b,this)};Kf.prototype[Ta]=function(){return yc(this)};
function cf(a){return(a=G(a))?new Kf(a,null):null}function gf(a){return rb(a)}function Lf(a,b){this.D=a;this.ya=b;this.i=32374988;this.A=0}h=Lf.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return L(this,a,0);case 2:return L(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a){return L(this,a,0)};a.b=function(a,c){return L(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return N(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return N(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=a;b.b=function(a,b){return N(this,a,b)};return b}();h.K=function(){return this.ya};h.qa=function(){var a=(null!=this.D?this.D.i&128||this.D.tb||(this.D.i?0:z(kb,this.D)):z(kb,this.D))?this.D.qa(null):J(this.D);return null==a?null:new Lf(a,this.ya)};h.J=function(){return Ac(this)};
h.v=function(a,b){return Qc(this,b)};h.la=function(a,b){return Tc(b,this)};h.ma=function(a,b,c){return Vc(b,c,this)};h.na=function(){return this.D.na(null).Eb()};h.sa=function(){var a=(null!=this.D?this.D.i&128||this.D.tb||(this.D.i?0:z(kb,this.D)):z(kb,this.D))?this.D.qa(null):J(this.D);return null!=a?new Lf(a,this.ya):vc};h.S=function(){return this};h.M=function(a,b){return new Lf(this.D,b)};h.R=function(a,b){return O(b,this)};Lf.prototype[Ta]=function(){return yc(this)};
function df(a){return(a=G(a))?new Lf(a,null):null}function hf(a){return sb(a)}function Mf(a){this.Hb=a}Mf.prototype.ta=function(){return this.Hb.ta()};Mf.prototype.next=function(){if(this.Hb.ta())return this.Hb.next().pa[0];throw Error("No such element");};Mf.prototype.remove=function(){return Error("Unsupported operation")};function Nf(a,b,c){this.s=a;this.Sa=b;this.u=c;this.i=15077647;this.A=8196}h=Nf.prototype;h.toString=function(){return fc(this)};h.equiv=function(a){return this.v(null,a)};
h.keys=function(){return yc(G(this))};h.entries=function(){return new Ze(G(G(this)))};h.values=function(){return yc(G(this))};h.has=function(a){return pd(this,a)};h.forEach=function(a){for(var b=G(this),c=null,d=0,e=0;;)if(e<d){var f=c.O(null,e),g=Zc(f,0,null),f=Zc(f,1,null);a.b?a.b(f,g):a.call(null,f,g);e+=1}else if(b=G(b))jd(b)?(c=Xb(b),b=Yb(b),g=c,d=M(c),c=g):(c=I(b),g=Zc(c,0,null),f=Zc(c,1,null),a.b?a.b(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};
h.L=function(a,b){return mb.f(this,b,null)};h.I=function(a,b,c){return nb(this.Sa,b)?b:c};h.Ja=function(){return new Mf(dc(this.Sa))};h.K=function(){return this.s};h.V=function(){return bb(this.Sa)};h.J=function(){var a=this.u;return null!=a?a:this.u=a=Cc(this)};h.v=function(a,b){return fd(b)&&M(this)===M(b)&&fe(function(a){return function(b){return pd(a,b)}}(this),b)};h.fb=function(){return new Of(Ob(this.Sa))};h.S=function(){return cf(this.Sa)};h.M=function(a,b){return new Nf(b,this.Sa,this.u)};
h.R=function(a,b){return new Nf(this.s,$c.f(this.Sa,b,null),null)};h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.L(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.L(null,c)};a.f=function(a,c,d){return this.I(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.a=function(a){return this.L(null,a)};h.b=function(a,b){return this.I(null,a,b)};
var Pf=new Nf(null,ee,Dc);function Qf(a){var b=a.length;if(b<=ff)for(var c=0,d=Ob(ee);;)if(c<b)var e=c+1,d=Rb(d,a[c],null),c=e;else return new Nf(null,Qb(d),null);else for(c=0,d=Ob(Pf);;)if(c<b)e=c+1,d=Pb(d,a[c]),c=e;else return Qb(d)}Nf.prototype[Ta]=function(){return yc(this)};function Of(a){this.Ma=a;this.A=136;this.i=259}h=Of.prototype;h.kb=function(a,b){this.Ma=Rb(this.Ma,b,null);return this};h.lb=function(){return new Nf(null,Qb(this.Ma),null)};h.V=function(){return M(this.Ma)};
h.L=function(a,b){return mb.f(this,b,null)};h.I=function(a,b,c){return mb.f(this.Ma,b,md)===md?c:b};h.call=function(){function a(a,b,c){return mb.f(this.Ma,b,md)===md?c:b}function b(a,b){return mb.f(this.Ma,b,md)===md?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.f=a;return c}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};
h.a=function(a){return mb.f(this.Ma,a,md)===md?null:a};h.b=function(a,b){return mb.f(this.Ma,a,md)===md?b:a};function Hd(a){if(null!=a&&(a.A&4096||a.dc))return a.hb(null);if("string"===typeof a)return a;throw Error([C("Doesn't support name: "),C(a)].join(""));}function Rf(a,b){return new Id(null,function(){var c=G(b);if(c){var d;d=I(c);d=a.a?a.a(d):a.call(null,d);c=y(d)?O(I(c),Rf(a,uc(c))):null}else c=null;return c},null,null)}
function Sf(a,b,c,d,e,f,g){var k=Ea;Ea=null==Ea?null:Ea-1;try{if(null!=Ea&&0>Ea)return Lb(a,"#");Lb(a,c);if(0===Na.a(f))G(g)&&Lb(a,function(){var a=Tf.a(f);return y(a)?a:"..."}());else{if(G(g)){var l=I(g);b.f?b.f(l,a,f):b.call(null,l,a,f)}for(var m=J(g),n=Na.a(f)-1;;)if(!m||null!=n&&0===n){G(m)&&0===n&&(Lb(a,d),Lb(a,function(){var a=Tf.a(f);return y(a)?a:"..."}()));break}else{Lb(a,d);var p=I(m);c=a;g=f;b.f?b.f(p,c,g):b.call(null,p,c,g);var q=J(m);c=n-1;m=q;n=c}}return Lb(a,e)}finally{Ea=k}}
function Uf(a,b){for(var c=G(b),d=null,e=0,f=0;;)if(f<e){var g=d.O(null,f);Lb(a,g);f+=1}else if(c=G(c))d=c,jd(d)?(c=Xb(d),e=Yb(d),d=c,g=M(c),c=e,e=g):(g=I(d),Lb(a,g),c=J(d),d=null,e=0),f=0;else return null}var Vf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Wf(a){return[C('"'),C(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Vf[a]})),C('"')].join("")}
function Xf(a,b){var c=od(sc.b(a,Ka));return c?(c=null!=b?b.i&131072||b.cc?!0:!1:!1)?null!=ed(b):c:c}
function Yf(a,b,c){if(null==a)return Lb(b,"nil");if(Xf(c,a)){Lb(b,"^");var d=ed(a);Zf.f?Zf.f(d,b,c):Zf.call(null,d,b,c);Lb(b," ")}if(a.Gb)return a.Qb(a,b,c);if(null!=a&&(a.i&2147483648||a.ka))return a.N(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Lb(b,""+C(a));if(null!=a&&a.constructor===Object)return Lb(b,"#js "),d=te.b(function(b){return new Q(null,2,5,$d,[Gd.a(b),a[b]],null)},kd(a)),$f.w?$f.w(d,Zf,b,c):$f.call(null,d,Zf,b,c);if(Pa(a))return Sf(b,Zf,"#js ["," ","]",c,a);if("string"==
typeof a)return y(Ja.a(c))?Lb(b,Wf(a)):Lb(b,a);if("function"==v(a)){var e=a.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Uf(b,Sc(["#object[",c,' "',""+C(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+C(a);;)if(M(c)<b)c=[C("0"),C(c)].join("");else return c},Uf(b,Sc(['#inst "',""+C(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",
c(a.getUTCMilliseconds(),3),"-",'00:00"'],0));if(a instanceof RegExp)return Uf(b,Sc(['#"',a.source,'"'],0));if(y(a.constructor.mb))return Uf(b,Sc(["#object[",a.constructor.mb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Uf(b,Sc(["#object[",c," ",""+C(a),"]"],0))}function Zf(a,b,c){var d=ag.a(c);return y(d)?(c=$c.f(c,bg,Yf),d.f?d.f(a,b,c):d.call(null,a,b,c)):Yf(a,b,c)}
function $f(a,b,c,d){return Sf(c,function(a,c,d){var k=rb(a);b.f?b.f(k,c,d):b.call(null,k,c,d);Lb(c," ");a=sb(a);return b.f?b.f(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,G(a))}H.prototype.ka=!0;H.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};Id.prototype.ka=!0;Id.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};Cf.prototype.ka=!0;Cf.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};af.prototype.ka=!0;
af.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};Ne.prototype.ka=!0;Ne.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};Ed.prototype.ka=!0;Ed.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};Pc.prototype.ka=!0;Pc.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};Hf.prototype.ka=!0;Hf.prototype.N=function(a,b,c){return $f(this,Zf,b,c)};Ef.prototype.ka=!0;Ef.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};
Re.prototype.ka=!0;Re.prototype.N=function(a,b,c){return Sf(b,Zf,"["," ","]",c,this)};Nf.prototype.ka=!0;Nf.prototype.N=function(a,b,c){return Sf(b,Zf,"#{"," ","}",c,this)};Md.prototype.ka=!0;Md.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};me.prototype.ka=!0;me.prototype.N=function(a,b,c){Lb(b,"#object [cljs.core.Atom ");Zf(new Ha(null,1,[cg,this.state],null),b,c);return Lb(b,"]")};Lf.prototype.ka=!0;Lf.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};
Q.prototype.ka=!0;Q.prototype.N=function(a,b,c){return Sf(b,Zf,"["," ","]",c,this)};Bd.prototype.ka=!0;Bd.prototype.N=function(a,b){return Lb(b,"()")};Ha.prototype.ka=!0;Ha.prototype.N=function(a,b,c){return $f(this,Zf,b,c)};Kf.prototype.ka=!0;Kf.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};Ad.prototype.ka=!0;Ad.prototype.N=function(a,b,c){return Sf(b,Zf,"("," ",")",c,this)};rc.prototype.eb=!0;
rc.prototype.Wa=function(a,b){if(b instanceof rc)return qc(this,b);throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};P.prototype.eb=!0;P.prototype.Wa=function(a,b){if(b instanceof P)return Fd(this,b);throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};Re.prototype.eb=!0;Re.prototype.Wa=function(a,b){if(id(b))return rd(this,b);throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};Q.prototype.eb=!0;
Q.prototype.Wa=function(a,b){if(id(b))return rd(this,b);throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};function dg(){}var fg=function fg(b){if(null!=b&&null!=b.Zb)return b.Zb(b);var c=fg[v(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=fg._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw B("IEncodeJS.-clj-\x3ejs",b);};
function gg(a){if(null!=a?a.Yb||(a.lc?0:z(dg,a)):z(dg,a))a=fg(a);else if("string"===typeof a||"number"===typeof a||a instanceof P||a instanceof rc)a=hg.a?hg.a(a):hg.call(null,a);else{var b=Sc([a],0);a=Ga();if(null==b||Qa(G(b)))a="";else{var c=C,d=new wa;a:{var e=new ec(d);Zf(I(b),e,a);for(var b=G(J(b)),f=null,g=0,k=0;;)if(k<g){var l=f.O(null,k);Lb(e," ");Zf(l,e,a);k+=1}else if(b=G(b))f=b,jd(f)?(b=Xb(f),g=Yb(f),f=b,l=M(b),b=g,g=l):(l=I(f),Lb(e," "),Zf(l,e,a),b=J(f),f=null,g=0),k=0;else break a}a=""+
c(d)}}return a}
var hg=function hg(b){if(null==b)return null;if(null!=b?b.Yb||(b.lc?0:z(dg,b)):z(dg,b))return fg(b);if(b instanceof P)return Hd(b);if(b instanceof rc)return""+C(b);if(hd(b)){var c={};b=G(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.O(null,f),k=Zc(g,0,null),g=Zc(g,1,null);c[gg(k)]=hg(g);f+=1}else if(b=G(b))jd(b)?(e=Xb(b),b=Yb(b),d=e,e=M(e)):(e=I(b),d=Zc(e,0,null),e=Zc(e,1,null),c[gg(d)]=hg(e),b=J(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.i&8||b.Ac||(b.i?0:z(cb,b)):z(cb,b)){c=[];
b=G(te.b(hg,b));d=null;for(f=e=0;;)if(f<e)k=d.O(null,f),c.push(k),f+=1;else if(b=G(b))d=b,jd(d)?(b=Xb(d),f=Yb(d),d=b,e=M(b),b=f):(b=I(d),c.push(b),b=J(d),d=null,e=0),f=0;else break;return c}return b},ig=null;function jg(){if(null==ig){var a=new Ha(null,3,[kg,ee,lg,ee,mg,ee],null);ig=oe?oe(a):ne.call(null,a)}return ig}
function ng(a,b,c){var d=wc.b(b,c);if(!d&&!(d=pd(mg.a(a).call(null,b),c))&&(d=id(c))&&(d=id(b)))if(d=M(c)===M(b))for(var d=!0,e=0;;)if(d&&e!==M(c))d=ng(a,b.a?b.a(e):b.call(null,e),c.a?c.a(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function og(a){var b;b=jg();b=K.a?K.a(b):K.call(null,b);a=sc.b(kg.a(b),a);return G(a)?a:null}function pg(a,b,c,d){se.b(a,function(){return K.a?K.a(b):K.call(null,b)});se.b(c,function(){return K.a?K.a(d):K.call(null,d)})}
var qg=function qg(b,c,d){var e=(K.a?K.a(d):K.call(null,d)).call(null,b),e=y(y(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(y(e))return e;e=function(){for(var e=og(c);;)if(0<M(e))qg(b,I(e),d),e=uc(e);else return null}();if(y(e))return e;e=function(){for(var e=og(b);;)if(0<M(e))qg(I(e),c,d),e=uc(e);else return null}();return y(e)?e:!1};function rg(a,b,c){c=qg(a,b,c);if(y(c))a=c;else{c=ng;var d;d=jg();d=K.a?K.a(d):K.call(null,d);a=c(d,a,b)}return a}
var sg=function sg(b,c,d,e,f,g,k){var l=Ya(function(e,g){var k=Zc(g,0,null);Zc(g,1,null);if(ng(K.a?K.a(d):K.call(null,d),c,k)){var l;l=(l=null==e)?l:rg(k,I(e),f);l=y(l)?g:e;if(!y(rg(I(l),k,f)))throw Error([C("Multiple methods in multimethod '"),C(b),C("' match dispatch value: "),C(c),C(" -\x3e "),C(k),C(" and "),C(I(l)),C(", and neither is preferred")].join(""));return l}return e},null,K.a?K.a(e):K.call(null,e));if(y(l)){if(wc.b(K.a?K.a(k):K.call(null,k),K.a?K.a(d):K.call(null,d)))return se.w(g,$c,
c,I(J(l))),I(J(l));pg(g,e,k,d);return sg(b,c,d,e,f,g,k)}return null};function T(a,b){throw Error([C("No method in multimethod '"),C(a),C("' for dispatch value: "),C(b)].join(""));}function tg(a,b,c,d,e,f,g,k){this.name=a;this.h=b;this.mc=c;this.nb=d;this.$a=e;this.vc=f;this.pb=g;this.bb=k;this.i=4194305;this.A=4352}h=tg.prototype;
h.call=function(){function a(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E,F,S){a=this;var ka=Yd(a.h,b,c,d,e,Sc([f,g,k,l,m,n,p,q,r,t,u,x,w,A,E,F,S],0)),eg=X(this,ka);y(eg)||T(a.name,ka);return Yd(eg,b,c,d,e,Sc([f,g,k,l,m,n,p,q,r,t,u,x,w,A,E,F,S],0))}function b(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E,F){a=this;var S=a.h.fa?a.h.fa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E,F):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E,F),ka=X(this,S);y(ka)||T(a.name,S);return ka.fa?ka.fa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,
x,w,A,E,F):ka.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E,F)}function c(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E){a=this;var F=a.h.ea?a.h.ea(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E),S=X(this,F);y(S)||T(a.name,F);return S.ea?S.ea(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E):S.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A,E)}function d(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A){a=this;var E=a.h.da?a.h.da(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A):a.h.call(null,
b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A),F=X(this,E);y(F)||T(a.name,E);return F.da?F.da(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A):F.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w,A)}function e(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w){a=this;var A=a.h.ca?a.h.ca(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w),E=X(this,A);y(E)||T(a.name,A);return E.ca?E.ca(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w):E.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,w)}function f(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,
x){a=this;var w=a.h.ba?a.h.ba(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x),A=X(this,w);y(A)||T(a.name,w);return A.ba?A.ba(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x):A.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x)}function g(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u){a=this;var x=a.h.aa?a.h.aa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u),w=X(this,x);y(w)||T(a.name,x);return w.aa?w.aa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,u):w.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u)}
function k(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){a=this;var u=a.h.$?a.h.$(b,c,d,e,f,g,k,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t),x=X(this,u);y(x)||T(a.name,u);return x.$?x.$(b,c,d,e,f,g,k,l,m,n,p,q,r,t):x.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,k,l,m,n,p,q,r){a=this;var t=a.h.Z?a.h.Z(b,c,d,e,f,g,k,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r),u=X(this,t);y(u)||T(a.name,t);return u.Z?u.Z(b,c,d,e,f,g,k,l,m,n,p,q,r):u.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r)}function m(a,
b,c,d,e,f,g,k,l,m,n,p,q){a=this;var r=a.h.Y?a.h.Y(b,c,d,e,f,g,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q),t=X(this,r);y(t)||T(a.name,r);return t.Y?t.Y(b,c,d,e,f,g,k,l,m,n,p,q):t.call(null,b,c,d,e,f,g,k,l,m,n,p,q)}function n(a,b,c,d,e,f,g,k,l,m,n,p){a=this;var q=a.h.X?a.h.X(b,c,d,e,f,g,k,l,m,n,p):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p),r=X(this,q);y(r)||T(a.name,q);return r.X?r.X(b,c,d,e,f,g,k,l,m,n,p):r.call(null,b,c,d,e,f,g,k,l,m,n,p)}function p(a,b,c,d,e,f,g,k,l,m,n){a=this;var p=a.h.W?a.h.W(b,
c,d,e,f,g,k,l,m,n):a.h.call(null,b,c,d,e,f,g,k,l,m,n),q=X(this,p);y(q)||T(a.name,p);return q.W?q.W(b,c,d,e,f,g,k,l,m,n):q.call(null,b,c,d,e,f,g,k,l,m,n)}function q(a,b,c,d,e,f,g,k,l,m){a=this;var n=a.h.ja?a.h.ja(b,c,d,e,f,g,k,l,m):a.h.call(null,b,c,d,e,f,g,k,l,m),p=X(this,n);y(p)||T(a.name,n);return p.ja?p.ja(b,c,d,e,f,g,k,l,m):p.call(null,b,c,d,e,f,g,k,l,m)}function r(a,b,c,d,e,f,g,k,l){a=this;var m=a.h.ia?a.h.ia(b,c,d,e,f,g,k,l):a.h.call(null,b,c,d,e,f,g,k,l),n=X(this,m);y(n)||T(a.name,m);return n.ia?
n.ia(b,c,d,e,f,g,k,l):n.call(null,b,c,d,e,f,g,k,l)}function t(a,b,c,d,e,f,g,k){a=this;var l=a.h.ha?a.h.ha(b,c,d,e,f,g,k):a.h.call(null,b,c,d,e,f,g,k),m=X(this,l);y(m)||T(a.name,l);return m.ha?m.ha(b,c,d,e,f,g,k):m.call(null,b,c,d,e,f,g,k)}function u(a,b,c,d,e,f,g){a=this;var k=a.h.ga?a.h.ga(b,c,d,e,f,g):a.h.call(null,b,c,d,e,f,g),l=X(this,k);y(l)||T(a.name,k);return l.ga?l.ga(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function x(a,b,c,d,e,f){a=this;var g=a.h.G?a.h.G(b,c,d,e,f):a.h.call(null,b,c,d,e,f),
k=X(this,g);y(k)||T(a.name,g);return k.G?k.G(b,c,d,e,f):k.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;var f=a.h.w?a.h.w(b,c,d,e):a.h.call(null,b,c,d,e),g=X(this,f);y(g)||T(a.name,f);return g.w?g.w(b,c,d,e):g.call(null,b,c,d,e)}function E(a,b,c,d){a=this;var e=a.h.f?a.h.f(b,c,d):a.h.call(null,b,c,d),f=X(this,e);y(f)||T(a.name,e);return f.f?f.f(b,c,d):f.call(null,b,c,d)}function F(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=X(this,d);y(e)||T(a.name,d);return e.b?e.b(b,c):e.call(null,
b,c)}function S(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=X(this,c);y(d)||T(a.name,c);return d.a?d.a(b):d.call(null,b)}function ka(a){a=this;var b=a.h.o?a.h.o():a.h.call(null),c=X(this,b);y(c)||T(a.name,b);return c.o?c.o():c.call(null)}var w=null,w=function(w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab,La,Ra,Za,ib,db,Wb,Ic,ge){switch(arguments.length){case 1:return ka.call(this,w);case 2:return S.call(this,w,R);case 3:return F.call(this,w,R,U);case 4:return E.call(this,w,R,U,V);case 5:return A.call(this,
w,R,U,V,Y);case 6:return x.call(this,w,R,U,V,Y,W);case 7:return u.call(this,w,R,U,V,Y,W,ba);case 8:return t.call(this,w,R,U,V,Y,W,ba,da);case 9:return r.call(this,w,R,U,V,Y,W,ba,da,ha);case 10:return q.call(this,w,R,U,V,Y,W,ba,da,ha,ja);case 11:return p.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na);case 12:return n.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa);case 13:return m.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za);case 14:return l.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab);case 15:return k.call(this,
w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab,La);case 16:return g.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab,La,Ra);case 17:return f.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab,La,Ra,Za);case 18:return e.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab,La,Ra,Za,ib);case 19:return d.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab,La,Ra,Za,ib,db);case 20:return c.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab,La,Ra,Za,ib,db,Wb);case 21:return b.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab,La,Ra,Za,ib,db,Wb,
Ic);case 22:return a.call(this,w,R,U,V,Y,W,ba,da,ha,ja,na,sa,za,Ab,La,Ra,Za,ib,db,Wb,Ic,ge)}throw Error("Invalid arity: "+arguments.length);};w.a=ka;w.b=S;w.f=F;w.w=E;w.G=A;w.ga=x;w.ha=u;w.ia=t;w.ja=r;w.W=q;w.X=p;w.Y=n;w.Z=m;w.$=l;w.aa=k;w.ba=g;w.ca=f;w.da=e;w.ea=d;w.fa=c;w.Cb=b;w.gb=a;return w}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};h.o=function(){var a=this.h.o?this.h.o():this.h.call(null),b=X(this,a);y(b)||T(this.name,a);return b.o?b.o():b.call(null)};
h.a=function(a){var b=this.h.a?this.h.a(a):this.h.call(null,a),c=X(this,b);y(c)||T(this.name,b);return c.a?c.a(a):c.call(null,a)};h.b=function(a,b){var c=this.h.b?this.h.b(a,b):this.h.call(null,a,b),d=X(this,c);y(d)||T(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};h.f=function(a,b,c){var d=this.h.f?this.h.f(a,b,c):this.h.call(null,a,b,c),e=X(this,d);y(e)||T(this.name,d);return e.f?e.f(a,b,c):e.call(null,a,b,c)};
h.w=function(a,b,c,d){var e=this.h.w?this.h.w(a,b,c,d):this.h.call(null,a,b,c,d),f=X(this,e);y(f)||T(this.name,e);return f.w?f.w(a,b,c,d):f.call(null,a,b,c,d)};h.G=function(a,b,c,d,e){var f=this.h.G?this.h.G(a,b,c,d,e):this.h.call(null,a,b,c,d,e),g=X(this,f);y(g)||T(this.name,f);return g.G?g.G(a,b,c,d,e):g.call(null,a,b,c,d,e)};
h.ga=function(a,b,c,d,e,f){var g=this.h.ga?this.h.ga(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f),k=X(this,g);y(k)||T(this.name,g);return k.ga?k.ga(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};h.ha=function(a,b,c,d,e,f,g){var k=this.h.ha?this.h.ha(a,b,c,d,e,f,g):this.h.call(null,a,b,c,d,e,f,g),l=X(this,k);y(l)||T(this.name,k);return l.ha?l.ha(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
h.ia=function(a,b,c,d,e,f,g,k){var l=this.h.ia?this.h.ia(a,b,c,d,e,f,g,k):this.h.call(null,a,b,c,d,e,f,g,k),m=X(this,l);y(m)||T(this.name,l);return m.ia?m.ia(a,b,c,d,e,f,g,k):m.call(null,a,b,c,d,e,f,g,k)};h.ja=function(a,b,c,d,e,f,g,k,l){var m=this.h.ja?this.h.ja(a,b,c,d,e,f,g,k,l):this.h.call(null,a,b,c,d,e,f,g,k,l),n=X(this,m);y(n)||T(this.name,m);return n.ja?n.ja(a,b,c,d,e,f,g,k,l):n.call(null,a,b,c,d,e,f,g,k,l)};
h.W=function(a,b,c,d,e,f,g,k,l,m){var n=this.h.W?this.h.W(a,b,c,d,e,f,g,k,l,m):this.h.call(null,a,b,c,d,e,f,g,k,l,m),p=X(this,n);y(p)||T(this.name,n);return p.W?p.W(a,b,c,d,e,f,g,k,l,m):p.call(null,a,b,c,d,e,f,g,k,l,m)};h.X=function(a,b,c,d,e,f,g,k,l,m,n){var p=this.h.X?this.h.X(a,b,c,d,e,f,g,k,l,m,n):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n),q=X(this,p);y(q)||T(this.name,p);return q.X?q.X(a,b,c,d,e,f,g,k,l,m,n):q.call(null,a,b,c,d,e,f,g,k,l,m,n)};
h.Y=function(a,b,c,d,e,f,g,k,l,m,n,p){var q=this.h.Y?this.h.Y(a,b,c,d,e,f,g,k,l,m,n,p):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,p),r=X(this,q);y(r)||T(this.name,q);return r.Y?r.Y(a,b,c,d,e,f,g,k,l,m,n,p):r.call(null,a,b,c,d,e,f,g,k,l,m,n,p)};h.Z=function(a,b,c,d,e,f,g,k,l,m,n,p,q){var r=this.h.Z?this.h.Z(a,b,c,d,e,f,g,k,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q),t=X(this,r);y(t)||T(this.name,r);return t.Z?t.Z(a,b,c,d,e,f,g,k,l,m,n,p,q):t.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q)};
h.$=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r){var t=this.h.$?this.h.$(a,b,c,d,e,f,g,k,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r),u=X(this,t);y(u)||T(this.name,t);return u.$?u.$(a,b,c,d,e,f,g,k,l,m,n,p,q,r):u.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r)};
h.aa=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){var u=this.h.aa?this.h.aa(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t),x=X(this,u);y(x)||T(this.name,u);return x.aa?x.aa(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t):x.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t)};
h.ba=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u){var x=this.h.ba?this.h.ba(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u),A=X(this,x);y(A)||T(this.name,x);return A.ba?A.ba(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u):A.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u)};
h.ca=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x){var A=this.h.ca?this.h.ca(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x),E=X(this,A);y(E)||T(this.name,A);return E.ca?E.ca(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x):E.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x)};
h.da=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A){var E=this.h.da?this.h.da(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A),F=X(this,E);y(F)||T(this.name,E);return F.da?F.da(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A):F.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A)};
h.ea=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E){var F=this.h.ea?this.h.ea(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E),S=X(this,F);y(S)||T(this.name,F);return S.ea?S.ea(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E):S.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E)};
h.fa=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F){var S=this.h.fa?this.h.fa(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F),ka=X(this,S);y(ka)||T(this.name,S);return ka.fa?ka.fa(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F):ka.call(null,a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F)};
h.Cb=function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S){var ka=Yd(this.h,a,b,c,d,Sc([e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S],0)),w=X(this,ka);y(w)||T(this.name,ka);return Yd(w,a,b,c,d,Sc([e,f,g,k,l,m,n,p,q,r,t,u,x,A,E,F,S],0))};
function X(a,b){wc.b(K.a?K.a(a.bb):K.call(null,a.bb),K.a?K.a(a.nb):K.call(null,a.nb))||pg(a.pb,a.$a,a.bb,a.nb);var c=(K.a?K.a(a.pb):K.call(null,a.pb)).call(null,b);if(y(c))return c;c=sg(a.name,b,a.nb,a.$a,a.vc,a.pb,a.bb);return y(c)?c:(K.a?K.a(a.$a):K.call(null,a.$a)).call(null,a.mc)}h.hb=function(){return $b(this.name)};h.ib=function(){return ac(this.name)};h.J=function(){return this[aa]||(this[aa]=++ca)};var ug=new P(null,"aside","aside",1414397537),vg=new rc(null,"meta13873","meta13873",595154178,null),wg=new P(null,"onkeyup","onkeyup",1815272291),Ka=new P(null,"meta","meta",1499536964),de=new rc(null,"meta10485","meta10485",-1656503131,null),xg=new rc(null,"blockable","blockable",-28395259,null),Ma=new P(null,"dup","dup",556298533),yg=new P(null,"verb","verb",-1492655803),zg=new P(null,"placeholder","placeholder",-104873083),qe=new P(null,"validator","validator",-1966190681),Ag=new P(null,"default",
"default",-1987822328),Bg=new P(null,"generate","generate",-163452822),Cg=new P(null,"mnemonics","mnemonics",-1373900278),Dg=new P(null,"adjective","adjective",441465450),Eg=new P("peg.core","START","peg.core/START",-569106293),cg=new P(null,"val","val",128701612),bg=new P(null,"fallback-impl","fallback-impl",-1501286995),Ia=new P(null,"flush-on-newline","flush-on-newline",-151457939),lg=new P(null,"descendants","descendants",1824886031),mg=new P(null,"ancestors","ancestors",-776045424),Fg=new P(null,
"div","div",1057191632),Ja=new P(null,"readably","readably",1129599760),Tf=new P(null,"more-marker","more-marker",-14717935),Gg=new P("peg.core","END","peg.core/END",1745579474),Na=new P(null,"print-length","print-length",1931866356),kg=new P(null,"parents","parents",-2027538891),Hg=new P(null,"svg","svg",856789142),Ig=new P(null,"rerender","rerender",-1601192263),Jg=new P(null,"input","input",556931961),ce=new rc(null,"quote","quote",1377916282,null),be=new P(null,"arglists","arglists",1661989754),
ae=new rc(null,"nil-iter","nil-iter",1101030523,null),Kg=new P(null,"main","main",-2117802661),Lg=new P(null,"hierarchy","hierarchy",-1053470341),ag=new P(null,"alt-impl","alt-impl",670969595),Mg=new P(null,"noun","noun",185846460),Ng=new P(null,"href","href",-793805698),Og=new P(null,"a","a",-2123407586),Pg=new P(null,"foreignObject","foreignObject",25502111),Qg=new rc(null,"f","f",43394975,null);var Rg;if("undefined"===typeof Sg)var Sg={};for(var Tg=Array(1),Ug=0;;)if(Ug<Tg.length)Tg[Ug]=null,Ug+=1;else break;(function(a){"undefined"===typeof Rg&&(Rg=function(a,c,d){this.nc=a;this.Ub=c;this.sc=d;this.i=393216;this.A=0},Rg.prototype.M=function(a,c){return new Rg(this.nc,this.Ub,c)},Rg.prototype.K=function(){return this.sc},Rg.oc=function(){return new Q(null,3,5,$d,[Qg,xg,vg],null)},Rg.Gb=!0,Rg.mb="cljs.core.async/t_cljs$core$async13872",Rg.Qb=function(a,c){return Lb(c,"cljs.core.async/t_cljs$core$async13872")});return new Rg(a,!0,ee)})(function(){return null});var Vg=VDOM.diff,Wg=VDOM.patch,Xg=VDOM.create;function Yg(a){return ve(he(Oa),ve(he(nd),we(a)))}function Zg(a,b,c){return new VDOM.VHtml(Hd(a),hg(b),hg(c))}function $g(a,b,c){return new VDOM.VSvg(Hd(a),hg(b),hg(c))}
var ah=function ah(b){if(null==b)return new VDOM.VText("");if(y(VDOM.isVirtualNode(b)))return b;if(nd(b))return Zg(Fg,ee,te.b(ah,Yg(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(wc.b(Hg,I(b)))return bh.a?bh.a(b):bh.call(null,b);var c=G(b);b=I(c);var d=J(c),c=I(d),d=J(d);return Zg(b,c,te.b(ah,Yg(d)))},bh=function bh(b){if(null==b)return new VDOM.VText("");if(y(VDOM.isVirtualNode(b)))return b;if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(wc.b(Pg,
I(b))){var c=G(b);b=I(c);var c=J(c),d=I(c),c=J(c);return $g(b,d,te.b(ah,Yg(c)))}c=G(b);b=I(c);c=J(c);d=I(c);c=J(c);return $g(b,d,te.b(bh,Yg(c)))};
function ch(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return oe?oe(a):ne.call(null,a)}(),c=function(){var a;a=K.a?K.a(b):K.call(null,b);a=Xg.a?Xg.a(a):Xg.call(null,a);return oe?oe(a):ne.call(null,a)}(),d=function(){var a=window.requestAnimationFrame;return y(a)?function(a){return function(b){return a.a?a.a(b):a.call(null,b)}}(a,a,b,c):function(){return function(a){return a.o?a.o():a.call(null)}}(a,b,c)}();a.appendChild(K.a?K.a(c):K.call(null,c));return function(a,
b,c){return function(d){var l=ah(d);d=function(){var b=K.a?K.a(a):K.call(null,a);return Vg.b?Vg.b(b,l):Vg.call(null,b,l)}();re.b?re.b(a,l):re.call(null,a,l);d=function(a,b,c,d){return function(){return se.f(d,Wg,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};Ca=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new H(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Xa?Wa(a):Va.call(null,a))}a.F=0;a.B=function(a){a=G(a);return b(a)};a.m=b;return a}();
Da=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new H(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Xa?Wa(a):Va.call(null,a))}a.F=0;a.B=function(a){a=G(a);return b(a)};a.m=b;return a}();function Z(a,b,c,d){return new Q(null,3,5,$d,[new Q(null,3,5,$d,[a,Mg,b],null),new Q(null,3,5,$d,[a,yg,c],null),new Q(null,3,5,$d,[a,Dg,d],null)],null)}
for(var le=Rd.m(Z("0","hose","sew","easy"),Z("1","hat","hate","hot"),Sc([Z("2","hen","know","new"),Z("3","home","aim","yummy"),Z("4","arrow","row","hairy"),Z("5","whale","heal","oily"),Z("6","shoe","chew","itchy"),Z("7","cow","hook","coy"),Z("8","hoof","weave","heavy"),Z("9","pie","buy","happy"),Z("00","sauce","assess","sissy"),Z("01","seed","swat","sad"),Z("02","sun","assign","snowy"),Z("03","sumo","assume","awesome"),Z("04","sierra","sorrow","sorry"),Z("05","soil","sell","slow"),Z("06","sewage",
"switch","swishy"),Z("07","sky","soak","sick"),Z("08","sofa","save","savvy"),Z("09","soap","sob","sappy"),Z("10","daisy","tease","dizzy"),Z("11","tattoo","edit","tight"),Z("12","tuna","widen","wooden"),Z("13","dome","time","tame"),Z("14","diary","draw","dry"),Z("15","tail","tell","tall"),Z("16","dish","teach","whitish"),Z("17","dog","take","thick"),Z("18","dove","defy","deaf"),Z("19","tuba","type","deep"),Z("20","nose","ionize","noisy"),Z("21","net","unite","neat"),Z("22","onion","nanny","neon"),
Z("23","enemy","name","numb"),Z("24","winery","honor","narrow"),Z("25","nail","inhale","annual"),Z("26","nacho","enjoy","nudgy"),Z("27","neck","knock","naggy"),Z("28","knife","envy","naive"),Z("29","honeybee","nab","wannabe"),Z("30","mouse","amuse","messy"),Z("31","meadow","meet","mute"),Z("32","moon","mine","mean"),Z("33","mummy","mime","mum"),Z("34","emery","marry","merry"),Z("35","mole","mail","male"),Z("36","match","mash","mushy"),Z("37","mug","mock","mucky"),Z("38","movie","move","mauve"),Z("39",
"map","mop","wimpy"),Z("40","rice","erase","rosy"),Z("41","road","read","ready"),Z("42","urine","ruin","runny"),Z("43","rum","ram","haram"),Z("44","aurora","rear","rare"),Z("45","railway","rule","royal"),Z("46","roach","reach","rich"),Z("47","rag","rake","rocky"),Z("48","roof","arrive","rough"),Z("49","rope","wrap","ripe"),Z("50","louse","lose","lazy"),Z("51","lady","let","elite"),Z("52","lion","align","alien"),Z("53","lime","loom","lame"),Z("54","lorry","lure","leery"),Z("55","lily","lull","loyal"),
Z("56","leech","latch","yellowish"),Z("57","leg","lick","lucky"),Z("58","lava","love","leafy"),Z("59","lip","help","loopy"),Z("60","cheese","chase","choosy"),Z("61","cheetah","cheat","chatty"),Z("62","chin","chain","shiny"),Z("63","gem","jam","sham"),Z("64","shrew","jury","cherry"),Z("65","chilli","chill","jolly"),Z("66","cha-cha","judge","Jewish"),Z("67","chick","check","shaky"),Z("68","chef","achieve","chief"),Z("69","jeep","chop","cheap"),Z("70","goose","kiss","cosy"),Z("71","cat","quote","good"),
Z("72","coin","weaken","keen"),Z("73","game","comb","gummy"),Z("74","crow","carry","grey"),Z("75","clay","kill","cool"),Z("76","cage","coach","catchy"),Z("77","cake","cook","quick"),Z("78","cave","give","goofy"),Z("79","cube","copy","agape"),Z("80","vase","fuse","fussy"),Z("81","video","fight","fat"),Z("82","fan","fine","funny"),Z("83","ovum","fume","foamy"),Z("84","fairy","fry","furry"),Z("85","fool","fly","foul"),Z("86","veggie","fetch","fishy"),Z("87","fig","fake","foggy"),Z("88","fife","viva",
"fave"),Z("89","vibe","fob","fab"),Z("90","boss","oppose","busy"),Z("91","bead","bite","bad"),Z("92","pony","ban","bony"),Z("93","puma","bomb","balmy"),Z("94","berry","bury","pro"),Z("95","bell","peel","blue"),Z("96","pouch","patch","bushy"),Z("97","bike","poke","back"),Z("98","Biff","pave","puffy"),Z("99","pipe","pop","baby")],0)),dh,eh=[Eg,new Nf(null,new Ha(null,2,[Dg,null,Mg,null],null),null),Mg,Qf([yg,Gg]),yg,Qf([Dg,Gg,Mg]),Dg,new Nf(null,new Ha(null,1,[Mg,null],null),null)],fh=[],gh=0;;)if(gh<
eh.length){var hh=eh[gh],ih=eh[gh+1];-1===$e(fh,hh)&&(fh.push(hh),fh.push(ih));gh+=2}else break;dh=new Ha(null,fh.length/2,fh,null);
var jh=function jh(b,c,d){return/^[\s\xa0]*$/.test(null==b?"":String(b))?y((c.a?c.a(Eg):c.call(null,Eg)).call(null,Gg))?new Q(null,1,5,$d,[null],null):null:function f(g){return new Id(null,function(){for(var k=g;;){var l=G(k);if(l){var m=l,n=I(m);if(l=G(function(b,f,g,k){return function x(l){return new Id(null,function(b,f,g,k){return function(){for(var m=l;;){var n=G(m);if(n){var p=n,q=I(p),r=Zc(q,0,null),t=Zc(q,1,null),W=Zc(q,2,null);if(n=G(function(b,c,d,f,g,k,l,m,n,p,q){return function db(r){return new Id(null,
function(b,c,d,f){return function(){for(;;){var b=G(r);if(b){if(jd(b)){var c=Xb(b),d=M(c),g=new Kd(Array(d),0);a:for(var k=0;;)if(k<d){var l=D.b(c,k),l=O(f,l);g.add(l);k+=1}else{c=!0;break a}return c?Nd(g.wa(),db(Yb(b))):Nd(g.wa(),null)}g=I(b);return O(O(f,g),db(uc(b)))}return null}}}(b,c,d,f,g,k,l,m,n,p,q),null,null)}}(m,b,q,r,t,W,p,n,f,g,k)(jh(W,$c.f(c,Eg,c.a?c.a(f):c.call(null,f)),d))))return Rd.b(n,x(uc(m)));m=uc(m)}else return null}}}(b,f,g,k),null,null)}}(k,n,m,l)(d.b?d.b(b,n):d.call(null,b,
n))))return Rd.b(l,f(uc(k)));k=uc(k)}else return null}},null,null)}(c.a?c.a(Eg):c.call(null,Eg))};function ke(a,b,c){return xe(Xc,ie.b(ue(function(a){var e=Zc(a,0,null),f=Zc(a,1,null);Zc(a,2,null);return wc.b(c,f)&&0==b.lastIndexOf(e,0)}),te.a(function(a){var c=Zc(a,0,null),f=Zc(a,1,null);a=Zc(a,2,null);return new Q(null,3,5,$d,[a,f,b.replace(c,"")],null)})),a)}
function kh(){var a=lh,b=K.a?K.a(mh):K.call(null,mh);return new Q(null,4,5,$d,[Kg,ee,new Q(null,2,5,$d,[Jg,new Ha(null,2,[zg,"Number",wg,function(b){b=b.target.value;return a.b?a.b(Bg,b):a.call(null,Bg,b)}],null)],null),new Q(null,4,5,$d,[Fg,ee,new Q(null,5,5,$d,[ug,ee,"To translate the following phrases back into numbers, see ",new Q(null,3,5,$d,[Og,new Ha(null,1,[Ng,"https://en.wikipedia.org/wiki/Mnemonic_major_system"],null),"this Wikipedia article"],null),"."],null),function(){return function d(a){return new Id(null,
function(){for(;;){var b=G(a);if(b){if(jd(b)){var g=Xb(b),k=M(g),l=new Kd(Array(k),0);a:for(var m=0;;)if(m<k){var n=D.b(g,m);l.add(new Q(null,3,5,$d,[Fg,ee,n],null));m+=1}else{g=!0;break a}return g?Nd(l.wa(),d(Yb(b))):Nd(l.wa(),null)}l=I(b);return O(new Q(null,3,5,$d,[Fg,ee,l],null),d(uc(b)))}return null}},null,null)}(Cg.a(b))}()],null)],null)}if("undefined"===typeof mh)var mh=oe?oe(ee):ne.call(null,ee);
if("undefined"===typeof lh)var lh=function(){var a=oe?oe(ee):ne.call(null,ee),b=oe?oe(ee):ne.call(null,ee),c=oe?oe(ee):ne.call(null,ee),d=oe?oe(ee):ne.call(null,ee),e=sc.f(ee,Lg,jg());return new tg(tc.b("peg.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.F=1;a.B=function(a){var b=I(a);uc(a);return b};a.m=function(a){return a};return a}()}(a,b,c,d,e),Ag,e,a,b,c,d)}();var nh=lh;
se.w(nh.$a,$c,Bg,function(a,b){return se.w(mh,$c,Cg,function(){var a=je(),d=jh(b,dh,a),e=vd(d),f=Rf(function(a,b,c,d){return function(a){return wc.b(M(a),M(I(d)))}}(le,a,d,e),e);return te.b(function(){return function(a){var b;a:for(b=new wa,a=G(a);;)if(null!=a)b.append(""+C(I(a))),a=J(a),null!=a&&b.append(" ");else{b=b.toString();break a}return b}}(le,a,d,e,f),f)}())});pg(nh.pb,nh.$a,nh.bb,nh.nb);
if("undefined"===typeof oh)var oh=function(){return function(a){return function(){var b=kh();return a.a?a.a(b):a.call(null,b)}}(ch())}();if("undefined"===typeof ph){var ph,qh=mh;Nb(qh,Ig,function(a,b,c,d){return oh.a?oh.a(d):oh.call(null,d)});ph=qh}var rh=K.a?K.a(mh):K.call(null,mh);oh.a?oh.a(rh):oh.call(null,rh);