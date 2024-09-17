/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import './StudentDetails.scss';
import withadminAuth from '@/app/withadminAuth';


interface Student {
  name: string;
  email: string;
  level: string;
  image: string;
  scores?: {
    Opening: number;
    Middlegame: number;
    Endgame: number;
    Mixed: number;
  };
  PuzzleArena?: {
    [category: string]: {
      [part: string]: {
        [puzzle: string]: {
          started: boolean;
          option_guessed: number | null;
          timer:number|0;
          score: number;
        };
      };
    };
  };
}

function StudentDetails() {
  const [students, setStudents] = useState<Student[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('https://backend-dev-chess.vercel.app/studentList')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
      });
  };

  const deleteStudent = (email: string) => {
    axios.delete('https://backend-dev-chess.vercel.app/del-student', { data: { email } })
      .then(() => {
        fetchStudents(); // Fetch the updated list after deletion
        setConfirmDelete(null); // Reset confirmation state
      })
      .catch(error => {
        console.error('Error deleting student:', error);
      });
  };

  const handleDeleteClick = (email: string) => {
    setConfirmDelete(email); // Set the email to confirm deletion
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteStudent(confirmDelete);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null); // Cancel deletion
  };

  return (
    <div className="student-details-container">
      {students.map((student, index) => (
        <div key={index} className="student-box">
          <img src={student.image} alt={student.name} className="student-image" />
          <div className="student-info">
            <h3 className="student-name">{student.name}</h3>
            <p>Email: {student.email}</p>
            <p>Level: {student.level}</p>
            {student.scores && (
              <div className="student-scores">
                <p><strong>Arena Scores:</strong></p>
                <ul>
                  <li>Opening: {student.scores.Opening}</li>
                  <li>Middlegame: {student.scores.Middlegame}</li>
                  <li>Endgame: {student.scores.Endgame}</li>
                  <li>Mixed: {student.scores.Mixed}</li>
                </ul>
              </div>
            )}
                            <p><strong>Detailed view:</strong></p>

            {student.PuzzleArena && Object.keys(student.PuzzleArena).map((category, catIdx) => (
              
              <div key={catIdx} className="puzzle-category">
                <h4>{category} - Puzzles</h4>
                {Object.keys(student.PuzzleArena![category]).map((part, partIdx) => (
                  <div key={partIdx} className="puzzle-part">
                    <h5>{part}</h5>
                    <table className="puzzle-table">
                      <thead>
                        <tr>
                          <th>Puzzle</th>
                          <th>Started</th>
                          <th>Guessed</th>
                          <th>Timer</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(student.PuzzleArena![category][part])
                          .filter(puzzleKey => {
                            const match = puzzleKey.match(/^Puzzle(\d+)$/);
                            return match && Number(match[1]) <= 9;
                          })
                          .map((puzzleKey, puzzleIdx) => {
                            const puzzle = student.PuzzleArena![category][part][puzzleKey];
                            return (
                             <tr key={puzzleIdx}>
                                <td>{puzzleKey} </td>
                                <td>{puzzle.started ? "Yes" : "No"}</td>
                                <td>{puzzle.option_guessed !== null ? puzzle.option_guessed.toString() : "N/A"}</td>
                                <td>{puzzle.timer}</td>
                                <td>{puzzle.score}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="delete-container">
            {confirmDelete === student.email ? (
              <div className="confirm-delete">
                <button onClick={handleConfirmDelete} className="confirm-button">Confirm</button>
                <button onClick={handleCancelDelete} className="cancel-button">Cancel</button>
              </div>
            ) : (
              <FaTrash
                className="delete-icon"
                onClick={() => handleDeleteClick(student.email)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default withadminAuth(StudentDetails);
