<template>
  <article class="message-setting">
    <section class="setting-info">
      <el-button type="primary" icon="el-icon-upload" @click="asyncTemplate" :loading="asyncTemplateLoading">同步模板ID</el-button>
      <span>最近同步时间：
        <span class="time" v-if="isAsync.isAsync">{{ isAsync.time | momentFilter('YYYY-MM-DD') }}</span>
        <span class="info" v-else>您还未同步过模板ID</span>
      </span>
    </section>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top:24px">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        align="center"
        width="300">
      </el-table-column>
      <el-table-column
        prop="tmNum"
        label="编号"
        align="center"
        width="240">
      </el-table-column>
      <el-table-column
        prop="templateId"
        label="模板ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        align="center"
        width="240">
        <template slot-scope="scope">
          <el-button size="small" @click="editTemplate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PoupBox
      v-model="show"
      @cancel="show = false"
      width="900">
      <div class="poup-box-header" slot="header">{{title}}</div>
      <div class="poup-box-body" slot="body">
        <div class="phone-show">
          <div class="header">公众号</div>
          <div class="body">
            <div class="details">
              <div class="title">{{TemplateMap.name}}</div>
              <div class="time">4月22日</div>
              <div class="hh-msg" :style="{'color': startMsgColor}">{{form.startMsg || form.startPlaceholder}}</div>
              <div class="hh-msg" v-for="(item, index) in TemplateMap.bodyMsg" :key="index">
                <span>{{item.title}}</span>:
                <span :style="{'color': bodyMsgColor[index]}">{{item.value}}</span>
              </div>
              <div class="hh-msg" :style="{'color': endMsgColor}">{{form.endMsg || form.endPlaceholder}}</div>
            </div>
            <div class="footer">详情</div>
          </div>
        </div>
        <div class="poup-box-body-form">
          <div class="item">
            <p class="label">修改消息开始语</p>
            <el-row>
              <el-col :span="22">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  v-model="form.startMsg"
                  style="font-size:12px;"
                  maxlength="100"
                  show-word-limit
                  :placeholder="form.startPlaceholder"></el-input>
              </el-col>
              <el-col :span="2" style="text-align:right">
                <el-color-picker v-model="startMsgColor" color-format="hex" :predefine="predefineColors" v-if="false"></el-color-picker>
              </el-col>
            </el-row>
          </div>

          <div class="item" v-for="(item, index) in TemplateMap.bodyMsg" :key="index">
            <p class="label">{{item.title}}</p>
            <el-row>
              <el-col :span="22">
                <el-input v-model="item.value" :disabled="true" style="font-size:12px;"></el-input>
              </el-col>
              <el-col :span="2" style="text-align:right">
                <el-color-picker v-model="bodyMsgColor[index]" color-format="hex" :predefine="predefineColors"></el-color-picker>
              </el-col>
            </el-row>
          </div> 

          <div class="item">
            <p class="label">修改消息结束语</p>
            <el-row>
              <el-col :span="22">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  v-model="form.endMsg"
                  style="font-size:12px"
                  maxlength="100"
                  show-word-limit
                  :placeholder="form.endPlaceholder"></el-input>
              </el-col>
              <el-col :span="2" style="text-align:right">
                <el-color-picker v-model="endMsgColor" color-format="hex" :predefine="predefineColors"></el-color-picker>
              </el-col>
            </el-row>
          </div>

          <div class="item">
            <p class="label">添加点击跳转链接</p>
            <el-radio-group v-model="form.urlType">
              <el-radio label="1">微会员首页</el-radio>
              <el-radio label="2">自定义链接</el-radio>
              <el-radio label="3">不跳转</el-radio>
            </el-radio-group>
            <el-input v-if="form.urlType === '2'" v-model="form.templateUrl" class="radio-input-item" placeholder="为空则不跳转"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="toSubmitTemplate">确定</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </PoupBox>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getTemplate, asyncTemplate, toSubmitTemplate } from '@/api/super-crm/wx-params-set';
import PoupBox from '@/components/PoupBox.vue';
import { getTemplateMap } from '@/utils/nameExchange';
import user from '@/utils/user';

@Component({
  components: {
    PoupBox
  }
})
export default class MessageSetting extends Vue {
  private show: boolean = false;
  private title: string = '';
  private tableData = [];
  private form = {
    id: '',
    sort: '',
    startMsg: '',
    startPlaceholder: '',
    endMsg: '',
    endPlaceholder: '',
    urlType: '1',
    templateUrl: '',
    type: ''
  };
  // 颜色
  private startMsgColor: string = '#000000';
  private endMsgColor: string = '#000000';
  private bodyMsgColor: string[] = [];
  private asyncTemplateLoading: boolean = false;
  private predefineColors = ['#000000', '#ff4500', '#1e90ff', '#c71585', '#39bdc7'];

  get TemplateMap() {
    return getTemplateMap(this.title);
  }

  get isAsync() {
    return {
      isAsync: this.tableData.length > 0,
      time: this.tableData.length > 0 ? (this.tableData[0] as any).synTime : null
    }
  }

  private mounted() {
    this.getTemplate();
  }

  private getTemplate() {
    getTemplate().then((res: any) => {
      this.tableData = res.data || [];
    })
  }

  private editTemplate(item: any) {
    this.title = item.title;
    this.form = {
      id: item.id,
      sort: item.sort,
      startMsg: item.startDescribtion ? item.startDescribtion : '',
      startPlaceholder: this.TemplateMap.startMsg,
      endMsg: item.endDescribtion ? item.endDescribtion : '',
      endPlaceholder: this.TemplateMap.endMsg,
      urlType: item.urlType || '1',
      templateUrl: item.templateUrl,
      type: item.type
    };
    this.bodyMsgColor = [];
    try {
      const filedColor = JSON.parse(item.filedColor);
      this.startMsgColor = filedColor.first ? filedColor.first : '#000000';
      this.endMsgColor = filedColor.remark ? filedColor.remark : '#000000';
      this.TemplateMap.bodyMsg.forEach((p: any, index: number) => {
        const colorItem = filedColor[`keyword${index + 1}`] || '#000000';
        this.bodyMsgColor.push(colorItem);
      })
    } catch (error) {
      this.startMsgColor = '#000000';
      this.endMsgColor = '#000000';
      this.TemplateMap.bodyMsg.forEach((p: any) => {
        this.bodyMsgColor.push('#000000');
      })
    }
    this.show = true;
  }

  private toSubmitTemplate() {
    if (!this.form.id) {
      this.$message({
        type: 'info',
        message: '请先同步模板ID！'
      });
      return;
    }
    const filedColor = {
      first: this.startMsgColor,
      remark: this.endMsgColor
    };
    this.bodyMsgColor.forEach((p: string, index: number) => {
      (filedColor as any)[`keyword${index + 1}`] = p;
    });
    const wxUrl = `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}`;
    const templateUrl = this.form.urlType === '1' ? wxUrl : (this.form.urlType === '2' ? this.form.templateUrl : null);
    const params = {
      startDescribtion: this.form.startMsg,
      endDescribtion: this.form.endMsg,
      sort: this.form.sort,
      templateUrl,
      id: this.form.id,
      urlType: this.form.urlType,
      filedColor: JSON.stringify(filedColor),
      type: this.form.type
    };
    toSubmitTemplate(params).then((res: any) => {
      this.getTemplate();
      this.show = false;
      this.$message({
        type: 'success',
        message: '提交成功！'
      });
    })
  }

  private asyncTemplate() {
    this.asyncTemplateLoading = true;
    asyncTemplate().then((res: any) => {
      this.asyncTemplateLoading = false;
      this.$message({
        type: 'success',
        message: '同步成功！'
      });
      this.getTemplate();
    }).catch((err: any) => {
      this.asyncTemplateLoading = false;
    })
  }
}
</script>

<style lang="scss" scoped>
.message-setting {
  .setting-info {
    height: 64px;
    line-height: 64px;
    background-color: #f5faff;
    border-radius: 5px;
    border: solid 1px #409eff;
    padding: 0 12px;
    > span {
      float: right;
      font-size: 12px;
      color: #999999;
      clear: both;
      > .info {
        color: #cf0101;
      }
    }
  }
  .poup-box-header {
    font-size: 18px;
    font-weight: normal;
  }
  .poup-box-body {
    display: flex;
    .phone-show {
      width: 320px;
      flex-shrink: 0;
      height: 500px;
      background-color: #f5f5f5;
      > .header {
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: black;
        color: #ffffff;
        font-size: 14px;
      }
      > .body {
        width: 290px;
        margin: 18px auto;
        background-color: #ffffff;
        border-radius: 5px;
        padding: 8px;
        > .details {
          > .title {
            font-size: 14px;
            color: #606266;
          }
          > .time {
            font-size: 10px;
            color: #999999;
            padding: 5px 0 12px 0;
          }
          > .hh-msg {
            font-size: 12px;
            color: #606266;
            padding: 2px 0;
          }
        }
        > .footer {
          border-top: 1px solid #eeeeee;
          font-size: 12px;
          color: #409eff;
          height: 32px;
          line-height: 38px;
          margin-top: 8px;
        }
      }
    }
    .poup-box-body-form {
      flex-grow: 1;
      margin-left: 22px;
      height: 600px;
      overflow: auto;
      .item {
        padding-bottom: 12px;
        .label {
          font-size: 14px;
          color: #409eff;
          padding-bottom: 12px;
        }
        .radio-input-item {
          margin-top: 12px;
        }
      }
      .item-btn {
        text-align: right;
        margin-top: 18px;
      }
    }
  }
}
</style>