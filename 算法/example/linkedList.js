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
console.log("deleteDuplicates,,", deleteDuplicates);
