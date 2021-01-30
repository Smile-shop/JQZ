<template>
  <div class="sumCard">
    <el-card class="sumCard-item" v-for="(item, index) in cardList" :key="index" shadow="never">
      <el-tooltip class="item" effect="dark" :content="item.tool" placement="top">
        <i class="el-tooltip el-icon-warning-outline sumCard-item-info" />
      </el-tooltip>
      <div class="sumCard-item-name">{{item.name}}</div>
      <div class="sumCard-item-num">
        <span class="sumCard-item-num-detail">{{item.num}}</span>
        <span style="margin-left: 3px;" v-if="index < 3">人</span>
        <span style="margin-left: 3px;" v-else>笔</span>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component({})
export default class SumCard extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: [],
  })
  cardList!: boolean;
}
</script>

<style lang="scss" scoped>
.sumCard {
  display: flex;
  margin-bottom: 40px;
  &-item {
    width: 23.3%;
    position: relative;
    &:not(:nth-child(1)) {
      margin-left: 5%;
    }
    &-info {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 16px;
    }
    &-name {
      // color: #989898;
      // font-size: 12px;
      margin-bottom: 10px;
    }
    &-num {
      font-size: 16px;
      // color: #666;
      &-detail {
        font-size: 30px;
      }
    }
  }
}
</style>


