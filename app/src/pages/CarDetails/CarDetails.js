import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getCarDetailsById, getInitialData } from "../../Actions/Car.actions";
import { addToCart } from "../../Actions/cart.actions";
import { generatePublicUrl } from "../../urlConfig";
import "./style.css";
import Button from "react-bootstrap/esm/Button";
import Carousel from "react-bootstrap/Carousel";
import Slider from "react-slick";
const Web3 = require('web3');
const ERC20Token = require("../../Contracts/ERC20Token.json");

const CarDetails = () => {
  const { carId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const car = useSelector((state) => state.car);
  const navigate = useNavigate();
  const [buyTokens, setBuyTokens] = useState("");
  const [tokensBoughtEvents, setTokensBoughtEvents] = useState([]);
  const hash = car?.carDetails?.contractHash;
  const [name, setName] = useState(""); // State to store the token name
  const [symbol, setSymbol] = useState(""); // State to store the token symbol
  const [totalSupply, setTotalSupply] = useState(0); // State to store the total supply
  const [remainingTokens, setRemainingTokens] = useState(0); // State to store the remaining tokens
  const [totalTokensBought, setTotalTokensBought] = useState(0);

  

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slide: 1,
    scrollslide: 1,
  };

  useEffect(() => {
    const payload = {
      params: {
        carId,
      },
    };
    dispatch(getCarDetailsById(payload));
  }, []);

  const tokenPrice = car?.carDetails?.totalPrice / (car?.carDetails?.totalSupply / 1000000000000000000);

  useEffect(() => {
    dispatch(getInitialData());
    dispatch(getCarDetailsById({ carId }));
  }, [carId, dispatch]);

 

  useEffect(() => {
    // Fetch token details from the smart contract
    const fetchTokenDetails = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const contractAddress = car?.carDetails?.contractHash;
        const contract = new web3.eth.Contract(ERC20Token.abi, contractAddress);

        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const totalSupply = await contract.methods.totalSupply().call();
        const remainingTokensInWei = await contract.methods.getRemainingTokens().call();
        const totalBought = await contract.methods.tokensBought(window.ethereum.selectedAddress).call();
        setTotalTokensBought(totalBought);
  

        const remainingTokens = remainingTokensInWei;

        // const divisionResult = remainingTokensInWei / 1e18;
        // const remainingTokens = Math.floor(divisionResult);

        console.log(remainingTokensInWei)
        console.log(remainingTokens)



        setName(name);
        setSymbol(symbol);
        setTotalSupply(totalSupply);
        setRemainingTokens(remainingTokens);
      } catch (error) {
        console.log('Token details fetch error:', error);
      }
    };

    fetchTokenDetails();
  }, [car]);


  const handleBuyNow = async () => {
    if (typeof window.ethereum === 'undefined') {
      window.alert('Please install MetaMask to proceed with the purchase.');
      return;
    }

    if (!window.ethereum.selectedAddress) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.log('MetaMask connection error:', error);
        return;
      }
    }

    const web3 = new Web3(window.ethereum);
    const contractAddress = hash;
    const contract = new web3.eth.Contract(ERC20Token.abi, contractAddress);

    try {
      const buyTokensAmount = Number(buyTokens);
      if (isNaN(buyTokensAmount) || buyTokensAmount <= 0) {
        window.alert('Please enter a valid number of tokens to buy.');
        return;
      }

      await contract.methods.buyTokens(buyTokensAmount).send({
        from: window.ethereum.selectedAddress,
        value: web3.utils.toWei(String(buyTokensAmount), 'ether'),
      });
      const updatedRemainingTokensInWei = await contract.methods.getRemainingTokens().call();
    const updatedDivisionResult = updatedRemainingTokensInWei / 1e18;
    const updatedRemainingTokens = Math.floor(updatedDivisionResult);
    const totalBought = await contract.methods.tokensBought(window.ethereum.selectedAddress).call();
    setTotalTokensBought(totalBought);

    setRemainingTokens(updatedRemainingTokensInWei);
    console.log("Updated Remaining Tokens:", updatedRemainingTokens);


      console.log(`Buy ${buyTokens} tokens for contract ${contractAddress}`);

      setTokensBoughtEvents([...tokensBoughtEvents, { buyer: window.ethereum.selectedAddress, amount: buyTokensAmount }]);
      navigate(`/dashboard?buyer=${window.ethereum.selectedAddress}&name=${car?.carDetails.name}&carId=${carId}&amount=${buyTokensAmount}&hash=${hash}`);

    } catch (error) {
      console.log('Token purchase error:', error);
    }
  };

 
  return (
    <div className="product-page">
      <div className="product-page__left-column">
        <div className="product-page__image-container">
          <Slider {...settings}>
            {car?.carDetails?.carPictures?.map((pic) => (
              <img className="imgInCarDetails" src={generatePublicUrl(pic.img)} />
            ))}
          </Slider>
        </div>
        <div className="product-page__thumbnails-container">
          {car?.carDetails?.carPictures?.map((pic) => (
            <img className="imgInCarDetails" src={generatePublicUrl(pic.img)} />
          ))}
        </div>
      </div>
      <div className="product-page__right-column">
        <h1 className="product-page__title">{car?.carDetails.name}</h1>
        <p className="product-page__price">PKR {car?.carDetails.totalPrice}</p>
        <p className="product-page__description">
          This {car?.carDetails.color} {car?.carDetails.model} from{" "}
          {car?.carDetails.company} is a perfect choice for those looking for a
          reliable and fuel-efficient vehicle. The {car?.carDetails.engine}{" "}
          engine is powerful and responsive, providing a smooth ride and plenty
          of acceleration when needed.
          This car offers excellent value for money.
          <br />
          <div>
            <br/>
          {/* Display token details */}
          <h2>Token Details</h2>
          <div>Name: {name}</div>
          <div>Symbol: {symbol}</div>
          <div>Total Supply: {totalSupply}</div>
          <div>Remaining Tokens: {remainingTokens}</div>


          <input
            type="number"
            value={buyTokens}
            onChange={(e) => setBuyTokens(e.target.value)}
            placeholder="Enter the number of tokens to buy"
          />
          </div>
        </p>
        <div>
          
          <button
            type="button"
            className="button1"
            onClick={() => {
              handleBuyNow();
            }}
          >
            Buy Now
          </button>
        </div>

        {/* Display the emitted event data */}
        {tokensBoughtEvents.map((event, index) => (
          <div key={index}>
            <br/>
            Buyer: {event.buyer}, Amount: {event.amount}

          </div>
        ))}
      </div>
    </div>
  );
};

export default CarDetails;