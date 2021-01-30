<template>
  <div>
    <About :complainOrNot="isComplain"></About>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import About from './About.vue';

@Component({
  components: {
    About
  }
})
export default class Complain extends Vue {
  private isComplain: boolean = true;
}
</script>