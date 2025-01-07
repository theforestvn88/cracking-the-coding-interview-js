// =========================================================================================
// Cracking Interview 1.1 
// checking if a string has all unique characters
//

function isUniqueChars(str) {
	// ask if the input string is an ASCII string or Unicode string
	// if ASCII string, the appearance below could be 
	// a boolean array [256 characters] or a bit vector
	// otherwise, it should be a hash table.
	let appearance = {};
	for (const c of str) {
		if (appearance[c]) return false;
		appearance[c] = true;
	}
	return true;
}

console.log("UNIQUE ...");
console.log(isUniqueChars("xyz"));
console.log(isUniqueChars("xyztmnpqrtuvw"));

// bit vector
// strict input a-z
function isUnique(str) {
	let vector = 0;
	for (const c of str) {
		const index = c - 'a';
		const indexVector = 1 << index;
		if ((vector & indexVector) > 0) return false;
		vector |= indexVector;
	}
}

console.log(isUniqueChars("xyz"));
console.log(isUniqueChars("xyztmnpqrtuvw"));

// what if you can not use additional data structures ?
function isUniq(str) {
	// first sort
	let sortedStr = Array.from(str);
	let size = sortedStr.length;
	for (let i = size - 1; i > 0; i--) {
		for (let j = 0; j < i; j++) {
			if (sortedStr[j + 1] > sortedStr[j]) {
				let temp = sortedStr[j+1];
				sortedStr[j+1] = sortedStr[j];
				sortedStr[j] = temp;
			}
		}
	}

	// then linearly check the string for neighboring chareacters that are identical
	for (let k = 0; k < size - 2; k++) {
		if (sortedStr[k] === sortedStr[k+1]) return false;
	}
	return true;
}

console.log(isUniq("xyz"));
console.log(isUniq("xyztmnpqrtuvw"));

// =========================================================================================
//
//
//
//
//
// Cracking Interview 1.2 
// given a string, write a method to decide if one is a permutation of the other.
//
function isPermutation(str1, str2) {
	// ask if the case-sensitive or whitespace is significant.
	if (str1.length !== str2.length) return false;
	let counter = {};
	for (const c of str1) {
		counter[c] = counter[c] || 0;
		counter[c]++;
	}

	for (const x of str2) {
		if (counter[x]) counter[x]--;
	}

	return Object.values(counter).reduce((acc, curr) => acc += curr, 0) === 0;
}

console.log("PERMUTATION ...");
let str1 = "xyztx";
let str2 = "txzyx";
console.log(isPermutation(str1, str2));
let str3 = "xyztxt";
console.log(isPermutation(str1, str3));
let str4 = "xyztt";
console.log(isPermutation(str1, str4));

// other way: sort then comapre.


// ===========================================================================================
//
//
//
//
//
//
// Cracking Interview 1.3
// URLify: write a method to replace all spaces (IN PLACE) in a string with '%20'.
// Assume that the string has sufficient spaces at the end.  
// However, JS STRING is IMMUTABLE.
// so we assume that the input param is a chars array
//
//
function urlify(chars) {
	// first round, find the last char index of the string
	// and count spaces in the middle of the string
	let size = chars.length;
	let lastCharIndex = undefined;
	let spacesCount = 0;
	for (let i = size - 1; i >= 0; i--) {
		if (chars[i] != ' ' && !lastCharIndex) {
			lastCharIndex = i;
		} else if (chars[i] == ' ' && lastCharIndex) {
			spacesCount++;
		}
	}
	
	let neededLength = lastCharIndex + spacesCount * 2;
	// second round, replacing all space with '%20' in reverse order
	// from neededLength to 0
	for (let j = lastCharIndex, r = neededLength; j >= 0; j--) {
		if (chars[j] == ' ') {
			chars[r] = '0';
			chars[r-1] = '2';
			chars[r-2] = '%';
			r -= 3;
		} else {
			chars[r] = chars[j];
			r--;
		}
	}
}

let url = "this is a url             ";

// how many ways to convert string to chars array ?
let chars = Array.from(url);
let chars2 = url.split('');
let chars3 = [...url];
let chars4 = Object.assign([], url);

console.log(chars);
urlify(chars);
console.log(chars);


// =========================================================================================
//
//
//
//
// Cracking Interview 1.4
// Palindrome Permutation
// Given a string, write a function to check if it is a permutation of a palindrome.
// For example: "Tact Coa"
// => True (permutations: "taco cat", "atco cta")
//
//
function couldArrangeToPalindrome(str) {
	let charsCounter = new Proxy({}, {
		get: (object, property) => property in object ? object[property] : 0
	});
	for (const c of str) {
		if (c === ' ') continue;
		let _c = c.toLowerCase();
		charsCounter[_c] += 1;
	}

	let oddCount = 0;
	for (const count of Object.values(charsCounter)) {
		if (count % 2 !== 0) {
			if (oddCount > 0) return false;
			oddCount += 1;
		}
	}

	return true;
}

console.log(couldArrangeToPalindrome("Abcxcab"));
console.log(couldArrangeToPalindrome("Tact Coa"));



// =======================================================================================
//
//
//
//
// Cracking Interview 1.5
// There are three types of edits that can be performed on strings: insert, remove, replace.
// Given 2 strings, write a function to check if they are one edit(or zero edit) away.
// For example: [pale, ple] => true, [pale, bake] => false
//
//
function oneEditAway(str1, str2) {
	let diffCount = 0;
	let i = 0, j = 0;
	while (i < str1.length || j < str2.length) {
		if (str1[i] !== str2[j]) {
			if (++diffCount > 1) return false;
			i++;
		} else {
			i++;
			j++;
		}
	}
	return true;
}

console.log(oneEditAway("pale", "ple"));
console.log(oneEditAway("pale", "bake"));
console.log(oneEditAway("pale", "palexxx"));


// ======================================================================================
//
//
//
//
// Cracking Interview 1.6
// String Compression
// Implement a method to perform basic string compression using the counts of repeated chars.
// For example: "aabcccccaaa" => "a2b1c5a3".
//
//
function compressString(str) {
	let compression = ""; 
	let counter = 0;
	let currChar = str[0];
	for (const c of str) {
		if (c !== currChar) {
			compression += `${currChar}${counter}`; // [1]
			currChar = c;
			counter = 1;
		} else {
			counter++;
		}
	}
	compression += `${currChar}${counter}`;

	return compression.length < str.length ? compression : str;
}

console.log(compressString("aabcccccaaa"));
console.log(compressString("xxxxxxxxxxyyyyyyyzzzzzxxyyzz"));

// Note [1]
// should using Buffer instead of String Concat ?
// another: it looks like Array.join() is faster than String concat +
// The V8 javascript engine optimize string concatenatio by creating an InternalArray.



// ================================================================================================
//
//
// Cracking Interview 1.7
// Rotate Matrix
// Given an image represented by an NxN matrix, where each pixel in the image
// is 4 bytes, write a method to rotate the image by 90 degrees.
// Could you do this In Place ?
//
function rotate_90(matrix) {
	let size = matrix.length - 1;
	let aHalf = Math.floor(matrix.length/2);
	for(let x = 0; x < aHalf; x++) {
		for(let y = 0; y < aHalf; y++) {
			let temp = matrix[x][y]; 
			matrix[x][y] = matrix[size - y][x];
			matrix[size - y][x] = matrix[size - x][size - y];
			matrix[size - x][size - y] = matrix[y][size - x];
			matrix[y][size - x] = temp;
		}
	}
}

let m = [
	[1,2,3,4],
	[5,6,7,8],
	[9,10,11,12],
	[13,14,15,16]
]

rotate_90(m);
console.log(m);


//====================================================================================================
//
//
//
//
// Crackintg Interview 1.8
// Zero Matrix
// Write an algorithm such that if an element in an MxN matrix is 0, 
// its entire row and column are set to 0.
//
function setZerosRow(matrix, rowIndex) {
	for (let i = 0; i < matrix[rowIndex].length; i++) {
		matrix[rowIndex][i] = 0;
	}
}

function setZerosColumn(matrix, columnIndex) {
	for (let i = 0; i < matrix.length; i++) {
		matrix[i][columnIndex] = 0;
	}
}

function setZerosMatrix(matrix) {
	let firstZerosRow = false, 
			firstZerosColumn = false;

	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] == 0) {
				if (i > 0 && j > 0) {
					matrix[0][j] = 0;
					matrix[i][0] = 0;
				} else {
					if (i == 0) firstZerosRow = true;
					if (j == 0) firstZerosColumn = true;
				}
			}
		}
	}

	for (let i = matrix.length - 1; i > 0; i--) {
		if (matrix[i][0] == 0) {
			setZerosRow(matrix, i);
		}
	}

	for (let j = matrix[0].length - 1; j > 0; j--) {
		if (matrix[0][j] == 0) {
			setZerosColumn(matrix, j);
		}
	}

	if (firstZerosRow) setZerosRow(0);
	if (firstZerosColumn) setZerosColumn(0);
}

let matrix = [
	[1,2,3,4,5,6],
	[7,8,9,1,0,3],
	[3,5,6,7,2,3],
	[0,1,1,1,1,1]
];

setZerosMatrix(matrix);
console.log(matrix);


// ==================================================================================
//
//
//
//
// Cracking Interview 1.9
// Assume that you have a method isSubstring which checks if one word is a substring
// of another. Given 2 strings, write code to check if s2 is a rotation of s1 using 
// one call to isSubstring.
// For example: "waterbottle" is a rotation of "erbottlewat"
//
//
function isSubstring(s1, s2) { // is s1 a substring of s2 ?
	if (s1.length > s2.length) return false;
	let s1Pointer = 0;
	let s2Pointer = 0;
	while (s2Pointer < s2.length) {
		if (s2[s2Pointer] == s1[s1Pointer]) {
			s1Pointer++;
			if (s1Pointer == s1.length - 1) return true;
		} else {
			s1Pointer = 0;
		}
		s2Pointer++;
	}
	return false;
}

function isRotation(s1, s2) { // is s1 a rotation of s2 ?
	// assume thit s2 is xy
	// if s1 is a rotation of s2
	// then s1 is yx
	// and so s1(yx) is a substring of s2s2(xyxy)
	return s1.length == s2.length && isSubstring(s1, s2 + s2);
}

console.log(isRotation("erbottlewat", "waterbottle")); // true
console.log(isRotation("xyzt", "tzyx")); // false



// ====================================================================================
