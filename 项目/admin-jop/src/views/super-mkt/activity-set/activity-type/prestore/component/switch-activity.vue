<template>
  <span class="switch-activity">
    <span class="title">当前活动：</span>
    <span class="name">{{ activityName ? activityName : '全部活动'}}</span>
    <span class="qie" @click="$emit('click')"> <img class="img" src="@/assets/images/super-mkt/arrow.png" alt=""> 切换活动</span>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class Activity extends Vue {
  @Prop() activityName!: string;
}
</script>


<style lang="scss" scoped>
.switch-activity{
  .title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #c2c8d2;
      line-height: 22px;
    }
    .name {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #fd8c4e;
      line-height: 22px;
    }
    .qie {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5b8fff;
      line-height: 22px;
      margin-left: 30px;
      text-decoration: underline;
      cursor: pointer;
      .img{
        width: 20px;
        height: 20px;
        position: relative;
        top: 5px;
        margin-right: 5px;
      }
    }
}
</style>