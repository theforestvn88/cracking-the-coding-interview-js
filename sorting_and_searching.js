//
// =============================================================================================================
//
//
//
// Cracking Interview 10.1
// Sorted Merge: You are given two sorted arrays, A and B, where A has a large enough buffer
// at the end to hold B. Write a method to merge B into A in sorted order.
//
function sortedMerge(a, b) {
	let ia = a.length - 1, ib = b.length - 1; 
	for (let i = 0; i <= ib; i++) a.push(undefined);

	let im = a.length - 1;
	while (ib >= 0) {
		if (a[ia] > b[ib]) {
			a[im] = a[ia];
			ia--;
		} else {
			a[im] = b[ib];
			ib--;
		}
		im--;
	}

	return a;
}

console.log(sortedMerge([1,2,6], [3,4,5]));


//
// ============================================================================================================
//
//
//
// Cracking Interview 10.2
// Group Anagrams: Write a method to sort an array of strings so that 
// all the anagrams are next to each other.
//
function groupAnagrams(strArr) { 
	return strArr.map(str => [str, [...str].sort().join()])
				.sort((s1, s2) => s1[1].localeCompare(s2[1]))
				.map(s => s[0]);
}

let strs = ["silent", "evil", "satan", "listen", "vile", "santa"];
console.log(groupAnagrams(strs));

//
// ===========================================================================================================
//
//
//
// Cracking Interview 10.3
// Search in Rotated Array: Given a sorted array of n integers that has been rotated an unknown
// number of times, write code to find an element in the array. You may assume that the array was
// originally sorted in increasing order.
// Example: Find 5 in {15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14} => 8
//
function find(element, arr, left = 0, right = null) {
	if (left > right) return;

	let middle = Math.floor((left + (right || arr.length - 1)) / 2);
	if (arr[middle] == element) return middle;
	if ((middle > 0 && arr[middle] < arr[middle - 1]) || 
			(middle < arr.length - 1 && arr[middle] > arr[middle + 1])) {
		let result = find(element, arr, 0, middle - 1);
		return result || find(element, arr, middle + 1, arr.length - 1);
	} else if (arr[middle] > element) {
		return find(element, arr, 0, middle - 1);
	} else if (arr[middle] < element) {
		return find(element, arr, middle + 1, arr.length - 1);
	}
}

console.log(find(5, [15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14]));


//
// ==========================================================================================================
//
//
//
// Cracking Interview 10.4
// Sorted Search, No Size: You are given an array-like data structure `Listy` which lacks a size method.
// It does, however, have an elementAt(i) method that returns the element at index i in O(1) time.
// If i is beyond the bounds of the data structure, it returns -1. (For this reason, the data structure
// only supports positive integers). Given a Listy which contains sorted, positive integers, find
// the index at which an element x occurs. If x occurs multiple times, you may return any index.
//
function Listy() {
	const items = [];
	return {
		add: function(x) {items.push(x);},
		elementAt: function(i) {
			return i >= 0 && i < items.length ? items[i] : -1;
		}
	}
}

function findE(x, listy, left = 0, right = 1) {
	let middle = Math.floor(left + right / 2);
	let middleE = listy.elementAt(middle);

	if (middleE == x) {
		return middle;
	} else if (middleE == -1) {
		if (right == 0) return null;
		return findE(x, listy, left, middle - 1);
	} else if (middleE > x) {
		return findE(x, listy, left, middle - 1);
	} else if (middleE < x) {
		return findE(x, listy, middle + 1, right + right);
	}
}

let listy = new Listy();
listy.add(1);
listy.add(2);
listy.add(3);
listy.add(4);
listy.add(5);
listy.add(6);
listy.add(7);

console.log(findE(6, listy));

//
// ==========================================================================================================
//
//
//
// Cracking Interview 10.5
// Sparse Search: Given a sorted array of strings that is interspersed with empty strings, 
// write a method to find the location of a given string.
// Example: find "b" in ["a", "", "", "b", "c", "", "", "d"] => 3
//
function sparseSearch(x, strs, left = 0, right = strs.length - 1) {
	if (left > right) return -1;
	
	let mid = Math.floor((left + right) / 2);
	if (strs[mid] == "") {
		// find closest non-empty element
		let midL = mid - 1, midR = mid + 1;
		while (midL >= left && midR <= right) {
			if (strs[midL] != "") {
				mid = midL;
				break;
			} else if (strs[midR] != "") {
				mid = midR;
				break;	
			}
			midL--;
			midR++;
		}

		if (midL < left || midR > right) return -1;
	}

	if (strs[mid] == x) {
		return mid;
	} else if (strs[mid] < x) {
		return sparseSearch(x, strs, mid + 1, right);
	} else if (strs[mid] > x) {
		return sparseSearch(x, strs, left, mid - 1);
	}
}

let fruits = ["apple", "", "", "banana", "", "", "", "lemon", "orange", ""];
console.log(sparseSearch("banana", fruits));
console.log(sparseSearch("lemon", fruits));

//
// ========================================================================================================
//
//
//
// Cracking Interview 10.6
// Sort Big File: Imagine you have a 20 GB file with one string per line.
// Explain how you would sort the file.
//

// We'll devide the file into chunks, which are x megabytes each, where x is the amount of memory we have
// available. Each chunk is sorted separately and then saved back to the file system.
// One all the chunks are sorted, we merge the chunks, one by one.
// This algorithm is known as `external sort`.





//
// ======================================================================================================
//
//
//
// Cracking Interview 10.7
// Missing Int: Given an input file with four billion non-negative integers, provide an algorithm to
// generate an integer that is not contained in the file. Assume you have 1 GB of memory available.
//
// Follow Up: What if you have only 10 MB of memory ? Assume that all the values are distinct and 
// we now have no more than one billion non-nagative integers.
//

// 1 non-negative integer = 4 bytes
// 1 billion ...........  = 4 GB
// 4 billion ...........  = 16 GB
//
// 8 billion bits         = 1 GB available
//
const NUMBER_OF_INTs = 16;//4000000000;
// node.js
async function findMissingInt(inputFilePath) {
	let fs = require('fs');
	let readLine = require('readline');
	let readStream = fs.createReadStream(inputFilePath);
	let rl = readLine.createInterface({input: readStream});
	
	// scan all numbers
	let bits = new Int8Array(NUMBER_OF_INTs / 8);
	for await (const num of rl) {
		bits[Math.floor(num / 8)] |= 1 << (num % 8);
	};

	// return the first missing number
	for (let i = 0; i < bits.length; i++) {
		for (let j = 0; j < 8; j++) {
			if ((bits[i] & (1 << j)) == 0 ) {
				console.log(`found ${i * 8 + j}`);
				readStream.close();
				return i * 8 + j;
			}
		}
	}
}

console.log("Cracking Interview 10.7");
findMissingInt("./ci_10_7.txt");

// Follow Up
// We could split (group) the input file's values into chunks,
// each chunk has range values corresponding to 0 -> chunkSize, chunkSize + 1 -> 2*chunkSize, ...
// and we also create array of counters, each counter corresponding to the number of appear numbers 
// in the chunk range value.
// Since now all the values are distinct, so if the counter is less than the chunkSize, we know 
// that chunk is missing some values.
//
// total number = 1 billion = 2^30 
// avail mem = 10 MB = 2^23 bytes
//
async function countNumInChunks(filePath, rangeSize) {
	let fs = require('fs');
	let readLine = require('readline');
	let readStream = fs.createReadStream(filePath);
	let rl = readLine.createInterface({input: readStream});

	let counter = []
	// counting
	for await (const num of rl) {
		let chunkIndex = Math.floor(num / rangeSize);
		counter[chunkIndex] = counter[chunkIndex] || 0;
		counter[chunkIndex]++;
	}
	
	readStream.close();
	return counter;
}

async function getBitVectorForChunk(filePath, startNum, endNum, rangeSize) {
	let fs = require('fs');
	let readLine = require('readline');
	let readStream = fs.createReadStream(filePath);
	let rl = readLine.createInterface({input: readStream});

	let bitVector = new Int8Array(Math.ceil(rangeSize/8));
	for await (const num of rl) {
		if (num >= startNum && num < endNum) {
			let offset = num - startNum
			bitVector[Math.floor(offset/8)] |= (1 << (offset % 8));
		}
	}
	
	readStream.close();
	return bitVector;
}

async function missingInt(filePath) {
	let rangeSize = 4;//(1 << 20); // 2^20 bits ~ 2^17 bytes
	let counter = await countNumInChunks(filePath, rangeSize);
	console.log(counter);
	// pick the first missing counter
	missingIndex = counter.findIndex((c) => c < rangeSize);
	let startNum = missingIndex * rangeSize;
	let endNum = startNum + rangeSize;
	let bitVector = await getBitVectorForChunk(filePath, startNum, endNum, rangeSize);
	// find the first zero bit
	for (let i = 0; i < bitVector.length; i++) {
		let byteI = bitVector[i];
		for (let j = 0; j < 8; j++) {
			if ((byteI & (1 << j)) == 0) {
				return startNum + i*8 + j;
			}
		}
	}
}

(async () => { 
 let missed = await missingInt("./ci_10_7.txt");
 console.log(missed);
})();


//
// ==========================================================================================================
//
//
//
// Cracking Interview 10.8
// Find Duplicates: You have an array with all the numbers from 1 to N, where N is at most 32.000.
// The array may have duplicate entries and you do not know what N is. With only 4 kb of memory
// available, how would you print all duplicates elements in the array ?
//
// 4 kb = 32.000 bits
//
async function printDuplicates(inputFile) {
	let fs = require('fs');
	let readline = require('readline')
	let readStream = fs.createReadStream(inputFile);
	let rl = readline.createInterface({input: readStream});

	// 4kb mem
	let bitVector = new Int32Array(32000 >> 5);
	for await (const num of rl) {
		let vectorIndex = num >> 5;
		let bitIndex = num & 0x1F; // mod 32
		if ((bitVector[vectorIndex] & (1 << bitIndex)) != 0) { // check bit 1
			console.log(`dup: ${num}`);
		} else {
			bitVector[vectorIndex] |= (1 << bitIndex); // flip bit 1
		}
	}
}

printDuplicates("./ci_10_8.txt");


//
// =======================================================================================================
//
//
//
// Cracking Interview 10.9
// Sorted Matrix Search: Given an MxN matrix in which each row and each column is sorted in ascending order,
// write a method to find an element.
//
function findElement(e, matrix, top, bot, left, right) {
	if (top > bot || left > right) return;
	let rowMid = Math.floor((top + bot) / 2);
	let colMid = Math.floor((left + right) / 2);

	if (matrix[rowMid][colMid] == e) return [rowMid, colMid];

	if (matrix[rowMid][colMid] > e && matrix[0][colMid] > e) { // top-left quarter
		return findElement(e, matrix, top, rowMid, left, colMid - 1);
	} else if (matrix[rowMid][colMid] > e && matrix[0][colMid] <= e) { // top-right
		return findElement(e, matrix, top, rowMid - 1, colMid, right);
	} else if (matrix[rowMid][colMid] < e && matrix[bot][colMid] >= e) { // bot-left
		return findElement(e, matrix, rowMid + 1, bot, left, colMid);
	} else if (matrix[rowMid][colMid] < e && matrix[bot][colMid] < e) { // bot-right
		return findElement(e, matrix, rowMid, bot, colMid + 1, right);
	}
}

let matrix = [
	[1, 2, 3, 4, 5, 6],
	[8, 9, 10, 11, 12, 13],
	[14, 15, 16, 17, 18, 19]
];

console.log(findElement(15, matrix, 0, 2, 0, 5));


//
// =====================================================================================================
//
//
//
// Cracking Interview 10.10
// Rank from Stream: Imagine you are reading in a stream of integers. Periodically, you wish to be
// able to look up the rank of a number x (the number of values less than or equal to x).
// Implement the data structures and algorithms to support these operations. That is, implement
// the method `track(int x)`, which is called when each number is generated, and the method
// `getRankOfNumber(int x)`, which returns the number of values less than or equal to x 
// (not including x itself).
//
// Example: Stream (in order of appearence): 5, 1, 4, 4, 5, 9, 7, 13, 3
// getRankOfNumber(1) = 0
// getRankOfNumber(3) = 1
// getRankOfNumber(4) = 3
//

// since this is stream we may want
// O(1) track
let appearence = [];
let ranking = [];

function track(x) {
	appearence.push(x);
	ranking[x] = ranking[x] || 0;
	ranking[x]++;
}

// O(n) get
function getRankOfNumber(x) {
	return ranking.slice(0, x).reduce((acc, a) => acc + a, 0)
					+ (ranking[x] > 1 ? 1 : 0);
}

track(5);
track(1);
track(4);
track(4);
track(5);
track(9);
track(7);
track(13);
track(3);

console.log(`rank of 1: ${getRankOfNumber(1)}`);
console.log(`rank of 3: ${getRankOfNumber(3)}`);
console.log(`rank of 4: ${getRankOfNumber(4)}`);

// in order to achive
// O(logn) track & O(logn) get
// we could use a balanced tree
//
function RankNode(x) {
	this.val = x;
	this.rank = 0;
	this.left = null;
	this.right = null;

	this.insert = function(num) {
		if (this.val >= num) {
			this.rank++;
			if (this.left) {
				this.left.insert(num);
			} else {
				this.left = new RankNode(num);
			}
		} else {
			if (this.right) {
				this.right.insert(num);
			} else {
				this.right = new RankNode(num);
			}
		}
	}

	this.getRankOfNumber = function(num) {
		if (num == this.val) {
			return this.rank;
		} else if (num < this.val) {
			if (this.left) return this.left.getRankOfNumber(num);
			return -1;
		} else {
			if (this.right) return this.rank + this.right.getRankOfNumber(num) + 1;
			return -1;
		}
	}
}

function Rank() {
	root = null;

	return {
		track: function(x) {
			if (!root) {
				root = new RankNode(x);
			} else {
				root.insert(x);
			}
		},
		getRankOfNumber(x) {
			return root.getRankOfNumber(x);
		}
	}
}

let rank = new Rank();
rank.track(5);
rank.track(1);
rank.track(4);
rank.track(4);
rank.track(5);
rank.track(9);
rank.track(7);
rank.track(13);
rank.track(3);
console.log(`rank of 1: ${rank.getRankOfNumber(1)}`);
console.log(`rank of 3: ${rank.getRankOfNumber(3)}`);
console.log(`rank of 4: ${rank.getRankOfNumber(4)}`);


//
// =======================================================================================================
//
//
//
// Cracking Interview 10.11
// Peaks and Valleys: In an array if integers, a "peak" is an element which is greater than or equal
// to the adjacent integers and a "valley" is an element which is less than or equal to the adjacent
// integers. For example, in the array [5,8,6,2,3,4,6], [8,6] are peaks and [5,2] are valleys. 
// Given an array of integers, sort the array into an alternating sequence of peaks and valleys.
// Example:
// Input: 	[5,3,1,2,3]
// Output:  [5,1,3,2,3]
//
function peaksAndValleys(arr) {
	for (let i = 1; i < arr.length; i+=2) {
		let x = arr[i-1];
		let y = arr[i];
		let z = i + 1 >= arr.length ? Number.MIN_VALUE : arr[i+1];
		let max = Math.max(x, y, z);
		if (max == x) {
			let temp = arr[i];
			arr[i] = x;
			arr[i-1] = temp;
		} else if (max == z) {
			let temp = arr[i];
			arr[i] = z;
			arr[i+1] = temp;
		}
	}	
}

let arr = [5,3,1,2,3];
peaksAndValleys(arr);
console.log(arr);
