<template>
  <article>
    <el-tabs v-model="activeName" :before-leave="TabClick">
      <el-tab-pane label="会员卡设置" name="set">
      </el-tab-pane>
      <el-tab-pane label="会员卡领取记录" name="record">
      </el-tab-pane>
    </el-tabs>
    <router-view/>
  </article>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
})
export default class WxPackage extends Vue {
  private activeName: string = 'set';
  private TabClick(activeName: string, oldActiveName: string) {
    this.$router.push({
      path: `/super-crm/wx-member/member-function/member-package/${activeName}`
    })
  }
  private mounted() {
    // const pathArr = this.$route.path.split('/');
    // this.activeName = pathArr[pathArr.length - 1];
  }
}
</script>

