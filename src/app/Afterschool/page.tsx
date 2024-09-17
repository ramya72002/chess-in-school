'use client';
import React from 'react';
import Image from 'next/image'; // Assuming you are using Next.js
import { useRouter } from 'next/navigation';
import withAuth from '../withAuth';
import './Afterschool.scss';

interface CoursePaths {
  [key: string]: string;
}

const coursePaths: CoursePaths = {
  'Basic Checkmates - 2': '/basic-checkmates-2/modules/m1',
  'Basics of Chess': '/modules/m1?afterschool=true',
  'Good Bishop Bad Bishop': '/good-bishop-bad-bishop/modules/m1',
  'Basic Checkmates': '/basic-checkmates/modules/m1',
  'Basic Checkmates - 3': '/basic-checkmates-2/modules/m1',
  'Basics of Chess 1': '/modules/m1?afterschool=true',
  'Basic Checkmates - 4': '/basic-checkmates-2/modules/m1',
  'Basics of Chess 2': '/modules/m1?afterschool=true',
  'Good Bishop Bad Bishop 1': '/good-bishop-bad-bishop/modules/m1'
};

// Define unique images for e
const courseImages: CoursePaths = {
  'Basic Checkmates - 2': '/images/1.png',
  'Basics of Chess': '/images/2.png',
  'Good Bishop Bad Bishop': '/images/3.png',
  'Basic Checkmates': '/images/4.png',
  'Basic Checkmates - 3': '/images/5.png',
  'Basics of Chess 1': '/images/6.png',
  'Basic Checkmates - 4': '/images/7.png',
  'Basics of Chess 2': '/images/8.png',
  'Good Bishop Bad Bishop 1': '/images/9.png'
};

const courseStyles: CoursePaths = {
  'Basic Checkmates - 2': 'recently-used',
  'Basics of Chess': 'shapes',
  'Good Bishop Bad Bishop': 'graphics',
  'Basic Checkmates': 'stickers'
};

const MyAccount = () => {
  const router = useRouter();

  const handleViewProgress = (courseTitle: string) => {
    const path = coursePaths[courseTitle];
    if (path) {
      router.push(path);
    } else {
      console.error('Path not found for course:', courseTitle);
    }
  };

  return (
    <div className="account-page">
      <header className="account-header">
        <h1 >Knight Learning Path</h1>
      </header>


      <section className="courses-section">
        {Object.entries(coursePaths).map(([course, path], index) => (
          <div key={index} className={`course-card ${courseStyles[course]}`}>
            <div className="course-image-container">
              <Image
                src={courseImages[course]} // Use unique images for each course
                alt={course}
                layout="fill"
                objectFit="contain"
                className="course-image"
              />
              <div className="image-overlay">
                <button
                  className="in-progress-button"
                  onClick={() => handleViewProgress(course)}
                >
                  In Progress
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
