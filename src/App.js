import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
import SignInForm from "./components/signInForm/SignInForm";
import RegisterForm from "./components/registerForm/RegisterForm";
import Rank from "./components/rank/Rank";
import ImageLinkInput from "./components/imageLinkInput/ImageLinkInput";
import FaceDetection from "./components/faceDetection/FaceDetection";
import Particles from "react-particles-js";

const particlesOptions = {
  particles: {
    number: {
      value: 20,
      density: {
        enable: true,
        value_area: 200,
      },
    },
    move: {
      speed: 1,
    }
  },
};

const clarifaiApiKey = '50fda2d5a7ee460b9b760b9b040ddc41';
const clarifaiFaceDetectionModelId = 'face-detection';
const clarifaiFaceDetectioModelVersion = '6dc7e46bc9124c5c8824be4822abe105';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: '',
      imageUrl: '',
      boxes: [], //point coordinates that we`ve received from response (in the boundingBox)
      route: 'register',
      isUserSignedIn: false,
      currentUser: {}, //signIned = logged user
      name: '',
      email: '', //name, email, pasword for FORM-inputs
      password: '',
      currentCount: 0, // how many faces have been detected in the img
    }
  }

  componentDidMount = () => {
    const signedInUser = localStorage.getItem("signedInUser");

    if (signedInUser && signedInUser.length) {
      const { email, password } = JSON.parse(signedInUser);
      const foundUser = this.getRegisteredUser().find((user) => email === user.email);
      
      if (foundUser && password === foundUser.password) {
        this.setState({ currentUser: {...foundUser}, isUserSignedIn: true });
        this.onRouteChange("home");
      }
    }
  }

  getRegisteredUser = () => {
    return localStorage.getItem("registeredUsers")
      ? JSON.parse(localStorage.getItem("registeredUsers"))
      : [];
  }

  calculateFaceLocation = (receivedData) => { //receivedData = that we`ve received from Clarifai`s response: boundingBox for now
    const inputImage = document.getElementById("inputImage");
    const imageWidth = Number(inputImage.width);
    const imageHeight = Number(inputImage.height);

    const boundingBoxes = receivedData.outputs[0].data.regions.map((region) => {
      const boundingBox = region.region_info.bounding_box;
      return { // the point coordinates = dots of boundingBox
        bottomRow: imageHeight - (boundingBox.bottom_row * imageHeight), //1
        leftCol: boundingBox.left_col * imageWidth, //2
        rightCol: imageWidth - (boundingBox.right_col * imageWidth), //3
        topRow: boundingBox.top_row * imageHeight, // 4
      }
    })
    return boundingBoxes;
  }

  displayFaceLocation = (boxesDots) => { // boxesDots = boundingBoxes
    const updateRegUsers = this.getRegisteredUser().map((user) => {
      if (user.email === this.state.currentUser.email) {
        user.totalCount = user.totalCount + boxesDots.length;
      }
      return user;
    });

    this.setState((prevState) => ({
      // prevState = this.state (currentState)
      boxes: boxesDots,
      currentCount: prevState.currentCount + boxesDots.length,
      currentUser: { ...prevState.currentUser, totalCount: prevState.currentUser.totalCount + boxesDots.length }
    }), () => {
      localStorage.setItem("registeredUsers", JSON.stringify(updateRegUsers));
    });
  }

  onInputChange = (event) => { //user`s input, image Url
    let inputValue = event.target.value
    console.log("user`s inputValue: ", inputValue)
    this.setState({ userInput: inputValue });
  }

  onDetectSubmit = () => {
    console.log("detect btn has cliked");
    this.setState({ imageUrl: this.state.userInput, currentCount: 0 });
    fetch(`https://api.clarifai.com/v2/models/${clarifaiFaceDetectionModelId}/versions/${clarifaiFaceDetectioModelVersion}/outputs`, {
      method: 'POST',
      body: JSON.stringify({
        inputs: [{
          data: {
            image: {
              url: this.state.userInput
            }
          }
        }]
      }),
      headers: {
        'Authorization': `Key ${clarifaiApiKey}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("clarifai`s response: ", data);
        this.displayFaceLocation(this.calculateFaceLocation(data));
      })
      .catch((error) => console.log(error))
  }

  onRouteChange = (ourRoute) => {
    if (ourRoute === "signout") {
      this.setState({ isUserSignedIn: false, imageUrl: '', boxes: [], currentCount: 0 });
      localStorage.removeItem("signedInUser");
    } else if (ourRoute === "home") {
      this.setState({ isUserSignedIn: true })
    }
    this.setState({ route: ourRoute });
  }

  //forms
  onInputFormChange = (event) => {
    const inputName = event.target.name; // name, email, password
    const inputValue = event.target.value;
    this.setState({ [inputName]: inputValue });
  }

  onRegisterSubmit = () => {
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      totalCount: 0, // total amount of detected faces for all time
    }
    const registeredUsers = this.getRegisteredUser();
    const isUserExisted = registeredUsers.find((user) => newUser.email === user.email);
    if (isUserExisted) {
      alert("this email already exists!")
    } else if (newUser.name.length < 3 || newUser.email.length < 3 || newUser.password.length < 3) {
      alert("all inputs must have 3 or more characters")
    } else {
      localStorage.setItem("registeredUsers", JSON.stringify([...registeredUsers, newUser]))
      this.setState({ name: '', email: '', password: '' });
      this.onRouteChange("signin");
    }
  }

  onSigninSubmit = () => {
    const { email, password } = this.state;
    const foundUser = this.getRegisteredUser().find((user) => email === user.email);
    if (foundUser && password === foundUser.password) {
      this.setState({ currentUser: { ...foundUser } }, () => {
        localStorage.setItem("signedInUser", JSON.stringify(foundUser));
        this.setState({ email: '', password: '' });
        this.onRouteChange("home");
      })
    } else {
      alert("Wrong email or password!");
    }
  }

  render() {
    return (
      <div className="app">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isUserSignedIn={this.state.isUserSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === "home"
          ? <div>
            <Rank
              currentUser={this.state.currentUser}
              currentCount={this.state.currentCount}
            />
            <ImageLinkInput
              onInputChange={this.onInputChange}
              onDetectSubmit={this.onDetectSubmit}
            />
            <FaceDetection
              imageUrl={this.state.imageUrl}
              boxes={this.state.boxes}
            />
          </div>
          : (this.state.route === "signin"
            ? <SignInForm
              onRouteChange={this.onRouteChange}
              onSigninSubmit={this.onSigninSubmit}
              onInputFormChange={this.onInputFormChange}
            />
            : <RegisterForm
              onRouteChange={this.onRouteChange}
              onRegisterSubmit={this.onRegisterSubmit}
              onInputFormChange={this.onInputFormChange}
            />
          )
        }
      </div>
    );
  }
}

export default App;
