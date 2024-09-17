"use client";
import React, { useEffect, useState } from 'react';
import './learning.scss';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UserDetails } from '../types/types';
import withAuth from '../withAuth';

// Define the course paths
const coursePaths: { [key: string]: string } = {
  'Basic Checkmates - 2': '/basic-checkmates-2/modules/m1',
  'Basics of Chess': '/modules/m1',
  'Good Bishop Bad Bishop': '/good-bishop-bad-bishop/modules/m1',
  'Basic Checkmates': '/basic-checkmates/modules/m1'
};

// Define the course images
const courseImages: { [key: string]: string } = {
  'Basic Checkmates - 2': '/images/basic-checkmates-2.png',
  'Basics of Chess': '/images/basics-of-chess.png',
  'Good Bishop Bad Bishop': '/images/good-bishop-bad-bishop.png',
  'Basic Checkmates': '/images/basic-checkmates.png'
};

const MyAccount = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [registeredCourses, setRegisteredCourses] = useState<{ title: string; completed_percentage: number; payment_status: string }[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [courseWithPendingPayment, setCourseWithPendingPayment] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user details from localStorage
    const userDetailsString = localStorage.getItem('userDetails');
    const storedUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
    if (storedUserDetails) {
      setUserDetails(storedUserDetails);
    }

    // Fetch registered courses from the API
    const fetchRegisteredCourses = async () => {
      if (storedUserDetails) {
        try {
          const response = await axios.get(`https://backend-dev-chess.vercel.app/get-registered-courses?email=${storedUserDetails.email}`);
          if (response.status === 200) {
            const registeredCoursesData = response.data.registered_courses;
            setRegisteredCourses(registeredCoursesData);

            // Set available courses
            const allCourses = Object.keys(coursePaths);
            const registeredCourseTitles = registeredCoursesData.map((course: { title: string }) => course.title);
            const filteredCourses = allCourses.filter(course => !registeredCourseTitles.includes(course));
            setAvailableCourses(filteredCourses);
          }
        } catch (error) {
          console.error('Error fetching registered courses:', error);
        }
      }
    };

    fetchRegisteredCourses();
  }, []);

  const handleRegister = async (courseTitle: string) => {
    if (!userDetails || !userDetails.email) return;

    try {
      // Register for the course
      const registerResponse = await axios.post('https://backend-dev-chess.vercel.app/add-course', {
        email: userDetails.email,
        title: courseTitle,
      });

      if (registerResponse.status === 200) {
        const newCourse = { title: courseTitle, completed_percentage: 0, payment_status: 'Not started' };
        setRegisteredCourses((prevCourses) => [...prevCourses, newCourse]);
        setAvailableCourses((prevCourses) => prevCourses.filter(course => course !== courseTitle));
        setCourseWithPendingPayment(courseTitle);

        // Send registration confirmation email
        const emailResponse = await axios.post('https://backend-dev-chess.vercel.app/send_course_reg_email', {
          email: userDetails.email,
          title: courseTitle,
        });

        if (emailResponse.status === 200) {
          console.log('Confirmation email sent successfully');
        } else {
          console.error('Error sending confirmation email:', emailResponse.data);
        }
      }
    } catch (error) {
      console.error('Error registering for course or sending email:', error);
    }
  };

  const handleCheckPaymentStatus = async (courseTitle: string) => {
    if (!userDetails || !userDetails.email) return;

    try {
      const response = await axios.get(`https://backend-dev-chess.vercel.app/check-email?email=${userDetails.email}`);

      if (response.data.success) {
        // Update payment status in the backend
        try {
          await axios.put('https://backend-dev-chess.vercel.app/update-payment-status', {
            email: userDetails.email,
            title: courseTitle,
            payment_status: 'Completed'
          });

          // Update the local state
          setRegisteredCourses((prevCourses) =>
            prevCourses.map(course =>
              course.title === courseTitle
                ? { ...course, payment_status: 'Completed' }
                : course
            )
          );
          setCourseWithPendingPayment(null);
        } catch (updateError) {
          console.error('Error updating payment status:', updateError);
          alert('An error occurred while updating payment status.');
        }
      } else {
        alert('Payment not completed yet. Please try again later.');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      alert('An error occurred while checking payment status.');
    }
  };

  const handleViewProgress = (courseTitle: string) => {
    const path = coursePaths[courseTitle];
    if (path) {
      router.push(path);
    } else {
      console.error('Path not found for course:', courseTitle);
    }
  };

  const isRegistered = (courseTitle: string) => registeredCourses.some(course => course.title === courseTitle);

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>My Learning</h1>
      </header>

      <section className="courses-section">
        <div className="courses-header">
          <h3>Registered Courses</h3>
        </div>

        {registeredCourses.map((course, index) => (
          <div key={index} className="course-card">
            <img src={courseImages[course.title]} alt={course.title} className="course-image" />
            <div className="course-info">
              <div className="course-status">
                <h4>{course.title}</h4>
                {course.payment_status === 'Completed' ? (
                  <button
                    className="progress"
                    style={{ backgroundColor: 'red' }}
                    onClick={() => handleViewProgress(course.title)}
                  >
                    In Progress
                  </button>
                ) : course.payment_status === 'Not started' ? (
                  <button
                    className="check-payment"
                    onClick={() => handleCheckPaymentStatus(course.title)}
                  >
                    Check Payment Status
                  </button>
                ) : null}
              </div>
              <div className="progress-bar">
                <div className="progress-completed" style={{ width: `${course.completed_percentage}%` }}></div>
              </div>
              <p className="completed-steps">{course.completed_percentage}% COMPLETE</p>
            </div>
          </div>
        ))}

        <div className="courses-header">
          <h3>Available Courses</h3>
        </div>
        <div className="available-courses">
        {availableCourses.map((course, index) => (
          <div key={index} className="course-card">
            <img src={courseImages[course]} alt={course} className="course-image" />
            <div className="course-info">
              <div className="course-status">
                <h4>{course}</h4>
                <button
                  className={`progress ${isRegistered(course) ? 'registered' : ''}`}
                  style={{ backgroundColor: isRegistered(course) ? 'gray' : 'blue' }}
                  onClick={() => handleRegister(course)}
                  disabled={isRegistered(course)}
                >
                  {isRegistered(course) ? 'Registered' : 'Register'}
                </button>
              </div>
              {/* <div className="progress-bar">
                <div className="progress-completed" style={{ width: isRegistered(course) ? '100%' : '0%' }}></div>
              </div>
              <p className="completed-steps">{isRegistered(course) ? '100%' : '0%'} COMPLETE</p> */}
            </div>
          </div>
        ))}
        </div>
      </section>
    </div>
  );
};

export default withAuth(MyAccount);
