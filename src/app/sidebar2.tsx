import React, { useState } from "react";
import "./side2.scss";
import { useRouter } from "next/navigation";

const topics = [
  {
    title: "1. Chess Openings",
    completed: true,
    submodules: [
      { title: "a.Opening Principles", completed: true },
      { title: "b.White Opening", completed: true },
      { title: "c.Black Opening", completed: true }
    ]
  },
  {
    title: "2. Tactics and Calculations - Level 1",
    completed: true,
    submodules: [
      { title: "a.Pins", completed: true },
      { title: "b.Forks", completed: true },
      { title: "c.Skewers", completed: true }
    ]
  },
  {
    title: "3. Tactics and Calculations - Level 2",
    completed: true,
    submodules: [
      { title: "a.Double Attack", completed: true },
      { title: "b.Removal of Defender", completed: true },
      { title: "c.Deflection", completed: true }
    ]
  },
  {
    title: "4. Tactics and Calculations - Level 3",
    completed: true,
    submodules: [
      { title: "a.Decoy", completed: true },
      { title: "b.Overloading", completed: true },
      { title: "c.X-Ray attack", completed: true }
    ]
  },
  {
    title: "5. Tactics and Calculations - Level 5",
    completed: true,
    submodules: [
      { title: "a.Zwischenzug (Intermezzo):", completed: true },
      { title: "b.Desperado", completed: true },
      { title: "c.Interference", completed: true }
    ]
  },
  {
    title: "6. Positional Calculations",
    completed: true,
    submodules: [
      { title: "a.Pawn Structures", completed: true },
      { title: "b.Piece Activity", completed: true },
      { title: "c.Manoeuvring", completed: true }
    ]
  },
  {
    title: "7. Strategy & Planning",
    completed: true,
    submodules: [
      { title: "a.Pawn breaks", completed: true },
      { title: "b.Weak squares", completed: true },
      { title: "c.Piece coordination", completed: true }
    ]
  },
  {
    title: "8. Checkmates - Introduction",
    completed: true,
    submodules: [
      { title: "a.Mate in 1", completed: true },
      { title: "b.Mate in 2", completed: true },
      { title: "c.Back Rank Tactics", completed: true }
    ]
  },
  {
    title: "9. Checkmate Patterns",
    completed: true,
    submodules: [
      { title: "a.Anastasia’s Mate", completed: true },
      { title: "b.Back Rank Mate", completed: true },
      { title: "c.Blackburne’s Mate", completed: true },
      { title: "d.Box Mate (Rook Mate)", completed: true },
      { title: "e.Fool's Mate", completed: true },
      { title: "f.Morphy's Mate", completed: true },
      { title: "g.Scholar's Mate", completed: true },
      { title: "h.Smothered Mate", completed: true }
    ]
  },
  {
    title: "10. Game Analysis",
    completed: true,
    submodules: [
      { title: "Game Analysis", completed: true }
    ]
  },
  {
    title: "11.Chess Study Plan",
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

  const handleGoBack = () => router.push('/learning');

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
