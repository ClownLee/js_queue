import { single } from "./single";
import { sleep } from "./queue";
import type { Queue } from "./queue";



class QueueClass {
  tasks: MainTask[] = [];
  status: MainTaskStatus = "idle";
  config: MainTaskConfig = {
    interval: 10000,
  }

  /**
   * 构造函数
   * @param {MainTaskConfig} config 任务配置
   */
  constructor(config?: MainTaskConfig) {
    if (config) {
      this.config = config;
    }
  }

  /**
   * 获取所有任务
   * @returns {MainTask[]} all tasks
   */
  getTasks(): MainTask[] {
    return this.tasks;
  }

  /**
   * 清空所有任务
   */
  clearTask(): void {
    this.tasks = [];
  }

  /**
   * 添加任务，将删除队列中原有的同id任务
   * @param {MainTask} task 任务
   */
  addTask(task: MainTask): void {
    this.removeTask(task.id);
    this.tasks.push(task);
  }

  /**
   * 删除指定任务id 的任务
   * @param {MainTaskId} id 
   */
  removeTask(id: MainTaskId): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  /**
   * 常驻执行任务
   * @param queue 队列
   * @param {Function} fn 任务处理函数
   * @returns {Promise<void>} 返回空 Promise
   */
  async execute(queue: Queue, fn: Function = () => {}): Promise<void> {
    if (this.status === "running") {
      return;
    }
    this.status = "running";
    while (true) {
      console.log(this.tasks, queue.status, '分别轮询每一个【媒体账户】任务')
      if (Object.keys(this.tasks).length > 0 && ['idle', 'termination'].includes(queue.status)) {
        const res = this.tasks.shift()
        // selFns.material(res?.params.vs, res?.params.info, queue)
        fn(res, queue)
      }
      await sleep(this.config.interval)
    }
  }

}

export const MainQueue = single(QueueClass);