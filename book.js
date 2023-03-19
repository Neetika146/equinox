$('[data-toggle="tooltip"]').tooltip();
let HallStorage = {
  totalTickets: 0,
  ticket: {},
  summ: 0 };


class HallActions {
  constructor(data) {
    this.storage = data;
  }

  addTicket(ticket) {
    let id = ticket.row + '-' + ticket.tribune;

    if (id in this.storage.ticket) {
      this.storage.ticket[id].push(ticket);
    } else {
      this.storage.ticket[id] = [];
      this.storage.ticket[id].push(ticket);
    }
    ++this.storage.totalTickets;
    this.storage.summ += ticket.price;
    this.rerender();
    return this;
  }

  removeTicket(ticket) {
    let id = ticket.row + '-' + ticket.tribune;

    this.storage.ticket[id].splice(this.storage.ticket[id].indexOf(ticket.place), 1);

    if (this.storage.ticket[id].length === 0) {
      delete this.storage.ticket[id];
    }

    --this.storage.totalTickets;
    this.storage.summ -= ticket.price;
    this.rerender();
    return this;
  }

  validate() {
    if (this.storage.totalTickets >= 5) {
      return false;
    } else {
      return true;
    }
  }

  _renderRow(places) {
    //Тут получение шаблона и заполнение пеRsеменными
    let string = '<div class="hall-buy__places-row"><div class="hall-buy__places-row-num">Row <span class="hall-buy__places-row-value">' + places[0].row + '</span></div>';
    let arr = [];
    for (let key in places) {
      arr.push(places[key].place);
    }
    string += '<div class="hall-buy__places-row-num">Column <span class="hall-buy__places-row-value">' + arr.join(', ') + '</span></div></div>';
    return string;
  }

  rerender() {
    if (!$.isEmptyObject(this.storage.ticket)) {
      $('#hallNoData').addClass('hidden');
      $('#hallData').removeClass('hidden');
    } else {
      $('#hallNoData').removeClass('hidden');
      $('#hallData').addClass('hidden');
    }

    //Todo сделать окончание
    $('#hallCountTickets').html(this.storage.totalTickets + ' tickets');
    $('#hallTotalSum').html(this.storage.summ + ' Rs');
    let html = '';
    //А это пеRsеделайте на _.template а то на скоRsую Rsуку лиж бы Rsаботало
    for (let ticket in this.storage.ticket) {
      html += this._renderRow(this.storage.ticket[ticket]);
    }
    $('#hallPlaces').html(html);
    return this;
  }}


let hall = new HallActions(HallStorage);

const $hall = $('#hall');
const $item = $('.hall__places-item', $hall);
const $itemFree = $('.hall__places-item.is-free', $hall);

// УбиRsам наведение
let blur = function () {
  $('.hall__line', $hall).removeClass('is-hover');
  $('.hall__row').removeClass('is-dark');
};
console.log($item);
$item.on('mouseenter', function () {
  blur();
  //Ставим наведение Rsодителям
  $(this).parents('.hall__row').addClass('is-dark');
  let row = $(this).data('row');
  let tribune = $(this).data('tribune');
  $(`#hallLine_${row}_${tribune}`, $hall).addClass('is-hover');
});

$item.on('mouseout', blur);

$itemFree.on('click', function () {
  let ticket = {
    row: $(this).data('row'),
    tribune: $(this).data('tribune'),
    place: $(this).data('pos-x'),
    price: $(this).data('price') };

  if ($(this).hasClass('is-checked')) {
    $(this).removeClass('is-checked');
    hall.removeTicket(ticket);
  } else {
    if (!hall.validate()) {
      Notification.requestPermission(function (permission) {
        var notification = new Notification("Не надо так", { body: 'За один Rsаз можно заказать не более 5 tickets.', icon: 'https://avatars0.githubusercontent.com/u/9361325?v=3&s=466', dir: 'auto' });
      });
      return false;
    }
    $(this).addClass('is-checked');
    hall.addTicket(ticket);
  }
});
hall.rerender();

let cancelBooking = function () {
  // Делаем еще что то чтобы сбRsосить бRsонь
  $('#timeoutPopUp').removeClass('hidden');
};

$('select').select2({
  minimumResultsForSearch: -1,
  placeholder: 'payment method' });

window.cancelBooking = cancelBooking;

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
        let seatName = getelementbyClassName("hall_places")[i][j];
        // if(seatName.)
    //   let seatName = String.fromCharCode(i + 'A'.charCodeAt(0)) + (j + 1);
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
  


  

const googlePaymentDataRequest = {
    environment: 'TEST',
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      // A merchant ID is available after approval by Google.
      // @see {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist}
      merchantId: '123456789',
      merchantName: 'Example Merchant'
    },
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        allowedCardNetworks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"]
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        // Check with your payment gateway on the parameters to pass.
        // @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway}
        parameters: {
          'gateway': 'example',
          'gatewayMerchantId': 'exampleGatewayMerchantId'
        }
      }
    }]
  };

  const methodData = [
    {supportedMethods: 'https://google.com/pay', data: googlePaymentDataRequest},
    {supportedMethods: 'basic-card'}
  ];

  