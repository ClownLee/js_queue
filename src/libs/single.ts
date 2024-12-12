/**
 * 单例模式
 * @param className 类
 * @returns 单例类
 */
export function single(className: any) {
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