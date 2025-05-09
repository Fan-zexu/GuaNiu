// promise的sleep 函数
function sleep(second) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("sleep suc");
    }, second);
  });
}

const p1 = Promise.resolve("suc");
const p2 = Promise.reject("fail");
const p3 = Promise.reject("fail3");
const sleep1 = sleep(2000);
// Promise.all

// Promise.allSettled
Promise.allSettled([p1, p2, sleep1])
  .then((res) => {
    console.log("Promise.allSettled,,,", res);
  })
  // 这里不会执行catch
  .catch((e) => {
    console.log("allSettled error", e);
  });

// race
// 只要有一个完成，就返回，不关心成功还是失败
Promise.race([p1, p2, sleep1])
  // Promise.race([p2, p3])
  .then((res) => {
    console.log("promise.race:::", res);
  })
  .catch((e) => {
    console.log("race error", e);
  });

// Promise.any
// 只要有一个成功就返回
// 如果全部失败，就抛出错误 【AggregateError: All promises were rejected】
// Promise.any([p2, p3]) // 全失败
Promise.any([p2, p3, sleep1])
  .then((res) => {
    console.log("Promise.any:::", res);
  })
  .catch((e) => {
    console.log("any error", e);
  });
