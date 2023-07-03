
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCarDetailsById, getInitialData } from "../../Actions/Car.actions";
import Header from "../../components/Navbar/Navbar";
import { generatePublicUrl } from "../../urlConfig";
import { useParams, Link, NavLink, useNavigate } from "react-router-dom";
const Web3 = require('web3');
const web3 = new Web3(window.ethereum);
const ERC20Token = require("../../Contracts/ERC20Token.json");

const SellTokens = () => {
  const [contractNames, setContractNames] = useState({});
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const fetchContractDetails = async (contractHash) => {
    try {
      const contractInstance = new web3.eth.Contract(ERC20Token.abi, contractHash);
      const name = await contractInstance.methods.name().call();
      const symbol = await contractInstance.methods.symbol().call();
      const totalSupply = await contractInstance.methods.totalSupply().call();
      const remainingTokens = await contractInstance.methods.getRemainingTokens().call();
      console.log(name, symbol, totalSupply, remainingTokens);
      return {
        name,
        symbol,
        totalSupply: totalSupply / 1000000000000000000,
        remainingTokens: remainingTokens,
      };
    } catch (error) {
      console.error('Error fetching contract details:', error);
      return null;
    }
  };

  const car = useSelector((state) => state.car);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeContract = async () => {
      try {
        const contractHashes = car.cars.map(c => c.contractHash);
        const contractDetails = {};
        for (const contractHash of contractHashes) {
          const details = await fetchContractDetails(contractHash);
          contractDetails[contractHash] = details;
        }
        setContractNames(contractDetails);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initializeContract();
  }, [car.cars]);

  useEffect(() => {
    dispatch(getInitialData());
  }, []);

  
return(
    <div className="marketplace-container">
    {car.cars.length > 0 ? (
      car.cars.map((c) => (
        <div key={c._id}>
            <div className="car-container">
                  <div className="Cname">
                    <b>Token Name:</b> {c.contractHash}
                  </div>
                  
                </div>
              </div>
           
      ))
    ) : (
      <p>No cars found!</p>
    )}
  </div>
);
};

export default SellTokens;
