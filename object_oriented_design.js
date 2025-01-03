//
// ==================================================================================================
//
//
//
// Cracking Interview 7.1
// Deck of Cards: Design the data structures for a generic deck of cards.
// Explain how you would subclass the data structure to implement blackjack.
//

class Card {
	static Suit = {
		spade: 1, 
		club: 2,	
		diamond: 3, 
		heart: 4
	};

	static Rank = {
		ace: 1, 
		two: 2, 
		three: 3, 
		four: 4, 
		five: 5, 
		six: 6, 
		seven: 7, 
		eight: 8, 
		nine: 9, 
		ten: 10, 
		j: 11, 
		q: 12, 
		k: 13
	};

	#suit;
	#rank;

	constructor(rank, suit) {
		this.validate(rank, suit);
		this.#rank = rank;
		this.#suit = suit;
	}

	validate(rank, suit) {
		if ((rank < Card.Rank.ace || rank > Card.Rank.k) ||
				(suit < Card.Suit.spade || suit > Card.Suit.heart))
			throw "Invalid Card";
	}

	isAce() {
		return this.rank == Card.Rank.ace;
	}

	isFaceCard() {
		return this.rank >= Card.Rank.j && this.rank <= Card.Rank.k;
	}

	value() {
		return this.isFaceCard() ? 10 : this.#rank;
	}

	toString() {
		return `${this.#rank}-${this.#suit}`;
	}
}

let qHeart = new Card(Card.Rank.q, Card.Suit.heart);
console.log(qHeart.toString());

class DeckofCards {
	constructor() {
		this.cards = [];
		for (const suit in Card.Suit) {
			for (const rank in Card.Rank) {
				this.cards.push(new Card(Card.Rank[rank], Card.Suit[suit]));
			}
		}
	}

	shuffle() {
		let shuffleCards = [];
		for (let i = 0; i < this.cards.length; i++) {
			let ran = Math.floor(Math.random() * this.cards.length);
			shuffleCards.push(this.cards[ran]);
		}

		return shuffleCards;
	}
}

//
//

class Blackjack {
	constructor() {
		this.deckofCards = new DeckofCards();
		this.newGame();
	}

	newGame(...players) {
		this.finish = false;
		this.cards = this.deckofCards.shuffle();
		this.players = [];
		for (const p of players) {
			p.join(this);
		}
	}

	addPlayer(player) {
		if (!player instanceof BlackjackPlayer) throw "Invalid Player";
		this.players.push(player);
		return true;
	}

	start() {
		for (const p of this.players) {
			this.hit(p);
			this.hit(p);
		}
		// players who give 'blackjack' will win immediately.
		this.checkBlackJack();
	}

	hit(player) {
		if (!this.finish && this.cards.length > 0 && !player.standed && !player.surrendered) {
			player.addCard(this.cards.pop());
		}
	}

	stand(player) {
		player.standed = true;
	}

	surrender(player) {
		player.surrendered = true;
	}

	minScore(cards) {
		return cards.reduce((score, c) => c.isAce() ? score += 1 : score += c.value(), 0);
	}

	maxScore(cards) {
		return cards.reduce((score, c) => score += c.value(), 0);
	}
	
	isBusted(cards) {
		return this.minScore(cards) > 21;
	}

	isBlackJack(cards) {
		return cards.length == 2 && cards.some(c => c.isAce()) && this.maxScore(cards) == 21;
	}

	checkBlackJack() {
		let blackjack = this.players.filter(player => this.isBlackJack(player.cards));
		if (blackjack.length > 0) {
			console.log(`blackjacks ${blackjack.map(p => p.name)}`);
			this.endGame();
		}
	}

	check() {
		let competitors = this.players.filter(player => !player.surrendered && !this.isBusted(player.cards));
		let scores = competitors.map(p => [p.name, this.maxScore(p.cards)])
									.sort((p, q) => q[1] - p[1]);
		console.log(`result: ${scores}`);
		this.endGame();
	}

	endGame() {
		this.finish = true;
	}

	reset() {
		this.newGame(...this.players);
	}
}

class Player {
	constructor(name, money) {
		this.name = name;
		this.money = money;
	}

	join(game) {
		if (game.addPlayer(this)) {
			this.currGame = game;
			this.cards = [];
		}
	}

	addCard(card) {
		this.cards.push(card);
	}
}

class BlackjackPlayer extends Player {
	hit() {
		this.currGame.hit(this);
	}

	stand() {
		this.currGame.stand(this);
	}

	surrender() {
		this.currGame.surrender(this);
	}
}


console.log("Cracking Interview 7.1");
let blackjack = new Blackjack();
let hand1 = new BlackjackPlayer("x", 100);
let hand2 = new BlackjackPlayer("y", 100);
let hand3 = new BlackjackPlayer("z", 100);
let hand4 = new BlackjackPlayer("t", 100);

hand1.join(blackjack);
hand2.join(blackjack);
hand3.join(blackjack);
hand4.join(blackjack);

blackjack.start();
blackjack.check();




//
// ====================================================================================================
//
//
//
// Cracking Interview 7.2
// Call Center: Imagine you have a call center with three levels of employees: respondent, manager,
// and director. An incomming telephone call must be first allocated to a respondent who is free.
// If the respondent can't handle the call, he or she must escalate the call to a manager. If the 
// manager is not free or not able to handle it, then the call shoule be escalated to a director.
// Design the classes and data structures for this problem. Implement a method `dispatchCall()`
// which assigns a call to the first available employee.
//
function LinkedList(headObject = null) {
	this.Node = function(object, next) {
		this.object = object;
		this.next = next;
	}

	this.head = headObject ? new Node(headObject) : null;

	this.prepend = function(object) {
		this.head = new this.Node(object, this.head);
	}
}

class Employee {
	constructor(name) {
		this.name = name;
	}

	handle(call) {
		if (this.busy) return false;
		if (this.level < call.minimumReceiverLevel) return false;

		this.busy = true;
		console.log(`${this.name} received the call`);
		return true;
	}
}

const Level = {Respondent: 1, Manager: 2, Director: 3};

class Respondent extends Employee {
	constructor(name) {
		super(name);
		this.level = Level.Respondent;
	}
}

class Manager extends Employee {
	constructor(name) {
		super(name);
		this.level = Level.Manager;
	}
}

class Director extends Employee {
	constructor(name) {
		super(name);
		this.level = Level.Director;
	}
}

class Call {
	constructor(caller, subject, minimumLevel) {
		this.caller = caller;
		this.subject = subject;
		this.minimumReceiverLevel = minimumLevel;
	}
}

class CallCenter {
	constructor() {
		this.levels = {};
		Object.values(Level).forEach((level) => this.levels[level] = new LinkedList());
	}

	addEmployee(employee) { // employee subscribe "all" or "specific call"
		let empLL = this.levels[employee.level];
		if (empLL) empLL.prepend(employee);
	}

	dispatchCall(call) {
		let availLLs = Object.entries(this.levels).filter(([k, v]) => k >= call.minimumReceiverLevel)
													.sort().map(([k,v]) => v);
		for (let ll of availLLs) {
			let employeeNode = ll.head;
			while (employeeNode) {
				if (employeeNode.object.handle(call)) return true;
				employeeNode = employeeNode.next;
			}
		}
	}
}

console.log("Cracking Interview 7.2");
let respondent1 = new Respondent("respondent 1");
let respondent2 = new Respondent("respondent 2");
let respondent3 = new Respondent("respondent 3");
let manager1 = new Manager("manager 1");
let director1 = new Director("director 1");

let callCenter = new CallCenter();
callCenter.addEmployee(respondent1);
callCenter.addEmployee(respondent2);
callCenter.addEmployee(respondent3);
callCenter.addEmployee(manager1);
callCenter.addEmployee(director1);

let caller = new Employee("caller");
callCenter.dispatchCall(new Call(caller, "test1", Level.Respondent));
callCenter.dispatchCall(new Call(caller, "test2", Level.Respondent));
callCenter.dispatchCall(new Call(caller, "test3", Level.Manager));
callCenter.dispatchCall(new Call(caller, "test4", Level.Director));


//
// ========================================================================================================
//
//
//
// Cracking Interview 7.3
// Jukebox: Design a musical jukebox using object-oriented principles.
//
class User {}

class Song {
	constructor(id, cdId, title, genre, artist) { // and more ...
	}
}

class CD {
	constructor(id, artist, songs) { // and more ...
	}
}

class Playlist {
	constructor(songs) {
		this.songs = new LinkedList();
		songs.forEach(s => this.songs.append(s));
	}
	
	insert(index) {}
	remove(song) {}
}

class Player {
	constructor() {}

	stop() {}

	// repeat = 0 ==> play infinitely
	play(playlist, repeat = 1) {
		let song = playlist.head;
		let counter = repeat == 0 ? 1 : repeat;

		while (song && counter > 0) {
			// play song
			// next
			if (repeat == 0) {
				song = song.next || playlist.head;
			} else {
				song = song.next;
				if (!song) {
					song = playlist.head;
					counter--;
				}
			}
		}
	}
}

class Jukebox {
	constructor(player) {
		this.player = player || new Player();
	}

	setUser(user) {
		this.user = user;
		// load last playlist, last song, volume ... 
		this.loadUserConfig();
	}

	loadCD(id) {
		let cdPlaylist = new Playlist([]); // ...
		this.setPlaylist(cdPlaylist);
	}

	// load artist's playlist, user custom playlist ...
	loadPlaylist() {}

	setPlaylist(playlist) {
		this.player.stop();
		this.currPlaylist = playlist;
		this.player.play(this.currPlaylist);
	}

	insertSongToCurrPlaylist(song, insertIndex) {}
	removeSongFromCurrPlaylist(song) {}
	
	// play single song
	setSong(song) {
		this.setPlaylist([song]);
	}
}



//
// ==============================================================================================
//
//
//
// Cracking Interview 7.4
// Parking Lot: Design a parking lot using object-oriented principles
//
const VehicleSize = { Small: 1, Medium: 2, Large: 3, XLarge: 4 };
class Vehicle {
	constructor(id, size) {
		this.id = id;
		this.size = size;
	}
}

class MotorCycle extends Vehicle {
	constructor(id) {
		super(id, VehicleSize.Small);
	}
}

class Car extends Vehicle {
	constructor(id) {
		super(id, VehicleSize.Medium);
	}
}

class Bus extends Vehicle {
	constructor(id) {
		super(id, VehicleSize.Large);
	}
}

const SpotSize = { Small: 1, Compact: 2, Large: 4 };
class Spot {
	constructor(level, size) {
		this.size = size;
		this.occupy = undefined;
	}

	occupied(vehicle) {
		this.occupy = vehicle.id;
	}
}

class ParkingLevel {
	constructor(floorIndex, spots) {
		this.floorIndex = floorIndex;
		this.spots = spots;
	}

	findAvailableSpots(spaceNeeded) {
		if (spaceNeeded >= SpotSize.Large) {
			// find consecutive available (and fit size) Large spots, e.g 8 space = 2 consecutive large spot
			// if could not found, find Large + Compact, e.g 6 space = 1 large + the next compact
			// if could not found, find Compact + Small
		} else if (spaceNeeded >= Spot.Compact) {
			// find consecutive available (and fit size) Compact + Small
		} else {
			// find consecutive available (and fit size) small spots
		}
	}

	occupySpots(spots, vehicle) {
	}
}

class ParkingLot {
	constructor(levels) {
		this.levels = levels;
	}

	// checking and return available spots for the input vehicle
	// return null if there're no available spots
	getSpots(forVehicle) {
		let spaceNeeded = this.getSpaceNeeded(forVehicle);
		for (let level of this.levels) {
				let spots = level.findAvailableSpots(spaceNeeded);
				if (spots) return spots;
		}
	}

	// vehicle occupy spots
	setSpots(spots, forVehicle) {
		spots.each(s => s.occupied(forVehicle));
	}

	// calculate number of SpotSize.Small
	getSpaceNeeded(vehicle) {
		switch(vehicle.size) {
			case VehicleSize.Small: // VehicleSize.Small == SpotSize.Small
				return 1;

			case VehicleSize.Medium:
				return 2;

			case VehicleSize.Large:
				return 4;

			case VehicleSize.XLarge:
				return 6;
		}
	}
}


//
// ===================================================================================================
//
//
//
// Cracking Interview 7.5
// Online Book Reader: Design an online book reader system.
//
class User {
}

class UserRepository {
}

class Book {
	constructor(id, title, author, publishDate) {
		// ...
	}
}

class BookRepository {
	upload(book, file) {
		// save to db book, file and the relationship 1 book - many files
	}

	searchBook(keyword) {}
	loadBook(bookId) {}

	loadFile(bookId, extension) {
		// load the book file with extension
	}
}

class BookViewer {
	constructor(file) {
		this.file = file;
	}

	showPage(pageNumber) {}
	nextPage() {}
	prevPage() {}
}

class PdfViewer extends BookViewer {}
class MobiViewer extends BookViewer {}

class OnlineBookReaderSystem {
	constructor(userRepo, bookRepo) {
		this.userRepo = userRepo;
		this.bookRepo = bookRepo;
		this.supportDisplayers = {
			"pdf": PdfViewer,
			"mobi": MobiViewer
		}
	}

	signIn(user) {}
	signOut(user) {}

	
	loadBooksList() {}
	searchBook(keyword) {}
	displayBook(bookId, displayExtension = "pdf") {
		let file = this.bookRepo.loadFile(bookId, displayExtension);
		(new this.supportDisplayers[displayExtension](file)).showPage(0);
	}
}




//
// =====================================================================================================
//
//
//
// Cracking Interview 7.6
// Jigsaw: Implement an NxN jigsaw puzzle. Design the data structures and explain an algorithm to solve
// the puzzle. You can assume that you have a fitsWith method which, when passed two puzzle edges, 
// return true if the two edges belong together.
//
class Edge {
	constructor(pixels) {}

	// assume
	fitsWith(edge) {}
}

const Oriented = { Left: 1, Top: 2, Right: 3, Bottom: 4 }

class Piece {
	constructor(...edges, centerPixels) { // 4 edges: left, top, right, bottom
		this.edges = edges;
	}

	rotate(angle) { // angle: 0, 90, 180, 270 
		// swap 4 edges
	}

	setPosition(row, column) {
		this.position = [row, colum];
	}

	match(piece, oriented) {
		// check oriented to determine which edge compare to which edge
		switch(oriented) {
			case Oriented.Left:
				return this.edges[0].fitsWith(piece.edges[2]); // piece.right <> this.left
			case Oriented.Right:
				return this.edges[2].fitsWith(piece.edges[0]);
			case Oriented.Top:
				return this.edges[1].fitsWith(piece.edges[3]);
			case Oriented.Bottom:
				return this.edges[3].fitsWith(piece.edges[1]);
		}
	}
}

class Puzzle {
	#originPieces;

	// init a puzzle with 2d Array NxN origin pieces, 
	// e.g. split an image into NxN pieces
	constructor(pieces, size) {
		this.#originPieces = pieces;
		this.size = size;
	}

	// return an 1d array of shuffle pieces
	shufflePieces() {}

	// assume that there's only one solution
	// that is the origin pieces (in order)
	check(pieces) {
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (this.#originPieces[i][j] !== pieces[i][j]) return false;
			}
		}

		return true;
	}
}

class BacktrackingSolver {
	solve(puzzle) {
		let pieces = puzzle.shufflePieces();
		let solution = [];
		return this.trySolution(solution, pieces, [0, 0], puzzle.size);	
	}

	trySolution(solution, pieces, position, size) {
		for (let piece of pieces) {
			if (!piece.position && tryPiece(solution, piece, position)) {
				solution[position[0]][position[1]] = piece;

				let column = position[1] + 1, row = position[0];
				if (column >= size) {
					column = 0;
					row++;
					if (row >= size) return true;
				}
				
				let recusive = trySolution(solution, pieces, [row, column], size);

				if (!recursive) {
					solution[position[0]][position[1]] = null;
					piece.position = null;
				} else {
					return true;
				}
			}
		}
		return false;
	}

	tryPiece(solution, piece, position) {
		if (let leftPiece = solution[position[0]-1, position[1]]) {
			if (!leftPiece.match(piece, Oriented.Left)) return false;
		}
		// also check top, right, bottom
		// if all matched
		return true;
	}
}




//
// ===============================================================================================
//
//
//
// Cracking Interview 7.7
// Chat Server: Explain how you would design a chat server. In particular, provide details about
// the various backend components, classes, and methods.
// What would be the hardest problems to solve ?
//

class User { // user model }
class UserRepository { // query user from db }

class Socket { // client - server connection 
	receive(message) {
		if (message = "ping") {
		} else {
			this.receiveCallbacks.forEach(callback => callback(message));
		}
	}

	send(message) {}

	disconnected() {// be called when no receiving ping for long time
		this.connectionCallbacks.forEach(callback => callback(false));
	}

	connected() {}
}

class Client { // User/IP/Socket 
	constructor(user) {
		this.user = user;
		this.socket = establishSocketConnection();
	}
}

class Room { // group of users(clients) 
	add(client) {
			this.clients.push(client);
			client.socket.receiveCallbacks.push(message => this.broadcast(message, client));
			client.socket.connectionCallbacks.push(status => this.updateStatus(client, status));
	};

	remove(client) {}

	updateStatus(client, status) {}

	broadcast(message, fromClient) {
		if (message.roomId == this.id) {
			this.clients.each(client => {
				if(client !=== fromClient) client.send(message);
			});
		}
	}
}

class P2p { // user-user directly connection
}

class ChatServer {
	connect(user) { // return established client }
	disconnect(user) { // user sign out }
	createRoom() {}
	createP2p(client, client) {}
	joinRoom(client, room) { // return sucess or rejected }
	outRoom(client, room) {}
}



//
// ==============================================================================================
//
//
//
// Cracking Interview 7.8
// Othello: Each Othello piece is white on one side and black on the other.
// When a piece is surrounded by its opponents on both the left and right sides, or both the top
// and bottom, it is said to be captured and its color is flipped. On your turn, you must capture
// at least one of your opponent's pieces. The game ends when either user has no more valid moves.
// The win is assigned to the person with the most pieces. 
// Implement the object-oriented design for Othello.
//
const Colors = {White: 0, Black: 1};

class Piece {
	constructor(color) {
		this.color = color;
	}

	flipped() {
		this.color = 1 - this.color;
	}
}

class GameBoard {
	constructor(size) {
		this.pieces = [];
	}

	setPiece(piece, row, column) {}

	flipPiece(row, column) {}
}

class Player {}

class Othello {
	constructor(player1, player2) {
		this.board = new GameBoard(8);
		this.player1 = player1;
		this.player2 = player2;

		this.player1.playCallback = (row, column) => {
			let piece = new Piece(Color.White);
			this.play(piece, row, column);
		}

		this.player2.playCallback = (row, column) => {
			let piece = new Piece(Color.Black);
			this.play(piece, row, column);
		}
	}

	play(piece, row, column) {
		if (this.board.setPiece(piece, row, column)) {
			// game rule
			if (
				// left + right
				(this.board.pieces[row - 1][column].color != piece.color &&
					this.board.pieces[row + 1][column].color != piece.color) ||
				// top + bottom
				(this.board.pieces[row][column - 1].color != piece.color &&
					this.board.pieces[row][column + 1].color != piece.color)
			) {
				this.board.flipPiece(row, column);
			}
		} else {
			// check game end conditions
		}
	}
}


//
// ================================================================================================
//
//
//
// Cracking Interview 7.9
// Circular Array: Implement a CircularArray class that support an array-like data structure
// which can be efficiently rotated. If possible, the class should use a generic type (also
// called a template), and should support iteration.
//
class CircularArray {
	constructor() {
		this.items = [];
		this.head = 0;
	}

	size() {
		return this.items.length;
	}

	get(index) {
		return this.items[this.getRotatedIndex(index)];		
	}

	set(index, item) {
		this.items[this.getRotatedIndex(index)] = item;
	}

	rotate(shiftRight) {
		this.head = this.getRotatedIndex(shiftRight);
	}

	getRotatedIndex(index) {
		return (this.head + index) % this.items.length;
	}

	iterator() {
		let currIndex = 0;
		let source = this;

		const iterator = {
			next: function() {
				let result = {value: source.get(currIndex), done: this.hasNext() };
				currIndex++;
				return result;
			},
			hasNext: function() {
				return currIndex < source.size() - 1;
			}
		};

		return iterator;
	}
}



//
// ========================================================================================================
//
//
//
// Cracking Interview 7.10
// Minesweeper: Design and implement a text-based Minesweeper game. Minesweeper is the classic
// single-player computer game where an NxN grid has B mines (or bombs) hidden accross the grid.
// The remaining cells are either blank or have a number behind them. The numbers reflect the number
// of bombs in the surrounding eight cells. The user then uncovers a cell. If it's a bomb, the player
// loses. If it is a number, the number is exposed. If it's a blank cell, this cell and all adjacent
// blank cells (up to and including the surrounding numeric cells) are exposed. The player wins when
// all non-bomb cells are exposed. The player can also flag certain places as potential bombs. This
// doesn't affect game play, other than to block the user from accidentally clicking a cell that is 
// thought to have a bomb.
//
class Cell {
	constructor(number) { // Number.MAX_VALUE is the bomb
		this.number = number;
		this.flagged = false;
		this.exposed = false;
	}

	toggleFlag() { this.flagged = !this.flagged; }

	expose() { this.exposed = true; }

	display() {
		if (this.exposed) {
			return this.number < Number.MAX_VALUE ? (this.number > 0 ? this.number : "") : "*"; // "*" is bomb
		} else if (this.flagged) {
			return "!";
		} else {
			return "?";
		}
	}
}

class Grid {
	constructor(size, cells) {
		this.size = size;
		this.cells = cells;
	}

	// return false if it's a bomb
	explore(row, column) {
		if (this.cells[row][column] == Number.MAX_VALUE) return false;
		this.expose(row, column);		
	}

	expose(row, column) {
		this.cells[row][column].expose();
		if (this.cells[row - 1][column].number == 0) this.expose(row-1, column);
		if (this.cells[row - 1][column - 1].number == 0) this.expose(row-1, column-1);
		if (this.cells[row - 1][column + 1].number == 0) this.expose(row-1, column+1);
		if (this.cells[row][column - 1].number == 0) this.expose(row, column-1);
		if (this.cells[row][column + 1].number == 0) this.expose(row, column+1);
		if (this.cells[row + 1][column - 1].number == 0) this.expose(row+1, column-1);
		if (this.cells[row + 1][column].number == 0) this.expose(row+1, column);
		if (this.cells[row + 1][column + 1].number == 0) this.expose(row+1, column+1);
	}
}

class Minesweeper {
	createNewGrid(size, maxNumBomb) {
		let bombCounter = 0;
		let cells = [];
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				let isBomb = bombCounter > maxNumBomb ? false : Math.random() < 0.2;
				bombCounter += isBomb ? 1 : 0;
				cells[i][j] = isBomb ? Number.MAX_VALUE : 0;
			}
		} // we could shuffle cells to placing bombs more randomly.

		let grid = new Grid(size, cells);
		// set reflect bomb number
		for (let row = 0; row < size; row++) {
			for (let column = 0; column < size; column++) {
				let refectNumber = 0;
				if (this.cells[row - 1][column].number == Number.MAX_VALUE) refectNumber++;
				if (this.cells[row - 1][column - 1].number == Number.MAX_VALUE) reflectNumber++;
				if (this.cells[row - 1][column + 1].number == Number.MAX_VALUE) reflectNumber++;
				if (this.cells[row][column - 1].number == Number.MAX_VALUE) reflectNumber++;
				if (this.cells[row][column + 1].number == Number.MAX_VALUE) reflectNumber++;
				if (this.cells[row + 1][column - 1].number == Number.MAX_VALUE) reflectNumber++;
				if (this.cells[row + 1][column].number == Number.MAX_VALUE) reflectNumber++;
				if (this.cells[row + 1][column + 1].number == Number.MAX_VALUE) reflectNumber++;

				grid.cells[row][column] = reflectNumber;
			}
		}

		return grid;
	}
}


//
// =========================================================================================================
//
//
//
// Cracking Interview 7.11
// File System: Explain the data structures and algorithms that you would use to design an in-memory
// file system. Illustrate with an example in code where possible.
//
class Entry {
	constructor(name, parent) {
		this.name = name;
		this.parent = parent;
		this.createdAt = Date.now();
	}

	path() {
		if (!this.parent) return "./"; // root
		return this.parent.path() + `/${this.name}`;
	}

	delete() {
		if (!parent) return false; // could not delete the root
		return this.parent.deleteEntry(this);
	}
}

class File extends Entry {
}

class Directory extends Entry {
	constructor(name, parent) {
		super(name, parent);
		this.entries = [];
	}

	addEntry(entry) {
		this.entries.push(entry);
	}

	deleteEntry(entry) {
		this.entries = this.entries.filter(item => item === entry);
	}
}


//
// =======================================================================================================
//
//
//
// Cracking Interview 7.12
// Hash Table: Design and implement a hash table which uses chaining (linked list) to handle collisions.
//
class HashTable {
	constructor() {
		this.chains = [];
	}

	hash(key) {}

	set(key, value) {
		let chainIndex = this.hash(key);
		this.chains[chainIndex] ||= new LinkedList();
		this.chains[chainIndex].append(new LinkedList.Node(key, value));
	}

	get(key) {
		let chain = this.chains[this.hash(key)];
		if (!chain) return;

		let p = chain.head;
		while (p) {
			if (p.key == key) return p.value; 
			p = p.next;
		}
	}

	delete(key) {
		let chain = this.chains[this.hash(key)];
		if (!chain) return;

		let p = chain.head;
		let prev = null;
		while (p) {
			if (p.key == key) {
				if (!prev) {
					chain.head = chain.head.next;
				} else {
					prev.next = p.next;
				}
				return true;
			}
			prev = p;
			p = p.next;
		}	
	}
}
