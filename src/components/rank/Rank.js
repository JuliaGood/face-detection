import React from 'react';
import './Rank.css';

const Rank = (props) => {
  const {currentUser} = props;
  return (
    <div>
      <p className="white f3">
        {`${currentUser.name}, your current rank is #number`}
      </p>
    </div>
  );
}

export default Rank;
