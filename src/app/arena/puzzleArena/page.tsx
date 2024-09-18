'use client';
import React, { useEffect, useState } from 'react';
import './puzzleArena.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserDetails } from '../../types/types';
import Arenaresult from '@/app/Arenaresult';
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
  const [livePuzzles, setLivePuzzles] = useState<Puzzle[]>([]);
  const [practicePuzzles, setPracticePuzzles] = useState<Puzzle[]>([]);
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryClick = (category: React.SetStateAction<string | null>) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false); // Close dropdown after selecting a category
  };

  const handleFilterClick = (filter: React.SetStateAction<string>) => {
    setSelectedFilter(filter);
    setCurrentIndex(0); // Reset pagination to the first page when the filter changes
    setIsDropdownOpen(false); // Close dropdown after selecting a filter
  };
  
  



  const filteredPuzzles = practicePuzzles.filter((puzzle) => {
    return (
      (selectedCategory ? puzzle.category === selectedCategory : true) &&
      (selectedFilter === 'All' || puzzle.statusFlag === selectedFilter)
    );
  });

  const handleNextClick = () => {
    if (currentIndex + itemsPerPage < filteredPuzzles.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const handlePrevClick = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };


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
                'http://127.0.0.1:80/calculate_scores',
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

              const response = await axios.get(
                `http://127.0.0.1:80/get_level?level=${levelMapping[storedUserDetails.level]}`
              );
              const data = response.data;

              if (data.image_sets && Array.isArray(data.image_sets)) {
                const fetchPuzzles = async (liveStatus: string) => {
                  return Promise.all(
                    data.image_sets
                      .filter((item: { live: string }) => item.live === liveStatus)
                      .map(async (item: Puzzle) => {
                        try {
                          const arenaUserResponse = await axios.get(
                            'http://127.0.0.1:80/get_Arena_user_inschool',
                            {
                              params: {
                                email: storedUserDetails.email,
                                category: item.category,
                                title: item.title,
                                date_time: item.date_time,
                                file_ids: item.file_ids || {},
                              },
                            }
                          );

                          let statusFlag = 'Not Started';

                          if (arenaUserResponse.data.success) {
                            const puzzleArena = arenaUserResponse.data.puzzleArena;

                            const isStarted = Object.values(puzzleArena).some(
                              (puzzle: any) => puzzle.option_guessed !== null
                            );
                            const isCompleted = Object.values(puzzleArena).every(
                              (puzzle: any) =>
                                puzzle.option_guessed !== null
                            );
                            const isInProgress = Object.values(puzzleArena).some(
                              (puzzle: any) =>
                                puzzle.option_guessed !== null && puzzle.started
                            );

                            if (isCompleted) {
                              statusFlag = 'Completed';
                            } else if (isInProgress) {
                              statusFlag = 'In Progress';
                            } else if (isStarted) {
                              statusFlag = 'Started';
                            }
                          }

                          console.log(item.title, arenaUserResponse, statusFlag);

                          const total_title_category_score =
                            arenaUserResponse.data.success
                              ? Object.values(arenaUserResponse.data.puzzleArena).reduce(
                                  (total: number, puzzle: any) => total + puzzle.score,
                                  0
                                )
                              : 0;

                          return {
                            ...item,
                            total_title_category_score,
                            statusFlag,
                          };
                        } catch (error) {
                          console.error(
                            `Error fetching arena data for ${liveStatus} puzzle ${item.title}:`,
                            error
                          );
                          return {
                            ...item,
                            total_title_category_score: 0,
                            statusFlag: 'Not Started',
                          };
                        }
                      })
                  );
                };

                const livePuzzlesList = await fetchPuzzles('Yes');
                const practicePuzzlesList = await fetchPuzzles('No');

                setLivePuzzles(livePuzzlesList);
                setPracticePuzzles(practicePuzzlesList);
              } else {
                setError('Unexpected data structure received from the server.');
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
  const handleButtonClick = async (
    title: string,
    category: string,
    date_time: string,
    puzzle_no: number,
    score: string,
    index: number
  ) => {
    setLoading((prevLoading) => ({ ...prevLoading, [index]: true }));
    const userDetailsString = localStorage.getItem('userDetails');
    const storedUserDetails = userDetailsString
      ? JSON.parse(userDetailsString)
      : null;
    const email = storedUserDetails.email;
    if (email) {
      try {
        const createArenaApiUrl =
          'http://127.0.0.1:80/create_Arena_user';
        const imagesApiUrl = `http://127.0.0.1:80/images/title?level=${encodeURIComponent(
          levelMapping[storedUserDetails.level]
        )}&category=${encodeURIComponent(
          category
        )}&title=${encodeURIComponent(title)}`;

        const createArenaResponse = await axios.post(createArenaApiUrl, {
          email,
          category,
          title,
          puzzle_no,
        });

        if (createArenaResponse.data.success) {
          const imagesResponse = await axios.get(imagesApiUrl);

          router.push(
            `/arena/startArena?title=${encodeURIComponent(
              title
            )}&level=${encodeURIComponent(
              levelMapping[storedUserDetails.level]
            )}&category=${encodeURIComponent(
              category
            )}&date_time=${encodeURIComponent(
              date_time
            )}&score=${encodeURIComponent(score)}`
          );
        } else {
          setError('Failed to create or update PuzzleArena. Please try again later.');
        }
      } catch (error) {
        console.error('Error during API calls:', error);
        setError('An error occurred while processing your request. Please try again later.');
      } finally {
        setLoading((prevLoading) => ({ ...prevLoading, [index]: false }));
      }
    }
  };

  const handleJoinClick = async (live_link: string) => {
    if (live_link) {
      window.open(live_link, '_blank');
    } else {
      alert('No link provided.');
    }
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
       

        <div className="bottom-section">
        <div className="theme-practice live-arena">
            <p>Live Arena</p>
            {livePuzzles.length > 0 ? (
              livePuzzles.map((puzzle, index) => (
                <div className="practice-item" key={index}>
                  <p>{puzzle.category}:{puzzle.title}</p>
                  <p>Date & Time: {puzzle.date_time}</p>
                  <p>Total Score: {puzzle.total_title_category_score}/{Object.keys(puzzle.file_ids || {}).length}</p>
                  <p className='loading-page'>
                    {loading[index] ? (
                      <button className="loading-button">Loading...</button>
                    ) : (
                      <>
                        <button
                        className="start-button"
                        onClick={() =>
                          handleButtonClick(
                            puzzle.title,
                            puzzle.category,
                            puzzle.date_time,
                            Object.keys(puzzle.file_ids || {}).length,
                            `${puzzle.total_title_category_score}/${Object.keys(puzzle.file_ids || {}).length}`,
                            index
                          )
                          }
                        >
                          View
                        </button>
                        <button
                          className="join-button"
                          onClick={() => handleJoinClick(puzzle.live_link)}
                        >
                          Join
                        </button>
                      </>
                    )}
                  </p>
                </div>
              ))
            ) : (
              <p>No Live Puzzles Available</p>
            )}
          </div>


          <div className="theme-practice">
  <div className="filter-container">
    <p>Theme Practice</p>
  </div>

  <div className="category-boxes">
    {['Opening', 'Middlegame', 'Endgame', 'Mixed'].map((category) => (
      <div
        key={category}
        className={`category-box ${category} ${selectedCategory === category ? 'active' : ''}`}
        onClick={() => handleCategoryClick(category)}
      >
        {category}
      </div>
    ))}

    {/* Move filter-dropdown here */}
    <div className="filter-dropdown">
      <button className={`filter-button ${isDropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
        Select
      </button>
      {isDropdownOpen && (
        <div className="filter-options">
          <p onClick={() => handleFilterClick('All')}>All</p>
          <p onClick={() => handleFilterClick('Not Started')}>Not Started</p>
          <p onClick={() => handleFilterClick('In Progress')}>In Progress</p>
          <p onClick={() => handleFilterClick('Completed')}>Completed</p>
        </div>
      )}
    </div>
  </div>

  {/* Remaining part of the component */}
  {filteredPuzzles.length > 0 ? (
    <>
      {filteredPuzzles.slice(currentIndex, currentIndex + itemsPerPage).map((puzzle, index) => (
        <div className="practice-item" key={index}>
          <p>{puzzle.category}: {puzzle.title}</p>
          <p>Date & Time: {puzzle.date_time}</p>
          <p>{puzzle.statusFlag}</p>
          <p>Total Score: {puzzle.total_title_category_score}/{Object.keys(puzzle.file_ids || {}).length}</p>
          <p className='loading-page'>
            {loading[index] ? (
              <button className="loading-button">Loading...</button>
            ) : (
              <button
                className='start-button'
                  onClick={() =>
                    handleButtonClick(
                      puzzle.title,
                      puzzle.category,
                      puzzle.date_time,
                    Object.keys(puzzle.file_ids || {}).length,
                    `${puzzle.total_title_category_score}/${Object.keys(puzzle.file_ids || {}).length}`,
                      index
                    )
                  }
                >
                View
                </button>
            )}
          </p>
              </div>
            ))}
      <div className="pagination-controls">
        {currentIndex > 0 && (
          <button className="prev-button" onClick={handlePrevClick}>Previous</button>
        )}
        {currentIndex + itemsPerPage < filteredPuzzles.length && (
          <button className="next-button" onClick={handleNextClick}>Next</button>
        )}
        </div>
    </>
  ) : (
    <p>No Practice Puzzles Available</p>
  )}
</div>
          {showArenaResult && <Arenaresult isOpen={showArenaResult} onClose={() => setShowArenaResult(false)} />}
 
        </div>
      </div>
    </div>
  );
};

export default withAuth(PuzzleArena);
