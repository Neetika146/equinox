// Define a class for each seat
class Seat {
  constructor(row, column, isReserved) {
    this.row = row;
    this.column = column;
    this.isReserved = isReserved;
  }
}

// Define a Trie node
class TrieNode {
  constructor() {
    this.isEndOfWord = false;
    this.seats = [];
    this.children = Array(26).fill(null);
  }
}

// Initialize a new Trie node
function newTrieNode() {
  return new TrieNode();
}

// Insert a new word and its corresponding seat in the Trie
function insert(root, word, seat) {
  let currentNode = root;
  for (let i = 0; i < word.length; i++) {
    let index = word.charCodeAt(i) - 'A'.charCodeAt(0);
    if (currentNode.children[index] === null) {
      currentNode.children[index] = newTrieNode();
    }
    currentNode = currentNode.children[index];
  }
  currentNode.isEndOfWord = true;
  currentNode.seats.push(seat);
}

// Search for a word in the Trie and return its corresponding seat
function search(root, word) {
  let seats = [];
  let currentNode = root;
  for (let i = 0; i < word.length; i++) {
    let index = word.charCodeAt(i) - 'A'.charCodeAt(0);
    if (currentNode.children[index] === null) {
      return seats;
    }
    currentNode = currentNode.children[index];
  }
  if (currentNode !== null && currentNode.isEndOfWord) {
    seats = currentNode.seats;
  }
  return seats;
}

// Print the seating chart
function printSeatingChart(seatingChart) {
  console.log('   ' + Array.from(Array(seatingChart[0].length).keys()).map(x => x + 1).join('  '));
  for (let i = 0; i < seatingChart.length; i++) {
    console.log(String.fromCharCode(i + 'A'.charCodeAt(0)) + '  ' + seatingChart[i].map(seat => seat.isReserved ? 'X' : '_').join('  '));
  }
}

// Book a seat
function bookSeat(seatingChart, root) {
  let seatName = prompt('Enter the seat name (e.g., A1):');
  let seats = search(root, seatName);
  if (seats.length === 0) {
    alert('Sorry, the seat is not available. Please try again.');
    return;
  }
  let seat = seats[0];
  if (seat.isReserved) {
    alert('Sorry, the seat is already reserved. Please try again.');
    return;
  }
  seatingChart[seat.row][seat.column].isReserved = true;
  alert('The seat has been reserved. Thank you for booking with us!');
}

let numRows = 15;
let numColumns = 12;

// Initialize the seating chart
let seatingChart = Array(numRows).fill(null).map((row, rowIndex) => Array(numColumns).fill(null).map((column, columnIndex) => new Seat(rowIndex, columnIndex, false)));

// Initialize the Trie
let root = newTrieNode();
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numColumns; j++) {
    let seatName = String.fromCharCode(i + 'A'.charCodeAt(0)) + (j + 1);
    let seat = new Seat(i, j, false);
    insert(root, seatName, seat);
  }
}

// Print the initial seating chart
console.log('The initial seating chart:');
printSeatingChart(seatingChart);

// Book seats until the user cancels the operation
while (true) {
  let response = prompt('Do you want to book a seat? (Y/N)');
  if (response !== 'Y' && response !== 'y') {
    break;
  }
  bookSeat(seatingChart, root);
  console.log('The current seating chart:');
  printSeatingChart(seatingChart);
}

console.log('Thank you for using our auditorium seat booking web application!');