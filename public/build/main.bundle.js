/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!./base.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!./base.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Lato:300,400,700|Roboto:100,300,400,500|Yanone+Kaffeesatz:700|Merriweather:400,700);", ""]);

// module
exports.push([module.i, "html {\n  color: #222;\n  font-size: 1em;\n  line-height: 1.4;\n  height: 100%;\n  width: 100%;\n}\nbody{\n  height: 100%;\n  width: 100%;\n  background: #F5F5F5;\n}\n.loading-wrapper{\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.main-wrapper{\n  height: 100%;\n  width: 100%;\n  margin-bottom: 100px;\n}\n.header-wrapper{\n  height: auto;\n  width: 100%;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  position: fixed;\n  top: 0;\n  left: 0;\n  padding: 10px 0px;\n  background: #FFF;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n    -webkit-box-shadow: 0px 0px 20px 2px #e9e9e9;\n            box-shadow: 0px 0px 20px 2px #e9e9e9;\n    z-index: 9999999;\n}\n.logo-container{\n  -webkit-box-flex: 4;\n      -ms-flex: 4;\n          flex: 4;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-justify-content: center;\n  -moz-justify-content: center;\n  -o-justify-content: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.logo-image{\n  max-width: 125px;\n  height: auto;\n  margin: auto;\n}\n.logo-mobile{\n  display: none;\n}\n/*Nav Styles*/\n.navigation-container{\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 6;\n      -ms-flex: 6;\n          flex: 6;\n  -ms-justify-content: flex-end;\n  -moz-justify-content: flex-end;\n  -o-justify-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.nav-ul{\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n}\n.nav-ul li{\n  font-family: 'Lato',sans-serif;\n  font-size: 0.8em;\n  color: #000;\n  list-style-type: none;\n  padding: 0 15px;\n  font-weight: 800;\n  letter-spacing: 2px;;\n}\n.active{\n  color: #6173b3 !important;\n}\n.nav-ul li a{\n  color: inherit;\n  text-decoration: none;\n}\n.nav-ul li a:hover{\n    color: #6173b3 !important;\n}\n.mobile-menu{\n  font-size: 1.5em;\n  font-weight: bold;\n  font-family: 'Lato',sans-serif;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex:5;\n      -ms-flex:5;\n          flex:5;\n  -webkit-box-align: end;\n      -ms-flex-align: end;\n          align-items: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  text-align: right;\n  padding: 0 25px;\n  -ms-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.mobile-header-container{\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex:5;\n      -ms-flex:5;\n          flex:5;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n/*End of Nav Styles*/\n.user-icon-container{\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: flex-start;\n      -ms-flex-align: flex-start;\n          align-items: flex-start;\n  -ms-justify-content: flex-start;\n  -moz-justify-content: flex-start;\n  -o-justify-content: flex-start;\n  -webkit-box-pack: flex-start;\n      -ms-flex-pack: flex-start;\n          justify-content: flex-start;\n  -webkit-box-flex:2;\n      -ms-flex:2;\n          flex:2;\n          padding: 0 20px;\n}\n.user-icon{\n  width: 35px;\n  height: 35px;\n  border: 5px solid #e8e8e8;\n  border-radius: 100%;\n  background-image: url(" + __webpack_require__(4) + ");\n  background-size: cover;\n  position: relative;\n  cursor: pointer;\n  -webkit-transition: all 1s ease-in-out;\n  transition: all 1s ease-in-out;\n}\n.user-icon:hover{\n  border-color: #5658a5;\n}\n.notification-counter{\n  position: absolute;\n  top: -7px;\n  right: -5px;\n  width: 20px;\n  height: 20px;\n  margin: auto;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-justify-content: center;\n  -moz-justify-content: center;\n  -o-justify-content: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  font-size: 0.7em;\n  font-weight: 500;\n  font-family: 'Lato',sans-serif;\n  color: #FFF;\n  border-radius: 100%;\n  background: #5658a5; /*For browsers which do not support gradients*/ /* For Safari 5.1 to 6.0 */ /* For Opera 11.1 to 12.0 */ /* For Firefox 3.6 to 15 */\n  background: -webkit-gradient(linear, left top, right top, from(#5658a5) , to(#3297cb));\n  background: linear-gradient(to right, #5658a5 , #3297cb); /* Standard syntax (must be last) */\n}\n/*Header styles end*/\n.mobile-item{\n  display: none;\n}\n\n.hidden {\n  display: none !important;\n}\n\n@media (max-width: 850px){\n  .mobile-item{\n    display: block !important;\n  }\n  .desktop-item{\n    display: none;\n  }\n  .logo-container{\n    -webkit-box-flex: 5;\n        -ms-flex: 5;\n            flex: 5;\n  }\n  .header-wrapper{\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n  }\n  /* Nav */\n.mobile-header-container{\n  width: 100%;\n}\n  .navigation-container{\n    -webkit-box-flex: 5;\n        -ms-flex: 5;\n            flex: 5;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n  }\n  .nav-ul{\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -webkit-box-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n    width: 100%;\n    padding: 0;\n  }\n  .nav-ul li{\n    padding: 10px;\n    text-align: center;\n  }\n  /*End of Nav*/\n}\n\n/* ==========================================================================\nBase styles: opinionated defaults\n========================================================================== */\n\n\n::-moz-selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n::selection {\n  background: #b3d4fc;\n  text-shadow: none;\n}\n\n/*\n* A better looking default horizontal rule\n*/\n\nhr {\n  display: block;\n  height: 1px;\n  border: 0;\n  border-top: 1px solid #ccc;\n  margin: 1em 0;\n  padding: 0;\n}\n\n/*\n* Remove the gap between audio, canvas, iframes,\n* images, videos and the bottom of their containers:\n* https://github.com/h5bp/html5-boilerplate/issues/440\n*/\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n\n/*\n* Remove default fieldset styles.\n*/\n\nfieldset {\n  border: 0;\n  margin: 0;\n  padding: 0;\n}\n\n/*\n* Allow only vertical resizing of textareas.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n\n\n\n/* ==========================================================================\nHelper classes\n========================================================================== */\n\n\n.visuallyhidden {\n  border: 0;\n  clip: rect(0 0 0 0);\n  -webkit-clip-path: inset(50%);\n  clip-path: inset(50%);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n  white-space: nowrap; /* 1 */\n}\n\n/*\n* Extends the .visuallyhidden class to allow the element\n* to be focusable when navigated to via the keyboard:\n* https://www.drupal.org/node/897638\n*/\n\n.visuallyhidden.focusable:active,\n.visuallyhidden.focusable:focus {\n  clip: auto;\n  -webkit-clip-path: none;\n  clip-path: none;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto;\n  white-space: inherit;\n}\n\n/*\n* Hide visually and from screen readers, but maintain layout\n*/\n\n.invisible {\n  visibility: hidden;\n}\n\n/*\n* Clearfix: contain floats\n*\n* For modern browsers\n* 1. The space content is one way to avoid an Opera bug when the\n*    `contenteditable` attribute is included anywhere else in the document.\n*    Otherwise it causes space to appear at the top and bottom of elements\n*    that receive the `clearfix` class.\n* 2. The use of `table` rather than `block` is only necessary if using\n*    `:before` to contain the top-margins of child elements.\n*/\n\n.clearfix:before,\n.clearfix:after {\n  content: \" \"; /* 1 */\n  display: table; /* 2 */\n}\n\n.clearfix:after {\n  clear: both;\n}\n\n/* ==========================================================================\nEXAMPLE Media Queries for Responsive Design.\nThese examples override the primary ('mobile first') styles.\nModify as content requires.\n========================================================================== */\n\n@media only screen and (min-width: 35em) {\n  /* Style adjustments for viewports that meet the condition */\n}\n\n@media print,\n(-webkit-min-device-pixel-ratio: 1.25),\n(min-resolution: 1.25dppx),\n(min-resolution: 120dpi) {\n  /* Style adjustments for high resolution devices */\n}\n\n/* ==========================================================================\nPrint styles.\nInlined to avoid the additional HTTP request:\nhttp://www.phpied.com/delay-loading-your-print-css/\n========================================================================== */\n\n@media print {\n  *,\n  *:before,\n  *:after {\n    background: transparent !important;\n    color: #000 !important; /* Black prints faster:\n    http://www.sanbeiji.com/archives/953 */\n    -webkit-box-shadow: none !important;\n            box-shadow: none !important;\n    text-shadow: none !important;\n  }\n\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n\n  a[href]:after {\n    content: \" (\" attr(href) \")\";\n  }\n\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\";\n  }\n\n  /*\n  * Don't show links that are fragment identifiers,\n  * or use the `javascript:` pseudo protocol\n  */\n\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: \"\";\n  }\n\n  pre {\n    white-space: pre-wrap !important;\n  }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid;\n  }\n\n  /*\n  * Printing Tables:\n  * http://css-discuss.incutio.com/wiki/Printing_Tables\n  */\n\n  thead {\n    display: table-header-group;\n  }\n\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "1b612063c74ba610568d5d460bde53c9.jpg";

/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7);
$(document).ready(function(){
  $(".loading-wrapper").hide();
  $('body').on('click','.mobile-menu',function(){
    $('.navigation-container').slideToggle();
  });
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!./normalize.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!./normalize.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: sans-serif; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* Hidden\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(10);
__webpack_require__(6);
(function(){
  /* Modal object handles the modal speciically*/
  var modal = {
    element:$('.modal'),
    image:'',
    title:'',
    /*  Loads the image into the modal*/
    loadImage:function(){
      var imageHtml = '<img src="'+this.image+'" alt="Gallery Image" />';
      this.element.find('.modal-content').html(imageHtml);
    },
    loadTitle:function(){
      this.element.find('.modal-header .image-title h3').html(this.title)
    },
    show:function(){
      this.element.removeClass('hide-modal');
      this.element.addClass('show-modal');
    },
    hide:function(){
      $('.modal').removeClass('show-modal');
      $('.modal').addClass('hide-modal');
    }
  };

  /* Modal object handles the overlay around the modal speciically*/
  var overlay = {
    element:$('.popup-overlay'),
    show:function(){
      $('.popup-overlay').removeClass('hide-overlay');
      $('.popup-overlay').addClass('show-overlay');
    },
    hide:function(){
      $('.popup-overlay').removeClass('show-overlay');
      $('.popup-overlay').addClass('hide-overlay');
    }
  };
  /* Handles the entire popup lifecycle*/
  var popup = {
    modalImage:'',
      modalTitle:'',
    show:function(){
      modal.image=this.modalImage;
      modal.title = this.modalTitle;
      modal.loadTitle();
      modal.loadImage();
      overlay.show();
      modal.show();
    },
    hide:function(){
      modal.hide();
      overlay.hide();
    }
  };
  /* Infinite scroll object*/
  var infiniteScroll={
    currentlyLoadedOffset:12,
    loadingLimit:12,
    showLoading:function(){
      $(".images-loading").addClass("show-images-loading");
    },
    hideLoading:function(){
      $(".images-loading").removeClass("show-images-loading");
    },
    next:function(){
        this.currentlyLoadedOffset+=this.loadingLimit;
    }
  };
  $(document).ready(function(e){
    $('body').on('click','.single-image',function(){
      // set the data for the modal
      var dataImage = $(this).attr('data-image');
      var dataTitle = $(this).attr('data-title');
      popup.modalImage = dataImage;
      popup.modalTitle = dataTitle;
      //show the popup
      popup.show();
    })
    $('body').on('click','.close-button',function(){
      //hide the popup
      popup.hide();
    });
    var isLoading = false; //Variable to check if a content is being loaded currently
    $(window).scroll(function() {
      if(!isLoading){
      if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        //setting the loading var to true
        isLoading = true;
        //display loading
        infiniteScroll.showLoading();
        //api url
        var url = "https://api.giphy.com/v1/gifs/search?q=movies&limit=12&offset="+infiniteScroll.currentlyLoadedOffset+"&api_key=EaCnmIG6flyizJVvfsCPUP7525WowfZu";
        $.get(url,function(response){
          var completeImagePackage="";
          console.log(response);
          response["data"].forEach(function(currentElement){
            var imagePreview = currentElement.images.fixed_width_small.url;
            var dataImage = currentElement.images.downsized_medium.url;
            var dataTitle = currentElement.title;
            var html = '<div class=single-image data-title='+dataTitle+' data-image='+dataImage+'>';
            html += '<img src='+imagePreview+' alt=Gallery Image />';
            html += '</div>';
            completeImagePackage += html;
          });
          //Hiding the loading for infinite scroll
          infiniteScroll.hideLoading();
          $(".images-container").append(completeImagePackage);
          //loading complete
          isLoading = false;
        });
        infiniteScroll.next();
      }
    }
    });
  });
})();


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!./main.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n/* ==========================================================================\nCustom styles\n========================================================================== */\n\n/*Content styles begin*/\n.content-wrapper{\n  height: auto;\n  width: 100%;\n  padding-top: 110px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -o-box-sizing: border-box;\n  -ms-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.images-container{\n  width: 100%;\n  height: 100%;\n  -o-box-sizing: border-box;\n  -ms-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  margin: 0 auto;\n  padding:0 100px;\n  text-align: center;\n}\n.single-image{\n  display: inline-block;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  height: 240px;\n  max-width: 250px;\n  width: 250px;\n  overflow: hidden;\n  border-radius: 10px;\n  margin: 3px;\n}\n.single-image img{\n  height: 100%;\n  width: 100%;\n}\n.images-loading{\n  width: 100%;\n  padding: 10px 0;\n  text-align: center;\n  visibility: hidden;\n  -webkit-transition:all 1s ease-in-out;\n  transition:all 1s ease-in-out;\n  opacity: 0;\n}\n.show-images-loading{\n  visibility: visible;\n  opacity: 1;\n}\n/*Content styles end*/\n/* Popup modal styles */\n.popup-overlay{\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n          display: inline-block;\n          vertical-align: middle;\n          text-align: center;\n  background: rgba(0, 0, 0, 0.5);\n  z-index: 999;\n  visibility: hidden;\n  opacity: 0;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n  overflow: hidden;\n}\n.popup-overlay .modal{\n  width: 25%;\n  height: 350px;\n  background: #FFF;\n  margin: auto;\n  border-radius: 5px;\n  padding: 10px 20px 30px 20px;\n          display: inline-block;\n          vertical-align: middle;\n          text-align: center;\n  position: absolute;\n  top: -100%;\n  z-index: 9999;\n  -webkit-transform: translate(-50%, 5%);\n         transform: translate(-50%, 5%);\n  transition: all 1s ease-in-out;\n  -webkit-transition: all 1s ease-in-out;\n}\n.modal .modal-header{\n  width: 100%;\n  position: relative;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -moz-flex:1.15;\n  -ms-flex:1.15;\n  -webkit-box-flex:1.15;\n          flex:1.15;\n  -o-box-sizing: border-box;\n  -ms-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.modal-header .image-title{\n  font-family: 'Yanone Kaffeesatz', sans-serif;\n  font-weight: 300;\n  font-size: 0.75em;\n  letter-spacing: 2px;\n  text-align: center;\n  width: 100%;\n}\n.image-title h3{\n  padding: 5px 0;\n  margin: 0;\n}\n.modal-header .close-button{\n  position: absolute;\n  right: 5px;\n  height: auto;\n  width: 12px;\n  background-repeat: no-repeat;\n  background-size: contain;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n              -ms-grid-row-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  border: 1px solid #FFF;\n  border-radius: 100%;\n  cursor: pointer;\n}\n.close-button img{\n  height: 100%;\n  width: 100%;\n}\n.modal .modal-content{\n  width: 100%;\n  height: 90%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -moz-flex:8.85;\n  -ms-flex:8.85;\n  -webkit-box-flex:8.85;\n          flex:8.85;\n}\n.modal-content img{\n  height: 100%;\n  width: 100%;\n}\n.show-overlay{\n  visibility: visible;\n  -webkit-animation: showOverlayAnimation 1s forwards;\n  animation: showOverlayAnimation 1s forwards;\n}\n.hide-overlay{\n  visibility: hidden;\n  -webkit-animation: hideOverlayAnimation 0.25s forwards;\n  animation: hideOverlayAnimation 0.25s forwards;\n}\n.show-modal{\n  visibility: visible;\n  -webkit-animation: showModalAnimation 0.5s forwards;\n  animation: showModalAnimation 0.5s forwards;\n}\n.hide-modal{\n  visibility: hidden;\n  -webkit-animation: hideModalAnimation 0.5s forwards;\n  animation: hideModalAnimation 0.5s forwards;\n}\n/* Safari 4.0 - 8.0 */\n@-webkit-keyframes showOverlayAnimation {\n  0%   {opacity: 0;-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";visibility: hidden;}\n  100% {opacity: 1;-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)\";visibility: visible;}\n}\n\n/* Standard syntax */\n@keyframes showOverlayAnimation {\n  0%   {opacity: 0;-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";visibility: hidden;}\n  100% {opacity: 1;-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)\";visibility: visible;}\n}\n/* Safari 4.0 - 8.0 */\n@-webkit-keyframes hideOverlayAnimation {\n  0% {opacity: 1;-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)\";visibility: visible;}\n  100%   {opacity: 0;-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";visibility: hidden;}\n}\n\n/* Standard syntax */\n@keyframes hideOverlayAnimation {\n  0% {opacity: 1;-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)\";visibility: visible;}\n  100%   {opacity: 0;-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";visibility: hidden;}\n}\n/*  Modal Animations  */\n/* Safari 4.0 - 8.0 */\n@-webkit-keyframes showModalAnimation {\n  0% {top:-100%;}\n  100%   {top:20%;}\n}\n\n/* Standard syntax */\n@keyframes showModalAnimation {\n  0% {top:-100%;}\n  100%   {top:20%;}\n}\n/* Safari 4.0 - 8.0 */\n@-webkit-keyframes hideModalAnimation {\n  0%   {top:0;}\n  100% {top:-100%;}\n}\n\n/* Standard syntax */\n@keyframes hideModalAnimation {\n  0%   {top:0;}\n  100% {top:-100%;}\n}\n\n\n/* Larger than mobile */\n@media (max-width: 850px) {\n  .images-container{\n    padding: 0;\n  }\n  .content-wrapper{\n    padding-left: 3px;\n    padding-right: 3px;\n    padding-bottom: 50px;\n  }\n  .single-image{\n    width: 45%;\n    height: 145px;\n    margin: 2px;\n  }\n  /* Modal */\n  .popup-overlay .modal{\n    width: 75%;\n    -webkit-transform: translate(-50%, -10%);\n         transform: translate(-50%, -10%);\n  }\n\n}\n", ""]);

// exports


/***/ })
/******/ ]);