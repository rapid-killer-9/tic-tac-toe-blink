import { NextResponse } from 'next/server';
import { jsonResponse } from 'src/common/helper/responseMaker';
import { StatusCodes } from 'http-status-codes';
import { makeMove, createInitialState } from 'src/common/game/gameState'; 

// Simulated in-memory store for game state (like localStorage)
let gameStore: Map<string, any> = new Map();

export const POST = async (req: Request) => {
  try {
    const { gameId, row, col, player } = await req.json();
    
    // Retrieve the current game state from the "localStorage" (in-memory store)
    let gameState = gameStore.get(gameId);

    if (!gameState) {
      // If no game state exists for this gameId, initialize a new one
      gameState = createInitialState();
      gameStore.set(gameId, gameState);
    }

    // Make the move and update the game state
    gameState = makeMove(gameState, row, col);

    // Save the updated game state back to the in-memory store
    gameStore.set(gameId, gameState);

    return jsonResponse({ status: 'Move successful', gameState }, StatusCodes.OK);
  } catch (err) {
    console.error(err);
    return jsonResponse({ message: err.message }, StatusCodes.BAD_REQUEST);
  }
};