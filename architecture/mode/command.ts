/**
 * @file 命令模式
 */

interface ICommand {
  execute: (type: string) => void;
  undo: () => void;
}

class Receiver {
  action(type) {
    console.log(`action ${type}`);
  }
}

class Control implements ICommand {
  receiver: Receiver;
  records: string[];

  constructor(data: Receiver) {
    this.receiver = data;
    this.records = [];
  }

  execute(type: string) {
    this.records.push(type);
    this.receiver.action(type);
  }

  undo() {
    const type = this.records.pop();
    this.receiver.action(type);
  }
}

function main() {
  const r = new Receiver();
  const c = new Control(r);

  c.execute('haha');
  c.execute('heihei');
  c.undo();
}

main();
