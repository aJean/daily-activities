(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  ['cmd'],
  {
    './src/cmd.js': function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      var _cmd_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cmd.module */ './src/cmd.module.js');
      var _cmd_module__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _cmd_module__WEBPACK_IMPORTED_MODULE_0__
      );
      var _esm_moudle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esm.moudle */ './src/esm.moudle.ts');

      // 对 commonjs 使用 __webpack_require__.n 去判断 default
      _cmd_module__WEBPACK_IMPORTED_MODULE_0___default()();
      // 对于 esm，因为必定会有 default，所以直接去取
      Object(_esm_moudle__WEBPACK_IMPORTED_MODULE_1__['default'])();
    },

    './src/cmd.module.js': function (module, exports) {
      module.exports = function test() {
        console.log('test');
      };
    },

    './src/esm.moudle.ts': function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, 'default', function () {
        return start;
      });
      __webpack_require__.d(__webpack_exports__, 'other', function () {
        return other;
      });
      function start() {
        console.log('start');
      }
      function other() {
        console.log('other');
      }
    },
  },
  [['./src/cmd.js', 'runtime']],
]);
