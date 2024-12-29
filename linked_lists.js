//=====================================================================================
//
//
// Cracking Interview 2.1
// Write code to remove duplicates from an insorted linkedlist.
// How would you solve this problem if a temporary buffer is not allowed ?
//
function Node(value, next = null) {
	this.value = value;
	this.next = next;
}

function LinkedList(head = null) {
	this.head = head;
	this.tail = head;
}

LinkedList.prototype.append = function(value) {
	if (this.head) {
		this.tail.next = new Node(value);
		this.tail = this.tail.next;
	} else {
		this.head = new Node(value);
		this.tail = this.head;
	}
}

LinkedList.prototype.print = function() {
	let inspect = [];
	let p = this.head;
	while (p) {
		inspect.push(p.value);
		p = p.next;
	}

	console.log(inspect);
}

// with buffer
LinkedList.prototype.removeDuplicates = function() {
	let appearance = {};
	let curr = this.head;
	appearance[curr.value] = true;

	while (curr.next) {
		if (appearance[curr.next.value]) {
			curr.next = curr.next.next;
		} else {
			appearance[curr.next.value] = true;
			curr = curr.next;
		}
	}
	this.tail = curr;
}


let ll = new LinkedList();
ll.append(1);
ll.append(2);
ll.append(3);
ll.append(1);
ll.append(4);
ll.append(5);
ll.append(6);
ll.append(6);
ll.print();
ll.removeDuplicates();
ll.print();


// without buffer
// 2 pointers
LinkedList.prototype.removeDups = function() {
	let p1 = this.head;
	while (p1) {
		let p2 = p1;
		while (p2.next) {
			if (p2.next.value == p1.value) {
				p2.next = p2.next.next;
			} else {
				p2 = p2.next;
			}
		}
		this.tail = p1;
		p1 = p1.next;
	}
}

console.log("Cracking Interview 2.1");
let lL = new LinkedList();
lL.append(1);
lL.append(2);
lL.append(3);
lL.append(1);
lL.append(4);
lL.append(5);
lL.append(6);
lL.append(6);
lL.print();
lL.removeDups();
lL.print();


//======================================================================================
//
//
//
// Cracking Interview 2.2
// Implement an algorithm to find the kth to last element of a singly linked list.
//
//
LinkedList.prototype.kthToLast = function(k) {
	let kthPointer = this.head;
	let lastPointer = this.head;
	for (let i = 0; i < k; i++) {
		if (lastPointer === this.tail) return kthPointer;
		lastPointer = lastPointer.next;
	}

	while (lastPointer && lastPointer !== this.tail) {
		kthPointer = kthPointer.next;
		lastPointer = lastPointer.next;
	}

	return kthPointer;
}

console.log("Cracking Interview 2.2");
console.log(lL.kthToLast(3));


// =====================================================================================
//
//
//
// Cracking Interview 2.3
// Implement an algorithm to delete a node in the middle of a singly linked list,
// given only access to that node.
//
LinkedList.prototype.removeMiddle = function(node) {
	if (!node || node === this.head || node === this.tail) return;
	if (!node.next) return;

	let nextNode = node.next;
	node.value = nextNode.value;
	node.next = nextNode.next;
}

console.log("Cracking Interview 2.3");
lL.removeMiddle(lL.head.next.next);
lL.print();


// ====================================================================================
//
//
// Cracking Interview 2.4
// Write code to partition a linked list around a value x, 
// such that all nodes less than x come before all nodes >= x.
//
LinkedList.prototype.partition = function(x) {
	let partition = this.head;
	let p = this.head;
	while (p) {
		if (p.value < x) {
			let temp = partition.value;
			partition.value = p.value;
			p.value = temp;
			partition = partition.next;
		}
		p = p.next;
	}
}

console.log("Cracking Interview 2.4");
lL.append(11);
lL.append(8);
lL.append(10);
lL.append(9);
lL.append(13);
lL.append(15);
lL.append(88);
lL.print();
lL.partition(10);
lL.print();


// ====================================================================================
//
//
// Cracking Interview 2.5
// Sum Lists
// You have two numbers represented by a linked list, 
// where each node contains a single digit, the digits are stored in reverse order.
// Write a function that adds the two numbers and return the sums as a linked list.
// For example: 617 + 295 => 912
// (7 -> 1 -> 6) + (5 -> 9 -> 2) => (2 -> 1 -> 9)
// 
//
//
LinkedList.sum = function(lL1, lL2) {
	let sumLL = new LinkedList();
	let remem = 0;
	let p1 = lL1.head;
	let p2 = lL2.head;
	
	while(p1 || p2) {
		let p1Val = p1 === null ? 0 : p1.value;
		let p2Val = p2 === null ? 0 : p2.value;
		let s = p1Val + p2Val + remem;
		remem = s >= 10 ? 1 : 0;
		sumLL.append(s >= 10 ? (s-10) : s);

		if (p1) p1 = p1.next;
		if (p2) p2 = p2.next;
	}

	if (remem == 1) {
		sumLL.append(1);
	}

	return sumLL;
}

console.log("Cracking Interview 2.5");
let lL1 = new LinkedList();
let lL2 = new LinkedList();
lL1.append(7);
lL1.append(1);
lL1.append(6);
lL2.append(5);
lL2.append(9);
lL2.append(2);
let sumLL = LinkedList.sum(lL1, lL2);
sumLL.print();
lL1.append(2);
let sumLL2 = LinkedList.sum(lL1, lL2);
sumLL2.print();
lL2.append(3);
lL2.append(7);
let sumLL3 = LinkedList.sum(lL1, lL2);
sumLL3.print();


//
// Follow Up
// Suppose the digits are stored in reverse order
//
// solution1 : reverse 2 ll then add as above
// solution2 : we prepend 0 into the shorter ll until 2 ll have the same length
// 							then add recursive from tail to head.
//
LinkedList.prototype.prepend = function(val) {
	this.head = new Node(val, this.head);
}

LinkedList.sumReverse = function(lL1, lL2) {
	let lengLL1 = 0;
	let p1 = lL1.head;
	while (p1) {
		lengLL1++; 
		p1 = p1.next;
	}

	let lengLL2 = 0;
	let p2 = lL2.head;
	while (p2) {
		lengLL2++; 
		p2 = p2.next;
	}

	if (lengLL1 > lengLL2) {
		let pre = lengLL1 - lengLL2;
		while (pre > 0) {
			pre--;
			lL2.preprend(0);
		}
	} else if (lengLL1 < lengLL2) {
		let pre = lengLL2 - lengLL1;
		while (pre > 0) {
			pre--;
			lL1.preprend(0);
		}
	}

	let sumLL = new LinkedList();
	let rem = LinkedList.sumFromTail(sumLL, lL1.head, lL2.head);
	if (rem == 1) sumLL.prepend(1);

	return sumLL;
}

LinkedList.sumFromTail = function(sum, lL1, lL2) {
	if (lL1 === null && lL2 === null) return 0;

	let rem = LinkedList.sumFromTail(sum, lL1.next, lL2.next);
	let s = lL1.value + lL2.value + rem;
	sum.prepend(s >= 10 ? (s-10) : s);
	rem = s >= 10 ? 1 : 0;
	return rem;
}

let rLL1 = new LinkedList();
rLL1.prepend(7);
rLL1.prepend(1);
rLL1.prepend(6);
let rLL2 = new LinkedList();
rLL2.prepend(5);
rLL2.prepend(9);
rLL2.prepend(2);
let sum = LinkedList.sumReverse(rLL1, rLL2);
sum.print();





// =======================================================================================
//
//
//
// Cracking Interview 2.6
// Implement a function to check if a linked list is a palindrome
//
// solution 1: reverse then compare
//
LinkedList.prototype.isPalindrome = function() {
	let reverseLL = new LinkedList();
	let p = this.head;
	while (p) {
		reverseLL.prepend(p.value);
		p = p.next;
	}

	let p1 = this.head;
	let p2 = reverseLL.head;
	while (p1 && p2) {
		if (p1.value !== p2.value) return false;
		p1 = p1.next;
		p2 = p2.next;
	}

	return true;
}

console.log("Cracking Interview 2.6");
let palindrome = new LinkedList();
palindrome.append(1);
palindrome.append(0);
palindrome.append(0);
palindrome.append(1);
console.log(palindrome.isPalindrome());

let nonPalindrome = new LinkedList();
nonPalindrome.append(1);
nonPalindrome.append(1);
nonPalindrome.append(0);
nonPalindrome.append(0);
nonPalindrome.append(1);
console.log(nonPalindrome.isPalindrome());

//
// solution 2: iterative
// push left half nodes of the linkedlist into a stack
// then compare each next node on the right half with the stack.pop
//
LinkedList.prototype.isPalindrome = function() {
	let stack = [];
	let p = this.head;
	let doubleP = this.head;
	while (doubleP && doubleP.next) {
		stack.push(p.value);
		p = p.next;
		doubleP = doubleP.next.next;
	}

	if (doubleP) p = p.next;

	while (p) {
		if (stack.pop() !== p.value) return false;
		p = p.next;
	}

	return true;
}

let palindromeLL = new LinkedList();
palindromeLL.append(1);
palindromeLL.append(0);
palindromeLL.append(0);
palindromeLL.append(1);
console.log(palindromeLL.isPalindrome());
palindromeLL.append(1);
console.log(palindromeLL.isPalindrome());

//
// solution 3 : recursive
//  	x ( y ( z ) y ) x
//    0   1   2   3   4
//
LinkedList.prototype.length = function() {	
	let length = 0;
	let p = this.head;
	while (p) {
		length++;
		p = p.next;
	}
	return length;
}

LinkedList.prototype.isPalindrome = function() {
	let length = this.length();
	let [node, valid] = this.isPalindromeNodes(this.head, length);
	return valid;
}

LinkedList.prototype.isPalindromeNodes = function(node, otherIndex) {
	if (otherIndex <= 0) { // even length
		return [node, true];
	} else if (otherIndex == 1) { // odd length
		return [node.next, true]; // ignore the middle node
	}

	// recursive
	let [otherNode, valid] = this.isPalindromeNodes(node.next, otherIndex - 2);
	// propaganda false if validate is failed
	if (!valid) return [null, false];
	if (node.value !== otherNode.value) return [null, false];

	// the previous recursive will call with the previous of the node and the next of the otherNode
	return [otherNode.next, true];
}

let pLL = new LinkedList();
pLL.append(1);
pLL.append(0);
pLL.append(0);
pLL.append(1);
console.log(pLL.isPalindrome());



// ============================================================================================
//
//
// Cracking Interview 2.7
// Intersection: Given two (singly) linked lists, determine if the two lists intersect.
// Return the intersecting node. Note that the intersection is defined base on reference, not value
// That is if the kth node of the first linked list is the exact same node (by reference) 
// as the jth node of the second linked list, then they are intersecting.
// 
LinkedList.isIntersect = function(LL1, LL2) {
	if (LL1.tail !== LL2.tail) return null;

	let LL1Length = LL1.length();
	let LL2Length = LL2.length();

	p1 = LL1.head;
	p2 = LL2.head;
	if (LL1Length > LL2Length) {
		let shiftLength = LL1Length - LL2Length;
		while (shiftLength > 0) {
			shiftLength--;
			p1 = p1.next;
		}
	} else if (LL1Length < LL2Length) {
		let shiftLength = LL2Length - LL1Length;
		while (shiftLength > 0) {
			shiftLength--;
			p2 = p2.next;
		}
	}

	while (p1 && p2) {
		if (p1 === p2) return p1;
		p1 = p1.next;
		p2 = p2.next;
	}

	return null;
}

LinkedList.prototype.appendNode = function(node) {
	this.tail.next = node;
	let p = node;
	while (p.next) {
		p = p.next;
	}
	this.tail = p;
}


console.log("Cracking Interview 2.7");
let iLL1 = new LinkedList();
let iLL2 = new LinkedList();
iLL1.append(-1);
iLL1.append(-2);
iLL1.append(0);
iLL1.append(1);
iLL1.append(2);
iLL2.append(3);
iLL2.append(4);
let iNode = new Node(3, new Node(6, new Node(7)));
iLL1.appendNode(iNode);
iLL2.appendNode(iNode);
console.log(LinkedList.isIntersect(iLL1, iLL2));


// ==============================================================================================
//
//
// Cracking Interview 2.8
// Loop Detection: given a circular linked list, implement an algorithm that returns
// the node at the beginning of the loop.
//
// with buffer
LinkedList.prototype.detectLoop = function() {
	let appearance = new Map();
	let p = this.head;
	while (p) {
		if (appearance.get(p)) return p;
		appearance.set(p, true);
		p = p.next;
	}
	return null;
}

console.log("Cracking Interview 2.8");
let circularLL = new LinkedList();
circularLL.append(1);
circularLL.append(2);
let circularNode = new Node(3);
circularLL.appendNode(circularNode);
circularLL.append(4);
circularLL.append(5);
circularLL.append(6);
circularLL.tail.next = circularNode;
circularLL.tail = circularNode;
console.log(circularLL.detectLoop());

//
// without buffer
//
LinkedList.prototype.detectLoop = function() {
	let slower = this.head;
	let faster = this.head;
	while (faster && faster.next) {
		slower = slower.next;
		faster = faster.next.next;
		if (faster === slower) break;
	}

	if (faster === null || faster.next === null) return null;

	slower = this.head;
	while (slower !== faster) {
		slower = slower.next;
		faster = faster.next;
	}

	return slower;
}

let circularLL2 = new LinkedList();
circularLL2.append(1);
circularLL2.append(2);
let circularNode2 = new Node(3);
circularLL2.appendNode(circularNode2);
circularLL2.append(4);
circularLL2.append(5);
circularLL2.append(6);
circularLL2.tail.next = circularNode2;
circularLL2.tail = circularNode2;
console.log(circularLL2.detectLoop());





















