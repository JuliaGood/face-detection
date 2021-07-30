import React from 'react';
import './Rank.css';

const Rank = (props) => { 
  const {currentUser, currentCount } = props;
  console.log('currentCount in Rank ', currentUser);
  return (
    <div>
      <p className="white f3">
        {`${currentUser.name}, your total amount of detected faces is: ${currentUser.totalCount}`} 
      </p>
      <p className="white f3">
        {`Current amount of detected faces is: ${currentCount}`} 
      </p>
    </div>
  );
}

export default Rank;
