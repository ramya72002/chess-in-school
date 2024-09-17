import React from 'react';
import './Loading.scss'; // Import the SCSS file specific to the loading component

const Loading = () => {
  return (
    <div className="loading-container">
      <img src="/images/loading.gif" alt="Loading..." className="loading-gif" />
    </div>
  );
};

export default Loading;
