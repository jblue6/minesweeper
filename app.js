document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let bombAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  function createBoard() {
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      // normal click
      square.addEventListener("click", e => {
        click(square);
      });

      square.oncontextmenu = e => {
        e.preventDefault();
        addFlag(square);
      };
    }

    // check number of bombs in surrounding squares
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains("valid")) {
        // left
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;
        // above right
        if (
          i > width - 1 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        // above
        if (i > width - 1 && squares[i - width].classList.contains("bomb"))
          total++;
        // above left
        if (
          i > width &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        // right
        if (
          i < width * width &&
          !isRightEdge &&
          squares[i + 1].classList.contains("bomb")
        )
          total++;
        // below left
        if (
          i < width * (width - 1) &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;
        // below right
        if (
          i < width * (width - 1) &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        // below
        if (
          i < width * (width - 1) &&
          squares[i + width].classList.contains("bomb")
        )
          total++;
        squares[i].setAttribute("data", total);
      }
    }
  }

  createBoard();

  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        flags++;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
      }
    }
  }

  function click(square) {
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = square.getAttribute("data");
      square.classList.add("checked");
      if (total != 0) {
        square.innerHTML = total;
        return;
      }
      checkSquare(square);
    }
  }

  // check neighbouring squares once a clear square is clicked
  function checkSquare(square) {
    const currentId = parseInt(square.id);
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = currentId - 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // above right
      if (currentId > width - 1 && !isRightEdge) {
        const newId = currentId - width + 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // above
      if (currentId > width) {
        const newId = currentId - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // above left
      if (currentId > width && !isLeftEdge) {
        const newId = currentId - width - 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // right
      if (currentId < width * width && !isRightEdge) {
        const newId = currentId + 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // below left
      if (currentId < width * (width - 1) && !isLeftEdge) {
        const newId = currentId + width - 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // below right
      if (currentId < width * (width - 1) && !isRightEdge) {
        const newId = currentId + width + 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // below
      if (currentId < width * (width - 1)) {
        const newId = currentId + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  function gameOver(square) {
    isGameOver = true;
    console.log("Game Over!");

    squares.forEach(square => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
      }
    });
  }

  function checkForWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("flag")
      )
        matches++;
    }
    if (matches === bombAmount) {
      console.log("you win!");
    }
  }
});
