<template>
  <div class="header">
      <p>{{titleHeader}}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
export default defineComponent({
  props: {
    titleHeader: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  box-sizing: border-box;
  background: #F5F7FA;
  padding-left: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 24px 0;
  p {
    color: #263446;
    padding-left: 8px;
    border-left: 3px solid #0045FF;
    margin: 0;
  }
}
</style>
