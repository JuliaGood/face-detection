import React from "react";
import Logo from "../logo/Logo";
import "./Navigation.css";

const Navigation = (props) => { 
  const { onRouteChange, isUserSignedIn } = props;
  if(isUserSignedIn) {
    return (
      <nav className="nav-style nav-logo">
        <Logo/>
        <p 
          className="f3 link dim black pa3 pointer"
          onClick={() => onRouteChange("signout")}
        >Sign Out</p>
      </nav>
    );
  } else {
    return(
      <nav className="nav-style">
        <p 
          className="f3 link dim black pa3 pointer"
          onClick={() => onRouteChange("signin")}
        >Sign In</p>
        <p 
          className="f3 link dim black pa3 pointer"
          onClick={() => onRouteChange("register")}
        >Register</p>
      </nav>
    );
  }
}

export default Navigation;
