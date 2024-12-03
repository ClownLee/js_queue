# JS前端 执行队列对象

### 单例模式JS前端任务队列

## 任务对象
- ID: id string
  - 任务唯一标识
- 状态: status 'pending' | 'finished' | 'failed'
  - pending: 初始状态，任务未执行
  - finished: 任务执行成功
  - failed: 任务执行失败
- 任务体(数据): params

## 配置对象
- config
  - 构造方法中指定 custructor(config: Config, tasks: Array<Task>): void
  - interval: number 执行间隔时间，单位毫秒，默认 1000

## 方法

- `addTasks(tasks: Array<Task>): void`
  - 添加批量任务
  - tasks: 添加批量任务

- `addOneTask(task: Task): void`
  - 添加单个任务
  - task: 添加单个任务

- `modifyTask(task: Task, id: string | symbol): void`
  - 修改单个任务 只要用来修改任务中的状态 status
  - task: 单个任务
  - id: 任务唯一标识

- `clearTasks(): void`
  - 清空任务

- `resetTasks (tasks: Array<Task>): void`
  - 重置任务

- `run(callback: Function): void`
  - 执行任务
  - callback: 任务执行完成后的回调函数

## 示例
```js
const config = {
  interval: 1000,
};

const tasks = [
  {
    id: 'task1',
    status: 'pending',
    params: {
      // ...业务数据
    }
  },
  {
    id: 'task2',
    status: 'pending',
    params: {
      // ...业务数据
    }
  }
];

const queue = new Queue(config, tasks);
/** 或者后面再添加任务
const queue = new Queue(config);
queue.addTasks(tasks);
**/

queue.run((task) => {
  // 业务代码
  // ...
  queue.modifyTask({
    ...task,
    status: 'finished',
    // status: 'failed',
  }, task.id);
});

// 询问任务状态
const handle = setInterval(() => {
  if (queue.queueStatus === 'finished') {
    console.log('任务执行完成');
    console.log('执行结果:', JSON.stringify(queue.tasks));
    clearInterval(handle);
  }
}, 500);

```