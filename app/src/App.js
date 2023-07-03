import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import GlobalStyles from './globalStyles'
import { Navbar, Footer } from './components';
import Home from './pages/HomePage/Home';
import Services from './pages/Blog/Blog';
import Products from './pages/MarketPlace/MarketPlace';
import Dashboard from './pages/Dashboard/Dashboard';
import CartPage from './pages/CartPage/CartPage';
import CarDetails from './pages/CarDetails/CarDetails';
import SignUp from './pages/SignUp/SignUp';
import SellTokens from './pages/SellTokens/SellTokens'
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    
     <>
     <div>
          <GlobalStyles />
          <ScrollToTop />
          <Navbar />
          <Routes>
           <Route path='/home' exact component={Home} />
           <Route path="/" element={<Home />} />
           <Route path="/dashboard" element={<Dashboard/>}/>
           <Route path="/selltokens" element={<SellTokens/>}/>
            <Route path="/cart" element={<CartPage/>}/>    
            <Route path="/car-detail/:carId" element={<CarDetails/>}/>  
            <Route path='/' exact component={Home} />
            <Route path='/blog' element={<Services/>} />
            <Route path="/marketplace" element={<Products />}

            
             />
          </Routes>
          </div></>
        
    
  );
}

export default App;
