import logo from './logo.svg';
import './App.css';
import Home from './Home';
import React, { useState } from 'react';

function App() {
  const [color, setColor] = useState('black');
  const handleClick = () =>{
    setColor("red")
  }
  return (
    <div className="App">
     <h1 onClick={handleClick} style={{ color: color }}>hello</h1>
     <Home/>
    </div>
  );
}

export default App;
