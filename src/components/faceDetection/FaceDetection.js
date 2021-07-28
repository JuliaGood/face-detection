import React from 'react';
import './FaceDetection.css';

const FaceDetection = (props) => { 
  const { imageUrl, box } = props;
  console.log('box props in FaceDetection component: ', box);
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
        <div 
          className='bounding-box-style'
          style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}
        ></div>
      </div>
    </div>
  );
}

export default FaceDetection;
