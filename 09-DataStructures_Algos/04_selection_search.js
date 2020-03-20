// 4. Implement Selection Sort
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let smallestValIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[smallestValIndex]) smallestValIndex = j;
    }
    if (smallestValIndex !== i) {
      let hold = arr[i];
      arr[i] = arr[smallestValIndex];
      arr[smallestValIndex] = hold;
    }
  }
  return;
}

let arr = [1, 8, 2, 4, 5];
selectionSort(arr);
console.log(arr, " should be (next line) \n[ 1, 2, 4, 5, 8 ]");
