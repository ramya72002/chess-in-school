'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './portal.scss';
import { UserDetails, UpcomingActivity } from '../types/types';
import Loading from '../Loading';
import withAuth from '../withAuth';

const Hero = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [upcomingActivities, setUpcomingActivities] = useState<UpcomingActivity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (typeof window !== 'undefined') {
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
        console.log("local",storedUserDetails)
        setUserDetails(storedUserDetails);

        try {
          const response = await axios.get(
            `https://backend-dev-chess.vercel.app/getuserdetails?email=${storedUserDetails.email}`
          );
          setUserDetails(response.data.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    const fetchUpcomingActivities = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://backend-dev-chess.vercel.app/sessions');
        setUpcomingActivities(response.data[0].upcoming_activities);
      } catch (error) {
        console.error('Error fetching Upcoming Activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchUpcomingActivities();
  }, []);

  const getActiveClass = (level: string) => {
    if (!userDetails) return '';

    const levelMap: { [key: string]: number } = {
      level1: 1,
      level2: 2,
      level3: 3,
      level4: 4,
      level5: 5,
      level6: 6,
    };

    const userLevel = levelMap[userDetails.level];
    const currentLevel = levelMap[level];

    return currentLevel <= userLevel ? 'active' : 'inactive';
  };

  if (!userDetails) {
    // If userDetails is null, return null to prevent rendering the page
    return null;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="hero">
        <div className="header">
          <h2>
            Chess Journey of <span>{userDetails.name}</span>
          </h2>
        </div>

      <div className="journey-container">
        <div className="chess-journey">
          <div className="level">
            <svg className="connector" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 10" preserveAspectRatio="none">
              <line x1="0" y1="5" x2="1000" y2="5" stroke="white" strokeWidth="5"/>
            </svg>
            <div className={`step ${getActiveClass('level1')}`}>
            <div className="icon pawn">♟</div>              <p>Pawn</p>
              <p>(Beginner)</p>
            </div>
            <div className={`step ${getActiveClass('level2')}`}>
              <div className="icon knight">♞</div>
              <p>Knight</p>
              <p>(Intermediate)</p>
            </div>
            <div className={`step ${getActiveClass('level3')}`}>
              <div className="icon bishop">♝</div>
              <p>Bishop</p>
              <p>(Proficient)</p>
            </div>
            <div className={`step ${getActiveClass('level4')}`}>
              <div className="icon rook">♜</div>
              <p>Rook</p>
              <p>(Advanced)</p>
            </div>
            <div className={`step ${getActiveClass('level5')}`}>
              <div className="icon queen">♛</div>
              <p>Queen</p>
              <p>(Expert)</p>
            </div>
            <div className={`step ${getActiveClass('level6')}`}>
              <div className="icon king">♔</div>
              <p>King</p>
              <p>(Master)</p>
            </div>
          </div>
        </div>

        <div className="journey">
          <div className="level">
            <h3>Level Details</h3>
            <div className="steps">
              <div className="step">
                <div className="icon">♟</div>
                <div>
                  <h4>1. Pawn</h4>
                  <p>Players who are preparing for casual tournaments and need to refine their middlegame tactics and overall strategy.</p>
                </div>
              </div>
              <div className="step">
                <div className="icon">♞</div>
                <div>
                  <h4>2. Knight</h4>
                  <p>Players who are competing in club-rated tournaments and need to focus on game analysis and improving their overall play.</p>
                </div>
              </div>
              <div className="step">
                <div className="icon">♝</div>
                <div>
                  <h4>3. Bishop</h4>
                  <p>Players who have some tournament experience and need to learn advanced endgames, opening responses, and notation.</p>
                </div>
              </div>
              <div className="step">
                <div className="icon">♜</div>
                <div>
                  <h4>4. Rook</h4>
                  <p>Players who are preparing for regional tournaments and need to work on tournament preparation and advanced strategies.</p>
                </div>
              </div>
              <div className="step">
                <div className="icon">♛</div>
                <div>
                  <h4>5. Queen</h4>
                  <p>Players who are ready for professional tournaments and need to refine advanced strategies and compete at a higher level.</p>
                </div>
              </div>
              <div className="step">
                <div className="icon">♔</div>
                <div>
                  <h4>6. King</h4>
                  <p>Players who need professional training from titled coaches like International Masters (IM) and Grand Masters (GM).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
    </div>
  );
};

export default withAuth(Hero);
