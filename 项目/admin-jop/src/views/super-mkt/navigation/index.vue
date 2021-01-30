<template>
  <div class="super-mkt-home">
    <el-card class="box-card">
        <div class="game">
          <p><span class="bigTitle">营销游戏</span><span class="smallTip">爆款营销插件，裂变引流吸粉</span></p>
          <div v-for="o in 4" :key="o" class="text item" @click="handNavigation">
            <div class="img-wrapper">
              <img src="" alt="">
            </div>
            <p class="contentTitle">{{'列表内容 ' + o }}</p>
            <p class="des">说明</p>
          </div>
        </div>
        <div class="getCustomer">
          <p><span class="bigTitle">获客拉新</span><span class="smallTip">爆款营销插件，裂变引流吸粉</span></p>
          <div v-for="o in 2" :key="o" class="text item" @click="handNavigation">
            <div class="img-wrapper">
              <img src="" alt="">
            </div>
            <p class="contentTitle">{{'列表内容 ' + o }}</p>
            <p class="des">说明</p>
          </div>
        </div>
        <div class="saleFriend">
          <p><span class="bigTitle">营销裂变</span><span class="smallTip">爆款营销插件，裂变引流吸粉</span></p>
          <div v-for="o in 1" :key="o" class="text item" @click="handNavigation">
            <div class="img-wrapper">
              <img src="" alt="">
            </div>
            <p class="contentTitle">{{'列表内容 ' + o }}</p>
            <p class="des">说明</p>
          </div>
        </div>
      </el-card>
  </div>
</template> 

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
  components: {
  }
})
export default class SuperMKTNav extends Vue {
  handNavigation() {
    console.log('点击路径')
  }
}
</script>

<style lang="scss" scoped>
.super-mkt-home {
  .text {
    display: inline-block;
  }
  .item {
    width: 200px;
    height: 220px;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .img-wrapper {
    width: 200px;
    height: 140px;
    background-color: #eee;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .bigTitle {
    font-size: 18px;
    font-weight: bold;
  }
  .contentTitle {
    font-size: 15px;
    font-weight: bold;
  }
  .smallTip {
    font-size: 14px;
    color: #999;
    margin-left: 12px;
  }
  .des {
    font-size: 14px;
    color: #999;
  }
}
</style>


/*
<template>
  <div class="super-mkt-home">
  </div>
</template> 

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
  components: {
  }
})
export default class SuperCRMHome extends Vue {
}
</script>

<style lang="scss" scoped>
.super-mkt-home {
  
}
</style>
*/