/* eslint-disable react/no-unescaped-entities */
'use client';

import React, {useState } from 'react';
import './portal1.scss';
import withAuth from '../withAuth';

const Hero1 = () => {
  const [expanded, setExpanded] = useState(false);

 

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const isMobile = () => {
    return window.innerWidth <= 768; // Change this value based on your design requirements
  };
 
 

  return (
    
      <div className="journey">
        <div className="level">
          <h3>Level Details</h3>
          <div className="steps">
            <div className="step">
              <div className="icon">
                <img src="/images/characters/Pawn.png" alt="Pawn Icon" />
              </div>
              <div>
                <h4 >Level 1: Pawn (Absolute Beginners)</h4>
                <p className={`level-description ${expanded ? 'expanded' : ''}`}>
                  In chess, the journey starts with the humble pawn. At this foundational level, you’ll begin by learning the basic rules of the game, understanding how each piece moves, and grasping the concept of check and checkmate. You'll also be introduced to opening principles like controlling the center and developing your pieces. By the end of the Pawn level, you'll have a solid understanding of the board and be ready to play your first games.
                </p>
                {isMobile() && (
                  <button onClick={toggleExpand}>
                    {expanded ? 'Show Less' : 'Learn More'}
                  </button>
                )}
              </div>
            </div>
            <div className="step">
              <div className="icon">
              <img src="/images/characters/Knight.png" alt="knight Icon" />              </div>
              <div>
              <h4>Level 2: Knight (Novice Players)</h4>
              <p className={`level-description ${expanded ? 'expanded' : ''}`}>
              <p>Now that you've mastered the basics, it's time to step into the shoes of the agile knight. At this level, we’ll focus on more advanced piece coordination and basic tactics like forks, pins, and skewers. You’ll learn the importance of mobility and positioning, as well as how to plan your moves ahead. By the end of the Knight level, you'll be ready to tackle more competitive games and begin recognizing key tactical opportunities.</p>
              </p>
                {isMobile() && (
                  <button onClick={toggleExpand}>
                    {expanded ? 'Show Less' : 'Learn More'}
                  </button>
                )}
              </div>
            </div>
            <div className="step">
              <div className="icon">
              <img src="/images/characters/Archer bishop.png" alt="bishop Icon" />
              </div>
              <div>
              <h4>Level 3: Bishop (Intermediate Players)</h4>
              <p className={`level-description ${expanded ? 'expanded' : ''}`}>
              <p>In the Bishop level, players will refine their understanding of the game by focusing on strategy and planning. This level introduces advanced concepts such as controlling diagonals, piece exchanges, and improving board vision. You’ll also dive into more complex tactics, including double attacks and discovered checks. By mastering this level, you will develop the ability to think several moves ahead and begin constructing more strategic play.</p>
              </p>
                {isMobile() && (
                  <button onClick={toggleExpand}>
                    {expanded ? 'Show Less' : 'Learn More'}
                  </button>
                )}
              </div>
            </div>
            <div className="step">
              <div className="icon">
              <img src="/images/characters/Rook.png" alt="Rook Icon" />
              </div>
              <div>
              <h4>Level 4: Rook (Advanced Players)</h4>                <p className={`level-description ${expanded ? 'expanded' : ''}`}>
              <p>As you enter the Rook level, you are now ready to build a solid understanding of endgames, positional play, and deeper strategic concepts. We will focus on controlling open files, using rooks effectively, and mastering common endgame techniques. You’ll also begin analyzing games more critically, improving your decision-making under pressure. By the end of the Rook level, you’ll be proficient at both attacking and defending in various positions.</p>
              </p>
                {isMobile() && (
                  <button onClick={toggleExpand}>
                    {expanded ? 'Show Less' : 'Learn More'}
                  </button>
                )}
              </div>
            </div>
            <div className="step">
              <div className="icon">
              <img src="/images/characters/Worrior Queen.png" alt="Queen Icon" />
              </div>
              <div>
              <h4>Level 5: Queen (Expert Players)</h4>
              <p className={`level-description ${expanded ? 'expanded' : ''}`}>
              <p>The Queen is the most powerful piece, and at this level, you will gain a commanding presence on the board. This stage emphasizes mastering the art of attack and defense, opening theory, and deep positional understanding. Players will delve into complex combinations, advanced sacrifices, and learn how to capitalize on imbalances in material and position. By the end of this level, you’ll have the tools to dominate most games and prepare for high-level competition.</p>
              </p>
                {isMobile() && (
                  <button onClick={toggleExpand}>
                    {expanded ? 'Show Less' : 'Learn More'}
                  </button>
                )}
              </div>
            </div>
 
            <div className="step">
              <div className="icon">
              <img src="/images/characters/King.png" alt="King Icon" />
              </div>
              <div>
              <h4>Level 6: King (Mastery Level)</h4>
              <p className={`level-description ${expanded ? 'expanded' : ''}`}>
              <p>Reaching the King level signifies mastery of the game. Here, you’ll polish your overall chess knowledge, combining everything you've learned from openings, middlegames, and endgames. You will focus on advanced strategic play, game preparation, and studying famous grandmaster games. At this level, you’ll learn how to navigate high-level competitions, optimize time management, and approach chess with a grandmaster mindset. The King level will turn you into a well-rounded expert, ready to excel at the highest levels of the game.</p>
              </p>
                {isMobile() && (
                  <button onClick={toggleExpand}>
                    {expanded ? 'Show Less' : 'Learn More'}
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
