import React, {Component} from 'react';
import './App.css';
import Logo from './components/logo/Logo';
import ImageLinkInput from './components/imageLinkInput/ImageLinkInput';
import FaceDetection from './components/faceDetection/FaceDetection';
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
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    let inputValue = event.target.value
    console.log('user`s inputValue: ', inputValue)
    this.setState({userInput: inputValue});
  }

  onDetectSubmit = () => {
    console.log('detect btn has cliked');
    this.setState({imageUrl: this.state.userInput});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, //As the firts parameter we say it WHAT model do we want to use. Clarifai provides this model. 
      this.state.userInput) //the second parameter must be img-url
      // why userInput, not imageUrl? - its because of the way HOW 'setState' works. 
    .then(
      function(response) {
        console.log('clarifai`s response: ', response);
        let boundingBox = response.outputs[0].data.regions[0].region_info.bounding_box;
        console.log('boundingBox: ', boundingBox);
      },
      function(error) {
        //do smth with error
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Logo/>
        <ImageLinkInput 
          onInputChange={this.onInputChange}
          onDetectSubmit={this.onDetectSubmit}
        />
        <FaceDetection imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
