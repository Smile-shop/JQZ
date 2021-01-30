<template>
  <article class="member-package">
    <el-tabs v-model="activeName">
      <el-tab-pane label="会员卡设置" name="1">
        <el-button type="primary" icon="el-icon-plus">添加微信会员卡</el-button>
        <el-table
          border
          :data="tableData"
          style="width: 100%;margin-top:18px">
          <el-table-column
            prop="date"
            label="商户名字"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="会员卡名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="二维码"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="审核状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="审核结果"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            width="340"
            label="操作">
            <template slot-scope="scope">
              <el-button :aa="scope.row" size="small">编辑</el-button>
              <el-button type="primary" size="small">更新会员卡状态</el-button>
              <el-button type="success" size="small">复制会员卡链接</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="package-info">
          <p class="title">微信会员卡注意事项</p>
          <p class="info">必需在公众平台开通微信卡包功能，开通步骤如下图所示：</p>
          <img class="img" src="@/assets/images/super-crm/wx-member/vip-card-1.jpg" alt="package-info">
        </div>

        <div class="package-info">
          <p class="title">微信会员卡示意图</p>
          <img class="img" src="@/assets/images/super-crm/wx-member/vip-card-2.jpg" alt="package-info">
        </div>

        <div class="package-info">
          <p class="title">扫描下方二维码体验</p>
          <img class="img-qr" src="@/assets/images/super-crm/wx-member/vip-card-3.jpg" alt="package-info">
        </div>
      </el-tab-pane>
      <el-tab-pane label="会员卡领取记录" name="2">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="会员卡号：">
            <el-input style="width:140px" v-model="formInline.name"></el-input>
          </el-form-item>
          <el-form-item label="会员卡状态">
            <el-select style="width:140px" v-model="formInline.region" placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领卡时间：">
            <el-date-picker
              style="width:260px"
              v-model="formInline.region"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="激活时间：">
            <el-date-picker
              v-model="formInline.region"
              style="width:260px"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          border
          class="table-content"
          style="width: 100%;margin-top:18px;">
          <el-table-column
            prop="date"
            label="会员卡号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="date"
            label="会员卡状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="领卡时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="激活时间"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class MemberPackage extends Vue {
  private activeName: string = '1';
  private tableData = [{name: '1231'}];
  private formInline = {
    region: '',
    name: ''
  };
}
</script>

<style lang="scss" scoped>
.member-package {
  .package-info {
    text-align: center;
    .title {
      font-size: 20px;
      color: #2d8cf0;
      padding-top: 20px; 
    }
    .info {
      font-size: 14px;
      color: #666666;
      padding-top: 16px;
    }
    .img {
      width: calc(100% - 500px);
      margin-top: 24px;
    }
    .img-qr {
      width: 200px;
      margin-top: 24px;
    }
  }
  .demo-form-inline {
    padding: 20px 20px 0px 20px;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-bottom: 20px;
  }
}
</style>


