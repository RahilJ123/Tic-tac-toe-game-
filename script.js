const board = document.getElementById('board');
  const message = document.getElementById('message');
  const resetBtn = document.getElementById('reset-btn');
  const playerXScore = document.getElementById('playerX-score');
  const playerOScore = document.getElementById('playerO-score');
  const onePlayerBtn = document.getElementById('one-player-btn');
  const twoPlayersBtn = document.getElementById('two-players-btn');
  const playerOptions = document.getElementById('player-options');

  let playerX = 'Player X';
  let playerO = 'Player O';

  let currentPlayer = 'X';
  let gameBoard = ['', '', '', '', '', '', '', '', ''];
  let gameActive = false;
  let playerXWins = 0;
  let playerOWins = 0;
  let onePlayerMode = false;

  function checkWinner() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
        highlightWinningCells(combination);
        return gameBoard[a];
      }
    }

    return null;
  }

  function highlightWinningCells(combination) {
    combination.forEach(index => {
      document.getElementById(`cell${index}`).classList.add('winning-cell');
    });
  }

  function isBoardFull() {
    return !gameBoard.includes('');
  }

  function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== '') {
      return;
    }

    gameBoard[index] = currentPlayer;
    renderBoard();

    const winner = checkWinner();
    if (winner) {
      updateScore(winner);
    } else if (isBoardFull()) {
      endGame('It\'s a tie!');
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      message.textContent = `Current Player: ${currentPlayer}`;
      if (onePlayerMode && currentPlayer === 'O') {
        setTimeout(botMove, 500);
      }
    }
  }

  function updateScore(winner) {
    if (winner === 'X') {
      playerXWins++;
      playerXScore.textContent = playerXWins;
      endGame(`${playerX} wins!`);
    } else {
      playerOWins++;
      playerOScore.textContent = playerOWins;
      endGame(`${playerO} wins!`);
    }
  }

  function endGame(msg) {
    message.textContent = msg;
    gameActive = false;
    resetBtn.style.display = 'block';
  }

  function restartGame() {
    resetGame();
    startGame(onePlayerMode);
  }

  function renderCell(value, index) {
    const cell = document.createElement('div');
    cell.id = `cell${index}`;
    cell.className = 'cell';
    cell.textContent = value;
    cell.addEventListener('click', () => handleCellClick(index));
    board.appendChild(cell);
  }

  function renderBoard() {
    board.innerHTML = '';
    gameBoard.forEach(renderCell);
  }

  function startGame(isOnePlayerMode) {
    onePlayerMode = isOnePlayerMode;
    playerOptions.style.display = 'none';
    gameActive = true;
    currentPlayer = 'X';
    message.textContent = `Current Player: ${currentPlayer}`;
    renderBoard();
    if (onePlayerMode && currentPlayer === 'O') {
      setTimeout(botMove, 500);
    }
  }

  function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    resetBtn.style.display = 'none';
    message.textContent = `Current Player: ${currentPlayer}`;
    renderBoard();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
  });

  function botMove() {
    if (!gameActive) return;

    let emptyCells = gameBoard.reduce((acc, cell, index) => {
      if (cell === '') acc.push(index);
      return acc;
    }, []);

    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    handleCellClick(emptyCells[randomIndex]);
  }