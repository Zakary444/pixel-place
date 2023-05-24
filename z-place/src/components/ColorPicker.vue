<template>
  <div id="color-picker-container">
    <input type="color" id="color-picker" v-model="currentColor">
    <div class="color-option" 
         v-for="(color, index) in colors" 
         :key="index"
         :style="{ background: color }" 
         @click="selectColor(color)"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentColor: '#000000',
      colors: ['red', 'blue', 'green', 'yellow', 'black', 'white'],
    };
  },
  methods: {
    selectColor(color) {
      this.currentColor = color;
    },
  },
};
</script>

<style scoped>
#color-picker-container {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.color-option {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

@media (max-width: 768px) {
  #color-picker-container {
    position: fixed;
    left: 0;
    bottom: 0;
    flex-direction: row;
  }
}
</style>

