import React from 'react';
import './FaceDetection.css';

const FaceDetection = (props) => { 
  const { imageUrl } = props;
  return (
    <div className="center">
      <div className="absolute pa4">
      <img 
        src={imageUrl} 
        alt='face-detection'
        width='550px'
        height='auto'
      />
      </div>
    </div>
  );
}

export default FaceDetection;
