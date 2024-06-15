# Beacon Api

## 是什么

[MDN官网](https://developer.mozilla.org/zh-CN/docs/Web/API/Beacon_API)

## 可以干什么

做一些到达点可靠性的保障

举个例子：发送埋点请求，当页面被卸载时，会出现埋点请求被中断等导致的发送失败问题。

使用这个API，浏览器会保证在页面卸载前，将信标请求初始化并运行完成。

比如在一些要求埋点准确性的场景，比如广告的计费，埋点上报数据必须可以被服务端接受，此时就可以使用Beacon API 来对异常情况进行兜底，确保数据可以正常上报

## 怎么用

[Navigator.sendBeacon()](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon)