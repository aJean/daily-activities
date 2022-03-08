/**
 * @file 状态模式，内部状态调度，关注状态的变化
 *       与策略模式区别主要在于状态之间可能会耦合调用，并且状态本身是逻辑需要关注的信息
 */

interface State {
  name: string;
  handle(context: ContextControl): void;
}

class PreState implements State {
  name = 'pre';

  handle(context: ContextControl) {
    console.log(this.name);
    context.setState(new NxtState()); // 状态 a 会切换到状态 b
  }
}

class NxtState implements State {
  name = 'nxt';

  handle(context: ContextControl) {
    console.log(this.name);
    context.setState(new PreState());
  }
}

class ContextControl {
  current: State;

  constructor(state: State) {
    this.current = state;
  }

  setState(state: State) {
    this.current = state;
  }

  //对请求做处理
  handle() {
    this.current.handle(this);
  }
}

const pre = new PreState();
const cc = new ContextControl(pre);

cc.handle();
cc.handle();
