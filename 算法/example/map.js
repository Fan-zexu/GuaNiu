/** 两数之和 */
// nums = [2, 7, 11, 15] target = 9

// 时间复杂度O(n) n为nums的length
// 空间复杂度O(n)

const twoSum = (nums, target) => {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let num = target - nums[i];
    if (map.has(num)) {
      return [i, map.get(num)];
    }
    map.set(nums[i], i);
  }
};

/** 两个数组的交集 */
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
const intersection = function (nums1, nums2) {
  let map = new Map();
  let res = [];
  for (let i = 0; i < nums1.length; i++) {
    map.set(nums1[i], i);
  }
  for (let j = 0; j < nums2.length; j++) {
    if (map.has(nums2[j])) {
      res.push(nums2[j]);
      map.delete(nums2[j]);
    }
  }
  return res;
};

/**
 * 数组交集2
 * 题目要求：返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。
 * 示例 1：
 * 输入：nums1 = [1,2,2,1], nums2 = [2,2]
 * 输出：[2,2]
 * 示例 2:
 * 输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
 * 输出：[4,9]
 * 时间复杂度：O(m+n) m=>num1长度，n=>num2长度
 * 空间复杂度 O(min(m,n))
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
const intersect2 = function (nums1, nums2) {
  let map = new Map();
  let res = [];
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  for (const num1 of nums1) {
    if (map.has(num1)) {
      map.set(num1, map.get(num1) + 1);
    } else {
      map.set(num1, 1);
    }
  }

  for (const num2 of nums2) {
    const v = map.get(num2);
    if (v > 0) {
      res.push(num2);
      map.set(num2, v - 1);
    }
  }
  return res;
};
