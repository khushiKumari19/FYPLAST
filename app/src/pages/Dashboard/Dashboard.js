import React, { useEffect, useState } from "react";
import './style.css';
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Web3 from 'web3';
import ERC20Token from '../../Contracts/ERC20Token.json';

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const search = location.search;
  const cars = new URLSearchParams(search).get("cars");
  const tokens = new URLSearchParams(search).get("tokens");
  const id = new URLSearchParams(search).get('id');
  const prices = new URLSearchParams(search).get("prices");
  const searchParams = new URLSearchParams(location.search);
  const buyer = searchParams.get("buyer");
  const hash = searchParams.get("hash");
  const name = searchParams.get("name");
  const carId = searchParams.get("carId");
  const [sellAmount, setSellAmount] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
const [tokensBought, setTokensBought] = useState(0);
const [remainingTokens, setRemainingTokens] = useState(0);
const [buyerTokens, setBuyerTokens] = useState(0);

  useEffect(() => {
    const loadBuyerTokens = async () => {
      try {
        // Connect to the Ethereum network using Web3
        const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

        // Get the network ID
        const networkId = await web3.eth.net.getId();

        // Get the deployed ERC20Token contract
        const contract = new web3.eth.Contract(
          ERC20Token.abi,
          hash
        );

        // Call the smart contract's tokensBought function to get the total tokens bought by the buyer
        const tokensBought = await contract.methods.tokensBought(buyer).call();

        const buyerBalance = await contract.methods.getBalance(buyer).call();

        // Call the smart contract's getRemainingTokens function to get the remaining tokens
        const remainingTokens = await contract.methods.getRemainingTokens().call();

        // Update the state with the total tokens bought by the buyer
        setBuyerTokens(buyerBalance);
        setTokensBought(tokensBought);
        setRemainingTokens(remainingTokens);

        
      } catch (error) {
        console.error('Error loading buyer tokens:', error);
      }
    };

    loadBuyerTokens();
  }, [buyer, hash]);
  const sellTokens = async () => {
    try {
      // Connect to the Ethereum network using Web3
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

      // Get the deployed MyToken contract
      const contract = new web3.eth.Contract(
        ERC20Token.abi,
        hash
      );

      // Call the smart contract's sellTokens function to sell the specified amount of tokens
      await contract.methods.sellTokens(sellAmount).send({ from: buyer });

      // Update the buyer's token balance and remaining tokens after the transaction
      const buyerBalance = await contract.methods.getBalance(buyer).call();
      const remainingTokens = await contract.methods.getRemainingTokens().call();
      setBuyerTokens(buyerBalance);
      setRemainingTokens(remainingTokens);
    } catch (error) {
      console.error('Error selling tokens:', error);
    }
  };

  return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-header">
        <h2>USER DASHBOARD</h2>
      </div>
      <div className="user-dashboard-content">
        <div className="user-details">
          <h2>My Profile</h2>
          <div className="user-details-item">
            <h4>Wallet address: <p> {buyer}</p></h4>
          </div>
        </div>
        <div className="user-orders">
          <h2>My Orders</h2>
          <div className="user-order">
            <div className="user-order-header">
            </div>
            <div className="user-order-items">
              <div className="user-order-item">
                <div>
                  <p>Total tokens bought: {tokensBought}</p>
                  <p>Token balance: {buyerTokens}</p>
                  <p>Remaining Tokens: {remainingTokens}</p>
                  <p>Car name: {name} </p>
                  <p>Car ID: {carId}</p>
                </div>
              </div>
              <div className="sell-tokens-section">
  <input
    type="number"
    value={sellAmount}
    onChange={(e) => setSellAmount(e.target.value)}
    className="sell-tokens-input"
  />
  <button type="button" className="button1" onClick={sellTokens}>
    Sell Tokens
  </button>
</div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
