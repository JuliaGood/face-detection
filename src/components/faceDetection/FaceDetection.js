import React from 'react';
import './FaceDetection.css';

const FaceDetection = (props) => { 
  const { imageUrl, boxes } = props;
  console.log('boxes', boxes);
  return (
    <div className="center">
      <div className="absolute ma4">
        <img 
          id='inputImage'
          src={imageUrl} 
          alt='detected-face'
          width='500px'
          height='auto'
        />
        {boxes.map((box, index) => (
          <div 
            className='bounding-box-style'
            key={index}
            style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}
          ></div>
        ))}

      </div>
    </div>
  );
}

export default FaceDetection;
