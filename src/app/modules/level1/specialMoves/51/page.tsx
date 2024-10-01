/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '../../introduction/1.scss';
import { UserDetails } from '../../../../types/types';
import withAuth from '@/app/withAuth';
import Loading from '@/app/Loading';

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
  const [isLoadingPage, setIsLoadingPage] = useState(false); // Add a state to manage page loading

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
    setIsLoadingPage(true); // Set loading state before making the request
    const storedEmail = localStorage.getItem('email');
    try {
      // Sample data to send in the POST request
      const requestData = {
        email: storedEmail,
          course_title: 'specialMoves',
          completed: 35
        };
    
        // Make the POST request to the API
        const response = await axios.post('https://backend-chess-tau.vercel.app/update-course-completion-inschool', requestData);
    
        // Handle the response
        console.log('API Response:', response.data);
        router.push('/modules/level1/specialMoves/52'); // Redirect to the M2 page
} catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoadingPage(false); // Reset loading state after the request
    }
  };
    const handlePreviousClick = () => {
      setIsLoadingPage(true);
      router.push('/modules/level1/ArrangnmentOfPieces/42'); // Redirect to the previous page (adjust the path as needed)
    };
  return (
    <div className="lesson-content">
  {isLoadingPage && <Loading />}
  <h3>4.1 Castling</h3>

  <section className="special-moves">
   

    <div className="video-container">
          <video controls width="100%">
            <source src="/videos/video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div><br />
    <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
      Castling is a unique move in chess involving the king and a rook, primarily for defensive purposes. To castle, several conditions must be met: neither the king nor the rook can have moved previously, the squares between them must be unoccupied, and the king must not be in check, nor can it move through or land on a square under attack. During castling, the king moves two squares towards the rook, and the rook moves to the square immediately next to the king. This maneuver can be performed on either side of the board. Kingside castling involves the king moving towards the h-file rook, while queenside castling involves the king moving towards the a-file rook.
    </p><br />
    
    <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>The three rules of castling in chess are as follows:</p>
    <ol style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
      <li>The King and Rook involved in the castling move must not have moved previously.</li>
      <li>There must be no pieces between the Rook and King on the castling side.</li>
      <li>Neither the King nor any squares on the castling side can be under check during the castling move.</li>
    </ol><br />
    
    <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
      Kingside castling, also known as short castling, is a strategic chess move where the king moves two squares toward the rook on its starting side, and the rook then moves to the square right next to the king. This maneuver is primarily used to increase the king's safety by positioning it behind a protective wall of pawns and connecting the rooks, which enhances their ability to work together. For kingside castling to be legal, several conditions must be met: neither the king nor the rook involved in the castling move can have moved earlier in the game, there must be no pieces between the king and the rook, and the king cannot be in check or move through or land on a square that is under attack. Kingside castling is typically faster than queenside castling because it involves fewer squares, allowing the king to reach safety quickly and enabling the rook to take an active role in the game.
    </p><br />
    
    <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
      Queenside castling, also known as long castling, is a strategic chess move where the king moves two squares toward the rook on the queen's side of the board, and the rook then moves to the square right next to the king. This move aims to enhance the king's safety while also bringing the rook into a more active and central position on the board. For queenside castling to be legal, several conditions must be met: the king and the rook involved in the castling must not have moved earlier in the game, there must be no pieces between the king and the rook, and the king cannot be in check, nor can it pass through or land on a square that is under attack.
    </p><br />
    
    <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
      Compared to kingside castling, queenside castling often takes more time to set up because it involves more squares and usually requires more preparation, such as moving the queen and another piece out of the way. However, it can be a powerful move, as it often places the king in a more central position while allowing the rook to immediately control an important central file.
    </p>
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
