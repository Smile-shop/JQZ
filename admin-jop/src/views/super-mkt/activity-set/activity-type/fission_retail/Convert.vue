<template>
  <div class="activity-type-add">
    <el-form ref="form" label-width="180px" class="add-form" :model="form">
      <el-form-item label="表单设置：">
        <el-radio v-model="form.formType" :label="1">支付后填写</el-radio>
      </el-form-item>
      <el-form-item label="表单内容：">
        <el-input
          style="width:250px"
          v-model="form.formInputList[0].name"
          :placeholder="form.formInputList[0].name"
          type="text"
          maxlength="5"
          show-word-limit
        >
          <template slot="prepend">{{form.formInputList[0].name}}</template>
        </el-input>
        <el-input
          v-model="form.formInputList[0].tips"
          style="width:250px;margin-left:10px"
          type="text"
          maxlength="18"
          show-word-limit
        ></el-input>
        <el-switch style="margin-left:10px" active-text="开启手机验证" v-model="isAuth"></el-switch>
        <span style="margin-left:10px">未开启验证将无法注册会员</span>
      </el-form-item>
      <el-form-item>
        <div slot="label">
          <el-dropdown @command="onItemClick">
            <span class="el-dropdown-link">
              <i class="el-icon-plus"></i>添加字段
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">单行文本</el-dropdown-item>
              <el-dropdown-item command="2">身份证</el-dropdown-item>
              <el-dropdown-item command="3">下拉框</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div style="margin-bottom:5px">
          <el-input
            style="width:250px"
            v-model="form.formInputList[1].name"
            :placeholder="form.formInputList[1].name"
            type="text"
            maxlength="5"
            show-word-limit
          >
            <template slot="prepend">
              <div style="width:60px">{{form.formInputList[1].name}}</div>
            </template>
          </el-input>
          <el-input
            style="width:250px;margin-left:10px"
            type="text"
            v-model="form.formInputList[1].tips"
            maxlength="20"
            show-word-limit
          ></el-input>
          <el-button type="primary" style="margin-left:102px" @click="onSetShop">设置</el-button>
          <template v-if="form.formInputList[1].valueList.length==0">
            <i class="el-icon-warning" style="font-size:20px;margin-left:10px;color:#F56C6C"></i>
            <span>未设置</span>
          </template>
          <template v-else>
            <i class="el-icon-success" style="font-size:20px;margin-left:10px;color:#67C23A"></i>
            <span>已设置</span>
          </template>
        </div>
        <template>
          <div
            style="margin-bottom:5px"
            v-for="(item,index) in form.formInputList.slice(2,form.formInputList.length)"
            :key="index"
          >
            <el-input
              style="width:250px"
              v-model="item.name"
              :placeholder="item.name"
              type="text"
              maxlength="5"
              show-word-limit
            >
              <template slot="prepend">
                <div style="width:60px">{{item.name}}</div>
              </template>
            </el-input>
            <el-input
              style="width:250px;margin-left:10px"
              type="text"
              v-model="item.tips"
              :maxlength="(item.inputType=='5')?18:20"
              show-word-limit
            ></el-input>
            <!-- <template v-if="item.inputType!='3'"> -->
            <el-checkbox v-model="item.isMust" style="margin-left:10px">必填</el-checkbox>
            <template v-if="item.inputType=='6'">
              <el-button type="primary" style="margin-left:10px" @click="onSetAddItem(item)">设置</el-button>
              <el-button type="danger" style="margin-left:10px" @click="onDelectItem((index+2))">删除</el-button>
              <template v-if="item.valueList.length==0">
                <i class="el-icon-warning" style="font-size:20px;margin-left:10px;color:#F56C6C"></i>
                <span>未设置</span>
              </template>
              <template v-else>
                <i class="el-icon-success" style="font-size:20px;margin-left:10px;color:#67C23A"></i>
                <span>已设置</span>
              </template>
            </template>
            <template v-else-if="item.inputType!='3'">
              <el-button type="danger" style="margin-left:10px" @click="onDelectItem((index+2))">删除</el-button>
            </template>
            <!-- </template> -->
          </div>
        </template>
      </el-form-item>
      <el-form-item label="支付后凭证：">
        <el-radio v-model="form.exhangeType" :label="1">核销码</el-radio>
        <span style="margin-left:10px">核销模式，需设置核销员核销</span>
      </el-form-item>
      <el-form-item label="页面备注：">
        <wang-editor ref="ue" type="mkt-gold-plus" style="width:800px" />
      </el-form-item>
    </el-form>
    <div class="button-div">
      <el-button type="success" @click="onprev">上一步</el-button>
      <el-button type="primary" @click="submit">下一步</el-button>
    </div>
    <AddItemDialog
      v-if="isAddItemDialog"
      :itemList="currValueList"
      :dialogTableVisible.sync="isAddItemDialog"
      @cancelDialog="cancelDialog"
      @addConfirm="addItemConfirm"
    ></AddItemDialog>
    <ShopDialog
      v-if="isShopDialog"
      :valueList="form.formInputList[1].valueList"
      :dialogTableVisible.sync="isShopDialog"
      @cancelDialog="cancelDialog"
      @addConfirm="addShopConfirm"
    ></ShopDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import {
  addDistributionThird,
  getDistributionThird,
} from '@/api/super-mkt/activity-set/fission_retail';
import WangEditor from '@/components/WangEditor.vue';
import ShopDialog from './shop-dialog.vue';
import AddItemDialog from './addItem-dialog.vue';
@Component({
  components: {
    WangEditor,
    ShopDialog,
    AddItemDialog,
  },
})
export default class ConvertActivity extends Vue {
  @Prop({ default: null }) activitiyId!: any;
  @Prop({ default: '' }) curToken!: string;
  isShopDialog = false;
  isAddItemDialog = false;
  currItem: any = null;
  currValueList: any[] = [];
  form = {
    status: 1,
    distributionId: '', // 活动ID
    curToken: '',
    exhangeType: 1, // 支付凭证（1，核销码）
    formType: 1, // 表单设置（1，支付后填写）
    isAuth: 0, // 是否开启手机验证
    remark: '', // 页面备注
    formInputList: [
      {
        name: '手机号码',
        inputType: '1',
        isMust: true,
        tips: '请输入手机号',
        valueList: [],
      },
      {
        name: '兑换门店',
        inputType: '2',
        isMust: true,
        tips: '请选择兑换门店',
        valueList: [],
      },
      {
        name: '姓名',
        inputType: '3',
        isMust: false,
        tips: '请输入姓名',
        valueList: [],
      },
    ],
  };
  isAuth = false;
  mounted() {
    let body: any;
    if (this.curToken != '' && this.activitiyId) {
      body = { distributionId: this.activitiyId, curToken: this.curToken };
    } else if (this.activitiyId) {
      body = { distributionId: this.activitiyId };
    } else if (this.curToken != '') {
      body = { curToken: this.curToken };
    }
    if (body) {
      getDistributionThird(body)
        .then((res: any) => {
          if (res.code === 0) {
            if (res.data) {
              this.form = res.data;
            }
            this.initForm();
          } else {
            this.initForm();
          }
        })
        .catch(() => {
          this.initForm();
        });
    } else {
      this.initForm();
    }
  }
  initForm() {
    if (this.curToken && this.curToken != '') {
      this.form.curToken = this.curToken;
    }
    this.form.formInputList = this.form.formInputList.map((item: any) => {
      item.isMust = item.isMust == 1 ? true : false;
      return item;
    });
    this.isAuth = this.form.isAuth == 1;
    (this.$refs.ue as any).setContent(this.form.remark);
  }
  onSetShop() {
    this.isShopDialog = true;
  }
  onSetAddItem(item: any) {
    this.currItem = item;
    this.currValueList = Object.assign(
      [],
      this.currItem.valueList.map((item: any) => {
        return { isedit: false, edname: item, name: item };
      })
    );
    this.isAddItemDialog = true;
  }
  // 关闭通知人数弹框
  cancelDialog() {
    this.currItem = null;
    this.isShopDialog = false;
    this.isAddItemDialog = false;
    this.currValueList = [];
  }
  addItemConfirm(items: any) {
    if (this.currItem) {
      this.currItem.valueList = items;
    }
    this.currItem = null;
    this.currValueList = [];
    this.isAddItemDialog = false;
  }
  addShopConfirm(shops: any) {
    this.form.formInputList[1].valueList = shops;
    this.isShopDialog = false;
  }
  initSendForm() {
    this.form.remark = (this.$refs.ue as any).getContent();
    this.form.isAuth = this.isAuth ? 1 : 0;
  }
  onItemClick(item: any) {
    if (item === '1') {
      this.form.formInputList.push({
        name: '单行文本',
        inputType: '4',
        tips: '编辑默认提示',
        isMust: false,
        valueList: [],
      });
    } else if (item === '2') {
      this.form.formInputList.push({
        name: '身份证',
        inputType: '5',
        tips: '请输入身份证',
        isMust: false,
        valueList: [],
      });
    } else {
      this.form.formInputList.push({
        name: '下拉框',
        inputType: '6',
        tips: '请选择',
        isMust: false,
        valueList: [],
      });
    }
  }
  onDelectItem(index: number) {
    this.form.formInputList.splice(index, 1);
  }
  onprev() {
    this.$emit('onPreActive');
  }
  onSaveActiveThird() {
    return new Promise((resolve, reject) => {
      const body: any = {
        ...this.form,
      };
      body.formInputList = body.formInputList.map((item: any) => {
        item.isMust = item.isMust ? 1 : 0;
        return item;
      });
      if (!this.activitiyId) {
        delete body.distributionId;
      } else {
        body.distributionId = this.activitiyId;
      }
      addDistributionThird(body)
        .then((res: any) => {
          if (res.code === 0) {
            this.$emit('onNextActive', res.data);
          }
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }
  submit() {
    this.initSendForm();
    if (this.form.status == 3) {
      this.$emit('onNextActive');
    } else {
      (this.$refs.form as any).validate((valid: any) => {
        if (valid) {
          this.onSaveActiveThird();
        } else {
          this.$message({
            message: '请检查必填项',
            type: 'warning',
          });
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-input .el-input__count .el-input__count-inner {
  background: transparent;
}
.activity-type-add {
  & > header {
    margin-bottom: 10px;
  }

  & /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    & img {
      height: 200px !important;
      width: auto !important;
    }

    &:hover {
      border-color: #409eff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  & > .add-form /deep/ {
    .line {
      margin-bottom: 20px;
      height: 10px;
      background-color: #f5f5f5;
    }

    h3 {
      color: #606266;
      font-size: 14px;

      &.inline {
        display: inline-block;
      }
    }

    & .el-form-item__content {
      > div {
        color: #999999;
      }

      > ul {
        margin-top: 5px;
        list-style: none;
        line-height: 1.6;
        color: #999999;

        & > li {
          & > span {
            color: #ff0000;
          }
        }
      }

      > .content {
        display: flex;

        > .left {
          margin-right: 30px;

          > .item {
            &:not(:last-of-type) {
              margin-bottom: 20px;
            }

            > .input-group {
              display: flex;

              > .el-textarea {
                margin-right: 10px;
              }
            }

            > ul {
              margin-top: 5px;
              list-style: none;
              line-height: 1.6;
              color: #999999;

              & > li {
                & > span {
                  color: #ff0000;
                }
              }
            }

            &.inline {
              display: flex;
              align-items: center;

              > h3 {
                margin-right: 30px;
              }

              > .el-input {
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }

  & /deep/ .el-form-item__error {
    position: absolute;
    top: 0;
    left: 430px;
  }
}
</style>