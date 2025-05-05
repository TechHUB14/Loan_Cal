import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { EMIC } from './components/EMIC';
import { LiveExchangeRates } from './components/LiveExchangerates';
import { NotFound } from './components/NotFound';

function App() {
  return (
    <Router>


      <Routes>
        <Route path="/" element={<EMIC />} />
        <Route path="/" element={<EMIC />} />
        <Route path="/exchange-rates" element={<LiveExchangeRates />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
