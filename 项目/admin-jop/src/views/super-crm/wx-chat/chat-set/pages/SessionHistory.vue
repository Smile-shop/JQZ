<template>
  <article class="chat-set">
    <el-form :inline="true" :model="chatInfo" class="demo-form-inline">
      <el-form-item label="客服：">
        <el-select v-model="chatInfo.shop" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in chatInfoShopList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="chatInfo.servicer" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in chatInfoServiceList"
            :key="item.accountId"
            :label="item.kfNick"
            :value="item.accountId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
          v-model="chatInfo.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="init">查询</el-button>
      </el-form-item>
      <el-button type="primary" :loading="downloadLoading" @click="handleDownload" class="export-btn" plain>导出查询结果</el-button>
    </el-form>

    <div class="session-content">
      <div class="table">
        <el-table
          :data="tableData"
          style="width: calc(100% - 30px);margin:15px auto"
          border
          @row-click="rowClick"
          :row-class-name="tableRowClassName"
          :row-style="tableRowStyle">
          <el-table-column
            prop="nickName"
            label="客户名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="接入时间"
            align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | momentFilter() }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="duration"
            label="总会话时长"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.duration}}s</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="chatCount"
            label="总次数"
            align="center">
          </el-table-column>
          <el-table-column
            prop="kfNick"
            label="客服"
            align="center">
          </el-table-column>
          <el-table-column
            prop="age"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <a :aa="scope">查看</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="table-page"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          :page-size.sync="page.pageSize"
          @size-change="init"
          @current-change="init"
          :current-page.sync="page.current"
          :total="page.total"
        ></el-pagination>
      </div>
      <div class="session">
        <div class="title">
          会话记录
          <audio v-show="false" id="audioSave" controls autoplay="false" preload="metadata"></audio>
          <!-- <Table v-show="false" :columns="columns" :data="tableData" ref="table"></Table> -->
        </div>
        <div class="content">
          <div class="session-item" v-for="(item, index) in sessionHistory" :key="index">
            <div class="time">{{item.msgTime}}</div>
            <div v-for="(chatItem, chatIndex) in item.chatDetail" :key="chatIndex">
              <div class="session-con" v-if="chatItem.opercode === 'c_001'">
                <div class="name customer">
                  {{chatItem.nickName}}<span>{{chatItem.msgTime}}</span>
                </div>
                <div v-if="chatItem.msgType === 'text'">{{chatItem.texts}}</div>
                <div v-if="chatItem.msgType === 'voice'" @click="playAudio(chatItem.texts)" class="voice">语音...</div>
                <div v-if="chatItem.msgType === 'image'"><img style="max-width:100%" :src="computedImg(chatItem.texts)" :alt="chatItem.texts"></div>
              </div>
              <div class="session-con" v-else>
                <div class="name servicer">
                  {{chatItem.kfNick}}<span>{{chatItem.msgTime}}</span>
                </div>
                <div v-if="chatItem.msgType === 'text'">{{chatItem.texts}}</div>
                <div v-if="chatItem.msgType === 'voice'" @click="playAudio(chatItem.texts)" class="voice">语音...</div>
                <div v-if="chatItem.msgType === 'image'"><img style="max-width:100%" :src="computedImg(chatItem.texts)" :alt="chatItem.texts"></div>
              </div>
            </div>
            <div class="session-end">客服关闭对话</div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getChatInfoShopList, getChatInfoServiceList, getChatSessionList, getChatHistoryList } from '@/api/super-crm/wx-chat';
import exportCsv from '@/utils/exportCsv';
import moment from 'moment';

@Component({
})
export default class ChatSet extends Vue {
  private formInline = {
    shopName: '',
    time: ''
  };
  private tableData = [];
  private getIndex = null;
  private ruleInline = {};
  private chatInfoShopList = [];
  private chatInfoServiceList = [];
  private chatInfo = {
    shop: '',
    servicer: '',
    time: '',
  };
  private sessionHistory = [];
  private url = {
    imgUrl: '',
    voiceUrl: ''
  };
  private page = {
    total: 0,
    pageSize: 10,
    current: 1
  };
  private downloadLoading: boolean = false;

  @Watch('chatInfo.shop')
  onShop(val: any) {
    this.chatInfo.servicer = '';
    this.getChatInfoServiceList(val);
  }

  private mounted() {
    this.getChatInfoShopList();
    this.init();
    this.getChatInfoServiceList('');
  }

  private playAudio(value: any) {
    const audio = document.getElementById('audioSave');
    (audio as any).src = value;
  }

  private computedImg(value: any) {
    return `${this.url.imgUrl}${value}`;
  }

  private tableRowStyle({row, rowIndex}: any) {
    if (rowIndex === (this.getIndex)) {
      return {
        'background-color': '#6699ff'
      };
    }
    return '';
  }

  private tableRowClassName({row, rowIndex}: any) {
    row.index = rowIndex;
  }

  private rowClick(row: any) {
    this.getIndex = row.index;
    return this.getChatHistoryList(row.openid);
  }

  private getChatInfoShopList() {
    getChatInfoShopList().then((res: any) => {
      this.chatInfoShopList = res.data && res.data.shopName ? res.data.shopName.split(',') : [];
    })
  }

  private getChatInfoServiceList(shopName: any) {
    const params = {
      shopName
    }
    getChatInfoServiceList(params).then((res: any) => {
      this.chatInfoServiceList = res.data || [];
    })
  }

  private async init() {
    const res: any = await this.getChatSessionList();
    this.tableData = res.data.list || [];
    this.page.total = res.data.total || 0;
  }

  private getChatSessionList(pageSize?: number, currentPage?: number) {
    const params = {
      page: {
        pageSize: pageSize || this.page.pageSize,
        pageNum: currentPage || this.page.current
      },
      params: {
        shopName: this.chatInfo.shop,
        startTime: this.chatInfo.time[0] || '',
        endTime: this.chatInfo.time[1] || '',
        accountId: this.chatInfo.servicer
      }
    }
    return new Promise((resolve: any) => {
      getChatSessionList(params).then((res: any) => {
        this.sessionHistory = [];
        resolve(res);
        // if (res.data && res.data.list) {
        //   this.tableData = res.data.list;
        //   this.page.total = res.data.total;
        //   // this.page.current = res.data.pages;
        // } else {
        //   this.tableData = [];
        //   this.page.total = 0;
        //   this.page.current = 1;
        // }
      })
    })
  }

  private async handleDownload() {
    this.downloadLoading = true;
    const res: any = await this.getChatSessionList(100000, 1);
    const data = res.data.list || [];
    if (data.length > 0) {
      data.forEach((item: any) => {
        item.time = moment(new Date(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
        item.long = item.duration + 's';
      });
      exportCsv({
        quoted: true,
        separator: ',',
        filename: '会话记录',
        columns: [
          {
            title: '客户名称',
            key: 'nickName'
          },
          {
            title: '接入时间',
            key: 'time'
          },
          {
            title: '总会话时长',
            key: 'long'
          },
          {
            title: '总次数',
            key: 'chatCount'
          },
          {
            title: '客服',
            key: 'kfNick'
          }
        ],
        data
      });
      this.downloadLoading = false;
    }
  }

  private getChatHistoryList(openid: any) {
    const params = {
      startTime: this.chatInfo.time[0] || '',
      endTime: this.chatInfo.time[1] || '',
      openid
    }
    getChatHistoryList(params).then((res: any) => {
      this.sessionHistory = res.data && res.data.chatList ? res.data.chatList : [];
      this.url.imgUrl = res.data && res.data.url ? res.data.url.imgUrl : '';
      this.url.voiceUrl = res.data && res.data.url ? res.data.url.voiceUrl : '';
    })
  }
}
</script>

<style lang="scss" scoped>
.chat-set {
  .demo-form-inline {
    height: 80px;
    border-radius: 5px;
    background-color: #f5f5f5;
    padding: 20px;
    position: relative;
    .export-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
  .session-content {
    border-top: 1px solid #dddddd;
    display: flex;
    .table {
      flex-grow: 1;
      position: relative;
      .page-div {
        position: absolute;
        bottom: 12px;
        right: 12px;
      }
      .table-page {
        // position: fixed;
        // bottom: 15px;
        // right: 20px;
        text-align: right;
        margin-top: 15px;
      }
    }
    .session {
      width: 400px;
      height: calc(100vh - 280px);
      border-left: 1px solid #dddddd;
      .title {
        border-bottom: 1px solid #dddddd;
        font-family: MicrosoftYaHei-Bold;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
        line-height: 44px;
        padding-left: 12px;
        height: 44px;
      }
      .content {
        height: calc(100% - 45px);
        overflow: auto;
        .session-item {
          width: 380px;
          margin: 0 auto;
          border-bottom: 1px solid #dddddd;
          .time {
            text-align: center;
            padding: 8px 0;
          }
          .session-con {
            padding-bottom: 8px;
            font-size: 12px;
            .customer {
              color: #85ce61;
            }
            .servicer {
              color: #6699ff;
            }
            .voice {
              width: 120px;
              height: 35px;
              line-height: 35px;
              background-color: #6699ff;
              border-radius: 5px;
              color: #ffffff;
              padding-left: 12px;
              cursor: pointer;
            }
          }
          .session-end {
            font-size: 12px;
            color: #ff0000;
            padding-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>


