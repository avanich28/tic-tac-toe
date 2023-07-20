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

function Person(mark) {
  const _score = [0, 0];
  const choice = function (e, click = true) {
    const target = !click ? e : e.target;
    if (target.textContent) return;

    const index = +target.dataset.box;
    gameBoard[index] = this.mark;

    displayMark(target, this.mark, index);
  };
  // check winner func
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

const clearGame = function (result = false) {
  if (result) {
    resultEl.className = "game-name";
    resultEl.textContent = "Tic tAc toE";
  }

  // BUG
  gameBoard = gameBoard.map((mark) => (mark = ""));
  Array.from(boxes).forEach((box) => (box.innerHTML = ""));
};

const getRandomNum = function () {
  const choice = Math.trunc(Math.random() * MAX);
  // BUG
  if (gameBoard[choice]) return getRandomNum();
  else return choice;
};

// View
const displayMark = function (target, mark, i) {
  const markup = `<span class="${mark}">${convertToUpperCase(mark)}</span>`;
  target.innerHTML = markup;

  gameBoard[i] = mark;
};

const displayResult = function (result) {
  resultEl.classList = result;
  resultEl.textContent = convertToUpperCase(result);
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
  clearGame();
};

const controlPlayer = function (e) {
  player.choice.bind(player, e, true)();
  if (gameBoard.every((mark) => mark !== "")) return;
  setTimeout(
    () => computer.choice.bind(computer, boxes[getRandomNum()], false)(),
    SEC * 1000
  );
};

// Start
const init = function () {
  // Player plays game
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
