'use client';
import React, { useEffect, useState } from 'react';
import './puzzleArena.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserDetails } from '../../types/types';
import Loading from '@/app/Loading';
import withAuth from '@/app/withAuth';

// Define types for file_ids and puzzles
type FileIdDetail = {
  id: string;
  move: string;
  sid_link: string;
  solution: string;
};

type FileIds = {
  [key: string]: FileIdDetail;
};

type Puzzle = {
  title: string;
  category: string;
  date_time: string;
  live_link: string;
  file_ids?: FileIds;
  total_title_category_score?: number;
  statusFlag: string;
};

type Scores = {
  Opening: number;
  Middlegame: number;
  Endgame: number;
  Mixed: number;
  total: number;
};

const PuzzleArena = () => {
  const router = useRouter();
  const levelMapping: Record<string, string> = {
    level1: "Pawn",
    level2: "Knight",
    level3: "Bishop",
    level4: "Rook",
    level5: "Queen",
    level6: "King",
  };

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [scores, setScores] = useState<Scores>({
    Opening: 0,
    Middlegame: 0,
    Endgame: 0,
    Mixed: 0,
    total: 0,
  });
  const [showArenaResult, setShowArenaResult] = useState<boolean>(false);
 
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (typeof window !== 'undefined') {
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString
          ? JSON.parse(userDetailsString)
          : null;

        if (storedUserDetails) {
          setUserDetails(storedUserDetails);
          try {
            if (!dataFetched) {
              setDataFetched(true);

              const scoreResponse = await axios.post(
                'http://127.0.0.1:80/calculate_scores_inschool',
                {
                  email: storedUserDetails.email,
                }
              );
              if (scoreResponse.data.success) {
                const fetchedScores = scoreResponse.data.scores as Scores;
                setScores({
                  Opening: fetchedScores.Opening || 0,
                  Middlegame: fetchedScores.Middlegame || 0,
                  Endgame: fetchedScores.Endgame || 0,
                  Mixed: fetchedScores.Mixed || 0,
                  total: Object.values(fetchedScores).reduce(
                    (a, b) => (typeof b === 'number' ? a + b : a),
                    0
                  ),
                });
              } else {
                setError('Failed to fetch scores.');
              }

            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        }
      }
    };

    fetchUserDetails();
  }, [dataFetched]);

  const handleClick = () => {
    console.log("button clicked")
    setShowArenaResult(true);
  };
 
  return (
    <div className="puzzle-arena-page">
    {Object.values(loading).some((isLoading) => isLoading) && (
      <Loading />
    )}
    <div className="puzzle-arena-container">
        <div className="top-section">
          <div className="left-section">
            <img src="/images/puzzlearena.png" alt="Puzzle Arena" />
          </div>

          <div className="right-section">
            <div className="header">
              <p className="title">Puzzle Arena Performance Summary</p>
            </div>

            <div className="arena-scores">
              <div className="score-item1">
                Opening Arena : <span>{scores.Opening}</span>
              </div>
              <div className="score-item2">
                Middlegame Arena : <span>{scores.Middlegame}</span>
              </div>
              <div className="score-item3">
                Endgame Arena : <span>{scores.Endgame}</span>
              </div>
              <div className="score-item">
                Mixed Arena : <span>{scores.Mixed}</span>
              </div>
              <div className="total-score">
                Puzzle Arena Score: <span onClick={handleClick} className="clickable-link">{scores.total}</span>
              </div>

            </div>
            </div>
          </div>
       
      </div>
    </div>
  );
};

export default withAuth(PuzzleArena);
