function handleStr(str) {
    return 'custom' + str;
}

// 简化版
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
// expect(handleStr('test')).toBe('atest');
// 成功
// expect(handleStr('test')).toBe('customtest');


// 优化一下，看清测试内容和结果的对应关系
function test(msg, fn) {
    try {
        fn();
        console.log(msg + '，测试通过');
    } catch (error) {
        console.log(msg + '，测试未通过' + error);
    }
}

// demo
test('测试handleStr方法是否返回正确', () => {
    // 成功
    expect(handleStr('test')).toBe('customtest');
    // 失败
    expect(handleStr('test')).toBe('atest');
});

// describe
function describe(msg, fn) {
    console.log(msg);
    fn();
}

// demo
describe('测试通用函数', () => {
    test('测试handleStr方法是否返回正确', () => {
        expect(handleStr('test')).toBe('customtest');
    });
})
