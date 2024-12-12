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
exports.single = single;
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
