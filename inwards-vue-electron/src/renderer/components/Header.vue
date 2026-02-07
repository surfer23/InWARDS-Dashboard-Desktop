<template>
  <div>
  </div>
</template>

<style>
  .pos-f-t {
    color: white;
  }
</style>

<script>
export default {
  name: 'Header',
  methods: {
    login() {
      // Login logic
    },
    close() {
      if (window.electronAPI) {
        window.electronAPI.closeWindow();
      }
    },
    minimize() {
      if (window.electronAPI) {
        window.electronAPI.minimizeWindow();
      }
    },
    maximize() {
      if (window.electronAPI) {
        window.electronAPI.maximizeWindow();
      }
    }
  },
  mounted() {
    console.log('Online status:', window.navigator.onLine);
  }
};
</script>
