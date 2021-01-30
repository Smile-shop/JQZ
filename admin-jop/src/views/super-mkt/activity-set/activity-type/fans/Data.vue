<template>
  <div class="activity-type-data">
    <el-tabs v-model="activeName">
      <el-tab-pane label="活动数据" name="data">
        <data-active></data-active>
      </el-tab-pane>
      <el-tab-pane label="参与记录" name="history">
        <data-history></data-history>
      </el-tab-pane>
    </el-tabs> 
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import DataActive from './DataActive.vue';
import DataHistory from './DataHistory.vue';

@Component({
  name: 'data',
  components: {
    DataActive,
    DataHistory
  }
})
export default class PrizeSetActivityTypeAdd extends Vue {
  activeName = 'data';
}
</script>

<style lang="scss" scoped>
.activity-type-data {
  display: inline-block;
}
</style>


