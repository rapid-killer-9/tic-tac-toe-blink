import { checkWin, isDraw } from './tic-tac-toe-utils';

export interface GameState {
  board: string[][]; // 3x3 grid representing 'X', 'O', or ''
  currentPlayer: 'X' | 'O';
  isGameOver: boolean;
  winner: 'X' | 'O' | 'Draw' | null;
}

// Initialize a new game state
export function createInitialState(): GameState {
  return {
    board: Array(3).fill(null).map(() => Array(3).fill('')),
    currentPlayer: 'X',
    isGameOver: false,
    winner: null,
  };
}

// Function to make a move
export function makeMove(state: GameState, row: number, col: number): GameState {
  if (state.isGameOver || state.board[row][col] !== '') {
    throw new Error("Invalid move");
  }

  // Update the board with the current player's move
  state.board[row][col] = state.currentPlayer;

  // Check if this move leads to a win or a draw
  if (checkWin(state.board, state.currentPlayer)) {
    state.isGameOver = true;
    state.winner = state.currentPlayer;
  } else if (isDraw(state.board)) {
    state.isGameOver = true;
    state.winner = 'Draw';
  } else {
    // Switch player
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
  }

  return { ...state };
}