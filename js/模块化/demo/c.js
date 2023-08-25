const myModule = {
    exports: {}
}

// 定义

let val = 1;

const setVal = (newVal) => {
    val = newVal;
}

myModule.exports = {
    val,
    setVal,
}

// 调用

const { val: useVal, setVal: useSetVal } = myModule.exports;

console.log(useVal); // 1

useSetVal(2);

console.log(useVal); // 2


