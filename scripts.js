const startBtn = document.getElementById("play");
const playIcon = document.getElementById("playIcon");
const playingField = document.getElementById("playingField");

const score = document.getElementById("score");
const recordScore = document.getElementById("recordScore");

const playingFieldSize = {
  width: 450,
  height: 450,
};
const cellSize = {
  width: 97.5,
  height: 97.5,
};
const paddingCell = 12;
const cellForField = {
  width: playingFieldSize.width / cellSize.width,
  height: playingFieldSize.height / cellSize.height,
};
const countCell = 16;
const rows = 4;
const columns = 4;

let scoreData = -1;
let cells = [];
let countEmptyCells = 16;
let cellPosition = { x: 0, y: 0 };

let moveDirection = "left";
let isGamePlayed = false;
let mainAnimationFrame = null;

let mobile = false;
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  mobile = true;
}

const removeAllNodes = () => {
  while (playingField.firstChild) {
    playingField.firstChild.remove();
  }
};

const setScore = () => {
  scoreData++;
  score.textContent = scoreData;
};

const getRecordScore = () => {
  if (localStorage.getItem("recordScore")) {
    recordScore.textContent = localStorage.getItem("recordScore");
  }
};

const playAnimation = (parent) => {
  parent.classList.add("cellAnimation");
  setTimeout(() => {
    parent.classList.remove("cellAnimation");
  }, 400);
};

const fillCellData = (element, parent) => {
  element.innerText = Math.random() * 5 < 1 ? 4 : 2;
  countEmptyCells--;
  playAnimation(parent);
};

const spawnEmptyCells = () => {
  const countNeedFilledCells = 2;
  let countAlreadyFilledCells = 0;
  let offset = {
    x: 0,
    y: 0,
  };

  // создаю многомерные массив
  for (let i = 0; i < rows; i++) {
    cells.push([]);
  }

  let yCellPosition = 0;

  for (let i = 0; i < countCell; i++) {
    const wrapCell = document.createElement("div");
    const createCell = document.createElement("div");
    createCell.classList.add("cell");
    createCell.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    if (
      countAlreadyFilledCells < countNeedFilledCells &&
      Math.random() * 2 > 1
    ) {
      fillCellData(createCell, wrapCell);
      countAlreadyFilledCells++;
    }
    if (i + 1 === countCell && countAlreadyFilledCells < countNeedFilledCells) {
      createCell.innerText = Math.random() * 2 > 1 ? 4 : 2;
    }
    cells[yCellPosition].push({
      x: cellPosition.x,
      y: cellPosition.y,
      node: createCell,
      index: i,
    });
    console.log(yCellPosition);
    if ((i + 1) % 4 !== 0) {
      cellPosition = {
        x: cellPosition.x + 1,
        y: cellPosition.y,
      };
      offset = {
        x: offset.x + paddingCell + cellSize.width,
        y: offset.y,
      };
    } else {
      yCellPosition += 1;
      cellPosition = {
        x: 0,
        y: cellPosition.y + 1,
      };
      offset = {
        x: 0,
        y: offset.y + paddingCell + cellSize.height,
      };
    }
    playingField.appendChild(wrapCell);
    wrapCell.appendChild(createCell);
  }
};

const gameOver = () => {
  alert(`Поражение, счет: ${scoreData}`);
  if (scoreData > localStorage.getItem("recordScore")) {
    localStorage.setItem("recordScore", scoreData);
    getRecordScore();
  }
  removeAllNodes();

  playIcon.src = "icons/play.svg";
};

const checkFieldBorder = () => {};

const checkCollisionCells = () => {
  /*
  moveDirection = "left";
  moveDirection = "right";
  moveDirection = "top";
  moveDirection = "down";
  */
  /*const tryMove = () => {
    for (let indexY = 0; indexY < columns; indexY++) {
      let firstNode;
      for (let indexX = 0; indexX < rows; indexX++) {
        let repeatIndex = indexX;
        const move = () => {
          firstNode = cells.filter(
            (item) => item.y === indexY && item.x === repeatIndex
          );
          if (firstNode.length > 0 && firstNode[0].node.innerText !== "") {
            let secondNode;
            for (let remainingX = repeatIndex; remainingX >= 0; remainingX--) {
              secondNode = cells.filter(
                (item) => item.y === indexY && item.x === remainingX
              );
              if (
                secondNode.length > 0 &&
                secondNode[0].node.innerText === "" &&
                secondNode[0].x < firstNode[0].x
              ) {
                const dataFirstNode = firstNode[0].node.innerText;
                const dataSecondNode = secondNode[0].node.innerText;
                firstNode[0].node.innerText = dataSecondNode;
                secondNode[0].node.innerText = dataFirstNode;
                repeatIndex--;
                console.log(repeatIndex);
                move();
              }
            }
          }
        };
        move();
      }
    }
  };*/
  const getRandomNum = (data) => {
    const num = Math.round(Math.random() * (data - 1));
    console.log(num);
    return num;
  };
  const getRandomEmptyСell = () => {
    let randomCell = cells[getRandomNum(rows)][getRandomNum(columns)];
    if (countEmptyCells > 0) {
      if (randomCell.node.textContent !== "") {
        return getRandomEmptyСell();
      } else {
        return randomCell;
      }
    }
  };
  const tryFillRandomCell = () => {
    if (countEmptyCells > 0) {
      let randomCell = getRandomEmptyСell();
      fillCellData(randomCell.node, randomCell.node.parentNode);
    } else {
      alert("поражение");
    }
  };
  //indexY columns rows indexX
  console.log("start");
  const calculate = (firstYIndex, secondYIndex, firstXIndex, secondXIndex) => {
    cells[firstYIndex][firstXIndex].node.textContent = "";
    cells[secondYIndex][secondXIndex].node.textContent =
      +cells[secondYIndex][secondXIndex].node.textContent * 2;

    playAnimation(cells[secondYIndex][secondXIndex].node.parentNode);
    countEmptyCells++;
  };
  const swap = (firstYIndex, secondYIndex, firstXIndex, secondXIndex) => {
    const numFirstCell = cells[firstYIndex][firstXIndex].node.textContent;
    const numSecondCell = cells[secondYIndex][secondXIndex].node.textContent;

    cells[firstYIndex][firstXIndex].node.textContent = numSecondCell;
    cells[secondYIndex][secondXIndex].node.textContent = numFirstCell;
  };
  if (moveDirection === "left") {
    for (let iY = 0; iY < rows; iY++) {
      for (let iX = 0; iX < rows; iX++) {
        if (iX > 0 && cells[iY][iX].node.textContent !== "") {
          if (cells[iY][iX - 1].node.textContent !== "") {
            if (
              cells[iY][iX].node.textContent ===
              cells[iY][iX - 1].node.textContent
            ) {
              calculate(iY, iY, iX, iX - 1);
            }
          } else {
            swap(iY, iY, iX, iX - 1);
          }
        }
      }
    }
  } else if (moveDirection === "right") {
    for (let iY = 0; iY < rows; iY++) {
      for (let iX = rows; iX >= 0; iX--) {
        if (iX < rows - 1 && cells[iY][iX].node.textContent !== "") {
          if (cells[iY][iX + 1].node.textContent !== "") {
            if (
              cells[iY][iX].node.textContent ===
              cells[iY][iX + 1].node.textContent
            ) {
              calculate(iY, iY, iX, iX + 1);
            }
          } else {
            swap(iY, iY, iX, iX + 1);
          }
        }
      }
    }
  } else if (moveDirection === "top") {
    for (let iX = 0; iX < rows; iX++) {
      for (let iY = 0; iY < rows; iY++) {
        if (iY > 0 && cells[iY][iX].node.textContent !== "") {
          if (cells[iY - 1][iX].node.textContent !== "") {
            if (
              cells[iY][iX].node.textContent ===
              cells[iY - 1][iX].node.textContent
            ) {
              calculate(iY, iY - 1, iX, iX);
            }
          } else {
            swap(iY, iY - 1, iX, iX);
          }
        }
      }
    }
  } else if (moveDirection === "down") {
    for (let iX = 0; iX < rows; iX++) {
      for (let iY = rows; iY >= 0; iY--) {
        if (iY < rows - 1 > 0 && cells[iY][iX].node.textContent !== "") {
          if (cells[iY + 1][iX].node.textContent !== "") {
            if (
              cells[iY][iX].node.textContent ===
              cells[iY + 1][iX].node.textContent
            ) {
              calculate(iY, iY + 1, iX, iX);
            }
          } else {
            swap(iY, iY + 1, iX, iX);
          }
        }
      }
    }
  }

  /*if (moveDirection === "left") {
        } else if (moveDirection === "right") {
        } else if (moveDirection === "top") {
        } else if (moveDirection === "down") {
        }*/
  console.log("end");
  tryFillRandomCell();
};

const moveCells = () => {
  checkCollisionCells();
  cells.unshift(cells.pop());
  checkFieldBorder();
};

const controlCells = (event) => {
  if (
    (event.key.toLowerCase() === "a" ||
      event.key.toLowerCase() === "ф" ||
      event.key == "ArrowLeft") &&
    moveDirection !== "left"
  ) {
    moveDirection = "left";
  } else if (
    (event.key.toLowerCase() === "d" ||
      event.key.toLowerCase() === "в" ||
      event.key == "ArrowRight") &&
    moveDirection !== "right"
  ) {
    moveDirection = "right";
  } else if (
    (event.key.toLowerCase() === "w" ||
      event.key.toLowerCase() === "ц" ||
      event.key == "ArrowUp") &&
    moveDirection !== "top"
  ) {
    moveDirection = "top";
  } else if (
    (event.key.toLowerCase() === "s" ||
      event.key.toLowerCase() === "ы" ||
      event.key == "ArrowDown") &&
    moveDirection !== "down"
  ) {
    moveDirection = "down";
  }
  moveCells();
};

const gameStart = () => {
  if (isGamePlayed) {
    playIcon.src = "icons/play.svg";
    alert("pause");
    isGamePlayed = false;
  } else {
    playIcon.src = "icons/pause.svg";
    document.addEventListener("keydown", controlCells);
    isGamePlayed = true;
    spawnEmptyCells();
  }
};

startBtn.addEventListener("click", gameStart);
playingField.addEventListener("click", gameStart);
getRecordScore();
