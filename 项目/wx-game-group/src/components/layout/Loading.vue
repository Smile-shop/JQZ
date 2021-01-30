<template>
  <div class="vld-parent">
    <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  props: {
    isLoading: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      fullPage: true
    }
  },
  components: {
    Loading
  }
}
</script>