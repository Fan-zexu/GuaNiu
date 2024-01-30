/**
 * 10进制转2进制
 */

// 时间复杂度 O(n) n为二进制的长度
// 空间复杂度 O(n) n为二进制的长度
const dec2bin = (dec) => {
  // 创建一个字符串
  let res = "";

  // 创建一个栈
  let stack = [];

  // 遍历数字 如果大于0 就可以继续转换2进制
  while (dec > 0) {
    // 将数字的余数入栈
    stack.push(dec % 2);

    // 除以2
    dec = dec >> 1;
  }

  // 取出栈中的数字
  while (stack.length) {
    res += stack.pop();
  }

  // 返回这个字符串
  return res;
};

dec2bin(10);

/**
 * 判断字符串的有效括号
 */

const isValidKH = (str) => {
  // 如果不是偶数，也就是不是成对出现，就返回false
  if (str.length % 2 !== 0) return false;

  const stack = [];
  // 如果碰见左括号，就入栈
  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    if (["(", "{", "["].includes(s)) {
      stack.push(s);
    } else {
      const top = stack.pop();
      if (s === ")" && top !== "(") return false;
      if (s === "}" && top !== "{") return false;
      if (s === "]" && top !== "[") return false;
    }
  }
  return true;
};

isValidKH("()[]{}");

isValidKH("(]");

isValidKH("}");
