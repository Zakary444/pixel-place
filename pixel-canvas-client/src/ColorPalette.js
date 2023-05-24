import React from 'react';

function ColorPalette({ color, setColor }) {
  // Add more colors as needed
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

  return (
    <div className="ColorPalette">
      {colors.map(c => (
        <div
          key={c}
          className={`color ${color === c ? 'selected' : ''}`}
          style={{ backgroundColor: c }}
          onClick={() => setColor(c)}
        />
      ))}
    </div>
  );
}

export default ColorPalette;
