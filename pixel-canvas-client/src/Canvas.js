import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to handle socket connection
const useSocket = (url, event, handler) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketIo = io(url);
        setSocket(socketIo);

        socketIo.on(event, handler);

        return () => {
            socketIo.off(event);
            socketIo.close();
        };
    }, [url, event, handler]);

    return socket;
};

// Custom hook to handle pixel data
const usePixelData = (url, socket) => {
    const [pixels, setPixels] = useState(new Array(120 * 120).fill('#FFFFFF'));

    useEffect(() => {
        axios.get(url)
            .then(response => {
                const newPixels = [...pixels];
                response.data.forEach(pixel => {
                    newPixels[pixel.y * 120 + pixel.x] = pixel.color;
                });
                setPixels(newPixels);
            })
            .catch(console.error);

        if (socket) {
            socket.on('pixelUpdated', (pixel) => {
                setPixels(prevPixels => {
                    const newPixels = [...prevPixels];
                    newPixels[pixel.y * 120 + pixel.x] = pixel.color;
                    return newPixels;
                });
            });
        }
    }, [url, socket, pixels]);

    return [pixels, setPixels];
};

function Canvas({ color }) {
    const url = 'http://45.33.114.158:3001';
    const socket = useSocket(url, 'pixelUpdated');
    const [pixels, setPixels] = usePixelData(`${url}/api/canvas`, socket);

    const handlePixelClick = (x, y) => {
        axios.post(`${url}/api/canvas`, { x, y, color })
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
                row.push( <
                    div key = { `${x}-${y}` }
                    className = "pixel"
                    style = {
                        { backgroundColor: pixels[y * 120 + x] } }
                    onClick = {
                        () => handlePixelClick(x, y) }
                    />
                );
            }
            rows.push( < div key = { y }
                className = "pixel-row grid" > { row } < /div>);
            }
            return rows;
        };

        return ( <
            div className = "Canvas" > { renderPixels() } <
            /div>
        );
    }

    export default Canvas;