/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './portal.scss';
import { UserDetails, UpcomingActivity } from '../types/types';
import Loading from '../Loading';
import withAuth from '../withAuth';
import { useRouter } from 'next/navigation';

const Hero: React.FC = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [upcomingActivities, setUpcomingActivities] = useState<UpcomingActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State for "Learn More" toggle

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (typeof window !== 'undefined') {
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;

        if (storedUserDetails) {
          setUserDetails(storedUserDetails); // Set user details from localStorage

          try {
            const response = await axios.get(
              `https://backend-chess-tau.vercel.app/getinschooldetails?email=${storedUserDetails.email}`
            );
            setUserDetails(response.data.data); // Update with data from API
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        }
      }
    };

    fetchUserDetails();
  }, []);

  const getActiveClass = (level: string) => {
    if (!userDetails) return '';

    const levelMap: { [key: string]: number } = {
      'Level 1': 1,
      'Level 2': 2,
      'Level 3': 3,
      'Level 4': 4,
      'Level 5': 5,
      'Level 6': 6,
    };

    const userLevel = levelMap[userDetails.level];
    const currentLevel = levelMap[level];

    return currentLevel <= userLevel ? 'active' : 'inactive';
  };

  const handleImageClick = (level: string) => {
    if (getActiveClass(`Level ${level}`) === 'active') {
      router.push(`/Afterschool${level}`); // Redirect to the corresponding level page
    }
  };

  const getConnectorWidth = () => {
    if (!userDetails) return '0%';

    const levelMap: { [key: string]: number } = {
      'Level 1': 8,
      'Level 2': 20,
      'Level 3': 40,
      'Level 4': 60,
      'Level 5': 80,
      'Level 6': 100,
    };

    const userLevel = levelMap[userDetails.level];
    return `${userLevel}%`;
  };

  const getConnectorColor = () => {
    if (!userDetails) return 'white';

    const levelMap: { [key: string]: number } = {
      'Level 1': 1,
      'Level 2': 2,
      'Level 3': 3,
      'Level 4': 4,
      'Level 5': 5,
      'Level 6': 6,
    };

    const userLevel = levelMap[userDetails.level];
    return userLevel > 0 ? '#f26722' : 'white'; // Change color based on the highest active level
  };

  if (!userDetails) {
    return null; // If userDetails is null, return null to prevent rendering the page
  }

  return (
    <div className="hero">
      <div className="headers">
        <h2>Your Chess Journey</h2>
      </div>

      <div className="journey-container">
        <div className="chess-journey">
          <div className="level">
            <svg className="connector" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 10" preserveAspectRatio="none">
              <line
                x1="0"
                y1="5"
                x2={getConnectorWidth()} // Use the width directly
                y2="5"
                stroke={getConnectorColor()}
                strokeWidth="10"
              />
            </svg>

            <div className={`step ${getActiveClass('Level 1')}`} onClick={() => handleImageClick('1')}>
              <div className="icon">
                <img src="/images/chessicons/4.png" alt="Pawn" className="chess-icon pawn" />
              </div>
              <p>Pawn</p>
              <p>(Absolute Beginners)</p>
            </div>

            <div className={`step ${getActiveClass('Level 2')}`} onClick={() => handleImageClick('2')}>
              <div className="icon">
                <img src="/images/chessicons/1.png" alt="Knight" className="chess-icon knight" />
              </div>
              <p>Knight</p>
              <p>(Novice Players)</p>
            </div>

            <div className={`step ${getActiveClass('Level 3')}`} onClick={() => handleImageClick('3')}>
              <div className="icon">
                <img src="/images/chessicons/5.png" alt="Bishop" className="chess-icon bishop" />
              </div>
              <p>Bishop</p>
              <p>(Intermediate Players)</p>
            </div>

            <div className={`step ${getActiveClass('Level 4')}`} onClick={() => handleImageClick('4')}>
              <div className="icon">
                <img src="/images/chessicons/3.png" alt="Rook" className="chess-icon rook" />
              </div>
              <p>Rook</p>
              <p>(Advanced Players)</p>
            </div>

            <div className={`step ${getActiveClass('Level 5')}`} onClick={() => handleImageClick('5')}>
              <div className="icon">
                <img src="/images/chessicons/6.png" alt="Queen" className="chess-icon queen" />
              </div>
              <p>Queen</p>
              <p>(Expert Players)</p>
            </div>

            <div className={`step ${getActiveClass('Level 6')}`} onClick={() => handleImageClick('6')}>
              <div className="icon">
                <img src="/images/chessicons/2.png" alt="King" className="chess-icon king" />
              </div>
              <p>King</p>
              <p>(Mastery Level)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="journey">
        <div className="level">
          <h3>Level Details</h3>
          <div className="steps">
            <div className="step">
              <div className="icon">
                <img src="/images/characters/Pawn.png" alt="Pawn Icon" />
              </div>
              <div>
                <h4>Level 1: Pawn (Absolute Beginners)</h4>
                <p className={isExpanded ? '' : 'truncate'}>
                  In chess, the journey starts with the humble pawn. At this foundational level, you’ll begin by learning the basic rules of the game, understanding how each piece moves, and grasping the concept of check and checkmate. You'll also be introduced to opening principles like controlling the center and developing your pieces. By the end of the Pawn level, you'll have a solid understanding of the board and be ready to play your first games.
                </p>
                <button onClick={toggleExpand} className="learn-more-btn">
                  {isExpanded ? 'Learn Less' : 'Learn More'}
                </button>
              </div>
            </div>

            <div className="step">
              <div className="icon">
                <img src="/images/characters/Knight.png" alt="Knight Icon" />
              </div>
              <div>
                <h4>Level 2: Knight (Novice Players)</h4>
                <p className={isExpanded ? '' : 'truncate'}>
                  Now that you've mastered the basics, it's time to step into the shoes of the agile knight. At this level, we’ll focus on more advanced piece coordination and basic tactics like forks, pins, and skewers. You’ll learn the importance of mobility and positioning, as well as how to plan your moves ahead. By the end of the Knight level, you'll be ready to tackle more competitive games and begin recognizing key tactical opportunities.
                </p>
                <button onClick={toggleExpand} className="learn-more-btn">
                  {isExpanded ? 'Learn Less' : 'Learn More'}
                </button>
              </div>
            </div>

            <div className="step">
              <div className="icon">
                <img src="/images/characters/Archer bishop.png" alt="Bishop Icon" />
              </div>
              <div>
                <h4>Level 3: Bishop (Intermediate Players)</h4>
                <p className={isExpanded ? '' : 'truncate'}>
                  In the Bishop level, players will refine their understanding of the game by focusing on strategy and planning. This level introduces advanced concepts such as pawn structures, weak squares, and exchanges. You’ll also dive into positional play, learning how to evaluate the strengths and weaknesses of a position and make plans based on the needs of the position. By mastering these concepts, you’ll take your play to a higher level.
                </p>
                <button onClick={toggleExpand} className="learn-more-btn">
                  {isExpanded ? 'Learn Less' : 'Learn More'}
                </button>
              </div>
            </div>

            <div className="step">
              <div className="icon">
                <img src="/images/characters/Rook.png" alt="Rook Icon" />
              </div>
              <div>
                <h4>Level 4: Rook (Advanced Players)</h4>
                <p className={isExpanded ? '' : 'truncate'}>
                  At the Rook level, we’ll dive into advanced tactics and endgames. This level focuses on important techniques like rook endgames, the principle of two weaknesses, and complex tactical themes. You’ll also learn how to exploit open files and control key squares. By the end of this level, you’ll have a well-rounded understanding of both tactical and strategic aspects of the game.
                </p>
                <button onClick={toggleExpand} className="learn-more-btn">
                  {isExpanded ? 'Learn Less' : 'Learn More'}
                </button>
              </div>
            </div>

            <div className="step">
              <div className="icon">
                <img src="/images/characters/Worrior Queen.png" alt="Queen Icon" />
              </div>
              <div>
                <h4>Level 5: Queen (Expert Players)</h4>
                <p className={isExpanded ? '' : 'truncate'}>
                  The Queen level is all about mastering your overall understanding of the game. You’ll learn advanced opening theory, middlegame strategies, and endgame techniques. Topics covered include calculating complex variations, creating long-term plans, and using imbalances to your advantage. By the end of this level, you’ll be able to play strong, competitive chess and face expert-level opponents.
                </p>
                <button onClick={toggleExpand} className="learn-more-btn">
                  {isExpanded ? 'Learn Less' : 'Learn More'}
                </button>
              </div>
            </div>

            <div className="step">
              <div className="icon">
                <img src="/images/characters/King.png" alt="King Icon" />
              </div>
              <div>
                <h4>Level 6: King (Mastery Level)</h4>
                <p className={isExpanded ? '' : 'truncate'}>
                  At the final level, King, you’ll work on becoming a chess master. This level covers the deepest aspects of the game, from opening preparation to endgame studies. You’ll refine your decision-making process, understand the nuances of high-level play, and learn to play creatively while minimizing mistakes. By completing this level, you’ll be prepared to compete at a mastery level and take your place among the strongest players.
                </p>
                <button onClick={toggleExpand} className="learn-more-btn">
                  {isExpanded ? 'Learn Less' : 'Learn More'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Hero);
