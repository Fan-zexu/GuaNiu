// 简单类型
let val = 1;

const setVal = (newVal) => {
    val = newVal;
}

let obj = {
    val: 1   
}

const setObjVal = (newVal) => {
    obj.val = newVal;
}

module.exports = {
    val,
    setVal,
    obj,
    setObjVal
}