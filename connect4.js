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

const board = []; // array of rows, each row is array of cells  (board[y][x])
const spaceCounter = [];

const title = document.getElementById("title");

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    let row = [];
    for (let j = 0; j < WIDTH; j++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeSpaceCounter: make and initialize space counter 
 *    space counter = array of length WIDTH, each index corresponds to deepest available board space in column
 */

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
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Create cells for column identification for piece dropzone
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  return (spaceCounter[x] !== -1) ? spaceCounter[x] : null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement("div");
  piece.classList.add("piece", `p${currPlayer}`);
  const pieceLocation = document.getElementById(`${y}-${x}`);
  pieceLocation.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  const stopGame = document.getElementById("column-top");
  stopGame.removeEventListener("click", handleClick);
  title.innerHTML = (`Player ${currPlayer} wins!`);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
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
  if (board[0].every(cell => cell !== null)) {
    return endGame("TIE!");
  }

  // switch players
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

    for (let i = 0; i < cells.length; i++) {
      const boardY = cells[i][0];
      const boardX = cells[i][1];

      if (boardY > HEIGHT - 1 || boardY < 0 || boardX > WIDTH - 1 || boardX < 0) {
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

      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y - 1, x], [y - 2, x], [y - 3, x]];
      const diagDL = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
makeSpaceCounter();
