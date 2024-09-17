import React, { useState } from "react";
import "./side2.scss";
import { useRouter } from "next/navigation";

const topics = [
  {
    title: "1. Introduction",
    completed: true,
    submodules: [
      { title: "1.1 Introduction", completed: true },
    ]
  },
  {
    title: "2. The Chessboard",
    completed: true,
    submodules: [
      { title: "2.1 Board Set-up", completed: true },
      { title: "2.2 Letters & Numbers", completed: true },
      { title: "2.3 Understanding 'File'", completed: true },
      { title: "2.4 Understanding 'Rank'", completed: true },
      { title: "2.5 Understanding 'Diagonals'", completed: true },
      { title: "2.6 Name of the Squares", completed: true }
    ]
  },
  {
    title: "3. Introduction to Pieces",
    completed: true,
    submodules: [
      { title: "3.1 Know the Pieces", completed: true },
      { title: "3.2 'Major' and 'Minor' Pieces", completed: true },
      { title: "3.3 Understanding the ‘King’", completed: true },
      { title: "3.4 Understanding the ‘Bishop’", completed: true },
      { title: "3.5 Understanding the 'Rook’", completed: true },
      { title: "3.6 Understanding the ‘Knight’", completed: true },
      { title: "3.7 Understanding the ‘Pawn’", completed: true },
      { title: "3.8 Understanding the ‘Queen’", completed: true }
    ]
  },
  {
    title: "4. Arraignment of Pieces",
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
    title: "6. Winning in Chess",
    completed: true,
    submodules: [
      { title: "6.1 Checkmate", completed: true },
      { title: "6.2 Checks", completed: true },
      { title: "6.3 Stalemate", completed: true },
      { title: "6.4 Principles of Attacking", completed: true },
      { title: "6.5 Art of Attacking – Capture", completed: true },
      { title: "6.6  Draw", completed: true }
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
      { title: "7.5 Material Down", completed: true },
    ]
  },
  {
    title: "8. Let’s Start Playing 3 Stages of the Game: Opening, Middlegame and Endgam",
    completed: true,
    submodules: [
      { title: "8.1 Opening", completed: true },
      { title: "8.2 Middlegame", completed: true },
      { title: "8.3 Endgame", completed: true }
    ]
  },
  {
    title: "9. Understanding Notations",
    completed: true,
    submodules: [
      { title: "9.1 Understanding Notations", completed: true }
    ]
  },
  {
    title: "10. Chess Game: Let’s study a game",
    completed: true,
    submodules: [
      { title: "10.1 Chess Game: Let’s study a game", completed: true }
    ]
  }
  // Other modules...
];

const Sidebar2: React.FC = () => {
  const router = useRouter();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);

  const handleGoBack = () => router.push('/Afterschool');

  const handleSubmoduleClick = (title: string) => {
    if (title === "1.1 Chessboard and Pieces Overview") {
      router.push("/modules/m1");
    } else if (title === "1.2 Basic Chess Rules") {
      router.push("/modules/m2");
    } else if (title === "1.3 Chess Notation Basics") {
      router.push("/modules/m3");
    } else {
      const formattedSubmodule = title.toLowerCase().replace(/\s+/g, '-');
      router.push(`/level1Modules/${formattedSubmodule}`);
    }
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
            <span>Basics Of Chess</span>
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
    </div>
  );
};

export default Sidebar2;
