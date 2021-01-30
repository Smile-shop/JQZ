<template>
  <div class="app-home">
    <div class="title">客资管理数据统计</div>
    <div class="data-count-total">
      <div class="row row-1">
        <div class="item item-header-first">
          <p>今日新增潜在客户数
            <el-tooltip class="item" content="“线索池”和”潜在客”今日新增的潜在客户数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <p>{{customerData.todayAddCluePool + customerData.todayAddClientClue}}</p>
        </div>
        <div class="item">
          <p>今日新增目标客户数
            <el-tooltip class="item" content="“目标客户”和”客户池”今日新增的客户数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <p>{{customerData.todayAddClient + customerData.todayClientOpenSea}}</p>
        </div>
        <div class="item">
          <p>今日转会员数</p>
          <p>{{customerData.todayShiftMember}}</p>
        </div>
        <div class="item">
          <p>本周新增潜在客户数
            <el-tooltip class="item" content="“线索池”和”潜在客”本周新增的潜在客户数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <p>{{customerData.weekAddClientClue + customerData.weekAddCluePool}}</p>
        </div>
        <div class="item">
          <p>本周新增目标客户数
            <el-tooltip class="item" content="“目标客”和”客户池”本周新增的目标客户数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <p>{{customerData.weekAddClient + customerData.weekClientOpenSea}}</p>
        </div>
        <div class="item item-header-last">
          <p>周转会员数</p>
          <p>{{customerData.weekShiftMember}}</p>
        </div>
      </div>

      <div class="row row-2">
        <div class="item item-body item-footer-first">
          <p>本月新增潜在客户数
            <el-tooltip class="item" content="“线索池”和”潜在客”本月新增的潜在客户数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <p>{{customerData.monthAddCluePool + customerData.monthAddClientClue}}</p>
        </div>
        <div class="item item-body">
          <p>本月新增目标客户数
            <el-tooltip class="item" content="“目标客户”和”客户池”本月新增的客户数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <p>{{customerData.monthAddClient + customerData.monthClientOpenSea}}</p>
        </div>
        <div class="item item-body item-footer-last">
          <p>本月转会员数</p>
          <p>{{customerData.monthShiftMember}}</p>
        </div>
      </div>

      <div class="row row-3">
        <div class="item item-footer item-footer-first">
          <p>潜在客户总数
            <el-tooltip class="item" content="“线索池”和”潜在客”的潜在客户总数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <p>{{customerData.cluePoolSum + customerData.clientClueSum}}</p>
        </div>
        <div class="item item-footer">
          <p>目标客户总数
            <el-tooltip class="item" content="“目标客”和”客户池”的目标客户总数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <p>{{customerData.clientSum + customerData.clientOpenSeaSum}}</p>
        </div>
        <div class="item item-footer item-footer-last">
          <p>转会员总数</p>
          <p>{{customerData.shiftMemberSum}}</p>
        </div>
      </div>

    </div>
    <div class="title">快捷入口</div>
    <div class="app-menu">
      <div
        v-for="(item, index) in shortcutMenu"
        :key="index"
        class="app-menu-item"
      >
        <div class="app-name">
          <span class="name">
            {{item.name}}
          </span>
          <el-button
            circle
            icon="el-icon-plus"
            size="mini"
            plain
            @click="showShortcutMenuEditDialog(index)"
          >
          </el-button>
        </div>
        <div class="app-menu-list">
          <el-button
            v-for="(item, index) in item.menu"
            v-show="item.isShow === '1'"
            :key="index"
            type="primary"
            plain
            @click="shortcutMenuClick(item)"
          >
            {{item.name}}
          </el-button>
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
          v-for="(item, index) of shortcutMenu[checkedMenuIndex].menu"
          :key="index"
          v-model="item.isShow"
          true-label="1"
          false-label="0"
        >
          {{item.name}}
        </el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowShortcutMenuEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitShortcutMenuEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {State} from 'vuex-class';
import {
  getShortcutMenu,
  setShortcutMenu,
  getChartsData
} from '@/api/super-crm/home';
import {getCustomerResourceStatistics} from '@/api/common';

@Component({
})
export default class SuperAppHome extends Vue {
  @State('canAccessAppURL')
  canAccessAppURL!: any[];

  // 快捷菜单
  shortcutMenu: any[] = [];

  // 选择的快捷键菜单
  checkedMenuIndex = 0;

  // 是否显示快捷菜单编辑对话框
  isShowShortcutMenuEditDialog = false;

  customerData = {
    todayAddCluePool: 0,
    todayAddClientClue: 0,
    todayAddClient: 0,
    todayClientOpenSea: 0,
    todayShiftMember: 0,
    weekAddClientClue: 0,
    weekAddCluePool: 0,
    weekAddClient: 0,
    weekClientOpenSea: 0,
    weekShiftMember: 0,
    cluePoolSum: 0,
    clientClueSum: 0,
    clientSum: 0,
    clientOpenSeaSum: 0,
    shiftClientSum: 0,
    // 本月
    monthAddCluePool: 0,
    monthAddClientClue: 0,
    monthAddClient: 0,
    monthClientOpenSea: 0,
    monthShiftMember: 0
  }

  mounted() {
    this.getShortcutMenu();
    this.getSuperCrmCountInfo();
  }

  // 获取统计数据
  async getSuperCrmCountInfo() {
    const res = await getCustomerResourceStatistics();
    const {data} = res;
    this.customerData = data;
  }

  // 获取快捷菜单
  async getShortcutMenu() {
    const body = {
      category: 'PHONE'
    }

    const res = await getShortcutMenu(body);
    const {data} = res;

    this.shortcutMenu = data.filter((p: any) => p.appCode === 'customManage');

    return data;
  }

  // 快捷菜单点击
  shortcutMenuClick(item: any) {
    const {appCode} = item;
    const checkedMenuItem = this.canAccessAppURL.find((item: any) => {
      return item.appCode === appCode;
    })

    this.$router.push(checkedMenuItem.path);
  }

  // 显示快捷菜单编辑对话框
  showShortcutMenuEditDialog(index: number) {
    this.checkedMenuIndex = index;
    this.isShowShortcutMenuEditDialog = true;
  }

  // 提交快捷菜单修改
  async submitShortcutMenuEdit() {
    const checkedMenu = this.shortcutMenu[this.checkedMenuIndex];
    const checkedMenuItem = checkedMenu.menu.filter((item: any) => {
      return item.isShow === '1';
    })
    const checkedMenuItemAppCode = checkedMenuItem.map((item: any) => {
      return item.appCode;
    })

    const body = {
      appCode: checkedMenu.appCode,
      menu: checkedMenuItemAppCode.join(','),
      appSource: 'PHONE'
    }

    const res = await setShortcutMenu(body);
    const {data} = res;

    this.$message.success('修改成功');
    this.isShowShortcutMenuEditDialog = false;

    return data;
  }
}
</script>

<style lang="scss" scoped>
.app-home {
  .title {
    font-size: 16px;
    color: #606266;
  }
  .data-count-total {
    margin: 20px 0 30px 0;
    border: solid 1px #e4e7ed;
    background-color: #e4e7ed;
    border-radius: 5px;

    > .row {
      display: flex;

      &:not(:last-of-type) {
        border-bottom: 1px solid #e4e7ed;
      }

      &.row-1 {
        & > div {
          flex-basis: 16.66%;
          flex-shrink: 0;

          &:not(:last-of-type) {
            border-right: 1px solid #e4e7ed;
          }
        }
      }

      &.row-2, &.row-3 {
        & > div {
          flex-basis: 33.33%;
          flex-shrink: 0;

          &:not(:last-of-type) {
            border-right: 1px solid #e4e7ed;
          }
        }
      }

      > div {
        flex-grow: 1;
      }
    }

    .item {
      text-align: center;
      background-color: #ffffff;
      padding: 8px 0;
      p:first-child {
        font-size: 14px;
        color: #606266;
        line-height: 32px;
      }
      p:last-child {
        font-size: 36px;
        color: #6699ff;
        font-weight: bold;
      }
    }
    .item-header-first {
      border-top-left-radius: 5px;
    }
    .item-header-last {
      border-top-right-radius: 5px;
    }
    .item-body {
      p:last-child {
        padding-top: 8px;
        color: #6699ff;
      }
    }
    .item-footer {
      p:last-child {
        padding-top: 8px;
        color: #e12f30;
      }
    }
    .item-footer-first {
      border-bottom-left-radius: 5px;
    }
    .item-footer-last {
      border-bottom-right-radius: 5px;
    }
  }
  > .app-menu {
    margin-top: 20px;
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
          margin-right: 20px;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>


