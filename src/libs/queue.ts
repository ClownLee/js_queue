import { single } from "./single";

export const sleep = (delay: number) => new Promise((resolve) => {
  const st = setTimeout(() => {
    clearTimeout(st);
    return resolve(null);
  }, delay);
});


class QueueClass {
  private _status: QueueStatus = 'idle';
  private _tasks: QueueTask[] = [];
  private _config: QueueConfig = {
    interval: 1000, // default interval
    position: 'after' // default position
  };

  constructor(config: QueueConfig = {
    interval: 1000,
    position: 'after'
  }) {
    if (!config?.interval) {
      throw new Error('interval is required');
    }
    if (Object.prototype.toString.call(config.interval) !== '[object Number]') {
      throw new Error('interval must be a number');
    }
    this._config = config;
  }
  reExecute (fns: Function[], fnEnd: Function = () => {}, allEnd: Function = () => {}) {
    this._status = 'idle';
    this.execute(fns, fnEnd, allEnd);
  }
  termination () {
    this._status = 'termination';
  }
  async doTask (fn: Function, fnEnd: Function = () => {}, fnIndex: number = 0) {
    const iter = this._tasks.filter(item=>item.status === 'pending')[Symbol.iterator]();
    while (true) {
      if (['termination'].includes(this._status)) {
        break;
      }
      const { value, done } = iter.next();
      if (done) {
        if (this._tasks.filter(item => ['finished', 'failed'].includes(item.status)).length !== this._tasks.length) {
          await this.doTask(fn, fnEnd, fnIndex);
        } else {
          (fnEnd && Object.prototype.toString.call(fnEnd) === '[object Function]')&& fnEnd(this._tasks, fnIndex);
        }
        break;
      }
      if (value) {
        this._status = 'running';
        if (this._config.position === 'before') {
          fn(value);
        }
        await sleep(this._config.interval);
        if (this._config.position === 'after') {
          fn(value);
        }
      }
    }
  }

  execute (fns: Function[], fnEnd: Function = () => {}, allEnd: Function = () => {}) {

    if (Object.prototype.toString.call(fns) !== '[object Array]') {
      throw new Error('fns must be an array');
    }
    if (fns.length === 0) {
      throw new Error('fns must be not empty');
    }
    if (fns.some(fn => Object.prototype.toString.call(fn) !== '[object Function]')) {
      throw new Error('fns must be an array of functions');
    }
    
    const iter = fns[Symbol.iterator]();
    (async () => {
      let fnIndex = 0;
      while (true) {
        if (['termination'].includes(this._status)) {
          break;
        }
        const { value, done } = iter.next();
        if (done) {
          this._status = 'idle';
          fnIndex = 0;
          (allEnd && Object.prototype.toString.call(allEnd) === '[object Function]') && allEnd(this._tasks);
          break;
        }
        this._tasks = this._tasks.map((item) => {
          if (['finished'].includes(item.status)) {
            item.status = 'pending';
          }
          return item;
        });
        await this.doTask(value, fnEnd, fnIndex);

        fnIndex++;
      }
    })()
  }

  resetOneTasks (task: QueueTask, status: QueueTaskStatus = 'finished') {
    this._tasks = this._tasks.map(one => {
      if (one.id === task.id) {
        one = {
          ...one,
          status: status,
          params: task.params
        };
      }
      return one;
    });
  }

  get status () {
    return this._status;
  }

  set tasks(tasks: QueueTask[]) {
    if (Object.prototype.toString.call(tasks) !== '[object Array]') {
      throw new Error('tasks must be an array');
    }
    if (!tasks.every((task) => Object.prototype.toString.call(task) === '[object Object]')) {
      throw new Error('tasks must be an array of objects');
    }
    if (!tasks.every((task) => 'id' in task && 'status' in task && 'params' in task)) {
      throw new Error('tasks must be an array of objects with id, status and params properties');
    }
    if (!tasks.every((task) => (
      Object.prototype.toString.call(task.id) === '[object String]' ||
      Object.prototype.toString.call(task.id) === '[object Symbol]') ||
      Object.prototype.toString.call(task.status) === '[object String]' ||
      Object.prototype.toString.call(task.params) === '[object Object]'
    )) {
      throw new Error('tasks must be an array of objects with id property of type string or symbol, status property of type string and params property of type object');
    }

    this._tasks = tasks;
  }
  get tasks () {
    return this._tasks;
  }
}

export type Queue = QueueClass;
export const Queue = single(QueueClass);
