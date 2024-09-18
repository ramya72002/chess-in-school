import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Arenaresult.scss';
import { UserDetails } from './types/types';

interface ArenaresultProps {
  isOpen: boolean;
  onClose: () => void;
}

const Arenaresult: React.FC<ArenaresultProps> = ({ isOpen, onClose }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [visiblePuzzleTable, setVisiblePuzzleTable] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetailsString = localStorage.getItem('userDetails');
      const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
      const email = storedUserDetails ? storedUserDetails.email : '';

      if (email) {
        try {
          const response = await axios.get(`http://127.0.0.1:80/getinschooldetails?email=${email}`);
          if (response.data.success) {
            setUserDetails(response.data.data);
          } else {
            console.error('User not found');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const togglePuzzleTableVisibility = (part: string) => {
    setVisiblePuzzleTable(prevState => ({
      ...prevState,
      [part]: !prevState[part],
    }));
  };

  if (!isOpen) return null; // Do not render if not open

  return (
    <div className="arena-result">
      <div className="arena-result-content">
        <button className="close-button" onClick={onClose}>X</button>
        {userDetails ? (
          <table className="user-details-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td>{userDetails.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{userDetails.email}</td>
              </tr>
              <tr>
                <td>Level</td>
                <td>{userDetails.level}</td>
              </tr>
              <tr>
                <td>Image</td>
                <td><img src={userDetails.image} alt="User" className="user-image" /></td>
              </tr>
              <tr>
                <td>Scores</td>
                <td>
                  <table className="scores-table">
                    <tbody>
                      {userDetails.scores &&
                        Object.entries(userDetails.scores).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>Puzzle Arena</td>
                <td>
                  {userDetails.PuzzleArena &&
                    Object.entries(userDetails.PuzzleArena).map(([arenaType, puzzles]) => (
                      <div key={arenaType} className="puzzle-arena-section">
                        <h3>{arenaType}</h3>
                        {Object.entries(puzzles).map(([part, puzzlesData]) => {
                          const sortedPuzzles = Object.entries(puzzlesData).sort(([a], [b]) => {
                            const numberA = parseInt(a.replace('Puzzle', ''));
                            const numberB = parseInt(b.replace('Puzzle', ''));
                            return numberA - numberB;
                          });

                          const sumOfScores = sortedPuzzles.reduce((sum, [_, puzzleData]) => sum + (puzzleData.score || 0), 0);

                          return (
                            <div key={part} className="puzzle-category">
                              <h4 
                                className="puzzle-title" 
                                onClick={() => togglePuzzleTableVisibility(part)}
                                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                              >
                                Title: {part}-(Total score: {sumOfScores})
                              </h4>
                              {visiblePuzzleTable[part] && (
                                <table className="puzzles-table">
                                  <tbody>
                                    {sortedPuzzles.slice(0, 10).map(([puzzleName, puzzleData]) => (
                                      <tr key={puzzleName}>
                                        <td>{puzzleName}</td>
                                        <td>Started: {puzzleData.started ? 'Yes' : 'No'}</td>
                                        <td>Option Guessed: {puzzleData.option_guessed !== null ? (puzzleData.option_guessed ? 'Yes' : 'No') : 'N/A'}</td>
                                        <td>Timer: {puzzleData.timer} seconds</td>
                                        <td>Score: {puzzleData.score}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Arenaresult;
