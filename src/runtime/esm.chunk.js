(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  ['esm'],
  {
    './src/esm.moudle.ts':
      /*! exports provided: default, other */
      function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'default', function () {
          return start;
        });
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'other', function () {
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

    './src/esm.ts': function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      // import start from './esm.moudle';
      var _esm_moudle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('./src/esm.moudle.ts');

      // start();
      Object(_esm_moudle__WEBPACK_IMPORTED_MODULE_0__['default'])();

      // import('./esm.async')
      __webpack_require__
        .e(0)
        .then(__webpack_require__.bind(null, './src/esm.async.ts'))
        .then(function (res) {
          console.log(res);
        });
    },
  },
  // 第三个值表示入口模块
  [['./src/esm.ts', 'runtime']],
]);
