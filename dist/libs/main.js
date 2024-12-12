"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainQueue = void 0;
var single_1 = require("./single");
var queue_1 = require("./queue");
var QueueClass = /** @class */ (function () {
    /**
     * 构造函数
     * @param {MainTaskConfig} config 任务配置
     */
    function QueueClass(config) {
        this.tasks = [];
        this.status = "idle";
        this.config = {
            interval: 10000,
        };
        if (config) {
            this.config = config;
        }
    }
    /**
     * 获取所有任务
     * @returns {MainTask[]} all tasks
     */
    QueueClass.prototype.getTasks = function () {
        return this.tasks;
    };
    /**
     * 清空所有任务
     */
    QueueClass.prototype.clearTask = function () {
        this.tasks = [];
    };
    /**
     * 添加任务，将删除队列中原有的同id任务
     * @param {MainTask} task 任务
     */
    QueueClass.prototype.addTask = function (task) {
        this.removeTask(task.id);
        this.tasks.push(task);
    };
    /**
     * 删除指定任务id 的任务
     * @param {MainTaskId} id
     */
    QueueClass.prototype.removeTask = function (id) {
        this.tasks = this.tasks.filter(function (t) { return t.id !== id; });
    };
    /**
     * 常驻执行任务
     * @param queue 队列
     * @param {Function} fn 任务处理函数
     * @returns {Promise<void>} 返回空 Promise
     */
    QueueClass.prototype.execute = function (queue_2) {
        return __awaiter(this, arguments, void 0, function (queue, fn) {
            var res;
            if (fn === void 0) { fn = function () { }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status === "running") {
                            return [2 /*return*/];
                        }
                        this.status = "running";
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        console.log(this.tasks, queue.status, '分别轮询每一个【媒体账户】任务');
                        if (Object.keys(this.tasks).length > 0 && ['idle', 'termination'].includes(queue.status)) {
                            res = this.tasks.shift();
                            // selFns.material(res?.params.vs, res?.params.info, queue)
                            fn(res, queue);
                        }
                        return [4 /*yield*/, (0, queue_1.sleep)(this.config.interval)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return QueueClass;
}());
exports.MainQueue = (0, single_1.single)(QueueClass);
