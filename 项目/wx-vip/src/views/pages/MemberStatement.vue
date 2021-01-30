<template>
  <div class="container">
    <!-- <Header :nav-title="'会员声明'"></Header> -->
    <div class="content" v-html="statement"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
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
      statement: ''
    }
  },
  mounted() {
    this.getMemberStatement();
  },
  methods: {
    getMemberStatement() {
      let params = {
        openid: this.user.openid,
        companyKey: this.user.companyKey
      }
      this._http({url: '/jop-web/wxMember/wxMemberExplain'}, params).then(res => {
        if(res.data.code === 0) {
          this.statement = res.data.data.memberExplain;
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: calc(100vh - 75px);
  background-color: white;
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  .content {
    padding: 15px;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
