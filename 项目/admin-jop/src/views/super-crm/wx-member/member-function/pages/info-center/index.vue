<template>
  <article>
    <el-tabs v-model="activeName" :before-leave="TabClick">
      <el-tab-pane label="栏目管理" name="programe">
      </el-tab-pane>
      <el-tab-pane label="资讯管理" name="infomation">
      </el-tab-pane>
    </el-tabs>
    <router-view/>
  </article>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
})
export default class InfoCenter extends Vue {
  private activeName: string = 'programe';
  private TabClick(activeName: string, oldActiveName: string) {
    this.$router.push({
      path: `/super-crm/wx-member/member-function/info-center/${activeName}`
    })
  }
  private mounted() {
    // const pathArr = this.$route.path.split('/');
    // this.activeName = pathArr[pathArr.length - 1];
  }
}
</script>

