<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :before-close="cancelDialog" width="60%">
      <div style="text-align:right;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input style="width: 400px" v-model="formInline.inputValue" placeholder="请输入赠品编号/名称" :disabled="(formInline.status == 2 || formInline.status == 3)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryGiftPageFun">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" style="width: 100%" max-height="500" height="500">
        <el-table-column prop="imgUrl" label="图片">
          <template slot-scope="scope">
            <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl" class="avator-c" />
            <div class="img-empty" v-else></div>
          </template>
        </el-table-column>
        <el-table-column prop="giftType" label="类型"></el-table-column>
        <el-table-column prop="giftCode" label="奖品编号"></el-table-column>
        <el-table-column prop="giftName" label="入库名称"></el-table-column>
        <el-table-column prop="shelfGiftName" width="120" label="上架名称">
          <template slot-scope="scope">
            <el-input
              :disabled="scope.row.disabled"
              style="width: 100px"
              v-model="scope.row.shelfGiftName"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remainCount" width="120" label="可兑换数量">
          <template slot-scope="scope">
            <el-input
              :disabled="scope.row.disabled"
              style="width: 100px"
              v-model.number="scope.row.remainCount"
              onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
              min="0"
              type="number"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="warningCount" width="120" label="预警数量">
          <template slot-scope="scope">
            <el-input
              :disabled="scope.row.disabled"
              style="width: 100px"
              v-model.number="scope.row.warningCount"
              onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
              min="0"
              type="number"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="isSelfGet" label="允许用户自行领取">
          <template slot-scope="scope">
            <el-switch :disabled="scope.row.disabled" v-model="scope.row.isSelfGet"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="statusStr" label="状态"></el-table-column>
        <el-table-column prop="operation" label="选择">
          <template slot-scope="scope">
            <el-checkbox
              :disabled="(scope.row.disabled || scope.row.statusStr === '不可关联')"
              v-model="scope.row.checkBoxValue"
              @change="onCheckChange(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:18px;">
        <el-pagination
          class="table-page"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :page-sizes="[8, 15, 30, 50]"
          :page-size.sync="pageSize"
          @size-change="queryGiftPageFun"
          @current-change="queryGiftPageFun"
          :current-page.sync="currentPage"
          :total="tableTotal"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { queryGiftPage } from '@/api/super-mkt/activity-set/fans_plus';
import { imagesUrl } from '@/utils/imageUrl';
@Component({})
export default class AwardDialog extends Vue {
  @Prop(Boolean) dialogTableVisible!: boolean;
  @Prop() giftGrade!: string;
  @Prop({ default: [] }) giftList!: object[];
  @Prop() gift!: any;
  @Prop() status!: number;
  tableData = [];
  formInline = {
    inputValue: '',
    status: 0
  };
  pageSize: number = 8;
  currentPage: number = 1;
  tableTotal: number = 0;
  private allShop: any = [];
  mounted() {
    if (this.gift) {
      this.formInline.inputValue = this.gift.giftCode;
      this.formInline.status = this.status;
    }
    this.queryGiftPageFun();
  }

  onCheckChange(scope: any) {
    this.tableData.map((item: any) => {
      if (item.id != scope.id) {
        item.checkBoxValue = false;
      }
    });
  }

  // 获取赠品列表
  private async queryGiftPageFun() {
    const param = {
      page: {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      },
      params: {
        giftName: this.formInline.inputValue,
      },
    };
    const data: any = await queryGiftPage(param);
    this.tableTotal = data.data.total || 0;
    this.tableData =
      data.data.list && data.data.list.length > 0
        ? data.data.list.map((item: any) => {
            if (this.gift && this.gift.giftCode == item.giftCode) {
                return {
                id: item.id,
                imgUrl: imagesUrl({
                  path: '/jop-wx-web/op/showimage',
                  name: item.picList[0] || '',
                  alias: 'Gift',
                }),
                giftCode: item.giftCode,
                giftType: item.giftType,
                giftName: item.giftName,
                statusStr: item.statusStr,
                shopName: item.shopName,
                store: item.store,
                giftGrade: this.giftGrade,
                shelfGiftName: this.gift.shelfGiftName,
                isSelfGet: (this.gift.isSelfGet == 'Y'),
                warningCount: this.gift.warningCount,
                remainCount: this.gift.remainCount,
                checkBoxValue: this.checkSelected(item, 'check'),
                disabled: this.checkSelected(item, 'disabled'),
              };
            } else {
              return {
                id: item.id,
                imgUrl: imagesUrl({
                  path: '/jop-wx-web/op/showimage',
                  name: item.picList[0] || '',
                  alias: 'Gift',
                }),
                giftCode: item.giftCode,
                giftType: item.giftType,
                giftName: item.giftName,
                statusStr: item.statusStr,
                shopName: item.shopName,
                store: item.store,
                giftGrade: this.giftGrade,
                isSelfGet: false,
                shelfGiftName: '',
                checkBoxValue: this.checkSelected(item, 'check'),
                disabled: this.checkSelected(item, 'disabled'),
              };
            }

          })
        : [];
  }
  // 判断选中数据状态
  private checkSelected(item: any, type: string): boolean {
    return type === 'disabled'
      ? this.giftList
          .filter((item1: any) => item1.giftGrade != this.giftGrade)
          .map((item2: any) => item2.giftCode)
          .includes(item.giftCode)
      : this.giftList
          .filter((item1: any) => item1.giftGrade == this.giftGrade)
          .map((item2: any) => item2.giftCode)
          .includes(item.giftCode);
  }
  // 确定事件
  private async addConfirm() {
    const datas: any[] = this.tableData.filter((p: any) => p.checkBoxValue);
    if (datas.length <= 0) {
      this.$message.error('请选择要操作的数据');
      return false;
    }
    if (!datas[0].warningCount || datas[0].warningCount == 0) {
      this.$message.error('请填写预警数量');
      return false;
    }
    if (!datas[0].remainCount || datas[0].remainCount == 0) {
      this.$message.error('请填写可兑换数量');
      return false;
    }
    if (!datas[0].shelfGiftName || datas[0].shelfGiftName == '') {
      this.$message.error('请填写上架名称');
      return false;
    }
    this.$emit('addConfirm', datas[0]);
  }
  private cancelDialog() {
    this.tableData = [];
    this.$emit('cancelDialog');
  }
}
</script>
<style lang="scss" scoped>
/deep/ input[type='number'] {
  -moz-appearance: none;
  text-align: center;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.avator-c {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
.img-empty {
  width: 40px;
  height: 40px;
  background: #eee;
  border-radius: 40px;
}
.isGuan {
  color: #e40000;
}
.re-span {
  color: #1b72f6;
  text-decoration: underline;
  cursor: pointer;
}
.remove-box {
  margin: 20px 0;
}
/deep/ .el-table {
  .has-gutter {
    tr {
      background: #f5f7fa;
    }
  }
}

.remark-span {
  padding: 6px;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
}
</style>