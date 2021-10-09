/**
 * @file 策略模式定义了一组算法，将它们逐个封装起来，并使它们可以相互替换
 *       策略可以让算法独立于使用它们的客户而变化
 */

interface Strategy {
  calculate(a: number, b: number): number;
}

class AddStrategy implements Strategy {
  calculate(a: number, b: number) {
    return a + b;
  }
}

class SubtractStrategy implements Strategy {
  calculate(a: number, b: number) {
    return a - b;
  }
}

class Context {
  strategy: Strategy;

  replaceStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  calculate(a: number, b: number): number {
    return this.strategy.calculate(a, b);
  }
}

const ct = new Context();
ct.replaceStrategy(new AddStrategy());

console.log(ct.calculate(10, -2));
