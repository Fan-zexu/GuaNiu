# 写在前面

说实话很多前端开发都不怎么写单元测试，为什么？因为大部分时间我们都在写业务代码，频繁变动的需求，频繁调整的 UI。早晨写完单测，下午就跑不通了:smile:，很真实。再一个，时间紧任务重，哪来的时间写单测。

---

我们平常肯定会看到各种理论，像什么 TDD/BDD，各种人在描述单测的优势、不同场景用什么单测姿势。这些在我看来也就看看得了，其实我理解真正写单测的场景无非就是一些独立的 libary，一些通用的库。补充好单测，看着绿油油 100%的单测覆盖率，能提供库的整体逼格，让别人用起来会感觉到靠谱，这就完事了~

---

一般在实现一些独立类库的时候，通常你会做一些前期设计，这些设计可能是一大堆的 wiki...，这里其实你就可以将它们换成单测用例，写好单测用例就等于设计好功能，再去实现功能，之后再来执行用例，通过了就说明你的实现 1 比 1 还原设计~~~ 其实还有一个好处，你会发现你的代码真正做到了所谓的可被测试，每个函数，每个类，都是功能单一且干净整洁，这样不就变相可以减少 bug 么，完美~

# 自己写单测

单测需要关注两个值，一个**期望值**，一个**结果值**。看下面这个例子，怎么对它进行测试

## 最简单的

```javascript
function handleStr(str) {
    return 'custom' + str;
}

const result = handleStr('test');
const value = 'atest';
if(result !== value) {
    throw Error(`handleStr 结果应为${value}, 但实际结果为${result}`);
}
```

通过 result/value 值对比，实现了函数的测试。但上面的形式，要写很多if/else，不利于使用

## 简化一下

下面我们对其进行优化，封装成一个函数，使得写一行代码就可以完成测试

```js

function expect(result) {
    return {
        toBe(value) {
            if (result !== value) {
                throw Error(`结果应为${value}, 但实际结果为${result}`);
            }
            console.log('测试通过');
        }
    }
}

// 失败
expect(handleStr('test')).toBe('atest');
// 成功
expect(handleStr('test')).toBe('customtest');
```

## 再清晰一点

希望清楚看到测试的是什么、它和结果的对应关系是怎样的

``` js

function test(msg, fn) {
    try {
        fn();
        console.log(msg + '，测试通过');
    } catch (error) {
        console.log(msg + '，测试未通过' + error);
    }
}

test('测试handleStr方法是否返回正确', () => {
    // 成功
    expect(handleStr('test')).toBe('customtest');
    // 失败
    expect(handleStr('test')).toBe('atest');
});

```

以上就是Jest中常见的单测用法。


# Jest 介绍

Jest 是一个基于 JavaScript 的前端单元测试框架，由 Facebook 开发并维护。自己的特点优势：

- 运行速度快
- 内置丰富的断言库，易于编写测试用例
- 可以在浏览器或 Node.js 环境中运行
- 适合测试 React 应用和 API
- 自带代码覆盖率检查功能
- 支持快照
- mock能力强大
## 主流的测试框架
### Mocha

- 灵活，可与其它库进行整合
- 支持异步测试
- 测试报告丰富

### Jasmine

- 内置了一些断言库，可直接使用
- 支持 BDD 测试风格
- 支持异步测试

# 怎么用 Jest

## 初始化

```js
// 依赖
yarn add -D jest
// 初始化
npx jest --init
// 经过一些询问，生成Jest.config.js
```
jest.config 文件可以作为使用文档来参考

## babel配置

es6依赖
```
yarn add -D babel-jest @babel/core @babel/preset-env
```

ts依赖
```
yarn add -D @babel/preset-typescript ts-jest @types/jest
```

.babelrc

```json
{
    "presets": [
        // 数组的第二项为插件的配置项
        [
            "@babel/preset-env",
            {
                // 根据 node 的版本号来结合插件对代码进行转换
                "targets": {
                    "node": "current"
                }
            }
        ],
        [
            "@babel/preset-typescript"
        ]
    ]
}

```

## 生成报告

第一种方式
```
npx jest --coverage
```
**推荐** 第二种方式 
```js
// jest.config.js配置
export default {
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: [
        "json",
        "text",
        "lcov",
        "clover",
        "html",
    ],
}
```
## 常用功能
### 关于环境
jest默认提供了node和dom浏览器，2种运行环境，可以通过`jest.config.js`中的`testEnvironment`字段进行配置
```js
module.exports = {
  testEnvironment: "jsdom", // 默认是node
}
```
### 前置钩子
jest提供了2个可以在单测开始前执行的钩子函数，`setupFilesAfterEnv`和`setupFiles`。看图可以明白它们各自的执行时机不同。

![图片](./images/setupFiles-vs-setupFilesAfterEnv.png)

各自的使用场景：
- `setupFiles`中可以进行全局变量的设置
- `setupFilesAfterEnv`中可以引入和配置jest相关的插件。如果在`setupFiles`中使用插件，则可能会得到`expect is not define`的提示。


### 匹配器
#### 相等
- toBe
```js
// toBe 内部使用Object.is来进行判断相等
test('测试 toBe', () => {
    expect(1 + 1).toBe(2);
    
    // 错误用例：a的引用和{one: 1} 引用不同
    const a = { one: 1 };
    expect(a).toBe({ one: 1 });
})
```
- toEqual
```js
// toEqual 递归检查对象或数组的每个字段
test('测试 toEqual', () => {
    const a = { one: 1 };
    expect(a).toEqual({ one: 1 });
})
```
#### 真值
代码中的undefined, null, and false有不同含义，若你在测试时不想区分他们，可以用真值判断。

- toBeNull 只匹配 null
- toBeUndefined 只匹配 undefined
- toBeDefined 与 toBeUndefined 相反
- toBeTruthy 匹配任何 if 语句为真
- toBeFalsy 匹配任何 if 语句为假

#### 数字比较
- toBeGreaterThan 大于
- toBeGreaterThanOrEqual 大于等于
- toBeLessThan 小于
- toBeLessThanOrEqual 小于等于
- toBeCloseTo 浮点数比较

#### 字符串
- toMatch 支持字符串匹配 | 支持正则
```js
test('测试字符串', () => {
    expect(handleStr('test')).toMatch(/test/);
    expect(handleStr('test')).toMatch('custom');
});
```
#### 数组和可迭代对象
- toContain
```js
test('测试数组', () => {
    const arr = ['test', 'jest'];
    expect(arr).toContain('test');
    expect(new Set(arr)).toContain('jest');
});
```

#### 调用相关

- toHaveBeenCalled alias: toBeCalled
匹配被调用了

```js
const lx = { pv: () => {} };
function pv() {
    lx.pv();
}

test('测试pv方法执行后，能正确调用lx.pv', () => {
    pv();
    lx.pv = jest.fn();
    expect(lx.pv).toHaveBeenCalled();
});
```
- toHaveBeenCalledWith alias: toBeCalledWith
匹配以什么参数被调用了
```js
const lx = { pv: (cid?: string) => {} };
function pv(cid?: string) {
    if (cid) lx.pv(cid);
    lx.pv();
};

test('测试pv方法执行后，lx.pv接受cid为参数', () => {
    const spy = jest.spyOn(lx, 'pv');
    pv('cid');
    expect(spy).toBeCalledWith('cid');
})
```
### 修饰符
- .not
- .resolve
- .reject

### 异步测试
可以使用async/await处理异步

```js
test('测试getData，返回{success: true}', async () => {
    // 方式1
    const res = await getData();
    expect(res).toEqual({success: true});
    // 方式2
    await expect(getData()).resolves.toMatchObject({success: true});
})
```

### 钩子函数

可以当做用例的生命周期来理解。主要包括：

- beforeAll: 所有用例执行前执行
- beforeEach: 每个用例执行前执行
- afterEach: 每个用例执行后执行
- afterAll: 所有用例执行后执行
### Mock（重点功能）
非常常用且重要的功能，帮助我们在单测中模拟函数及其返回值，模拟三方包等。
#### jest.fn(implementation?)
`jest.fn()`返回一个新的、未曾调用过的mock函数。它可以用于验证函数的调用、参数以及返回值。

**.mock属性**
所有mock函数都有这个属性，它保存了关于此函数如何被调用、调用时的返回值的信息。
- mockFn.mock.calls: 保存了函数调用时的参数，是一个数组，长度表示调用次数。数组中的每一项是一个数组，表示每次调用时的参数。
- mockFn.mock.results: 保存了函数调用时的返回值，是一个数组。数组中的每一项是一个对象，表示每次调用时的返回值。
- mockFn.mock.instances: 保存了函数调用时的this，是一个数组。数组中的每一项是一个对象，表示每次调用时的this。
- mockFn.mock.contexts: 保存了函数调用时的上下文，是一个数组。数组中的每一项是一个对象，表示每次调用时的上下文。
- mockFn.mock.lastCall: 保存了函数最后一次调用时的参数，是一个数组。

**mock的返回值**
- mockReturnValue(Once) 定义返回值
- mockResolvedValue(Once) 自定义Promise返回
- mockImplementation 定义mock函数实现，和`jest.fn(implementation)`功能相同

#### jest.spy()
区别于jest.fn，spy函数可以监听特定对象上的方法，并可以对其进行修改、追踪和验证。
参考上面这个demo
```js
test('测试pv方法执行后，lx.pv接受cid为参数', () => {
    const spy = jest.spyOn(lx, 'pv'); // 忽略spyOn方法
    pv('cid');
    expect(spy).toBeCalledWith('cid');
})
```
#### mock模块
比如有一个api请求的功能，内部使用`axios`库实现，实际上我们不关心请求过程的发生，而是关注返回的结果。这样我们就可以使用`jest.mock`来模拟`axios`的返回值。看下面这个例子。
```js
// fetchData.ts
export const fetchData = async () => {
    const res = await axios.get('http://www.dell-lee.com/react/api/demo.json');
    return res.data;
}

// fetchData.test.ts
import axios from 'axios';
import { fetchData } from './fetchData';
jest.mock('axios');

test('测试fechData', () => {
    const res = {
        data: '123'
    };
    // 这里会有ts报错
    axios.get.mockResolvedValue(res);
    return fetchData().then(data => {
        expect(data).toEqual(res.data);
    });
});
```
上面代码会存在ts报错，原因是axios.get中是没有`jest`相关方法的类型定义的，报错如下
`TS2339: Property 'mockResolveValues' does not exist on type '  >(url: string, config?: AxiosRequestConfig | undefined) => Promise '.
`
解决办法是可以通过 jest.spyOn 来解决
```js
jest.spyOn(axios, 'get').mockResolvedValue(res);
```

**这里有一个细节**，`jest.mock`会被提升到最顶部，也就是所有import之前。
#### mock部分依赖
当我们通过 `jest.mock('./index')`，这样会导致`index`文件中的所有方法都被mock掉，如何只mock部分方法呢？看下面这个例子。
```js
// test.ts
import { handleStr, getData } from './index';

jest.mock('./index', () => {
    // 获取真实的模块
    const originModule = jest.requireActual('./index');
    return {
        __esModule: true,
        ...originModule,
        getData: jest.fn(() => '123')
    }
});

test('测试模拟部分模块', () => {
    expect(handleStr('test')).toEqual('customtest');
    expect(getData()).toEqual('123');
});
```
上面使用了`jest.requireActual`来获取真实的模块，然后通过`jest.fn`来模拟`getData`方法。

由于使用`jest.mock`会被提升到文件顶部，这也导致我们无法再次修改Mock的实现，可以理解为**一次性mock**

所以如果我们想进行多次mock，比如针对不同环境、不同变量来mock，这样我们就可以用`doMock`来解决。
#### 多次mock doMock 
jest提供的另一个api `jest.doMock`，它也会执行Mock操作，但是不会被提升。再加上`require`函数，就可以实现多次mock。

当然也可以使用`spyOn`来实现。可以自己尝试

#### Mock Timer
这里介绍关于定时器的模拟，看官网示例
```js
// after1000ms函数
type AnyFunction = (...args: any[]) => any;

const after1000ms = (callback?: AnyFunction) => {
  console.log("准备计时");
  setTimeout(() => {
    console.log("午时已到");
    callback && callback();
  }, 1000);
};

// test
import { after1000ms } from "../src/index";

describe("after1000ms", () => {
  it("可以在 1000ms 后自动执行函数", (done) => {
    after1000ms(() => {
      expect("???");
      done();
    });
  });
});
```
这样的实现，需要干等1秒钟之后，才能完成测试用例，不太理想。我们看下官方的解决方案：
```js
import { after1000ms } from "../src/index";

describe("after1000ms", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("可以在 1000ms 后自动执行函数", () => {
    jest.spyOn(global, "setTimeout");
    const callback = jest.fn();
    
    expect(callback).not.toHaveBeenCalled();

    after1000ms(callback);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
  });
});
```
- 使用 `jest.useFakeTimers`模拟定时器
- 使用 `jest.spyOn`来监听`setTimeout`方法
- 使用 `jest.fn`模拟callback函数，同时断言在开始时，callback并未执行
- 使用 `jest.runAllTimers`来**快进**定时器

所以整体测试流程是：模拟 -> 执行 -> 快进 -> 断言

#### Mock logger
有时候我们在执行功能代码时，会被代码中的console信息干扰，这时候我们就可以通过`jest.spy`来屏蔽这些干扰

方案1：通过`jest.spy`模拟，这里注意代码位置在执行测试用例之前的时机。可以是 `setupFilesAfterEnv`或者 `setupFiles`的钩子中
```js
// test/jest-setup
jest.spy(console, 'log').mockRetureValue();
jest.spy(console, 'info').mockRetureValue();
jest.spy(console, 'error').mockRetureValue();
jest.spy(console, 'warn').mockRetureValue();
```

方案2：使用[jest-mock-console](https://www.npmjs.com/package/jest-mock-console)，在`jest-setup`文件中引入
```js
import mockConsole from "jest-mock-console";

mockConsole()
```
### 组件测试
以后用到了再写吧
# Jest 的设计
