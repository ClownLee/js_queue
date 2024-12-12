# JS前端 执行队列对象

### 单例模式JS前端任务队列

#### 入口暴露的对象和方法
> （一）. `Queue`：业务队列，单例模式，业务队列数据，多任务链式执行，回调处理后的业务数据

> （二）. `MainQueue`：主队列，常驻队列，单例模式

> （三）. `sleep`：休眠延时函数

#### 使用方法
（零）. 初始化

```js
// 入口暴露的对象和方法
import que from '@clownlee/queue';
// 创建主队列
const mainQueue = new que.MainQueue();
// 创建业务队列
const queue = new que.Queue();
```

（一）. `Queue`：业务队列，单例模式，业务队列数据，多任务链式执行，回调处理后的业务数据

```js
const business = (mainTask) => {
  // 添加业务队列数据
  // queue.tasks = [
  //   {
  //     id: '', // 业务队列数据唯一主键id
  //     params: {} | [], // 业务队列数据参数
  //     status: 'pending' // 业务队列数据状态，默认为pending
  //   }
  // ]
  queue.tasks = mainTask.params.map((item) => {
    item = {
      ...item,
      // TO SAME THING
    }
    return {
      id: '', // 业务队列数据唯一主键id
      params: item, // 业务队列数据参数
      status: 'pending' // 业务队列数据状态，默认为pending
    }
  })
  
  queue.reExecute(
    // 链式任务处理函数 从第一个一次执行到最后一个
    // 参数是当前任务，在函数中如果当前任务执行成功必须在函数内调用
    [
      // 【链式任务处理函数（1）】
      (task) => {
        // TO SAME THING
        // ……
        axios.get(task.params).then(res => {
          if (res.data.code === 200) {
            task.params.axiosData = res.data.data
            // 重置当前任务成功状态为finished
            queue.resetOneTasks(task, 'finished')
          } else {
            // 下一次再次执行当前任务 不设置 status 默认为 pending
            // 或手动设置
            queue.resetOneTasks(task, 'pending')
          }
        }).catch(err => {
          // 重置当前任务失败状态为failed
          queue.resetOneTasks(task, 'failed')
        })
      },
      // 【链式任务处理函数（2）】
      (task) => {
        // 如上函数，同理
      },
      // 【链式任务处理函数（3）】
      (task) => {
        // 如上函数，同理
      },
    ],
    // 每一个链式任务执行完成后的回调函数，参数是当前任务所有任务，
    // fnIndex 链式任务处理函数 索引，当链式函数执行完成（即tasks任务中所有状态没有 pending）
    // tasks 当前链式所有任务数据
    (tasks, fnIndex) => {
      // 例如: fnIndex = 0 也就是【链式任务处理函数（1）】执行完成
      if (fnIndex === 0) {
        // 重新设置 任务队列，交给 【链式任务处理函数（2）】执行
        queue.tasks = tasks.map((item) => {
          const axiosData = item.params.axiosData
          axiosData.name = 'clownlee'
          return {
            id: '', // 业务队列数据唯一主键id
            params: axiosData, // 业务队列数据参数
            status: 'pending' // 业务队列数据状态，默认为pending
          }
        })
      } else if (fnIndex === 1) {
        // 链式任务处理函数（2）】执行完成
        // 修改任务状态为 pending ，交给 【链式任务处理函数（3）】执行
      }
      // 【链式任务处理函数（3）】 即最后一个 【链式任务处理函数】 不用设置
    },
    (tasks) => {
      // 所有链式任务处理函数执行完成后的回调函数
      // 如例子中，【链式任务处理函数（3）】执行完成
      // 最终数据 tasks
    }
  )
}
```

（二）. `MainQueue`：主队列，常驻队列，单例模式

```js
mainQueue.addTask({
  id: '', // 任务唯一主键id
  param: {}, // 任务参数
})

// 执行任务
mainQueue.execute(
  queue, // 业务队列类，
  (mainTask, queue) => {
    // TO SAME THINGS
    business(mainTask)
  }, // 任务执行队列函数
)
```
