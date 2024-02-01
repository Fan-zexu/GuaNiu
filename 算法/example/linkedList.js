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
