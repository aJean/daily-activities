/**
 * @file 状态模式，内部状态调度，关注状态的变化
 *       与策略模式区别主要在于状态的变化又内部控制 Context 状态管理
 */

interface State {
  name: string;
  handle(): void;
}

class PreState {
  name = 'pre';

  handle() {
    console.log(this.name);
  }
}

class NxtState {
  name = 'nxt';

  handle() {
    console.log(this.name);
  }
}

class ContextControl {
  states: State[];
  current: State;

  constructor(states: State[]) {
    this.states = states;
    this.current = states[0];
  }

  /**
   * 循环状态
   */
  process() {
    this.current.handle();

    const states = this.states;
    for (let i = 0; i < states.length; i++) {
      if (states[i] == this.current) {
        this.current = i == states.length - 1 ? states[0] : states[i + 1];
        break;
      }
    }
  }
}

const cc = new ContextControl([new PreState(), new NxtState()]);
cc.process();
cc.process();
cc.process();