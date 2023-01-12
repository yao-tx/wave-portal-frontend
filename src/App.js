import React, { useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const getEthereumObject = () => window.ethereum;

function App() {
  const wave = () => {

  }

  useEffect(() => {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>
        <div className="bio">
          I'm TX, a full-stack web dev from Singapore learning about Web3.<br />
          Connect your Ethereum wallet and wave at me!
        </div>
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}

export default App;
