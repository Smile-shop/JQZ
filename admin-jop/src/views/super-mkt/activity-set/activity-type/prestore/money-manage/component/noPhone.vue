<template>
  <div class="add-card">
    <el-dialog width="560px" :visible.sync="dialognophoneVisible" :before-close="handleClose">
      <div>
        <p>
          <span>
            <i class="el-icon-warning" style="color: #e6a23c; margin-right: 10px;"></i>
          </span>
          <span>您未设置预留手机号，无法进行提现操作，请联系平台客服处理！</span>
        </p>
        <div @click="handleClose" style="text-align: right; margin-top: 30px;">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class NoPhone extends Vue {
  @Prop() dialognophoneVisible!: boolean;

  handleClose() {
    this.$emit('update:dialognophoneVisible', false);
  }
}
</script>

<style lang="scss">
.add-card {
}
</style>