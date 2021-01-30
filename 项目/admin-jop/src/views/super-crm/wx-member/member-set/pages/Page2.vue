<template>
  <article class="wx-page-a">
    <header class="header"><i class="el-icon-close"></i>{{data.title}}</header>
    <section class="body">
      <div class="home-1">
        <div class="header">
          <div class="header-1" :style="{ 'background-color': themeColor }">
            <img src="@/assets/images/super-crm/wx-member/home-1-bj-1.png" alt="背景图片">
          </div>
          <div class="header-2"></div>

          <div class="title">
            <div>
              <img v-if="data.logo" :src="data.logo" alt="logo">
              <img v-else src="@/assets/images/super-crm/wx-member/v3-vip-logo.png" alt="logo">
            </div>
            <div>
              <i v-if="isShare === '1'" class="iconfont icon-fenxiang"></i>
            </div>
          </div>

          <div class="header-content">
            <div class="login-content">
              <div class="user-photo">
                <div class="img">
                  <img src="@/assets/images/super-crm/wx-member/admin-user.png" alt="user-photo">
                </div>
                <div class="name">
                  159****9999
                  <i class="iconfont icon-erweima" :style="{ 'color': themeColor }"></i>
                </div>
                <div class="user-level">
                  <i class="iconfont icon-dengji-copy" :style="{ 'color': themeColor }"></i>
                  普通会员
                </div>
              </div>
              <div class="number-totle">
                <div class="item">
                  累计积分：
                  <span :style="{ 'color': themeColor }">1089632</span>
                </div>
                <div class="col"></div>
                <div class="item">
                  可用积分：
                  <span :style="{ 'color': themeColor }">1089632</span>
                </div>
              </div>
            </div>

          </div>

          <div class="package-link">
            <div class="icon"></div>
            <div :style="{ 'color': themeColor }">将我的会员卡放入我的 - 卡包</div>
            <div class="icon"><i class="iconfont icon-you"></i></div>
          </div>

          <div class="menu-list">
            <div class="menu-item" v-for="item in indexPageMenu" :key="item.functionId">
              <div class="sub" :style="{ 'background-color': themeColor }" v-if="`${item.name}`.includes('优惠券')">2</div>
              <div class="name">
                <i class="iconfont icon-baodan1" :style="{ 'color': themeColor }" v-if="`${item.name}`.includes('电子质保单')"></i>
                <i class="iconfont icon-fuwushengming" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('会员声明')"></i>
                <i class="iconfont icon-price" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('今日金价')"></i>
                <i class="iconfont icon-mendianditu" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('附近门店')"></i>
                <i class="iconfont icon-shezhi1" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('系统设置')"></i>
                <i class="iconfont icon-jifen1" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('积分记录')"></i>
                <i class="iconfont icon-manyidutiaocha" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('满意度调研')"></i>
                <i class="iconfont icon-zixun1" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('资讯中心')"></i>
                <i class="iconfont icon-yuyue1" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('在线预约')"></i>
                <i class="iconfont icon-youhuiquan" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('优惠券')"></i>
                <i class="iconfont icon-qiandao" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('今日签到')"></i>
                <i class="iconfont icon-youxi" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('开心小游戏')"></i>
                <i class="iconfont icon-iconfuxing_lipin" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('我的礼品')"></i>
                <i class="iconfont icon-duihuan" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('微好礼')"></i>
                <i class="iconfont icon-gouwuche" :style="{ 'color': themeColor }" v-else-if="`${item.name}`.includes('微商城')"></i>
                <i class="iconfont icon-yuyue1" :style="{ 'color': themeColor }" v-else></i>
                <p>{{ item.name }}</p>
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
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class PageA extends Vue {
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

  get indexPageMenu() {
    return this.menuList.filter((p: any) => {
      return this.isSelected(p);
    });
  }

  private isSelected(item: any): boolean {
    return this.pageStyleMenuList.findIndex((p: any) => p === item.functionId) > -1;
  }
}
</script>

<style lang="scss" scoped>
.wx-page-a {
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
    .home-1 {
      width: 100%;
      .header {
        width: 100%;
        height: 255px;
        position: relative;
        .header-1 {
          width: 100%;
          height: 194.5px;
          img {
            width: 100%;
            height: 195px;
          }
        }
        .header-2 {
          width: 100%;
          height: 60px;
          background-color: white;
        }
        .title {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 55px;
          display: flex;
          align-items: center;
          div:first-child {
            flex-basis: 50%;
            flex-grow: 1;
            padding-left: 14px;
            // background-color: gold;
            padding-top: 40px;
            img {
              width: 110px;
              height: 70px;
            }
          }
          div:last-child {
            width: 87.5px;
            text-align: right;
            .iconfont {
              font-size: 20px;
              color: white;
              padding-right: 15px;
            }
          }
        }
        .header-content {
          position: absolute;
          top: 55px;
          left: 0;
          width: 100%;
          height: 200px;
          .unlogin-content {
            width: 350px;
            height: 154px;
            margin: 22px auto;
            // background-color: white;
            // background: url('@/assets/images/super-crm/wx-member/home-1-bg-2.png') 0 0 no-repeat;
            background-size: 100% 100%;
            box-shadow: 0 0 10px 0 rgba(6, 0, 1, 0.1);
            border-radius: 5px;
            text-align: center;
            p {
              font-size: 16px;
              padding-top: 42px;
            }
            .content-btn {
              display: flex;
              justify-content: center;
              div {
                width: 105px;
                height: 36px;
                line-height: 36px;
                font-size: 14px;
                border-radius: 18px;
                margin: 17.5px 10px;
              }
              .login-btn {
                background-color: white;
                border: solid 1px #eeeeee;
              }
              .register-btn {
                color: white;
              }
            }
          }
          .login-content {
            padding-top: 10px;
            .user-photo {
              width: 100%;
              height: 145px;
              .img {
                background-color: white;
                width: 80px;
                padding-top: 2px;
                text-align: center;
                border-radius: 40px;
                margin: 0 auto;
                height: 85px;
                img {
                  width: 75px;
                  border-radius: 37.5px;
                  pointer-events: none;
                }
              }
              .name {
                text-align: center;
                color: #333333;
                font-size: 16px;
                box-shadow: 0px 0px 10px 0px rgba(6, 0, 1, 0.05);
                border-radius: 15px;
                height: 30px;
                line-height: 30px;
                width: 160px;
                margin: 0 auto;
                .iconfont {
                  font-size: 19px;
                }
              }
              .user-level {
                font-size: 12px;
                color: #999999;
                text-align: center;
                height: 32px;
                line-height: 32px;
                .iconfont {
                  font-size: 17.5px;
                }
              }
            }
            .number-totle {
              width: 100%;
              height: 45px;
              border-top: 1px solid #eeeeee;
              display: flex;
              align-items: center;
              .item {
                flex-basis: 45%;
                flex-grow: 1;
                text-align: center;
                font-size: 12px;
                color: #666666;
              }
              .col {
                width: 1px;
                height: 45px;
                border-left: 1px solid #eeeeee;
              }
            }
          }
        }
        .package-link {
          background-color: white;
          margin-top: 9px;
          display: flex;
          align-items: center;
          height: 45px;
          justify-content: space-between;
          .icon {
            width: 30px;
            text-align: center;
            i {
              font-size: 12px;
            }
          }
        }
        .menu-list {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          height: calc(100% - 290px);
          .menu-item {
            width: calc((100% - 3px) / 3);
            height: 100px;
            background-color: white;
            margin-top: 1px;
            position: relative;
            .sub {
              position: absolute;
              right: 10px;
              top: 9px;
              background-color: red;
              width: 15px;
              text-align: center;
              line-height: 15px;
              height: 15px;
              border-radius: 50%;
              color: white;
              font-size: 12px;
            }
            .name {
              text-align: center;
              padding-top: 12px;
              .iconfont {
                font-size: 30px;
              }
              p {
                font-size: 14px;
                color: #666666;
              }
            }
          }
          .menu-item:nth-of-type(3n + 2) {
            margin-left: 1px;
            margin-right: 1px;
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
