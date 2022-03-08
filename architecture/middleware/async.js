/**
 * @file 异步执行模式
 */

function compose(middlewares) {
  if (!middlewares.length) {
    throw new Error('no middlewares');
  }

  return function(context, last) {
    let index = -1;

    function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }

      index = i;
      let fn = middlewares[i];

      // 最后执行的机会
      if (i === middlewares.length) {
        fn = last;
      }

      if (!fn) {
        return Promise.resolve();
      }

      try {
        // 将每一个 middleware 函数作为前一个函数的 next 参数
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispatch(0);
  }
}

const start = (context, next) => {
  console.log('start1');
  context.status = 'start';

  setTimeout(() => next());
  console.log('start2');
};

const end = (context, next) => {
  console.log('end1');
  context.status = 'end';
  next();
  console.log('end2');
};

const fn = compose([start, end]);

fn({});

console.log({});