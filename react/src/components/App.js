import React from 'react';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';

import MainPage from './MainPage';
import TradablePairsInfo from './TradablePairsInfo';

const App = () => {
  return (
    <Router basename='/react'>
        <Routes>
          <Route path="/" element={<MainPage/>} />
		  <Route path="/TradablePairsInfo" element={<TradablePairsInfo/>} />
        </Routes>
    </Router>
  );
};

export default App;

