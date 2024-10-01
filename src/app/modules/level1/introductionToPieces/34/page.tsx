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
          course_title: 'introductionToPieces',
          completed: 56
        };
    
        // Make the POST request to the API
        const response = await axios.post('https://backend-chess-tau.vercel.app/update-course-completion-inschool', requestData);
    
        // Handle the response
        console.log('API Response:', response.data);
        router.push('/modules/level1/introductionToPieces/35'); // Redirect to the M2 page
} catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoadingPage(false); // Reset loading state after the request
    }
  }; const handlePreviousClick = () => {
      setIsLoadingPage(true);
      router.push('/modules/level1/introductionToPieces/33'); // Redirect to the previous page (adjust the path as needed)
    };
  return (
    <div className="lesson-content">
    {isLoadingPage && <Loading />}
    <h3>2.4: Understanding the Bishop</h3>
  
    <div className="video-container">
      <video controls width="100%">
        <source src="/videos/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  
    <section className="bishop-details">
      <p>
        The bishop is a long-range piece that moves diagonally across the board, confined to squares of its color complex, either light or dark. Controlling open diagonals is essential for maintaining the bishop’s activity, as it performs best when unblocked. The bishop pair, with one on each color, offers a significant advantage by covering both light and dark squares, enhancing the player’s control over the board.
      </p>
      <p>
        The squares highlighted on the board indicate where the bishop can move. Again, remember that for any piece to move to a square, it must not be blocked by one of its own pieces.
      </p>
      <p>
        Additionally, if an opponent's piece occupies a square, your piece can move to that square only by capturing the opponent's piece.
      </p>
      <p>
        For example, the Light Squared Bishop cannot move to C6 because it is already occupied by its own pawn. However, the bishop can move to G2, but only after capturing the opponent’s knight.
      </p>
      <p>
        Previously, we looked at an example with the light-squared bishop. Now, let us look at an example with the dark-squared bishop:
      </p>
      <p>
        Similarly, the Dark Squared Bishop cannot move to F6 because it is already occupied by its own pawn. However, the bishop can move to F2, but only after capturing the opponent’s knight.
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
