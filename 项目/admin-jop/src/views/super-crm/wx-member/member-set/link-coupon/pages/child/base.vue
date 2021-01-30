<template>
  <article class="basis">
    <div>
      <h5 class="basis-title">基本信息</h5>
      <el-form ref="form" :model="setModal" label-width="120px">
        <el-form-item label="活动名称：" :rules="[{ required: true}]">
          <el-input
            style="width: 375px"
            v-model="setModal.couponActivityName"
            placeholder="请输入活动名称，最多支持50个字符"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动门店：" :rules="[{ required: true}]">
          <div
            v-if="readonly"
            style="height: 40px;position: absolute;width: 375px;z-index: 10"
            @click="showAlert(1)"
          ></div>
          <el-select
            style="width: 375px"
            ref="select"
            @change="changeDateOrStore"
            multiple
            v-model="setModal.storeList"
          >
            <el-option
              v-for="item in storeList"
              :value="item.aliasName || item.name"
              :key="item.name"
            >{{ item.aliasName || item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间：" :rules="[{ required: true}]">
          <div @click="showAlert(2)">
            <el-date-picker
              @change="changeDateOrStore"
              ref="datePicker"
              :readonly="readonly"
              style="width: 375px"
              v-model="setModal.time"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label-width="290px" :rules="[{ required: true}]">
          <span slot="label" class="info header">
            H5页面中订单结束后多少天内可领取
            <el-tooltip
              class="item"
              effect="dark"
              content="1. 仅支持，活动时间内领取 2. 选择0表示订单结束后当天可以领券，1表示当天加次日，否则领取资格过期"
              placement="top"
            >
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>：
          </span>
          <el-input
            style="width: 130px"
            type="text"
            maxlength="8"
            placeholder="请输入"
            @blur="checkEndDay"
            v-model="setModal.endDay"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动上架状态：">
          <el-switch v-model="setModal.state" active-value="Y" inactive-value="N"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <h5 class="basis-title">领取通知预览</h5>
      <div class="basis-content basis-t">
        <div class="basis-content-box">
          <div class="basis-content-box-item" style="margin-top: 5px">
            <span style="font-size: 18px;">订单完成提醒</span>
            <i
              class="el-icon-more"
              style="color: #999;font-size: 20px;float: right;margin-top: 2px;"
            ></i>
          </div>
          <div class="basis-content-box-item">
            <span style="color: #999">您好，订单已支付成功。</span>
          </div>
          <div class="basis-content-box-item">
            <span style="color: #999">订单号：</span>：XS201028006
          </div>
          <div class="basis-content-box-item">
            <span style="color: #999">完成状态：</span>已完成
          </div>
          <div class="basis-content-box-item">
            <span style="color: #999">完成时间：</span>2020年11月01日 10时06分
          </div>
          <div class="basis-content-box-item">
            <span style="color: #999">备注：</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点击详情领取奖励。
          </div>
          <div class="basis-content-box-item basis-content-box-btn">
            查看详情
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h5 class="basis-title">
        奖励策略
        <el-tooltip class="item" effect="dark" content="奖励设置目前支持“随机券”，请到JMP中设置" placement="top">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </h5>
      <div class="basis-content basis-table">
        <el-table class="table-content" :data="strategyList" border style="width: 100%">
          <el-table-column label="券名称" min-width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.couponName">{{ scope.row.couponName }}</span>
              <el-select v-else v-model="couponId" placeholder="请选择">
                <el-option
                  v-for="item in couponList"
                  :key="item.couponId"
                  :label="item.couponName"
                  :value="item.couponId"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="消费满额门槛" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.couponMeetamount || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="useMeetamount" label="使用门槛">
            <template slot-scope="scope">
              <span>{{ scope.row.useMeetamount || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="抵值">
            <template slot-scope="scope">
              <span>{{ `${scope.row.randomStart} - ${scope.row.randomEnd}` }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="140">
            <template slot="header">
              <span>领取有效期</span>
              <el-tooltip class="item" effect="dark" content="券的发放有效期" placement="top">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope" v-if="scope.row.getStart && scope.row.getEnd">
              <div>{{ scope.row.getStart | momentFilter('YYYY-MM-DD') }} {{ scope.row.getEnd | momentFilter('YYYY-MM-DD') }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="useTime">
            <template slot="header">
              <span>使用时间</span>
              <el-tooltip
                class="item"
                effect="dark"
                content="领取后多少天内可以使用，或什么时段内可用。"
                placement="top"
              >
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="券状态"></el-table-column>
          <el-table-column prop="action" min-width="100" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                v-if="scope.row.couponName"
                @click="del(scope.row, scope.$index, 1)"
              >删除</el-button>
              <div v-else>
                <el-button size="mini" type="primary" @click="getCouponData(scope.$index)">保存</el-button>
                <el-button size="mini" @click="del(scope.row, scope.$index, 2)">取消</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          plain
          icon="el-icon-plus"
          v-if="couponList.length"
          class="basis-btn"
          @click="addNew"
        >新建奖励策略（最多建5条）</el-button>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import {
  queryStore,
  qryStrategy,
  getWxShopList,
} from '@/api/super-crm/wx-member';
import user from '@/utils/user';
import moment from 'moment';

@Component({})
export default class Basis extends Vue {
  @Prop({ default: {} })
  data: any;
  private readonly = false;
  private storeList: any[] = [];
  private setModal = {
    time: '',
    endDay: null,
    state: 'Y',
    couponActivityName: '',
    storeList: this.storeList,
  };
  private couponList = [];
  private strategyList: any[] = [];
  private couponId = '';
  @Watch('strategyList')
  watchstrategyList(val: any) {
    if (val.length) {
      this.readonly = true;
    } else {
      this.readonly = false;
    }
  }
  @Watch('data')
  watchData(val: any) {
    this.setModal = Object.assign({}, val);
    this.strategyList = val.strategyList;
    if (val.time && val.storeList.length) {
      this.getStore().then((res: any) => {
        this.queryStore(res).then((res: any) => {
          this.qryStrategy();
        });
      });
    }
  }
  private mounted() {
    if (!this.$route.query.id) {
      this.getStore().then((res: any) => {
        this.queryStore(res);
      });
    }
  }
  private getStore() {
    return new Promise((resolve, reject) => {
      getWxShopList()
        .then((res: any) => {
          const isSelectStore = res.data
            .filter((item: any) => item.showStatus === '1')
            .map((item: any) => item.shopName);
          resolve(isSelectStore);
        })
        .catch((err: any) => {
          console.error(err);
        });
    });
  }
  private getCouponData(index: number) {
    if (!this.couponId) {
      return this.$message.error('请选择优惠券');
    }
    const obj: any = this.couponList.find(
      (item: any) => item.couponId === this.couponId
    );
    this.strategyList[index].couponName = obj.couponName;
    this.strategyList[index].couponMeetamount = obj.couponMeetamount;
    this.strategyList[index].useMeetamount = obj.useMeetamount;
    this.strategyList[index].randomStart = obj.randomStart;
    this.strategyList[index].randomEnd = obj.randomEnd;
    this.strategyList[index].getStart = obj.getStart;
    this.strategyList[index].getEnd = obj.getEnd;
    this.strategyList[index].couponId = obj.couponId;
    this.strategyList[index].useTime = obj.useTime;
    this.strategyList[index].state = obj.state;
    this.setCouponStatus();
    this.couponId = '';
  }
  private setCouponStatus() {
    this.couponList.forEach((item1: any) => {
      if (
        this.strategyList
          .map((item: any) => item.couponId)
          .includes(item1.couponId)
      ) {
        this.$set(item1, 'disabled', true);
      } else {
        this.$set(item1, 'disabled', false);
      }
    });
  }
  private checkEndDay() {
    if (
      (this.setModal as any).endDay &&
      !/^[0-9]\d*$/.test((this.setModal as any).endDay)
    ) {
      this.$message.error('请输入正整数');
      (this.setModal as any).endDay = '';
    }
  }
  private queryStore(name: any) {
    return new Promise((resolve, reject) => {
      const res: any = queryStore({ name })
        .then((res: any) => {
          const { code, data } = res;
          if (!code) {
            this.storeList = res.data;
            resolve(true);
          }
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
  private changeDateOrStore() {
    this.strategyList = [];
    this.qryStrategy();
  }
  private async qryStrategy() {
    if (
      !this.setModal.storeList ||
      !this.setModal.storeList.length ||
      !this.setModal.time
    ) {
      return;
    }
    const body = {
      storeNameList: this.storeList
        .filter((item: any) =>
          this.setModal.storeList.includes(item.aliasName || item.name)
        )
        .map((item: any) => item.name),
      startTime: moment(this.setModal.time[0]).format('YYYY-MM-DD'),
      endTime: moment(this.setModal.time[1]).format('YYYY-MM-DD'),
    };
    const res: any = await qryStrategy(body);
    const { code, data } = res;
    if (!code && data) {
      this.couponList = data;
      this.setCouponStatus();
    } else {
      this.couponList = [];
      this.strategyList = [];
      this.couponId = ''
    }
  }
  private save() {
    if (!this.setModal.couponActivityName) {
      return this.$message.error('请输入活动名称');
    } else if (!this.setModal.storeList || !this.setModal.storeList.length) {
      return this.$message.error('请选择活动门店');
    } else if (!this.setModal.time) {
      return this.$message.error('请选择活动时间');
    } else if (!this.setModal.endDay && this.setModal.endDay !== 0) {
      return this.$message.error('请填写H5页面中订单结束后多少天内可领取天数');
    } else if (!this.strategyList.length) {
      return this.$message.error('请建立奖励策略');
    }
    for (const item of this.strategyList) {
      if (!item.couponId) {
        this.$message.error('请完善奖励策略，奖励策略中的券不能为空！');
        return false;
      }
    }
    const { endDay, state, couponActivityName } = this.setModal;
    const startTime = moment(this.setModal.time[0]).format('YYYY-MM-DD');
    const endTime = moment(this.setModal.time[1]).format('YYYY-MM-DD');
    const storeList = this.storeList.filter((item: any) =>
      this.setModal.storeList.includes(item.aliasName || item.name)
    );
    const strategyList = this.strategyList.map((item: any) => {
      return {
        couponId: item.couponId,
        accountId: user.serverUser.account.accountId,
      };
    });
    const formData = Object.assign(
      {},
      {
        endDay,
        state,
        couponActivityName,
        startTime,
        endTime,
        storeList,
        strategyList,
        message: '',
        id: this.data.id || '',
      }
    );
    this.$emit('formData', { required: true, data: formData });
  }
  private showAlert(type: number) {
    if (this.strategyList.length) {
      this.$confirm(
        `活动时间是关联奖励策略的重要依据，如果变更活动时间，奖励策略将清空，需要重新配置！`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          if (type === 1) {
            (this.$refs.select as any).toggleMenu();
          } else {
            this.readonly = false;
            (this.$refs.datePicker as any).showPicker();
          }
        })
        .catch(() => {
          console.log(234);
        });
    }
  }
  private del(item: any, index: number, type: number) {
    this.$confirm(`是否确定${type == 1 ? '删除' : '取消'}吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        this.strategyList.splice(index, 1);
        this.setCouponStatus();
        this.couponId = '';
      })
      .catch(() => {
        console.log('cancel');
      });
  }

  private addNew() {
    if (this.strategyList.length >= 5) {
      return this.$message.error('最多建5条奖励策略');
    }
    (this.strategyList as any).push({
      couponName: '',
      couponMeetamount: '',
      useMeetamount: '',
      randomStart: '',
      randomEnd: '',
      getStart: '',
      getEndt: '',
      couponId: '',
      useTime: '',
      state: '',
    });
  }
}
</script>

<style lang="scss" scoped>
.basis {
  padding-left: 30px;
  &-title {
    margin-bottom: 15px;
    font-weight: bold;
  }
  &-table {
    padding-right: 20px;
  }
  &-content-box {
    border-radius: 8px;
    box-shadow: rgb(204, 204, 204) 0px 1px 10px;
    width: 300px;
    min-height: 276px;
    position: relative;
    margin: 0 0 20px 20px;
    overflow: hidden;
    &-item {
      padding: 0 10px;
      font-size: 14px;
      line-height: 35px;
    }
    &-btn {
      position: absolute;
      width: 100%;
      height: 45px;
      border-top: solid 1px #ccc;
      bottom: 0;
      line-height: 45px;
      i {
        float: right;
        line-height: 45px;
      }
    }
  }
  &-btn {
    margin-top: 10px;
    width: 100%;
  }
  &-footer {
    margin: 30px;
  }
}
</style>


