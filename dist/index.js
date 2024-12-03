"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
var QueueClass = /** @class */ (function () {
    function QueueClass(config, tasks) {
        if (config === void 0) { config = {
            interval: 1000 // 每次执行间隔时间
        }; }
        if (tasks === void 0) { tasks = []; }
        this.queueStatus = 'pending';
        this.tasks = [];
        this.currentTime = 0;
        this.config = {
            interval: 1000
        };
        this.currentTime = 0;
        this.config = config;
        this.tasks = tasks;
        this.queueStatus = 'pending';
    }
    /**
     * 清空任务列表
     */
    QueueClass.prototype.clearTasks = function () {
        this.queueStatus = 'finished';
        this.tasks = [];
    };
    /**
     * 重置任务
     * @param {Array} tasks 任务列表
     */
    QueueClass.prototype.resetTasks = function (tasks) {
        this.queueStatus = 'pending';
        this.tasks = tasks;
    };
    /**
     * 添加多个任务
     * @param {Array} tasks 任务列表
     */
    QueueClass.prototype.addTasks = function (tasks) {
        this.tasks = __spreadArray(__spreadArray([], this.tasks, true), tasks, true);
    };
    /**
     * 添加单个任务
     * @param {Task} task 任务对象
     */
    QueueClass.prototype.addOneTask = function (task) {
        this.tasks.push(task);
    };
    /**
     * 修改单个任务
     * @param {Task} task 任务对象
     * @param {string|symbol} id 任务id
     */
    QueueClass.prototype.modifyTask = function (task, id) {
        this.tasks = this.tasks.map(function (item) {
            if (item.id === id) {
                return task;
            }
            return item;
        });
    };
    /**
     * 执行任务
     * @param {Function} callback 回调函数
     */
    QueueClass.prototype.run = function (callback) {
        var _this = this;
        if (this.currentTime === 0) {
            this.currentTime = Date.now();
        }
        var iter = this.tasks.filter(function (item) { return item.status === 'pending'; })[Symbol.iterator]();
        var fn = function () {
            try {
                var currTime = Date.now();
                var diffVal = currTime - _this.currentTime;
                if (diffVal >= _this.config.interval) {
                    var task = iter.next();
                    if (task.done) {
                        var res = _this.tasks.find(function (item) { return ['pending'].includes(item.status); });
                        if (!!res) {
                            _this.run(callback);
                            throw new Error('新的一次轮询');
                        }
                        else {
                            _this.queueStatus = 'finished';
                            throw new Error('任务执行完毕');
                        }
                    }
                    else {
                        callback(task.value);
                        _this.currentTime = currTime;
                    }
                }
                window.requestAnimationFrame(fn);
            }
            catch (e) { }
        };
        window.requestAnimationFrame(fn);
    };
    return QueueClass;
}());
/**
 * 单例模式
 * @param className 类
 * @returns 单例类
 */
function single(className) {
    var instance = null;
    return new Proxy(className, {
        //  construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
        construct: function (target, args) {
            var ProxyClass = /** @class */ (function () {
                function ProxyClass() {
                    if (!instance) {
                        instance = new (target.bind.apply(target, __spreadArray([void 0], args, false)))();
                        // 销毁单例
                        target.prototype.destroyed = function () {
                            instance = null;
                        };
                    }
                    return instance;
                }
                return ProxyClass;
            }());
            return new ProxyClass();
        }
    });
}
exports.Queue = single(QueueClass);
