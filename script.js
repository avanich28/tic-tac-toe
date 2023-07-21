"use strict";

function Player(mark) {
  const _mark = mark;
  const getMark = () => _mark;

  const choice = function (index) {
    model.checkFill(index);

    model.updateGameBoard(index, _mark);

    view.renderMark(index, _mark);
  };
  return { getMark, choice };
}

const model = (function () {
  const _gameBoard = new Array(9).fill("");
  const _MAX = 9;
  const _LINES = 3;
  const _DIAGONAL = 2;

  const _checkMark = function (arr, mark) {
    return arr.every((x) => x === mark);
  };

  const checkFill = function (i) {
    return _gameBoard[i] !== "" ? false : true;
  };

  const updateGameBoard = (i, mark) => {
    _gameBoard[i] = mark;
  };

  const checkTurn = function () {
    return _gameBoard.every((mark) => mark !== "");
  };

  const convertToUpperCase = function (str) {
    return str.replace("-", " ").toUpperCase();
  };

  const getRandomNum = function () {
    const choice = Math.trunc(Math.random() * _MAX);
    // Recursive
    if (_gameBoard[choice]) return getRandomNum();
    else return choice;
  };

  const checkWinner = function (mark) {
    // Check row
    for (let i = 0; i < _LINES; i++) {
      const time = i * 3;
      const arr = _gameBoard.slice(0 + time, 3 + time);
      if (_checkMark(arr, mark)) return true;
    }

    // Check column
    for (let i = 0; i < _LINES; i++) {
      const arr = _gameBoard.filter((_, index) => index % 3 === i);
      if (_checkMark(arr, mark)) return true;
    }

    // Check diagonal
    for (let i = 0; i < _DIAGONAL; i++) {
      const time = 2 * i + 2;
      let arr = _gameBoard.filter((_, index) => index % time === 0);
      if (i === 0) arr = arr.slice(1, -1);
      if (_checkMark(arr, mark)) return true;
    }

    return false;
  };

  return {
    checkFill,
    checkTurn,
    updateGameBoard,
    convertToUpperCase,
    getRandomNum,
    checkWinner,
  };
})();

const view = (function () {
  const _resultEl = document.querySelector("h1");
  const _btnMark = document.querySelector(".radio--mark");
  const _btnRestart = document.querySelector(".btn--restart");
  const _boxes = document.querySelectorAll(".box");
  const _board = document.querySelector(".board");
  const GAME = "Tic tAc toE";

  _btnRestart.addEventListener("click", () =>
    _btnMark.querySelector(".label-x").click()
  );

  const addHandlerGame = function (handler) {
    _btnMark.addEventListener("click", function (e) {
      const btn = e.target.closest(".label");
      if (!btn) return;
      const mark = btn.getAttribute("value");

      handler(mark);
    });
  };

  const addHandlerHumanMove = function (handler) {
    _board.addEventListener("click", handler);
  };

  const renderMark = function (i, mark) {
    const markup = `<span class="${mark}">${model.convertToUpperCase(
      mark
    )}</span>`;
    _boxes[i].innerHTML = markup;
  };

  const renderResult = function (strResult) {
    _resultEl.classList.add(strResult);
    _resultEl.textContent = model.convertToUpperCase(strResult);
    _btnRestart.classList.add("try-again");
    _btnRestart.textContent = model.convertToUpperCase("try-again");
  };

  const clearDisplay = function (func) {
    _resultEl.className = "game-name";
    _resultEl.textContent = GAME;
    _btnRestart.classList.remove("try-again");
    _btnRestart.textContent = model.convertToUpperCase("restart");

    _board.addEventListener("click", func);

    for (let i = 0; i < _boxes.length; i++) {
      model.updateGameBoard(i, "");
    }

    Array.from(_boxes).forEach((box) => (box.innerHTML = ""));
  };

  // Prevent player to click on the board game
  const removeClickEvent = function (func) {
    _board.removeEventListener("click", func);
  };

  return {
    addHandlerGame,
    addHandlerHumanMove,
    renderMark,
    renderResult,
    clearDisplay,
    removeClickEvent,
  };
})();

const controller = (function () {
  let _human;
  let _computer;
  const _SEC = 0.15;

  const _controlResult = function (str, func) {
    view.renderResult(str);
    view.removeClickEvent(func);
  };

  const _computerMove = function () {
    setTimeout(() => {
      _computer.choice.bind(_computer, model.getRandomNum())();

      if (model.checkWinner(_computer.getMark()))
        return _controlResult("lose", humanMove);

      if (model.checkTurn()) return _controlResult("draw", humanMove);
    }, _SEC * 1000);
  };

  const controlGameStart = function (mark = "x") {
    _human = Player(mark);
    _computer = Player(mark === "x" ? "o" : "x");

    // Reset game
    view.removeClickEvent(humanMove);
    view.clearDisplay(humanMove);

    if (_human.getMark() === "o")
      _computer.choice.bind(_computer, model.getRandomNum(), false)();
  };

  const humanMove = function (e) {
    // NOTE If we use different name function when we remove/add EventListener, receives argument 2 times(el, pointEvent obj).
    const box = e.target.closest(".box");
    if (!box) return;

    _human.choice.bind(_human, +box.dataset.box)();

    if (model.checkWinner(_human.getMark()))
      return _controlResult("win", humanMove);

    if (model.checkTurn()) return _controlResult("draw", humanMove);

    _computerMove();
  };

  return { controlGameStart, humanMove };
})();

const init = function () {
  // Render mark when click on board
  view.addHandlerHumanMove(controller.humanMove);

  // Select mark & Restart
  view.addHandlerGame(controller.controlGameStart);

  // Default Start
  controller.controlGameStart();
};
init();
