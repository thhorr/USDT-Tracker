// src/App.js
import React from 'react';
import './App.css';
import UsdtChart from './UsdtChart';
import UsdtBaseFeeChart from './UsdtBaseFeeChart';
import UsdtRatioChart from './UsdtRatioChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Usdt Block Transactions Chart</h1>
      </header>
      <div>
        <UsdtChart />
      </div>
      <header className="App-header">
        <h1>Usdt Base Fee Chart</h1>
      </header>
      <div>
        <UsdtBaseFeeChart />
      </div>
      <header className="App-header">
        <h1>Usdt Gas Used over Gas Limit Chart</h1>
      </header>
      <div>
        <UsdtRatioChart />
      </div>
    </div>
  );
}

export default App;
