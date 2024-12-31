// =================================================================================
//
//
// Cracking Interview 4.1
// Given a directed graph, design an algorithm to find out
// whether there is a route between nodes.
//

class Graph {
	constructor() {
		this.adjacencies = new Map();
		this.isDirected = false;
	}

	addVertex(vertex) {
		if (!this.adjacencies.get(vertex))
			this.adjacencies.set(vertex, []);
	}

	getVertices() {
		return this.adjacencies.keys();
	}

	adjacenciesOf(vertex) {
		return this.adjacencies.get(vertex);
	}
}

class DirectedGraph extends Graph {
	constructor() {
		super();
		this.isDirected = true;
	}

	addEdge = function(fromVertex, toVertex) {
		// make sure those nodes are added
		this.addVertex(fromVertex);
		this.addVertex(toVertex);
		// add adjacencies, only direction from -> to
		let fromVertexAdjacencies = this.adjacenciesOf(fromVertex);
		fromVertexAdjacencies.push(toVertex);
		this.adjacencies.set(fromVertex, fromVertexAdjacencies);
	}

	hasRoute(source, target) { // breadth-first traversal
		let queue = [source];
		while (queue.length > 0) {
			let visitNode = queue.shift();
			if (visitNode === target) return true;
			let adjacencies = this.adjacenciesOf(visitNode);
			if (adjacencies) {
				queue = queue.concat(adjacencies);
			}
		}
		return false;
	}
}



console.log("Cracking Interview 4.1");
let graph = new DirectedGraph();
graph.addEdge(1,2);
graph.addEdge(1,3);
graph.addEdge(2,4);
graph.addEdge(2,5);
graph.addEdge(3,6);
graph.addEdge(6,7);
console.log(graph.hasRoute(1, 7));
console.log(graph.hasRoute(2, 7));


Graph.hasRoute = function(source, target) { // biredirectional search
	if (source === target) return [];

	let visited = new Map();
	visited.set(source, true);
	visited.set(target, true);

	let queue1 = [source];
	let queue2 = [target];
	while (queue1.length <= 0 && queue2.length <= 0) {
		let curr1 = queue1.shift();
		let curr2 = queue2.shift();
		if (visited.get(curr1) || visited.get(curr2)) return true;
		visited.set(curr1, true);
		visited.set(curr2, true);

		queue1 = queue1.concat(this.adjacenciesOf(curr1));
		queue2 = queue2.concat(this.adjacenciesOf(curr2));
	}

	return false;
}



// ===============================================================================
//
//
//
// Cracking Interview 4.2
// Minimal Tree: Given a sorted (asc) array with unique integer elements,
// write an algorithm to create a binary search tree with minimal height.
//

class BinaryTree {
	static Node = class {
		constructor(value, left = null, right = null) {
			this.value = value;
			this.left = left;
			this.right = right;
		}
	}
}

class BinarySearchTree extends BinaryTree {
	insert(value, fromNode = null) {
		if (!this.root) {
			this.root = new BinaryTree.Node(value);
			return this.root;
		} else {
			let parentNode = fromNode || this.root;
			if (value < parentNode.value) {
				if (parentNode.left) {
					return this.insert(value, parentNode.left);
				} else {
					parentNode.left = new BinaryTree.Node(value);
					return parentNode.left;
				}
			} else if (value > parentNode.value) {
				if (parentNode.right) {
					return this.insert(value, parentNode.right);
				} else {
					parentNode.right = new BinaryTree.Node(value);
					return parentNode.right;
				}
			}
		}
	}
}

BinarySearchTree.buildMinimalBST = function(sortedArray, minimalBST = null, from = 0, to = sortedArray.length - 1) {
	if(!minimalBST) minimalBST = new BinarySearchTree();
	if (from > to) return;

	let middle = Math.floor((from + to) / 2);
	minimalBST.insert(sortedArray[middle]);
	BinarySearchTree.buildMinimalBST(sortedArray, minimalBST, from, middle - 1);
	BinarySearchTree.buildMinimalBST(sortedArray, minimalBST, middle + 1, to);

	return minimalBST;
}

console.log("Cracking Interview 4.2");
let minimalBST = BinarySearchTree.buildMinimalBST([1,2,3,4,5,6]);
console.log(minimalBST.root);




// =======================================================================================================
//
//
//
// Cracking Interview 4.3
// List Of Depths: Given a binary tree, design an algorithm which creates a linked list of all
// the nodes at each depth (e.g, if you have a tree with depth D, you'll have D linked lists).
//
function LinkedList() {
	function Node(value, next = null) {
		this.value = value;
		this.next = next;
	}

	this.head = null;
	this.tail = this.head;

	this.append = function(value) {
		if (!this.head) {
			this.tail = this.head = new Node(value);
		} else {
			this.tail.next = new Node(value);
			this.tail = this.tail.next;
		}
	}

	this.toArray = function() {
		let arr = []
		let p = this.head;
		while (p) {
			arr.push(p.value);
			p = p.next;
		}
		return arr;
	}
}

BinaryTree.prototype.listOfDepths = function(currNode, depths = [], level = 0) {
	if (!currNode && level > 0) return;

	// Pre-Order traversal
	currNode = currNode || this.root;
	if (!depths[level]) depths[level] = new LinkedList();
	depths[level].append(currNode);
	if (currNode.left || currNode.right) {  // has at least one child node
		this.listOfDepths(currNode.left, depths, level + 1);
		this.listOfDepths(currNode.right, depths, level + 1);
	}

	return depths;
}

console.log("Cracking Interview 4.3");
console.log(minimalBST.listOfDepths().map(ll => ll.toArray().map(n => n.value)));



// ===========================================================================================
//
//
//
// Cracking Interview 4.4
// Implement a function to check if a binary tree is balanced.
// A balanced tree is defined to be a tree such that the heights if the two subtrees of any
// node never differ by more than one.
//
BinaryTree.prototype.balancedHeight = function(fromNode) {
	if (!fromNode) return 0;
	
	let leftHeight = this.balancedHeight(fromNode.left);
	if (leftHeight == -1) return -1;
	let rightHeight = this.balancedHeight(fromNode.right);
	if (rightHeight == -1) return -1;

	if (Math.abs(leftHeight - rightHeight) >= 2) {
		return -1; // return -1 if 2 subtrees of the current node are not balanced
	} else {
		return Math.max(leftHeight, rightHeight) + 1;
	}
}

BinaryTree.prototype.isBalanced = function(currNode, level = 1) {
	currNode = currNode || this.root;
	return this.balancedHeight(currNode) >= 0; // balanced from the root
}

console.log("Cracking Interview 4.4");
console.log(minimalBST.isBalanced());



// ========================================================================================
//
//
//
// Cracking Interview 4.5
// Validate BST: implement a function to check if a binary tree is a binary search tree.
//
BinaryTree.prototype.checkBstInOrder = function(currNode, trackNode) {
	if (!currNode) return true;
	// recursive left subtree
	if (!this.checkBstInOrder(currNode.left, trackNode)) return false;
	// validate BST: left < mid < right
	if (trackNode.value && trackNode.value > currNode.value)
		return false;
	trackNode.value = currNode.value;
	// recursive right subtree
	if (!this.checkBstInOrder(currNode.right, trackNode)) return false;
	// the subtree from currNode is BST
	return true;
}

BinaryTree.prototype.checkBstPreOrder = function(currNode, min, max) {
	if (!currNode) return true;
	if ((!min || min >= currNode.value) && (!max || max < currNode.value))
		return false;
	return this.checkBstPreOrder(currNode.left, min, currNode.value) &&
					this.checkBstPreOrder(currNode.right, currNode.value, max);
}

BinaryTree.prototype.isBST = function() {
	let trackNode = new BinaryTree.Node(null);
	return this.checkBstInOrder(this.root, trackNode);

	// this.checkBstPreOrder(this.root, null, null); 
}

console.log("Cracking Interview 4.5");
console.log(minimalBST.isBST());


// =========================================================================================
//
//
//
// Cracking Interview 4.6
// Successor: Write an algorithm to find the "next" node (i.e,in-order successor) of a
// given node in a binary tree. You may assume that each node has a link to its parent.
//
BinaryTree.ThreeWaysNode = class extends BinaryTree.Node {
	constructor(value, parent) {
		super(value);
		this.parent = parent;
	}	
}

BinaryTree.prototype.inOrderNext = function(currNode) {
	if (!currNode) return null;

	if (currNode.right) { // return leftmost node
		let leftmost = currNode.right;
		while (leftmost.left) {
			leftmost = leftmost.left;
		}
		return leftmost;
	} else { // up until the currNode is on the left side
		let parent = currNode.parent;
		while (parent && parent.left !== currNode) {
			currNode = parent;
			parent = currNode.parent;
		}
		return parent;
	}
}


// ======================================================================================
//
//
//
// Cracking Interview 4.7
// Build Order: You are given a list of projects and a list of dependencies (which is a
// list of pairs of projects, whether the second project is dependent on the first). 
// All of project's dependencies must be build before the project is. Find a build order
// that will allow the project to be build. 
// If there is no valid build order, return error.
// Example: 
// Input Projects a,b,c,d,e,f
// Dependencies: (a,d), (f,b), (b,d), (f,a), (d,c)
// Output: f, e, a, b, d, c
//
DirectedGraph.prototype.dfTraversal = function(vertex, stack, visit) {
	let visitState = visit.get(vertex);
	if (visitState === 1) // visiting => cycle
		return null;
	
	if (!visitState) {
		visit.set(vertex, 1); // visiting
		for (let adj of this.adjacenciesOf(vertex)) {
			if(!this.dfTraversal(adj, stack, visit)) return null;
		}
		visit.set(vertex, 2); // visited
		stack.push(vertex); // completed
	}

	return true;
}

DirectedGraph.prototype.topologicalSort = function() {
	let vertices = this.getVertices();
	let order = [];
	let visit = new Map();
	for (let vertex of vertices) {
		if (!vertex.state && !this.dfTraversal(vertex, order, visit))
			return null;
	}
	return order;
}

function orderingProjects(projects, dependencies) {
	let directedG = new DirectedGraph();
	// add projects as vertices
	for (let project of projects) {
		directedG.addVertex(project);
	}
	// add dependencies pairs as edges
	for (let dep of dependencies) {
		directedG.addEdge(dep[1], dep[0]);
	}

	let orderProjects = directedG.topologicalSort();
	if (orderProjects) {
		return orderProjects;
	} else {
		throw "Could Not Ordering Projects";
	}
}

console.log("Cracking Interview 4.7");
let projects = ["a", "b", "c", "d", "e", "f"];
let deps = [["a", "d"], ["f", "b"], ["b", "d"], ["f", "a"], ["d", "c"]];
console.log(orderingProjects(projects, deps));



// ==========================================================================================
//
//
// Cracking Interview 4.8
// First Common Ancestor: Design an algorithm and write code to find the first common ancestor
// of two nodes in a binary tree. Avoid storing additional nodes in a data structure.
//
BinaryTree.checkInclude = function(root, node1, node2) {
	if (!root) return [null, 0];
	
	let [commonNode1, include1] = BinaryTree.checkInclude(root.left, node1, node2);
	if (include1 == 3) return [commonNode1, include1];
	let [commonNode2, include2] = BinaryTree.checkInclude(root.right, node1, node2);
	if (include2 == 3) return [commonNode2, include2];

	let include = include1 | include2;
	if (root == node1) include = include | 1;
	if (root == node2) include = include | 2;

	if (include == 3) return [root, include];
	return [null, include];
}

BinaryTree.firstCommonAncestor = function(root, node1, node2) {
	let [commonAncestor, include] = BinaryTree.checkInclude(root, node1, node2);
	return commonAncestor;
}

console.log("Cracking Interview 4.8")
console.log(
	BinaryTree.firstCommonAncestor(
		minimalBST.root, minimalBST.root.left, minimalBST.root.right.right
	)
);


// ======================================================================================
//
//
// 
// Cracking Interview 4.9
// BST Sequences: A binary search tree was created by traversing through an array from
// left to right and inserting each element. Given a binary search tree with distinct 
// elements, print all possible arrays that could have led to this tree.
// Example: 
//              2
//          	/   \
//					1      3
// Ouput: [2, 1, 3], [2, 3, 1]
//
BinaryTree.prototype.postOrderTraversal = function(currNode, callback) {
	if (!currNode) return;

	let left, right;

	if (currNode.left) {
		left = this.postOrderTraversal(currNode.left, callback);
	}

	if (currNode.right) {
		right = this.postOrderTraversal(currNode.right, callback);
	}

	return callback(currNode, left, right);
}

function bstSequences(bst) {
	return bst.postOrderTraversal(bst.root, (node, left, right) => {
		left = left || [[]];
		right = right || [[]];
		let middle = [node.value];
		let sequences = [];
		for (let arrL of left) {
			for (let arrR of right) {
				mixRespectHead(arrL, arrR, middle, sequences);
			}
		}
		return sequences;
	});
}

// the head (first) should always be added before its children
// for example, as above, the '2' must be added before '1', '3'
function mixRespectHead(left, right, middle, sequences) {
	if (left.length == 0 || right.length == 0) {
		sequences.push(middle.concat(left.concat(right)));
		return;
	}

	mixRespectHead(left.slice(1), right, middle.concat(left[0]), sequences);
	mixRespectHead(left, right.slice(1), middle.concat(right[0]), sequences);
}


console.log("Cracking Interview 4.9");
console.log(bstSequences(minimalBST));



// =====================================================================================
//
//
//
// Cracking Interview 4.10
// Check Subtree: T1 and T2 are 2 very large binary trees, with T1 much bigger than T2.
// Create an algorithm to determine if T2 is a subtree of T1.
// A tree T2 is a subtree of T1 of there exists a node n in T1 such that the subtree 
// of n is identical to T2. That is, if you cut off the tree at the node n, 
// the two trees would be identical.
//
BinaryTree.compareNode = function(node, other) {
	if (!node && !other) {
		return true;
	} else if (!node || !other) {
		return false;
	} else if (node.value !== other.value) {
		return false;
	} else {
		return BinaryTree.compareNode(node.left, other.left) &&
						BinaryTree.compareNode(node.right, other.right);
	}
}

BinaryTree.prototype.hasSubtree = function(thisCurrNode, otherRootNode) {
	if (!thisCurrNode) return false;
	if (BinaryTree.compareNode(thisCurrNode, otherRootNode)) return true;
	return this.hasSubtree(thisCurrNode.left, otherRootNode) ||
					this.hasSubtree(thisCurrNode.right, otherRootNode);
}

BinaryTree.prototype.contains = function(other) {
	if (other === null) return true;
	return this.hasSubtree(this.root, other.root);
}


// =====================================================================================
//
//
//
// Cracking Interview 4.11
// Random Node: You are implementing a binary search tree class from scratch, which,
// in addition to `insert`, `find` and `delete`, has a method `getRandomNode()` which
// returns a random node from the tree. ALl nodes shoule be equally likely to be choosen.
// Design and implement an algorithm for `getRandomNode()`, and explain how you would
// implement the rest of the methods.
//
random = function(max) {
	return Math.floor(Math.random() * max);
}

// slow
BinarySearchTree.prototype.getRandomNode = function() {
	// traversal to collect all nodes
	let arr = this.postOrderTraversal(this.root, (node, left, right) => {
		return (left || []).concat(right || []).concat(node);
	});
	// random node equally
	let randomIndex = random(arr.length - 1);
	return arr[randomIndex];	
}

console.log("Cracking Interview 4.11");
console.log(minimalBST.getRandomNode());

// fast with `size` attr on each node
BinarySearchTree.prototype.getRandomNode = function() {
	let totalSize = this.root.size;
	let randomSize = random(totalSize) + 1;
	console.log(randomSize);
	return this.root.getInOrderIthNode(randomSize);
}

BinarySearchTree.NodeWithSize = function(value) {
	this.value = value;
	this.size = 1;
	
	this.insert = function(val) {
		if (val <= this.value) {
			if (!this.left) {
				this.left = new BinarySearchTree.NodeWithSize(val);
			} else {
				this.left.insert(val);
			}
		} else {
			if (!this.right) {
				this.right = new BinarySearchTree.NodeWithSize(val);
			} else {
				this.right.insert(val);
			}
		}
		this.size++;
	}

	// get the ith Node when do in-order traversal
	this.getInOrderIthNode = function(i) {
		let leftSize = this.left ? this.left.size : 0;
		if (i == leftSize + 1) {
			return this;
		} else if (this.left && i <= leftSize) {
			return this.left.getInOrderIthNode(i);
		} else if (this.right) {
			return this.right.getInOrderIthNode(i - leftSize - 1);
		}
	}
}

BinarySearchTree.prototype.insertWithSize = function(value) {
	if (!this.root) {
		this.root = new BinarySearchTree.NodeWithSize(value);
	} else {
		this.root.insert(value);
	}
}


let bst = new BinarySearchTree();
let bstArr = [5,4,7,6,3,1,8,9,2];
for (let i of bstArr) {
	bst.insertWithSize(i);
}

console.log(bst.getRandomNode());


// =========================================================================================
//
//
//
// Cracking Interview 4.12
// Paths with Sum: You are given a binary tree in which each node contains an integer value
// ( which might be positive or negative). Design an algorithm to count the number of
// paths that sum to a given value. The path does not need to start or end at the root
// or a leaf, but it must go downwards (traveling only from parent nodes to children).
//
BinaryTree.deepFirstTraversal = function(root, callback) {
	if (!root || root.state) return;

	root.state = 1;
	callback(root);

	BinaryTree.deepFirstTraversal(root.left, callback);
	BinaryTree.deepFirstTraversal(root.right, callback);
	
	root.state = 2;
	callback(root);
}

BinaryTree.prototype.countPathsWithSum = function(sum) {
	let numOfPaths = 0;
	let counter = new Map();
	let currSum = 0;
	BinaryTree.deepFirstTraversal(this.root, (node) => {
		if (node.state === 1) { // visit
			currSum += node.value;
			let sumCount = counter.get(currSum) || 0;
			counter.set(currSum, sumCount + 1);
		} else if (node.state === 2) { // completed
			if (currSum === sum) {
				numOfPaths += 1;
			} else {
				let diff = currSum - sum;
				numOfPaths += counter.get(diff) || 0;
			}
			// reduce the completed node
			let currSumCount = counter.get(currSum);
			if (currSumCount == 0) {
				counter.delete(currSum); // save space
			} else {
				counter.set(currSum, currSumCount - 1);
			}
			currSum -= node.value;

			// since this is binary tree, so no cycle here.
			// reset for the next traversal
			node.state = 0;
		}
	});
	
	return numOfPaths;
}

console.log("Cracking Interview 4.12");
console.log(minimalBST.countPathsWithSum(3));
console.log(minimalBST.countPathsWithSum(6));
 














































































