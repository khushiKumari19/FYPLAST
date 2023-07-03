import React, { useState, useEffect } from 'react';
import { Nav, NavbarContainer, NavLogo, NavIcon, HamburgerIcon, NavMenu, NavItem, NavLinks, NavItemBtn, NavBtnLink } from './Navbar.elements';
import { FaTimes, FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { Button } from '../../globalStyles';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [web3, setWeb3] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [homeClick, setHomeClick] = useState(false);
  const [servicesClick, setServicesClick] = useState(false);
  const [productsClick, setProductsClick] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    setHomeClick(true);
    setProductsClick(false);
    setServicesClick(false);
  };

  const handleServicesClick = () => {
    setHomeClick(false);
    setProductsClick(false);
    setServicesClick(true);
  };

  const handleProductsClick = () => {
    setHomeClick(false);
    setProductsClick(true);
    setServicesClick(false);
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    }
  }, []);

  const handleMetaMaskLogin = async () => {
    if (web3) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setUserAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  const handleAddressClick = () => {
    if (userAddress) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <NavbarContainer>
            <NavLogo to='/'>
              <NavIcon />
              CarT
            </NavLogo>
            <HamburgerIcon onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </HamburgerIcon>
            <NavMenu onClick={handleClick} click={click}>
              <NavItem onClick={handleHomeClick} homeClick={homeClick}>
                <NavLinks to='/' onClick={closeMobileMenu}>
                  Home
                </NavLinks>
              </NavItem>
              <NavItem onClick={handleServicesClick} servicesClick={servicesClick}>
                <NavLinks to='/blog' onClick={closeMobileMenu}>
                  Blog
                </NavLinks>
              </NavItem>
              <NavItem onClick={handleProductsClick} productsClick={productsClick}>
                <NavLinks to='/marketplace' onClick={closeMobileMenu}>
                  Marketplace
                </NavLinks>
              </NavItem>
              <NavItemBtn>
                {userAddress ? (
                  <Button primary onClick={handleAddressClick}>
                    {userAddress}
                  </Button>
                ) : (
                  <Button primary onClick={handleMetaMaskLogin}>
                    Connect to MetaMask
                  </Button>
                )}
              </NavItemBtn>
            </NavMenu>
          </NavbarContainer>
        </Nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;