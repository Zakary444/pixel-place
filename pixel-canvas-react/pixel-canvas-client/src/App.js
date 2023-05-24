import React, { useState } from 'react';
import Canvas from './Canvas';
import ColorPalette from './ColorPalette';
import './App.css';

function App() {
  const [color, setColor] = useState('#FF0000');
  
  return (
    <div className="App">
      <ColorPalette color={color} setColor={setColor} />
      <Canvas color={color} />
    </div>
  );
}

export default App;
