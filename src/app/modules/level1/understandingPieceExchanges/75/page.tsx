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
     
        
        //add 3.1
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
  
        if (storedUserDetails && storedUserDetails.email) {
          const response = await axios.post('https://backend-chess-tau.vercel.app/update_registered_courses_inschool', {
            email: storedUserDetails.email,
            course_title: "understandingPieceExchanges",
            status: 'Completed',
          });
  
          // Call API to update status to "In Progress"
          const response1 = await axios.post('https://backend-chess-tau.vercel.app/update_registered_courses_inschool', {
            email: storedUserDetails.email,
            course_title: "stagesOfTheGame",
            status: 'In Progress',
          });
  
          if (response1.data.success) {
            router.push('/modules/level1/stagesOfTheGame/81'); // Redirect to the M2 page  
            
             
          } else {
            console.error('Failed to update course status:', response.data.message);
          }
        }
      } catch (error) {
        console.error('Error updating course status:', error);
      }
    };
    const handlePreviousClick = () => {
      setIsLoadingPage(true);
      router.push('/modules/level1/understandingPieceExchanges/74'); // Redirect to the previous page (adjust the path as needed)
    };
       
  return (
    <div className="lesson-content">
    {isLoadingPage && <Loading />}
    <h3>6.5 Material Down</h3>
    <div className="video-container">
          <video controls width="100%">
            <source src="/videos/video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div><br />
    <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
        In chess, being "material down" refers to having fewer or less valuable pieces or pawns than your opponent, resulting in a numerical or positional disadvantage. This can happen in a couple of ways. First, you might lose a piece like a knight, bishop, or even a queen without gaining a piece of equal or greater value in return. Additionally, players sometimes sacrifice material intentionally to gain positional advantages or launch an attack, but if the compensation is not sufficient, this can leave them material down.
    </p><br />

    <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
        Being material down presents significant challenges, especially in defense. With fewer pieces, it becomes harder to defend your position, protect your king, and maintain control over key squares on the board.
    </p><br />

    <h5 style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>Disadvantages of Being Material Down</h5>
    <ul style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
        <li><strong>Limited Offensive Potential:</strong> When you're material down, you have fewer resources for launching effective attacks. This limitation can make it hard to create winning chances and apply pressure on your opponent.</li>
        <li><strong>Endgame Difficulties:</strong> In the endgame, being down in material is particularly problematic. Your opponent's extra pieces or pawns can be used to create decisive threats, such as promoting a pawn, which can be challenging to counter.</li>
    </ul>

    <h5 style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>Strategies to Compensate for Material Loss</h5>
    <ul style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
        <li><strong>Creating Counterplay:</strong> To offset a material disadvantage, focus on creating active threats and targeting weak points in your opponent’s position. Launching a counterattack can sometimes turn the game in your favor.</li>
        <li><strong>Positional Play:</strong> Strong piece placement, control of key squares, and a solid pawn structure can sometimes compensate for being material down. This approach makes it harder for your opponent to fully capitalize on their material advantage.</li>
        <li><strong>Avoiding Further Trades:</strong> When material down, it is crucial to avoid unnecessary exchanges of pieces. Such trades can simplify the position and highlight your material deficit, making it even more challenging to recover.</li>
    </ul><br />

    <h5 style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>When to Consider Sacrificing More Material</h5>
    <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'black', fontSize: '16px' }}>
        <strong>Dynamic Compensation:</strong> In certain situations, sacrificing additional material can lead to significant positional advantages, create an unstoppable attack, or force a draw. This dynamic compensation can sometimes turn the tables on your opponent, shifting the balance of power.
    </p>

    {/* Navigation Buttons */}
    <section className="navigation-buttons">
        <button onClick={handlePreviousClick} className="previous-button">Previous Page</button>
        <button onClick={handleNextClick} className="next-button">Next</button>
    </section>
</div>

  );
};

export default withAuth(M1);
