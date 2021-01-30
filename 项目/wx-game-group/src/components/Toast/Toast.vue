<template>
   <!-- 全局提示框 -->
   <div v-show="visible" class="dialog-tips dialog-center">
     <div>{{message}}</div>
   </div>
</template>
<script>
export default {
 data() {
  return {
   visible: false,
   message: ""
  };
 }
};
</script>
<style lang="stylus" scoped>
.dialog-tips{
  position: fixed;
  z-index: 100;
  padding: 10px;
  white-space: nowrap;
  background-color: rgba(0,0,0,.6);
  box-shadow: 0px 8px 15px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 40vw;
  border-radius:10px;
  color:#fff;
  .dialog-tips-icon{
    width: 54px;
    height: 54px;
    display: inline-block;
    margin-bottom: 13px;
  }
}
.dialog-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
}
</style>