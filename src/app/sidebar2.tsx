import React, { useState } from "react";
import "./side2.scss";
import { useRouter } from "next/navigation";

const topics = [
  {
    title: "1. Chess Openings",
    completed: true,
    submodules: [
      { title: "1.1 Opening Principles", completed: true},
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
      { title: "2.6 Deflection", completed: true }
    ]
  },
  {
    title: "3. Tactics [2]",
    completed: true,
    submodules: [
      { title: "3.1 Decoy", completed: true },
      { title: "3.2 Overloading", completed: true },
      { title: "3.3 X-Ray attack", completed: true },
      { title: "3.4 Zwischenzug (Intermezzo):", completed: true },
      { title: "3.5 Desperado", completed: true },
      { title: "3.6 Interference", completed: true },
      { title: "3.7 Back Rank Tactics", completed: true }
    ]
  },
  {
    title: "4. Positional Calculations",
    completed: true,
    submodules: [
      { title: "4.1 Middlegame: Art of Calculation", completed: true },
      { title: "4.2 Pawn Structures", completed: true },
      { title: "4.3 Piece Activity", completed: true },
      { title: "4.4 Manoeuvring", completed: true }
    ]
  },
  {
    title: "5. Strategy & Planning",
    completed: true,
    submodules: [
      { title: "5.1 Pawn breaks", completed: true },
      { title: "5.2 Weak squares", completed: true },
      { title: "5.3 Piece coordination", completed: true }
    ]
  },
  {
    title: "6. Checks & Checkmates",
    completed: true,
    submodules: [
      { title: "6.1 Mate in 1", completed: true },
      { title: "6.2 Mate in 2", completed: true }
    ]
  },
  {
    title: "7. Chackmate Patterns",
    completed: true,
    submodules: [
      { title: "7.1 Anastasia’s Mate", completed: true },
      { title: "7.2 Back Rank Mate", completed: true },
      { title: "7.3 Blackburne’s Mate", completed: true },
      { title: "7.4 Box Mate (Rook Mate)", completed: true },
      { title: "7.5 Fool's Mate", completed: true },
      { title: "7.6 Morphy's Mate", completed: true },
      { title: "7.7 Scholar's Mate", completed: true },
      { title: "7.8 Smothered Mate", completed: true }
    ]
  },
  {
    title: "8. Game Analysis",
    completed: true,
    submodules: [
      { title: "8.1 Game Analysis", completed: true }
    ]
  },
  {
    title: "9. Chess Study Plan",
    completed: true,
    submodules: [
      { title: "9.1 Chess Study Plan", completed: true }
    ]
  }
];

const Sidebar2: React.FC = () => {
  const router = useRouter();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);

  const handleGoBack = () => router.push('/Afterschool');

  const handleSubmoduleClick = (title: string) => {
    const submodulePaths: Record<string, string> = {
      // Chess Openings
      "1.1 Opening Principles": "/modules/chessOpening/11",
      "1.2 White Opening": "/modules/chessOpening/12",
      "1.3 Black Opening": "/modules/chessOpening/13",
      
      // Tactics [1]
      "2.1 Pins": "/modules/tactics1/21",
      "2.2 Forks": "/modules/tactics1/22",
      "2.3 Skewers": "/modules/tactics1/23",
      "2.4 Double Attack": "/modules/tactics1/24",
      "2.5 Remove of Defender": "/modules/tactics1/25",
      "2.6 Deflection": "/modules/tactics1/26",
  
      // Tactics [2]
      "3.1 Decoy": "/modules/tactics2/31",
      "3.2 Overloading": "/modules/tactics2/32",
      "3.3 X-Ray attack": "/modules/tactics2/33",
      "3.4 Zwischenzug (Intermezzo)": "/modules/tactics2/34",
      "3.5 Desperado": "/modules/tactics2/35",
      "3.6 Interference": "/modules/tactics2/36",
      "3.7 Back Rank Tactics": "/modules/tactics2/37",
  
      // Positional Calculations
      "4.1 Middlegame: Art of Calculation": "/modules/positionalCalculations/41",
      "4.2 Pawn Structures": "/modules/positionalCalculations/42",
      "4.3 Piece Activity": "/modules/positionalCalculations/43",
      "4.4 Manoeuvring": "/modules/positionalCalculations/44",
  
      // Strategy & Planning
      "5.1 Pawn breaks": "/modules/strategyAndPlanning/51",
      "5.2 Weak squares": "/modules/strategyAndPlanning/52",
      "5.3 Piece coordination": "/modules/strategyAndPlanning/53",
  
      // Checks & Checkmates
      "6.1 Mate in 1": "/modules/checkAndCheckmates/61",
      "6.2 Mate in 2": "/modules/checkAndCheckmates/62",
  
      // Checkmate Patterns
      "7.1 Anastasia’s Mate": "/modules/checkmatePatterns/71",
      "7.2 Back Rank Mate": "/modules/checkmatePatterns/72",
      "7.3 Blackburne’s Mate": "/modules/checkmatePatterns/73",
      "7.4 Box Mate (Rook Mate)": "/modules/checkmatePatterns/74",
      "7.5 Fool's Mate": "/modules/checkmatePatterns/75",
      "7.6 Morphy's Mate": "/modules/checkmatePatterns/76",
      "7.7 Scholar's Mate": "/modules/checkmatePatterns/77",
      "7.8 Smothered Mate": "/modules/checkmatePatterns/78",
  
      // Game Analysis
      "8.1 Game Analysis": "/modules/gameAnalysis/81",
  
      // Chess Study Plan
      "9.1 Chess Study Plan": "/modules/chessStudyPlan/91"
    };
  
    const path = submodulePaths[title];
    if (path) {
      router.push(path);
    } else {
      console.error("Submodule path not found for:", title);
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
