<template>
  <div>
    <div class="home">
      <div class="container">
        <el-row :gutter="36">
          <el-col :span="8">
            <router-link
              :class="['super-crm', 'card', canAccess('/super-crm') ? 'active' : 'disable']"
              to="/super-crm"
            >
              <i class="iconfont icon-yingxiao"></i>
              <span>超级CRM</span>
            </router-link>
          </el-col>
          <el-col :span="8">
            <router-link
              :class="['super-mkt', 'card', canAccess('/super-mkt') ? 'active' : 'disable']"
              to="/super-mkt"
            >
              <i class="iconfont icon-yingxiaoguanli"></i>
              <span>超级MKT</span>
            </router-link>
          </el-col>
          <el-col :span="8">
            <router-link
              :class="['super-app', 'card', canAccess('/super-app') ? 'active' : 'disable']"
              to="/super-app"
            >
              <i class="iconfont icon-APPku"></i>
              <span>超级APP</span>
            </router-link>
          </el-col>
        </el-row>
        <el-row :gutter="36">
          <el-col :span="8">
            <router-link
              :class="['cloud-showroom', 'card', canAccess('/cloud-showroom') ? 'active' : 'disable']"
              to="/cloud-showroom"
            >
              <i class="iconfont icon-mendian1"></i>
              <span>云展厅</span>
            </router-link>
          </el-col>
          <el-col :span="8">
            <router-link
              :class="['school-video', 'card', 'active']"
              to="/school-video/index/list/超级CRM"
            >
              <i class="iconfont icon-xueyuan"></i>
              <span>商学院</span>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {
  getPageAppPermission,
  getLoginAccountMenuList,
} from '@/api/menu-controller';
import { State } from 'vuex-class';
import { initPermission } from '@/utils/permission';
import { Message } from 'element-ui';
import { locale } from 'moment';
import { pathCanAccess } from '@/utils/permission';

@Component({})
export default class Home extends Vue {
  mounted() {
    Promise.all([
      this.getSuperAppPermission(),
      this.getSuperCRMPermission(),
      this.getSuperMKTPermission(),
      this.getCloudShowroomPermission(),
      this.getFissionPermission(),
      this.getFissionPermission(),
    ]).then((res: any) => {
      const [
        superAPPPermission,
        superCRMPermission,
        superMKTPermission,
        cloudShowroomPermission,
        fissionPermission,
        prestorePermission
      ] = res;

      initPermission({
        superAPPPermission,
        superCRMPermission,
        superMKTPermission,
        cloudShowroomPermission,
        fissionPermission,
        prestorePermission
      });
    }, (res: any) => {
      Message.warning('权限获取失败');
    })
  }

  // 查询超级app手机端权限
  getSuperAppPermission() {
    return new Promise((resolve, reject) => {
      const body = {
        category: 'APP',
      };

      getLoginAccountMenuList(body).then((res: any) => {
        const { data } = res;
        const permission = data[0];

        resolve(permission);
      });
    });
  }

  // 查询超级CRM权限
  getSuperCRMPermission() {
    return new Promise((resolve, reject) => {
      const body = {
        category: 'CRM',
      };

      getLoginAccountMenuList(body).then((res: any) => {
        const { data } = res;
        const permission = data[0];

        resolve(permission);
      });
    });
  }

  // 查询云展厅
  getCloudShowroomPermission() {
    return new Promise((resolve, reject) => {
      const body = {
        category: 'CSR',
      };

      getLoginAccountMenuList(body).then((res: any) => {
        const { data } = res;
        const permission = data[0];

        resolve(permission);
      });
    });
  }

  // 查询分销列表
  getFissionPermission() {
    return new Promise((resolve, reject) => {
      const body = {
        category: 'DISTRI'
      }

      getLoginAccountMenuList(body).then((res: any) => {
        const {data} = res;
        const permission = data[0];

        resolve(permission);
      })
    })
  }

  // 查询超级MKT权限
  getSuperMKTPermission() {
    return new Promise((resolve, reject) => {
      const body = {
        category: 'MKT',
      };

      getLoginAccountMenuList(body).then((res: any) => {
        const { data } = res;
        const permission = data[0];

        resolve(permission);
      });
    });
  }

  // 能否进入
  canAccess(url: string): boolean {
    return pathCanAccess(url);
  }
}
</script>

<style lang="scss" scoped>
body {
  background-color: red;
}
.home {
  height: 100%;
  padding-top: 127px;
  padding-bottom: 127px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > .container {
    width: 1060px;

    > .el-row {
      margin-bottom: 36px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 260px;
      border-radius: 5px;
      color: #ffffff;
      font-size: 20px;
      background-color: #dddddd;
      cursor: pointer;

      > .iconfont {
        margin-bottom: 44px;
        font-size: 100px;
      }
    }

    .super-crm {
      &.active {
        background-image: linear-gradient(90deg, #48a4ef 0%, #62b8fe 100%);
      }
    }

    .super-mkt {
      &.active {
        background-image: linear-gradient(90deg, #54c794 0%, #7adcb1 100%);
      }
    }

    .super-app {
      &.active {
        background-image: linear-gradient(90deg, #f4bc4f 0%, #fdd17c 100%);
      }
    }
    .cloud-showroom {
      &.active {
        background: linear-gradient(270deg, #8b9cff 0%, #6675ff 100%);
      }
    }
    .school-video {
      &.active {
        background: linear-gradient(270deg, #53cfcb 0%, #00bdb9 100%);
      }
    }
  }
}
</style>
