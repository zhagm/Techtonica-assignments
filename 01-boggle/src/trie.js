const { englishDictionaryArray: words } = require("./words.js");

class TrieNode {
  constructor(val) {
    this.val = val;
    this.keys = new Map(); // stores key:value pairs of char:node
    this.end = false;
  }
  setEnd(set = true) {
    this.end = set;
  }
  isEnd() {
    return this.end;
  }
}

class Trie {
  constructor(name) {
    this.name = name;
    this.root = new TrieNode("root");
  }
  add(input, node = this.root) {
    input = input.toLowerCase();
    for (let i = 0; i <= input.length; i++) {
      if (i === input.length) {
        node.setEnd();
        return node;
      } else if (!node.keys.has(input[i])) {
        node.keys.set(input[i], new TrieNode(input[i]));
      }
      node = node.keys.get(input[i]);
    }
  }
  isWord(input) {
    input = input.toLowerCase();
    let node = this.root;
    for (let i = 0; i < input.length; i++) {
      if (!node.keys.get(input[i])) return false;
      node = node.keys.get(input[i]);
    }
    if (node.val === input[input.length - 1] && node.isEnd) return true;
    return false;
  }
}

let englishDictionaryTrie = new Trie("English Dictionary");
for (let word of words) {
  englishDictionaryTrie.add(word);
}

module.exports = { dictionary: englishDictionaryTrie };
