const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'z1k',
    password: 'hausemastersucks',
    database: 'pixel_canvas'
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

// Initialize pixel data
let pixels = new Array(120 * 120).fill('#FFFFFF');

// Fetch initial state of canvas
db.query('SELECT * FROM pixels', (error, results) => {
    if (error) throw error;

    results.forEach(pixel => {
        pixels[pixel.y * 120 + pixel.x] = pixel.color;
    });
});

app.get('/api/canvas', (req, res) => {
    res.json(pixels);
});

app.post('/api/canvas', (req, res) => {
    const { x, y, color } = req.body;
    const query = 'REPLACE INTO pixels (x, y, color) VALUES (?, ?, ?)';
    db.query(query, [x, y, color], (error) => {
        if (error) {
            res.status(500).send(error);
            throw error;
        }

        // Update pixel in memory
        pixels[y * 120 + x] = color;

        // Emit 'pixelUpdated' event
        io.emit('pixelUpdated', { x, y, color });

        res.status(200).send();
    });
});

const server = http.createServer(app);

// Socket setup
const io = socketIo(server, {
    cors: {
        origin: "http://45.33.114.158:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

// Set the port
const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`Server running at http://45.33.114.158:${port}/`);
});

io.on('connection', (socket) => {
    console.log('New user connected');
});