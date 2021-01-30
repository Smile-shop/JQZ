<template>
  <article class="qr-code">
    <el-tabs v-model="activeName">
      <el-tab-pane label="门店推广二维码" name="1">
        <div v-if="false" class="template salesman">
          <header>
            <h3>
              <strong>
                选择模板
              </strong>
            </h3>
          </header>
          <div class="content">
            <div>
              <div
                class="top"
                :class="{
                  top: true,
                  active: shopCheckedTemplateIndex == '1',
                }"
              >
                <img src="~@/assets/images/super-crm/wx-member/template-1.png" alt="">
              </div>
              <div class="bottom">
                <el-radio v-model="shopCheckedTemplateIndex" label="1">
                  <span>
                    模板
                  </span>
                  1
                </el-radio>
              </div>
            </div>
          </div>
        </div>
        <div class="template shop">
          <header>
            <h3>
              <strong>
                选择背景
              </strong>
              （图片格式：*jpg、png，尺寸：<mark>945px*1337px</mark>）
            </h3>
            <ul>
              <li>
                1、背景不含企业logo，需下载背景后根据需要放置在相应位置。
              </li>
              <li>
                2、门店名称将在二维码下方自动生成。
              </li>
            </ul>
          </header>
          <div class="content">
            <div class="upload-file">
              <div class="top">
                <input
                  type="file"
                  accept="image/*"
                  @change="uploadBackground($event, '1')"
                >
                <div class="tip">
                  <div class="icon">+</div>
                  <div class="text">
                    上传背景
                  </div>
                </div>
              </div>
              <div class="bottom">
                自定义
              </div>
            </div>

            <div
              class="background-list"
              v-for="(item, index) of shopQrcodeBackgroundList"
              :key="index"
            >
              <div
                class="top"
                :class="{
                  top: true,
                  active: shopCheckedBackgroundIndex === index,
                }"
                :style="{
                  backgroundImage: `url(${item.imgUrl})`,
                }"
              >
                <div class="control-group">
                  <div
                    class="preview"
                    @click="previewBackground(index, {
                      source: '1'
                    })"
                  >
                    <i class="iconfont icon-fangda"></i>
                    <span>预览</span>
                  </div>
                  <div
                    v-if="item.isDefault == 0"
                    class="delete"
                    @click="deleteBackground(index, '1')"
                  >
                    <i class="iconfont icon-lajitong"></i>
                    <span>删除背景</span>
                  </div>
                  <div
                    v-else
                    class="download"
                    @click="downBackground(index, '1')"
                  >
                    <i class="iconfont icon-xiazai"></i>
                    <span>下载背景</span>
                  </div>
                </div>
              </div>
              <div class="bottom">
                <el-radio v-model="shopCheckedBackgroundIndex" :label="index">
                  <span
                    v-if="item.isDefault == 0"
                  >
                    自定义背景
                  </span>
                  <span
                    v-else
                  >
                    背景
                  </span>
                  {{item.index}}
                </el-radio>
              </div>
            </div>
          </div>
          <footer>
            <el-button
              type="primary"
              @click="saveCheckedBackground('1')"
            >
              保存
            </el-button>
          </footer>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="门店：">
            <el-select v-model="formInline.shopName" placeholder="门店" filterable>
              <el-option label="全部" value=""></el-option>
              <el-option :label="item.shopName" :value="item.shopName" v-for="item in shopList" :key="item.shopId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getShopListInfo">查询</el-button>
          </el-form-item>
        </el-form>
        <el-alert
          title="您的公众号已变更，需重新生成二维码"
          type="warning"
          :closable="false"
          center
          show-icon v-if="checkResetQr === 1">
          <el-button type="warning" icon="el-icon-refresh-right" @click.native="getResetQrcode">点击重新生成</el-button>
        </el-alert>
        <el-table
          :data="shopTableData"
          border
          class="table-content"
          style="width: 100%;margin-top:18px;">
          <el-table-column
            prop="shopName"
            label="门店"
            align="center">
          </el-table-column>
          <el-table-column
            prop="nameOut"
            label="对外门店"
            align="center">
          </el-table-column>
          <el-table-column
            label="品牌"
            align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.brand" @change="getShopBindBrand(scope.row)" clearable placeholder="请选择关联品牌">
                <el-option
                  v-for="(item, index) in branchList"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="二维码"
            align="center">
            <template slot-scope="scope">
              <div
                class="qr-show"
                @click="previewCompoundQrcode({
                  row: scope.row,
                  source: '1'
                })"
                v-if="scope.row.wxCode"
              >
                <i class="iconfont icon-ico"></i><span>查看</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="是否参与关注统计"
            align="center">
            <template slot-scope="scope">
              <i class="el-icon-success isSuccess-icon" v-if="!scope.row.name"></i>
              <i class="el-icon-error isFail-icon" v-else></i>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button
                type="warning"
                @click="getCompoundQrcodeTemplate(scope.row, {
                  source: '1',
                  scale: 2,
                  isDownload: true
                })"
                v-if="scope.row.wxCode" icon="el-icon-upload"
                size="small"
              >
                下载合成二维码
              </el-button>
              <el-button type="success" @click="downloadImg(scope.row, 'shop')" v-if="scope.row.wxCode" icon="el-icon-upload" size="small">下载二维码</el-button>
              <el-button type="primary" @click="createQrCodeShop(scope.row, '1')" v-else icon="el-icon-upload" size="small">生成二维码</el-button>
              <!-- <el-button type="danger" v-if="scope.name" size="small" plain>关闭关注统计</el-button>
              <el-button type="success" v-else size="small" plain>开启关注统计</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="table-page"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :page-sizes="[20, 50, 100, 200, 500]"
          :page-size.sync="pageSizeShop"
          @size-change="getShopListInfo"
          @current-change="getShopListInfo"
          :current-page.sync="currentPageShop"
          :total="tableTotalShop">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="营业员推广二维码" name="2">
        <div class="template salesman">
          <header>
            <h3>
              <strong>
                选择模板
              </strong>
            </h3>
          </header>
          <div class="content">
            <div>
              <div
                class="top"
                :class="{
                  top: true,
                  active: salesmanCheckedTemplateIndex == '1',
                }"
              >
                <img src="~@/assets/images/super-crm/wx-member/template-1.png" alt="">
              </div>
              <div class="bottom">
                <el-radio v-model="salesmanCheckedTemplateIndex" label="1">
                  <span>
                    模板
                  </span>
                  1
                </el-radio>
              </div>
            </div>
            <div>
              <div
                class="top"
                :class="{
                  top: true,
                  active: salesmanCheckedTemplateIndex == '2',
                }"
              >
                <img src="~@/assets/images/super-crm/wx-member/template-2.png" alt="">
              </div>
              <div class="bottom">
                <el-radio v-model="salesmanCheckedTemplateIndex" label="2">
                  <span>
                    模板
                  </span>
                  2
                </el-radio>
              </div>
            </div>
          </div>
        </div>
        <div class="template salesman">
          <header>
            <h3>
              <strong>
                选择背景
              </strong>
              （图片格式：*jpg、png，尺寸：<mark>945px*1337px</mark>）
            </h3>
            <ul>
              <li>
                1、背景不含企业logo，需下载背景后根据需要放置在相应位置。
              </li>
              <li>
                2、营业员姓名将在二维码下方自动生成。
              </li>
            </ul>
          </header>
          <div class="content">
            <div class="upload-file">
              <div class="top">
                <input
                  type="file"
                  accept="image/*"
                  @change="uploadBackground($event, '0')"
                >
                <div class="tip">
                  <div class="icon">+</div>
                  <div class="text">
                    上传背景
                  </div>
                </div>
              </div>
              <div class="bottom">
                自定义
              </div>
            </div>

            <div
              class="background-list"
              v-for="(item, index) of salesmanQrcodeBackgroundList"
              :key="index"
            >
              <div
                class="top"
                :class="{
                  top: true,
                  active: salesmanCheckedBackgroundIndex === index,
                }"
                :style="{
                  backgroundImage: `url(${item.imgUrl})`,
                }"
              >
                <div class="control-group">
                  <div
                    class="preview"
                    @click="previewBackground(index, {
                      source: '0'
                    })"
                  >
                    <i class="iconfont icon-fangda"></i>
                    <span>预览</span>
                  </div>
                  <div
                    v-if="item.isDefault == 0"
                    class="delete"
                    @click="deleteBackground(index, '0')"
                  >
                    <i class="iconfont icon-lajitong"></i>
                    <span>删除背景</span>
                  </div>
                  <div
                    v-else
                    class="download"
                    @click="downBackground(index, '0')"
                  >
                    <i class="iconfont icon-xiazai"></i>
                    <span>下载背景</span>
                  </div>
                </div>
              </div>
              <div class="bottom">
                <el-radio v-model="salesmanCheckedBackgroundIndex" :label="index">
                  <span
                    v-if="item.isDefault == 0"
                  >
                    自定义背景
                  </span>
                  <span
                    v-else
                  >
                    背景
                  </span>
                  {{item.index}}
                </el-radio>
              </div>
            </div>
          </div>
          <footer>
            <el-button
              type="primary"
              @click="saveCheckedBackground('0')"
            >
              保存
            </el-button>
          </footer>
        </div>
        <el-form :inline="true" :model="formInline1" class="demo-form-inline">
          <el-form-item label="门店：">
            <el-select v-model="formInline1.shopName" placeholder="门店" filterable>
              <el-option label="全部" value=""></el-option>
              <el-option :label="item.shopName" :value="item.shopName" v-for="item in shopList" :key="item.shopId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业员：">
            <!-- <el-input v-model="formInline1.saler"></el-input> -->
            <el-select v-model="formInline1.saler" placeholder="营业员" filterable>
              <el-option label="全部" value=""></el-option>
              <el-option :label="item" :value="item" v-for="item in salerList" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getSalerListInfo">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="salerTableData"
          border
          class="table-content"
          style="width: 100%;margin-top:18px;">
          <el-table-column
            prop="saleNum"
            label="编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="saleName"
            label="营业员"
            align="center">
          </el-table-column>
          <el-table-column
            prop="shopName"
            label="门店"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="二维码"
            align="center">
            <template slot-scope="scope">
              <div
                class="qr-show"
                @click="previewCompoundQrcode({
                  row: scope.row,
                  source: '0'
                })"
                v-if="scope.row.codeStatus === '1'"
              >
                <i class="iconfont icon-ico"></i><span>查看</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="是否参与关注统计"
            align="center">
            <template slot-scope="scope">
              <i class="el-icon-success isSuccess-icon" v-if="!scope.row.name"></i>
              <i class="el-icon-error isFail-icon" v-else></i>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button
                type="warning"
                @click="getCompoundQrcodeTemplate(scope.row, {
                  source: '0',
                  scale: 2,
                  isDownload: true
                })"
                v-if="scope.row.wxCode" icon="el-icon-upload"
                size="small"
              >
                下载合成二维码
              </el-button>
              <el-button type="success" @click="downloadImg(scope.row, 'saler')" v-if="scope.row.wxCode" icon="el-icon-upload" size="small">下载二维码</el-button>
              <el-button type="primary" @click="createQrCodeSaler(scope.row, '1')" v-else icon="el-icon-upload" size="small">生成二维码</el-button>
              <!-- <el-button type="danger" v-if="scope.name" size="small" plain>关闭关注统计</el-button>
              <el-button type="success" v-else size="small" plain>开启关注统计</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="table-page"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :page-sizes="[20, 50, 100, 200, 500]"
          :page-size.sync="pageSizeSaler"
          @size-change="getSalerListInfo"
          @current-change="getSalerListInfo"
          :current-page.sync="currentPageSaler"
          :total="tableTotalSaler">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="previewData.isShow"
      class="preview-dialog"
      top="5vh"
      :title="previewData.title"
      width="500px"
    >
      <div
        v-if="previewData.row"
        class="download-group"
      >
        <button
          class="download-button"
          @click="getCompoundQrcodeTemplate(previewData.row, {
            source: previewData.source,
            scale: 2,
            isDownload: true
          })"
        >
          <i class="iconfont icon-xiazai"></i>
          <span>
            <span>
              下载大尺寸（A4）
            </span>
            <span>
              2480px*3508px
            </span>
          </span>
        </button>
        <button
          class="download-button"
          @click="getCompoundQrcodeTemplate(previewData.row, {
            source: previewData.source,
            scale: 1,
            isDownload: true
          })"
        >
          <i class="iconfont icon-xiazai"></i>
          <span>
            <span>
              下载小尺寸（适用于收银台）
            </span>
            <span>
              945px*1337px
            </span>
          </span>
        </button>
      </div>
      <img
        v-if="previewData.src"
        :src="previewData.src"
        :style="{
          width: '100%'
        }"
        alt="图片"
      >
      <img
        v-else
        src="@/assets/images/common/loading.gif"
        alt="加载中"
      >
    </el-dialog>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {
  getShopListInfo,
  patchWxCodeShop,
  getSalerListInfo,
  patchWxCodeSaler,
  getCodeTemplate,
  deleteCodeTemplate,
  addCodeTemplate,
  updateCodeTemplate,
  builderQrcode
} from '@/api/super-crm/wx-member';
import { getSelectedShopList, brandList, shopBindBrand, checkResetQrcode, resetQrcode} from '@/api/super-crm/wx-member-functions';
import { getSelectSalerList } from '@/api/super-crm/wx-data';
import {upload} from '@/api/common';
import user from '@/utils/user';

@Component({
})
export default class QrCode extends Vue {
  // 门店选择的模板索引
  private shopCheckedTemplateIndex = '1';
  // 门店选择的背景索引
  private shopCheckedBackgroundIndex = 0;
  // 门店的背景
  private shopQrcodeBackgroundList: any[] = [];
  // 营销员的背景索引
  private salesmanCheckedBackgroundIndex = 0;
  // 营业员的模板索引
  private salesmanCheckedTemplateIndex = '1';
  // 营销员的背景
  private salesmanQrcodeBackgroundList: any[] = [];
  private activeName: string = '1';
  private previewData = {
    isShow: false,
    src: '',
    title: '预览',
    row: null,
    source: '1',
  }

  private formInline = {
    shopName: ''
  };

  private formInline1 = {
    shopName: '',
    saler: ''
  }

  private shopList = [];
  private salerList = [];
  // 品牌列表
  private branchList = [];
  // 二维码是否可重置
  private checkResetQr: number = 0;

  private shopTableData = [];
  private currentPageShop: number = 1;
  private tableTotalShop: number = 0;
  private pageSizeShop: number = 100;

  private salerTableData = [];
  private currentPageSaler: number = 1;
  private tableTotalSaler: number = 0;
  private pageSizeSaler: number = 100;

  private mounted() {
    this.getShopList();
    this.getBranch();
    this.getCheckResetQrcode();
    this.getShopListInfo();
    this.getSalerListInfo();
    this.getCodeTemplate('1');
    this.getCodeTemplate('0');
    this.shopSelectChange('');
  }

  private getShopList() {
    const params = {
      evaluationStatus: null,
      showStatus: 1
    }
    getSelectedShopList(params).then((res: any) => {
      this.shopList = res.data.list || [];
    })
  }
  // 品牌列表
  private getBranch() {
    brandList().then((res: any) => {
      this.branchList = res.data  ? res.data : [];
    })
  }

  // 品牌绑定
  private getShopBindBrand(row: any) {
    const params = {
      brand: row.brand,
      shopId: row.shopId
    }
    shopBindBrand(params).then((res: any) => {
      this.$message({
          message: res.msg,
          type: 'success'
        });
    });
  }

  // 检查是否重新生成二维码
  private getCheckResetQrcode() {
    checkResetQrcode().then((res) => {
      this.checkResetQr = res.data ? res.data.allowReset : 0
    });
  }
  // 重新生成二维码
  private getResetQrcode() {
    resetQrcode().then((res) => {
      this.getShopListInfo();
      this.getSalerListInfo();
    });
  }

  private shopSelectChange(value: string) {
    getSelectSalerList({branchShop: value, companyKey: user.serverUser.account.companyKey}).then((res: any) => {
      this.salerList = JSON.parse(res.data.sales).map((p: any) => p.saler);
    })
  }

  private getShopListInfo() {
    const params = {
      page: {
        pageNum: this.currentPageShop,
        pageSize: this.pageSizeShop
      },
      params: {
        shopName: this.formInline.shopName
      }
    }
    const headers = {
      appCode: 'onlineMember'
    }
    getShopListInfo(params, headers).then((res: any) => {
      this.shopTableData = res.data.list;
      this.tableTotalShop = res.data.total || 0;
    })
  }

  private getSalerListInfo() {
    const params = {
      page: {
        pageNum: this.currentPageSaler,
        pageSize: this.pageSizeSaler
      },
      params: {
        branchShop: this.formInline1.shopName,
        saler: this.formInline1.saler
      }
    }
    const headers = {
      appCode: 'onlineMember'
    }
    getSalerListInfo(params, headers).then((res: any) => {
      this.salerTableData = res.data.list;
      this.tableTotalSaler = res.data.total || 0;
    })
  }

  private showQrCode(item: any, type: string) {
    this.$alert(`<img src="${item.wxCode}">`, type === 'shop' ? item.shopName : `${item.saleName}(${item.shopName})`, {
      dangerouslyUseHTMLString: true,
      center: true
    });
  }
  private downloadImg(item: any, type: string) {
    window.open(item.wxCode, '_blank');
    // if (type === 'shop') {
    //   this.createQrCodeShop(item, '2');
    // } else {
    //   this.createQrCodeSaler(item, '2');
    // }
  }
  private createQrCodeShop(item: any, type: string) {
    const params = {
      shopId: item.shopId,
      type
    }
    patchWxCodeShop(params).then((res: any) => {
      this.getShopListInfo();
    })
  }
  private createQrCodeSaler(item: any, type: string) {
    const params = {
      saleNum: item.saleNum,
      type,
      shopName: item.shopName,
      saleName: item.saleName
    }
    patchWxCodeSaler(params).then((res: any) => {
      this.getSalerListInfo();
    })
  }

  // 获取背景列表
  private async getCodeTemplate(source: string) {
    const body = {
      source
    }

    const res = await getCodeTemplate(body);
    const {data} = res;
    const {customTemp, defaultTemp} = data.map;
    const formworkValue = data.formworkValue;
    const resArr = customTemp.concat(defaultTemp);
    let customNumber = 0;
    let defaultNumber = 0;

    (resArr as any[]).forEach((item: any, index: number) => {
      if (item.isDefault == '1') {
        defaultNumber++;
        item.index = defaultNumber;
      } else {
        customNumber++;
        item.index = customNumber;
      }

      if (item.isSelect == '1') {
        if (source == '1') {
          this.shopCheckedBackgroundIndex = index;
        } else {
          this.salesmanCheckedBackgroundIndex = index;
        }
      }
    })


    if (source == '1') {
      // 门店推广二维码
      this.shopQrcodeBackgroundList = resArr;
      this.shopCheckedTemplateIndex = '1';
    } else {
      // 营业员推广二维码
      this.salesmanQrcodeBackgroundList = resArr;
      this.salesmanCheckedTemplateIndex = formworkValue == null ? '1' : formworkValue;
    }
  }

  // 背景上传
  private uploadBackground(event: Event, source: string) {
    const fileInputEl = event!.target as HTMLInputElement;
    const files = fileInputEl.files;
    const formData = new FormData();

    if (files) {
      formData.append('file', files[0]);
      formData.append('alias', 'photos');

      upload(formData).then(async (res: any) => {
        const {data} = res;
        const {url} = data;

        const body = {
          imgUrl: url,
          source
        }

        const addCodeTemplateRes = await addCodeTemplate(body);
        this.$message.success('上传成功');
        this.getCodeTemplate(source);
      })
    }
  }

  // 预览背景
  private previewBackground(index: number, options: any) {
    this.previewData.title = options.title || '预览';
    this.previewData.row = null;
    this.previewData.isShow = true;

    if (options.source == '1') {
      this.previewData.src = this.shopQrcodeBackgroundList[index].imgUrl;
    } else {
      this.previewData.src = this.salesmanQrcodeBackgroundList[index].imgUrl;
    }
  }

  // 预览合成二维码
  private async previewCompoundQrcode(options: any) {
    const {
      title,
      row,
      source
    } = options;

    this.previewData.src = '';
    this.previewData.title = title || '预览';
    this.previewData.row = row || null;
    this.previewData.source = source;
    this.previewData.isShow = true;

    if (row) {
      const url = await this.getCompoundQrcodeTemplate(row, {
        source,
        scale: 0.5,
        isDownload: false,
      });

      if (url) {
        const res = await fetch(url);
        const blob = await res.blob();
        const fileReader = new FileReader();

        fileReader.readAsDataURL(blob);

        fileReader.onload = (value: any) => {
          this.previewData.src = fileReader.result as string;
        }
      }
    }
  }

  // 删除背景
  private async deleteBackground(index: number, source: string) {
    this.$confirm('确定删除该背景吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const body = {
        id: '',
      }

      if (source == '1') {
        body.id = this.shopQrcodeBackgroundList[index].id;
      } else {
        body.id = this.salesmanQrcodeBackgroundList[index].id;
      }

      const res = await deleteCodeTemplate(body);
      this.$message.success('删除成功');
      this.getCodeTemplate(source);
    })
  }

  // 下载背景
  private async downBackground(index: number, source: string) {
    if (source == '1') {
      window.open(this.shopQrcodeBackgroundList[index].imgUrl);
    } else {
      window.open(this.salesmanQrcodeBackgroundList[index].imgUrl);
    }
  }

  // 保存选中
  private async saveCheckedBackground(source: string) {
    const body = {
      id: '',
      source,
      formworkValue: '1',
    }

    if (source == '1') {
      body.id = this.shopQrcodeBackgroundList[this.shopCheckedBackgroundIndex].id;
      body.formworkValue = this.shopCheckedTemplateIndex;
    } else {
      body.id = this.salesmanQrcodeBackgroundList[this.salesmanCheckedBackgroundIndex].id;
      body.formworkValue = this.salesmanCheckedTemplateIndex;
    }

    const res = await updateCodeTemplate(body);
    this.$message.success('保存成功');
    this.getCodeTemplate(source);
  }

  // 获取二维码合成背景
  private async getCompoundQrcodeTemplate(row: any, options: {
    source: string;
    scale: 0.5 | 1 | 2 | 3;
    isDownload: boolean;
  }) {
    const {
      source,
      scale,
      isDownload
    } = options;

    const body: any = {
      scale,
      down: 1,
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey,
    };

    if (source == '1') {
      // 门店
      const {
        shopName,
        wxCode,
        nameOut,
      } = row;

      body.name = nameOut || shopName;
      body.formworkUrl = this.shopCheckedTemplateIndex;
      body.backgroundUrl = this.shopQrcodeBackgroundList[this.shopCheckedBackgroundIndex].imgUrl;
      body.qrcodeUrl = wxCode;
      body.type = '0';
      body.shopName = nameOut || shopName;
    } else {
      // 营业员
      const {
        shopName,
        nameOut,
        saleName,
        wxCode,
        saleNum,
      } = row;

      body.name = saleName;
      body.salerNum = saleNum;
      body.formworkUrl = this.salesmanCheckedTemplateIndex;
      body.backgroundUrl = this.salesmanQrcodeBackgroundList[this.salesmanCheckedBackgroundIndex].imgUrl;
      body.qrcodeUrl = wxCode;
      body.type = '1';
      body.shopName = nameOut || shopName;
    }

    // const path = source == '1' ? '/jop-wx-web/imagehandler/builderQrcode2' : '/jop-wx-web/imagehandler/salesQrcode';
    const path = '/jop-wx-web/imagehandler/salesQrcode';

    const url = new URL(path, VUE_APP_BASE_API);
    for (const [key, value] of Object.entries(body)) {
      url.searchParams.append(key, value as string);
    }

    if (isDownload) {
      const a = window.document.createElement('a');
      a.setAttribute('download', name || '合成二维码');
      a.setAttribute('href', url.href);
      a.click();
      a.remove();
    } else {
      return url.href;
    }
  }

  // 下载图片
  private async downloadImage(options: {
    blob: Blob,
    name: string,
    isDownload: boolean,
  }): Promise<string | void> {
    return new Promise((resolve, reject) => {
      const {
        blob,
        name,
        isDownload
      } = options;
      const fileReader = new FileReader();

      fileReader.readAsDataURL(blob);

      fileReader.onload = (res: any) => {
        const {result} = fileReader;

        if (isDownload) {
          const a = window.document.createElement('a');
          a.setAttribute('download', name || '合成二维码');
          a.setAttribute('href', fileReader.result as string);
          a.click();
          a.remove();
          resolve();
        } else {
          resolve(result as string);
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.qr-code {
  .demo-form-inline {
    height: 80px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  .isSuccess-icon {
    font-size: 28px;
    color: #6699ff;
  }
  .isFail-icon {
    font-size: 28px;
    color: #F56C6C;
  }
  .qr-show {
    cursor: pointer;
    i {
      font-size: 24px;
    }
    span {
      padding-left: 8px;
      font-size: 12px;
      color: #6699ff;
    }
  }
  .table-page {
    text-align: right;
    margin: 12px 0;
  }

  .template {
    margin-bottom: 15px;

    > header {
      margin-bottom: 10px;
      font-size: 12px;
      color: #999999;

      > h3 {
        margin-bottom: 5px;

        > strong {
          font-size: 14px;
          color: #606266;
        }

        mark {
          color: #eb3941;
          background: inherit;
        }
      }

      > ul {
        > li {
          line-height: 2;
        }
      }
    }

    > .content {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;

      > div {
        margin-right: 20px;
        margin-bottom: 20px;
        width: 120px;

        &.upload-file {
          > .top {
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;

            > input[type=file] {
              display: block;
              position: absolute;
              flex-grow: 1;
              height: 100%;
              width: 100%;
              opacity: 0;
              cursor: pointer;
              background: red;
            }

            > .tip {
              text-align: center;

              > .icon {
                color: #b4b1b1;
                font-size: 40px;
              }

              > .text {
                color: #999999;
                font-size: 12px;
              }
            }
          }

          > .bottom {
            font-size: 12px;
            text-align: center;
            color: #999999;
          }
        }

        > .top {
          padding: 5px;
          background-repeat: no-repeat;
          background-origin: content-box;
          background-clip: content-box;
          background-size: cover;
          margin-bottom: 10px;
          padding: 5px;
          height: 171px;
          border: solid 1px #ebeef5;

          &.active {
            border: solid 1px #409eff;
          }

          &:hover {
            > .control-group {
              opacity: 1;
            }
          }

          > img {
            height: 100%;
            width: 100%;
          }

          > .control-group {
            display: flex;
            opacity: 0;
            flex-direction: column;
            background: rgba(0, 0, 0, .5);
            height: 100%;;
            transition: opacity .5s;

            > div {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              flex-grow: 1;
              color: #fff;
              font-size: 12px;
              cursor: pointer;

              &:hover {
                background: rgba(0, 0, 0, .5);
              }

              > .iconfont {
                margin-bottom: 8px;
                font-size: 20px;
              }
            }
          }
        }


        > .bottom {
          display: flex;
          justify-content: center;
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }

  .preview-dialog {
    .download-group {
      display: flex;
      margin-bottom: 10px;

      > button {
        cursor: pointer;
        display: flex;
        align-items: center;
        border: solid 1px #dcdfe6;
        padding: 10px;
        font-size: 12px;
        color: #999999;
        background: #fff;

        &:not(:last-of-type) {
          margin-right: 10px;
        }

        > .iconfont {
          margin-right: 5px;
          font-size: 24px;
        }

        > span {
          display: flex;
          flex-direction: column;
          text-align: start;

          > span:not(:last-child) {
            margin-bottom: 5px;
          }
        }
      }
    }

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
<style lang="scss">
.member-function{
  .el-alert__description{
    display: inline-block;
    margin-left: 15px;
  }
}
</style>
