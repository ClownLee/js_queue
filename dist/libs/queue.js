"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Queue = exports.sleep = void 0;
var single_1 = require("./single");
var sleep = function (delay) { return new Promise(function (resolve) {
    var st = setTimeout(function () {
        clearTimeout(st);
        return resolve(null);
    }, delay);
}); };
exports.sleep = sleep;
var QueueClass = /** @class */ (function () {
    function QueueClass(config) {
        if (config === void 0) { config = {
            interval: 1000,
            position: 'after'
        }; }
        this._status = 'idle';
        this._tasks = [];
        this._config = {
            interval: 1000, // default interval
            position: 'after' // default position
        };
        if (!(config === null || config === void 0 ? void 0 : config.interval)) {
            throw new Error('interval is required');
        }
        if (Object.prototype.toString.call(config.interval) !== '[object Number]') {
            throw new Error('interval must be a number');
        }
        this._config = config;
    }
    QueueClass.prototype.reExecute = function (fns, fnEnd, allEnd) {
        if (fnEnd === void 0) { fnEnd = function () { }; }
        if (allEnd === void 0) { allEnd = function () { }; }
        this._status = 'idle';
        this.execute(fns, fnEnd, allEnd);
    };
    QueueClass.prototype.termination = function () {
        this._status = 'termination';
    };
    QueueClass.prototype.doTask = function (fn_1) {
        return __awaiter(this, arguments, void 0, function (fn, fnEnd, fnIndex) {
            var iter, _a, value, done;
            if (fnEnd === void 0) { fnEnd = function () { }; }
            if (fnIndex === void 0) { fnIndex = 0; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        iter = this._tasks.filter(function (item) { return item.status === 'pending'; })[Symbol.iterator]();
                        _b.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 8];
                        if (['termination'].includes(this._status)) {
                            return [3 /*break*/, 8];
                        }
                        _a = iter.next(), value = _a.value, done = _a.done;
                        if (!done) return [3 /*break*/, 5];
                        if (!(this._tasks.filter(function (item) { return ['finished', 'failed'].includes(item.status); }).length !== this._tasks.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.doTask(fn, fnEnd, fnIndex)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        (fnEnd && Object.prototype.toString.call(fnEnd) === '[object Function]') && fnEnd(this._tasks, fnIndex);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 8];
                    case 5:
                        if (!value) return [3 /*break*/, 7];
                        this._status = 'running';
                        if (this._config.position === 'before') {
                            fn(value);
                        }
                        return [4 /*yield*/, (0, exports.sleep)(this._config.interval)];
                    case 6:
                        _b.sent();
                        if (this._config.position === 'after') {
                            fn(value);
                        }
                        _b.label = 7;
                    case 7: return [3 /*break*/, 1];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    QueueClass.prototype.execute = function (fns, fnEnd, allEnd) {
        var _this = this;
        if (fnEnd === void 0) { fnEnd = function () { }; }
        if (allEnd === void 0) { allEnd = function () { }; }
        if (Object.prototype.toString.call(fns) !== '[object Array]') {
            throw new Error('fns must be an array');
        }
        if (fns.length === 0) {
            throw new Error('fns must be not empty');
        }
        if (fns.some(function (fn) { return Object.prototype.toString.call(fn) !== '[object Function]'; })) {
            throw new Error('fns must be an array of functions');
        }
        var iter = fns[Symbol.iterator]();
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var fnIndex, _a, value, done;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fnIndex = 0;
                        _b.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        if (['termination'].includes(this._status)) {
                            return [3 /*break*/, 3];
                        }
                        _a = iter.next(), value = _a.value, done = _a.done;
                        if (done) {
                            this._status = 'idle';
                            fnIndex = 0;
                            (allEnd && Object.prototype.toString.call(allEnd) === '[object Function]') && allEnd(this._tasks);
                            return [3 /*break*/, 3];
                        }
                        this._tasks = this._tasks.map(function (item) {
                            if (['finished'].includes(item.status)) {
                                item.status = 'pending';
                            }
                            return item;
                        });
                        return [4 /*yield*/, this.doTask(value, fnEnd, fnIndex)];
                    case 2:
                        _b.sent();
                        fnIndex++;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    };
    QueueClass.prototype.resetOneTasks = function (task, status) {
        if (status === void 0) { status = 'finished'; }
        this._tasks = this._tasks.map(function (one) {
            if (one.id === task.id) {
                one = __assign(__assign({}, one), { status: status, params: task.params });
            }
            return one;
        });
    };
    Object.defineProperty(QueueClass.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            if (['idle', 'running', 'termination'].includes(status)) {
                this._status = status;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QueueClass.prototype, "tasks", {
        get: function () {
            return this._tasks;
        },
        set: function (tasks) {
            if (Object.prototype.toString.call(tasks) !== '[object Array]') {
                throw new Error('tasks must be an array');
            }
            if (!tasks.every(function (task) { return Object.prototype.toString.call(task) === '[object Object]'; })) {
                throw new Error('tasks must be an array of objects');
            }
            if (!tasks.every(function (task) { return 'id' in task && 'status' in task && 'params' in task; })) {
                throw new Error('tasks must be an array of objects with id, status and params properties');
            }
            if (!tasks.every(function (task) { return (Object.prototype.toString.call(task.id) === '[object String]' ||
                Object.prototype.toString.call(task.id) === '[object Symbol]') ||
                Object.prototype.toString.call(task.status) === '[object String]' ||
                Object.prototype.toString.call(task.params) === '[object Object]'; })) {
                throw new Error('tasks must be an array of objects with id property of type string or symbol, status property of type string and params property of type object');
            }
            this._tasks = tasks;
        },
        enumerable: false,
        configurable: true
    });
    return QueueClass;
}());
exports.Queue = (0, single_1.single)(QueueClass);
