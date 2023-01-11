import * as React from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const wave = () => {

  }

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>
        <div className="bio">
          I'm TX, a full-stack web dev from Singapore learning about Web3.
        </div>
        <button className="waveButton" onClick={wave}>
          Wave at Me!
        </button>
      </div>
    </div>
  );
}

export default App;
