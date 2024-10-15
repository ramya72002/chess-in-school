/* eslint-disable react/no-unescaped-entities */
'use client';
import React from 'react';
import './inprogress.scss';
import withAuth from '../withAuth';


const InProgress: React.FC = () => {
  return (
    <div className="lesson-content">
      <h1>Basics Of Chess</h1>
      
      </header>

      <section className="chessboard-info">
        {/* Video Section */}
        <div className="video-container">
          <video controls width="100%">
            <source src="/videos/video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <h2>The Chessboard</h2>
        <p>
          The chessboard is the foundational element of the game, consisting of 64 squares arranged in an 8 rows x 8 columns grid. These squares alternate between 32 light and 32 dark squares. Understanding the layout and naming conventions of the chessboard is crucial for any chess player.
        </p>
        <p>
          Setting up the chessboard correctly is an important step before starting a game. Ensure that the bottom-right square is a light square. This ensures that the board is oriented correctly.
        </p>
        <p>
          To understand the naming of squares on a chessboard, think of the files (vertical columns) as first names and the ranks (horizontal rows) as last names. The files are labeled from A to H, starting from the leftmost column (A) to the rightmost column (H). The ranks are numbered from 1 to 8, starting from the bottom row (1) to the top row (8). Each square is uniquely identified by combining the file letter and the rank number, similar to combining a first name and a last name to identify a person. For example, the square at the intersection of the D file (fourth column) and the 4th rank (fourth row) is called D4. Similarly, the square at the intersection of the B file (second column) and the 6th rank (sixth row) is called B6. This system helps players communicate their moves and positions accurately, ensuring clarity and precision in the game.
        </p>
        
        <h2>Introduction to Chess Pieces</h2>
        <p>Let's introduce you to the chess pieces! - Before we start, I would like to talk about the major pieces and the minor pieces.</p>
        
        <p>
          In chess, pieces are categorized into minor and major types, each with distinct roles and values. Minor pieces, consisting of knights and bishops, are valued at 3 points each. Knights navigate with an L-shaped move, while bishops control long diagonals. Major pieces include rooks, queens, and the king. Rooks are worth 5 points and excel on open files and ranks, queens, valued at 9 points, combine the power of both rooks and bishops, and the king, while not assigned a point value, is crucial as the game's objective is to protect it.
        </p>
        
        <div className="pieces-info">
          <div className="piece king">
            <h3>King</h3>
            <p>The king is undoubtedly the most crucial piece in chess; losing it means losing the game. It moves only one square in any direction. Protecting your king through castling and attacking your opponent's king are essential strategies. In the endgame, the king's role becomes even more pivotal.</p>
          </div>
          <div className="piece queen">
            <h3>Queen</h3>
            <p>The queen is the most powerful piece on the board, valued at 9 points. It moves any number of squares in any direction—vertically, horizontally, or diagonally—combining the strengths of both the rook and bishop.</p>
          </div>
          <div className="piece rook">
            <h3>Rook</h3>
            <p>The rook moves straightforwardly—up, down, left, and right—covering any number of squares along those lines. Valued at 5 points, it plays a key role in castling and becomes especially powerful in the endgame.</p>
          </div>
          <div className="piece bishop">
            <h3>Bishop</h3>
            <p>The bishop is often called the "king of diagonals" due to its ability to move any number of squares diagonally. Valued at 3 points, it operates exclusively on squares of its starting color.</p>
          </div>
          <div className="piece knight">
            <h3>Knight</h3>
            <p>The knight, worth 3 points, moves in an L-shape: two squares in one direction and then one square perpendicular. This unique movement allows the knight to "jump" over other pieces.</p>
          </div>
          <div className="piece pawn">
            <h3>Pawn</h3>
            <p>The pawn is the simplest piece, valued at 1 point. It moves forward one square at a time but captures diagonally. On its first move, a pawn can advance two squares. Pawns also have special moves: en passant and promotion.</p>
          </div>
        </div>

        <h2>Setting Up the Chessboard</h2>
        <p>Arranging the chess pieces at the start of a game follows a specific setup, ensuring that both players have identical formations. The board is positioned so that each player has a white (or light) square on their right-hand side. The back row for each player, starting from left to right, is arranged as follows: rook, knight, bishop, queen, king, bishop, knight, rook. The pawns fill the entire row in front of these pieces.</p>
        
        <h2>Game Mechanics</h2>
        <p>
          <strong>Check:</strong> A check occurs when your king is attacked by an opponent's piece. To respond to a check, you have three options: move the king to a safe square, block the attack with another piece, or capture the attacking piece. Protecting your king to avoid checks is vital throughout the game. When you put your opponent's king in check, it's customary to declare it by saying "Check!"
        </p>
        <p>
          <strong>Capture:</strong> Capturing is a fundamental action where one piece removes an opponent's piece from the board by moving to its square. Most pieces capture by moving to the square occupied by the enemy piece along their normal movement paths.
        </p>
        <p>
          <strong>Castling:</strong> Castling is a unique move involving the king and a rook. To castle, several conditions must be met: neither the king nor the rook involved can have moved previously; the squares between the king and the rook must be unoccupied; the king cannot be in check, nor can it move through or end up on a square that is under attack.
        </p>
      </section> 

      {/* New Sections */}
      <section className="additional-sections">
        <h2>Downloads</h2>
        <ul>
          <li><a href="/downloads/chess-rules.pdf" download>Download Chess Rules PDF</a></li>
          <li><a href="/downloads/chessboard-diagram.png" download>Download Chessboard Diagram</a></li>
        </ul>

        <h2>Practice Links</h2>
        <ul>
          <li><a href="https://www.chess.com/" target="_blank" rel="noopener noreferrer">Play Chess on Chess.com</a></li>
          <li><a href="https://www.chessbase.com/" target="_blank" rel="noopener noreferrer">ChessBase Online Practice</a></li>
        </ul>

        <h2>Reference Links</h2>
        <ul>
          <li><a href="https://www.fide.com/" target="_blank" rel="noopener noreferrer">FIDE - International Chess Federation</a></li>
          <li><a href="https://en.wikipedia.org/wiki/Chess" target="_blank" rel="noopener noreferrer">Wikipedia - Chess</a></li>
        </ul>
      </section>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button className="prev-button">Previous</button>
        <button className="next-button">Next</button>
      </div>
    </div>
  );
};

export default withAuth(InProgress);
