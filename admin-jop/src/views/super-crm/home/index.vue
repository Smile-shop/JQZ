<template>
  <div class="super-crm-home">
    <div class="count">
      <div class="count-group vip">
        <div class="title">微会员数据统计
          <el-tooltip content="此处微会员统计为系统设置，门店管理下所有门店微会员（所有可选项）" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div class="content">
          <!-- <div>
            <span class="name">剩余验证短信</span>
            <span class="value">{{crmCountInfo.smsCount.val / 10}}</span>
          </div> -->
          <div>
            <span class="name">微会员总数
              <!-- <el-popover placement="top-start" trigger="hover" content="JMP中创建时间在今天的会员数">
                <el-icon type="icon-wenhao" size="16px" slot="reference" color="#606266" />
              </el-popover> -->
            </span>
            <span class="sub-name">（截止到当前）</span>
            <span class="value">{{qryMemberInfo.memberCount.allMember}}</span>
          </div>
          <div>
            <span class="name">昨日新增微会员
              <!-- <el-popover placement="top-start" trigger="hover" content="JMP中创建时间在今天的会员数">
                <el-icon type="icon-wenhao" size="16px" slot="reference" color="#606266" />
              </el-popover> -->
            </span>
            <span class="value">{{qryMemberInfo.memberCount.beforeDay}}</span>
          </div>
          <div>
            <span class="name">今日新增微会员
              <!-- <el-popover placement="top-start" trigger="hover" content="JMP中创建时间在今天的会员数">
                <el-icon type="icon-wenhao" size="16px" slot="reference" color="#606266" />
              </el-popover> -->
            </span>
            <span class="value">{{qryMemberInfo.memberCount.addDay}}</span>
          </div>
          <div>
            <span class="name">
              微会员日活跃
              <!-- <el-popover placement="top-start" trigger="hover" content="当天访问的用户数量">
                <el-icon type="icon-wenhao" size="16px" slot="reference" color="#606266" />
              </el-popover> -->
            </span>
            <span class="value">{{qryMemberInfo.memberCount.activitDay}}</span>
          </div>
          <div>
            <span class="name">
              微会员周活跃
              <!-- <el-popover placement="top-start" trigger="hover" content="7天内访问的用户数量">
                <el-icon type="icon-wenhao" size="16px" slot="reference" color="#606266" />
              </el-popover> -->
            </span>
            <span class="value">{{qryMemberInfo.memberCount.activitWeek}}</span>
          </div>
          <div>
            <span class="name">
              微会员月活跃
              <!-- <el-popover placement="top-start" trigger="hover" content="30天内访问的用户数量">
                <el-icon type="icon-wenhao" size="16px" slot="reference" color="#606266" />
              </el-popover> -->
            </span>
            <span class="value">{{qryMemberInfo.memberCount.activitMonth}}</span>
          </div>
        </div>
      </div>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="门店：">
        <el-select v-model="formInline.shopName" placeholder="门店">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
          v-model="formInline.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions01">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getMemberGroupShop">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="color: #606266;">
      <span>累积新增微会员: {{memberChart.allMember}}</span>
    </div>
    <div class="charts">
      <ve-line :data="chartsData"></ve-line>
    </div>
    <div class="count">
      <div class="count-group official-accounts">
        <div class="title">公众号粉丝统计</div>
        <div class="content">
          <div>
            <span class="name">当前粉丝总数</span>
            <span class="sub-name">（截止到昨日）</span>
            <span class="value">{{qryFansInfo.wxFansCountCrmVO.allFans}}</span>
          </div>
          <div>
            <span class="name">累计粉丝总数</span>
            <span class="sub-name">（截止到昨日）</span>
            <span class="value">{{qryFansInfo.wxFansCountCrmVO.totalFans}}</span>
          </div>
          <div>
            <span class="name">昨日新增粉丝数</span>
            <span class="value">{{qryFansInfo.wxFansCountCrmVO.beforeDayAdd}}</span>
          </div>
          <div>
            <span class="name">昨日取关粉丝数</span>
            <span class="value">{{qryFansInfo.wxFansCountCrmVO.beforeDayPass}}</span>
          </div>
          <!-- <div>
            <span class="name">今日新增粉丝数</span>
            <span class="value">{{qryFansInfo.wxFansCountCrmVO.addDay}}</span>
          </div>
          <div>
            <span class="name">今日取关粉丝数</span>
            <span class="value">{{qryFansInfo.wxFansCountCrmVO.passDay}}</span>
          </div> -->
        </div>
      </div>
    </div>
    <el-form :inline="true" :model="formInline2" class="demo-form-inline">
      <!-- <el-form-item label="门店：">
        <el-select v-model="formInline2.shopName" placeholder="门店">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopName"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="时间：">
        <el-date-picker
          v-model="formInline2.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions01">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getFansGroupShop">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="color: #606266;">
      <span>累积新增粉丝: {{fansChart.allAddFansNum}}</span>
      <span style="margin-left: 20px">累积取关粉丝: {{fansChart.allPassFansNum}}</span>
    </div>
    <div class="charts">
      <ve-line :data="fansiChartsData"></ve-line>
    </div>
    <div class="quick-entry">
      <div class="title">快捷入口</div>
      <div class="app-menu">
        <div v-for="(item, index) in shortcutMenu" :key="index" class="app-menu-item">
          <div class="app-name">
            <span class="name">{{item.name}}</span>
            <el-button
              circle
              icon="el-icon-plus"
              size="mini"
              plain
              @click="showShortcutMenuEditDialog(index)"
            ></el-button>
          </div>
          <div class="app-menu-list">
            <el-button
              v-for="(item, index) in (isFreeMember === 1 ? item.menu.filter(p => p.name !== '在线预约' && p.name !== '优惠券设置') : item.menu)"
              v-show="item.isShow === '1'"
              :key="index"
              type="primary"
              plain
              @click="shortcutMenuClick(item)"
            >{{item.name}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-if="shortcutMenu.length"
      :title="`菜单编辑-${shortcutMenu[checkedMenuIndex].name}`"
      :visible.sync="isShowShortcutMenuEditDialog"
      width="700px"
    >
      <div class="menu-list">
        <el-checkbox
          v-for="(item, index) of (isFreeMember === 1 ? shortcutMenu[checkedMenuIndex].menu.filter(p => p.name !== '优惠券设置' && p.name !== '在线预约') : shortcutMenu[checkedMenuIndex].menu)"
          :key="index"
          v-model="item.isShow"
          true-label="1"
          false-label="0"
        >{{item.name}}</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowShortcutMenuEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitShortcutMenuEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import user from '@/utils/user';
import {
  getSuperCrmCountInfo,
  getShortcutMenu,
  setShortcutMenu,
  getChartsData,
  qryMemberInfoInCrm,
  qryMemberTableInCrm,
  qryFansInfoInCrm,
  qryFansTableInCrm
} from '@/api/super-crm/home'
import {  getSelectShopList } from '@/api/super-crm/wx-data';
import moment from 'moment'
import ElIcon from '@/components/ElIcon.vue'

@Component({
  components: {
    ElIcon
  }
})
export default class SuperCRMHome extends Vue {
  @State('canAccessAppURL')
  canAccessAppURL!: any[]
  isFreeMember = null; // 是否免费身份标识
  // 统计信息
  crmCountInfo = {
    clueCount: {
      clueAll: 0,
      clueFullNum: 0,
      clueNum: 0
    },
    memberCount: {
      activitDay: 0,
      activitMonth: 0,
      activitWeek: 0,
      addDay: 0
    },
    smsCount: {
      val: 0
    }
  }
  // 会员数据统计
  qryMemberInfo = {
    memberCount: {
      activitDay: 0,
      beforeDay: 0,
      activitMonth: 0,
      activitWeek: 0,
      addDay: 0,
      allMember: 0
    }
  }
  // 粉丝数据统计
  qryFansInfo = {
    wxFansCountCrmVO: {
      allFans: 0,
      beforeDayAdd: 0,
      beforeDayPass: 0,
      addDay: 0,
      passDay: 0,
      totalFans: 0
    }
  }
  // 门店查询1
  formInline = {
    shopName: '',
    time: [ moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD'),
         moment()
        .format('YYYY-MM-DD')]
  };
  // 公众号粉丝门店查询
  formInline2 = {
    shopName: '',
    time: [ moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD'),
         moment()
        .format('YYYY-MM-DD')]
  };
  shopList = [];
  // 日期快捷键
  pickerOptions01 = {
    shortcuts: [{
      text: '最近一周',
      onClick(picker: any) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker: any) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近三个月',
      onClick(picker: any) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }]
  }

  // 快捷菜单
  shortcutMenu: any[] = []

  // 选择的快捷键菜单
  checkedMenuIndex = 0

  // 是否显示快捷菜单编辑对话框
  isShowShortcutMenuEditDialog = false

  // 图表数据
  chartsData: {
    columns: string[]
    rows: any[]
  } = {
    columns: ['日期', '新增会员'],
    rows: []
  }
  // 粉丝图表数据统计
  fansiChartsData: {
    columns: string[]
    rows: any[],
  } = {
    columns: ['日期', '新增粉丝', '粉丝取关'],
    rows: []
  }
  memberChart = {
    // 累积新增微会员
    allMember: 0
  }
  fansChart = {
    // 累计新增粉丝
    allAddFansNum: 0,
    // 累计取关粉丝
    allPassFansNum: 0
  }
  mounted() {
    this.getShortcutMenu()

    this.qryMemberInfoInCrm();
    this.qryFansInfoInCrm();
    this.qryMemberTableInCrm();
    this.qryFansTableInCrm();

    getSelectShopList({showStatus: '1'}).then((res: any) => {
      this.shopList = res.data.list || [];
    })
    this.isFreeMember = user.serverUser.isFreeMember;
  }

  // 查询会员图表数据统计
  getMemberGroupShop() {
    this.qryMemberTableInCrm();
  }
  // 查询粉丝图表数据统计
  getFansGroupShop() {
    this.qryFansTableInCrm();
  }

  // 获取统计数据
  async getSuperCrmCountInfo() {
    const body = {}

    const res = await getSuperCrmCountInfo(body)
    const { data } = res

    this.crmCountInfo = data

    return data
  }
  // 获取微会员数据统计
  async qryMemberInfoInCrm() {
    const res = await qryMemberInfoInCrm();
    const { data } = res;
    if (data.memberCount) {
      this.qryMemberInfo = data
    }
  }
  // 获取粉丝数据统计
  async qryFansInfoInCrm() {
    const res = await qryFansInfoInCrm();
    const { data } = res;
    if (data.wxFansCountCrmVO) {
      this.qryFansInfo = data
    }
  }

  // 获取快捷菜单
  async getShortcutMenu() {
    const body = {
      category: 'CRM'
    }

    const res = await getShortcutMenu(body)
    const { data } = res

    this.shortcutMenu = data
    return data
  }

  // 快捷菜单点击
  shortcutMenuClick(item: any) {
    const { appCode } = item
    const checkedMenuItem = this.canAccessAppURL.find((item: any) => {
      return item.appCode === appCode
    })

    this.$router.push(checkedMenuItem.path)
  }

  // 显示快捷菜单编辑对话框
  showShortcutMenuEditDialog(index: number) {
    this.checkedMenuIndex = index
    this.isShowShortcutMenuEditDialog = true
  }

  // 提交快捷菜单修改
  async submitShortcutMenuEdit() {
    const checkedMenu = this.shortcutMenu[this.checkedMenuIndex]
    const checkedMenuItem = checkedMenu.menu.filter((item: any) => {
      return item.isShow === '1'
    })
    const checkedMenuItemAppCode = checkedMenuItem.map((item: any) => {
      return item.appCode
    })

    const body = {
      appCode: checkedMenu.appCode,
      menu: checkedMenuItemAppCode.join(',')
    }

    const res = await setShortcutMenu(body)
    const { data } = res

    this.$message.success('修改成功')
    this.isShowShortcutMenuEditDialog = false

    return data
  }

  // 获取会员图表数据统计
  async qryMemberTableInCrm() {
    const body = {
      startTime: this.formInline.time.length > 0 ? this.formInline.time[0] : '',
      endTime: this.formInline.time.length > 0 ? this.formInline.time[1] : '',
      shopName: this.formInline.shopName
    }
    try {
      const res = await qryMemberTableInCrm(body)
      const { data } = res

      const { addMember, allMember } = data

      interface DataFormatElement {
        日期: string
        新增会员: number
      }

      const dataFormat: DataFormatElement[] = []

      addMember.forEach((item: any, index: number) => {
        dataFormat.push({
          日期: item.dateTime,
          新增会员: item.memberNum,
        })
      })

      this.memberChart.allMember = allMember
      this.chartsData.rows = dataFormat
    } catch (err) {
      this.$message.warning('图表数据获取失败')
      console.error(err)
    }
  }

  // 获取粉丝图表数据
  async qryFansTableInCrm() {
    const body = {
      startTime: this.formInline2.time.length > 0 ? this.formInline2.time[0] : '',
      endTime: this.formInline2.time.length > 0 ? this.formInline2.time[1] : '',
      shopName: this.formInline2.shopName
    }

    try {
      const res = await qryFansTableInCrm(body)
      const { data } = res

      const { addFans, passFans, allAddFansNum, allPassFansNum } = data

      interface DataFormatElement {
        日期: string
        新增粉丝: number
        粉丝取关: number
      }

      const dataFormat: DataFormatElement[] = []

      addFans.forEach((item: any, index: number) => {
        dataFormat.push({
          日期: item.dateTime,
          新增粉丝: item.addFansNum,
          粉丝取关: passFans[index].passFansNum,
        })
      })
      this.fansChart.allAddFansNum = allAddFansNum
      this.fansChart.allPassFansNum = allPassFansNum
      this.fansiChartsData.rows = dataFormat
    } catch (err) {
      this.$message.warning('图表数据获取失败')
      console.error(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.super-crm-home {
  > .count {
    > .count-group {
      margin-bottom: 20px;

      > .title {
        margin-bottom: 20px;
        font-size: 16px;
        color: #606266;
      }

      > .content {
        display: flex;
        justify-content: space-between;

        > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          border: 1px solid #e4e7ed;
          border-right: none;
          height: 110px;

          &:last-of-type {
            border-right: 1px solid #e4e7ed;
          }

          > .name {
            margin-bottom: 5px;
            font-size: 14px;
            color: #606266;
          }
          > .sub-name {
            font-size: 14px;
            color: #606266;
          }

          > .value {
            font-size: 36px;
            color: #6699ff;
          }
        }
      }
    }
  }

  > .quick-entry {
    > .title {
      margin-bottom: 20px;
      color: #606266;
      font-size: 16px;
    }

    > .app-menu {
      > .app-menu-item {
        margin-bottom: 20px;

        > .app-name {
          margin-bottom: 20px;

          > .name {
            margin-right: 10px;
            font-size: 16px;
            color: #606266;
          }
        }

        > .app-menu-list {
          display: flex;
          flex-wrap: wrap;

          > button {
            margin: 0;
            margin-bottom: 20px;
            margin-right: 20px;
          }
        }
      }
    }
  }

  .menu-list {
    display: flex;
    flex-wrap: wrap;

    & > * {
      margin-right: 50px;
      margin-bottom: 20px;
    }
  }
}
</style>
