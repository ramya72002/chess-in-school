"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin_tournaments.scss';
import { Tournament } from '../../types/types';
import withadminAuth from '@/app/withadminAuth';


const AdminTournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTab, setActiveTab] = useState<string>('casual');
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get<{ tournaments: Tournament[] }[]>('https://backend-dev-chess.vercel.app/tournaments');
      console.log("Response data:", response.data);
      if (response.data.length > 0) {
        setTournaments(response.data[0].tournaments);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
  };

  const handleSave = async () => {
    if (editingTournament) {
      try {
        await axios.put('https://backend-dev-chess.vercel.app/update-tournament', {
          type: editingTournament.type,
          tournament: editingTournament,
        });
        setEditingTournament(null);
        fetchTournaments(); // Fetch updated tournaments after saving
      } catch (error) {
        console.error('Error updating tournament:', error);
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    if (editingTournament) {
      setEditingTournament({ ...editingTournament, [field]: value });
    }
  };

  const renderEditForm = () => {
    if (!editingTournament) return null;

    return (
      <div className="editForm">
        <h2>Edit Tournament</h2>
        <label>
          Type :
          <input
            type="text"
            value={editingTournament.type}
            onChange={(e) => handleChange('type', e.target.value)}
          />
        </label>
        <label>
          Name :
          <input
            type="text"
            value={editingTournament.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            value={editingTournament.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </label>
        <label>
          Time Control:
          <input
            type="text"
            value={editingTournament.timeControl}
            onChange={(e) => handleChange('timeControl', e.target.value)}
          />
        </label>
        <label>
          Upcoming Dates:
          <input
            type="text"
            value={editingTournament.upcomingDates.join(', ')}
            onChange={(e) => handleChange('upcomingDates', e.target.value.split(', '))}
          />
        </label>
        <label>
          Rounds Timing Description:
          <input
            type="text"
            value={editingTournament.roundsTiming.description}
            onChange={(e) => handleChange('roundsTiming', { ...editingTournament.roundsTiming, description: e.target.value })}
          />
        </label>
        {editingTournament.sections.map((section, index) => (
          <div key={index}>
            <label>
              Section Name:
              <input
                type="text"
                value={section.name}
                onChange={(e) => {
                  const newSections = [...editingTournament.sections];
                  newSections[index].name = e.target.value;
                  handleChange('sections', newSections);
                }}
              />
            </label>
            <label>
              Registration Fee:
              <input
                type="text"
                value={section.registrationFee}
                onChange={(e) => {
                  const newSections = [...editingTournament.sections];
                  newSections[index].registrationFee = e.target.value;
                  handleChange('sections', newSections);
                }}
              />
            </label>
          </div>
        ))}
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setEditingTournament(null)}>Cancel</button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={activeTab === 'casual' ? 'activeTab' : ''}
          onClick={() => setActiveTab('casual')}
        >
          Casual
        </button>
        <button
          className={activeTab === 'usfc_related' ? 'activeTab' : ''}
          onClick={() => setActiveTab('usfc_related')}
        >
          USFC Related
        </button>
      </div>
      <div className="tournamentsList">
        {tournaments.filter(tournament => tournament.type === activeTab).map((tournament, index) => (
          <div key={index} className="tournamentCard">
            <h3><strong>Type :</strong> {tournament.type}</h3>
            <h3><strong>Name :</strong> {tournament.name}</h3>
            <p><strong>Location :</strong> {tournament.location}</p>
            <p><strong>Time Control :</strong> {tournament.timeControl}</p>
            <p><strong>Upcoming Dates :</strong> {tournament.upcomingDates.join(', ')}</p>
            <div>
              <h4>Rounds Timing :</h4>
              <p><strong>Description :</strong> {tournament.roundsTiming.description}</p>
            </div>
            <div>
              <h4>Sections :</h4>
              {tournament.sections.map((section, index) => (
                <p key={index}>
                  <strong>{section.name} :</strong> {section.registrationFee}
                </p>
              ))}
            </div>
            <button className='button' onClick={() => handleEdit(tournament)}>Edit</button>
          </div>
        ))}
      </div>
      {renderEditForm()}
    </div>
  );
};

export default withadminAuth(AdminTournaments);
