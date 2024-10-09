'use client';
import './startArena.scss'; // Import globally
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { ImageData } from '../../types/types';
import Loading from '@/app/Loading';
import withAuth from '@/app/withAuth';

const StartArena = () => {
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [score, setScore] = useState<string>('');
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [puzzleArena, setPuzzleArena] = useState<any>(null);
  const totalImages = images.length;

  const router = useRouter();

  useEffect(() => {
    // Extract query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const queryTitle = queryParams.get('title');
    const queryLevel = queryParams.get('level');
    const queryCategory = queryParams.get('category');
    const queryDate = queryParams.get('date_time');
    const queryScore = queryParams.get('score');

    if (queryTitle) setTitle(decodeURIComponent(queryTitle));
    if (queryDate) setDate(decodeURIComponent(queryDate));
    if (queryCategory) setCategory(decodeURIComponent(queryCategory));
    if (queryLevel) setLevel(decodeURIComponent(queryLevel));
    if (queryScore) setScore(decodeURIComponent(queryScore));
  }, []);

  useEffect(() => {
    // Fetch PuzzleArena details
    if (title && category) {
      const fetchPuzzleArena = async () => {
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
        const email = storedUserDetails ? storedUserDetails.email : '';
        try {
          const response = await axios.get(`https://backend-chess-tau.vercel.app/get_Arena_user_inschool`, {
            params: {
              email: email,
              category: category,
              title: title
            }
          });
          setPuzzleArena(response.data.puzzleArena);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch PuzzleArena details');
        }
      };

      fetchPuzzleArena();
    }
  }, [title, category]);

  useEffect(() => {
    // Fetch images when title and level are available
    if (title && level) {
      const fetchImages = async () => {
        try {
          const response = await axios.get(`https://backend-chess-tau.vercel.app/images/title?level=${encodeURIComponent(level)}&category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}`);
          const imagesData: ImageData[] = response.data.images;
          setImages(imagesData);
          fetchAllImages(imagesData); // Fetch the image files
        } catch (err) {
          console.error(err);
          setError('Failed to fetch images');
        } finally {
          setLoading(false);
        }
      };

      fetchImages();
    }
  }, [title, level]);

  const fetchAllImages = (imageSets: ImageData[]) => {
    imageSets.forEach(image => {
      fetchImageFile(image.id);
    });
  };

  const fetchImageFile = (fileId: string) => {
    axios.post('https://backend-chess-tau.vercel.app/image_get_fileid', { file_id: fileId }, { responseType: 'blob' })
      .then(response => {
        const url = URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
        setImageUrls(prevState => ({ ...prevState, [fileId]: url }));
      })
      .catch(error => {
        console.error(`Error fetching image with file ID ${fileId}:`, error);
      });
  };

  const handleImageClick = async (image: ImageData, index: number) => {
    const puzzleNumber = `Puzzle${index + 1}`;
    const userDetailsString = localStorage.getItem('userDetails');
    const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
    const email = storedUserDetails ? storedUserDetails.email : '';

    // Call API to update puzzle started flag
    try {
      await axios.post('https://backend-chess-tau.vercel.app/update_puzzle_started_inschool', {
        email,
        category,
        title,
        puzzle_no: puzzleNumber
      });

      // Navigate to the puzzle page after updating the flag
      const url = `/arena/insidepuzzlearena?file_id=${encodeURIComponent(image.id)}&title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}&level=${encodeURIComponent(level)}&puzzle_number=${encodeURIComponent(index + 1)}`;
      router.push(url);
    } catch (error) {
      console.error('Error updating puzzle started flag:', error);
      setError('Failed to update puzzle status');
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container">
      <h2 className="titlemain">{title}</h2>
      <div className="infoTable">
        <table>
          <thead>
            <tr>
              <th>Date Added</th>
              <th>Level</th>
              <th>Category</th>
              <th>Name</th> 
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{date}</td>
              <td>{level}</td>
              <td>{category}</td>
              <td>{title}</td> 
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="imageGallery">
        {images.map((image, index) => {
          const puzzleNumber = `Puzzle${index + 1}`;
          const puzzleData = puzzleArena ? puzzleArena[puzzleNumber] : {};
          const started = puzzleData.started ? 'Started' : 'Not Started';
          const score = puzzleData.score || 0;

          return (
            <div key={image.id} onClick={() => handleImageClick(image, index)} style={{ cursor: 'pointer' }}>
              <img src={imageUrls[image.id] || '/default-image.png'} alt={image.filename} />
              <div className="imageText">
                <button className="puzzleButton">Puzzle {index + 1}</button>
                <button className="statusButton">{started}</button>
                <button className="statusButton">Score: {score}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default withAuth(StartArena);
