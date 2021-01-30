<template>
  <article class="page-setting">
    <el-tabs v-model="activeName">
      <el-tab-pane label="选择模板" name="1">
        <section class="template-select">
          <div class="phone-show">
            <p class="info">【效果预览】</p>
            <div class="phone-content">
              <component :themeColor="themeColor" :isShare="pageStyle.isShare" :data="pageStyle" :menuList="menuList" :pageStyleMenuList="pageStyleMenuList" v-bind:is="currentComponent"></component>
            </div>
          </div>
          <div class="item-set">

            <div class="template-select-img" v-for="(item, index) in pageStyleList" :key="index" :class="{ 'page-img-selected': pageTemplate === item.sort }">
              <img :src="pageStyleImg(item.sort)" alt="v-1">
              <span class="name">模板{{index+1}}</span>
              <el-button @click="pickPageStyle(item)" class="select-btn" size="mini" :type="pageTemplate === item.sort ? 'primary' : 'info'" icon="el-icon-success">选择</el-button>
            </div>

            <el-form ref="form" class="form-content" :model="pageStyle" label-width="100px">
              <el-form-item label="页面标题:">
                <el-input style="width:344px" v-model="pageStyle.title"></el-input>
              </el-form-item>
              <el-form-item label="企业logo:">
                <el-upload
                  class="upload-demo"
                  :headers="uploadOpt"
                  :action="uploadUrl('1')"
                  :show-file-list="false"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  name="imgFile">
                  <el-button size="small" type="primary">上传图片</el-button>
                  <span class="el-upload-tip">图片格式：*jpg、png,尺寸：220px*140px</span>
                </el-upload>
                <div class="img-share">
                  <img :src="pageStyle.logo" alt="logo">
                </div>
              </el-form-item>
              <el-form-item label="推荐颜色:">
                <div class="color-content">
                  <div class="color-item-value" @click="themeColor = item" v-for="item in colorList" :key="item" :style="{'background-color': item}"></div>
                  <div class="color-title">自定义颜色：</div>
                  <el-input v-model="themeColor" style="width:117px;margin-right:12px"></el-input>
                  <el-color-picker v-model="themeColor"></el-color-picker>
                </div>
              </el-form-item>
              <el-form-item label="调整栏目顺序:">
                <div class="info" v-if="pageTemplate === 1">( 注意：此模板下优惠券、电子质保单、积分记录不参与排序 )</div>
                <el-checkbox-group v-model="pageStyleMenuList">
                  <div class="column-item" v-for="(item, index) in menuList" :key="item.functionId">
                    <el-checkbox @click.native="freeTip(item.isAble)" :label="item.functionId" :disabled="item.isAble ? true : false">{{ item.name }}</el-checkbox>
                    <div class="order">
                      <i @click="goNest(0, index)" :class="{'icon-disabled': index === 0}" class="iconfont icon-web__bitebizuojiantou"></i>
                      <i @click="goNest(1, index)" :class="{'icon-disabled': index === (menuList.length-1)}" class="iconfont icon-web__bitebiyoujiantou"></i>
                    </div>
                  </div>
                </el-checkbox-group>
              </el-form-item>
              <!-- <el-form-item label="分享设置:">
                <el-radio-group v-model="pageStyle.isShare">
                  <el-radio label="1">开启分享</el-radio>
                  <el-radio label="2">关闭分享</el-radio>
                </el-radio-group>
              </el-form-item> -->
              <el-form-item label="微客服:">
                <el-checkbox v-model="pageStyle.isOpenService">显示</el-checkbox>
              </el-form-item>
              <el-form-item label="今日金价:">
                <el-checkbox @click.native="freeTip(isFreeMember === 1)" v-model="pageStyle.isShopGold" :disabled="isFreeMember === 1 ? true : false">只展示会员发卡门店金价</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="subPageStyle">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-tab-pane>
      <el-tab-pane label="会员声明" name="2">
        <section class="template-select">
          <div class="phone-show">
            <p class="info">【效果预览】</p>
            <div class="phone-content-state">
              <header>{{memberStatement.title}}</header>
              <div class="content" v-html="statement"></div>
            </div>
          </div>
          <div class="item-set">
            <el-form ref="form" class="form-content" :model="memberStatement" label-width="100px">
              <el-form-item label="声明标题:">
                <el-input style="width:344px" v-model="memberStatement.title"></el-input>
              </el-form-item>
              <el-form-item label="声明内容:">
                <WangEditor ref="ue" :contents="statement"></WangEditor>
              </el-form-item>
              <el-form-item>
                <el-button @click="setMemberStatement" type="primary">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-tab-pane>
    </el-tabs>
    <!-- 免费身份弹窗提示 -->
    <el-dialog
      title="温馨提示"
      :visible.sync="freeDialogVisible"
      width="30%"
      center>
      <span>付费版功能，如需使用，请联系客服购买开通。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="freeDialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import Page1 from './Page1.vue';
import Page2 from './Page2.vue';
import { getPageStyle, setPageStyle, getMemberStatement, setMemberStatement } from '@/api/super-crm/wx-member';
import user from '@/utils/user';
import WangEditor from '@/components/WangEditor.vue'

@Component({
  components: {
    Page1,
    Page2,
    WangEditor
  }
})
export default class HomeModule extends Vue {
  private isFreeMember = null; // 是否免费身份标识
  private freeDialogVisible: boolean = false; // 免费身份弹窗提示
  private activeName: string = '1';
  private pageStyle = {
    title: '',
    isShare: '1',
    logo: '',
    isOpenService: true,
    isShopGold: true
  }
  private colorList = ['#e12f30', '#9e0028', '#f66b77', '#e83b66', '#dbb866', '#e4c589', '#6e73b8', '#f1ae85', '#d9b39b'];
  private pageTemplate = 1;
  private themeColor: string = '';
  private menuList = [];
  private pageStyleMenuList: any[] = [];
  private statement: string = '';

  private pageStyleList = [];

  private memberStatement = {
    title: '',
    explainId: ''
  }

  get currentComponent() {
    return `Page${this.pageTemplate}`;
  }

  // 上传图片header设置
  get uploadOpt() {
    return {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey
    }
  }
  // 上传图片路径
  uploadUrl(type: string): string {
    return `${VUE_APP_BASE_API}/jop-wx-web/wxCompany/uploadCompanyLogo?type=${type}`;
  }

  private uploadSuccess(res: any) {
    if (res.code === 0) {
      this.pageStyle.logo = res.data;
      this.$message({
        type: 'success',
        message: '上传成功！'
      });
    } else {
      this.uploadError();
    }
  }

  private uploadError() {
    this.$message.error('上传失败，请重新上传！');
  }

  private mounted() {
    this.getPageStyle();
    this.getMemberStatement();
    this.isFreeMember = user.serverUser.isFreeMember;
  }

  private pageStyleImg(index: number): string {
    return require(`@/assets/images/super-crm/wx-member/page_style/v_${index}.gif`);
  }

  private getPageStyle() {
    getPageStyle().then((res: any) => {
      this.pageStyleList = res.data.surfaceList || [];
      const pageStyleItem = this.pageStyleList.find((p: any) => p.status === '1');
      this.pageTemplate = (pageStyleItem as any).sort;
      this.themeColor = (pageStyleItem as any).contents;
      this.pageStyle.title = res.data.companyInfo.title || '';
      this.pageStyle.isShare = res.data.companyInfo.isShare || '1';
      this.pageStyle.logo = res.data.companyInfo.logo || '';
      this.pageStyle.isOpenService = res.data.companyInfo.isOpenService === '1';
      // this.pageStyle.isShopGold = res.data.companyInfo.isShopGold === '1';
      // 测试免费身份
      this.pageStyle.isShopGold = this.isFreeMember === 1 ? false : res.data.companyInfo.isShopGold === '1';
      this.menuList = JSON.parse(res.data.companyInfo.viewFunction);

      // 免费会员
      if (this.isFreeMember === 1) {
        this.menuList.map((item: any) => {
          if (item.name === '优惠券' || item.name === '开心小游戏' || item.name === '微好礼' || item.name === '微商城' || item.name === '我的礼品' || item.name === '今日金价' || item.name === '在线预约') {
            item.status = 0;
            item.isAble = true; // 增加是否禁用
          }
        })
      }
      this.pageStyleMenuList = this.menuList.filter((p: any) => p.status === '1').map((p: any) => p.functionId);
    })
  }
  // 免费会员弹窗提示
  private freeTip(isAble: any) {
    if (isAble) {
      this.freeDialogVisible = true;
    }
  }

  private pickPageStyle(data: any) {
    this.pageTemplate = data.sort;
    this.themeColor = data.contents;
  }

  // 菜单左右移动
  private goNest(isRight: number, order: number) {
    if (isRight) {
      if (order < (this.menuList.length - 1)) {
        this.newMenuOrder(1, order, [this.menuList[order + 1], this.menuList[order]]);
      }
    } else {
      if (order > 0) {
        this.newMenuOrder(0, order, [this.menuList[order], this.menuList[order - 1]]);
      }
    }
  }
  private newMenuOrder(isRight: number, order: any, item: any) {
    let beforeItem
    let afterItem
    if (isRight) {
      beforeItem = this.menuList.slice(0,  order);
      afterItem = this.menuList.slice(order + 2);
    } else {
      beforeItem = this.menuList.slice(0,  order - 1);
      afterItem = this.menuList.slice(order + 1)
    }
    this.menuList = beforeItem.concat(item, afterItem);
  }

  private subPageStyle() {
    const viewFunction = this.menuList.map((p: any) => {
      const i = this.pageStyleMenuList.indexOf(p.functionId);
      return `${p.functionId}:${i > -1 ? '1' : '0'}`
    })
    const showMenu = this.menuList.map((p: any) => {
      const i = this.pageStyleMenuList.indexOf(p.functionId);
      return {
        functionId: p.functionId,
        name: p.name,
        status: `${i > -1 ? '1' : '0'}`
      }
    })
    const params = {
      sufaceId: (this.pageStyleList[this.pageTemplate - 1] as any).sufaceId,
      status: '1',
      contents: this.themeColor,
      title: this.pageStyle.title,
      isShare: this.pageStyle.isShare,
      // logo: this.pageStyle.logo.split('/')[1],
      logo: '',
      viewFunction: `{${viewFunction.join(',')}}`,
      isOpenService: this.pageStyle.isOpenService ? '1' : '0',
      isShopGold: this.pageStyle.isShopGold ? '1' : '0',
      // showMenu
    }
    setPageStyle(params).then((res: any) => {
      this.$message({
        message: '保存成功！',
        type: 'success'
      });
    })
  }

  private getMemberStatement() {
    getMemberStatement().then((res: any) => {
      if (res.data.length > 0) {
        this.memberStatement.title = res.data[0].title || '';
        this.memberStatement.explainId = res.data[0].explainId || '';
        this.statement = res.data[0].contents || '';
      }
    })
  }

  private setMemberStatement() {
    const contents = (this.$refs.ue as any).getContent();
    this.statement = contents;
    if (this.memberStatement.title === '') {
      this.$message.warning('声明标题不能为空！');
      return;
    }
    const params = {
      title: this.memberStatement.title,
      contents,
      explainId: this.memberStatement.explainId
    }
    setMemberStatement(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！'
      });
    })
  }
}
</script>

<style lang="scss" scoped>
.page-setting {
  height: calc(100vh - 190px);
  overflow: auto;
  .template-select {
    display: flex;
    .phone-show {
      width: 377px;
      .info {
        width: 377px;
        text-align: center;
        font-family: MicrosoftYaHei-Bold;
        font-size: 16px;
        font-weight: bold;
        color: #409eff;
        padding-bottom: 12px;
      }
      .phone-content {
        width: 377px;
        height: 930px;
        border: solid 1px #dddddd;
      }
      .phone-content-state {
        width: 377px;
        // height: 666px;
        border: solid 1px #dddddd;
        background-color: #f5f5f5;
        header {
          width: 100%;
          height: 44px;
          line-height: 44px;
          background-color: #ffffff;
          text-align: center;
          font-size: 16px;
          color: #333333;
        }
        .content {
          padding: 15px;
          overflow: auto;
        }
      }
    }
    .item-set {
      flex-grow: 1;
      padding-left: 34px;
      .template-select-img {
        display: inline-block;
        width: 145px;
        height: 283px;
        border-radius: 5px;
        border: solid 2px #dddddd;
        text-align: center;
        padding-top: 8px;
        margin-right: 20px;
        position: relative;
        cursor: pointer;
        img {
          width: 134px;
        }
        .name {
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #606266;
        }
        .select-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
        }
      }
      .page-img-selected {
        border: solid 2px #409eff;
      }
      .form-content {
        margin-top: 25px;
        .el-upload-tip {
          font-family: MicrosoftYaHei;
          font-size: 12px;
          color: #999999;
          padding-left: 13px;
        }
        .img-share {
          border-radius: 4px;
          background-color: #dddddd;
          width: 336px;
          height: 74px;
          margin-top: 12px;
          img {
            height: 100%;
          }
        }
        .color-content {
          display: flex;
          .color-item-value {
            display: inline-block;
            width: 40px;
            height: 40px;
            cursor: pointer;
          }
          .color-title {
            padding-left: 12px;
            font-size: 14px;
            color: #606266;
          }
        }
        .info {
          font-size: 12px;
          color: red;
        }
        .column-item {
          display: inline-block;
          width: 112px;
          text-align: center;
          .order {
            width: 100px;
            display: flex;
            justify-content: space-around;
            height: 24px;
            visibility: hidden;
            > i {
              font-size: 24px;
              cursor: pointer;
              color: rgb(51, 122, 183);
            }
            .icon-disabled {
              color: #999999;
            }
          }
        }
        .column-item:hover {
          .order {
            visibility: visible;
          }
        }
      }
    }
  }
}
</style>


