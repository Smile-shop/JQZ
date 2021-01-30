<template>
  <article class="perssion-edit">
    <div class="title">
      当前子账户：
      <span>{{data.groupName}}</span>
      <i class="el-icon-arrow-right"></i>
      <span>{{data.accountName}}</span>
    </div>
    <div class="app-platform">
      <div
        class="platform-item"
        :class="{ 'selected': channel == item.channel }"
        @click="selectAppPlatform(item)"
        v-for="(item, index) in channelList"
        :key="index">{{ item.description }}</div>
    </div>

    <div class="app-tab-list">
      <div class="tab-list">
        <div
          class="itme"
          :class="{ 'selected': appInfo.appCode == item.appCode }"
          @click="selectApp(item)"
          v-for="item in appList"
          :key="item.appCode">{{ item.appName }}</div>
      </div>
    </div>
    <div class="column"></div>

    <div class="edit-perssion-content" v-if="hasData === 1">
      <div class="edit-header">
        <el-checkbox v-model="appInfo.isSelect" size="medium">开通{{appInfo.appName}}</el-checkbox>
      </div>

      <div class="edit-item" v-show="appPerssionData.shopList.length > 0">
        <div class="item-header">
          <span class="title">门店访问权限</span>

          <label class="check-all-checkbox" for="checkall" v-show="!(isAndroidDayPrice || isMemberManagementIOS)">
            <el-checkbox v-model="shopListAllCheck" @change="toCheckAllShop">全选</el-checkbox>
          </label>
        </div>

        <div class="item-body" v-if="isAndroidDayPrice || isMemberManagementIOS">
          <el-radio-group v-model="androidDayPriceShopItem">
            <el-radio
              class="android-day-pice-shop-item"
              v-for="(item, index) in appPerssionData.shopList"
              :key="index"
              :label="item.name" :title="item.name" :disabled="isWXB"></el-radio>
          </el-radio-group>
        </div>
        <div class="item-body" v-else>
          <div v-for="item in appPerssionData.shopList" :key="item.name" class="item-check">
            <el-checkbox v-model="item.isSelect" :title="item.name">{{item.name}}</el-checkbox>
          </div>
        </div>
      </div>

      <div class="member-management-control" v-if="isMemberManagementIOS">
        <div class="member-management-title">敏感信息设置</div>
        <div class="member-management-content">
          <div>
            <el-checkbox v-model="MemberManagementIOSData.phone" true-label="1" false-label="0" size="medium" :disabled="MemberManagementIOSData.phone ? false : true">拨打电话功能</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.selectConsumeRecord" true-label="1" false-label="0" size="medium" :disabled="MemberManagementIOSData.selectConsumeRecord ? false : true">查看消费记录</el-checkbox>
          </div>
        </div>
        <div class="member-management-title">赠送操作设置</div>
        <div class="member-management-content-1">
          <div>
            <el-checkbox v-if="clerkId" v-model="MemberManagementIOSData.giveIntegral" true-label="1" false-label="0" size="medium" :disabled="MemberManagementIOSData.giveIntegral ? false : true">赠送积分</el-checkbox>
            <el-checkbox v-else v-model="MemberManagementIOSData.giveIntegral" true-label="1" false-label="0" size="medium" disabled>赠送积分</el-checkbox>
            <span class="info-item-1">
              设置每月可赠送积分限额：
              <el-input style="width:120px" maxlength="7" :disabled="MemberManagementIOSData.giveIntegral && MemberManagementIOSData.giveIntegral === '1' ? false : true"  v-model="MemberManagementIOSData.giveIntegralLimit" @keyup.native="chechIntegralLimit" @blur="showLimitTip=false"></el-input>
            </span>
            <!-- <span class="info-item-1-tip" v-show="showLimitTip">(注：设置赠送积分限额不能超过{{giveNum.giveIntegralLimit}})</span> -->
            <span class="info-item-1-tip" v-show="showLimitTip">(注：设置赠送积分限额不能超过{{9999999}})</span>
            <span class="info-item-2">
              本月余额：
              <span class="info-item-echart">{{surplusList.surplusIntegral}}</span>
            </span>
          </div>
          <div>
            <el-checkbox v-if="clerkId" v-model="MemberManagementIOSData.giveCoupon" true-label="1" false-label="0" size="medium" :disabled="MemberManagementIOSData.giveCoupon ? false : true">赠送优惠券</el-checkbox>
            <el-checkbox v-else v-model="MemberManagementIOSData.giveCoupon" true-label="1" false-label="0" size="medium" disabled>赠送优惠券</el-checkbox>
            <span class="info-item-2">
              设置每月可赠送优惠券张数：
              <el-input style="width:120px" maxlength="7" :disabled="MemberManagementIOSData.giveCoupon && MemberManagementIOSData.giveCoupon === '1'? false : true" v-model="MemberManagementIOSData.giveCouponNum" @keyup.native="chechCoupon" @blur="showCouponTip=false"></el-input>
            </span>
            <span class="info-item-1-tip" v-show="showCouponTip">(注：设置赠送优惠券不能超过{{9999999}})</span>
            <span class="info-item-2">
              本月余额：
              <span class="info-item-echart">{{surplusList.surplusCoupon}}</span>
            </span>
          </div>
        </div>
        <div class="member-management-title">其他操作</div>
        <div class="member-management-content">
          <div>
            <el-checkbox v-model="MemberManagementIOSData.sendSms" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.sendSms">发送短信</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.inviteReviews" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.inviteReviews">邀请评价</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.addFlag" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.addFlag">添加标签</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.followRecord" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.followRecord">跟进记录</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.memberInvite" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.memberInvite">会员邀请</el-checkbox>
          </div>
        </div>
        <div class="member-management-header">批量功能开关</div>
        <div class="member-management-title">信息发送</div>
        <div class="member-management-content">
          <div>
            <el-checkbox v-model="MemberManagementIOSData.sendWxTemplateByBatch" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.sendWxTemplateByBatch">批量发送微信模板信息</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.sendSmsByBatch" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.sendSmsByBatch">批量发送短信消息</el-checkbox>
          </div>
        </div>

        <div class="member-management-title">系统默认客服（用于服务无门店、导购归属的公众号新粉丝）</div>
        <div class="member-management-content">
          <div>
            <el-checkbox v-model="MemberManagementIOSData.systemCService" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.systemCService">系统级客服</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.shopCService" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.shopCService">门店级客服</el-checkbox>
          </div>
        </div>
        <div class="member-management-title">店长权限控制</div>
        <div class="member-management-content">
          <div>
            <el-checkbox v-model="MemberManagementIOSData.setFans" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.setFans">分配粉丝</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.setMembers" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.setMembers">分配会员</el-checkbox>
          </div>
          <div style="width: 280px">
            <el-checkbox v-model="MemberManagementIOSData.queryShopFollowCollect" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.queryShopFollowCollect">是否允许店长查看其它导购跟进记录</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.queryBatchMsgCollect" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.queryBatchMsgCollect">查看批量消息记录汇总</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="MemberManagementIOSData.queryShoppingGuideMemberCount" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.queryShoppingGuideMemberCount">查看门店导购持有会员统计</el-checkbox>
          </div>
          <div style="margin-left: 25px">
            <el-checkbox v-model="MemberManagementIOSData.queryCustomerAllocateRecords" true-label="1" false-label="0" size="medium" :disabled="!MemberManagementIOSData.queryCustomerAllocateRecords">店长调拨客户记录</el-checkbox>
          </div>
        </div>

      </div>

      <div v-else>
        <div class="edit-item" v-show="appPerssionData.menuList.length > 0">
          <div class="item-header">
            <span class="title">用户菜单设置</span>
          </div>
          <div class="item-body">
            <div class="menu-content" style="width: 100%" v-for="item in appPerssionData.menuList" :key="item.appCode">
              <div class="menu">
                <el-checkbox v-model="item.isSelect" size="medium">{{item.menuName}}</el-checkbox>
              </div>
              <div class="item-menu">
                <div v-for="menuItem in item.childMenu" :key="menuItem.menuId">
                  <el-checkbox v-model="menuItem.isSelect" @change="menuItemChange(menuItem)">{{menuItem.menuName}}</el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="edit-item" v-show="appPerssionData.appMenuPermissionList.length > 0">
          <div class="item-header">
            <span class="title">菜单访问权限</span>
          </div>
          <div class="item-body">
            <div v-for="item in appPerssionData.appMenuPermissionList" :key="item.id" class="item-check">
              <el-checkbox @change="topChange(item)" v-model="item.value" size="medium" true-label="1" false-label="0">{{item.name}}</el-checkbox>
              <div class="child-item-menu">
                <el-checkbox
                  style="font-size:12px;"
                  v-for="childItem in item.childMenu"
                  :key="childItem.id"
                  @change="itemChange(item, childItem.value)"
                  v-model="childItem.value"
                  true-label="1"
                  false-label="0">{{childItem.name}}</el-checkbox>
              </div>
            </div>
          </div>
        </div>

        <div class="edit-item" v-show="appPerssionData.otherPermissionList.length > 0">
          <div class="item-header">
            <span class="title">其他权限控制</span>
          </div>
          <div class="item-body">
            <el-form label-width="180px" v-for="(ite, index) in appPerssionData.otherPermissionList" :key="index">
              <el-form-item label="" v-if="ite.type == 'checkbox'">
                <el-checkbox
                  style="padding-right: 20px;"
                  true-label="1"
                  false-label="0"
                  v-model="ite.value">{{ ite.name }}
                </el-checkbox>
              </el-form-item>
              <el-form-item :label="ite.name" v-if="ite.type == 'textbox'">
                <el-input v-model="ite.value" :placeholder="ite.name" style="width: 320px"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

    </div>

    <div v-if="hasData === 1" class="submit-btn"><el-button size="small" @click="submitPermission" type="primary">保存</el-button></div>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import user from '@/utils/user';
import { getAllChannelList, getAppsByChannel, getAccountAllPermission, updateAccountPermissionMethods } from '@/api/system-set';

@Component({
})
export default class PerssionEdit extends Vue {
  @Prop()
  data!: any;
  private channel: any = '';
  private channelList = [];
  private appList = [];
  private appInfo = {
    appCode: '',
    isSelect: false
  };
  private appPerssionData = {
    shopList: [],
    menuList: [],
    appMenuPermissionList: [],
    otherPermissionList: []
  };
  private isFreeMember = null; // 是否免费身份标识
  private shopListAllCheck: boolean = false;
  private menuListAllCheck: boolean = false;
  private androidDayPriceShopItem: any = '';
  private showLimitTip: boolean = false;
  private showCouponTip: boolean = false;
  private MemberManagementIOSData = {
    phone: '0',
    selectConsumeRecord: '0',
    giveIntegral: '0',
    giveIntegralLimit: '',
    giveCoupon: '0',
    giveCouponNum: '',
    sendSms: '0',
    inviteReviews: '0',
    addFlag: '0',
    followRecord: '0',
    memberInvite: '0',
    sendWxTemplateByBatch: '0',
    sendSmsByBatch: '0',
    // 系统默认客服
    systemCService: '0',
    shopCService: '0',
    // 店长权限
    setFans: '0',
    setMembers: '0',
    queryShopFollowCollect: '0',
    queryBatchMsgCollect: '0',
    queryShoppingGuideMemberCount: '0',
    queryCustomerAllocateRecords: '0'
  }
  private clerkId = null;
  // 赠送积分 赠送优惠券
  private giveNum = {
    giveIntegralLimit: '',
    giveCouponNum: ''
  }
  private surplusList = {
    surplusIntegral: 0, // 本月积分余额
    surplusCoupon: 0 // 本月优惠券余额
  }
  private hasData = 1 // 是否有标识数据 1为有 0 为没有

  get isAndroidDayPrice() {
    return this.appInfo.appCode === 'dayPrice' && this.channel === 'android_tv';
  }

  get isMemberManagementIOS() {
    return this.appInfo.appCode === 'memberManagement' && this.channel === 'ios';
  }
  // 郭佳峰要求,微销宝不让选择,其他的都可以，代码写死
  get isWXB() {
    return this.appInfo.appCode === 'memberManagement' && this.channel === 'ios';
  }

  private mounted() {
    this.getAllChannelList();
    this.isFreeMember = user.serverUser.isFreeMember;
  }
  // 用户菜单设置 参数设置判断免费会员公众号设置
  private isAbled(item: string) {
    if (this.isFreeMember === 1) {
      switch (item) {
        case '公众号绑定':
          return true
        case '小程序绑定':
          return true
        case '自动回复设置':
          return true
        case '微信消息设置':
          return true
      }
    } else {
      return false;
    }
  }
  // 门店全选
  private toCheckAllShop(value: any) {
    const list = this.appPerssionData.shopList.map((p: any) => {
      return {
        isSelect: value,
        name: p.name
      }
    });
    (this.appPerssionData.shopList as any) = list;
  }
  // 库存特殊情况
  private topChange(data: any) {
    if (data.otherCode == 'inventoryQuery' || data.otherCode == 'stock_query') {
      const index = this.appPerssionData.appMenuPermissionList.findIndex((p: any) => p.id == data.id);
      if (data.value == '1') {
        (this.appPerssionData.appMenuPermissionList[index] as any).childMenu[0].value = '1';
        (this.appPerssionData.appMenuPermissionList[index] as any).childMenu[1].value = '1';
      } else {
        (this.appPerssionData.appMenuPermissionList[index] as any).childMenu.forEach((p: any) => {
          p.value = '0';
        })
      }
    }
  }
  private itemChange(data: any, isCheck: any) {
    if (data.otherCode == 'inventoryQuery' || data.otherCode == 'stock_query') {
      const index = this.appPerssionData.appMenuPermissionList.findIndex((p: any) => p.id == data.id);
      if (isCheck == '1') {
        (this.appPerssionData.appMenuPermissionList[index] as any).value = '1';
      } else {
        const itemList = (this.appPerssionData.appMenuPermissionList[index] as any).childMenu;
        const result = itemList.filter((p: any) => p.value == '1');
        if (result.length <= 0) {
          (this.appPerssionData.appMenuPermissionList[index] as any).value = '0';
        }
      }
    }
  }
  // 选择通道
  private selectAppPlatform(data: any) {
    this.channel = data.channel;
    this.getAppsByChannel();
  }
  // 选择应用
  private selectApp(data: any) {
    this.appInfo = data;
    this.getAccountAllPermission();
  }
  // 选择二级菜单时   默认勾选一级菜单
  private menuItemChange(value: any) {
    if (value.isSelect) {
      const index = this.appPerssionData.menuList.findIndex((p: any) => p.menuId == value.parentId);
      this.$nextTick(() => {
        (this.appPerssionData.menuList[index] as any).isSelect = true;
      })
    }
  }
  // 获取通道列表
  private getAllChannelList() {
    getAllChannelList().then((res: any) => {
      this.channelList = res.data ? res.data : [];
      // this.channelList = res.data && this.isFreeMember === 1 ? res.data.filter((item: any) => item.category === 'CRM') : res.data || [];
      this.channel = res.data && res.data.length > 0 ? res.data[0].channel : '';
      this.getAppsByChannel();
    })
  }
  // 根据通道获取应用
  private getAppsByChannel() {
    const params = {
      accountId: this.data.accountId,
      channel: this.channel
    };
    getAppsByChannel(params).then((res: any) => {
      this.appList = res.data ? res.data : [];
      if (res.data && res.data.length > 0) {
        this.appInfo = res.data[0];
        this.hasData = 1;
        this.getAccountAllPermission();
      } else {
        this.hasData = 0;
        this.appInfo = {
          appCode: '',
          isSelect: false
        };
      }
    })
  }
  // 获取会员权限
  private getAccountAllPermission() {
    const params = {
      accountId: this.data.accountId,
      channel: this.channel,
      appCode: this.appInfo.appCode
    }
    getAccountAllPermission(params).then((res: any) => {
      // 门店权限
      const list = res.data && res.data.shopPermissionList ? res.data.shopPermissionList : [];
      if (this.isAndroidDayPrice || this.isMemberManagementIOS) {
        const item = list.find((p: any) => {
          return p.isSelect;
        })
        this.androidDayPriceShopItem = item ? item.name : '';
      } else {
        // 判断门店是否全选
        if (list.length > 0) {
          const item = list.find((p: any) => {
            return !p.isSelect;
          })
          this.shopListAllCheck = typeof(item) === 'undefined';
        } else {
          this.shopListAllCheck = false;
        }
      }
      this.appPerssionData.shopList = list;
      // 本月余额数
      this.surplusList.surplusIntegral = res.data && res.data.surplusIntegral ? res.data.surplusIntegral : this.surplusList.surplusIntegral;
      this.surplusList.surplusCoupon = res.data && res.data.surplusCoupon ? res.data.surplusCoupon : this.surplusList.surplusCoupon;
      this.clerkId = res.data.clerkId || this.clerkId;
      if (this.isMemberManagementIOS) {
        this.MemberManagementIOSData = res.data && res.data.memberManagementPermission ? res.data.memberManagementPermission : this.MemberManagementIOSData;
        this.giveNum.giveIntegralLimit = res.data && res.data.memberManagementPermission ? res.data.memberManagementPermission.giveIntegralLimit : this.giveNum.giveIntegralLimit;
        this.giveNum.giveCouponNum = res.data && res.data.memberManagementPermission ? res.data.memberManagementPermission.giveCouponNum : this.giveNum.giveCouponNum;
        // 判断有没有导购
        if (!this.clerkId) {
          (this.MemberManagementIOSData as any).giveIntegral = '0';
          (this.MemberManagementIOSData as any).giveCoupon = '0';
        }
      } else {
        // 用户菜单权限
        this.appPerssionData.menuList = res.data && res.data.menuPermissionList ? res.data.menuPermissionList : [];
        // 其他权限
        if (res.data && res.data.otherPermissionList) {
          this.appPerssionData.appMenuPermissionList = res.data.otherPermissionList.filter((p: any) => {
            return p.type == 'mobile';
          });
          this.appPerssionData.otherPermissionList = res.data.otherPermissionList.filter((p: any) => {
            return p.type != 'mobile';
          })
        } else {
          this.appPerssionData.appMenuPermissionList = [];
          this.appPerssionData.otherPermissionList = [];
        }
      }
    })
  }
  // 检验赠送积分设置
  private chechIntegralLimit() {
    const reg = /^(0+)|[^\d]+/g;
    if (this.MemberManagementIOSData.giveIntegralLimit === '') {
      return;
    }
    if (reg.test(this.MemberManagementIOSData.giveIntegralLimit)) {
      this.MemberManagementIOSData.giveIntegralLimit = '';
    }
    const mGiveIntegralLimit: any = parseInt(this.MemberManagementIOSData.giveIntegralLimit, 10);
    const giveIntegralLimit: any = parseInt(this.giveNum.giveIntegralLimit, 10);
    const numLimit = 9999999
    if (mGiveIntegralLimit > numLimit) {
      this.showLimitTip = true;
      // this.MemberManagementIOSData.giveIntegralLimit = this.giveNum.giveIntegralLimit;
    } else {
      this.showLimitTip = false;
    }
  }
  // 检验赠送优惠券设置
  private chechCoupon() {
    const reg = /^(0+)|[^\d]+/g;
    if (this.MemberManagementIOSData.giveCouponNum === '') {
      return;
    }
    if (reg.test(this.MemberManagementIOSData.giveCouponNum)) {
      this.MemberManagementIOSData.giveCouponNum = '';
    }
    const mGiveCouponNum: any = parseInt(this.MemberManagementIOSData.giveCouponNum, 10);
    const giveCouponNum: any = parseInt(this.giveNum.giveCouponNum, 10);
    const numLimit = 9999999
    if (mGiveCouponNum > numLimit) {
      this.showCouponTip = true;
      // this.MemberManagementIOSData.giveCouponNum = this.giveNum.giveCouponNum;
    } else {
      this.showCouponTip = false;
    }
  }
  // 权限保存
  private submitPermission() {
    const params = {
      accountId: this.data.accountId,
      appCode: this.appInfo.appCode,
      appStatus: this.appInfo.isSelect ? '0' : '1',
      shopPermission: '',
      menuPermission: '',
      otherPermission: '',
      memberManagementPermission: '',
      channel: this.channel
    }
    // 门店
    if (this.isAndroidDayPrice || this.isMemberManagementIOS) {
      // 安卓门店只能选一个
      params.shopPermission = this.androidDayPriceShopItem;
    } else {
      const shopList = this.appPerssionData.shopList.filter((p: any) => p.isSelect).map((p: any) => p.name);
      params.shopPermission = shopList.join(',');
    }
    if (this.isMemberManagementIOS) {
      delete params.menuPermission;
      delete params.otherPermission;
      params.memberManagementPermission = JSON.stringify(this.MemberManagementIOSData);
    } else {
      delete params.memberManagementPermission;
      // 菜单
      const menuList = [];
      for (const item of this.appPerssionData.menuList) {
        if ((item as any).isSelect) {
          menuList.push((item as any).menuId);
          if ((item as any).childMenu) {
            (item as any).childMenu.forEach((p: any) => {
              if (p.isSelect) {
                menuList.push(p.menuId)
              }
            })
          }
        }
      }
      params.menuPermission = menuList.join(',');
      // 其他
      const otherPermission: any[] = [];
      this.appPerssionData.appMenuPermissionList.forEach((p: any) => {
        otherPermission.push({
          id: p.id,
          value: p.value
        })
        if (p.childMenu && p.childMenu.length > 0) {
          p.childMenu.forEach((t: any) => {
            otherPermission.push({
              id: t.id,
              value: t.value
            })
          })
        }
      });
      this.appPerssionData.otherPermissionList.forEach((p: any) => {
        otherPermission.push({
          id: p.id,
          value: p.value
        })
      });
      params.otherPermission = JSON.stringify(otherPermission);
    }
    if (this.MemberManagementIOSData.giveIntegral === '1' && this.MemberManagementIOSData.giveIntegralLimit === '') {
      this.$message.error('请设置每个账号每月可赠送积分限额');
      const docElem: any = document.querySelector('.info-item-1 .el-input__inner');
      docElem.focus();
      return;
    }
    if (this.MemberManagementIOSData.giveCoupon === '1' && this.MemberManagementIOSData.giveCouponNum === '') {
      this.$message.error('请设置每个账号每月可赠送优惠券张数');
      const docElem: any = document.querySelector('.info-item-2 .el-input__inner');
      docElem.focus();
      return;
    }
    // 判断应用是否开通
    if (!this.appInfo.isSelect) {
      this.$confirm('确定取消开通该应用权限？', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '不，开通并提交',
        type: 'warning'
      }).then(() => {
        this.toSubmitPermission(params);
      }).catch(() => {
        this.appInfo.isSelect = true;
        params.appStatus = '0';
        this.toSubmitPermission(params);
      });
    } else {
      this.toSubmitPermission(params);
      // 未开通则判断是否有勾选门店，未勾选则提醒用户  微信端中的积分商城和微证书不需要门店  手机中客资管理系统不需要门店 (超级MKT下的奖品设置和活动设置不需要:fangzong)
      // console.log(params.appCode)
      // console.log(this.channel)
      // if (
      //   (this.channel == 'wx' && (params.appCode == 'creditShop' || params.appCode == 'productCheck' || params.appCode == 'paramSet')) ||
      //   (this.channel == 'mini' && (params.appCode == 'prizeSet' || params.appCode == 'activitySet')) ||
      //   ((this.channel == 'android' || this.channel == 'ios') && (params.appCode == 'ornament' || params.appCode == 'customManage' || params.appCode == 'customManage')) ||
      //   params.shopPermission.length > 0) {
      //   this.toSubmitPermission(params);
      // } else {
      //   this.$message('请选择可访问的门店，否则无法正常使用！')
      // }
    }
  }
  private toSubmitPermission(params: any) {
    updateAccountPermissionMethods(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！'
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.perssion-edit {
  > .title {
    height: 42px;
    line-height: 42px;
    padding-left: 12px;
    font-size: 14px;
    font-weight: bolder;
    color: #9a1301;
    background-color: #fdf1ee;
    > i {
      padding: 0 2px;
    }
  }
  .app-platform {
    background-color: #f7f7f7;
    width: 100%;
    height: 48px;
    display: flex;
    border-bottom: 1px solid #dddddd;
    border-top: 1px solid #dddddd;
    .platform-item {
      font-size: 15px;
      color: #333333;
      padding: 0 28px;
      height: 48px;
      line-height: 40px;
      border-top: 5px solid #f7f7f7;
      cursor: pointer;
    }
    .platform-item:not(:last-child) {
      border-right: 1px solid #e9e9e9;
    }
    .selected {
      border-top: 5px solid #6699ff;
      background-color: white;
      color: #6699ff;
      font-weight: bold;
    }
  }

  .app-tab-list {
    display: flex;
    .tab-list {
      // flex-grow: 1;
      // display: flex;
      // align-items: center;
      // overflow-x: scroll;
      flex-grow: 1;
      display: -webkit-box;
      align-items: center;
      overflow-x: scroll;
      .itme {
        width: 96px;
        text-align: center;
        font-size: 14px;
        height: 45px;
        line-height: 45px;
        color: #333333;
        box-sizing: border-box;
        cursor: pointer;
        border-bottom: 2px solid white;
      }
      .selected {
        border-bottom: 2px solid #6699ff;
        color: #6699ff;
        font-weight: bold;
      }
    }
    .tab-btn {
      width: 60px;
      height: 45px;
      line-height: 65px;
      .tab-item-btn {
        padding-right: 8px;
        cursor: pointer;
        color: #cccccc;
      }
      .tab-item-btn:hover {
        color: black;
      }
    }
  }

  .column {
    width: 100%;
    height: 10px;
    background-color: #eeeeee;
  }

  .edit-perssion-content {
    height: calc(100vh - 340px);
    // overflow: auto;
    .edit-header {
      height: 50px;
      line-height: 50px;
      padding-left: 23px;
      background-color: #f7f7f7;
      color: #6699ff;
      font-weight: bold;
      border-bottom: 1px solid #dddddd;
    }
    .edit-item {
      margin: 0 30px 0 23px;
      border-bottom: 1px solid #dddddd;
      .item-header {
        padding-top: 8px;
        .title {
          font-size: 14px;
          font-weight: bold;
          color: #6699ff;
          padding-right: 12px;
        }
        .select-btn {
          font-size: 18px;
          display: inline;
          vertical-align: middle;
          cursor: pointer;
        }
        .check-all-checkbox {
          font-size: 14px;
          display: inline-block;
          cursor: pointer;
        }
        #checkall {
          display: inline;
          vertical-align: middle;
          opacity: 0;
        }
      }
    }
    .item-body {
      padding-bottom: 12px;
      display: flex;
      flex-wrap: wrap;
      .item-check {
        // display: inline-block;
        display: flex;
        align-items: center;
        width: 220px;
        padding-top: 12px;
        color: #666666;
        // .child-item-menu {
        //   // height: 50px;
        // }
      }
      .menu {
        padding-top: 12px;
        font-weight: bold;
      }
      .item-menu {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 18px;
        div {
          width: 210px;
          padding-top: 12px;
        }
      }
      .android-day-pice-shop-item {
        width: 210px;
        padding-top: 12px;
        color: #666666;
        font-size: 14px;
      }
      .menu-content:not(:last-child) {
        border-bottom: 1px solid #dddddd;
      }
    }
    .member-management-control {
      height: calc(100vh - 340px);
      // overflow: auto;
      .member-management-title{
        padding: 8px;
        background: #f9f9f9;
        color: #606266;
        font-size: 14px;
        margin: 22px 23px 14px 23px;
      }
      .member-management-header {
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        padding: 28px 0 0 25px;
      }
      .member-management-content {
        display: flex;
        flex-wrap: wrap;
        padding-left: 25px;
        div {
          width: 180px;
          padding-top: 12px;
        }
      }
      .member-management-content-1 {
        padding-left: 25px;
        div {
          padding-top: 10px;
        }
        span {
          font-size: 14px;
          color: #606266;
        }
        .info-item-1 {
          padding-left: 58px;
        }
        .info-item-2 {
          padding-left: 30px;
          .info-item-echart{
            display: inline-block;
            // width: 80px;
            // border: 1px solid #DCDFE6;
            background-color: #fff;
            border-radius: 4px;
            color: #606266;
            height: 40px;
            line-height: 40px;
            text-align: center;
            vertical-align: middle;
            // cursor: not-allowed;
          }
        }
        .info-item-1-tip{
          font-size: 12px;
          margin-left: 10px;
          color:#f56c6c;
        }
      }
    }
  }

  .submit-btn {
    padding: 10px 23px;
    position: fixed;
    bottom: 25px;
    z-index: 800;
  }
}
</style>
<style lang="scss">
  .android-day-pice-shop-item{
    .el-radio__label{
      width: 210px;
      white-space: initial;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      display: inline-block;
      -webkit-box-orient:vertical;
      vertical-align: middle;
    }
  }
  .item-body .el-checkbox__label{
    width: 95%;
    white-space: initial;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    display: inline-block;
    -webkit-box-orient:vertical;
    vertical-align: middle;
  }
  .member-management-content-1{
    .el-input__inner{
      text-align: center;
    }
  }
</style>
