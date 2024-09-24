/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./side2.scss";
import { useRouter } from "next/navigation";

// Updated topics structure with new data
const topics = [
    {
      title: "1. Introduction",
      completed: true,
      submodules: [{ title: "1.1 Introduction", completed: true }]
    },
    {
      title: "2. The Chessboard",
      completed: true,
      submodules: [
        { title: "2.1 Board Set-up", completed: true },
        { title: "2.2 Letters & Numbers", completed: true },
        { title: "2.3 Understanding ‘File’", completed: true },
        { title: "2.4 Understanding ‘Rank’", completed: true },
        { title: "2.5 Understanding ‘Diagonals’", completed: true },
        { title: "2.6 Name of the Squares", completed: true }
      ]
    },
    {
      title: "3. Introduction to Pieces",
      completed: true,
      submodules: [
        { title: "3.1 Know the pieces", completed: true },
        { title: "3.2 ‘Major’ and ‘Minor’ Pieces", completed: true },
        { title: "3.3 Understanding the ‘King’", completed: true },
        { title: "3.4 Understanding the ‘Bishop’", completed: true },
        { title: "3.5 Understanding the ‘Rook’", completed: true },
        { title: "3.6 Understanding the ‘Knight’", completed: true },
        { title: "3.7 Understanding the ‘Pawn’", completed: true },
        { title: "3.8 Understanding the ‘Queen’", completed: true }
      ]
    },
    {
      title: "4. Arrangnment of Pieces",
      completed: true,
      submodules: [
        { title: "4.1 Light Side", completed: true },
        { title: "4.2 Dark Side", completed: true }
      ]
    },
    {
      title: "5. Special Moves",
      completed: true,
      submodules: [
        { title: "5.1 Castling", completed: true },
        { title: "5.2 Promotion", completed: true },
        { title: "5.3 En-passant", completed: true }
      ]
    },
    {
      title: "6. Winning in Chess (CCA)",
      completed: true,
      submodules: [
        { title: "6.1 Checkmate", completed: true },
        { title: "6.2 Checks", completed: true },
        { title: "6.3 Stalemate", completed: true },
        { title: "6.4 Attack & Defense", completed: true },
        { title: "6.5 Capture", completed: true },
        { title: "6.6 Draw", completed: true }
      ]
    },
    {
      title: "7. Understanding Piece Exchanges",
      completed: true,
      submodules: [
        { title: "7.1 Fair Trade", completed: true },
        { title: "7.2 Exchange Up", completed: true },
        { title: "7.3 Exchange Down", completed: true },
        { title: "7.4 Material Up", completed: true },
        { title: "7.5 Material Down", completed: true }
      ]
    },
    {
      title: "8. 3 Stages of the Game: Opening, Middlegame and Endgame",
      completed: true,
      submodules: [
        { title: "8.1 Opening", completed: true },
        { title: "8.2 Middlegame", completed: true },
        { title: "8.3 Endgame", completed: true }
      ]
    },
    {
      title: "9. Notation",
      completed: true,
      submodules: [{ title: "9.1 Notation", completed: true }]
    },
    {
      title: "10. Chess Game",
      completed: true,
      submodules: [{ title: "10.1 Chess Game", completed: true }]
    }
  ];
  
  
const Sidebar1: React.FC = () => {
  const router = useRouter();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [userCourses, setUserCourses] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false); // Add state for alert
  useEffect(() => {
    const fetchUserCourses = async () => {
      const userDetailsString = localStorage.getItem('userDetails');
      const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
      const email = storedUserDetails ? storedUserDetails.email : '';

      if (email) {
        try {
          const response = await axios.get(`https://backend-chess-tau.vercel.app/getinschooldetails?email=${email}`);

        const data = response.data;
        console.log("pp", data["data"]["registered_inschool_courses"]);

        // Check if registered_inschool_courses exists and is an array
        if (data && data["data"] && Array.isArray(data["data"]["registered_inschool_courses"])) {
          const courseTitles = data["data"]["registered_inschool_courses"]
            .map((course: { course_title: string }) => course.course_title.trim().toLowerCase());
          setUserCourses(courseTitles);
          console.log("pp", userCourses);
        } else {
          console.error("Data is not available or registered_inschool_courses is not an array");
          setUserCourses([]);
        }
      } catch (error) {
        console.error("Error fetching user courses:", error);
        setUserCourses([]);
      }
    }};

    fetchUserCourses();
  }, []);

  useEffect(() => {
    console.log("User Courses after setting:", userCourses);
  }, [userCourses]);

  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);

  const handleGoBack = () => router.push('/Afterschool1');

  const handleSubmoduleClick = (title: string) => {
  const submodulePaths: Record<string, string> = {
            "1.1 Introduction": "/modules/level1/introduction/11",
            "2.1 Board Set-up": "/modules/level1/theChessboard/21",
            "2.2 Letters & Numbers": "/modules/level1/theChessboard/22",
            "2.3 Understanding ‘File’": "/modules/level1/theChessboard/23",
            "2.4 Understanding ‘Rank’": "/modules/level1/theChessboard/24",
            "2.5 Understanding ‘Diagonals’": "/modules/level1/theChessboard/25",
            "2.6 Name of the Squares": "/modules/level1/theChessboard/26",
            "3.1 Know the pieces": "/modules/level1/introductionToPieces/31",
            "3.2 ‘Major’ and ‘Minor’ Pieces": "/modules/level1/introductionToPieces/32",
            "3.3 Understanding the ‘King’": "/modules/level1/introductionToPieces/33",
            "3.4 Understanding the ‘Bishop’": "/modules/level1/introductionToPieces/34",
            "3.5 Understanding the ‘Rook’": "/modules/level1/introductionToPieces/35",
            "3.6 Understanding the ‘Knight’": "/modules/level1/introductionToPieces/36",
            "3.7 Understanding the ‘Pawn’": "/modules/level1/introductionToPieces/37",
            "3.8 Understanding the ‘Queen’": "/modules/level1/introductionToPieces/38",
            "4.1 Light Side": "/modules/level1/ArrangnmentOfPieces/41",
            "4.2 Dark Side": "/modules/level1/ArrangnmentOfPieces/42",
            "5.1 Castling": "/modules/level1/specialMoves/51",
            "5.2 Promotion": "/modules/level1/specialMoves/52",
            "5.3 En-passant": "/modules/level1/specialMoves/53",
            "6.1 Checkmate": "/modules/level1/winningInChess/61",
            "6.2 Checks": "/modules/level1/winningInChess/62",
            "6.3 Stalemate": "/modules/level1/winningInChess/63",
            "6.4 Attack & Defense": "/modules/level1/winningInChess/64",
            "6.5 Capture": "/modules/level1/winningInChess/65",
            "6.6 Draw": "/modules/level1/winningInChess/66",
            "7.1 Fair Trade": "/modules/level1/understandingPieceExchanges/71",
            "7.2 Exchange Up": "/modules/level1/understandingPieceExchanges/72",
            "7.3 Exchange Down": "/modules/level1/understandingPieceExchanges/73",
            "7.4 Material Up": "/modules/level1/understandingPieceExchanges/74",
            "7.5 Material Down": "/modules/level1/understandingPieceExchanges/75",
            "8.1 Opening": "/modules/level1/stagesOfTheGame/81",
            "8.2 Middlegame": "/modules/level1/stagesOfTheGame/82",
            "8.3 Endgame": "/modules/level1/stagesOfTheGame/83",
            "9.1 Notation": "/modules/level1/notation/91",
            "10.1 Chess Game": "/modules/level1/chessGame/101"
          
    };

    const submoduleTitles = Object.keys(submodulePaths);
    if (submoduleTitles.includes(title) && isAccessible(title)) {
      const path = submodulePaths[title];
      router.push(path);
    } else {
      setShowAlert(true); // Show alert popup  
    }
      };
      const closeAlert = () => setShowAlert(false); // Close the alert popup


  const isAccessible = (title: string) => {
    if (title.startsWith("1.")) {
      return userCourses.includes("introduction");
    } else if (title.startsWith("2.")) {
      return userCourses.includes("theChessboard");
    } else if (title.startsWith("3.")) {
      return userCourses.includes("introductionToPieces");
    } else if (title.startsWith("4.")) {
      return userCourses.includes("ArrangnmentOfPieces");
    } else if (title.startsWith("5.")) {
      return userCourses.includes("specialMoves");
    } else if (title.startsWith("6.")) {
      return userCourses.includes("winningInChess");
    } else if (title.startsWith("7.")) {
      return userCourses.includes("understandingPieceExchanges");
    } else if (title.startsWith("8.")) {
      return userCourses.includes("stagesOfTheGame");
    } else if (title.startsWith("9.")) {
      return userCourses.includes("notation");
    }else if (title.startsWith("10.")) {
        return userCourses.includes("chessGame");
    }
    return false;
  };

  return (
    <div className={`course-content ${isSidebarMinimized ? "minimized" : ""}`}>
      <div className="header">
        {!isSidebarMinimized && (
          <button className="go-back-button" onClick={handleGoBack}>
            Go Back
          </button>
        )}
        <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarMinimized ? ">" : "<"}
        </button>
      </div>
      {!isSidebarMinimized && (
        <div className="module">
          <div className="module-header">
            <span>Pawn Level</span>
            <span className="progress">
              <span className="topics-count">{topics.length} Topics</span>
            </span>
          </div>
          <div className="topics">
            {topics.map((topic, index) => (
              <div
                className={`topic ${topic.completed ? "completed" : ""}`}
                key={index}
              >
                <div>
                  <span className="title">{topic.title}</span>
                </div>
                <div className="submodules">
                  {topic.submodules.map((submodule, subIndex) => (
                    <div
                      className={`submodule ${submodule.completed ? "completed" : ""}`}
                      key={subIndex}
                      onClick={() => handleSubmoduleClick(submodule.title)}
                    >
                      <span className={`icon ${submodule.completed ? "check" : ""}`}></span>
                      <span className="title">{submodule.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
     {showAlert && (
  <div className="alert-popup">
    <div className="alert-content">
      <h2>Module Access Restricted</h2>
      <p>It looks like you've made great progress! To continue, please complete the previous modules to unlock this one.</p>
      <button className="close-button" onClick={closeAlert}>Got It</button>
    </div>
  </div>
)}

    </div>
  );
};

export default Sidebar1;
