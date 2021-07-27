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
      imageUrl: '',
      box: {} //point coordinates that we`ve received from response (in the boundingBox)
    }
  }

  calculateFaceLocation = (receivedData) => { //receivedData = that we`ve received from Clarifai`s response: boundingBox for now
    const boundingBox = receivedData.outputs[0].data.regions[0].region_info.bounding_box;
    console.log('boundingBox: ', boundingBox);
    const inputImage = document.getElementById('inputImage');
    const imageWidth = Number(inputImage.width);
    const imageHeight = Number(inputImage.height);
    console.log('width and hight of inputImage: ', imageWidth, imageHeight);
    return { // the point coordinates = dots of boundingBox
      bottomRow: imageHeight - (boundingBox.bottom_row * imageHeight), //1
      leftCol: boundingBox.left_col * imageWidth, //2
      rightCol: imageWidth - (boundingBox.right_col * imageWidth), //3
      topRow: boundingBox.top_row * imageHeight, // 4
    }
  }

  displayFaceLocation = (boxDots) => {
    console.log('boxDots returned from calculateFaceLocation: ', boxDots);
    this.setState({ box: boxDots });
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
    .then((response) => {
      console.log('clarifai`s response: ', response);
      this.displayFaceLocation(this.calculateFaceLocation(response));
    })
    .catch ((error) => console.log(error))
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
        <FaceDetection 
          imageUrl={this.state.imageUrl}
          box={this.state.box}
        />
      </div>
    );
  }
}

export default App;
