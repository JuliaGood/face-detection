import React from "react";

const Rank = (props) => { 
  const { currentUser, currentCount } = props;
  console.log("currentCount in Rank ", currentUser);

  return (
    <div>
      <p className="white f3">
        {`${currentUser.name}, your total number of detected faces is: ${currentUser.totalCount}`} 
      </p>
      <p className="white f3">
        {`There are ${currentCount} faces in the current image.`} 
      </p>
    </div>
  );
}

export default Rank;
