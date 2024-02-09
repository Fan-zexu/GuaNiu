/**
 * 集合
 */

// 数组取交集

var a1 = [1, 2, 3, 4, 5, 7, 1];
var a2 = [2, 3, 4, 6, 7, 8];

// 简化版
const intersection = (arr1, arr2) => {
  // 先取交集，再去重
  return [...new Set(arr1.filter((item) => arr2.includes(item)))];
};

console.log("优化版交集：", intersection(a1, a2));
