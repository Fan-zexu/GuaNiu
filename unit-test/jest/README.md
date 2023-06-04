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
## 基础用法
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


## 进阶功能


# Jest 的设计
