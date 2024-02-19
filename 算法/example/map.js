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
