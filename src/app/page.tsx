'use client';

import React, { useState } from 'react';

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  style?: React.CSSProperties;
}

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
}

const Square: React.FC<SquareProps & {style?: React.CSSProperties}> = ({ value, onSquareClick, style }) => {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={style}
    >
      {value}
    </button>
  );
}

const Board: React.FC<BoardProps> = ({ xIsNext, squares, onPlay }) => {
  const handleClick = (i: number) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];
  // let status;
  // if (winner) {
  //   status = "Winner:" + winner;
  // } else {
  //   status = "Next player:" + (xIsNext ? "X" : "O");
  // }

  const status = winner
    ? `Winner: ${winner}`
    : squares.every(square => square !== null)
    ? "It's a draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  const boardSize = 3;
  const rows = Array.from({ length: boardSize }, (_, rowIndex) => (
    <div className='board-row' key={rowIndex}>
      {Array.from({ length: boardSize }, (_, colIndex) => {
        const index = rowIndex * boardSize + colIndex;
        const isWinningSquare = winningLine.includes(index);
        return (
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            style={isWinningSquare ? {backgroundColor: 'red'} : {}}
          />
        );
      })}
    </div>
  ));

  // return (
  //   <>
  //     <div className='status'>{status}</div>
  //     <div className="board-row">
  //       <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
  //       <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
  //       <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
  //     </div>
  //     <div className="board-row">
  //       <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
  //       <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
  //       <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
  //     </div>
  //     <div className="board-row">
  //       <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
  //       <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
  //       <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
  //     </div>
  //   </>
  // );

  return (
    <>
      <div className='status'>{status}</div>
      {rows}
    </>
  )

}

const Game: React.FC = () => {
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [isAscending, setIsAscending] = useState(true);

  const handlePlay = (nextSquares: (string | null)[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const getRowCol = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return `(${row}, ${col})`;
  }

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove);
  }

  const toggleOrder = () => {
    setIsAscending(!isAscending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const lastMoveIndex = move - 1;
      description = `Go to move #${move} (${getRowCol(lastMoveIndex)})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <button onClick={toggleOrder}>
          {isAscending ? 'Sort Descending' : `Sort Ascending`}
        </button>
        <ol>{sortedMoves}</ol>
        {/**現在の着手を表示 */}
        <div>You are at move #{currentMove}</div>
      </div>
    </div>
  )
}

const calculateWinner = (squares: (string | null)[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return {winner: squares[a], line: [a, b, c]};
    }
  }
  return null;
}

export default Game;
