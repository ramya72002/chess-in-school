'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import withAuth from '../withAuth';
import './Afterschool.scss';
import axios from 'axios';

interface CoursePaths {
  [key: string]: string;
}

const coursePaths: CoursePaths = {
  'chessOpening': '/modules/chessOpening/11',
  'tactics1': '/modules/tactics1/11',
  'tactics2': '/modules/tactics2/11',
  'positionalCalculations': '/modules/positionalCalculations/11',
  'strategyAndPlanning': '/modules/strategyAndPlanning/11',
  'checkAndCheckmates': '/modules/checkAndCheckmates/11',
  'checkmatePatterns': '/modules/checkmatePatterns/11',
  'gameAnalysis': '/modules/gameAnalysis/11',
  'chessStudyPlan': '/modules/chessStudyPlan/11'
};

const courseImages: CoursePaths = {
  'chessOpening': '/images/1.png',
  'tactics1': '/images/2.png',
  'tactics2': '/images/3.png',
  'positionalCalculations': '/images/4.png',
  'strategyAndPlanning': '/images/5.png',
  'checkAndCheckmates': '/images/6.png',
  'checkmatePatterns': '/images/7.png',
  'gameAnalysis': '/images/8.png',
  'chessStudyPlan': '/images/9.png'
};

const MyAccount = () => {
  const router = useRouter();
  const [courseStatuses, setCourseStatuses] = useState<CoursePaths>({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetailsString = localStorage.getItem('userDetails');
      const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;

      if (storedUserDetails && storedUserDetails.email) {
        try {
          const response = await axios.get('https://backend-chess-tau.vercel.app/getinschooldetails', {
            params: { email: storedUserDetails.email }
          });

          if (response.data.success) {
            const registeredCourses = response.data.data.registered_inschool_courses;
            const statuses = registeredCourses.reduce((acc: CoursePaths, course: { course_title: string, status: string }) => {
              acc[course.course_title] = course.status;
              return acc;
            }, {});

            setCourseStatuses(statuses);
          } else {
            console.error('Failed to fetch user details:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleViewProgress = async (courseTitle: string) => {
    const path = coursePaths[courseTitle];
    if (path) {
      try {
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
  
        if (storedUserDetails && storedUserDetails.email) {
          // Call API to update status to "In Progress"
          const response = await axios.post('https://backend-chess-tau.vercel.app/update_registered_courses_inschool', {
            email: storedUserDetails.email,
            course_title: courseTitle,
            status: 'In Progress',
          });
  
          if (response.data.success) {
            console.log('Course status updated successfully');
            
            // Update local status
            setCourseStatuses(prev => ({
              ...prev,
              [courseTitle]: 'In Progress',
            }));
  
            // Navigate to the course path
            router.push(path);  // Always navigate regardless of status
          } else {
            console.error('Failed to update course status:', response.data.message);
          }
        }
      } catch (error) {
        console.error('Error updating course status:', error);
      }
    } else {
      console.error('Path not found for course:', courseTitle);
    }
  };
  

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>Knight Learning Path</h1>
      </header>

      <section className="courses-section">
        {Object.entries(coursePaths).map(([course, path], index) => (
          <div key={index}>
            <div className="course-image-container">
              <Image
                src={courseImages[course]}
                alt={course}
                layout="fill"
                objectFit="contain"
                className="course-image"
              />
              <div className="image-overlay">
              <button
                className={`status-button ${courseStatuses[course]?.replace(' ', '-') || 'Not-Started'}`}
                onClick={() => handleViewProgress(course)}
              >
                {courseStatuses[course] === 'In Progress' ? 'In Progress' : courseStatuses[course] === 'Completed' ? 'Completed' : 'Not Started'}
              </button>


              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default withAuth(MyAccount);
