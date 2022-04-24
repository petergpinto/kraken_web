import React from 'react';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';


const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/react/" element={<p>TEST</p>} />
        </Routes>
    </Router>
  );
};

export default App;

