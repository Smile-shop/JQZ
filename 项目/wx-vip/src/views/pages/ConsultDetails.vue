<template>
  <div class="consult-details">
    <div class="consult-content">
      <div class="title">{{ newsData.title }}</div>

      <div class="info">
        <span class="name">{{ newsData.name }}</span>
        <span>{{ new Date(newsData.createdTime).format('yyyy-MM-dd hh:mm:ss') }}</span>
      </div>

      <div class="content">
        <div v-html="htmlDecodeByRegExp(newsData.content)"></div>
      </div>
    </div>
    
    <div class="mask" v-if="mask">
      <div class="loadEffect">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
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
      mask: true,
      newsData: {
        title: '',
        name: '',
        createdTime: 0,
        content: ''
      }
    }
  },

  mounted() {
     const params = {
      companyKey: this.urlData.companyKey,
      openid: this.urlData.openid,
      id: this.$route.params.id
    }
    console.log('文章详情具体页面获取数据', params)
    this.getNewsDetails(this.$route.params.id);
  },

  methods: {
    // 分享信息
    toShareInfo(data) {
      const params = {
        companyKey: this.urlData.companyKey,
        openid: this.urlData.openid,
        id: this.$route.params.id,
        title: data.title,
        desc: data.summary,
        shareImg: data.summaryImg,
      }
      console.log('被分享的信息', params)
     setTimeout(() => {
        this.$store.dispatch('articleShare', params);
        this.mask = false
     }, 2000)
    },
    /*2.用正则表达式实现html解码*/
    htmlDecodeByRegExp: function(str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&amp;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "'");
      s = s.replace(/&quot;/g, '"');
      return s;
    },
    getNewsDetails(id) {
      let params = {
        companyKey: this.urlData.companyKey,
        id: id
      }
      this._http({url: '/jop-wx-web/news/detail'}, params).then(res => {
        if(res.data.code === 0) {
          this.newsData = res.data.data;
          this.toShareInfo(res.data.data)
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
.consult-details {
  .consult-content {
    width: 100vw;
    height: calc(100vh - 30px);
    background-color: white;
    overflow: auto;
    -webkit-overflow-scrolling: auto;
    .title {
      text-align: center;
      font-size: 14px;
      color: #000000;
      padding-top: 19px;
      font-weight: bold;
      letter-spacing: 2.5px;
    }
    .info {
      padding: 10.5px 12.5px;
      font-size: 12px;
      color: #999999;
      .name {
        padding-right: 8px;
      }
    }
    .content {
      overflow: auto;
      -webkit-overflow-scrolling: auto;
      width: 100%;
      height: calc(100vh - 105px);
      div {
        padding: 20px 10px;
        font-size: 12px;
        color: #000000;
        line-height: 20px;
      }
    }
  }

.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.loadEffect {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            transform: translate(-50%, -50%);
        }
.loadEffect span{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgb(36, 98, 167);
    position: absolute;
    -webkit-animation: load 1.04s ease infinite;
}
@-webkit-keyframes load{
    0%{
        opacity: 1;
    }
    100%{
        opacity: 0.2;
    }
}
.loadEffect span:nth-child(1){
    left: 0;
    top: 50%;
    margin-top:-8px;
    -webkit-animation-delay:0.13s;
}
.loadEffect span:nth-child(2){
    left: 14px;
    top: 14px;
    -webkit-animation-delay:0.26s;
}
.loadEffect span:nth-child(3){
    left: 50%;
    top: 0;
    margin-left: -8px;
    -webkit-animation-delay:0.39s;
}
.loadEffect span:nth-child(4){
    top: 14px;
    right:14px;
    -webkit-animation-delay:0.52s;
}
.loadEffect span:nth-child(5){
    right: 0;
    top: 50%;
    margin-top:-8px;
    -webkit-animation-delay:0.65s;
}
.loadEffect span:nth-child(6){
    right: 14px;
    bottom:14px;
    -webkit-animation-delay:0.78s;
}
.loadEffect span:nth-child(7){
    bottom: 0;
    left: 50%;
    margin-left: -8px;
    -webkit-animation-delay:0.91s;
}
.loadEffect span:nth-child(8){
    bottom: 14px;
    left: 14px;
    -webkit-animation-delay:1.04s;
}
}
</style>
