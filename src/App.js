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
  const contractAddress = "0x48Ff8A4F9CA9BA92F0e9ddDC5926a0F45429ebb6";

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

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

        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        setMessage("");
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
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

        <div className="waveSection">
          <textarea
            className="waveMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something..."
            disabled={isLoading}
          />

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
            <div key={index} className="waveCard">
              <p>Address: {wave.address}</p>
              <p>Time: {wave.timestamp.toString()}</p>
              <p>Message: {wave.message}</p>
            </div>
          )
        })}
        </div>
      </div>
    </div>
  );
}

export default App;
