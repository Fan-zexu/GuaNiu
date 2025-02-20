# [88. 合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/description/?envType=study-plan-v2&envId=top-interview-150)

首次解题

```js
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    if (m === 0 && n === 0) {
        nums1 = [];
    }
    if (m === 0 && n !== 0) {
        for(var i =0; i < nums2.length; i++) {
            nums1.splice(m+i, 1, nums2[i]);
        }
    }

    // -> 1.0
    // const total = nums1.concat(nums2);
    // total.sort();

    // nums1 = total.filter((a) => a !== 0);


    // 2.0
    if (n !== 0) {
        for(var i =0; i < nums2.length; i++) {
            nums1.splice(m+i, 1, nums2[i]);
        }

        if (m !== 0) {
            nums1.sort((a,b) => a - b);
        }
    }
};
```

题解后：

方法1：直接合并，然后排序

```js
var merge = function(nums1, m, nums2, n) {
    nums1.splice(m, n, ...nums2);
    nums1.sort((a, b) => a - b);
}
```

时间复杂度：O((m + n) * log(m + n)) 

1、第一行

主要是`...` 对于`nums2`的展开，所以复杂度是O(n)

2、第二行

一般`sort`算法内部都是基于快排、归并、堆排序。这些算法时间复杂度是O(k * log(k))
