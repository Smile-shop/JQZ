<template>
  <div class="sumCard">
    <el-card class="sumCard-item" v-for="(item, index) in cardList" :key="index" shadow="never">
      <el-tooltip class="item" effect="dark" :content="item.tool" placement="top">
        <i class="el-tooltip el-icon-warning-outline sumCard-item-info" />
      </el-tooltip>
      <div class="sumCard-item-name">{{item.name}}</div>
      <div class="sumCard-item-num">
        <span class="sumCard-item-num-detail">
          <span v-if="item.unit === '元'">￥{{item.num | money(2) }}</span>
          <span v-else>{{item.num}}</span>
        </span>
        <span style="margin-left: 3px;">{{item.unit}}</span>
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
    default: [],
  })
  cardList!: any[];
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
      top: 22px;
      right: 22px;
      font-size: 16px;
    }
    &-name {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #80869d;
      line-height: 22px;
      margin-bottom: 10px;
    }
    &-num {
      font-size: 16px;
      color: #373e4f;
      &-detail {
        font-size: 30px;
        line-height: 38px;
      }
    }
  }
}
</style>


