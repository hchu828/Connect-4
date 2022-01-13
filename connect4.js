"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2

// TODO: We may need to find a way to mututate the board to avoid global variables.
const board = []; // array of rows, each row is array of cells  (board[y][x])
const spaceCounter = [];
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(board) {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    let row = [];
    for (let j = 0; j < WIDTH; j++) {
      row.push(null);
    }
    board.push(row);
  }
}

function makeSpaceCounter() {
  for (let i = 0; i < WIDTH; i++) {
    spaceCounter.push(HEIGHT - 1);
  }
  console.log(spaceCounter);
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");
  // Create and add piece dropzone, add click listener.
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Create cells for column identification for piece dropzone
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    // TODO: Create a table row element and assign to a "row" variable
    let row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      // TODO: Create a table cell element and assign to a "cell" variable
      let cell = document.createElement("td");
      // TODO: add an id, y-x, to the above table cell element
      // you'll use this later, so make sure you use y-x
      cell.setAttribute('id', `${y}-${x}`);
      // TODO: append the table cell to the table row
      row.append(cell);
    }
    // TODO: append the row to the html board
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  return (spaceCounter[x] !== -1) ? spaceCounter[x] : null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add("piece", `p${currPlayer}`);
  const boardLoc = document.getElementById(`${y}-${x}`);
  boardLoc.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  let stopGame = document.getElementById("column-top");
  stopGame.removeEventListener("click", handleClick);
  alert(`Player ${currPlayer} wins!`);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;
  spaceCounter[x]--;



  //check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }



  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board[0].every(cell => cell !== null)) {
    return endGame("TIE!");
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = (currPlayer === 1) ? 2 : 1;

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // TODO: Check four cells to see if they're all legal & all color of current
    // player
    for (let i = 0; i < cells.length; i++) {
      const boardY = cells[i][0];
      const boardX = cells[i][1];
      console.log("boardY: ", boardY);
      console.log("boardX: ", boardX);
      if (boardY > 5 || boardY < 0 || boardX > 6 || boardX < 0) {
        return false;
      }
      if (board[boardY][boardX] !== currPlayer) {
        return false;
      }
    }
    return true;
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // TODO: assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y - 1, x], [y - 2, x], [y - 3, x]];
      let diagDL = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard(board);
makeHtmlBoard();
makeSpaceCounter();
