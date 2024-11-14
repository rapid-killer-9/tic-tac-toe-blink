// Check for a win condition
export function checkWin(board: string[][], player: 'X' | 'O'): boolean {
  // Check rows, columns, and diagonals
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === player)) return true; // Row check
    if (board.map(row => row[i]).every(cell => cell === player)) return true; // Column check
  }
  // Diagonal checks
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;

  return false;
}

// Check for a draw
export function isDraw(board: string[][]): boolean {
  return board.every(row => row.every(cell => cell !== ''));
}