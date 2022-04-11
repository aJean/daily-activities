function classDecorator(target) {
  console.log(target);
}

function methodDecorator(target, propertyKey, descriptor) {
  console.log(propertyKey, target, descriptor);
}

@classDecorator
class Stream {
  constructor() {}

  @methodDecorator
  print() {
    console.log('hello');
  }
}
