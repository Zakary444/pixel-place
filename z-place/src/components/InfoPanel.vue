<template>
  <div id="info-panel" v-if="isOpen">
    <button id="close-button" @click="toggleOpen">x-close</button>
    <p>Information required to user:</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
  </div>
  <button v-else @click="toggleOpen" id="open-button">?</button>
</template>

<script>
export default {
  data() {
    return {
      isOpen: true,
    };
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped>
#info-panel {
  position: fixed;
  top: 20px; /* Adjust the top value as you need */
  right: 10px;
  background-color: white;
  color: black;
  padding: 20px;
  width: 30em;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); /* Add shadow to make it visible against white background */
}

#close-button {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  text-decoration: underline;
}

#open-button {
  position: fixed;
  top: 20px; /* Adjust the top value as you need */
  right: 10px;
  background: none;
  border: none;
  color: black;
  font-size: 2rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); /* Add shadow to make it visible against white background */
}
</style>
