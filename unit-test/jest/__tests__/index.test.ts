import { handleStr, getData, forEach, mockedFn, after1000ms } from '../src/index'

jest.mock('../src/index', () => {
    // 获取真实的模块
    const originModule = jest.requireActual('../src/index');
    return {
        __esModule: true,
        ...originModule,
        mockedFn: jest.fn(() => '123')
    }
});

/**
 * 匹配器
 */

// toBe 内部使用Object.is来进行判断相等
test('测试 toBe', () => {
    expect(1 + 1).toBe(2);

    // 错误用例：a的引用和{one: 1} 引用不同
    // const a = { one: 1 };
    // expect(a).toBe({ one: 1 });
});

// toEqual 递归检查对象或数组的每个字段
test('测试 toEqual', () => {
    const a = { one: 1 };
    expect(a).toEqual({ one: 1 });
});

/**
 * 真值匹配
 *
 * 代码中的undefined, null, and false有不同含义，若你在测试时不想区分他们，可以用真值判断。
 * toBeNull 只匹配 null
 * toBeUndefined 只匹配 undefined
 * toBeDefined 与 toBeUndefined 相反
 * toBeTruthy 匹配任何 if 语句为真
 * toBeFalsy 匹配任何 if 语句为假
 *
 */

test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
});

test('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
});

/**
 * 修饰符
 * 
 * not 取反
 * resolves / rejects 用于处理异步代码
 */
test('handleStr的返回值，不是atest', () => {
    expect(handleStr('test')).not.toBe('atest');
})

test('测试resolve test', () => {
    return expect(Promise.resolve('test')).resolves.toBe('test');
})
// 同样可以使用async/await
test('测试resolve with async/await', async () => {
    await expect(Promise.resolve('test')).resolves.toBe('test');
    await expect(Promise.resolve('test1')).resolves.toBe('test1');
})

/**
 * 数字
 * 
 * toBeGreaterThan 大于
 * toBeGreaterThanOrEqual 大于等于
 * toBeLessThan 小于
 * toBeLessThanOrEqual 小于等于
 * toBeCloseTo 浮点数比较
 * 
 */

test('测试数字', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(4);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);

    // toBe and toEqual are equivalent for numbers
    expect(value).toBe(4);
    expect(value).toEqual(4);
});

test('测试浮点数', () => {
    const value = 0.1 + 0.2;
    // expect(value).toBe(0.3); // 浮点数比较
    expect(value).toBeCloseTo(0.3); // 浮点数比较
});

/**
 * 字符串
 * 
 * toMatch 正则匹配
 */

test('测试字符串', () => {
    expect(handleStr('test')).toMatch(/test/);
    expect(handleStr('test')).toMatch('custom');
});

/**
 * 数组
 * 
 * toContain 支持数组和可迭代对象
 */

test('测试数组', () => {
    const arr = ['test', 'jest'];
    expect(arr).toContain('test');
    expect(new Set(arr)).toContain('jest');
});

/**
 * 调用相关
 * 
 * toHaveBeenCalled
 * toHaveBeenCalledWith
 */
const lx = { pv: (cid?: string) => { } };
function pv(cid?: string) {
    if (cid) lx.pv(cid);
    lx.pv();
};

test('测试pv方法执行后，能正确调用lx.pv', () => {
    // 错误在哪里
    // pv();
    // lx.pv = jest.fn(); // 暂时忽略jest.fn用法
    // expect(lx.pv).toHaveBeenCalled();
});

test('测试pv方法执行后，lx.pv接受cid为参数', () => {
    const spy = jest.spyOn(lx, 'pv'); // 忽略spyOn方法
    pv('cid');
    expect(spy).toBeCalledWith('cid');
})

/**
 * 异步测试
 * 
 */

test('测试getData，返回{success: true}', async () => {
    // 方式1
    const res = await getData();
    expect(res).toEqual({ success: true });
    // 方式2
    await expect(getData()).resolves.toMatchObject({ success: true });
})

/**
 * 钩子函数
 */

describe('钩子函数应用', () => {
    let count = 0;
    beforeAll(() => {
        console.log('beforeAll');
    });
    beforeEach(() => {
        count = 0;
        console.log('beforeEach');
    });
    afterEach(() => {
        console.log('afterEach');
    });
    afterAll(() => {
        console.log('afterAll');
    });
    test('add', () => {
        count++;
        expect(count).toBe(1);
    });
    test('minus', () => {
        count--;
        expect(count).toBe(-1);
    });
});

/**
 * mock相关
 */

describe('mock功能', () => {
    test('mock forEach', () => {
        const mockFn = jest.fn(x => 42 + x);
        forEach([0, 1], mockFn);

        // console.log(mockFn.mock);
        // {
        //     calls: [ [ 0 ], [ 1 ] ],
        //     contexts: [ undefined, undefined ],
        //     instances: [ undefined, undefined ],
        //     invocationCallOrder: [ 1, 2 ],
        //     results: [ { type: 'return', value: 42 }, { type: 'return', value: 43 } ],
        //     lastCall: [ 1 ]
        // }

        // mock函数被执行2次
        expect(mockFn.mock.calls).toHaveLength(2);
        expect(mockFn.mock.results[0].value).toBe(42);
    });

    test('mock 返回值', () => {
        const myMock = jest.fn();
        // console.log(myMock());
        // undefined
        myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);
        // console.log(myMock(), myMock(), myMock(), myMock());
        // 10 'x' true true

        expect(myMock()).toBe(10);
        expect(myMock()).toBe('x');
        expect(myMock()).toBe(true);
        expect(myMock()).toBe(true);
    });

    test('mock 部分模块功能', () => {
        expect(handleStr('test')).toEqual('customtest');
        expect(mockedFn()).toEqual('123');
    })
});

describe("测试doMock", () => {
    beforeEach(() => {
        // 必须重置模块，否则无法再次应用 doMock 的内容
        jest.resetModules();
    })

    it('开发环境', () => {
        jest.doMock('../src/env', () => ({
            __esModule: true,
            config: {
                getEnv: () => 'dev'
            }
        }));

        const { config } = require('../src/env');

        expect(config.getEnv()).toEqual('dev');
    })

    it('正式环境', () => {
        jest.doMock('../src/env', () => ({
            __esModule: true,
            config: {
                getEnv: () => 'prod'
            }
        }));

        const { config } = require('../src/env');

        expect(config.getEnv()).toEqual('prod');
    })
});

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