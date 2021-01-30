<template>
  <div>
    <div class="reset-password" v-show="pageShowInfo.isForgetpwd === '1'" @click="goReset" v-if="isFreeMember !== 1">
      <div class="icon-header">
        <i class="vip-v3-iconfont">&#xe614;</i>
      </div>
      <div class="body">重置密码</div>
      <div class="icon-footer">
        <i class="vip-v3-iconfont">&#xe60e;</i>
      </div>
    </div>

    <div class="reset-password" @click="goPersonInfo">
      <div class="icon-header">
        <i class="vip-v3-iconfont">&#xe7ec;</i>
      </div>
      <div class="body">个人信息</div>
      <div class="icon-footer">
        <i class="vip-v3-iconfont">&#xe60e;</i>
      </div>
    </div>

    <div class="logout" v-if="isCancel === '1'" :style="{ 'background-color': themeColor }" @click="logout">注销登录</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      urlData: state => state.urlData,
      pageShowInfo: state => state.pageShowInfo
    }),
    user() {
      const userStr = window.localStorage.getItem('urlData');
      if(userStr) {
        return JSON.parse(userStr);
      }
    }
  },
  data() {
    return {
      isCancel: '0',
      isFreeMember: 0,
    }
  },
  mounted() {
    this.getLogoutOrNot();
  },
  methods: {
    getLogoutOrNot() {
      let params = {
        companyKey: this.user.companyKey
      }
      this._http({url: '/jop-web/wxMemberInfo/qryCancel'}, params).then(res => {
        if(res.data.code === 0) {
          this.isCancel = res.data.data.isCancel || '0';
          this.isFreeMember = res.data.data.isFreeMember || 0;
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    goReset() {
      this.$router.push({
        path: '/reset-psd'
      })
    },
    goPersonInfo() {
      this.$router.push({
        path: '/per-info'
      })
    },
    logout() {
      window.localStorage.removeItem(`ticket_${this.urlData.companyKey}`);
      this.$router.replace({
        path: '/home'
      });
    }
  }
}
</script>

<style lang="less" scoped>
.reset-password {
  width: calc(100% - 20px);
  margin: 15px auto;
  border: 1px solid #CCCCCC;
  border-radius: 2.5px;
  background-color: white;
  display: flex;
  height: 44px;
  align-items: center;
  .icon-header {
    width: 50px;
    font-size: 20px;
    text-align: center;
    color: #858585;
  }
  .body {
    flex-basis: 50%;
    flex-grow: 1;
    font-size: 14px;
    color: #858585;
  }
  .icon-footer {
    width: 30px;
    font-size: 17.5px;
    color: #858585;
  }
}
.logout {
  width: calc(100% - 20px);
  margin: 3px auto;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  color: white;
  border-radius: 2.5px;
}
</style>
