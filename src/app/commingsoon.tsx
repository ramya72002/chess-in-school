"use client";
import React, { useEffect } from 'react';
import './commingsoon.scss'; // SCSS file for styling the modal

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

const Commingsoon: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scroll when modal is open
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scroll when modal is closed
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="closeButton" onClick={onClose}>X</button>
        <div className="modalBody">{content}</div>
      </div>
    </div>
  );
};

export default Commingsoon;
