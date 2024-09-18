/* eslint-disable react/no-unescaped-entities */
'use client';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import './insidepuzzlearena.scss';
import withAuth from '@/app/withAuth';

const PuzzlePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = searchParams.get('file_id') || '66bb8396af2a1e3287996406'; // Default file_id
  const title = searchParams.get('title') || 'Mastering Pawn Structure';
  const level = searchParams.get('level') || 'Pawn';
  const category = searchParams.get('category') || 'Middlegame';
  const puzzle_number = searchParams.get('puzzle_number') || '1';

  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isTimerStopped, setIsTimerStopped] = useState<boolean>(true); // Assume timer is stopped initially

  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [solutions, setSolutions] = useState<{ id: string; move: string; sid_link: string; solution: string }[]>([]);
  const [congratulationsVisible, setCongratulationsVisible] = useState<boolean>(false); // New state for congratulatory message
  const [showSolutionPopup, setShowSolutionPopup] = useState<boolean>(false); // New state for solution popup visibility
  const [showMissedItPopup, setShowMissedItPopup] = useState<boolean>(false); // New state for "Missed It" popup visibility
  const [puzzleBlocked, setPuzzleBlocked] = useState<string>(""); // New state for "Missed It" popup visibility
  const [isGotItRightDisabled, setIsGotItRightDisabled] = useState<boolean>(false);
  const [isMissedItDisabled, setIsMissedItDisabled] = useState<boolean>(false);
  const intervalRef = useRef<number | undefined>(undefined);
  
  const [isButtonsActive, setIsButtonsActive] = useState<boolean>(false);

  const handleGoBack = () => {
    router.back(); // Navigate back to the previous page
  };

  const checkPuzzleStatus = async (email: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:80/get_visited_info_inschool`, {
        params: { email, category, title, puzzle_no: `Puzzle${puzzle_number}` }
      });
      if (response.data.success) {
        setPuzzleBlocked(response.data.option_guessed);
        console.log("rrr", puzzleBlocked)
      }
    } catch (error) {
      console.error('Error fetching puzzle status:', error);
    }
  };

  useEffect(() => {
    fetchImageFile(fileId); // Call API with fileId
    fetchSolutions(); // Fetch solutions
    const userDetailsString = localStorage.getItem('userDetails');
    const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
    const email = storedUserDetails ? storedUserDetails.email : '';

    checkPuzzleStatus(email);

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [fileId]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    }
  
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);
  
 

  const fetchImageFile = (id: string) => {
    axios.post(
        'http://127.0.0.1:80/image_get_fileid',
        { file_id: id },
        { responseType: 'blob' }
      )
      .then(response => {
        const url = URL.createObjectURL(
          new Blob([response.data], { type: response.headers['content-type'] })
        );
        setImageSrc(url);
      })
      .catch(error => {
        console.error(`Error fetching image with file ID ${id}:`, error);
      });
  };

  const fetchSolutions = () => {
    axios.get(`http://127.0.0.1:80/images/solutions?title=${title}&level=${level}&category=${category}&id=${fileId}`)
      .then(response => {
        setSolutions(response.data.images);
        console.log(`Fetched solutions:`, response.data.images);
      })
      .catch(error => {
        console.error('Error fetching solutions:', error);
      });
  };

  const handleStartStopTimer = () => {
    setIsRunning(prev => !prev); // Toggle timer state
    setIsButtonsActive(prev => !prev); // Toggle buttons active state
    setIsTimerStopped(prev => !prev); // Toggle timer stopped state
  };
  

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShowSolution = () => {
    if (timer == 0) { // Check if timer is not stopped
      alert("Please start the timer");
      console.log(timer)
    }
    else if (!isButtonsActive &&isTimerStopped&&!isRunning) {
      console.log("ss",isButtonsActive,isTimerStopped,isRunning)
      setShowSolutionPopup(true); // Show the solution popup
    } else {
      alert("Please click on Stop Timer to view solution");
    }
  };

  const closeSolutionPopup = () => {
    setShowSolutionPopup(false); // Hide the solution popup
  };

  const handleShowSidLink = () => {
    if (timer == 0) { // Check if timer is not stopped
      alert("Please start the timer");
      console.log(timer)
    }
    else if (!isButtonsActive &&isTimerStopped&&!isRunning) {
      if (solutions.length > 0) {
        window.open(solutions[0].sid_link, '_blank');
      }
    } else {
      alert("Please click on Stop Timer to Ask SID");
    }
  };

  const handleGotItRight = async () => {
    console.log("ss",isButtonsActive,isTimerStopped,isRunning)
    if (timer == 0) { // Check if timer is not stopped
      alert("Please start the timer");
      console.log(timer)
    }else if (!isButtonsActive && isTimerStopped && !isRunning && timer !== 0) {
        setIsMissedItDisabled(true);
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
        const email = storedUserDetails ? storedUserDetails.email : '';
  
        try {
          await axios.post('http://127.0.0.1:80/update_puzzle_started_inschool', {
            email,
            category,
            title,
            puzzle_no: `Puzzle${puzzle_number}`,
            option_guessed: true,
            timer:timer,
            score: 1
          });
          console.log('Puzzle status updated successfully');
          setCongratulationsVisible(true); // Show the congratulations message
        } catch (error) {
          console.error('Error updating puzzle status:', error);
        }
      }
      else {
        alert("Please stop the timer to select");
      }
     
  };
  
  const handleMissedIt = async () => {
    console.log("ss",isButtonsActive,isTimerStopped,isRunning)
    if (timer == 0) { // Check if timer is not stopped
      alert("Please start the timer");
      console.log(timer)
    }else if (!isButtonsActive && isTimerStopped && !isRunning && timer !== 0) {
      setIsGotItRightDisabled(true);
      
      
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
        const email = storedUserDetails ? storedUserDetails.email : '';

      try {
        await axios.post('http://127.0.0.1:80/update_puzzle_started_inschool', {
          email,
          category,
          title,
          puzzle_no: `Puzzle${puzzle_number}`,
          score: 0,
          timer:timer,
          option_guessed: false
        });
        console.log('Puzzle status updated successfully');
        setShowMissedItPopup(true);
        
      } catch (error) {
        console.error('Error updating puzzle status:', error);
      }
    }
    else {
      alert("Please stop the timer to select");
    }
   
};

  const closeMissedItPopup = () => {
    setShowMissedItPopup(false); // Hide the "Missed It" popup
  };

  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Category</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{level}</td>
              <td>{category}</td>
              <td>{title}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="puzzle-content">
        <div className="chessboard">
          {imageSrc ? (
            <img src={imageSrc} alt="Chessboard" />
          ) : (
            <p>Loading image...</p>
          )}
          <div className="move-indicator">
            {solutions.length > 0 ? solutions[0].move : 'Loading move...'}
          </div>
        </div>
        <div className="puzzle-info">
        <div className="response-buttons1">
  <h2>Puzzle {puzzle_number}</h2>
  <button className="timer-btn" onClick={handleStartStopTimer}>
    {isRunning ? 'Stop Timer' : 'Start Timer'}
    <div className="timer-display">
      {formatTime(timer)}
    </div>
  </button>

  {/* Conditionally render the Solution button only if there's a solution */}
  {solutions.length > 0 && solutions[0].solution && (
    <button className="solution-btn" onClick={handleShowSolution}>
      Solution
    </button>
  )}

  {solutions.length > 0 && solutions[0].sid_link && (
    <button className="ask-sid-btn" onClick={handleShowSidLink}>
      Ask Sid
    </button>
  )}
</div>


          {puzzleBlocked==null && (
            <div className="response-buttons">
              <h1>Response</h1>
              <button className='correct-btn' onClick={handleGotItRight} disabled={isGotItRightDisabled} > Got It Right </button>
<button className='incorrect-btn' onClick={handleMissedIt} disabled={isMissedItDisabled} > Missed It </button>
 
            </div>
          )}
           {puzzleBlocked!=null && (
            <div className="response-buttons">
             <button className="correct-btn">Puzzle already attempted.</button>
          
            </div>
          )}
          <div className="navigation-buttons">
              <button className="nav-btn" onClick={handleGoBack}>Go Back To Arena</button>

              </div>
        </div>
        
      </div>
      {congratulationsVisible ? ( // Conditional rendering based on puzzleBlocked value
      <div className="congratulations-message">
          <p>Hurray, you got it right! Your score is added.</p>
          <button className="congratulations-btn" onClick={() => setCongratulationsVisible(false)}>
            OK
        </button>
      </div>
      ) : (
        <p></p> // Show this message if puzzleBlocked is not null
      )}
      {showSolutionPopup && solutions.length > 0 && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{solutions[0].solution}</p>
            <button className="close-popup-btn" onClick={closeSolutionPopup}>
              Close
              </button>
          </div>
        </div>
      )}
      {showMissedItPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Oh no! Keep practicing.</p>
            <button className="close-popup-btn" onClick={closeMissedItPopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InsidePuzzleArena = () => (
  <Suspense fallback={<div>Loading puzzle data...</div>}>
    <PuzzlePageContent />
  </Suspense>
);

export default withAuth(InsidePuzzleArena);
