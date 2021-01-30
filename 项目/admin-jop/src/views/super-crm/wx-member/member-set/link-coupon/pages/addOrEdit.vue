<template>
  <div class="add">
    <!-- <div class="mask"></div> -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="活动基本信息" v-if="activeName==0" name="0" />
      <el-tab-pane label="页面配置" v-if="activeName==1" name="1" />
    </el-tabs>
    <base-msg ref="baseMsg" v-show="activeName==0" @formData="getFormData" :data="stepOne" />
    <pageSetting v-show="activeName==1" @pageData="getPageData" :data="stepTwo" ref="pageSeeting" />
    <div class="basis-footer">
      <el-button @click="next" type="primary" plain v-if="activeName=='0'">下一步</el-button>
      <el-button @click="pre" type="primary" plain v-if="activeName=='1'">上一步</el-button>
      <el-button type="primary" v-if="activeName=='1'" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import baseMsg from './child/base.vue';
import pageSetting from './child/pageSetting.vue';
import { postLiandanquan, queryLianDanQuan } from '@/api/super-crm/wx-member';

@Component({
  components: { baseMsg, pageSetting },
})
export default class BasisSet extends Vue {
  private activeName = '0';
  private allData = {};
  private stepOne = {};
  private stepTwo = {};
  private required = false;
  private created() {
    if (this.$route.query.id) {
      this.getDetail();
    }
  }
  private async getDetail() {
    const res: any = await queryLianDanQuan({ id: this.$route.query.id });
    if (!res.code) {
      const data = res.data.yetLiandanquan;
      this.stepOne = {
        couponActivityName: data.couponActivityName,
        endDay: data.endDay,
        time: [data.startTime, data.endTime],
        id: data.id,
        state: data.state,
        strategyList: res.data.yetCoupon,
        storeList: res.data.yetStore.map(
          (item: any) => item.aliasName || item.name
        ),
      };
      this.stepTwo = {
        configurationPage: data.configurationPage,
        theme: data.theme,
        themeClass: data.themeClass,
        themebackground: data.themebackground,
        titlePage: data.titlePage,
      };
    }
  }
  private async save() {
    (this.$refs.pageSeeting as any).save();
    if (this.required) {
      const res: any = await postLiandanquan(this.allData);
      const { code } = res;
      if (!code) {
        this.$message.success('保存成功');
        this.$router.go(-1);
      }
    }
  }
  private next() {
    (this.$refs.baseMsg as any).save();
  }
  private pre() {
    this.activeName = '0';
  }
  private getFormData(val: any) {
    this.required = val.required;
    if (!this.required) {
      return;
    }
    this.activeName = '1';
    this.allData = Object.assign({}, this.allData, val.data);
  }
  private getPageData(val: any) {
    this.required = val.required;
    if (!this.required) {
      return;
    }
    this.allData = Object.assign({}, this.allData, val.data);
    if ((this.allData as any).themeClass !== '0') {
      (this.allData as any).themebackground = '';
    }
  }
  private handleClick(tab: any, event: any) {
    if (tab.name === '1') {
      this.next();
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  position: relative;
  .mask {
    position: absolute;
    width: 100%;
    height: 40px;
    z-index: 100;
  }
}
.basis-footer {
  margin: 30px;
}
</style>


