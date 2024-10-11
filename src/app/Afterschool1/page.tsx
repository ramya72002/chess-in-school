'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import withAuth from '../withAuth';
import './Afterschool1.scss';
import axios from 'axios';
import Loading from '../Loading';

interface CoursePaths {
  [key: string]: string;
}

const coursePaths: CoursePaths = {
  'theChessboard': '/modules/level1/introduction/11',
  'introductionToPieces': '/modules/level1/introductionToPieces/31',
  'ArrangnmentOfPieces': '/modules/level1/ArrangnmentOfPieces/41',
  'specialMoves': '/modules/level1/specialMoves/51',
  'winningInChess': '/modules/level1/winningInChess/61',
  'understandingPieceExchanges': '/modules/level1/understandingPieceExchanges/71',
  'stagesOfTheGame': '/modules/level1/stagesOfTheGame/81',
  'notation': '/modules/level1/notation/91',
  'chessGame': '/modules/level1/chessGame/101'

};

const courseImages: CoursePaths = {
  'theChessboard': '/images/level1/1.png',
  'introductionToPieces': '/images/level1/2.png',
  'ArrangnmentOfPieces': '/images/level1/3.png',
  'specialMoves': '/images/level1/4.png',
  'winningInChess': '/images/level1/5.png',
  'understandingPieceExchanges': '/images/level1/6.png',
  'stagesOfTheGame': '/images/level1/7.png',
  'notation': '/images/level1/8.png',
  'chessGame': '/images/level1/9.png'
};

interface CourseStatus {
  status: string;
  completed: number;
}

const MyAccount = () => {
  const router = useRouter();
  const [courseStatuses, setCourseStatuses] = useState<{ [key: string]: CourseStatus }>({});
  const [loading, setLoading] = useState(false); // Loading state

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
            const statuses = registeredCourses.reduce((acc: { [key: string]: CourseStatus }, course: { course_title: string, status: string, completed: number }) => {
              acc[course.course_title] = { status: course.status, completed: course.completed };
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
        setLoading(true);
        const userDetailsString = localStorage.getItem('userDetails');
        const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;

        if (storedUserDetails && storedUserDetails.email) {
          // Call API to update status to "In Progress" if the course is not completed
          if (courseStatuses[courseTitle]?.status !== 'Completed') {
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
                [courseTitle]: { ...prev[courseTitle], status: 'In Progress' }
              }));
            } else {
              console.error('Failed to update course status:', response.data.message);
            }
          }

            // Navigate to the course path
            router.push(path);
          }
        } catch (error) {
          console.error('Error updating course status:', error);
        } finally {
          setLoading(false);  // Hide loading animation
        }
      } else {
        console.error('Path not found for course:', courseTitle);
      }
    };

  return (
    <div className="account-page">
      {loading &&<Loading />}
      <header className="account-header">
        <h1>Pawn Learning Path</h1>
      </header>

      <section className="courses-section">
        {Object.entries(coursePaths).map(([course, path], index) => {
          const isPreviousCourseCompleted = index === 0 || courseStatuses[Object.keys(coursePaths)[index - 1]]?.completed === 100;
          const courseStatus = courseStatuses[course];

          // Update the logic here: both "In Progress" and "Completed" buttons should be clickable
          const isCurrentCourseClickable = (courseStatus?.status === 'In Progress' || courseStatus?.status === 'Completed') || isPreviousCourseCompleted;

          return (
            <div key={index}>
              <div className="course-image-container" onClick={() => handleViewProgress(course)}>
                <Image
                  src={courseImages[course]}
                  alt={course}
                  layout="fill"
                  objectFit="contain"
                  className="course-image"
                />
                <div className="image-overlay">
                  <div className="status-container">
                    <button
                      className={`status-button ${courseStatus?.status.replace(' ', '-') || 'Not-Started'}`}
                      onClick={() => handleViewProgress(course)}
                      disabled={!isCurrentCourseClickable}
                    >
                      {courseStatus?.status || 'Not Started'}
                    </button>
                    <button className="completion-button">
                      {courseStatus?.completed || 0}% Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default withAuth(MyAccount);
