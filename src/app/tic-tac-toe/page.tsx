"use client";

import React, { useState } from 'react';

const TicTacToeBoard = () => {
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState('');

  const handleCellClick = async (row: number, col: number) => {
    if (board[row][col] === '' && winner === '') {
      const updatedBoard = [...board];
      updatedBoard[row][col] = currentPlayer;
      setBoard(updatedBoard);

      try {
        const response = await fetch('make-move', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ gameId: '123456', row, col, player: currentPlayer })
        });

        const data = await response.json();

        if (response.ok) {
          setBoard(data.gameState.board);
          setCurrentPlayer(data.gameState.currentPlayer);
          checkWinner(data.gameState.board);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error making move:', error);
      }
    }
  };

  const checkWinner = (currentBoard: string[][]) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (currentBoard[i][0] !== '' && currentBoard[i][0] === currentBoard[i][1] && currentBoard[i][1] === currentBoard[i][2]) {
        setWinner(currentBoard[i][0]);
        return;
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (currentBoard[0][i] !== '' && currentBoard[0][i] === currentBoard[1][i] && currentBoard[1][i] === currentBoard[2][i]) {
        setWinner(currentBoard[0][i]);
        return;
      }
    }

    // Check diagonals
    if (
      currentBoard[0][0] !== '' && currentBoard[0][0] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][2]
    ) {
      setWinner(currentBoard[0][0]);
      return;
    }
    if (
      currentBoard[0][2] !== '' && currentBoard[0][2] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][0]
    ) {
      setWinner(currentBoard[0][2]);
      return;
    }

    // Check for a tie
    if (board.every(row => row.every(cell => cell !== ''))) {
      setWinner('Tie');
    }
  };

  return (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((cell, colIndex) => (
            <button
              key={colIndex}
              style={{ width: 50, height: 50 }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </button>
          ))}
        </div>
      ))}
      {winner !== '' && <div>Winner: {winner}</div>}
    </div>
  );
};

export default TicTacToeBoard;