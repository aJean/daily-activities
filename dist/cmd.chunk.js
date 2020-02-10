(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["cmd"],{

/***/ "./src/cmd.js":
/*!********************!*\
  !*** ./src/cmd.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const start = __webpack_require__(/*! ./esm.moudle */ "./src/esm.moudle.ts");
const test = __webpack_require__(/*! ./cmd.module */ "./src/cmd.module.js");

test();
start();

/***/ }),

/***/ "./src/cmd.module.js":
/*!***************************!*\
  !*** ./src/cmd.module.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function test() {
  console.log('test');
};


/***/ }),

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


/***/ })

},[["./src/cmd.js","runtime"]]]);