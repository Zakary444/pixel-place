import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

function Canvas({ color }) {
  const [pixels, setPixels] = useState(new Array(120 * 120).fill('#FFFFFF'));
  const socket = io('http://45.33.114.158:3001');

  useEffect(() => {
    axios.get('http://45.33.114.158:3001/api/canvas')
      .then(response => {
        const pixels = new Array(120 * 120).fill('#FFFFFF');
        response.data.forEach(pixel => {
          pixels[pixel.y * 120 + pixel.x] = pixel.color;
        });
        setPixels(pixels);
      })
      .catch(console.error);

    socket.on('pixelUpdated', (pixel) => {
      setPixels(prevPixels => {
        const newPixels = [...prevPixels];
        newPixels[pixel.y * 120 + pixel.x] = pixel.color;
        return newPixels;
      });
    });

    return () => socket.off('pixelUpdated');
  }, []);

  const handlePixelClick = (x, y) => {
    axios.post('http://45.33.114.158:3001/api/canvas', { x, y, color })
      .then(response => {
        setPixels(prevPixels => {
          const newPixels = [...prevPixels];
          newPixels[y * 120 + x] = color;
          return newPixels;
        });
      })
      .catch(console.error);
  };

  const renderPixels = () => {
    let rows = [];
    for (let y = 0; y < 120; y++) {
        let row = [];
        for (let x = 0; x < 120; x++) {
            row.push(
                <div 
                    key={`${x}-${y}`}
                    className="pixel" 
                >
                    <div
                        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: pixels[y * 120 + x] }} 
                        onClick={() => handlePixelClick(x, y)}
                    />
                </div>
            );
        }
        rows.push(<div key={y} className="pixel-row">{row}</div>);
    }
    return rows;
};

return (
    <div className="Canvas">
        {renderPixels()}
    </div>
);
}

export default Canvas;