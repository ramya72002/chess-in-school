'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './upcoming_activities.scss'; // Import the SCSS module directly
import { UpcomingActivity } from '../../types/types';
import withadminAuth from '@/app/withadminAuth';


const AdminUpcomingActivities = () => {
  // State for upcoming activities
  const [upcomingActivities, setUpcomingActivities] = useState<UpcomingActivity[]>([]);
  const [loading, setLoading] = useState(false);

  // State for form inputs
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Fetch existing activities on component mount
  useEffect(() => {
    fetchUpcomingActivities();
  }, []);

  const fetchUpcomingActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://backend-dev-chess.vercel.app/sessions');
      const data = response.data[0].upcoming_activities;
      setUpcomingActivities(data);
    } catch (error) {
      console.error('Error fetching Upcoming Activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleAddActivity = async () => {
    if (!title || !date || !time) {
      alert('All fields are required');
      return;
    }

    try {
      await axios.post('https://backend-dev-chess.vercel.app/add-upcomingActivities', {
        title,
        date,
        time,
      });
      setTitle('');
      setDate('');
      setTime('');
      await fetchUpcomingActivities();
    } catch (error) {
      console.error('Error adding Upcoming Activity:', error);
    }
  };

  // Handle delete activity with confirmation
  const handleDeleteActivity = async (activityToDelete: UpcomingActivity) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the activity "${activityToDelete.title}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete('https://backend-dev-chess.vercel.app/del-upcomingActivitiess', {
        data: {
          title: activityToDelete.title,
          date: activityToDelete.date,
          time: activityToDelete.time,
        },
      });
      await fetchUpcomingActivities();
    } catch (error) {
      console.error('Error deleting Upcoming Activity:', error);
    }
  };

  return (
    <div className="upcomingActivitiesContainer">
      {loading ? (
        <p className="loadingText">Loading...</p>
      ) : (
        <div>
          
          <div className="addActivityForm">
            <h3>Add Upcoming Activity</h3>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              placeholder="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <button className="addButton" onClick={handleAddActivity}>
              Add Upcoming Event
            </button>
          </div>
          <h2 className="heading">Upcoming Activities</h2>
          <ul className="activityList">
            {upcomingActivities.length > 0 ? (
              upcomingActivities.map((activity, index) => (
                <li key={index} className="activityItem">
                  <div className="activityDetails">
                    <span>{activity.title}</span>
                    <span>{activity.date}</span>
                    <span>{activity.time}</span>
                  </div>
                  <button
                    className="deleteButton"
                    onClick={() => handleDeleteActivity(activity)}
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p className="noActivities">No upcoming activities available.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default withadminAuth(AdminUpcomingActivities);
