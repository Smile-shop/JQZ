<template>
  <article class="position-bind">
    <div class="content-title">
      <div class="title-btn">
        <el-button type="primary" @click="goBack">返回</el-button>
      </div>
      <div class="title"> 
        <span class="title-1">绑定职位：</span>
        <span class="title-2">{{ data.positionName }}</span>
        <span class="title-3">( 请选择要绑定该职位的子账户 )</span>
      </div>
      <div class="title-btn"></div>
    </div> 

    <div class="account-list-with-group" v-for="accountGroup in accountListByGroup" :key="accountGroup.id">
      <div class="group-name">{{accountGroup.name}}</div>
      <div class="group-list">
        <div class="group-item" v-for="item in accountGroup.list" :key="item.id">
          <el-checkbox v-model="item.isSelect" size="large">{{item.name}}{{item.nickName ? ` / ${item.nickName}` : ''}}</el-checkbox>
          <span class="account-list">{{accountListBinded(item.positionList)}}</span>
        </div>
      </div>
    </div>

    <div class="account-list-with-group" v-if="accountNotBindList.length > 0">
      <div class="group-name">未分组列表</div>
      <div class="group-list">
        <div class="group-item" v-for="item in accountNotBindList" :key="item.id">
          <el-checkbox v-model="item.isSelect" size="large">{{item.name}}{{item.nickName ? ` / ${item.nickName}` : ''}}</el-checkbox>
        </div>
      </div>
    </div>

    <div class="content-footer">
      <el-button type="primary" @click="toBindAccountMethods">绑定职位</el-button>
    </div>

  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import user from '@/utils/user';
import { getAllAccountPositionListInfo, toBindAccountMethods } from '@/api/system-set';

@Component({
})
export default class PositionBind extends Vue {
  @Prop()
  data: any

  private accountListByGroup = [];
  private accountNotBindList = [];

  private mounted() {
    this.getAllAccountPositionListInfo();
  }

  private getAllAccountPositionListInfo() {
    const params = {
      positionId: this.data.positionId,
      accountId: user.serverUser.account.accountId
    }
    getAllAccountPositionListInfo(params).then((res: any) => {
      this.accountListByGroup = res.data.listAccountGroup.map((p: any) => {
        const groupList = p.listAPG.map((item: any) => {
          return {
            name: item.name,
            id: item.id,
            nickName: item.nickName,
            positionList: item.listAccountPosition,
            isSelect: item.listAccountPosition.findIndex((p: any) => p.positionId == this.data.positionId) > -1
          };
        });
        return {
          name: p.name,
          id: p.id,
          list: groupList
        }
      });

      this.accountNotBindList = res.data.listAccountNotBindingGroup.map((p: any) => {
        return {
          name: p.name,
          id: p.id,
          nickName: p.nickName,
          isSelect: p.listAccountPosition.findIndex((item: any) => item.positionId == this.data.positionId) > -1
        }
      });
    })
  }
  // 账户绑定的职位（除去现在要绑定的）
  private accountListBinded(list: any) {
    const positionList = list.filter((p: any) => p.positionId != this.data.positionId).map((p: any) => p.positionName);
    return positionList.length > 0 ? `( ${positionList.join('/')} )` : '';
  }

  private toBindAccountMethods() {
    const list: any[] = [];
    this.accountListByGroup.map((p: any) => {
      p.list.filter((item: any) => item.isSelect).map((item: any) => {
        list.push({
          accountId: item.id,
          accountName: item.name
        })
      })
    })
    this.accountNotBindList.filter((item: any) => item.isSelect).map((item: any) => {
      list.push({
        accountId: item.id,
        accountName: item.name
      })
    })
    const params = {
      positionId: this.data.positionId,
      listAPDtail: list
    }
    toBindAccountMethods(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '绑定成功！'
      })
    })
  }

  private goBack() {
    this.$emit('goBack');
  }
}
</script>

<style lang="scss" scoped>
.position-bind{
  .content-title {
    border-bottom: 1px solid #eeeeee;
    display: flex;
    height: 60px;
    align-items: center;
    .title-btn {
      width: 100px;
      text-align: center;
    }
    .title {
      flex-grow: 1;
      text-align: center;
      .title-1 {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
      }
      .title-2 {
        font-size: 18px;
        font-weight: bold;
        color: #6699ff;
      }
      .title-3 {
        font-size: 12px;
        color: #999999;
        padding-left: 8px;
      }
    }
  }
  .account-list-with-group {
    border-bottom: 1px solid #eeeeee;
    .group-name {
      font-size: 14px;
      font-weight: bold;
      padding: 8px 24px;
    }
    .group-list {
      padding: 0 24px 8px 24px;
      display: flex;
      flex-wrap: wrap;
      .group-item {
        width: 360px;
        padding-bottom: 8px;
        .account-list {
          font-size: 14px;
        }
      }
    }
  }
  .content-footer {
    padding: 8px 24px;
  }
}
</style>
