/**
 * @file 常用的修饰器
 */

function classDecorator(target) {
  console.log('class: ', target);
}

function methodDecorator(target, propertyKey, descriptor) {
  console.log('method: ', target, propertyKey, descriptor);
}

function propDecorator(target, propertyKey) {
  console.log('prop: ', target, propertyKey);
}

function paramDecorator(target, propertyKey, index) {
  console.log('param: ', target, propertyKey);
}

@classDecorator
class Stream {
  @propDecorator
  name: string;

  constructor() {
  }

  @methodDecorator
  print(@paramDecorator msg: string) {
    console.log('hello');
  }
}
