import React from "react";
import "./ImageLinkInput.css";

const ImageLinkInput = (props) => {
  const { onInputChange, onDetectSubmit } = props;
  
  return (
    <div>
      <p className="black f4">
        {"This Magic App will detect faces in your pictures. Give it a try."}
      </p>
      <div className="center"> 
        <div className="link-form center pa4 br3 shadow-5">
          <input 
            className="f4 pa2 w-70 center" 
            type="text"
            onChange={onInputChange}
          />
          <button 
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple bw0"
            onClick={onDetectSubmit}
          >Detect</button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkInput;
