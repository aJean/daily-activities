(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["esm"],{

/***/ "./src/esm.moudle.ts":
/*!***************************!*\
  !*** ./src/esm.moudle.ts ***!
  \***************************/
/*! exports provided: default, other */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return start; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "other", function() { return other; });
/**
 * @file module
 */
function start() {
    console.log('start');
}
function other() {
    console.log('other');
}


/***/ }),

/***/ "./src/esm.ts":
/*!********************!*\
  !*** ./src/esm.ts ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _esm_moudle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esm.moudle */ "./src/esm.moudle.ts");

/**
 * @file entry
 */
Object(_esm_moudle__WEBPACK_IMPORTED_MODULE_0__["default"])();
__webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./esm.async */ "./src/esm.async.ts")).then(function (res) {
    console.log(res);
});


/***/ })

},[["./src/esm.ts","runtime"]]]);