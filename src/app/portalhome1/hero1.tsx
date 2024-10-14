/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import './portal1.scss';
import withAuth from '../withAuth';

const Hero1 = () => {
  // Define the keys for levels
  type LevelKeys = 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6';

  // State to track which levels are expanded
  const [expandedLevels, setExpandedLevels] = useState<Record<LevelKeys, boolean>>({
    level1: false,
    level2: false,
    level3: false,
    level4: false,
    level5: false,
    level6: false,
  });

  // Function to toggle the expand/collapse state for a specific level
  const toggleExpand = (level: LevelKeys) => {
    setExpandedLevels((prevState) => ({
      ...prevState,
      [level]: !prevState[level],
    }));
  };

  // Function to check if the current view is mobile
  const isMobile = () => {
    return window.innerWidth <= 768; // Adjust based on design requirements
  };

  return (
    <div className="journey">
      <div className="level">
        <h3>Level Details</h3>
        <div className="steps">
          {/* Level 1 */}
          <div className="step">
            <div className="icon">
              <img src="/images/characters/Pawn.png" alt="Pawn Icon" />
            </div>
            <div>
              <h4>Level 1: Pawn (Absolute Beginners)</h4>
              <p className={`level-description ${expandedLevels.level1 ? 'expanded' : ''}`}>
                In chess, the journey starts with the humble pawn. At this foundational level, you’ll begin by learning the basic rules of the game...
                {expandedLevels.level1 && (
                  <span>
                    {' '}Learn the different movements and captures for each piece, as well as how to checkmate your opponent with simple strategies.
                  </span>
                )}
              </p>
              {isMobile() && (
                <button onClick={() => toggleExpand('level1')}>
                  {expandedLevels.level1 ? 'Show Less' : 'Learn More'}
                </button>
              )}
            </div>
          </div>

          {/* Level 2 */}
          <div className="step">
            <div className="icon">
              <img src="/images/characters/Knight.png" alt="Knight Icon" />
            </div>
            <div>
              <h4>Level 2: Knight (Novice Players)</h4>
              <p className={`level-description ${expandedLevels.level2 ? 'expanded' : ''}`}>
                Now that you've mastered the basics, it's time to step into the shoes of the agile knight. At this level, we’ll focus on more advanced piece coordination...
                {expandedLevels.level2 && (
                  <span>
                    {' '}You'll learn to identify forks, pins, and how to develop your pieces effectively.
                  </span>
                )}
              </p>
              {isMobile() && (
                <button onClick={() => toggleExpand('level2')}>
                  {expandedLevels.level2 ? 'Show Less' : 'Learn More'}
                </button>
              )}
            </div>
          </div>

          {/* Level 3 */}
          <div className="step">
            <div className="icon">
              <img src="/images/characters/Archer bishop.png" alt="Bishop Icon" />
            </div>
            <div>
              <h4>Level 3: Bishop (Intermediate Players)</h4>
              <p className={`level-description ${expandedLevels.level3 ? 'expanded' : ''}`}>
                In the Bishop level, players will refine their understanding of the game by focusing on strategy and planning. This level introduces advanced concepts...
                {expandedLevels.level3 && (
                  <span>
                    {' '}like pawn structures, exchanging pieces for strategic advantages, and more.
                  </span>
                )}
              </p>
              {isMobile() && (
                <button onClick={() => toggleExpand('level3')}>
                  {expandedLevels.level3 ? 'Show Less' : 'Learn More'}
                </button>
              )}
            </div>
          </div>

          {/* Level 4 */}
          <div className="step">
            <div className="icon">
              <img src="/images/characters/Rook.png" alt="Rook Icon" />
            </div>
            <div>
              <h4>Level 4: Rook (Advanced Players)</h4>
              <p className={`level-description ${expandedLevels.level4 ? 'expanded' : ''}`}>
                As you enter the Rook level, you are now ready to build a solid understanding of endgames, positional play, and deeper strategic concepts...
                {expandedLevels.level4 && (
                  <span>
                    {' '}You'll learn the importance of open files, piece activity, and how to coordinate multiple pieces in complex positions.
                  </span>
                )}
              </p>
              {isMobile() && (
                <button onClick={() => toggleExpand('level4')}>
                  {expandedLevels.level4 ? 'Show Less' : 'Learn More'}
                </button>
              )}
            </div>
          </div>

          {/* Level 5 */}
          <div className="step">
            <div className="icon">
              <img src="/images/characters/Worrior Queen.png" alt="Queen Icon" />
            </div>
            <div>
              <h4>Level 5: Queen (Expert Players)</h4>
              <p className={`level-description ${expandedLevels.level5 ? 'expanded' : ''}`}>
                The Queen is the most powerful piece, and at this level, you will gain a commanding presence on the board. This stage emphasizes mastering the art of attack...
                {expandedLevels.level5 && (
                  <span>
                    {' '}You'll learn advanced tactics such as sacrificing material for long-term initiative and handling complex middlegame positions.
                  </span>
                )}
              </p>
              {isMobile() && (
                <button onClick={() => toggleExpand('level5')}>
                  {expandedLevels.level5 ? 'Show Less' : 'Learn More'}
                </button>
              )}
            </div>
          </div>

          {/* Level 6 */}
          <div className="step">
            <div className="icon">
              <img src="/images/characters/King.png" alt="King Icon" />
            </div>
            <div>
              <h4>Level 6: King (Mastery Level)</h4>
              <p className={`level-description ${expandedLevels.level6 ? 'expanded' : ''}`}>
                Reaching the King level signifies mastery of the game. Here, you’ll polish your overall chess knowledge, combining everything you've learned from openings...
                {expandedLevels.level6 && (
                  <span>
                    {' '}endgames, and middlegames to refine your style and achieve a high level of consistency in play.
                  </span>
                )}
              </p>
              {isMobile() && (
                <button onClick={() => toggleExpand('level6')}>
                  {expandedLevels.level6 ? 'Show Less' : 'Learn More'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Hero1);
