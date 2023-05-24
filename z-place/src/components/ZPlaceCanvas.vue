<template>
  <div id="canvas-container" ref="canvasContainer">
    <canvas id="canvas" ref="canvas" 
            @mousemove="handleMouseMove"
            @click="handleClick"></canvas>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      context: null,
      canvasData: [...Array(120)].map(() => Array(120).fill('#ffffff')), // assuming a 120x120 grid, initially filled with white pixels
      currentColor: '#000000',
      scale: 1,
      mouseX: 0,
      mouseY: 0,
      canvasSize: 1000,
      gridSize: 120,
      pixelSize: 25, // assuming your pixel size
    };
  },
  methods: {
    drawPixel(x, y, color) {
      this.context.fillStyle = color;
      this.context.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    },
    handleClick(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const scaleX = this.canvasSize / rect.width;
      const scaleY = this.canvasSize / rect.height;

      const x = Math.floor((event.clientX - rect.left) * scaleX / this.pixelSize);
      const y = Math.floor((event.clientY - rect.top) * scaleY / this.pixelSize);

      this.drawPixel(x, y, this.currentColor);

      this.socket.emit('draw_pixel', { x, y, color: this.currentColor });
    },
    handleMouseMove(event) {
  const rect = this.$refs.canvasContainer.getBoundingClientRect();

  // No need to calculate x and y if they're not used
  this.mouseX = (event.clientX - rect.left) / this.scale + this.$refs.canvasContainer.scrollLeft;
  this.mouseY = (event.clientY - rect.top) / this.scale + this.$refs.canvasContainer.scrollTop;
}

  },
  mounted() {
    this.socket = io('http://45.33.114.158:3000'); // change this to your actual Socket.IO server URL
    this.context = this.$refs.canvas.getContext('2d');

    // Set up your socket event listeners
    this.socket.on('init', (canvasData) => {
      this.canvasData = canvasData;
      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          this.drawPixel(x, y, this.canvasData[x][y]);
        }
      }
    });

    this.socket.on('draw_pixel', (data) => {
      const { x, y, color } = data;
      if (x < this.gridSize && y < this.gridSize) {
        this.canvasData[x][y] = color;
        this.drawPixel(x, y, color);
      } else {
        console.error(`Invalid coordinates: x=${x}, y=${y}`);
      }
    });
  },
};
</script>
