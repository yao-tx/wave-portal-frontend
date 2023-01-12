import React, { useEffect, useState } from "react";
import "./App.css";

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async() => {
  try {
    const ethereum = getEthereumObject();

    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.lengthh !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.log("No authorized account found");
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
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

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      setCurrentAccount(account);
    });
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
        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
