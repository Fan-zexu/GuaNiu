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

/**
 * 最小覆盖字符
 *
 * 输入：s = "ADOBECODEBANC", t = "ABC"
 * 输出："BANC"
 *
 * 示例 2：
 * 输入：s = "a", t = "a"
 * 输出："a"
 * 解释：整个字符串 s 是最小覆盖子串。
 *
 * 输入: s = "a", t = "aa"
 * 输出: ""
 * 解释: t 中两个字符 'a' 均应包含在 s 的子串中，因此没有符合条件的子字符串，返回空字符串。
 *
 * 时间复杂度 O(m + n) m是t的长度 n是s的长度
 * 空间复杂度 O(k) k是字符串中不重复字符的个数
 */

const minWindow = (s, t) => {
  // 双指针定义滑动窗口
  let l = 0;
  let r = 0;

  // 建立一个字典
  const need = new Map();

  // 遍历t，记录字符出现的次数
  for (const c of t) {
    need.set(c, need.has(c) ? need.get(c) + 1 : 1);
  }

  let needType = need.size;

  // 记录最小字符串
  let res = "";

  // 移动右指针
  while (r < s.length) {
    // 获取当前字符串
    const c = s[r];

    // 如果字典里有这个字符c
    if (need.has(c)) {
      // 减少字典里的次数
      need.set(c, need.get(c) - 1);

      // 如果字典中字符次数为0，则减少字典条数
      if (need.get(c) === 0) needType -= 1;
    }

    // 如果字典中所有字符次数都为0，则说明找到了最小字符串
    while (needType === 0) {
      // 取出当前符合要求的子串
      const newRes = s.substring(l, r + 1);

      // 如果当前子串长度是小于上次子串长度 就覆盖
      if (!res || newRes.length < res.length) res = newRes;

      // 获取左指针的字符
      const c2 = s[l];

      // 如果字典里有这个字符
      if (need.has(c2)) {
        // 增加字典里面的次数
        need.set(c2, need.get(c2) + 1);

        // 增加字典条数
        if (need.get(c2) === 1) needType += 1;
      }

      l += 1;
    }

    // 移动右指针
    r += 1;
  }

  return res;
};
