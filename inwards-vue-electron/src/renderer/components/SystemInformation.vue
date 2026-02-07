<template>
  <div class="box">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Package</th>
          <th>Version</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Platform</td>
          <td>{{ platform }}</td>
        </tr>
        <tr v-for="lib in Object.keys(versions)" :key="lib">
          <td>{{ lib }}</td>
          <td>{{ versions[lib] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      versions: window.versions || {},
      platform: window.electronAPI?.getPlatform?.() || navigator.platform || 'Unknown',
    }
  },
}
</script>

<style></style>