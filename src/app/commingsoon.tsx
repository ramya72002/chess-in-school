"use client";
import React from 'react';
import './commingsoon.scss'; // SCSS file for styling the modal

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

const Commingsoon: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>X</button>
        <div className="modalBody">{content}</div>
      </div>
    </div>
  );
};

export default Commingsoon;
