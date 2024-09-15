import React, { useState } from 'react';
import ModelViewer from './ModelViewer3D';

const ImportPage: React.FC = () => {
  const [isModelViewerVisible, setModelViewerVisible] = useState(false);

  const handleViewClick = () => {
    setModelViewerVisible(true);
  };

  const handleCloseClick = () => {
    setModelViewerVisible(false);
  };

  return (
    <div>
        <button onClick={handleViewClick}>View your scan</button>
        {isModelViewerVisible && (
        <div style={floatingWindowStyle}>
            <button onClick={handleCloseClick} style={closeButtonStyle}>Close</button>
            <ModelViewer />
        </div>
        )}
    </div>
  );
};

const floatingWindowStyle: React.CSSProperties = {
    backgroundColor: 'lightgrey',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    width: '50%',
    height: '50%',
};

const closeButtonStyle: React.CSSProperties = {
  top: '10px',
  right: '10px',
};

export default ImportPage;