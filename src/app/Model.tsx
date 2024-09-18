'use client';
import React, { useState } from 'react';
import axios from 'axios';
import './model.scss';
import { ModelProps } from './types/types';

const Modal: React.FC<ModelProps> = ({ isOpen, onClose, puzzleData, columnName }) => {
  const [sidLink, setSidLink] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [move, setMove] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log("ppppp", puzzleData);

  const handleSubmit = async () => {
    if (!puzzleData) return;

    setIsLoading(true);

    try {
      const response = await axios.put('http://127.0.0.1:80/get_puzzle_sol', {
        level: puzzleData.level,
        category: puzzleData.category,
        title: puzzleData.title,
        live: puzzleData.live,
        column_name: columnName,
        move: move,
        sid_link: sidLink, // SID Link can be empty
        solution: solution,
      });

      if (response.status === 200) {
        setSuccess('Puzzle updated successfully. You can close this window and reopen for changes.');
        setError(null);
        setMove('');
        setSidLink('');  // Clear the input fields after successful submission
        setSolution('');
      }
    } catch (error) {
      setSuccess(null);
      setError('Error updating puzzle');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !puzzleData) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>Puzzle Details</h2>
        <p><strong>Date Time:</strong> {puzzleData?.date_time}</p>
        <p><strong>Level:</strong> {puzzleData?.level}</p>
        <p><strong>Category:</strong> {puzzleData?.category}</p>
        <p><strong>Title:</strong> {puzzleData?.title}</p>
        <p><strong>Live:</strong> {puzzleData?.live ? 'Yes' : 'No'}</p>
        <p><strong>Live Link:</strong> {puzzleData?.live_link}</p>
        <p><strong>Column Name:</strong> {columnName}</p>
        <p><strong>Move:</strong> {puzzleData.file_ids[columnName].move}</p>
        <p><strong>Solution:</strong> {puzzleData.file_ids[columnName].solution}</p>
        <p><strong>SID Link:</strong> {puzzleData.file_ids[columnName].sid_link}</p>
        <p>If you want to update the solution and SID link, please update below:</p>

        <div className="form-group">
          <label>Move:</label>
          <select
            name="move"
            value={move}
            onChange={(e) => setMove(e.target.value)}
            required
          >
            <option value="">Select Move</option>
            <option value="White to move">White to move</option>
            <option value="Black to move">Black to move</option>
          </select>
        </div>

        <div className="form-group">
          <label>SID Link:</label>
          <input
            type="text"
            value={sidLink}
            onChange={(e) => setSidLink(e.target.value)}
            placeholder="Enter SID Link"
          />
        </div>

        <div className="form-group">
          <label>Solution:</label>
          <input
            type="text"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Enter Solution"
          />
        </div>

        <button className="submit-button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Submit'}
        </button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default Modal;
