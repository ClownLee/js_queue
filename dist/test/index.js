"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../index"));
var Queue = index_1.default.Queue;
var queue = new Queue({
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
setTimeout(function () {
    queue.termination();
}, 1000);
var fns = [
    function (task) {
        queue.resetOneTasks(task, 'finished');
        console.log("task 1", task);
    },
    function (task) {
        console.log("task 2", task);
        queue.resetOneTasks(task, 'finished');
    },
    function (task) {
        console.log("task 3", task);
        queue.resetOneTasks(task, 'finished');
    },
    function (task) {
        console.log("task 4", task);
        queue.resetOneTasks(task, 'finished');
    }
];
// 等待四秒后重新执行
setTimeout(function () {
    queue.reExecute(fns, function (tasks, fnIndex) {
        if (fnIndex === 2) {
            queue.tasks.push({
                id: queue.tasks.length + 1,
                status: "pending",
                params: {}
            });
        }
        console.log("queue re execute one finished", tasks);
    }, function (tasks) {
        console.log("queue re execute finished", tasks);
    });
}, 4000);
// 立即执行
queue.reExecute(fns, function (tasks) {
    console.log("queue one finished", tasks);
}, function (tasks) {
    console.log("queue finished", tasks);
});
