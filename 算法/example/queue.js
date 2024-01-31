/**
 * 最近请求次数
 */

const recentCount1 = {
  queue: [],
  ping(t) {
    this.queue.push(t);
    const res = [];
    for (let index = 0; index < this.queue.length; index++) {
      const time = this.queue[index];
      if (time >= t - 3000 && time <= t) {
        res.push(time);
      }
    }
    console.log(res, res.length);
    return res.length;
  },
};

const RecentCounter = function () {
  this.q = [];
};

RecentCounter.prototype.ping = function (t) {
  if (!t) return null;
  this.q.push(t);
  while (this.q[0] < t - 3000) {
    this.q.shift();
  }
  console.log(this.q, this.q.length);
  return this.q.length;
};

const recentCount = new RecentCounter();

recentCount.ping(1);

recentCount.ping(100);

recentCount.ping(3001);

recentCount.ping(3002);
