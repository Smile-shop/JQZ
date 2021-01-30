<template>
  <div class="super-mkt-home">
    <el-card class="box-card">
      <div class="game">
        <p class="game_title">
          <span class="bigTitle">营销游戏</span>
          <span class="smallTip">爆款营销插件，裂变引流吸粉</span>
        </p>
        <div v-for="o in marketingGame" :key="o.name" class="text item" @click="canAccess(o.url)">
          <router-link :to="o.url">
            <div class="img-wrapper">
              <img :src="o.img" alt />
            </div>
            <p class="contentTitle">{{ o.name }}</p>
            <p class="des">{{o.content}}</p>
          </router-link>
        </div>
      </div>
      <div class="getCustomer">
        <p class="game_title">
          <span class="bigTitle">获客拉新</span>
          <span class="smallTip">爆款营销插件，裂变引流吸粉</span>
        </p>
        <div v-for="o in newCustomer" :key="o.name" class="text item" @click="canAccess(o.url)">
          <router-link :to="o.url">
            <div class="img-wrapper">
              <img :src="o.img" alt />
            </div>
            <p class="contentTitle">{{ o.name }}</p>
            <p class="des">{{o.content}}</p>
          </router-link>
        </div>
      </div>
      <div class="saleFriend">
        <p class="game_title">
          <span class="bigTitle">营销裂变</span>
          <span class="smallTip">爆款营销插件，裂变引流吸粉</span>
        </p>
        <div
          v-for="o in distributionFission"
          :key="o.name"
          class="text item"
          @click="canAccess(o.url)"
        >
          <router-link :to="o.url">
            <div class="img-wrapper">
              <img :src="o.img" alt />
            </div>
            <p class="contentTitle">{{ o.name }}</p>
            <p class="des">{{o.content}}</p>
          </router-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { pathCanAccess } from '@/utils/permission';

@Component({
  components: {},
})
export default class SuperMKTNav extends Vue {
  marketingGame = [
    {
      name: '九宫格抽奖',
      content: '九格八奖抽奖神器，快速吸粉，盘活会员',
      img: this.importImg('jgg_entry.png'),
      url: '/super-mkt/activity-set/activity-type/nine/home',
    },
    {
      name: '幸运大翻盘',
      content: '抽奖神奇翻牌抽礼品，快速吸粉，盘活会员',
      img: this.importImg('fp_entry.png'),
      url: '/super-mkt/activity-set/activity-type/playing-card/home',
    },
    {
      name: '老虎机',
      content: '抽奖神器，通过老虎机玩法抽奖得礼品',
      img: this.importImg('lhj_entry.png'),
      url: '/super-mkt/activity-set/activity-type/tiger/home',
    },
    {
      name: '鼠年大翻身',
      content: '老鼠骑猫过任务，有趣好玩赢大奖',
      img: this.importImg('dfs_entry.png'),
      url: '/super-mkt/activity-set/activity-type/rat/home',
    },
    {
      name: '新春翻红包',
      content: '翻牌抽礼品（新年活动），快速吸粉，盘活会员',
      img: this.importImg('xc_entry.png'),
      url: '/super-mkt/activity-set/activity-type/red-envelope/home',
    },
  ];
  newCustomer = [
    {
      name: '人气值千金1.0',
      content: '公众号吸粉神器，打造私域流量池',
      img: this.importImg('rq_entry.png'),
      url: '/super-mkt/activity-set/activity-type/fans/home',
    },
    {
      name: '人气值千金PLUS',
      content: '公众号吸粉神器(升级版)，打造私域流量池',
      img: this.importImg('rq_plus_entry.png'),
      url: '/super-mkt/activity-set/activity-type/fans_plus/home',
    },
    {
      name: '预存有礼',
      content: '付费转化会员，预存金额促进到店消费',
      img: this.importImg('ycyl.png'),
      url: '/prestore/home',
    },
  ];
  distributionFission = [
    {
      name: '裂变分销',
      content: '裂变分销工具，打造爆款引流到店',
      img: this.importImg('fx_entry.png'),
      url: '/fission/home',
    },
  ];

  importImg(url: string): string {
    return require(`@/assets/images/super-mkt/${url}`);
  }

  // 能否进入
  canAccess(url: string): boolean {
    return pathCanAccess(url);
  }
}
</script>

<style lang="scss" scoped>
.super-mkt-home {
  .router-link-exact-active {
    color: #000;
  }
  .text {
    display: inline-block;
    cursor: pointer;
  }
  .game,
  .getCustomer,
  .saleFriend {
    margin-bottom: 50px;
  }
  .game_title {
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 10px;
  }
  .item {
    width: 300px;
    height: 220px;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .img-wrapper {
    width: 300px;
    height: 180px;
    background-color: #eee;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .bigTitle {
    font-size: 18px;
    font-weight: bold;
  }
  .contentTitle {
    font-size: 15px;
    font-weight: bold;
    color: #000;
  }
  .smallTip {
    font-size: 14px;
    color: #999;
    margin-left: 12px;
  }
  .des {
    font-size: 14px;
    color: #999;
    margin-top: 3px;
  }
}
</style>



