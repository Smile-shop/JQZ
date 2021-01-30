<template>
  <div class="add-active">
    <div class="text-box">
      <span>活动标题:</span>
      <input type="text" v-model="activeTitle" />
      <button @click="addActivetitle">保存</button>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      activeTitle: '',
      Tip: ''
    }
  },
  methods: {
    addActivetitle() {
      const reg = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+$')
      if (!reg.test(this.activeTitle)) {
        this.$message.error('请输入合法字符且输入内容不能为空！')
      } else {
        this.$emit('checkTitleSuccess', this.activeTitle)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-active {
  .tip {
    color: #ff5317;
    font-size: 16px;
    padding-left: 50px;
  }
  .text-box {
    padding-left: 20px;
    margin-top: 30px;
    & input {
      width: 350px;
      height: 38px;
      line-height: 38px;
      margin-left: 10px;
      border: solid 1px #dcdfe6;
      border-radius: 5px;
      padding-left: 10px;
      font-size: 15px;
    }
    & button {
      border: none;
      width: 196px;
      height: 40px;
      background: #409eff;
      border: none;
      border-radius: 5px;
      color: #fff;
      margin-left: 20px;
    }
  }
  .btn {
    text-align: center;
    margin-top: 67px;
    margin-bottom: 15px;
  }
  & ul {
    height: 46px;
    color: #409efe;
    font-size: 14px;
    background: #f5f7fa;
    display: flex;
    width: 96%;
    margin: 0 auto;
    list-style: none;

    & li {
      line-height: 46px;
      flex: 1;
      text-align: center;
    }
    .second-step {
      color: #ccc;
    }
  }
}
</style>
