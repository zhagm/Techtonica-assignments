class Node {
  constructor(data = null, next = null) {
    this.data = data;
    this.next = next;
  }

  getLength() {
    let count = 0;
    let current = this.data;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  }
}

const n = new Node("there");
console.log(n.data);
console.log(n.next);
const n2 = new Node("Hi");
n2.next = n;
console.log(n2.next);
