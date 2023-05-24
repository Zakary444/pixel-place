<template>
  <div>
    <InfoPanel />
    <ZPlaceCanvas />
    <ColorPicker />
  </div>
</template>

<script>
import ZPlaceCanvas from './components/ZPlaceCanvas.vue';
import ColorPicker from './components/ColorPicker.vue';
import InfoPanel from './components/InfoPanel.vue';

export default {
  components: {
    ZPlaceCanvas,
    ColorPicker,
    InfoPanel
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');

html {
  font-family: 'Fira Code', monospace;
}

body {
  font-family: 'Fira Code', monospace;
}
</style>

