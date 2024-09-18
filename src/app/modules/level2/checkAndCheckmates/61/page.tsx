/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '../../chessOpening/1.scss';
import { UserDetails } from '../../../types/types';
import withAuth from '@/app/withAuth';

interface Puzzle {
  level:string;
  category: string;
  title: string;
  dateAndtime: string;
  total_puz_count: number;
  statusFlag?: string;
  scoreSum?: number; // Optional property, can be number or undefined
}
const M1: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [puzzlesWithStatus, setPuzzlesWithStatus] = useState<Puzzle[]>([]);
  
  const puzzles = [
    { title: "Forks and Double Attacks - Part 3", level: "Knight", category: "Middlegame", dateAndtime: "2024-08-21T13:54", total_puz_count: 9, statusFlag: "Not Started" },
    { title: "hih", level: "Pawn", category: "Endgame", dateAndtime: "2024-09-19T12:42", total_puz_count: 1, statusFlag: "Not Started" }
  ];

  
  const handleButtonClick = async (
    level:string,
    title: string,
    category: string,
    date_time: string,
    puzzle_no: number,
    score: string,
    index: number
  ) => {
    setLoading((prevLoading) => ({ ...prevLoading, [index]: true }));
    const userDetailsString = localStorage.getItem('userDetails');
    const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
    const email = storedUserDetails?.email;

    if (email) {
      try {
        const createArenaApiUrl = 'https://backend-chess-tau.vercel.app/create_Arena_user_inschool';
        const imagesApiUrl = `https://backend-chess-tau.vercel.app/images/title?level=${encodeURIComponent(level)}&category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}`;

        const createArenaResponse = await axios.post(createArenaApiUrl, { email, category, title, puzzle_no });

        if (createArenaResponse.data.success) {
          const imagesResponse = await axios.get(imagesApiUrl);
          router.push(`/arena/startArena?title=${encodeURIComponent(title)}&level=${encodeURIComponent(level)}&category=${encodeURIComponent(category)}&date_time=${encodeURIComponent(date_time)}&score=${encodeURIComponent(score)}`);
        } else {
          setError('Failed to create or update PuzzleArena. Please try again later.');
        }
      } catch (error) {
        console.error('Error during API calls:', error);
        setError('An error occurred while processing your request. Please try again later.');
      } finally {
        setLoading((prevLoading) => ({ ...prevLoading, [index]: false }));
      }
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (typeof window !== 'undefined') {
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
  
        if (storedUserDetails) {
          setUserDetails(storedUserDetails);
  
          const updatedPuzzlesSet = new Set<string>();
  
          for (const item of puzzles) {
            try {
              const arenaUserResponse = await axios.get('https://backend-chess-tau.vercel.app/get_Arena_user_inschool', {
                params: {
                  email: storedUserDetails.email,
                  category: item.category,
                  title: item.title,
                  date_time: item.dateAndtime,
                  file_ids: {},
                },
              });
  
              if (!arenaUserResponse.data.success) {
                // API returned success as false, handle it here
                const updatedPuzzle: Puzzle = {
                  ...item,
                  statusFlag: 'Not started', // Example status for failed API
                  scoreSum: 0, // Default to 0 if fetching fails
                };
                updatedPuzzlesSet.add(JSON.stringify(updatedPuzzle));
              } else {
                // API returned success as true
                const puzzleArena = arenaUserResponse.data.puzzleArena;
                const scoreSum = Object.values(puzzleArena).reduce((sum, arenaPuzzle: any) => {
                  const score = typeof arenaPuzzle.score === 'number' ? arenaPuzzle.score : 0;
                  return sum + score;
                }, 0);
  
                let statusFlag = 'Not Started';
                if (Object.values(puzzleArena).every((arenaPuzzle: any) => arenaPuzzle.option_guessed !== null)) {
                  statusFlag = 'Completed';
                } else if (Object.values(puzzleArena).some((arenaPuzzle: any) => arenaPuzzle.option_guessed !== null && arenaPuzzle.started)) {
                  statusFlag = 'In Progress';
                } else if (Object.values(puzzleArena).some((arenaPuzzle: any) => arenaPuzzle.option_guessed !== null)) {
                  statusFlag = 'Started';
                }
  
                const updatedPuzzle: Puzzle = {
                  ...item,
                  statusFlag,
                  scoreSum: scoreSum as number,
                };
  
                updatedPuzzlesSet.add(JSON.stringify(updatedPuzzle));
              }
            } catch (error) {
              console.error(`Error fetching data for puzzle ${item.title}:`, error);
              const updatedPuzzle: Puzzle = {
                ...item,
                statusFlag: 'Error Fetching Data', // Example status for error
                scoreSum: 0,
              };
              updatedPuzzlesSet.add(JSON.stringify(updatedPuzzle));
            }
          }
  
          setPuzzlesWithStatus(Array.from(updatedPuzzlesSet).map((item: string) => JSON.parse(item) as Puzzle));
        }
      }
    };
  
    fetchUserDetails();
  }, []);
  
    const handleNextClick = async () => {
      const storedEmail = localStorage.getItem('email');
      try {
        // Sample data to send in the POST request
        const requestData = {
          email: storedEmail,
          course_title: 'checkAndCheckmates',
          completed: 50
        };
    
        // Make the POST request to the API
        const response = await axios.post('https://backend-chess-tau.vercel.app/update-course-completion-inschool', requestData);
    
        // Handle the response
        console.log('API Response:', response.data);
        router.push('/modules/level2/checkAndCheckmates/62'); // Redirect to the M2 page
      } catch (error) {
        console.error('API Error:', error);
      }
    }; const handlePreviousClick = () => {
      router.push('/modules/level2/chessOpening/11'); // Redirect to the previous page (adjust the path as needed)
    };
  return (
    <div className="lesson-content">
      <h3>6.1 Introduction</h3>
      
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
      <div className="theme-practice">
      
      <h1>Theme Practice</h1>
      {puzzlesWithStatus.map((puzzle, index) => (
        <div key={index} className="practice-item">
          <p>{puzzle.category}: {puzzle.title}</p>
          <p>Date&Time:{puzzle.dateAndtime} </p>
          <p>{puzzle?.statusFlag}</p>

          <p>Total Score: {puzzle.scoreSum}/{puzzle.total_puz_count} </p>
          <p className='loading-page'>
            <button onClick={() =>
                          handleButtonClick(
                            puzzle.level,                            
                            puzzle.title,
                            puzzle.category,
                            puzzle.dateAndtime,
                            puzzle.total_puz_count,
                            `${0}/${puzzle.total_puz_count}`,
                            index
                          )
                          } className='start-button'>
              View
            </button>
          </p>
        </div>
      ))}
    </div>

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
      <section className="navigation-buttons">
        <button onClick={handlePreviousClick} className="previous-button">Previous Page</button>
        <button onClick={handleNextClick} className="next-button">Next</button>
      </section>
    </div>
  );
};

export default withAuth(M1);
