//
// ===========================================================================================
//
//
//
// Cracking Interview 5.1
// You are given two 32-bit numbers, N and M, and two bit position i, j.
// Write a method to insert M into N such that M starts at bit j and end at bit i.
// You can assume that the bits j through i have enough space to fit all of M.
// For example: N = 10000000000, M = 10011, i = 2, j = 6
// 	output: N = 10001001100
//
function printBit(n) {
	console.log( (n >>> 0).toString(2) );
}

function bitInsertion(m, into, from, to) {
	let mask = (-1 << to) | ~(-1 << from);
	let clearN = into & mask;
	return clearN | (m << from);
}

let n = 1024; // 10000000000
let m = 19; // 10011
printBit(bitInsertion(m, into=n, from=2, to=6));



//
// =========================================================================================
//
//
//
// Cracking Interview 5.2
// Given a real number between 0 and 1 (e.g, 0.72) that is passed in a double,
// print the binary representation. If the number cannot be represented accurately in binary
// with at most 32 characters, print "ERROR".
//
function printRealFractionalBit(fraction) {
	if (fraction >= 1 || fraction <= 0) return "ERROR";
	
	let bit = "0.";
	while (fraction > 0) {
		if (bit.length > 32) return "ERROR";
		let shift = 2 * fraction; // shift left 1
		if (shift >= 1) {
			bit += "1";
			fraction = shift - 1;
		} else {
			bit += "0";
			fraction = shift;
		}
	}

	console.log(bit);
}

printRealFractionalBit(0.625);



//
// ========================================================================================
//
//
//
// Cracking Interview 5.3
// Flip Bit to Win: You have an integer and you can flip exactly one bit from a 0 to a 1.
// Write code to find the length of the longest sequence of 1s you could create.
// Example:
// 	Input 1775 (or: 11011101111)
// 	Output 8
//
function flipBitToWin(num) {
	let prev = 0, curr = 0, longest = 1;

	while (num > 0) {
		if ((num & 1) > 0) {
			curr++;
		} else {
			prev = (num & 2) == 0 ? 0 : curr;
			curr = 0;
		}
		longest = Math.max(prev + curr + 1, longest);
		num >>= 1;
	}

	return longest;
}

printBit(1775);
console.log(flipBitToWin(1775));
printBit(1988);
console.log(flipBitToWin(1988));


//
// ======================================================================================
//
//
//
// Cracking Interview 5.4
// Next Number: Given a positive integer, print the next smallest and the previous largest
// number that have the same number of 1 bits in their binary representation.
//
// Find Next Smallest
// 1 1 0 1 1 0 0 1 1 1 1 1 0 0 <-- the input number n (13948)
//             * + + + + + - - <-- trailing zeros
//             p [  c1   ] [c0]
// 1 1 0 1 1 0 1 0 0 0 0 0 0 0 <-- n + (1 << c0)
// 1 1 0 1 1 0 1 0 0 0 1 1 1 1 <-- the next smallest
//  n + (1 << c0) +    (1 << (c1 - 1)) - 1
//
function findNextSmallestSame1s(num) {
	let c0 = 0, c1 = 0;
	// find right most non-trailing zero
	let shift = num;
	while ((shift & 1) == 0) {
		c0++;
		shift >>= 1;
	}

	while ((shift & 1) == 1) {
		c1++;
		shift >>= 1;
	}

	return num + (1 << c0) + (1 << (c1 - 1)) - 1;
}

printBit(findNextSmallestSame1s(13948));

//
// Find Previous Largest
// 1 0 0 1 1 1 1 0 0 0 0 0 1 1
// 1 0 0 1 1 1 0 1 1 1 0 0 0 0 <-- the previous largest
//
function findPrevLargestSame1s(num) {
	let c1 = 0, c0 = 0;
	// find the right most non-trailing 1
	let shift = num
	while ((shift & 1) == 1) {
		c1++;
		shift >>= 1;
	}

	while ((shift & 1) == 0) {
		c0++;
		shift >>= 1;
	}

	return num - (1 << c1) - (1 << (c0 - 1)) + 1;
}



//
// =======================================================================================
//
//
//
// Cracking Interview 5.5
// Debugger: Explain what the following code does:
// ((n & (n-1)) === 0)
//

// n & (n - 1) equals to zero if and only if their bit representation do not have 
// the bit 1 at the same position.
// There's only one case that could happen, that is n is the power of 2
// that mean n is 1000..., and (n - 1) is 0111...
// So this code check if n is a power of 2.
//


//
// ======================================================================================
//
//
//
// Cracking Interview 5.6
// Conversion: Write a function to determine the number of bits you would need to flip
// to convert integer A to integer B
// Example: 
// 	input 29 (or: 11101), 15 (or: 01111)
// 	output 2
//
function bitSwapRequired(a, b) {
	let count = 0;
	for (let c = a ^ b; c != 0; c = c & (c - 1)) {
		count++;
	}
	return count;
}


//
// =====================================================================================
//
//
//
// Cracking Interview 5.7
// Pairwise Swap: Write a program to swap odd and even bits in an integer with as few
// instructions as possible (e.g., bit0 and bit1 are swapped, bit2 and bit3 
// are swapped, and so on).
// 
function swapPairsBits(num) {
	// 32-bits integer
	return ( ((num & 0xaaaaaaaa) >>> 1) | ((num & 0x55555555) << 1) );
}

printBit(10);
printBit(swapPairsBits(10));


//
// ===================================================================================
//
//
//
// Cracking Interview 5.8
// Draw Line: A monochrome screen is stored as a single array of bytes, allowing 8 
// consecutive pixels to be stored in 1 byte. The screen has width w, where w is divisible
// by 8 (that is, no byte will be split across rows). The height of the screeen, of course,
// can be derived from the length of the array and the width.
// Implement a function that draws a horizontal line from (x1,y) to (x2,y).
//
function drawLine(screenBytes, width, x1, x2, y) {
}








