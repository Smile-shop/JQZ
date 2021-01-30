<template>
  <article class="wx-page-b">
    <header class="header"><i class="el-icon-close"></i>{{data.title}}</header>
    <section class="body">
      <div class="home">
        <div class="home-content" :style="{ 'background-color': themeColor }">
          <div class="title">
            <div class="logo">
              <img v-if="data.logo" :src="data.logo" alt="logo">
              <img v-else src="@/assets/images/super-crm/wx-member/v3-vip-logo.png" alt="logo">
            </div>
            <div class="actions">
              <i v-if="isShare === '1'" class="iconfont icon-fenxiang"></i>
            </div>
          </div>

          <div class="user-photo">
            <div class="img">
              <img src="@/assets/images/super-crm/wx-member/admin-user.png" alt="user-photo">
            </div>
            <div class="name">
              15999999999
            </div>
          </div>

        </div>

        <div class="decript" :style="{ 'background-color': themeColor }">
          <img src="@/assets/images/super-crm/wx-member/v3-vip-tb.png" alt="decript">
          <div class="qr">
            <i :style="{ 'color': themeColor }" class="iconfont icon-erweima"></i>
          </div>
        </div>

        <div class="package-link">
          <div class="icon"></div>
          <div :style="{ 'color': themeColor }">将我的会员卡放入我的 - 卡包</div>
          <div class="icon"><i class="iconfont icon-you"></i></div>
        </div>

        <div class="user-state">
          <div class="state-item">
            <div class="p1">会员等级</div>
            <div class="p2" :style="{ 'color': themeColor }">普通会员</div>
          </div>
          <div class="state-item">
            <div class="p1">累计积分</div>
            <div class="p2" :style="{ 'color': themeColor }">1089632</div>
          </div>
          <div class="state-item">
            <div class="p1">可用积分</div>
            <div class="p2" :style="{ 'color': themeColor }">32586</div>
          </div>
        </div>

        <div class="user-state">
          <div class="state-item" v-if="aShow">
            <div class="p-icon">
              <i :style="{ 'color': themeColor }" class="iconfont icon-youhuiquan"></i>
            </div>
            <div class="sub-right-top" :style="{ 'background-color': themeColor }">2</div>
            <div class="p-icon-name">优惠券</div>
          </div>
          <div class="state-item" v-if="bShow">
            <div class="p-icon">
              <i :style="{ 'color': themeColor }" class="iconfont icon-jifen1"></i>
            </div>
            <div class="p-icon-name">积分记录</div>
          </div>
          <div class="state-item" v-if="cShow">
            <div class="p-icon">
              <i :style="{ 'color': themeColor }" class="iconfont icon-baodan1"></i>
            </div>
            <div class="p-icon-name">微保单</div>
          </div>
        </div>

        <div class="list">
          <div v-for="(item, index) in menuList" :key="index">
            <div class="item-pages" v-if="page2Item(item) && isSelected(item)">
              <div class="item-header" :style="{ 'color': themeColor }">
                <i class="iconfont icon-fuwushengming" v-if="item.name === '会员声明'"></i>
                <i class="iconfont icon-mendianditu" v-if="item.name === '附近门店'"></i>
                <i class="iconfont icon-price" v-if="item.name === '今日金价'"></i>
                <i class="iconfont icon-yuyue1" v-if="item.name === '在线预约'"></i>
                <i class="iconfont icon-shezhi1" v-if="item.name === '系统设置'"></i>
                <i class="iconfont icon-duihuan" v-if="item.name === '微好礼'"></i>
                <i class="iconfont icon-gouwuche" v-if="item.name === '微商城'"></i>
                <i class="iconfont icon-manyidutiaocha" v-if="item.name === '满意度调研'"></i>
                <i class="iconfont icon-zixun1" v-if="item.name === '资讯中心'"></i>
                <i class="iconfont icon-qiandao" v-if="item.name === '今日签到'"></i>
                <i class="iconfont icon-youxi" v-if="item.name === '开心小游戏'"></i>
                <i class="iconfont icon-iconfuxing_lipin" v-if="item.name === '我的礼品'"></i>
              </div>
              <div class="item-body">
                {{ item.name }}
              </div>
              <div class="item-footer">
                <i class="iconfont icon-you"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="wx-chat-div" :style="{'background-color': themeColor}" v-show="data.isOpenService">
          <img src="@/assets/images/super-crm/wx-member/servicer-icon.png" alt="service">
          客服
          <div class="close-icon" :style="{'border': `1px solid ${themeColor}`}">
            <i class="el-icon-close" :style="{'color': themeColor}"></i>
          </div>
        </div>
        
      </div>
    </section>
    <footer class="footer">技术支持：金千枝网络技术中心</footer>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({
})
export default class PageB extends Vue {
  @Prop({default: '#e12f30'})
  themeColor!: string
  @Prop()
  menuList!: []
  @Prop()
  pageStyleMenuList!: []
  @Prop()
  isShare!: string
  @Prop()
  data!: any

  private aShow: boolean = true;
  private bShow: boolean = true;
  private cShow: boolean = true;

  @Watch('pageStyleMenuList')
  onpageStyleMenuListChanged(val: any, oldVal: any) {
    this.aShow = val.includes(10);
    this.bShow = val.includes(5);
    this.cShow = val.includes(1);
  }

  private page2Item(item: any): boolean {
    return !(item.name === '微保单' || item.name === '优惠券' || item.name === '积分记录');
  }

  private isSelected(item: any): boolean {
    return this.pageStyleMenuList.findIndex((p: any) => p === item.functionId) > -1;
  }
}
</script>

<style lang="scss" scoped>
.wx-page-b {
  height: 100%;
  position: relative;
  background-color: #f5f5f5;
  .header {
    position: absolute;
    width: 375px;
    height: 44px;
    line-height: 44px;
    background-color: #eeeeee;
    font-size: 16px;
    color: #333333;
    i {
      margin: 0 5px;
    }
  }
  .body {
    position: absolute;
    top: 44px;
    width: 100%;
    height: calc(100% - 75px);
    overflow: auto;
    .home {
      width: 100%;
      .home-content {
        height: 160px;
        .title {
          height: 67.5px;
          display: flex;
          .logo {
            flex-basis: 50%;
            flex-grow: 1;
            padding: 10px 20px;
            img {
              width: 110px;
              height: 70px;
            }
          }
          .actions {
            height: 67.5px;
            line-height: 60px;
            width: 60px;
            text-align: center;
            font-size: 20px;
            color: white;
          }
        }
        .user-photo {
          width: 100%;
          .img {
            background-color: white;
            width: 60px;
            text-align: center;
            padding-top: 2px;
            border-radius: 30px;
            height: 58px;
            margin: 0 auto;
            img {
              width: 55px;
              border-radius: 27.5px;
              pointer-events: none;
            }
          }
          .name {
            text-align: center;
            color: white;
            font-size: 14px;
            padding-top: 6px;
          }
        }
        .login {
          width: 100%;
          padding-top: 25px;
          color: white;
          text-align: center;
          div {
            display: inline-block;
            width: 105px;
            height: 36px;
            line-height: 36px;
            font-size: 16px;
            border-radius: 18px;
          }
          .login-btn {
            background-color: white;
          }
          .register-btn {
            background-color: #FF8D47;
          }
        }
      }
      .decript {
        width: 100%;
        height: 50px;
        position: relative;
        img {
          width: 100%;
          height: 38.5px;
          position: absolute;
          bottom: 0px;
          pointer-events: none;
        }
        .qr {
          width: 30px;
          height: 30px;
          background-color: white;
          border-radius: 15px;
          text-align: center;
          line-height: 30px;
          position: absolute;
          top: 15px;
          left: calc((100% - 30px) / 2);
          font-size: 15px;
        }
      }

      .package-link {
        background-color: white;
        // margin-top: 9px;
        border-bottom: 1px solid #F2F6FC;
        display: flex;
        align-items: center;
        height: 45px;
        justify-content: space-between;
        font-size: 12px;
        .icon {
          width: 30px;
          text-align: center;
          i {
            font-size: 12px;
            color: #C0C4CC;
          }
        }
      }

      .user-state {
        width: 100%;
        background-color: white;
        display: flex;
        margin-bottom: 10px;
        .state-item {
          flex-basis: 30%;
          flex-grow: 1;
          text-align: center;
          position: relative;
          .sub-right-top {
            position: absolute;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            line-height: 15px;
            text-align: center;
            color: white;
            top: 5px;
            right: 25px;
          }
          .p1 {
            font-size: 14px;
            padding: 6px;
            color: #858585;
          }
          .p2 {
            font-size: 16px;
            padding-bottom: 12px;
          }
          .p-icon {
            font-size: 30px;
            padding: 12px;
            i {
              font-size: 30px;
            }
          }
          .p-icon-name {
            font-size: 15px;
            color: #858585;
            padding-bottom: 15px;
          }
        }
      }
      .columns {
        width: 100%;
        height: 10px;
      }
      .list {
        width: 100%;
      }
      .item-pages {
        background-color: white;
        margin-top: 1px;
        height: 40px;
        display: flex;
        align-items: center;
        .item-header {
          width: 50px;
          text-align: center;
          font-size: 25px;
        }
        .item-body {
          flex-basis: 50%;
          flex-grow: 1;
          color: #858585;
          font-size: 14px;
        }
        .item-footer {
          width: 40px;
          text-align: center;
          color: #858585;
          font-size: 12px;
          i {
            font-size: 12px;
            color: #C0C4CC;
          }
        }
      }
      .wx-chat-div {
        position: absolute;
        bottom: 50px;
        right: 20px;
        width: 80px;
        height: 40px;
        line-height: 40px;
        padding: 5px 12px;
        border-radius: 40px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-around;
        img {
          width: 20px;
        }
        .close-icon {
          position: absolute;
          right: 0;
          top: -8px;
          background-color: #ffffff;
          width: 16px;
          height: 16px;
          line-height: 10px;
          border-radius: 50%;
          text-align: center;
        }
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    height: 32px;
    line-height: 32px;
    color: #d5d5d5;
    font-size: 12px;
  }
}
</style>
