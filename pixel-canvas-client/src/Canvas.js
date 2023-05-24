import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { FixedSizeGrid as Grid } from 'react-window';

const Canvas = ({ color }) => {
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

    const Pixel = ({ columnIndex, rowIndex, style }) => ( <
        div className = "pixel"
        style = {
            {
                ...style,
                backgroundColor: pixels[rowIndex * 120 + columnIndex],
            }
        }
        onClick = {
            () => handlePixelClick(columnIndex, rowIndex) }
        />
    );

    return ( <
        Grid className = "Canvas"
        columnCount = { 120 }
        columnWidth = { 10 }
        height = { 1200 }
        rowCount = { 120 }
        rowHeight = { 10 }
        width = { 1200 } >
        { Pixel } <
        /Grid>
    );
};

export default Canvas;