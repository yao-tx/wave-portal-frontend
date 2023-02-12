import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import React, { useEffect, useState } from "react";

import "./App.css";

function App() {
  const contractABI = abi.abi;
  const [allWaves, setAllWaves] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0xd0Aa4209C93093D6BF4095ec9b8ceA5395C28955";

  const checkIfWalletIsConnected = async () => {
    try {
      const ethereum = window;

      if (!ethereum) {
        console.error("Make sure you have Metamask!");
        return;
      } else {
        console.log("We have the Ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async (message) => {
    setLoading(true);

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    getAllWaves();
    checkIfWalletIsConnected();
  }, []);

  let buttonText = "Wave at Me";

  if (isLoading) {
    buttonText = "Mining...";
  }

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <h1 className="header">👋 Hey there!</h1>

        <div className="bio">
          I'm TX, a full-stack web dev from Singapore learning about Web3.<br />
          Connect your Ethereum wallet and wave at me!
        </div>

        <textarea
          className="waveMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say something..."
          disabled={isLoading}
        />

        <div className="buttons">
          <button
            className="waveButton"
            onClick={() => wave(message)}
            disabled={isLoading }
          >
            {buttonText}
          </button>

          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect wallet
            </button>
          )}

          {currentAccount && (
            <div className="connection-status">
              <span className="connected-pill" /> Wallet Connected
            </div>
          )}
        </div>

        <div className="wavesContainer">
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          )
        })}
        </div>
      </div>
    </div>
  );
}

export default App;
