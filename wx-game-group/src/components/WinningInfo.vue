<template>
  <transition-group class="winning-info" tag="ul" name="winning-info">
    <li v-for="(item) of GiftRecords " :key="item.id">
      <img :src="item.value.imgUrl" v-if="item.value.imgUrl" />
      {{item.value.record}}
    </li>
  </transition-group>
</template>
<script>
import { mapState } from 'vuex'
import { giftRecords } from '@/axios/api.js'
export default {
  components: {},
  props: {},
  data() {
    return {
      GiftRecords: [],
      status: true,
      timer: '',
      Timeout: ''
    }
  },

  //监控data中的数据变化
  computed: {
    ...mapState({
      ActiveData: state => state.game.GameActiveData,
      Winning: state => state.game.Winning
    })
  },
  //方法集合
  methods: {
    animation() {
      if (this.GiftRecords) {
        let len = this.GiftRecords.length - 1
        this.timer = setInterval(() => {
          let dataArray = this.GiftRecords.splice(0, 1)
          this.Timeout = setTimeout(() => {
            if (Array.isArray(dataArray)) {
              this.GiftRecords[len] = dataArray[0]
            }
          }, 1000)
        }, 3000)
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    let activeId =
      this.ActiveData.id || this.ActiveData.activityId || this.$route.query.id
    if (activeId) {
      let body = { activeId: activeId }
      //小游戏中奖纪录列表
      giftRecords(body)
        .then(res => {
          let { data, code } = res
          if (code == 0) {
            if (data.list) {
              this.GiftRecords = data.list.map((val, i) => {
                return { value: val, id: i }
              })
              this.animation()
            }
          }
        })
        .catch(err => {
          this.$toast(err)
        })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearTimeout(this.Timeout)
  }
}
</script>
<style lang='stylus' scoped>
.winning-info {
  position: relative;
  overflow: hidden;
  overflow-clip-box: 'padding-box';
  padding: 2.7vw;
  padding-top: 9vw;
  height: 31vw;
  font-size: 3.2vw;
  color: #fff;
  background: url('../assets/images/jb-jgg-icon.png') no-repeat;
  background-size: 20% 60%;
  background-position: 95% 80%;

  & > li {
    margin-bottom: 1.8vw;
    transition: all 1s;
    font-size: 3vw;

    &.winning-info-leave-active {
      position: absolute;
    }

    &.winning-info-leave, &.winning-info-leave-to {
      transform: translateX(10vw);
      opacity: 0;
    }

    &.winning-info-enter {
      transform: translateY(10vw);
      opacity: 0;
    }

    img {
      width: 7vw;
      height: 7vw;
      vertical-align: middle;
      margin: 3px;
      border-radius: 3px;
    }
  }
}
</style>