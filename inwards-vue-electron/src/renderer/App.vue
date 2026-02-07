<template>
  <div id="app">
    <TitleBar />
    <div class="app-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import TitleBar from './components/TitleBar.vue';

  export default {
    name: 'INWARDS',
    components: {
      TitleBar
    }
  };
</script>

<style>
  /* CSS */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900');
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Open Sans', sans-serif;
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .app-content {
    flex: 1;
    overflow: auto;
  }
</style>
