//
// ================================================================================================
//
//
//
// Cracking Interview 8.1
// Triple Step: A child is running up a staircase with n steps and can hop either 1 step, 2 steps,
// or 3 steps at a time. Implement a method to count how many possible ways the child can run up
// the stairs.
//
function countWays(totalSteps, memo = {}) {
	if (memo[totalSteps]) return memo[totalSteps];
	if (totalSteps < 0) return 0;
	if (totalSteps == 0) return 1;

	memo[totalSteps] = countWays(totalSteps - 1, memo) + 
										 countWays(totalSteps - 2, memo) + 
										 countWays(totalSteps - 3, memo);

	return memo[totalSteps];
}

console.log(countWays(3));
console.log(countWays(6));


//
// ==============================================================================================
//
//
//
// Cracking Interview 8.2
// Robot in a Grid: Imagine a robot sitting on the upper left corner of grid with r rows and 
// c columns. The robot can only move in two directions, right and down, but certain cells are
// "off limits" such that the robot cannot step on them. Design an algorithm to find a path for 
// the robot from the top left to the bottom right.
//
function findPath(grid, currRow, currCol, path = [], memo = []) {
	let h = grid.length, w = grid[0].length;
	if (currRow == h - 1 && currCol == w - 1) {
		path.push([currRow, currCol]);
		return path;
	}

	if (memo[currRow] && memo[currRow][currCol] == false) return null;

	memo[currRow] = memo[currRow] || [];
	if (
		currRow >= h || currCol >= w || // out of grid
		grid[currRow][currCol] == 1 // limit cell
	) {
		memo[currRow][currCol] = false;
		return null;
	}

	path.push([currRow, currCol]);

	let tryDown = findPath(grid, currRow + 1, currCol, path, memo);
	if (tryDown) return tryDown;
	let tryRight = findPath(grid, currRow, currCol + 1, path, memo);
	if (tryRight) return tryRight;

	path.pop();
	return null;
}

let grid = [
	[0, 0, 0, 0],
	[1, 0, 1, 0],
	[1, 0, 0, 1],
	[1, 1, 0, 0]
];

console.log(findPath(grid, 0, 0));

//
// =======================================================================================
//
//
//
// Cracking Interview 8.3 
// Magic Index: A magic index in an array A[1..n-1] is defined to be an index such that
// A[i] = i. Given a sorted array of distinct integers, write a method to find a magic
// index, if one exists, in array A.
//
function findMagicIndex(arr) {
	return findMagicIndexBS(arr, 0, arr.length - 1);
}

function findMagicIndexBS(arr, start, end) { // binary search
	if (start > end) return -1;

	let middle = Math.floor((start + end) / 2);
	if (arr[middle] == middle) {
		return middle;
	} else if (arr[middle] > middle) {
		return findMagicIndexBs(arr, 0, middle - 1);	
	} else {
		return findMagicIndexBs(arr, middle + 1, end);
	}
}


function findMagicIndexSubArray(arr, left, right, startIndex = null, endIndex = null) {
	if (left > right) return [startIndex, endIndex];

	let middle = Math.floor((left + right) / 2);
	if (arr[middle] == middle) {
		startIndex = Math.min(middle, startIndex || Number.MAX_VALUE);
		endIndex = Math.max(middle, endIndex || Number.MIN_VALUE);

		if (!startIndex || startIndex > left) {
			[startIndex, endIndex] = findMagicIndexSubArray(arr, left, middle - 1, startIndex, endIndex);
		}

		if (!endIndex || endIndex < right) {
			[startIndex, endIndex] = findMagicIndexSubArray(arr, middle + 1, right, startIndex, endIndex);
		} 
	} else {
		if (endIndex && endIndex >= right) {
			[startIndex, endIndex] = findMagicIndexSubArray(arr, middle + 1, right, startIndex, endIndex);
		} else if (startIndex && startIndex <= left) {
			[startIndex, endIndex] = findMagicIndexSubArray(arr, left, middle - 1, startIndex, endIndex);
		} else {
			[startIndex, endIndex] = findMagicIndexSubArray(arr, left, middle - 1, null, null);
			if (!startIndex) {
				[startIndex, endIndex] = findMagicIndexSubArray(arr, middle + 1, right, null, null);
			}			
		}
	}

	return [startIndex, endIndex];
}

let arr = [-1, -2, 1, 3, 4, 5, 8, 9, 11];
console.log(findMagicIndex(arr));
console.log(findMagicIndexSubArray(arr, 0, 8));


// Follow Up: What if the elements are not distinct ?
function findMagicIndexNotDistinct(arr, start, end) {
	if (end < start) return -1;

	let middle = Math.floor((start + end) / 2);
	if (arr[middle] == middle) return middle;

	let left = Math.min(middle - 1, arr[middle]);
	let found = findMagicIndexNotDistinct(arr, 0, left);
	if (found > -1) return found;

	let right = Math.max(middle + 1, arr[middle]);
	return findMagicIndexNotDistinct(arr, right, end);
}

let arr1 = [-10, -5, 2, 2, 2, 3, 4, 7, 9, 12, 13];
console.log(findMagicIndexNotDistinct(arr1, 0, arr1.length - 1));


//
// ===================================================================================================
//
//
//
// Cracking Interview 8.4
// Power Set: Write a method to return all subsets of a set
//
function powerSet(set) {
	subsets = [[set.pop()]];
	
	while (set.length > 0) {
		subsets = combination(subsets, set.pop());
	}

	return subsets.concat([[]]);
}

function combination(arr, x) {
	return arr.concat(arr.map(a => a.concat(x))).concat([[x]]);
}

let set = [1,2,3];
console.log(powerSet(set));



//
// =================================================================================================
//
//
//
// Cracking Interview 8.5
// Recursive Multiply: Write a recursive function to multiply two positive integers without using
// the * operator (or / operator). You can use addition, subtraction, and bit shifting, but you
// should minimize the number of those operations.
//
function recursiveMultiply(i1, i2) {
	let [bigger, smaller] = i1 > i2 ? [i1, i2] : [i2, i1];
	if (smaller == 0) return 0;
	if (smaller == 1) return bigger;

	let x = recursiveMultiply(bigger, smaller >> 1);
	return x + x + (smaller & 1 == 1 ? bigger : 0);
}

console.log(recursiveMultiply(123, 30));

//
// ===============================================================================================
//
//
//
// Cracking Interview 8.6
// Towers of Hanoi: In the classic problem of the Towers of Hanoi, you have 3 towers and N disks
// of different sizes which can slide onto any tower. The puzzle starts with disks sorted in a 
// ascending order of size from top to bottom (i.e, each disk sits on top of an even larger one).
// You have the following constraints:
// 	(1) Only one disk can be moved at a time.
// 	(2) A disk is slid off the top of one tower onto another tower.
// 	(3) A disk cannot be placed on top of a smaller disk.
// Write a program to move the disks from the first tower to the last using Stacks.
//
function towerOfHanoi(firstTower, secondTower, lastTower) { // 3 stack of disks
	let num = firstTower.length;
	slidOffDisks(num, firstTower, secondTower, lastTower);
}

function slidOffDisks(num, origin, temp, dest) {
	if (num <= 0) return;
	// move num-1 top disks from origin to temp
	slidOffDisks(num - 1, origin, dest, temp);
	// move the top disk from origin to dest
	dest.push(origin.pop());
	// move the top num-1 disks from temp to dest
	slidOffDisks(num - 1, temp, origin, dest);
}

let firstTower = [3,2,1], secondTower = [], lastTower = [];
towerOfHanoi(firstTower, secondTower, lastTower);
console.log(firstTower);
console.log(lastTower);


//
// =================================================================================================
//
//
//
// Cracking Interview 8.7
// Permutations without Dups: Write a method to compute all permutations of a string 
// of unique characters.
//
function permutations(str) {
	let result = [];
	if (str.length == 0) {
		result.push("");
		return result;
	}

	for (let i = 0; i < str.length; i++) {
		let partialPermutations = permutations(str.substr(0, i) + str.substr(i+1));
		for (let partial of partialPermutations) {
			result.push(str.charAt(i) + partial);
		}
	}

	return result;
}

console.log(permutations("this"));

//
// ===============================================================================================
//
//
//
// Cracking Interview 8.8
// Permutations with Duplicates: Write a method to compute all permutations of a string whose
// characters are not necessarily unique. The list of permutations should not have duplicates.
//
function permutationsDup(str) {
	let freqMap = new Map();
	for (let c of str) {
		freqMap.set(c, (freqMap.get(c) || 0) + 1);
	}

	return buildPermutationDup(freqMap, "", str.length);
}

function buildPermutationDup(freqMap, prefix, remaining) {
	if (remaining == 0) {
		return [prefix];
	}

	let result = [];
	for (let c of freqMap.keys()) {
		let count = freqMap.get(c);
		if (count > 0) {
			freqMap.set(c, count - 1);
			result = result.concat(buildPermutationDup(freqMap, prefix + c, remaining - 1));
			freqMap.set(c, count);
		}
	}

	return result;
}

console.log(permutationsDup("aab"));


//
// ============================================================================================
//
//
//
// Cracking Interview 8.9
// Parens: Implement an algorithm to print all valid (i.e, properly opened and closed) 
// combinations of n pairs of parentheses.
// Example: 
// 		input: 3
// 		output: ((())), (()()), (())(), ()(()), ()()()
//
function parentheses(num) {
	return generateParentheses(["("], 1, num - 1);
}

function generateParentheses(parens, closeNeeded, openRemaining) {
	if (openRemaining <= 0 && closeNeeded <= 0) return parens;

	let openParens = [];
	if (openRemaining > 0) {
		openParens = parens.map(p => p.concat("("));
		openParens = generateParentheses(openParens, closeNeeded + 1, openRemaining - 1);
	}

	let closeParens = []
	if (closeNeeded > 0) {
		closeParens = parens.map(p => p.concat(")"));
		closeParens = generateParentheses(closeParens, closeNeeded - 1, openRemaining);
	}

	return openParens.concat(closeParens);
}

console.log(parentheses(2));
console.log(parentheses(3));


//
// ===========================================================================================
//
//
//
// Cracking Interview 8.10
// Paint Fill: Implement the "pain fill" function that one might see on many image editing
// programs. That is, given a screen (represented by a two-dimensional array of colors), 
// a point, and a new color, fill in the surrounding area until the color changes
// from the original color.
//
function paintFill(screen, color, r, c) {
	if (r < 0 || r >= screen.length || c < 0 || c >= screen[0].length) return;
	if (screen[r][c] == color) return;

	paintFillRecursive(screen, screen[r][c], color, r, c);
}

function paintFillRecursive(screen, oldColor, newColor, r, c) {	
	if (r < 0 || r >= screen.length || c < 0 || c >= screen[0].length) return;
	if (screen[r][c] == oldColor) {
		screen[r][c] = newColor;
		paintFillRecursive(screen, oldColor, newColor, r+1, c);
		paintFillRecursive(screen, oldColor, newColor, r-1, c);
		paintFillRecursive(screen, oldColor, newColor, r, c+1);
		paintFillRecursive(screen, oldColor, newColor, r, c-1);
	}
}


//
// =======================================================================================
//
//
//
// Cracking Interview 8.11
// Coins: Given an infinite number of quarters (25 cents), dimes (10 cents), 
// nickels (5 cents) and pennies (1 cent), write code to calculate the number ways of
// representing n cents.
//
function makeChanges(money_in_cents, maxCoin = 25, 
		  							 memo = new Map([[1, new Map()], [5, new Map()], [10, new Map()], [25, new Map()]])) {
	if (money_in_cents == 0) return 1;
	if (money_in_cents < 0) return 0;
	if (mem = memo.get(maxCoin).get(money_in_cents)) return mem;

	let ways = 0;
	if (maxCoin >= 1) ways += makeChanges(money_in_cents - 1, 1, memo);
	if (maxCoin >= 5) ways += makeChanges(money_in_cents - 5, 5, memo);
	if (maxCoin >= 10) ways += makeChanges(money_in_cents - 10, 10, memo);
  if (maxCoin >= 25) ways += makeChanges(money_in_cents - 25, 25, memo);

	memo.get(maxCoin).set(money_in_cents, ways);
	return ways;
}

console.log(makeChanges(6));
console.log(makeChanges(10));
console.log(makeChanges(11));
console.log(makeChanges(14));
console.log(makeChanges(15));


//
// ========================================================================================
//
//
//
// Cracking Interview 8.12
// Eight Queens: Write an algorithm to print all ways of arranging eight queens on
// an 8x8 chess board so that none of them share the same row, column, or all diagonals.
//
const ChessSize = 8;
function eightQueens(ways, placedQueens = [], currRow = 0) {
	if (currRow == ChessSize) {
		ways.push(placedQueens.slice());
		return;
	}

	for (let col = 0; col < ChessSize; col++) {
		if (placeQueen(placedQueens, currRow, col)) {
			placedQueens[currRow] = col;
			eightQueens(ways, placedQueens, currRow + 1);
		}
	}
}

function placeQueen(way, row, col) { // is place queen at (row, col) valid ?
	// assume that this method be used with above method
	// so placeQueen work with each increment row at the time
	// that mean row here is the last index of way
	for (let r = 0; r < row; r++) {
		if (way[r] == col) return false;
		if (Math.abs(way[r] - col) == row - r) return false;
	}

	return true;
}

let ways = [];
eightQueens(ways);
console.log(ways.length);
let lastWay = ways[ways.length - 1];
for (let i = 0; i < ChessSize; i++) {
	let row = "";
	for (let j = 0; j < ChessSize; j++) {
		if (lastWay[i] == j) {
			row += " x ";
		} else {
			row += " o ";
		}
	}
	console.log(row);
}



//
// ==============================================================================================
//
//
//
// Cracking Interview 8.13
// Stack of Boxes: You have a stack of n boxes, with widths wi, heights hi and depth di.
// The boxes cannot be rotated and can only be stacked on top of one another if the box
// in the stack is strickly larger than the box above it in width, height and depth.
// Implement a method to compute the height of the tallest possible stack.
// The height of a stack is the sum of the heights of each box.
//
function canBeAbove(box1, box2) {
	return box1.height < box2.height && box1.width < box2.width && box1.depth < box2.depth;
}

function tallestStackHeight(boxes) {
	// sort boxes in decensing order by height
	boxes.sort((bx1, bx2) => bx2.height - bx1.height);
	return calculateMaxHeight(boxes);
}

function calculateMaxHeight(sortedBoxes, bottomIndex = null, memo = new Map()) {
	if (bottomIndex && bottomIndex < sortedBoxes.length && memo[bottomIndex]) 
		return memo[bottomIndex];
	
	let maxHeight = 0;
	if (bottomIndex === null) {
		for (let i = 0; i < sortedBoxes.length; i++) {
			let partialMaxHeight = calculateMaxHeight(sortedBoxes, i, memo);
			maxHeight = Math.max(maxHeight, partialMaxHeight);
		}
	} else {
		let bottomBox = sortedBoxes[bottomIndex];
		for (let i = bottomIndex + 1; i < sortedBoxes.length; i++) {
			if (canBeAbove(sortedBoxes[i], bottomBox)) {
				let partialMaxHeight = calculateMaxHeight(sortedBoxes, i, memo);
				maxHeight = Math.max(maxHeight, partialMaxHeight);
			}
		}
    maxHeight += bottomBox.height;
		memo[bottomIndex] = maxHeight;
	}

  return maxHeight;
}

let boxes = [
	{height: 1, width: 3, depth: 3},
	{height: 2, width: 4, depth: 4},
	{height: 3, width: 2, depth: 2},
	{height: 7, width: 7, depth: 7},
	{height: 4, width: 3, depth: 4},
	{height: 6, width: 5, depth: 6},
	{height: 5, width: 4, depth: 5},
]

console.log(tallestStackHeight(boxes));


//
// =============================================================================================
//
//
//
// Cracking Interview 8.14
// Boolean Evaluation: Given a boolean expression consisting of the symbols 0 (false), 1 (true),
// & (AND), | (OR), and ^ (XOR), and a desired boolean value result, implement a function to
// count the number of ways of parenthesizing the expression such that it evaluates to result.
// The expression should be fully parenthesized (e.g, (0)^(1)) but not extraneously.
// Example:
// 	countEval("1^0|0|1", false) -> 2
// 	countEval("0&0&0&1^1|0", true) -> 10
//
function countEval(expression, result, memo = new Map()) {
	if (expression.length == 0) return 0;
	if (expression.length == 1) return expression == result ? 1 : 0;
	if (cachedCounter = memo.get(expression + result)) return cachedCounter;

	let counter = 0;
	for (let i = 1; i < expression.length; i+=2) {
		let op = expression[i];
		let leftTrue = countEval(expression.slice(0, i), true, memo);
		let leftFalse = countEval(expression.slice(0, i), false, memo);
		let rightTrue = countEval(expression.slice(i + 1), true, memo);
		let rightFalse = countEval(expression.slice(i + 1), false, memo);
		
		let countTotal = (leftTrue + leftFalse) * (rightTrue + rightFalse);
		let countTrue = 0;
		if (op == "^") {
			countTrue = leftTrue * rightFalse + leftFalse * rightTrue;
		} else if (op == "&") {
			countTrue = leftTrue * rightTrue;
		} else if (op == "|") {
			countTrue = leftTrue * (rightTrue + rightFalse) + leftFalse * rightTrue;
		};
		
		counter += result ? countTrue : countTotal - countTrue;
	}

	memo.set(expression + result, counter);
	return counter;
}

console.log(countEval("1^0|0|1", false));
console.log(countEval("0&0&0&1^1|0", true));

