"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Admin.scss'; // Import the optimized SCSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Session } from '../types/types';
import { FormData } from '../types/types';
import withadminAuth from '@/app/withadminAuth';


const Admin: React.FC = () => {
  const initialFormData: FormData = {
    date: null,
    hour: '12',
    minute: '00',
    period: 'AM',
    coach_name: '',
    session_link: ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionAdded, setSessionAdded] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://backend-dev-chess.vercel.app/sessions');
        setSessions(response.data[0].sessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [sessionAdded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      date
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const formattedData = formatFormData(formData);

      const response = await axios.post('https://backend-dev-chess.vercel.app/add-session', formattedData);
      console.log('Session added successfully:', response.data);

      setFormData(initialFormData);
      setSessionAdded(prev => !prev); // Toggle sessionAdded state to force re-render
    } catch (error) {
      console.error('Error adding session:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSession = async (date: string, time: string) => {
    try {
      const data = {
        date,
        time
      };

      const response = await axios.delete('https://backend-dev-chess.vercel.app/del-sessions', { data });
      console.log('Session deleted successfully:', response.data);

      setSessions(prevSessions => prevSessions.filter(session => session.date !== date || session.time !== time));
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const validateForm = (data: FormData) => {
    let errors: Partial<FormData> = {};

    if (!data.session_link.trim()) {
      errors.session_link = 'Session Link is required';
    } else if (!isValidUrl(data.session_link)) {
      errors.session_link = 'Invalid Session Link';
    }

    return errors;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const formatFormData = (data: FormData) => {
    return {
      date: data.date ? formatDate(data.date) : '',
      time: `${data.hour}:${data.minute}${data.period}`,
      coach_name: data.coach_name,
      session_link: data.session_link
    };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB'); // Adjust locale if needed
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
      <div className="admin-container">
        <h2>Add Session</h2>
        <div className="admin-content">
          <div className="add-session">
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date:</label>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Date"
                  className={`form-control ${formErrors.date && 'is-invalid'}`}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <div className="time-inputs">
                  <select
                    name="hour"
                    value={formData.hour}
                    onChange={handleChange}
                    className={`form-control ${formErrors.hour && 'is-invalid'}`}
                    required
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  :
                  <select
                    name="minute"
                    value={formData.minute}
                    onChange={handleChange}
                    className={`form-control ${formErrors.minute && 'is-invalid'}`}
                    required
                  >
                    <option value="00">00</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                  <select
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    className={`form-control ${formErrors.period && 'is-invalid'}`}
                    required
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                {formErrors.hour && <div className="invalid-feedback">{formErrors.hour}</div>}
                {formErrors.minute && <div className="invalid-feedback">{formErrors.minute}</div>}
                {formErrors.period && <div className="invalid-feedback">{formErrors.period}</div>}
              </div>
              <div className="form-group">
                <label>Coach Name:</label>
                <input
                  type="text"
                  name="coach_name"
                  value={formData.coach_name}
                  onChange={handleChange}
                  className={`form-control ${formErrors.coach_name && 'is-invalid'}`}
                  required
                />
                {formErrors.coach_name && <div className="invalid-feedback">{formErrors.coach_name}</div>}
              </div>
              <div className="form-group">
                <label>Session Link:</label>
                <input
                  type="text"
                  name="session_link"
                  value={formData.session_link}
                  onChange={handleChange}
                  className={`form-control ${formErrors.session_link && 'is-invalid'}`}
                  required
                />
                {formErrors.session_link && <div className="invalid-feedback">{formErrors.session_link}</div>}
              </div>
              <button type="submit" className={`button ${submitting && 'disabled'}`} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Session'}
              </button>
            </form>
          </div>
          <div className="session-list">
            <h2>Sessions List</h2>
            {loading ? (
              <p>Loading sessions...</p>
            ) : (
              sessions.map(session => (
                <div key={`${session.date}-${session.time}`} className="session-box">
                  <div className="session-details">
                    <p>Date: {session.date}</p>
                    <p>Time: {session.time}</p>
                    <p>Coach: {session.coach_name}</p>
                  </div>
                  <div className="session-link">
                    <a href={session.session_link} target="_blank" rel="noopener noreferrer">
                      Join Session
                    </a>
                  </div>
                  <button className="delete-button" onClick={() => handleDeleteSession(session.date, session.time)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withadminAuth(Admin);
