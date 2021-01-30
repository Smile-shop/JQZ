<template>
  <div>
    <div class="content">
      <AppointList :data="item" v-for="(item, index) in appointRecordList" :key="index"></AppointList>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppointList from '../../components/AppointList';
export default {
  components: {
    AppointList
  },
  computed: {
    ...mapState({
      // appointRecordList: state => state.appoint.appointRecordList
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
      appointRecordList: []
    }
  },
  mounted() {
    this.getAppointRecord();
  },
  methods: {
    getAppointRecord() {
      let params = {
        params: {
          companyKey: this.urlData.companyKey,
          card_no: this.urlData.memberCard
        },
        page: {
          pageSize: 100,
          pageNum: 1
        }
      }
      this._http({url: '/jop-web/reservation/record'}, params).then(res => {
        if(res.data.code === 0) {
          if(res.data.data && res.data.data.total > 0) {
            this.appointRecordList = res.data.data.list;
          } else {
            this.$toast({
              message: '暂无数据！',
              duration: 1000
            })
          }         
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
.content {
  width: 100%;
  height: calc(100vh - 75px);
  overflow: auto;
  -webkit-overflow-scrolling: auto;
}
</style>

