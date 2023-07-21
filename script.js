"use strict";

function Player(mark) {
  const getMark = () => mark;

  const choice = function (el) {
    const target = el;
    if (target.textContent) return;

    const index = +target.dataset.box;
    model.gameBoard[index] = this.getMark();

    view.renderMark(target, this.getMark(), index);
  };
  return { getMark, choice };
}

const model = (function () {
  const _MAX = 9;
  const _LINES = 3;
  const _DIAGONAL = 2;
  const gameBoard = new Array(9).fill("");
  let player;
  let computer;

  const _checkMark = function (arr, mark) {
    return arr.every((x) => x === mark);
  };

  const checkTurn = function (curBoard) {
    return curBoard.every((mark) => mark !== "");
  };

  const convertToUpperCase = function (str) {
    return str.replace("-", " ").toUpperCase();
  };

  const getRandomNum = function (curBoard) {
    const choice = Math.trunc(Math.random() * _MAX);
    // Recursive
    if (curBoard[choice]) return getRandomNum(curBoard);
    else return choice;
  };

  const checkWinner = function (mark, curBoard) {
    // Check row
    for (let i = 0; i < _LINES; i++) {
      const time = i * 3;
      const arr = curBoard.slice(0 + time, 3 + time);
      if (_checkMark(arr, mark)) return true;
    }

    // Check column
    for (let i = 0; i < _LINES; i++) {
      const arr = curBoard.filter((_, index) => index % 3 === i);
      if (_checkMark(arr, mark)) return true;
    }

    // Check diagonal
    for (let i = 0; i < _DIAGONAL; i++) {
      const time = 2 * i + 2;
      let arr = curBoard.filter((_, index) => index % time === 0);
      if (i === 0) arr = arr.slice(1, -1);
      if (_checkMark(arr, mark)) return true;
    }

    return false;
  };

  // Prevent player to click on the board game
  const removeClickEvent = function (el, func) {
    el.removeEventListener("click", func);
  };

  // Add click event back
  const addClickEvent = function (el, func) {
    el.addEventListener("click", func);
  };

  return {
    player,
    computer,
    gameBoard,
    checkTurn,
    convertToUpperCase,
    getRandomNum,
    checkWinner,
    removeClickEvent,
    addClickEvent,
  };
})();

const view = (function () {
  const _resultEl = document.querySelector("h1");
  const _btnMark = document.querySelector(".radio--mark"); // init
  const _btnRestart = document.querySelector(".btn--restart");
  const board = document.querySelector(".board");
  const boxes = document.querySelectorAll(".box");
  const GAME = "Tic tAc toE";

  const addHandlerGame = function (handler) {
    _btnMark.addEventListener("click", function (e) {
      const btn = e.target.closest(".label");
      if (!btn) return;
      const mark = btn.getAttribute("value");

      handler(mark);
    });
  };

  const addHandlerPlayerMove = function (handler) {
    board.addEventListener("click", handler);
  };

  const addHandlerRestart = function (handler) {
    _btnRestart.addEventListener("click", handler);
  };

  const renderMark = function (target, mark) {
    const markup = `<span class="${mark}">${model.convertToUpperCase(
      mark
    )}</span>`;
    target.innerHTML = markup;
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

    board.addEventListener("click", func);

    model.gameBoard = model.gameBoard.map((mark) => (mark = ""));
    Array.from(boxes).forEach((box) => (box.innerHTML = ""));
  };

  return {
    boxes,
    board,
    addHandlerGame,
    addHandlerPlayerMove,
    addHandlerRestart,
    renderMark,
    renderResult,
    clearDisplay,
  };
})();

const controller = (function () {
  const controlGame = function (mark = "x") {
    model.player = Player(mark);
    model.computer = Player(mark === "x" ? "o" : "x");

    // Reset game
    model.removeClickEvent(view.board, game.playerMove);
    view.clearDisplay(game.playerMove);

    // If player's mark is O, computer's X mark starts first.
    if (model.player.getMark() === "o")
      model.computer.choice.bind(
        model.computer,
        view.boxes[model.getRandomNum(model.gameBoard)],
        false
      )();
  };

  const controlResult = function (str, el, func) {
    view.renderResult(str);
    model.removeClickEvent(el, func);
  };

  return { controlGame, controlResult };
})();

const game = (function () {
  const _SEC = 0.15;

  const _computerMove = function () {
    setTimeout(() => {
      model.computer.choice.bind(
        model.computer,
        view.boxes[model.getRandomNum(model.gameBoard)]
      )();
      if (model.checkWinner(model.computer.getMark(), model.gameBoard))
        return controller.controlResult("lose", view.board, playerMove);

      if (model.checkTurn(model.gameBoard))
        return controller.controlResult("draw", view.board, playerMove);
    }, _SEC * 1000);
  };

  const playerMove = function (e) {
    // BUG receives argument 2 times if we use different name function when we remove/add EventListener(el, pointEvent obj)
    const box = e.target.closest(".box");
    if (!box) return;

    // Player play
    model.player.choice.bind(model.player, box)();
    if (model.checkWinner(model.player.getMark(), model.gameBoard))
      return controller.controlResult("win", view.board, playerMove);

    if (model.checkTurn(model.gameBoard))
      return controller.controlResult("draw", view.board, playerMove);

    _computerMove();
  };

  return { playerMove };
})();

const init = function () {
  // Render mark when click on board
  view.addHandlerPlayerMove(game.playerMove);

  // Select mark & Restart
  view.addHandlerGame(controller.controlGame);

  // Restart only
  view.addHandlerRestart(controller.controlGame);

  // Default Start
  controller.controlGame();
};
init();
