(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  ['cmd'],
  {
    './src/cmd.js': function (module, exports, __webpack_require__) {
      // 源码使用 require，这里也是简单的用 __webpack_require__ 获取，拿到的 export 需要我们自己判断是否 .default
      const start = __webpack_require__('./src/esm.moudle.ts');
      const test = __webpack_require__('./src/cmd.module.js');

      test();
      start();
    },
    // commonjs 模块
    './src/cmd.module.js': function (module, exports) {
      module.exports = function test() {
        console.log('test');
      };
    },
    // es module 模块
    './src/esm.moudle.ts': function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      // defineProperty 定义属性 getter
      __webpack_require__.d(__webpack_exports__, 'default', function () {
        return start;
      });
      __webpack_require__.d(__webpack_exports__, 'other', function () {
        return other;
      });

      /**
       * @file module
       */
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
