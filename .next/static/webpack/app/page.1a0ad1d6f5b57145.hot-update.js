"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./components/ListLeagues.tsx":
/*!************************************!*\
  !*** ./components/ListLeagues.tsx ***!
  \************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ ListLeaguesPage; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js\");\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/auth-helpers-nextjs */ \"(app-pages-browser)/./node_modules/@supabase/auth-helpers-nextjs/dist/index.js\");\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react-experimental/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/image */ \"(app-pages-browser)/./node_modules/next/image.js\");\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/link */ \"(app-pages-browser)/./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_4__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\nfunction ListLeaguesPage() {\n    _s();\n    const [leagues, setLeagues] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)([]);\n    const supabase = (0,_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1__.createClientComponentClient)();\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const getLeagues = async ()=>{\n            let { data: leagues, error } = await supabase.from(\"leagues\").select(\"*\");\n            console.log(leagues);\n            if (leagues) {\n                setLeagues(leagues);\n            }\n        };\n        getLeagues();\n    }, [\n        supabase,\n        setLeagues\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"section\", {\n        className: \"col-span-2 px-6 py-4\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                className: \"text-2xl font-bold mb-6\",\n                children: \"Nuestras ligas\"\n            }, void 0, false, {\n                fileName: \"/Users/ffvalero/Develpoer/proyectos/furvo/components/ListLeagues.tsx\",\n                lineNumber: 26,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex flex-col\",\n                children: leagues.map((param)=>/*#__PURE__*/ {\n                    let { id, name, slug, api_id, logo } = param;\n                    return (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_4___default()), {\n                        className: \"flex flex-row items-center text-xl font-normal text-white mb-4\",\n                        href: \"/leagues/\".concat(api_id),\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_image__WEBPACK_IMPORTED_MODULE_3___default()), {\n                                src: \"/\".concat(slug, \".jpg\"),\n                                width: 40,\n                                height: 40,\n                                alt: name,\n                                className: \"mr-4\"\n                            }, void 0, false, {\n                                fileName: \"/Users/ffvalero/Develpoer/proyectos/furvo/components/ListLeagues.tsx\",\n                                lineNumber: 34,\n                                columnNumber: 17\n                            }, this),\n                            name\n                        ]\n                    }, id, true, {\n                        fileName: \"/Users/ffvalero/Develpoer/proyectos/furvo/components/ListLeagues.tsx\",\n                        lineNumber: 29,\n                        columnNumber: 15\n                    }, this);\n                })\n            }, void 0, false, {\n                fileName: \"/Users/ffvalero/Develpoer/proyectos/furvo/components/ListLeagues.tsx\",\n                lineNumber: 27,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/ffvalero/Develpoer/proyectos/furvo/components/ListLeagues.tsx\",\n        lineNumber: 25,\n        columnNumber: 5\n    }, this);\n}\n_s(ListLeaguesPage, \"tTW/FN9ayZ8mOGXbZxVsgwUHG98=\");\n_c = ListLeaguesPage;\nvar _c;\n$RefreshReg$(_c, \"ListLeaguesPage\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvTGlzdExlYWd1ZXMudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUU0RTtBQUNoQztBQUNiO0FBQ0Y7QUFHZCxTQUFTSzs7SUFDdEIsTUFBTSxDQUFDQyxTQUFTQyxXQUFXLEdBQUdMLCtDQUFRQSxDQUFRLEVBQUU7SUFDaEQsTUFBTU0sV0FBV1IsMEZBQTJCQTtJQUU1Q0MsZ0RBQVNBLENBQUM7UUFDUixNQUFNUSxhQUFhO1lBQ2pCLElBQUksRUFBRUMsTUFBTUosT0FBTyxFQUFFSyxLQUFLLEVBQUUsR0FBRyxNQUFNSCxTQUFTSSxJQUFJLENBQUMsV0FBV0MsTUFBTSxDQUFDO1lBQ3JFQyxRQUFRQyxHQUFHLENBQUNUO1lBQ1osSUFBSUEsU0FBUztnQkFDWEMsV0FBV0Q7WUFDYjtRQUNGO1FBQ0FHO0lBQ0YsR0FBRztRQUFDRDtRQUFVRDtLQUFXO0lBRXpCLHFCQUNFLDhEQUFDUztRQUFRQyxXQUFVOzswQkFDakIsOERBQUNDO2dCQUFHRCxXQUFVOzBCQUEwQjs7Ozs7OzBCQUN4Qyw4REFBQ0U7Z0JBQUlGLFdBQVU7MEJBQ1pYLFFBQVFjLEdBQUcsQ0FBQzt3QkFBQyxFQUFFQyxFQUFFLEVBQUVDLElBQUksRUFBRUMsSUFBSSxFQUFFQyxNQUFNLEVBQUVDLElBQUksRUFBRTsyQkFDeEMsOERBQUNyQixrREFBSUE7d0JBQ0hhLFdBQVU7d0JBQ1ZTLE1BQU0sWUFBbUIsT0FBUEY7OzBDQUdsQiw4REFBQ3JCLG1EQUFLQTtnQ0FDTndCLEtBQUssSUFBUyxPQUFMSixNQUFLO2dDQUNkSyxPQUFPO2dDQUNQQyxRQUFRO2dDQUNSQyxLQUFLUjtnQ0FDTEwsV0FBVTs7Ozs7OzRCQUVUSzs7dUJBVElEOzs7OztnQkFVRDs7Ozs7Ozs7Ozs7O0FBS3BCO0dBdEN3QmhCO0tBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2NvbXBvbmVudHMvTGlzdExlYWd1ZXMudHN4Pzc2M2UiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XG5cbmltcG9ydCB7IGNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCB9IGZyb20gXCJAc3VwYWJhc2UvYXV0aC1oZWxwZXJzLW5leHRqc1wiO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IEltYWdlIGZyb20gXCJuZXh0L2ltYWdlXCI7XG5pbXBvcnQgTGluayBmcm9tIFwibmV4dC9saW5rXCI7XG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiY29uc29sZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMaXN0TGVhZ3Vlc1BhZ2UoKSB7XG4gIGNvbnN0IFtsZWFndWVzLCBzZXRMZWFndWVzXSA9IHVzZVN0YXRlPGFueVtdPihbXSk7XG4gIGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50Q29tcG9uZW50Q2xpZW50KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBnZXRMZWFndWVzID0gYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IHsgZGF0YTogbGVhZ3VlcywgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmZyb20oXCJsZWFndWVzXCIpLnNlbGVjdChcIipcIik7XG4gICAgICBjb25zb2xlLmxvZyhsZWFndWVzKTtcbiAgICAgIGlmIChsZWFndWVzKSB7XG4gICAgICAgIHNldExlYWd1ZXMobGVhZ3Vlcyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRMZWFndWVzKCk7XG4gIH0sIFtzdXBhYmFzZSwgc2V0TGVhZ3Vlc10pO1xuXG4gIHJldHVybiAoXG4gICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29sLXNwYW4tMiBweC02IHB5LTRcIj5cbiAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LWJvbGQgbWItNlwiPk51ZXN0cmFzIGxpZ2FzPC9oMj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICB7bGVhZ3Vlcy5tYXAoKHsgaWQsIG5hbWUsIHNsdWcsIGFwaV9pZCwgbG9nbyB9KSA9PiAoXG4gICAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXJvdyBpdGVtcy1jZW50ZXIgdGV4dC14bCBmb250LW5vcm1hbCB0ZXh0LXdoaXRlIG1iLTRcIlxuICAgICAgICAgICAgICAgIGhyZWY9e2AvbGVhZ3Vlcy8ke2FwaV9pZH1gfVxuICAgICAgICAgICAgICAgIGtleT17aWR9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8SW1hZ2VcbiAgICAgICAgICAgICAgICBzcmM9e2AvJHtzbHVnfS5qcGdgfVxuICAgICAgICAgICAgICAgIHdpZHRoPXs0MH1cbiAgICAgICAgICAgICAgICBoZWlnaHQ9ezQwfVxuICAgICAgICAgICAgICAgIGFsdD17bmFtZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtci00XCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICB7bmFtZX1cbiAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvc2VjdGlvbj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnRDb21wb25lbnRDbGllbnQiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkltYWdlIiwiTGluayIsIkxpc3RMZWFndWVzUGFnZSIsImxlYWd1ZXMiLCJzZXRMZWFndWVzIiwic3VwYWJhc2UiLCJnZXRMZWFndWVzIiwiZGF0YSIsImVycm9yIiwiZnJvbSIsInNlbGVjdCIsImNvbnNvbGUiLCJsb2ciLCJzZWN0aW9uIiwiY2xhc3NOYW1lIiwiaDIiLCJkaXYiLCJtYXAiLCJpZCIsIm5hbWUiLCJzbHVnIiwiYXBpX2lkIiwibG9nbyIsImhyZWYiLCJzcmMiLCJ3aWR0aCIsImhlaWdodCIsImFsdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/ListLeagues.tsx\n"));

/***/ })

});