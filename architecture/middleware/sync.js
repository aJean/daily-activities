/**
 * @file 同步执行模式，借助 thunk、promise 等中间件实现异步
 */

const log = (next) => (data) => {
  console.log('log: start');
  next(data);
  console.log('log: end');
};

const thunk = (next) => (data) => {
  console.log('thunk: start');

  const cb = function (res) {
    next(res);
    console.log('thunk: end');
  };

  if (Object.prototype.toString.call(data) == '[object Function]') {
    data(cb);
  } else {
    cb();
  }
};

function compose(middlewares) {
  function dispatch(data) {
    console.log(`dispatch: ${data}`);
  }

  return middlewares.reduceRight(function (last, cur) {
    return cur(last);
  }, dispatch);
}

const fn = compose([thunk, log]);
fn('qy');

fn(function (cb) {
  setTimeout(function () {
    cb('async');
  }, 100);
});
