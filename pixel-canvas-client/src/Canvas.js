import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { FixedSizeGrid } from 'react-window';

const Pixel = ({ columnIndex, rowIndex, style, color, pixels, setPixels }) => {
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

    return ( <
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
};

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

    return ( <
        FixedSizeGrid className = "Canvas"
        columnCount = { 120 }
        columnWidth = { 10 }
        height = { 1200 }
        rowCount = { 120 }
        rowHeight = { 10 }
        width = { 1200 } >
        {
            ({ columnIndex, rowIndex, style }) => ( <
                Pixel columnIndex = { columnIndex }
                rowIndex = { rowIndex }
                style = { style }
                color = { color }
                pixels = { pixels }
                setPixels = { setPixels }
                />
            )
        } <
        /FixedSizeGrid>
    );
};

export default Canvas;