"use strict";

// gameBoard, displayController - module
// player - factory

// game-name: Tic tAc toE
// game-over: GAME OVER
// win: WIN
// draw: DRAW
// .try-again: TRY AGAIN
const resultEl = document.querySelector("h1");
const btnMark = document.querySelector(".radio--mark");
const btnRestart = document.querySelector(".btn--restart");
const boxes = document.querySelectorAll(".box");
const xMarkBtn = document.querySelector(".label-x");

let gameBoard = new Array(9).fill("");
let result;
const MAX = 9;
const SEC = 0.15;
const LINES = 3;
const DIAGONAL = 2;
const GAME = "Tic tAc toE";

function Person(mark) {
  // const _score = [0, 0];
  const choice = function (e, click = true) {
    const target = !click ? e : e.target;
    if (target.textContent) return;

    const index = +target.dataset.box;
    gameBoard[index] = this.mark;

    displayMark(target, this.mark, index);
  };
  return { mark, choice };
}

const player = Person();
const computer = Person();

// Model
const definePlayerMark = function (mark) {
  const playerM = mark;
  const computerM = playerM === "x" ? "o" : "x";

  return { playerM, computerM };
};

const convertToUpperCase = function (str) {
  return str.replace("-", " ").toUpperCase();
};

const getRandomNum = function () {
  const choice = Math.trunc(Math.random() * MAX);
  // BUG
  if (gameBoard[choice]) return getRandomNum();
  else return choice;
};

const checkMark = function (arr, mark) {
  return arr.every((x) => x === mark);
};

const checkWinner = function (gameBoard, mark) {
  // Check row
  for (let i = 0; i < LINES; i++) {
    const time = i * 3;
    const arr = gameBoard.slice(0 + time, 3 + time);
    if (checkMark(arr, mark)) return true;
  }

  // Check column
  for (let i = 0; i < LINES; i++) {
    const arr = gameBoard.filter((_, index) => index % 3 === i);
    if (checkMark(arr, mark)) return true;
  }

  // Check diagonal
  for (let i = 0; i < DIAGONAL; i++) {
    const time = 2 * i + 2;
    let arr = gameBoard.filter((_, index) => index % time === 0);
    if (i === 0) arr = arr.slice(1, -1);
    if (checkMark(arr, mark)) return true;
  }

  return false;
};
console.log(checkWinner(["o", "x", "x", "x", "x", "o", "o", "o", "o"], "o"));

// View
const displayMark = function (target, mark, i) {
  const markup = `<span class="${mark}">${convertToUpperCase(mark)}</span>`;
  target.innerHTML = markup;

  gameBoard[i] = mark;
};

const displayResult = function (strResult) {
  resultEl.classList.add(strResult);
  resultEl.textContent = convertToUpperCase(strResult);
  btnRestart.classList.toggle("try-again");
  btnRestart.textContent = convertToUpperCase("try-again");
  Array.from(boxes).forEach((box) =>
    box.removeEventListener("click", controlPlayer)
  );
};

const clearGame = function (result) {
  resultEl.className = "game-name";
  resultEl.textContent = GAME;
  btnRestart.classList.remove("try-again");
  btnRestart.textContent = convertToUpperCase("restart");
  Array.from(boxes).forEach((box) =>
    box.addEventListener("click", controlPlayer)
  );

  // BUG
  gameBoard = gameBoard.map((mark) => (mark = ""));
  Array.from(boxes).forEach((box) => (box.innerHTML = ""));
};

// Controller
const controlDisplay = function (e) {
  const btn = e.target.closest(".label");
  if (!btn) return;

  const mark = btn.getAttribute("value");

  // Define player mark
  const { playerM, computerM } = definePlayerMark(mark);
  player.mark = playerM;
  computer.mark = computerM;

  // Re-set game
  Array.from(boxes).forEach((box) =>
    box.removeEventListener("click", controlPlayer)
  );
  clearGame();

  // If player's mark is O, computer's X mark starts first.
  if (player.mark === "o")
    computer.choice.bind(computer, boxes[getRandomNum()], false)();
};

const controlPlayer = function (e) {
  player.choice.bind(player, e, true)();
  if (checkWinner(gameBoard, player.mark)) return displayResult("win");

  if (gameBoard.every((mark) => mark !== "")) return displayResult("draw");

  setTimeout(() => {
    computer.choice.bind(computer, boxes[getRandomNum()], false)();
    if (checkWinner(gameBoard, computer.mark)) return displayResult("lose");
  }, SEC * 1000);
};

// Start
const init = function () {
  // Render mark
  Array.from(boxes).forEach((box) =>
    box.addEventListener("click", controlPlayer)
  );

  // Select mark & Restart
  btnMark.addEventListener("click", controlDisplay);

  // Restart
  btnRestart.addEventListener("click", () => xMarkBtn.click());

  // Default start
  xMarkBtn.click();
};
init();
