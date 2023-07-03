import React, { useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCarDetailsById } from "../../Actions/Car.actions";
import { addToCart } from "../../Actions/cart.actions";
import Carousel from "react-bootstrap/Carousel";
import Slider from "react-slick";
import { generatePublicUrl } from "../../urlConfig";
import { useLocation } from "react-router-dom";
import "./style.css";

const Web3 = require('web3');
const web3 = new Web3(window.ethereum);
const ERC20Token = require("../../Contracts/ERC20Token.json");

const CaraDetails = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slide: 1,
    scrollslide: 1,
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const car = useSelector((state) => state.car);
  const { carId } = useParams();
  const location = useLocation();
  const name = new URLSearchParams(location.search).get("name");
  const remainingTokens = new URLSearchParams(location.search).get("remainingTokens");
  
  console.log(car, "car", carId);
  useEffect(() => {
    const payload = {
      params: {
        carId,
      },
    };
    dispatch(getCarDetailsById(payload));
  }, []);
  const tokenPrice = car?.carDetails?.totalPrice / (car?.carDetails?.totalSupply/1000000000000000000);

  return (
      <div class="product-page">
  <div class="product-page__left-column">
    <div class="product-page__image-container">
    <Slider {...settings}>
            {car?.carDetails?.carPictures?.map((pic) => (
              <img
                className="imgInCarDetails"
                src={generatePublicUrl(pic.img)}
              />
            ))}
          </Slider>
    </div>
    <div class="product-page__thumbnails-container">
    {car?.carDetails?.carPictures?.map((pic) => (
              <img
                className="imgInCarDetails"
                src={generatePublicUrl(pic.img)}
              />
            ))} 
      
    </div>
  </div>
  <div class="product-page__right-column">
    <h1 class="product-page__title">{car?.carDetails.name}</h1>
    <p class="product-page__price">PKR {car?.carDetails.totalPrice}</p>
    <p class="product-page__description">This {car?.carDetails.name} {car?.carDetails.model} from {car?.carDetails.company} is a perfect choice for those looking for a reliable and fuel-efficient vehicle. The {car?.carDetails.engine} engine is powerful and responsive, providing a smooth ride and plenty of acceleration when needed. With a total price of ${car?.carDetails.totalPrice}, and a token price of <b>${tokenPrice}</b>, this car offers excellent value for money. <br/> Token Name: <b>{name}</b> , Token Symbol: <b>{car?.carDetails.symbol}</b>, Total Supply Of Tokens: <b> {car?.carDetails.totalSupply}</b>,RemainingTokens: <b> {remainingTokens}</b>. </p>
    <div>
        <button type="button" className="button1"
            onClick={() => {
              const { _id, name, totalPrice, tokenPrice, totalSupply } = car?.carDetails;
              console.log(tokenPrice);
              const img = car?.carDetails?.carPictures[0]?.img;
              dispatch(addToCart({ _id, name, totalPrice, tokenPrice,totalSupply, img }));
              navigate("/cart");
            }}
          >
            Add To Cart
          </button>
        </div>
  </div>
</div>

  );
};

export default CaraDetails;