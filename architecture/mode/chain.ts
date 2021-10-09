/**
 * @file 职责链
 */

abstract class Handler {
  nextHandler: Handler;

  process(data: any) {
    if (this.resolve(data)) {
      this.done();
    } else {
      this.doNext(data);
    }
  }

  resolve(data: any): boolean {
    return true;
  }

  done() {
    console.log('finish');
  }

  setNext(handler: Handler) {
    this.nextHandler = handler;
  }

  doNext(data: any) {
    this.nextHandler && this.nextHandler.resolve(data);
  }
}

class YSHandler extends Handler {
  resolve(data: any) {
    if (data.val > 100) {
      console.log('by ys');
      return true;
    }
  }
}

class RSHandler extends Handler {
  resolve(data: any) {
    if (data.val > 200) {
      console.log('by rs');
      return true;
    }
  }
}

const ys = new YSHandler();
const rs = new RSHandler();

ys.setNext(rs);
ys.process({ val: 200 });
