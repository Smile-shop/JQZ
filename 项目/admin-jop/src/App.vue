<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class App extends Vue {
  mounted() {
    window.onbeforeunload = () => {
      this.saveState();
    }
  }

  saveState() {
    sessionStorage.setItem('state', JSON.stringify(this.$store.state))
  }
}
</script>


<style lang="scss">
</style>
