<template>
  <article class="servicer-report">
    <el-tabs v-model="activeName">
      <el-tab-pane label="会话统计" name="1">
        <div class="number-info">
          <div class="item">
            <div>当日会话</div>
            <div>{{todayData.chatDayNum}}</div>
          </div>
          <div class="item">
            <div>当日在线客服</div>
            <div>{{todayData.kfOnlineNum}}</div>
          </div>
          <div class="item">
            <div>当日信息总数</div>
            <div>{{todayData.chatMsgNum}}</div>
          </div>
          <!-- <div class="item">
            <div>平均会话时长</div>
            <div>{{todayData.chatMsgAvr}}</div>
          </div> -->
        </div>
        <div class="search-content">
          <el-form ref="chatInfo" :model="chatInfo" inline>
            <div style="display:inline-block;padding-top:8px">时间：</div>
            <el-form-item>
              <el-date-picker
                v-model="chatInfo.date"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <div style="display:inline-block;padding-top:8px">客服：</div>
            <el-form-item>
              <el-select v-model="chatInfo.shop" style="width: 150px" placeholder="选择门店">
                <el-option label="全部" value=""></el-option>
                <el-option :value="item" :label="item" v-for="(item, index) in chatInfoShopList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="chatInfo.servicer" style="width: 150px" placeholder="选择客服">
                <el-option label="全部" value=""></el-option>
                <el-option :value="item.accountId" :label="item.kfNick" v-for="(item, index) in chatInfoServiceList" :key="index"></el-option>
              </el-select>
            </el-form-item> 
            <el-form-item>
              <el-button type="primary" @click="getChatHistory">查询</el-button>
            </el-form-item>
            <!-- <el-button type="primary" @click="exportTableData">导出</el-button> -->
          </el-form>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="shopName"
            label="门店"
            align="center">
          </el-table-column>
          <el-table-column
            prop="kfName"
            label="客服"
            align="center">
          </el-table-column>
          <el-table-column
            prop="toChat"
            label="主动会话次数"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="beChat"
            label="被动会话次数"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="shopName"
            label="总会话次数"
            sortable
            align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.toChat + scope.row.beChat }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="历史趋势" name="2">
        <div class="search-content-1">
          <el-button-group>
            <el-button :type="source === 'chartNum' ? 'primary' : 'default'" @click="getSource('chartNum')">会话数量</el-button>
            <el-button :type="source === 'msgNum' ? 'primary' : 'default'" @click="getSource('msgNum')">信息数量</el-button>
            <!-- <el-button :type="source === 'avrNum' ? 'primary' : 'default'" @click="getSource('avrNum')">平均会话时长</el-button> -->
          </el-button-group>
          <el-date-picker
            v-model="DataTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            style="margin: 0 15px;"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="primary" @click="getChartData">查询</el-button>

          <div class="chart">
            <ve-line :data="chartDataStore" :loading="loading" :data-empty="dataEmpty" :settings="chartSettings" width="1200px" height="500px"></ve-line>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>


  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getChatInfoShopList, getChatInfoServiceList, getChatHistory, getTodayStatic, getChartData } from '@/api/super-crm/wx-chat';
import moment from 'moment';

@Component({
})
export default class ServicerReport extends Vue {
  private activeName: string = '1';
  private todayData = {
    chatDayNum: 0,
    kfOnlineNum: 0,
    chatMsgNum: 0,
    chatMsgAvr: 0,
  };
  private chatInfo = {
    shop: '',
    servicer: '',
    date: []
  };
  private chatInfoShopList = [];
  private chatInfoServiceList = [];
  private tableData = [];
  private page = {
    total: 0,
    pageSize: 10000,
    current: 1
  };

  private source: string = 'chartNum';
  private DataTime = [];
  private chartSettings = {
    yAxisType: ['0,0a']
  }
  private loading: boolean = false;
  private dataEmpty: boolean = false;
  private chartDataStore = {
    columns: ['日期', '数量'],
    rows: []
  }

  @Watch('chatInfo.shop')
  onShop(val: any) {
    this.chatInfo.servicer = '';
    this.getChatInfoServiceList(val);
  }

  private mounted() {
    const startTime = moment().subtract(7, 'days').format('YYYY-MM-DD');
    (this.chatInfo.date as any) = [startTime, moment().format('YYYY-MM-DD')];
    this.DataTime = this.chatInfo.date;
    this.getChatInfoShopList();
    this.getChatHistory();
    this.getTodayStatic();
    this.getChartData();
  }

  private getTodayStatic() {
    getTodayStatic({}).then((res: any) => {
      this.todayData = res.data ? res.data : {
        chatDayNum: 0,
        kfOnlineNum: 0,
        chatMsgNum: 0,
        chatMsgAvr: 0,
      };
    })
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

  private getChatHistory() {
    const params = {
      page: {
        pageSize: this.page.pageSize,
        pageNum: this.page.current
      },
      params: {
        startTime: this.chatInfo.date[0] || '',
        endTime: this.chatInfo.date[1] || '',
        accountId: this.chatInfo.servicer,
        shopName: this.chatInfo.shop
      }
    }
    getChatHistory(params).then((res: any) => {
      this.tableData = res.data ? res.data.list : [];
    })
  }

  private getSource(value: string) {
    this.source = value;
    this.getChartData();
  }

  private getChartData() {
    const params = {
      source: this.source,
      startTime: this.DataTime[0] || '',
      endTime: this.DataTime[1] || ''
    }
    this.loading = true;
    getChartData(params).then((res: any) => {
      this.loading = false;
      if (res.data && res.data.length > 0) {
        this.dataEmpty = false;
        const rows = res.data.map((p: any) => {
          return {
            日期: p.nyr,
            数量: p.countNum
          }
        })
        this.chartDataStore = {
          columns: ['日期', '数量'],
          rows
        }
      } else {
        this.dataEmpty = true;
        this.chartDataStore = {
          columns: [],
          rows: []
        }
      }
    })
    // $http({
    //   url: `${this.baseUrl}/chat-web/chatInfo/getChart`,
    //   method: 'post'
    // }, params).then((res: any) => {
    //   this.loading = false;
    //   if(res.data.code === 0) {
    //     console.log(res)
    //     if(res.data.data && res.data.data.length > 0) {
    //       this.dataEmpty = false;
    //       const rows = res.data.data.map(p => {
    //         return {
    //           '日期': p.nyr,
    //           '数量': p.countNum
    //         }
    //       })
    //       this.chartDataStore = {
    //         columns: ['日期', '数量'],
    //         rows: rows
    //       }
    //     } else {
    //       this.dataEmpty = true;
    //       this.chartDataStore = {
    //         columns: [],
    //         rows: []
    //       }
    //     }
    //   } else {
    //     this.$Message.error(res.data.msg);
    //   }
    // })
  }

}
</script>

<style lang="scss" scoped>
.servicer-report {
  .number-info {
    display: flex;
    align-items: center;
    border: solid 1px #dddddd;
    height: 100px;
    margin: 0 auto;
    .item {
      flex-grow: 1;
      text-align: center;
      height: 100px;
      div:first-child {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        line-height: 42px;
        color: #666666;
      }
      div:last-child {
        font-family: MicrosoftYaHei;
        font-size: 30px;
        color: #666666;
      }
    }
    .item:not(:last-child) {
      border-right: 1px solid #dddddd;
    }
  }
  .search-content {
    font-size: 14px;
    margin: 15px auto;
    padding: 25px 20px 0 20px;
    border-radius: 5px;
    border: 1px solid #dddee1;
    background-color: #eeeeee
  }
  .search-content-1 {
    width: calc(100% - 30px);
    margin: 0 auto;
  }
}
</style>


