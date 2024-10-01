"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaPuzzlePiece, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import './side.scss';
import { UserDetails } from './types/types';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);
  const [profilePic, setProfilePic] = useState('/images/portal/b4.png');
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (typeof window !== 'undefined') {
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;

        if (storedUserDetails && storedUserDetails.image) {
          setProfilePic(storedUserDetails.image);
          setUserDetails(storedUserDetails);
        }

        const email = storedUserDetails?.email ?? 'default@example.com';

        try {
          if (email) {
            const response = await axios.get(`https://backend-chess-tau.vercel.app/getinschooldetails?email=${email}`);
            setUserDetails(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const changeProfilePic = async (newPic: string) => {
    try {
      setProfilePic(newPic);
      setShowAvatarOptions(false);
      if (typeof window !== 'undefined') {
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;

        if (!storedUserDetails) {
          throw new Error('User details not found in localStorage');
        }

        const data = {
          profile_id: storedUserDetails.profile_id,
          image: newPic,
        };

        const response = await axios.post('https://backend-chess-tau.vercel.app/imageupdateinschool', data);
        if (response.data.success) {
          const updatedUserDetails = { ...storedUserDetails, image: newPic };
          localStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
          setUserDetails(updatedUserDetails);
        } else {
          console.error('Failed to update profile picture:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const girlAvatars = [
    '/images/portal/g1.png',
    '/images/portal/g2.png',
    '/images/portal/g3.png',
    '/images/portal/g4.png',
    '/images/portal/g5.png',
    '/images/portal/g6.png',
    '/images/portal/g7.png',
    '/images/portal/g8.png',
    '/images/portal/g9.png',
  ];

  const boyAvatars = [
    '/images/portal/b1.png',
    '/images/portal/b2.png',
    '/images/portal/b3.png',
    '/images/portal/b4.png',
    '/images/portal/b5.png',
    '/images/portal/b6.png',
    '/images/portal/b7.png',
    '/images/portal/b8.png',
    '/images/portal/b9.png',
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="profile">
        <div className="avatarContainer" onClick={() => setShowAvatarOptions(true)}>
          <Image src={profilePic} alt="Profile Picture" width={200} height={200} className="avatar" />
        </div>
        <div className="role">{userDetails?.child_name?.first}</div>
        <button onClick={() => router.push('/portalhome')} className="viewProfile">
          Home
        </button>
      </div>

      <nav className="nav">
        <a
          onClick={() => {
            if (userDetails) {
              const level = userDetails.level;
              if (level === "Level 1") router.push("/Afterschool1");
              else if (level === "Level 2") router.push("/Afterschool2");
              else if (level === "Level 3") router.push("/Afterschool3");
              else if (level === "Level 4") router.push("/Afterschool4");
              else if (level === "Level 5") router.push("/Afterschool5");
              else if (level === "Level 6") router.push("/Afterschool6");
            }
          }}
          className="navItem school"
        >
          <FaCalendarAlt /> Learning
        </a>
        <a href="/arena/puzzleArena" className="navItem teachers">
          <FaPuzzlePiece /> Puzzle Arena
        </a>
        <a onClick={async () => {
          // Handle sign out logic here
          const email = localStorage.getItem('email');
          if (email) {
            try {
              await axios.post('https://backend-chess-tau.vercel.app/delete_session_inschool', { email });
              localStorage.clear();
              router.push('/');
            } catch (error) {
              console.error('Error during sign out:', error);
            }
          } else {
            localStorage.clear();
            router.push('/');
          }
        }} className="navItem logout">
          <FaSignOutAlt /> Logout
        </a>
      </nav>

      {showAvatarOptions && (
        <div className="avatarModal">
          <div className="modalContent">
            <button className="closeButton" onClick={() => setShowAvatarOptions(false)}>X</button>
            <p>Select Profile Picture:</p>
            <div className="avatarTabs">
              <div className="avatarTab">
                <h3>Girls</h3>
                <div className="avatarList">
                  {girlAvatars.map((avatar, index) => (
                    <div key={index} className="avatarOption" onClick={() => changeProfilePic(avatar)}>
                      <Image src={avatar} alt={`Girl Avatar ${index}`} width={60} height={60} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="avatarTab">
                <h3>Boys</h3>
                <div className="avatarList">
                  {boyAvatars.map((avatar, index) => (
                    <div key={index} className="avatarOption" onClick={() => changeProfilePic(avatar)}>
                      <Image src={avatar} alt={`Boy Avatar ${index}`} width={60} height={60} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
