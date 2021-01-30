<template>
  <div class="follow-count">
    <div class="follow-left">
      <div class="left-title">预览</div>
      <div class="follow-img">
        <img src="~@/assets/images/super-crm/point-mall/qrcode.png" alt="">
      </div>
    </div>
    <div class="follow-right">
      <div class="right-title">编辑</div>
      <div class="right-content">
        <div class="check">
          <el-radio-group v-model="radio">
            <el-radio :label="1">进入页面即提示</el-radio>
            <el-radio :label="2">兑换后提示</el-radio>
            <el-radio :label="3">不提示</el-radio>
          </el-radio-group>
        </div>
        <p class="content-tip">温馨提示:顾客不关注公众号，无法使用微会员的所有功能、无法收到消息通知、无法聊天等;</p>
        <div class="content-footer"><el-button type="primary" @click="save">保存</el-button></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { followCountTip, searchCountResublt } from '@/api/super-crm/point-mall'

@Component({})
export default class FollowCount extends Vue {
  radio = 1
  mounted() {
    this.searchResult()
  }
  searchResult() {
    console.log('查询设置结果')
    searchCountResublt().then(res => {
      console.log('查询', res)
      const { data } = res
      console.log('数据shareGuide', data.shareGuide)
      this.radio = Number(data.shareGuide)
    })
  }
  save() {
    console.log('保存', this.radio)
    const params = {
      shareGuide: String(this.radio)
    }
    followCountTip(params).then((res: any) => {
      console.log('保存', res)
      const { msg } = res
      this.$message({
        type: 'success',
        message: msg,
      })
      this.searchResult()
    })
  }
}
</script>

<style lang="scss" scoped>
.follow-count {
  display: flex;
}

.follow-left {
  height: 780px;
  width: 400px;
  border: 1px solid #eee;
  margin-right: 60px;
  border-radius: 5px;
}

.follow-img {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.follow-right {
  height: 780px;
  flex: 1;
  border: 1px solid #eee;
  border-radius: 5px;
}

.right-title, .left-title {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
  border-radius: 5px;
  padding-left: 10px;
}

.right-content {
  padding-left: 10px;
}

.check {
  margin-top: 40px;
}

.content-tip {
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}

.content-footer {
  margin-top: 50px;
}

</style>