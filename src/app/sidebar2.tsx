import React, { useState } from "react";
import "./side2.scss";
import { useRouter } from "next/navigation";

const topics = [
  {
    title: "1. Chess Openings",
    completed: true,
    submodules: [
      { title: "1.1 Opening Principles", completed: true },
      { title: "1.2 White Opening", completed: true },
      { title: "1.3 Black Opening", completed: true }
    ]
  },
  {
    title: "2. Tactics [1]",
    completed: true,
    submodules: [
      { title: "2.1 Pins", completed: true },
      { title: "2.2 Forks", completed: true },
      { title: "2.3 Skewers", completed: true },
      { title: "2.4 Double Attack", completed: true },
      { title: "2.5 Remove of Defender", completed: true },
      { title: "2.6 DEflection", completed: true }
    ]
  },
  {
    title: "3. Tactics [2]",
    completed: true,
    submodules: [
      { title: "Decoy", completed: true },
      { title: "Overloading", completed: true },
      { title: "X-Ray attack", completed: true },
      { title: "Zwischenzug (Intermezzo):", completed: true },
      { title: "Desperado", completed: true },
      { title: "Interference", completed: true },
      { title: "Back Rank Tactics", completed: true }
    ]
  },
  {
    title: "4. Positional Calculations",
    completed: true,
    submodules: [
      { title: "Middlegame: Art of Calculation", completed: true },
      { title: "Pawn Structures", completed: true },
      { title: "Piece Activity", completed: true },
      { title: "Manoeuvring", completed: true }
    ]
  },
  {
    title: "5. Strategy & Planning",
    completed: true,
    submodules: [
      { title: "Pawn breaks", completed: true },
      { title: "Weak squares", completed: true },
      { title: "Piece coordination", completed: true }
    ]
  },
  {
    title: "6. Checks & Checkmates",
    completed: true,
    submodules: [
      { title: "Mate in 1", completed: true },
      { title: "Mate in 2", completed: true }
    ]
  },
  {
    title: "7. Chackmate Patterns",
    completed: true,
    submodules: [
      { title: "Anastasia’s Mate", completed: true },
      { title: "Back Rank Mate", completed: true },
      { title: "Blackburne’s Mate", completed: true },
      { title: "Box Mate (Rook Mate)", completed: true },
      { title: "Fool's Mate", completed: true },
      { title: "Morphy's Mate", completed: true },
      { title: "Scholar's Mate", completed: true },
      { title: "Smothered Mate", completed: true }
    ]
  },
  {
    title: "8. Game Analysis",
    completed: true,
    submodules: [
      { title: "Game Analysis", completed: true }
    ]
  },
  {
    title: "9. Chess Study Plan",
    completed: true,
    submodules: [
      { title: "Chess Study Plan", completed: true }
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
    if (title === "a.Opening Principles") {
      router.push("/modules/m1");
    } else if (title === "b.White Opening") {
      router.push("/modules/m2");
    } else if (title === "c.Black Opening") {
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
            <span>Learn Chess</span>
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
