'use client'
import React, { useState, useEffect } from 'react';
import './admin_image_demo.scss';
import Model from '@/app/Model';
import withadminAuth from '@/app/withadminAuth';


interface FileData {
  id: string;
  move:string;
  solution: string;
  sid_link: string;
}

interface PuzzleData {
  _id: string;
  date_time: string;
  level: string;
  category: string;
  title: string;
  live: string;
  live_link:string,
  file_ids: { [key: string]: FileData };
}

const Admin_image_demo: React.FC = () => {
  const [puzzleData, setPuzzleData] = useState<PuzzleData[]>([]);
  const [formData, setFormData] = useState({
    level: '',
    category: '',
    title: '',
    live: '',
    live_link:'',
    date_time: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedPuzzle, setSelectedPuzzle] = useState<{ puzzle: PuzzleData | null; column: string | null }>({ puzzle: null, column: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const fetchData = async () => {
    try {
      const response = await fetch('https://backend-dev-chess.vercel.app/imagesets');
      if (!response.ok) {
        throw new Error('Failed to fetch puzzle data');
      }
      const data = await response.json();
      setPuzzleData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('An error occurred while fetching data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      setFiles(e.target.files);
    } else {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const formDataToSend = new FormData();
    formDataToSend.append('level', formData.level);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('live', formData.live);
    formDataToSend.append('live_link', formData.live_link);
    formDataToSend.append('date_time', formData.date_time);

    if (files) {
      Array.from(files).forEach(file => formDataToSend.append('images', file));
    }

    try {
      const response = await fetch('https://backend-dev-chess.vercel.app/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Upload failed');
      }

      alert('Images uploaded successfully!');
      fetchData(); // Refresh data after successful upload

      setFormData({
        level: '',
        category: '',
        title: '',
        live: '',
        live_link:"",
        date_time: '',
      });
      setFiles(null);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('An error occurred while uploading the images.');
    }finally {
      setIsLoading(false); // Stop loading
    }
  };
  const handleEdit = async (puzzle: PuzzleData) => {
    // Prompt for live status
    const updatedLive = prompt('Enter the new live status (Yes/No):', puzzle.live);
    if (updatedLive === null) {
      return; // No change or cancelled
    }
  
    // Prompt for live link if the live status is "Yes"
    let updatedLiveLink = puzzle.live_link;
    if (updatedLive.toLowerCase() === 'yes') {
      updatedLiveLink = prompt('Enter the new live link:', puzzle.live_link) || puzzle.live_link;
    }
  
    try {
      // Call the /updatelivepuzzle API to update the puzzle
      const response = await fetch('https://backend-dev-chess.vercel.app/updatelivepuzzle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: puzzle.level,
          category: puzzle.category,
          title: puzzle.title,
          live: updatedLive,
          live_link: updatedLiveLink,
        }),
      });
  
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Update failed');
      }
  
      // Fetch updated puzzle data
      await fetchData(); // Refresh the puzzle data
  
      alert('Puzzle updated successfully!');
    } catch (error) {
      console.error('Error updating puzzle:', error);
      alert('An error occurred while updating the puzzle.');
    }
  };
  
  
  

  const handleAddImage = async (puzzleIndex: number, puzzleKey: string) => {
    const puzzle = puzzleData[puzzleIndex];
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    document.body.appendChild(fileInput);

    fileInput.onchange = async (event) => {
      const fileList = (event.target as HTMLInputElement).files;

      if (!fileList || fileList.length === 0) {
        alert('No file selected.');
        document.body.removeChild(fileInput);
        return;
      }

      const formData = new FormData();
      formData.append('level', puzzle.level);
      formData.append('category', puzzle.category);
      formData.append('title', puzzle.title);
      formData.append('live', puzzle.live);
      formData.append('live_link', puzzle.live_link);
      formData.append('date_time', puzzle.date_time);
      formData.append('puzzle_number', puzzleKey.replace('puzzle', ''));
      formData.append('images', fileList[0]);

      try {
        setIsLoading(true); // Start loading
        const response = await fetch('https://backend-dev-chess.vercel.app/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Upload failed');
        }

        alert('Image uploaded successfully!');
        setPuzzleData(prevData => {
          const newData = [...prevData];
          newData[puzzleIndex].file_ids[puzzleKey] = {
            id: fileList[0].name,
            move: '',
            solution: '',
            sid_link: '',
          };
          return newData;
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('An error occurred while uploading the image.');
      } finally {
        setIsLoading(false); // Stop loading
        document.body.removeChild(fileInput);
      }
    };

    fileInput.click();
  };

  const handleViewEdit = async (puzzleIndex: number, puzzleKey: string) => {
    const puzzle = puzzleData[puzzleIndex];
    const puzzleFile = puzzle.file_ids[puzzleKey];

    if (!puzzleFile) {
      console.log('Puzzle file does not exist.');
      return;
    }

    try {
      const apiUrl = `https://backend-dev-chess.vercel.app/getpuzzleid?level=${encodeURIComponent(puzzle.level)}&category=${encodeURIComponent(puzzle.category)}&title=${encodeURIComponent(puzzle.title)}&live=${encodeURIComponent(puzzle.live)}&puzzle_number=${puzzleKey.replace('puzzle', '')}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error fetching puzzle data');
      }

      const data = await response.json();
      setSelectedPuzzle({ puzzle: data, column: puzzleKey });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching puzzle data:', error);
      alert('An error occurred while fetching the puzzle data.');
    }
  };

  const handleDelete = async (puzzle: PuzzleData) => {
    if (window.confirm('Are you sure you want to delete this puzzle?')) {
      try {
        const response = await fetch('https://backend-dev-chess.vercel.app/delete-arena-title', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            level: puzzle.level,
            category: puzzle.category,
            title: puzzle.title
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Delete failed');
        }

        alert('Puzzle deleted successfully!');
        // Refresh the puzzle data
        const updatedResponse = await fetch('https://backend-dev-chess.vercel.app/imagesets');
        const updatedData = await updatedResponse.json();
        setPuzzleData(updatedData);
      } catch (error) {
        console.error('Error deleting puzzle:', error);
        alert('An error occurred while deleting the puzzle.');
      }
    }
  };

  return (
    <>
      <form className="admin-image-form" onSubmit={handleSubmit}>
        <select name="level" value={formData.level} onChange={handleChange} required>
          <option value="">Select Level</option>
          <option value="Pawn">Pawn</option>
          <option value="Knight">Knight</option>
          <option value="Bishop">Bishop</option>
          <option value="Rook">Rook</option>
          <option value="Queen">Queen</option>
          <option value="King">King</option>
        </select>

        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Opening">Opening</option>
          <option value="Middlegame">Middlegame</option>
          <option value="Endgame">Endgame</option>
          <option value="Mixed">Mixed</option>
        </select>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter Title"
          required
        />

        <select name="live" value={formData.live} onChange={handleChange} required>
          <option value="">Live?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <input
  type="text"
  name="live_link"
  value={formData.live_link}
  onChange={handleChange}
  placeholder="Enter live link if needed"
/>


        <input
          type="datetime-local"
          name="date_time"
          value={formData.date_time}
          onChange={handleChange}
        />

        <input
          type="file"
          name="images"
          multiple
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      <table className="puzzles-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Level</th>
            <th>Category</th>
            <th>Title</th>
            <th>Live</th>
            {Array.from({ length: 9 }, (_, i) => (
              <th key={i}>Puzzle {i + 1}</th>
            ))}
            <th className="delete-button">Delete</th>
            <th className="edit-button">Edit</th>

          </tr>
        </thead>
        <tbody>
          {puzzleData.map((puzzle, puzzleIndex) => (
            <tr key={puzzle._id}>
              <td>{puzzle.date_time}</td>
              <td>{puzzle.level}</td>
              <td>{puzzle.category}</td>
              <td>{puzzle.title}</td>
              <td>{puzzle.live}</td>
              {Array.from({ length: 9 }, (_, i) => (
                <td key={i}>
                  {puzzle.file_ids[`puzzle${i + 1}`] ? (
                    <button onClick={() => handleViewEdit(puzzleIndex, `puzzle${i + 1}`)}>View/Edit</button>
                  ) : (
                    <button onClick={() => handleAddImage(puzzleIndex, `puzzle${i + 1}`)}>Add Image</button>
                  )}
                </td>
              ))}
              <td>
                <button className="delete-button" onClick={() => handleDelete(puzzle)}>Delete</button>
              </td>
              <td>
  <button className="edit-button" onClick={() => handleEdit(puzzle)}>Edit</button>
</td>


            </tr>
          ))}
        </tbody>
      </table>

        <Model
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        puzzleData={selectedPuzzle.puzzle || null}
        columnName={selectedPuzzle.column || "puzzle1"}
        />
    </>
  );
};

export default withadminAuth(Admin_image_demo);
