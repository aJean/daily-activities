(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  ['cmd'],
  {
    './src/cmd.js': function (module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.r(__webpack_exports__);
      // 源码使用 import 去加载 commonjs 模块
      var _cmd_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('./src/cmd.module.js');
      // webpack 会加一步处理，使用 __webpack_require__.n 对 export 做 default 的判断
      var _cmd_module__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _cmd_module__WEBPACK_IMPORTED_MODULE_0__
      );

      const start = __webpack_require__('./src/esm.moudle.ts');

      _cmd_module__WEBPACK_IMPORTED_MODULE_0___default()();
      start();
    },

    './src/cmd.module.js': function (module, exports) {
      module.exports = function test() {
        console.log('test');
      };
    },

    './src/esm.moudle.ts': function (module, __webpack_exports__, __webpack_require__) {
      // 标记是 esm，用于  __webpack_require__.n 时判断 getter
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
