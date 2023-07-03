// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { addToCart, getCartItems } from '../../Actions/cart.actions'
// import PriceDetails from '../../components/PriceDetails/PriceDetails'
// import CartItem from './CartItem/CartItem'
// import './style.css'
// import { Link } from 'react-router-dom';

// const CartPage = (props) => {
  
//   const cart = useSelector((state)=>state.cart)
//   const auth = useSelector((state)=>state.auth)
//   const dispatch = useDispatch()

//   const [cartItems,setCartItems] = useState(cart.cartItems)

//   useEffect(()=>{
//     setCartItems(cart.cartItems)
//   },[cart.cartItems])

//   useEffect(()=>{
//     if(auth.authenticate){
//       dispatch(getCartItems())
//     }
//   },[auth.authenticate])
 
//   const carNames = Object.keys(cartItems).map(key => cartItems[key].name).join(',');
//   const tokenPrices = Object.keys(cartItems).map(key => (cartItems[key].totalPrice / (cartItems[key].totalSupply/1000000000000000000))).join(',');
//   const totalTokenPrice = Object.keys(cart.cartItems).reduce(function(qty,key){
//     return qty + cart.cartItems[key].qty;
//   },0)
  

//   const onQuantityIncrement=(_id,qty)=>{
//     console.log({_id,qty});
//     const {name,totalPrice,tokenPrices,img} = cartItems[_id];
//     dispatch(addToCart({_id,name,totalPrice,tokenPrices,img},1))
// }

// const onQuantityDecrement = (_id,qty) => {
//     const {name,totalPrice,tokenPrices,img} = cartItems[_id];
//     dispatch(addToCart({_id,name,totalPrice,tokenPrices,img},-1))
// }

// if(props.onlyCartItems){
//   return(
//       <>
//       {Object.keys(cartItems).map((key,index)=>
//       (
//           <CartItem
//               key={index}
//               cartItem={cartItems[key]}
//               onQuantityInc={onQuantityIncrement}
//               onQuantityDec={onQuantityDecrement}
//           />
//           )
//       )}
//       </>
//   )
// }


//   return (
//       <div className='containerInCartPage'>
        
//         <div className='CartLeft'>
//         <div class="cart-header">
//         <h2>Checkout</h2>
//       </div>
//       <br/>
//         {Object.keys(cartItems).map((key,index)=>(
//           <CartItem
//             key={index}
//             cartItem={cartItems[key]}
//             onQuantityInc={onQuantityIncrement}
//             onQuantityDec={onQuantityDecrement}
//           />
//         ))}
//         </div>
//         <div class="cartC">
//     <div class="cart">
//       <div class="cart-header">
//         <h2>Order Summary</h2>
//       </div>
//       <div class="cart-items">
//             <p><PriceDetails
//           totalItem={Object.keys(cart.cartItems).reduce(function(qty,key){
//             return qty + cart.cartItems[key].qty;
//           },0)}
//           totalPrice={Object.keys(cart.cartItems).reduce((totalPrice,key)=>{
//             const {tokenPrice,qty} = cart.cartItems[key]
//             return totalPrice + tokenPrices * qty
//           },0)}
//         /></p>
//     </div>
//     <div class="cart-footer">
//     <Link to={{ pathname: "/dashboard", search: `?cars=${carNames}&prices=${tokenPrices}&tokens=${totalTokenPrice}` }}>
//     <button type="button" className="button1">Checkout</button>
//     </Link>
//       </div>
      
//   </div>
//         </div>
//       </div>
      
//   )
// }


// export default CartPage


import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from '../../Contracts/ERC20Token.json'; 

const contractAddress = '0xf60cac12643e40232009bd23a1863995f5e4aab0';


const CartPage = () => {
  const [balance, setBalance] = useState(0);
  const [remainingTokens, setRemainingTokens] = useState(0);
  const cA = contractABI.abi;

  const connectToEthereum = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(cA, contractAddress);

      const initialBalance = await contract.methods.getBalance(accounts[0]).call();
      const initialRemainingTokens = await contract.methods.getRemainingTokens().call();

      setBalance(initialBalance);
      setRemainingTokens(initialRemainingTokens);

      contract.events.Transfer((error, event) => {
        if (error) console.error(error);
        else {
          if (event.returnValues.from === accounts[0] || event.returnValues.to === accounts[0]) {
            contract.methods.getBalance(accounts[0]).call().then((newBalance) => {
              setBalance(newBalance);
            });
          }
        }
      });
      contract.events.TokensRemaining((error, event) => {
        if (error) console.error(error);
        else {
          setRemainingTokens(event.returnValues.remaining);
        }
      });
    } else {
      console.log('Please install MetaMask or another Ethereum-compatible browser.');
    }
  };

  useEffect(() => {
    connectToEthereum();
  }, []);

  const buyTokens = async (amount) => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(cA, contractAddress);

   
  try {
    const receipt = await contract.methods.buyTokens(amount).send({ from: accounts[0] });
    console.log('Transaction Receipt:', receipt);
    console.log('Tokens bought:', amount);


    if (receipt.status) {
      console.log('Tokens bought successfully!');
    } else {
      console.log('Transaction failed!');
    }
  } catch (error) {
    console.error('Error buying tokens:', error);
  }
  };

  const sellTokens = async (amount) => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(cA, contractAddress);

    await contract.methods.sell(amount).send({ from: accounts[0] });
  };

  return (
    <div>
      <h1>Token Trading App</h1>
      <p>Balance: {balance}</p>
      <p>Remaining Tokens: {remainingTokens}</p>
      <button onClick={() => buyTokens(10)}>Buy 10 Tokens</button>
      <button onClick={() => sellTokens(10)}>Sell 10 Tokens</button>
    </div>
  );
};

export default CartPage;