/**
 * @file 常用的修饰器
 */
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
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
var Stream = /** @class */ (function () {
  function Stream() {}
  Stream.prototype.print = function (msg) {
    console.log('hello');
  };
  __decorate([propDecorator, __metadata('design:type', String)], Stream.prototype, 'name', void 0);
  __decorate(
    [
      methodDecorator,
      __param(0, paramDecorator),
      __metadata('design:type', Function),
      __metadata('design:paramtypes', [String]),
      __metadata('design:returntype', void 0)
    ],
    Stream.prototype,
    'print',
    null
  );
  Stream = __decorate([classDecorator, __metadata('design:paramtypes', [])], Stream);
  return Stream;
})();
//# sourceMappingURL=decorator.js.map
