import { handleStr, getData } from '../src/index'

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
const lx = { pv: (cid?: string) => {} };
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
    const res = await getData();
    expect(res).toEqual({success: true});
})