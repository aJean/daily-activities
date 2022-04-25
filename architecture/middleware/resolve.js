/**
 * @file koa-compose 原理
 */

let i = 3;

function fn(next) {
  return new Promise(function (resolve) {
    const id = i;

    next().then(() => {
      console.log(id);
      resolve();
    });
  });
}

function dispatch() {
  if (i-- > 0) {
    return Promise.resolve(fn(dispatch));
  } else {
    return Promise.resolve();
  }
}

dispatch().then(() => console.log('success'));
