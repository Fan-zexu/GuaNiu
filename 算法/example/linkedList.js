const myInstanceof = (source, target) => {
  if (source === null) return false;
  let p = source;
  while (p) {
    if (p === target.prototype) return true;
    p = p.__proto__;
  }
  return false;
};

console.log(myInstanceof([], Array));
console.log(myInstanceof([], String));

// 删除有序链表重复元素
// 1 -> 1 -> 2 -> 3 -> 3
// 1 -> 2 -> 3 -> null

// 时间复杂度 O(n) n为链表的长度
// 空间复杂度 O(1)

var duplicateData = {
  val: 1,
  next: {
    val: 1,
    next: {
      val: 2,
      next: {
        val: 3,
        next: {
          val: 3,
          next: {
            val: 3,
            next: {
              val: 4,
              next: null,
            },
          },
        },
      },
    },
  },
};
const deleteDuplicates = (head) => {
  let p = head;

  while (p && p.next) {
    if (p.val === p.next.val) {
      // 删除下一个节点
      p.next = p.next.next;
    } else {
      p = p.next;
    }
  }

  return head;
};

const res = deleteDuplicates(duplicateData);
console.log("deleteDuplicates,,", res);

// 反转链表
// 1 -> 2 -> 3 -> 4 -> 5 -> null
// 5 -> 4 -> 3 -> 2 -> 1 -> null

// 时间复杂度 O(n) n为链表的长度
// 空间复杂度 O(1)

var reverseListData = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 4,
        next: {
          val: 5,
          next: null,
        },
      },
    },
  },
};

var reverseList = function (head) {
  // 创建一个指针
  let p1 = head;

  // 创建一个新指针
  let p2 = null;

  // 遍历链表
  while (p1) {
    // 创建一个临时变量
    const tmp = p1.next;

    // 将当前节点的下一个节点指向新链表
    p1.next = p2;

    // 将新链表指向当前节点
    p2 = p1;

    // 将当前节点指向临时变量
    p1 = tmp;
  }

  // 最后返回新的这个链表
  return p2;
};

const res1 = reverseList(reverseListData);
console.log("reverseList,,", res1);
