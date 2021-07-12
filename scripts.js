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

const spawnEmptyCells = () => {
  const countNeedFilledCells = 2;
  let countAlreadyFilledCells = 0;
  let offset = {
    x: 0,
    y: 0,
  };

  for (let i = 0; i < countCell; i++) {
    const createCell = document.createElement("div");
    createCell.classList.add("cell");
    createCell.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    if (
      countAlreadyFilledCells < countNeedFilledCells &&
      Math.random() * 2 > 1
    ) {
      createCell.innerText = Math.random() * 2 > 1 ? 4 : 2;
      countAlreadyFilledCells++;
    }
    if (i + 1 === countCell && countAlreadyFilledCells < countNeedFilledCells) {
      createCell.innerText = Math.random() * 2 > 1 ? 4 : 2;
    }
    cells.push({
      node: createCell,
      x: cellPosition.x,
      y: cellPosition.y,
      index: i,
    });
    if (cells.length % 4 !== 0) {
      cellPosition = {
        x: cellPosition.x + 1,
        y: cellPosition.y,
      };
      offset = {
        x: offset.x + paddingCell + cellSize.width,
        y: offset.y,
      };
    } else {
      cellPosition = {
        x: 0,
        y: cellPosition.y + 1,
      };
      offset = {
        x: 0,
        y: offset.y + paddingCell + cellSize.height,
      };
    }

    playingField.appendChild(createCell);
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
  if (moveDirection === "left") {
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
  }
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
