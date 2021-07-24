import './App.css';
import Logo from './components/logo/Logo';
import ImageLinkInput from './components/imageLinkInput/ImageLinkInput';
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

function App() {
  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Logo/>
      <ImageLinkInput/>
    </div>
  );
}

export default App;
