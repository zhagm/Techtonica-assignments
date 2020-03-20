class Stack {
  constructor() {
    this.array = [];
    this.top = 0;
  }

  push(element) {
    return (this.top = this.array.push(element));
  }

  isEmpty() {
    return this.top === 0;
  }

  pop() {
    if (this.top === 0) return "underflow";
    return this.array.pop();
  }
}

// TESTS
let stack = new Stack();
console.log(`stack.isEmpty() -> ${stack.isEmpty()} (true)`);
console.log(
  `stack.push("OMH") -> ${stack.push("OMH")} (1), [${stack.array}] (["OMH"])`
);
console.log(`stack.isEmpty() -> ${stack.isEmpty()} (false)`);
console.log(`stack.pop() -> ${stack.pop()} ("OMH")`);
