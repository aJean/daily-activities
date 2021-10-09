/**
 * @file 简单工厂：非 oo 需要修改代码逻辑
 *       工厂方法：一定的抽象扩展能力
 *       抽象工厂：产品族
 */

function SimpleFactory(args: any) {
  // 简单工厂，想要扩展需要在这里写逻辑判断
  return args.type ? new Object() : new Array();
}

/**
 * 工厂方法，随便创建几个产品
 */
class Product {
  name: string;
  use() {}
}

class Pad extends Product {
  name = 'pad';
}

class Tv extends Product {
  name = 'tv';
}

class Factory {
  create(): Product {
    return null;
  }
}

class PadFactory {
  create() {
    return new Pad();
  }
}

class TvFactory {
  create() {
    return new Tv();
  }
}

// 通过增加子类即可实现扩展，创建也可以使用 IOC 等方式
const factory = new PadFactory();
const pad = factory.create();

/**
 * 抽象工厂 - 归纳产品族，避免累爆炸
 */

class AbstractFactory {
  // 一系列产品可以一同扩展
  createA() {}
  createB() {}
  createC() {}
  createD() {}
}
