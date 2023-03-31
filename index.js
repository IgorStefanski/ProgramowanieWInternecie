const config = { mode: null, start: null };
const initSlots = [null, null, null, null, null, null, null, null, null];
const state = { start: false, slots: [...initSlots], turn: null, winner: null };
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const buttonModeComputer = document.getElementById("mode_computer");
const buttonModeMulti = document.getElementById("mode_multi");
const buttonStartCircle = document.getElementById("start_circle");
const buttonStartCross = document.getElementById("start_cross");
const buttonStart = document.getElementById("start");
const viewConfig = document.getElementById("view-config");
const viewGame = document.getElementById("view-game");
const buttonReset = document.getElementById("reset");
const buttonEndGame = document.getElementById("endgame");
const slots = document.getElementsByClassName(
  "_page-tictac__slots-slot__value"
);

for (const slot of slots) {
  const i = parseInt(slot.dataset["i"]);
  slot.addEventListener("click", (e) => {
    // console.log(i);
    slotClick(i);
  });
}

buttonModeComputer.addEventListener("click", () => {
  config.mode = "computer";
  renderConfig();
});

buttonModeMulti.addEventListener("click", () => {
  config.mode = "multi";
  renderConfig();
});

buttonStartCircle.addEventListener("click", () => {
  config.start = "circle";
  renderConfig();
});

buttonStartCross.addEventListener("click", () => {
  config.start = "cross";
  renderConfig();
});

buttonStart.addEventListener("click", () => {
  if (!config.mode || !config.start) return;
  startGame();
});

buttonEndGame.addEventListener("click", () => {
  state.start = false;
  renderView();
});

buttonReset.addEventListener("click", () => {
  startGame();
});

renderView();

function renderView() {
  setActive(viewConfig, !state.start);
  setActive(viewGame, state.start);
}

function renderConfig() {
  setActive(buttonModeComputer, config.mode === "computer");
  setActive(buttonModeMulti, config.mode === "multi");
  setActive(buttonStartCross, config.start === "cross");
  setActive(buttonStartCircle, config.start === "circle");
}

function setActive(element, condition) {
  if (condition) {
    element.classList.add("active");
  } else {
    element.classList.remove("active");
  }
}

function startGame() {
  state.start = true;
  state.turn = config.start === "cross" ? "x" : "o";
  state.slots = [...initSlots];
  state.winner = null;
  renderView();
  renderBoard();
}

function checkWinner() {
  const winner = isWinner();
  if (winner === -1) {
    alert("REMIS");
    return true;
  }
  if (winner === null) return;
  state.winner = winner;
  alert(winner);
  return true;
}

function slotClick(i) {
  if (state.winner !== null) return;
  const v = state.slots[i];
  if (v !== null) return;
  state.slots[i] = state.turn;
  renderBoard();
  if (checkWinner()) return;

  state.turn = opositePlayer(state.turn);

  if (config.mode === "computer") {
    computerMove();
  }
}

function computerMove() {
  if (state.slots[4] === null) {
    state.slots[4] = state.turn;
  } else {
    const cw = findWinningCombination(state.turn);
    if (cw !== null) {
      state.slots[cw] = state.turn;
    } else {
      const ow = findWinningCombination(opositePlayer(state.turn));
      if (ow !== null) {
        state.slots[ow] = state.turn;
      } else {
        if (state.slots[0] === null) {
          state.slots[0] = state.turn;
        } else if (state.slots[2] === null) {
          state.slots[2] = state.turn;
        } else if (state.slots[6] === null) {
          state.slots[6] = state.turn;
        } else if (state.slots[8] === null) {
          state.slots[8] = state.turn;
        } else {
          alert("Cos poszlo nie tak, remis");
        }
      }
    }
  }
  renderBoard();
  if (checkWinner()) return;
  state.turn = opositePlayer(state.turn);
}

function findWinningCombination(player) {
  for (const combination of winningCombinations) {
    const v = `${state.slots[combination[0]] ?? ""}${
      state.slots[combination[1]] ?? ""
    }${state.slots[combination[2]] ?? ""}`;
    if (v === `${player}${player}`) {
      if (state.slots[combination[0]] === null) {
        return combination[0];
      }
      if (state.slots[combination[1]] === null) {
        return combination[1];
      }
      if (state.slots[combination[2]] === null) {
        return combination[2];
      }
    }
  }
  return null;
}

function opositePlayer(player) {
  return player === "x" ? "o" : "x";
}

function renderBoard() {
  for (const slot of slots) {
    const i = parseInt(slot.dataset["i"]);
    slot.innerHTML = state.slots[i] ?? "";
  }
}

function isWinner() {
  for (const winningCombination of winningCombinations) {
    const v = `${state.slots[winningCombination[0]] ?? "-"}${
      state.slots[winningCombination[1]] ?? "-"
    }${state.slots[winningCombination[2]] ?? "-"}`;

    if (v === "xxx") return "Wygrał X";
    if (v === "ooo") return "Wygrał O";
  }
  if (!state.slots.includes(null)) {
    return -1;
  }
  return null;
}
