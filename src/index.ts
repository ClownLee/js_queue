interface Config {
  interval: number;
}

interface Task {
  id: string | symbol;
  status: 'pending' | 'finished' | 'failed'
  params: Record<string, any>;
}

class QueueClass {
  queueStatus: 'pending' | 'finished' | 'failed' = 'pending';
  tasks: Task[] = [];
  currentTime: number = 0;
  config: Config = {
    interval: 1000
  }
  constructor(
    config: Config = {
      interval: 1000 // 每次执行间隔时间
    },
    tasks: Task[] = []
  ) {
    this.currentTime = 0;
    this.config = config;
    this.tasks = tasks;
    this.queueStatus = 'pending'
  }

  /**
   * 清空任务列表
   */
  clearTasks(): void {
    this.queueStatus = 'finished';
    this.tasks = [];
  }

  /**
   * 重置任务
   * @param {Array} tasks 任务列表
   */
  resetTasks (tasks: Array<Task>): void {
    this.queueStatus = 'pending';
    this.tasks = tasks
  }

  /**
   * 添加多个任务
   * @param {Array} tasks 任务列表
   */
  addTasks(tasks: Array<Task>): void {
    this.tasks = [
      ...this.tasks,
      ...tasks
    ];
  }
  /**
   * 添加单个任务
   * @param {Task} task 任务对象
   */
  addOneTask(task: Task): void {
    this.tasks.push(task);
  }
  /**
   * 修改单个任务
   * @param {Task} task 任务对象 
   * @param {string|symbol} id 任务id
   */
  modifyTask(task: Task, id: string | symbol): void {
    this.tasks = this.tasks.map(item => {
      if (item.id === id) {
        return task;
      }
      return item;
    })
  }
  
  /**
   * 执行任务
   * @param {Function} callback 回调函数
   */
  run(callback: Function): void {
    if (this.currentTime === 0) {
      this.currentTime = Date.now();
    }
    const iter = this.tasks.filter(item=>item.status === 'pending')[Symbol.iterator]();

    const fn = () => {
      try {
        const currTime = Date.now();
        const diffVal = currTime - this.currentTime
        if (diffVal >= this.config.interval) {
          const task = iter.next();
          if (task.done) {
            const res = this.tasks.find((item) => ['pending'].includes(item.status));
            if (!!res) {
              this.run(callback);
              throw new Error('新的一次轮询');
            } else {
              this.queueStatus = 'finished';
              throw new Error('任务执行完毕');
            }
          }else {
            callback(task.value);
            this.currentTime = currTime;
          }
        }
        window.requestAnimationFrame(fn);
      } catch (e: any) {}
    }

    window.requestAnimationFrame(fn)
  }
}

/**
 * 单例模式
 * @param className 类
 * @returns 单例类
 */
function single(className: any) {
  let instance: any = null;
  return new Proxy(className, {
  //  construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
    construct (target, args) {
      class ProxyClass {
        constructor () {
          if(!instance) {
            instance = new target(...args)
            // 销毁单例
            target.prototype.destroyed = function () { 
              instance = null
             }
          }
          return instance
        }
      }
      return new ProxyClass()
    }
  })
}

export const Queue = single(QueueClass);