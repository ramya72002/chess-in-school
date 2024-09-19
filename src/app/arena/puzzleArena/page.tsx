'use client';
import React, { useEffect, useState } from 'react';
import './puzzleArena.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserDetails } from '../../types/types';
import Loading from '@/app/Loading';
import withAuth from '@/app/withAuth';

type Arena = 'Opening' | 'Middlegame' | 'Endgame' | 'Mixed';

const PuzzleArena = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedArena, setSelectedArena] = useState<Arena>('Opening');
  const [expandedPart, setExpandedPart] = useState<string | null>(null); // Track expanded part

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString
          ? JSON.parse(userDetailsString)
          : null;
          const scoreResponse = await axios.post(
            'https://backend-chess-tau.vercel.app/calculate_scores_inschool',
            {
              email: storedUserDetails.email,
            }
          );        
        const response = await axios.get(`https://backend-chess-tau.vercel.app/getinschooldetails?email=${storedUserDetails.email}`);
        
        if (response.data.success) {
          setUserDetails(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError('Failed to fetch user details.');
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, []);

  const handleArenaClick = (arena: Arena) => {
    setSelectedArena(arena);
    setExpandedPart(null); // Reset expanded part when switching arenas
  };

  const handlePartClick = (part: string) => {
    setExpandedPart(prev => prev === part ? null : part); // Toggle visibility
  };

  // Calculate total score with safety check
  const calculateTotalScore = () => {
    const scores = userDetails?.scores;
    if (!scores) return 0;
    return ['Opening', 'Middlegame', 'Endgame', 'Mixed']
      .reduce((total, arena) => total + (scores[arena as Arena] || 0), 0);
  };

  const arenaScore = userDetails?.scores?.[selectedArena] || 0;
  const totalScore = calculateTotalScore();

  return (
    <div className="puzzle-arena-page">
      {loading ? <Loading /> : (
        <div className="puzzle-arena-container">
          <div className="header">
            <img src="/images/puzzlearena.png" alt="Puzzle Arena" className="header-image" />
            <h1 className="header-title">Puzzle Arena Performance Summary</h1>
          </div>

          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <div className="arena-scores">
                {['Opening', 'Middlegame', 'Endgame', 'Mixed'].map(arena => (
                  <div
                    key={arena}
                    className={`score-item ${selectedArena === arena ? 'active' : ''}`}
                    onClick={() => handleArenaClick(arena as Arena)}
                  >
                    <span className="arena-name">{arena} Arena:</span>
                    <span className="score-value">{userDetails?.scores?.[arena as Arena] || 0}</span>
                  </div>
                ))}
                <div className="score-item total-score">
                  <span className="arena-name">Total Arena Score:</span>
                  <span className="score-value">{totalScore}</span>
                </div>
                <div className="total-score">
                  Selected Arena: <strong>{selectedArena}</strong>
                </div>
              </div>

              {selectedArena && (
                <div className="puzzle-details">
                  <h3>{selectedArena} Puzzle Details</h3>
                  {Object.keys(userDetails?.PuzzleArena?.[selectedArena] || {}).map(part => (
                    <div key={part}>
                      <h4
                        className="part-header clickable-link"
                        onClick={() => handlePartClick(part)}
                      >
                        {part}
                      </h4>
                      {expandedPart === part && (
                        <table className="puzzle-table">
                          <thead>
                            <tr>
                              <th>Puzzle</th>
                              <th>Started</th>
                              <th>Option Guessed</th>
                              <th>Timer (seconds)</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(userDetails?.PuzzleArena?.[selectedArena]?.[part] || {}).map(puzzle => {
                              const puzzleData = userDetails?.PuzzleArena?.[selectedArena]?.[part]?.[puzzle];
                              return (
                                <tr key={puzzle}>
                                  <td><strong>{puzzle}</strong></td>
                                  <td>{puzzleData?.started ? 'Yes' : 'No'}</td>
                                  <td>{puzzleData?.option_guessed !== null ? (puzzleData?.option_guessed ? 'Yes' : 'No') : 'None'}</td>
                                  <td>{puzzleData?.timer || 0}</td>
                                  <td>{puzzleData?.score || 0}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default withAuth(PuzzleArena);
