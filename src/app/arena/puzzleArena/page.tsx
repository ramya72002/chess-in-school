'use client';
import React, { useEffect, useState } from 'react';
import './puzzleArena.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserDetails } from '../../types/types';
import Loading from '@/app/Loading';
import withAuth from '@/app/withAuth';

const PuzzleArena = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedArena, setSelectedArena] = useState<'Opening' | 'Middlegame' | 'Endgame' | 'Mixed'>('Opening');
  const [selectedPart, setSelectedPart] = useState<string | null>(null); // Track selected part in an arena

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const email = "nsriramya7@gmail.com";
        const response = await axios.get(`http://127.0.0.1:80/getinschooldetails?email=${email}`);
        
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

  const handleArenaClick = (arena: 'Opening' | 'Middlegame' | 'Endgame' | 'Mixed') => {
    setSelectedArena(arena);
    setSelectedPart(null); // Reset selected part when switching arenas
  };

  const handlePartClick = (part: string) => {
    setSelectedPart(part);
  };

  return (
    <div className="puzzle-arena-page">
      {loading ? <Loading /> : (
        <div className="puzzle-arena-container">
          <div className="top-section">
            <div className="left-section">
              <img src="/images/puzzlearena.png" alt="Puzzle Arena" />
            </div>
            <div className="right-section">
              <div className="header">
                <p className="title">Puzzle Arena Performance Summary</p>
              </div>

              {error ? (
                <p className="error-message">{error}</p>
              ) : (
                <>
                  <div className="arena-scores">
                    <div className="score-item clickable-link" onClick={() => handleArenaClick('Opening')}>
                      Opening Arena: <span>{userDetails?.scores?.Opening || 0}</span>
                    </div>
                    <div className="score-item clickable-link" onClick={() => handleArenaClick('Middlegame')}>
                      Middlegame Arena: <span>{userDetails?.scores?.Middlegame || 0}</span>
                    </div>
                    <div className="score-item clickable-link" onClick={() => handleArenaClick('Endgame')}>
                      Endgame Arena: <span>{userDetails?.scores?.Endgame || 0}</span>
                    </div>
                    <div className="score-item clickable-link" onClick={() => handleArenaClick('Mixed')}>
                      Mixed Arena: <span>{userDetails?.scores?.Mixed || 0}</span>
                    </div>

                    <div className="total-score">
                      Selected Arena: <strong>{selectedArena}</strong>
                    </div>
                  </div>

                  {/* Display selected Puzzle Arena details */}
                  <div className="puzzle-details">
                    {selectedArena && (
                      <div>
                        <h3>{selectedArena} Puzzle Details</h3>
                        {/* Table to display parts in selected arena */}
                        {Object.keys(userDetails?.PuzzleArena?.[selectedArena] || {}).map(part => (
                          <div key={part}>
                            <h4 className="part-header clickable-link" onClick={() => handlePartClick(part)}>
                              {part}
                            </h4>
                            {selectedPart === part && (
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
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(PuzzleArena);
