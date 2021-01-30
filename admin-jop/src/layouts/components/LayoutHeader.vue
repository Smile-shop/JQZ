<template>
  <header class="layout-header">
    <div class="left">
      <img
        src="@/assets/icons/admin-jop-logo.png"
        alt="logo"
        @click="logoClick"
      >
      <div
        v-if="moduleRouteMeta.isModule"
        class="module"
      >
        <router-link
          class="name"
          :to="moduleRouteMeta.path"
        >
          {{moduleRouteMeta.moduleName}}
        </router-link>
      </div>
    </div>
    <div class="right">
      <div
        class="module-switch"
        @click="showModuleSwitchDialog"
      >
        <i class="iconfont icon-mokuai"></i>
        模块切换
      </div>
      <router-link
        to="/system-set"
        class="system-setup"
      >
        <i class="iconfont icon-shezhi"></i>
        系统设置
      </router-link>
      <el-dropdown class="user">
        <span>
          <i class="iconfont icon-zhanghu"></i>
          当前登录账户：{{user.account.loginName}}
          <i class="iconfont icon-jiantouarrow492 arrow"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="resetPsd">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="bindMethod" v-if="user.account.isAdmin === '1' && !isBindJMP">绑定</el-dropdown-item>
          <el-dropdown-item @click.native="cancelJMPBingMethod" v-if="user.account.isAdmin === '1' && isBindJMP">解绑</el-dropdown-item>
          <el-dropdown-item @click.native="logoutMethod">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="选择模块"
      :visible.sync="isShowModuleSwitchDialog"
      width="630px"
      :modal-append-to-body="false"
      class="module-switch-dialog"
    >
      <div class="module-switch-dialog-body module-top">
        <router-link
          to="/super-crm"
          :class="['module-item', canAccess('/super-crm') ? 'active' : 'disable']"
        >
          <div class="iconfont-box">
            <i class="iconfont icon-yingxiao"></i>
          </div>
          <span>
            超级CRM
          </span>
        </router-link>
        <router-link
          to="/super-mkt"
          :class="['module-item', canAccess('/super-mkt') ? 'active' : 'disable']"
        >
          <div class="iconfont-box">
            <i class="iconfont icon-yingxiaoguanli"></i>
          </div>
          <span>
            超级MKT
          </span>
        </router-link>
        <router-link
          to="/super-app"
          :class="['module-item', canAccess('/super-app') ? 'active' : 'disable']"
        >
          <div class="iconfont-box">
            <i class="iconfont icon-APPku"></i>
          </div>
          <span>
            超级APP
          </span>
        </router-link>
        <!-- <router-link
          to="/cloud-showroom"
          :class="['module-item', canAccess('/cloud-showroom') ? 'active' : 'disable']"
        >
          <div class="iconfont-box">
            <i class="iconfont icon-mendian1"></i>
          </div>
          <span>
            云展厅
          </span>
        </router-link> -->
      </div>
      <div class="module-switch-dialog-body module-bottom">
        <router-link
        to="/cloud-showroom"
        :class="['module-item', canAccess('/cloud-showroom') ? 'active' : 'disable']"
      >
        <div class="iconfont-box">
          <i class="iconfont icon-mendian1"></i>
        </div>
        <span>
          云展厅
        </span>
      </router-link>
      <router-link
        to="/school-video/index/list/超级CRM"
        :class="['module-item', 'active']"
      >
        <div class="iconfont-box xueyuan">
          <i class="iconfont icon-xueyuan"></i>
        </div>
        <span>
          商学院
        </span>
      </router-link>
      </div>
    </el-dialog>

    <el-dialog
      :title="`绑定JMP用户 - ${user.account.loginName}`"
      :visible.sync="bindJMPDialog"
      width="530px"
      :modal-append-to-body="false"
      :before-close="closeBindJMPDialog"
      class="module-switch-dialog"
    >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="JMP用户代码：" prop="jmpUserId">
        <el-input v-model="ruleForm.jmpUserId" placeholder="JMP用户代码"></el-input>
      </el-form-item>
      <el-form-item label="JMP密码：" prop="jmpPassword">
        <el-input v-model="ruleForm.jmpPassword" type="password" placeholder="JMP密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="JMPBingMethod('ruleForm')">确定</el-button>
        <el-button @click="bindCancel('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
  </header>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import {unCompileStrFunction} from '@/utils/storeageCompile';
import {logoutMethod, JMPBingMethod, cancelJMPBingMethod} from '@/api/menu-controller';
import {State} from 'vuex-class';
import {pathCanAccess} from '@/utils/permission';

@Component({
})
export default class LayoutHeader extends Vue {
  // 是否显示切换对话框
  isShowModuleSwitchDialog = false;
  // 账号是否绑定jmp
  isBindJMP = false;
  bindJMPDialog = false;
  // 是否返回首页
  isShowBackHome = true;

  @State('moduleRouteMeta')
  moduleRouteMeta: any;

  private ruleForm = {
    jmpUserId: '',
    jmpPassword: ''
  };

  private rules = {
    jmpUserId: [
      { required: true, message: 'JMP用户代码不能为空', trigger: 'blur' }
    ],
    jmpPassword: [
      { required: true, message: 'JMP密码不能为空', trigger: 'blur' }
    ]
  };

  showModuleSwitchDialog() {
    this.isShowModuleSwitchDialog = true;
  }

  get user(): any {
    const userStr = window.sessionStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(unCompileStrFunction(userStr));
      return user;
    }
    return null;
  }

  @Watch('$route')
  watchRouter(value: any) {
    this.isShowModuleSwitchDialog = false;

    if (value.fullPath.includes(this.moduleRouteMeta.path)) {
      this.isShowBackHome = false;
    } else {
      this.isShowBackHome = true;
    }
  }

  mounted() {
    this.isBindJMP = this.user.account.jmpUserId;
  }

  logoutMethod() {
    if (this.user) {
      logoutMethod({ticket: this.user.ticket}).then((res: any) => {
        if (res.code === 0) {
          this.$router.push({
            path: '/'
          })
        }
      })
    }
  }

  resetPsd() {
    this.$router.push({
      path: '/system-set/password-set/password-update/admin-password'
    })
  }

  bindMethod() {
    this.bindJMPDialog = true;
  }

  cancelJMPBingMethod() {
    this.$confirm(`是否确定解绑${this.user.account.loginName}吗？`, '信息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.toCancelJMPBingMethod();
    }).catch(() => {
      console.log('cancel')
    });
  }

  toCancelJMPBingMethod() {
    const params = {
      accountId: this.user.account.accountId,
      loginName: this.user.account.loginName
    };
    cancelJMPBingMethod(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '解绑成功！'
      });
      this.isBindJMP = false;
    })
  }

  JMPBingMethod(formName: string) {
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        const params = {
          accountId: this.user.account.accountId,
          loginName: this.user.account.loginName,
          jmpUserId: this.ruleForm.jmpUserId,
          jmpPassword: this.ruleForm.jmpPassword
        };
        JMPBingMethod(params).then((res: any) => {
          this.$message({
            type: 'success',
            message: '绑定成功！'
          });
          this.isBindJMP = true;
          this.bindCancel(formName);
        })
      } else {
        return false;
      }
    });
  }

  bindCancel(formName: string) {
    (this.$refs[formName] as any).resetFields();
    this.bindJMPDialog = false;
  }

  closeBindJMPDialog() {
    this.bindCancel('ruleForm');
  }

  // 能否进入
  canAccess(url: string): boolean {
    return pathCanAccess(url);
  }

  // 点击logo处理
  logoClick() {
    this.$router.push('/home/module');
  }
}
</script>

<style lang="scss" scoped>
.layout-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  height: 60px;
  background-color: #6699ff;

  > .left {
    display: flex;
    align-items: center;

    > img {
      cursor: pointer;
      margin-left: 23px;
      margin-right: 26px;
      height: 39px;
      width: auto;
    }

    > .module {
      display: flex;
      align-items: center;

      > .name {
        margin-right: 14px;
        font-size: 24px;
        color: #ffffff;
      }

      > .back-module-home {
        padding: 6px 12px;
        background-color: #5a7bc0;
        border-radius: 3px;
        font-size: 12px;
        color: #ffffff;
      }
    }
  }

  > .right {
    display: flex;

    > * {
      display: flex;
      align-items: center;
      padding: 0 30px;
      color: #fff;

      > .iconfont {
        font-size: 24px;
        margin-right: 9px;
      }
    }

    > .module-switch,  .system-setup{
      cursor: pointer;

      &:hover {
        background-color: #5a7bc0;
      }

      &.router-link-active {
        background-color: #5a7bc0;
      }
    }

    > .user {
      cursor: pointer;
      font-size: 16px;
      .arrow {
        margin-left: 10px;
        font-size: 13px;
      }
    }
  }

  .module-switch-dialog {
    .module-switch-dialog-body {
      display: flex;
      // justify-content: space-between;

      > .module-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #cccccc;
        font-size: 18px;
        background-color: #eceff6;
        width: 166px;
        height: 215px;
        border-radius: 5px;
        margin-left: 23px;

        > .iconfont-box {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 27px;
          border-radius: 50%;
          height: 80px;
          width: 80px;
          background-color: #dddddd;

          > .iconfont {
            font-size: 45px;
            color: #ffffff;
          }
        }

        &.active {
          color: #606266;

          &:nth-of-type(1) {
            > .iconfont-box {
              background-image: linear-gradient(90deg, #48a4ef 0%, #62b8fe 100%);
            }
          }

          &:nth-of-type(2) {
            > .iconfont-box {
              background-image: linear-gradient(90deg, #54c794 0%, #7adcb1 100%);
            }
            > .xueyuan{
              background-image: linear-gradient(270deg, #53cfcb 0%, #00bdb9 100%)
            }
          }

          &:nth-of-type(3) {
            > .iconfont-box {
              background-image: linear-gradient(90deg, #f4bc4f 0%, #fdd17c 100%);
            }
          }

          &:nth-of-type(4) {
            > .iconfont-box {
              background: linear-gradient(270deg, #8B9CFF 0%, #6675FF 100%);
            }
          }
        }

        &:hover {
          background-color: #dde1ea;
        }
      }
    }
    .module-top {
      margin-bottom: 30px;
    }
    .module-bottom {
      padding-top: 30px;
      border-top-style: dotted;
      border-top-color: #979797;
    }
  }
}
</style>
