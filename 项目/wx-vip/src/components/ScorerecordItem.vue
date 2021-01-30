<template>
  <div>
    <div class="item title">
      <div>{{ data.title }}</div>
      <div :style="{ 'color': themeColor }">{{ data.credit | filtersA }}</div>
    </div>
    <div class="item time">
      {{ new Date(data.createTime).format('yyyy/MM/dd hh:mm:ss') }}
    </div>
    <div class="item name">
      [{{ data.type }}]
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: ['data'],
  computed: {
    ...mapState({
      themeColor: state => state.themeColor
    })
  },
  filters: {
    filtersA(data) {
      if (data) {
        if (data * 1 > 0) {
          return `+${data}`;
        } else {
          return data;
        }
      } else {
        return '';
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  padding: 6px 0 0 10px;
}
.title {
  display: flex;
  div {
    font-size: 14px;
    font-weight: bold;
  }
  div:first-child {
    flex-basis: 50%;
    flex-grow: 1;
  }
  div:last-child {
    width: 60px;
    text-align: center;
  }
}
.time {
  color: #666666;
  font-size: 12px;
}
.name {
  padding-bottom: 10px;
  font-size: 14px;
}
</style>
