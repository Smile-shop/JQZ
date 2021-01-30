<template>
  <section class="package-setting">
    <el-button type="primary" v-show="tableData.length <= 0" icon="el-icon-plus" @click="addAppoint">添加微信会员卡</el-button>
    <el-table border :data="tableData" style="width: 100%;margin-top:18px">
      <el-table-column prop="brand_name" label="商户名字" align="center"></el-table-column>
      <el-table-column prop="title" label="会员卡名" align="center"></el-table-column>
      <el-table-column prop="card_statue" label="二维码" align="center">
        <template slot-scope="scope">
          <i class="iconfont icon-ico"></i>
          <span style="color:#409EFF;font-size:12px;padding-left:8px;cursor:pointer">
            <span @click="qrImg = scope.row.card_qrcode, show = true" v-if="scope.row.card_qrcode !== '0'">查看</span>
            <span v-else>
              <span @click="creatQrImg(scope.row.id)" v-if="scope.row.card_statue === '1'">生成</span>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="card_statue" label="审核状态" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.card_statue ? ['待审核', '审核通过', '审核未通过', '已删除', '已投放'][scope.row.card_statue * 1] : ''}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="card_msg" label="审核结果" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.card_statue ? scope.row.card_msg : ''}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" align="center" width="340" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)" size="small">编辑</el-button>
          <el-button @click="update(scope.row.id)" v-if="scope.row.card_statue" type="primary" size="small">更新会员卡状态</el-button>
          <el-button @click="copyItemLink(scope.row)" v-if="scope.row.card_statue" type="success" size="small">复制会员卡链接</el-button>
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
    <PoupBox 
      @cancel="show = false"
      v-model="show">
      <div slot="header" class="poup-title">二维码</div>
      <div slot="body" class="poup-body">
        <img :src="qrImg" alt="二维码">
        <p class="info" @click="download">下载二维码</p>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" @click="show = false">确定</el-button>
        <el-button size="small" @click="show = false">取消</el-button>
      </div>
    </PoupBox>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getMemberCardInfo, creatQrImg, updateCardStatus } from '@/api/super-crm/wx-member-functions';
import PoupBox from '@/components/PoupBox.vue';
import user from '@/utils/user';

@Component({
  components: {
    PoupBox
  }
})
export default class PackageSetting extends Vue {
  private show: boolean = false;
  private qrImg: string = '';
  private tableData = [];

  private mounted() {
    this.getMemberCardInfo();
  }

  private getMemberCardInfo() {
    getMemberCardInfo().then((res: any) => {
      const item = res.data;
      if (item) {
        const tableStr = `[${JSON.stringify(item)}]`;
        this.tableData = JSON.parse(tableStr);
      };
    })
  }

  private creatQrImg(id: any) {
    creatQrImg({id}).then((res: any) => {
      this.$message({
        type: 'success',
        message: '生成二维码成功！'
      });
      this.getMemberCardInfo();
    })
  }

  private download() {
    this.show = false;
    window.open(this.qrImg, '_blank');
  }

  private edit(id: any) {
    const statue = this.tableData.length > 0 && (this.tableData[0] as any).card_statue ? (this.tableData[0] as any).card_statue : null;
    this.$router.push({
      path: '/super-crm/wx-member/member-function/member-package/add',
      query: {
        id,
        statue
      }
    })
  }

  private addAppoint() {
    this.$router.push({
      path: '/super-crm/wx-member/member-function/member-package/add'
    })
  }

  private update(id: any) {
    updateCardStatus({id}).then((res: any) => {
      this.$message({
        type: 'success',
        message: '更新成功！'
      });
      this.getMemberCardInfo();
    })
  }

  private copyItemLink(item: any) {
    const oldInput = document.getElementById('copy-input');
    if (oldInput) {
      document.body.removeChild(oldInput);
    }
    const oInput = document.createElement('input');
    oInput.value = `${VUE_APP_BASE_API}/login_register/pick_package/?c=${user.serverUser.account.companyKey}`;
    oInput.id = 'copy-input';
    oInput.style.opacity = '0';
    document.body.appendChild(oInput);
    try {
      const range = document.createRange();
      range.selectNode(oInput);
      (window as any).getSelection().removeAllRanges();
      (window as any).getSelection().addRange(range);
      document.execCommand('copy');
      (window as any).getSelection().removeAllRanges();
      this.$message({
        type: 'success',
        message: '复制成功！'
      });
    } catch (e) {
      this.$message({
        type: 'error',
        message: '复制失败！'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.package-setting {
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
  .poup-title {
    color: #409EFF;
  }
  .poup-body {
    text-align: center;
    .info {
      color: #409EFF;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>