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

const playAnimation = (parent, animation) => {
  parent.classList.add(animation);
  setTimeout(() => {
    parent.classList.remove(animation);
  }, 400);
};

const fillCellData = (element, parent) => {
  element.innerText = Math.random() * 5 < 1 ? 4 : 2;
  countEmptyCells--;
  playAnimation(parent, "cellSecondAnimation");
};

const spawnEmptyCells = () => {
  const countNeedFilledCells = 2;
  let countAlreadyFilledCells = 0;
  let offset = {
    x: 0,
    y: 0,
  };

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
      const randomNum = Math.random() * 2 > 1 ? 4 : 2;
      createCell.innerText = randomNum;
      if (randomNum === 2) {
        secondElement.classList.add("color1");
      } else if (randomNum === 4) {
        secondElement.classList.add("color2");
      }
    }
    cells.push({
      x: cellPosition.x,
      y: cellPosition.y,
      node: createCell,
      index: i,
    });
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
    let randomCell = cells[getRandomNum(countCell)];
    if (countEmptyCells > 0) {
      if (randomCell.node.textContent !== "") {
        return getRandomEmptyСell();
      } else {
        return randomCell;
      }
    }
  };
  const tryFillRandomCell = () => {
    let randomCell = getRandomEmptyСell();
    fillCellData(randomCell.node, randomCell.node.parentNode);
  };
  //indexY columns rows indexX
  console.log("start");
  const calculate = (firstElement, secondElement) => {
    firstElement.textContent = "";
    secondElement.textContent = +secondElement.textContent * 2;
    if (+secondElement.textContent * 2 === 4) {
      secondElement.classList.remove("color1");
      secondElement.classList.add("color2");
    } else if (+secondElement.textContent * 2 === 8) {
      secondElement.classList.remove("color2");
      secondElement.classList.add("color3");
    } else if (+secondElement.textContent * 2 === 16) {
      secondElement.classList.remove("color3");
      secondElement.classList.add("color4");
    } else if (+secondElement.textContent * 2 === 32) {
      secondElement.classList.remove("color4");
      secondElement.classList.add("color5");
    } else if (+secondElement.textContent * 2 === 64) {
      secondElement.classList.remove("color5");
      secondElement.classList.add("color6");
    } else if (+secondElement.textContent * 2 === 128) {
      secondElement.classList.remove("color6");
      secondElement.classList.add("color7");
    }

    playAnimation(secondElement.parentNode, "cellFirstAnimation");
    countEmptyCells++;
  };
  const swap = (firstElement, secondElement) => {
    const numFirstCell = firstElement.textContent;
    const numSecondCell = secondElement.textContent;

    firstElement.textContent = numSecondCell;
    secondElement.textContent = numFirstCell;
    if (+secondElement.textContent === 4) {
      secondElement.classList.remove("color1");
      secondElement.classList.add("color2");
    } else if (+secondElement.textContent === 8) {
      secondElement.classList.remove("color2");
      secondElement.classList.add("color3");
    } else if (+secondElement.textContent === 16) {
      secondElement.classList.remove("color3");
      secondElement.classList.add("color4");
    } else if (+secondElement.textContent === 32) {
      secondElement.classList.remove("color4");
      secondElement.classList.add("color5");
    } else if (+secondElement.textContent === 64) {
      secondElement.classList.remove("color5");
      secondElement.classList.add("color6");
    } else if (+secondElement.textContent === 128) {
      secondElement.classList.remove("color6");
      secondElement.classList.add("color7");
    }
  };

  /*const playingFieldData = playingField.children;
  console.log(playingFieldData);*/
  let indexData = rows;
  const horizontalMove = () => {
    let arr = [...playingField.children];
    if (moveDirection === "left") {
      arr.reverse();
    }
    let spawnEmptyCell = false;

    const move = () => {
      for (let i = arr.length - 1; i >= 0; i--) {
        for (let j = 1; j < columns - (i % 4); j++) {
          if (arr[i + 1] !== undefined) {
            if (
              arr[i].children[0].textContent !== "" &&
              arr[i + 1].children[0].textContent === ""
            ) {
              swap(arr[i].children[0], arr[i + 1].children[0]);
              if (!spawnEmptyCell) {
                spawnEmptyCell = true;
              }
            }
          }
        }
      }
      if (indexData) {
        indexData -= 1;
        console.log("recursion");
        move();
      } else {
        for (let i = arr.length - 1; i >= 0; i--) {
          for (let j = 1; j < columns - (i % 4); j++) {
            if (arr[i + 1] !== undefined) {
              if (
                arr[i].children[0].textContent !== "" &&
                arr[i + 1].children[0].textContent !== "" &&
                arr[i].children[0].textContent ===
                  arr[i + 1].children[0].textContent
              ) {
                calculate(arr[i].children[0], arr[i + 1].children[0]);
                if (!spawnEmptyCell) {
                  spawnEmptyCell = true;
                }
              }
            }
          }
        }
        if (spawnEmptyCell) {
          tryFillRandomCell();
        }
      }
    };
    move();
  };

  const verticalMove = () => {
    let arr = [...playingField.children];
    if (moveDirection === "top") {
      arr.reverse();
    }
    let spawnEmptyCell = false;

    const move = () => {
      for (let i = arr.length - 1; i >= 0; i--) {
        for (let j = 1; j < rows; j++) {
          if (arr[i + 4] !== undefined) {
            if (
              arr[i].children[0].textContent !== "" &&
              arr[i + 4].children[0].textContent === ""
            ) {
              swap(arr[i].children[0], arr[i + 4].children[0]);
              if (!spawnEmptyCell) {
                spawnEmptyCell = true;
              }
            }
          }
        }
      }
      if (indexData) {
        indexData -= 1;
        console.log("recursion");
        move();
      } else {
        for (let i = arr.length - 1; i >= 0; i--) {
          for (let j = 1; j < rows; j++) {
            if (arr[i + 4] !== undefined) {
              if (
                arr[i].children[0].textContent !== "" &&
                arr[i + 4].children[0].textContent !== "" &&
                arr[i].children[0].textContent ===
                  arr[i + 4].children[0].textContent
              ) {
                calculate(arr[i].children[0], arr[i + 4].children[0]);
                if (!spawnEmptyCell) {
                  spawnEmptyCell = true;
                }
              }
            }
          }
        }
        if (spawnEmptyCell) {
          tryFillRandomCell();
        }
      }
    };
    move();
  };
  if (moveDirection === "right") {
    horizontalMove();
  } else if (moveDirection === "left") {
    horizontalMove();
  } else if (moveDirection === "top") {
    verticalMove();
  } else if (moveDirection === "down") {
    verticalMove();
  }

  /*if (countEmptyCells === 0) {
    alert("поражение");
  }*/
  console.log("end");
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
