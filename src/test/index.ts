import QTasks from "../index";
const { Queue } = QTasks;

const queue = new Queue({
  interval: 500,
  position: 'after'
});
queue.tasks = [
  {
    id: 1,
    status: "pending",
    params: {}
  },
  {
    id: 2,
    status: "pending",
    params: {}
  },
  {
    id: 3,
    status: "pending",
    params: {}
  },
];

// 一秒后终止执行
setTimeout(() => {
  queue.termination();
}, 1000);

const fns = [
  (task: QueueTask) => {
    queue.resetOneTasks(task, 'finished');
    console.log("task 1", task);
  },
  (task: QueueTask) => {
    console.log("task 2", task);
    queue.resetOneTasks(task, 'finished');
  },
  (task: QueueTask) => {
    console.log("task 3", task);
    queue.resetOneTasks(task, 'finished');
  },
  (task: QueueTask) => {
    console.log("task 4", task);
    queue.resetOneTasks(task, 'finished');
  }
];

// 等待四秒后重新执行
setTimeout(() => {
  queue.reExecute(fns,
    (tasks: QueueTask[], fnIndex: number) => {
      if(fnIndex === 2) {
        queue.tasks.push({
          id: queue.tasks.length + 1,
          status: "pending",
          params: {}
        })
      }
      
      console.log("queue re execute one finished", tasks);
    },
    (tasks: QueueTask[]) => {
      console.log("queue re execute finished", tasks);
    },
  );
}, 4000)

// 立即执行
queue.reExecute(fns,
  (tasks: QueueTask[]) => {
    console.log("queue one finished", tasks);
  },
  (tasks: QueueTask[]) => {
    console.log("queue finished", tasks);
  },
)