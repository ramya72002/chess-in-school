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
  'chessOpening': '/modules/level2/chessOpening/11',
  'tactics1': '/modules/level2/tactics1/21',
  'tactics2': '/modules/level2/tactics2/31',
  'positionalCalculations': '/modules/level2/positionalCalculations/41',
  'strategyAndPlanning': '/modules/level2/strategyAndPlanning/51',
  'checkAndCheckmates': '/modules/level2/checkAndCheckmates/61',
  'checkmatePatterns': '/modules/level2/checkmatePatterns/71',
  'gameAnalysis': '/modules/level2/gameAnalysis/81',
  'chessStudyPlan': '/modules/level2/chessStudyPlan/91'
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

interface CourseStatus {
  status: string;
  completed: number;
}

const MyAccount = () => {
  const router = useRouter();
  const [courseStatuses, setCourseStatuses] = useState<{ [key: string]: CourseStatus }>({});

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
      }
    } else {
      console.error('Path not found for course:', courseTitle);
    }
  };

  const handleCompleteCourse = async (courseTitle: string) => {
    try {
      const userDetailsString = localStorage.getItem('userDetails');
      const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;

      if (storedUserDetails && storedUserDetails.email) {
        // Call API to mark course as completed
        const response = await axios.post('https://backend-chess-tau.vercel.app/update_registered_courses_inschool', {
          email: storedUserDetails.email,
          course_title: courseTitle,
          status: 'Completed',
        });

        if (response.data.success) {
          console.log('Course marked as completed');

          // Update local status
          setCourseStatuses(prev => ({
            ...prev,
            [courseTitle]: { ...prev[courseTitle], status: 'Completed', completed: 100 }
          }));
        } else {
          console.error('Failed to mark course as completed:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error marking course as completed:', error);
    }
  };

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>Knight Learning Path</h1>
      </header>

      <section className="courses-section">
        {Object.entries(coursePaths).map(([course, path], index) => {
          const isPreviousCourseCompleted = index === 0 || courseStatuses[Object.keys(coursePaths)[index - 1]]?.completed === 100;
          const courseStatus = courseStatuses[course];

          // Update the logic here: both "In Progress" and "Completed" buttons should be clickable
          const isCurrentCourseClickable = (courseStatus?.status === 'In Progress' || courseStatus?.status === 'Completed') || isPreviousCourseCompleted;

          return (
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
