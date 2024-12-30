// ==================================================================================================
//
//
// Cracking Interview 3.1
// How could you use a single array to implement three stacks.
//
// Array Base Stack, fixed devisions
class MultipleStack {
	constructor(numStack, totalLength) {
		this.stackSize = Math.floor(totalLength/numStack);
		this.stacks = Array(numStack).fill(null).map((x, i) => [i = i*this.stackSize, i + this.stackSize - 1]);
		this.values = Array(totalLength).fill(null);
	}

	push(stack, value) {
		let [topIndex, maxIndex] = this.stacks[stack];
		if (topIndex > maxIndex) throw "Stack Overflow";
		this.values[topIndex] = value;
		this.stacks[stack][0] = ++topIndex;
	}

	pop(stack) {
		let [topIndex, maxIndex] = this.stacks[stack];
		if (topIndex <= maxIndex - this.stackSize) return null;
		let popVal = this.values[--topIndex];
		this.values[topIndex] = null;
		this.stacks[stack][0] = topIndex;
		return popVal;
	}

	peek(stack) {
		let [topIndex, maxIndex] = this.stacks[stack];
		if (topIndex <= maxIndex - this.stackSize) return null;
		return this.values[topIndex - 1];	
	}
}

let mStack = new MultipleStack(3, 9);
mStack.push(0, 1);
mStack.push(1, 1);
mStack.push(2, 1);
console.log(mStack.values);
console.log(mStack.peek(0));
console.log(mStack.peek(1));
console.log(mStack.pop(2));
console.log(mStack.peek(2));

//
// flexible devisions
//


// =============================================================================================
//
//
//
//
// Cracking Interview 3.2
// How would you design a stack which, in addition to push and pop, has a function min which
// returns the minimum element ? push, pop, and min should all operate in O(1) time.
//

class MinStack {
	constructor() {
		this.values = [];
		this.minValues = [];
		this.currMin = null;
	}

	push(value) {
		this.values.push(value);
		this.currMin = this.currMin ? Math.min(this.currMin, value) : value;
		this.minValues.push(this.currMin);
	}

	pop() {
		this.values.pop();
		this.minValues.pop();
		this.currMin = this.minValues[this.minValues.length - 1];
	}

	peek() {
		return this.values[this.values.length - 1];
	}

	min() {
		return this.currMin;
	}
}

let minStack = new MinStack();
minStack.push(6);
minStack.push(2);
minStack.push(3);
minStack.push(4);
minStack.push(1);
minStack.push(5);

console.log(minStack.min());
minStack.pop();
minStack.pop();
console.log(minStack.min());
console.log(minStack.peek());



// =====================================================================================
//
//
// Cracking Interview 3.3
// Stack of Plates: Imagine a (literal) stack of plates. If the stack gets too high, 
// it might topple. Therefore, in real life, we would likely start a new stack when
// the previous stack exceeds some threshold. 
// Implement a data structure SetOfStacks that mimics this. SetOfStacks should be
// composed of several stacks and should create a new stack once the previous one
// exceeds capacity. SetOfStacks.push() and SetOfStacks.pop() should behave identically
// to a single stack (that is, pop() should return the same values as it would if
// there were just a single stack).
//
//
class SetOfStacks {
	constructor(capacity) {
		this.substacks = [];
		this.capacity = capacity;
	}
	
	lastStack() {
		this.substacks[this.substacks.length - 1];
	}

	push(value) {
		let last = lastStack();
		if (last && last.length < this.capacity) {
			last.push(value);
		} else {
			this.substacks.push([]);
		}
	}

	pop() {
		let last = lastStack();
		let popVal = last.pop();
		if (last.length <= 0) this.substacks.pop();
		return popVal;
	}

	peek() {	
		let last = lastStack();
		return last ? last.peek() : null;
	}
}







// Follow Up
// Implement a function popAt(index) which performs a pop operation on a specific sub-stack.
//




// ===========================================================================================
//
//
//
// Cracking Interview 3.4
// Queue via Stacks
// Implement a MyQueue class which implements a queue using 2 stacks.
//
class MyQueue {
	#pushStack;
	#popStack;

	constructor() {
		this.#pushStack = [];
		this.#popStack = [];
	}

	enqueue(value) {
		this.#pushStack.push(value);
	}

	dequeue() {
		this.ensureFIFO();
		return this.#popStack.pop();
	}

	peek() {
		this.ensureFIFO();
		return this.#popStack[this.#popStack.length - 1];
	}

	// private method #movePushItemsToPopStack
	// require polyfilling
	movePushItemsToPopStack() {
		while (this.#pushStack.length > 0) {
			this.#popStack.push(this.#pushStack.pop());
		}
	}

	// private method #ensureFIFO
	ensureFIFO() {
		if (this.#popStack.length <= 0) {
			this.movePushItemsToPopStack();
		}
	}
}

console.log("Cracking Interview 3.4");
let myQ = new MyQueue();
myQ.enqueue(1);
myQ.enqueue(5);
myQ.enqueue(6);
myQ.enqueue(8);
myQ.enqueue(8);
console.log(myQ.dequeue());
console.log(myQ.dequeue());
console.log(myQ.peek());



// =======================================================================================
//
//
//
// Cracking Interview 3.5
// Write a program to sort a stack such that the smallest items are on the top.
// You can use an additional temporary stack, but you may not copy the elements
// into any other data structure (such as an array).
//

function Node(value, next) {
	this.value = value;
	this.next = next;
}

function LinkedList() {
	this.head = null;
	this.prepend = function(value) {
		this.head = new Node(value, this.head);
	}
}

function Stack() {
	this.items = new LinkedList();
}

Stack.prototype.push = function(value) {
	this.items.prepend(value);
}

Stack.prototype.pop = function() {
	let popVal = this.items.head.value;
	this.items.head = this.items.head.next;
	return popVal;
}

Stack.prototype.peek = function() {
	return this.items.head.value;
}

Stack.prototype.isEmpty = function() {
	return !this.items.head;
}

Stack.prototype.sort = function() {
	let sortDescStack = new Stack();
	while (!this.isEmpty()) {
		let temp = this.pop();
		while (!sortDescStack.isEmpty() && sortDescStack.peek() > temp) {
			this.push(sortDescStack.pop());
		}
		sortDescStack.push(temp);
	}

	while (!sortDescStack.isEmpty()) {
		this.push(sortDescStack.pop());
	}
}

console.log("Cracking Interview 3.5");
let s = new Stack();
s.push(15);
s.push(6);
s.push(88);
console.log(s.peek());
s.sort();
console.log(s.peek());


// =============================================================================================
//
//
//
// Cracking Interview 3.6
// An animal shelter, which holds only dogs and cats, operates on a strictly FIFO basis.
// People must adopt either the "oldest" (base on arrival time) of all animals at the
// shelter, or they can select whether they would prefer a dog or a cat (and will receive
// the oldest animal of that type). They cannot select which specific animal they would like.
// Create the data structure to maintain this system and implement operations such as
// enqueue, dequeueAny, dequeueDog, dequeueCat.
// You may use the built in LinkedList data structure.
//
LinkedList.prototype.append = function(value) {
	if (!this.head) {
		this.tail = this.head = new Node(value);
	} else {
		this.tail.next = new Node(value);
		this.tail = this.tail.next;
	}
}

class Animal {
	constructor(type, name) {
		this.type = type;
		this.name = name;
	}
}

const Dog = "Dog";
const Cat = "Cat";

class AnimalShelter {
	constructor() {
		this.animals = new LinkedList();
	}

	enqueue(animal) {
		this.animals.append(animal);
	}

	dequeueAny() {
		let adoptedAnimal = this.animals.head.value;
		this.animals.head = this.animals.head.next;
		return adoptedAnimal;
	}

	dequeueType(type) {
		let previous = this.animals.head;
		let p = this.animals.head;
		while (p && p.value.type !== type) {
			previous = p;
			p = p.next;
		}
		if (!p) throw `no ${type}`;
		previous.next = p.next;
		return p.value;
	}

	dequeueDog() {
		return this.dequeueType(Dog);
	}

	dequeueCat() {
		return this.dequeueType(Cat);
	}
}

console.log("Cracking Interview 3.6");
let animalShelter = new AnimalShelter();
animalShelter.enqueue(new Animal(Dog, "Peter"));
animalShelter.enqueue(new Animal(Dog, "Lee"));
animalShelter.enqueue(new Animal(Cat, "Kitty"));
animalShelter.enqueue(new Animal(Dog, "Zelta"));
animalShelter.enqueue(new Animal(Cat, "Shan"));
animalShelter.enqueue(new Animal(Dog, "Shine"));

console.log(animalShelter.dequeueAny());
console.log(animalShelter.dequeueCat());
console.log(animalShelter.dequeueDog());
console.log(animalShelter.dequeueCat());
// console.log(animalShelter.dequeueCat()); -> no Cat



// ==========================================================================================
