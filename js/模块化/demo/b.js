// 简单类型引用
const { val, setVal } = require('./a.js');

console.log(val); // 1

setVal(2);

console.log(val); // 1

// 引用类型
const { obj, setObjVal } = require('./a.js');

console.log(obj.val); // 1

setObjVal(2);

console.log(obj.val); // 2