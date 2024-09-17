"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import './Puzzles.scss';
import withAuth from '../withAuth';

const Puzzles = () => {
  const router = useRouter();

  const handleLevelClick = (level: number) => {
    router.push('/ChessPuzzle');
  };

  return (
    <div className="chess-puzzles">
      <h1 className="main-title">Puzzles</h1>
      <div className="puzzle-container">
        <h2 className="puzzle-title">Level 1 Puzzles</h2>
        <div className="puzzle-instructions">
          Click to start solving Level 1 puzzles.
        </div>
        <button className="puzzle-option" onClick={() => handleLevelClick(1)}>
          Go to Level 1
        </button>
      </div>
      <div className="puzzle-container">
        <h2 className="puzzle-title">Level 2 Puzzles</h2>
        <div className="puzzle-instructions">
          Click to start solving Level 2 puzzles.
        </div>
        <button className="puzzle-option" onClick={() => handleLevelClick(2)}>
          Go to Level 2
        </button>
      </div>
      {/* Add more levels as needed */}
    </div>
  );
};

export default withAuth(Puzzles);
