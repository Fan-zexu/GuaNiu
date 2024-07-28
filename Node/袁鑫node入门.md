# nodejs

在我们执行`node a.js`之后，Node会启动一个进程，1个Js执行线程，但还有其他多个线程是底层node启动的，包括`fs``network`等

![node启动的单线程](./imgs/node-single-thread.jpg)