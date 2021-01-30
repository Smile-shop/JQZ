<template>
  <div class="consult">
    <div class="consult-column">
      <div class="consult-list">
        <div 
          class="consult-item" 
          @click="getNewsList(index, item.id)" 
          :class="{ 'selected-consult-item': consultIndex === index }" 
          v-for="(item, index) in consultNewsList" 
          :key="index">{{ item.name }}</div>
      </div>
    </div>

    <div class="consult-details-list">
      <div class="list-item" v-for="(item, index) in newsList" :key="index" @click="goDetails(item)">
        <div class="item-left">
          <div class="title">{{ item.title }}</div>
          <div class="details">{{ item.summary }}</div>
        </div>
        <div class="item-right" v-show="item.summaryImg != ''">
          <img :src="item.summaryImg" alt="图片">
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  components: {
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      urlData: state => state.urlData
    })
  },
  data() {
    return {
      consultIndex: 0,
      consultNewsList: [],
      newsList: []
    }
  },
  mounted() {
    this.getNewsCategoryList();
    this.getNewsList(0, null);
  },
  methods: {
    getNewsCategoryList() {
      let params = {
        companyKey: this.urlData.companyKey
      }
      this._http({url: '/jop-wx-web/news/category'}, {}).then(res => {
        if(res.data.code === 0) {
          let resData = res.data.data;
          this.consultNewsList = [{
            id: null,
            name: '全部'
          }]
          if(resData) {
            this.consultNewsList = this.consultNewsList.concat(resData)
          }
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    goDetails(data) {
      this.$router.push({
        path: `/consult-details/${data.id}`
      })
    },
    getNewsList(index, id) {
      this.consultIndex = index;
      let params = {
        companyKey: this.urlData.companyKey,
        categoryId: id,
        pageNum: 1,
        pageSize: 100
      }
      this._http({url: '/jop-wx-web/news/list'}, params).then(res => {
        if(res.data.code === 0) {
          let resData = res.data.data;
          if(resData) {
            this.newsList = resData.list || [];
          } else {
            this.newsList = [];
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
.consult {
  .consult-column {
    width: 100vw;
    background-color: white;
    height: 35px;
    .consult-list {
      // display: box;
      display: -webkit-box;
      overflow-x: scroll;
      -webkit-overflow-scrolling:touch;
      .consult-item {
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        padding: 0 10px;
        text-align: center;
        color: #666666;
      }
      .selected-consult-item {
        color: #d41010;
      }
    }
  }
  .consult-details-list {
    width: 100vw;
    margin-top: 5px;
    height: calc(100vh - 65px);
    overflow: auto;
    -webkit-overflow-scrolling: auto;
    .list-item {
      background-color: white;
      margin-top: 1px;
      padding-bottom: 5px;
      display: flex;
      .item-left {
        flex-basis: 60%;
        flex-grow: 1;
        .title {
          font-size: 14px;
          color: #333333;
          padding: 8px 12.5px 0 12.5px;
        }
        .details {
          font-size: 10px;
          color: #999999;
          padding: 5px 12.5px 0 12.5px;
        }
      }
      .item-right {
        width: 110px;
        text-align: center;
        img {
          width: 100px;
          height: 74px;
          padding-top: 5px;
        }
      }
    }
  }
}
</style>
