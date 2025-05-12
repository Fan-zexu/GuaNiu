/**
 * 用户要上传100张图片，但是服务器限制同时最多上传5张图片（处理5个请求），如何实现？
 */
class DynamicQueue {
  constructor(maxConcurrency) {
    this.max = maxConcurrency;
    this.queue = [];
    this.activeCount = 0;
  }

  add(taskFn) {
    return new Promise((resolve, reject) => {
      const wrapperTask = async () => {
        try {
          this.activeCount++;
          resolve(await taskFn());
        } catch (error) {
          reject(error);
        } finally {
          this.activeCount--;
          this._next();
        }
      };
      this.queue.push(wrapperTask);
      this._next();
    });
  }

  _next() {
    while (this.activeCount < this.max && this.queue.length) {
      const task = this.queue.shift();
      task();
    }
  }
}
