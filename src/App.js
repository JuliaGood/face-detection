import React, {Component} from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import SignInForm from './components/signInForm/SignInForm';
import RegisterForm from './components/registerForm/RegisterForm';
import Logo from './components/logo/Logo';
import ImageLinkInput from './components/imageLinkInput/ImageLinkInput';
import FaceDetection from './components/faceDetection/FaceDetection';
import Rank from './components/rank/Rank';
import Particles from "react-particles-js";
const Clarifai = require('clarifai'); //clarifai is using common js ES5
// but we can use 'import-from' ES6 because we use 'create-reat-app'
// import Clarifai from 'clarifai';

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

const app = new Clarifai.App({
  apiKey: 'a57180e7e2914b3586f31b7e92ae4149' // my API key
 });

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: '',
      imageUrl: '',
      boxes: [], //point coordinates that we`ve received from response (in the boundingBox)
      route: 'register',
      isUserSignedIn: false,
      registeredUsers: [], //storage of USERS {name, email, password}
      currentUser:{}, //signIned = logged user
      name: '',
      email: '', //name, email, pasword for FROM
      password: '',
      currentCount: 0, // how many faces have been detected in the img
    }
  }

  calculateFaceLocation = (receivedData) => { //receivedData = that we`ve received from Clarifai`s response: boundingBox for now
    //const boundingBox = receivedData.outputs[0].data.regions[0].region_info.bounding_box;
    const inputImage = document.getElementById('inputImage');
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

  displayFaceLocation = (boxesDots) => {
    const updateRegUsers = this.state.registeredUsers.map((user) => { 
      if (user.email === this.state.currentUser.email) {
        user.totalCount = user.totalCount + 1;
      }
      return user;
    });
    
    this.setState((prevState) => ({ 
      // prevState = this.state (currentState)
      boxes: boxesDots, 
      currentCount: prevState.currentCount + 1,
      registeredUsers: updateRegUsers,
      currentUser: {...prevState.currentUser, totalCount : prevState.currentUser.totalCount + 1}
    }));
  }

  onInputChange = (event) => { //user`s input of image Url
    let inputValue = event.target.value
    console.log('user`s inputValue: ', inputValue)
    this.setState({userInput: inputValue});
  }

  onDetectSubmit = () => {
    console.log('detect btn has cliked');
    this.setState({imageUrl: this.state.userInput, currentCount: 0 });
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, //As the firts parameter we say it WHAT model do we want to use. Clarifai provides this model. 
      this.state.userInput) //the second parameter must be img-url
      // why userInput, not imageUrl? - its because of the way HOW 'setState' works. 
    .then((response) => {
      console.log('clarifai`s response: ', response);
      this.displayFaceLocation(this.calculateFaceLocation(response));
    })
    .catch ((error) => console.log(error))
  }

  onRouteChange = (ourRoute) => {
    if(ourRoute === 'signout') {
      this.setState({ isUserSignedIn: false, imageUrl: '', box:{}, currentCount: 0 })
    } else if(ourRoute === 'home') {
      this.setState({isUserSignedIn: true})
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
    const isUserExisted = this.state.registeredUsers.find((user) => newUser.email === user.email);
    if(isUserExisted) {
      alert('this email already exists!')
    } else if (newUser.name.length < 3 || newUser.email.length < 3 || newUser.password.length < 3) {
      alert('all inputs must have 3 or more characters')
    } else {
      this.setState({registeredUsers: [...this.state.registeredUsers, newUser ]}, ()=> {
        console.log('state after onRegisterSubmit: ', this.state);
        this.setState({name:'', email:'', password:''});
        this.onRouteChange('signin');
      });
    }    
  }

  onSigninSubmit = () => {
    const { email, password } = this.state;
    const foundUser = this.state.registeredUsers.find((user) => email === user.email);
    if(foundUser && password === foundUser.password) {
      this.setState({currentUser: {...foundUser}}, ()=> {
        this.setState({ email:'', password:''});
        this.onRouteChange('home');
      })
    } else {
      alert('Wrong email or password!')
    }
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation 
          isUserSignedIn={this.state.isUserSignedIn}
          onRouteChange={this.onRouteChange}
        />
        { this.state.route ==='home' 
          ? <div>
              <Logo/>
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
          : ( this.state.route ==='signin'
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
