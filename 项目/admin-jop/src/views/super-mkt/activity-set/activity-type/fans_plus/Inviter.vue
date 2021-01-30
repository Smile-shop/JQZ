<template>
<div class="activity-type-add">
  <el-form
      ref="form"
      label-width="180px"
      class="add-form"
      :model="form"
    >
      <el-form-item
        label="好友扫码提示语："
        required
      >
        <div class="content">
          <div class="left">
            <div class="item">
              <div>
                <span>开始语</span>
                <span  v-for="(item, index) in friendReminderKeys" :key="index" @click="onAddFriendReminderContext(index)" class="key-clickspan">
                    {{item}}
                </span>
                <span class="key-ulspan" @click="gofriendReminder">查看示例</span>
              </div>
               <el-form-item prop="friendReminderJson.first.value" :rules="[{ required: true, message: '请选择开始提示语', trigger: 'blur' }]">
                  <el-input
                    v-model="form.friendReminderJson.first.value"
                    type="textarea"
                    :style="{
                      width: '415px',
                    }"
                    :autosize="{ minRows: 4}"
                    :placeholder="friendReminderStartDes"
                    maxlength="200"
                    show-word-limit
                  >
                  </el-input>
               </el-form-item>
            </div>
            <div class="item inline">
              <h3 class="inline">提醒事项</h3>
              <el-input
                v-model="form.friendReminderJson.keyword1.value"
                :style="{
                  width: '120px'
                }"
                :disabled="true"
              >
              </el-input>
              <el-color-picker
                v-model="form.friendReminderJson.keyword1.color"
                :predefine="predefine">
              </el-color-picker>
            </div>
            <div class="item inline">
              <h3 class="inline">关联联系人</h3>
              <el-input
                v-model="form.friendReminderJson.keyword2.value"
                :style="{
                  width: '120px'
                }"
                :disabled="true"
              >
              </el-input>
              <el-color-picker
                v-model="form.friendReminderJson.keyword2.color"
                :predefine="predefine">
              </el-color-picker>
            </div>
            <div class="item">
              <h3>结束语</h3>
              <div class="input-group">
                 <el-form-item prop="friendReminderJson.remark.value" :rules="[{ required: true, message: '请选择结束语提示语', trigger: 'blur' }]">
                    <el-input
                      v-model="form.friendReminderJson.remark.value"
                      type="textarea"
                      :style="{
                        width: '415px',
                      }"
                      :autosize="{ minRows: 4}"
                      :placeholder="friendReminderEndDes"
                      maxlength="200"
                      show-word-limit
                    >
                    </el-input>
                 </el-form-item>
                <el-color-picker style="margin-left: 30px;"
                  v-model="form.friendReminderJson.remark.color"
                  :predefine="predefine">
                </el-color-picker>
              </div>
            </div>
            <div>
              <el-switch
                v-model="friendReminderIsOpen"
                @change="onFriendReminderChange"
                >
              </el-switch>
              <span class="xinhao">*</span>为不打扰用户，当用户完成活动所有奖品兑换时，将不推送次通知</div>
          </div>
          <div class="right">
            <h3>
              内容示例
            </h3>
            <div class="preview">
              <div class="content">
                <p>
                  {{form.friendReminderJson.first.value}}
                </p>
                <ul>
                  <li>
                    提醒事项：
                    <mark
                      :style="{
                        color: form.friendReminderJson.keyword1.color
                      }">
                      {{form.friendReminderJson.keyword1.value}}
                    </mark>
                  </li>
                  <li>
                    关联联系人：
                    <mark
                      :style="{
                        color: form.friendReminderJson.keyword2.color
                      }">
                      {{form.friendReminderJson.keyword2.value}}
                    </mark>
                  </li>
                </ul>
                <p
                  :style="{
                    color: form.friendReminderJson.remark.color
                  }">
                  {{form.friendReminderJson.remark.value}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
       <el-form-item
        label="活动即将达标提示语："
        prop="willReachedReminderJson.first.value"
      >
        <div class="content">
          <div class="left">
            <div class="item">
              <div>
                <span>开始语</span>
                <span  v-for="(item, index) in willReachedReminderKeys" :key="index" @click="onAddWillReachedReminderContext(index)" class="key-clickspan">
                    {{item}}
                </span>
                <span class="key-ulspan" @click="goWillReachedReminder">查看示例</span>
              </div>
              <el-input
                v-model="form.willReachedReminderJson.first.value"
                type="textarea"
                :style="{
                  width: '415px',
                }"
                :autosize="{ minRows: 4}"
                :placeholder="willReachedReminderStartDes"
                maxlength="200"
                show-word-limit
              >
              </el-input>
            </div>
            <div class="item inline">
              <h3 class="inline">提醒事项</h3>
              <el-input
                v-model="form.willReachedReminderJson.keyword1.value"
                :style="{
                  width: '130px'
                }"
                :disabled="true"
              >
              </el-input>
              <el-color-picker
                v-model="form.willReachedReminderJson.keyword1.color"
                :predefine="predefine">
              </el-color-picker>
            </div>
            <div class="item inline">
              <h3 class="inline">关联联系人</h3>
              <el-input
                v-model="form.willReachedReminderJson.keyword2.value"
                :style="{
                  width: '120px'
                }"
                :disabled="true"
              >
              </el-input>
              <el-color-picker
                v-model="form.willReachedReminderJson.keyword2.color"
                :predefine="predefine">
              </el-color-picker>
            </div>
            <div class="item">
              <h3>结束语</h3>
              <div class="input-group">
                <el-input
                  v-model="form.willReachedReminderJson.remark.value"
                  type="textarea"
                  :placeholder="willReachedReminderEndDes"
                  :style="{
                    width: '415px',
                  }"
                  :autosize="{ minRows: 4}"
                  maxlength="200"
                  show-word-limit
                >
                </el-input>
                <el-color-picker style="margin-left: 20px;"
                  v-model="form.willReachedReminderJson.remark.color"
                  :predefine="predefine">
                </el-color-picker>
              </div>
            </div>
            <div>
              <el-switch
                v-model="willReachedReminderIsOpen"
                @change="onWillReachedReminderChange"
                >
              </el-switch>
              <span class="xinhao">*</span>奖品达标前
              <el-input
                v-model.number="form.willReachedReminderUserNum"
                onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                min='0'
                type="number"
                :style="{
                  width: '80px'
                }"
              >
              </el-input >人气值推送通知（只通知一次，<br>举例：达标前2个人气值通知，当前奖品为10个人气值，则达到8人气值时通知，9人气值不通知。）
            </div>
          </div>
          <div class="right">
            <h3>
              内容示例
            </h3>
            <div class="preview">
              <div class="content">
                <p>
                  {{form.willReachedReminderJson.first.value}}
                </p>
                <ul>
                  <li>
                    提醒事项：
                    <mark
                      :style="{
                        color: form.willReachedReminderJson.keyword1.color
                      }">
                      {{form.willReachedReminderJson.keyword1.value}}
                    </mark>
                  </li>
                  <li>
                    关联联系人：
                    <mark
                      :style="{
                        color: form.willReachedReminderJson.keyword2.color
                      }">
                      {{form.willReachedReminderJson.keyword2.value}}
                    </mark>
                  </li>
                </ul>
                <p
                  :style="{
                    color: form.willReachedReminderJson.remark.color
                  }">
                  {{form.willReachedReminderJson.remark.value}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
       <el-form-item
        label="活动达标提示语："
        required
      >
        <div class="content">
          <div class="left">
            <div class="item">
              <div>
                <span>开始语</span>
                <span  v-for="(item, index) in reachedReminderKeys" :key="index" @click="onAddReachedReminderContext(index)" class="key-clickspan">
                    {{item}}
                </span>
                <span class="key-ulspan" @click="goReachedReminder">查看示例</span>
              </div>
               <el-form-item prop="reachedReminderJson.first.value" :rules="[{ required: true, message: '请选择开始语提示语', trigger: 'blur' }]">
                <el-input
                  v-model="form.reachedReminderJson.first.value"
                  type="textarea"
                  :style="{
                    width: '415px',
                  }"
                  :autosize="{ minRows: 4}"
                  :placeholder="reachedReminderStartDes"
                  maxlength="200"
                  show-word-limit
                >
                </el-input>
               </el-form-item>
            </div>
            <div class="item inline">
              <h3 class="inline">提醒事项</h3>
              <el-input
                v-model="form.reachedReminderJson.keyword1.value"
                :style="{
                  width: '120px'
                }"
                :disabled="true"
              >
              </el-input>
              <el-color-picker
                v-model="form.reachedReminderJson.keyword1.color"
                :predefine="predefine">
              </el-color-picker>
            </div>
            <div class="item inline">
              <h3 class="inline">关联联系人</h3>
              <el-input
                v-model="form.reachedReminderJson.keyword2.value"
                :style="{
                  width: '120px'
                }"
                :disabled="true"
              >
              </el-input>
              <el-color-picker
                v-model="form.reachedReminderJson.keyword2.color"
                :predefine="predefine">
              </el-color-picker>
            </div>
            <div class="item">
              <h3>结束语</h3>
              <div class="input-group">
                <el-form-item prop="reachedReminderJson.remark.value" :rules="[{ required: true, message: '请选择结束语提示语', trigger: 'blur' }]">
                    <el-input
                      v-model="form.reachedReminderJson.remark.value"
                      type="textarea"
                      :style="{
                        width: '415px',
                      }"
                      :autosize="{ minRows: 4}"
                      :placeholder="reachedReminderEndDes"
                      maxlength="200"
                      show-word-limit
                    >
                    </el-input>
                </el-form-item>
                <el-color-picker style="margin-left: 30px;"
                  v-model="form.reachedReminderJson.remark.color"
                  :predefine="predefine">
                </el-color-picker>
              </div>
            </div>
          </div>
          <div class="right">
            <h3>
              内容示例
            </h3>
            <div class="preview">
              <div class="content">
                <p>
                  {{form.friendReminder}}
                </p>
                <ul>
                  <li>
                    提醒事项：
                    <mark
                      :style="{
                        color: form.reachedReminderJson.keyword1.color
                      }">
                      {{form.reachedReminderJson.keyword1.value}}
                    </mark>
                  </li>
                  <li>
                    关联联系人：
                    <mark
                      :style="{
                        color: form.reachedReminderJson.keyword2.color
                      }">
                      {{form.reachedReminderJson.keyword2.value}}
                    </mark>
                  </li>
                </ul>
                <p
                  :style="{
                    color: form.reachedReminderJson.remark.color
                  }">
                  {{form.reachedReminderJson.remark.value}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
       <el-form-item
        label="好友取关扣人气提示："
      >
        <div class="content">
          <div class="left">
            <div class="item">
              <div>
                <span>开始语</span>
                <span  v-for="(item, index) in cancelReminderKeys" :key="index" @click="onAddCancelReminderContext(index)" class="key-clickspan">
                    {{item}}
                </span>
                <span class="key-ulspan" @click="goCancelReminderResult">查看示例</span>
              </div>
              <el-input
                v-model="form.cancelReminderJson.first.value"
                type="textarea"
                :style="{
                  width: '415px',
                }"
                :autosize="{ minRows: 4}"
                :placeholder="cancelReminderStartDes"
                maxlength="200"
                show-word-limit
              >
              </el-input>
            </div>
            <div class="item inline">
              <h3 class="inline">提醒事项</h3>
              <el-input
                v-model="form.cancelReminderJson.keyword1.value"
                :style="{
                  width: '120px'
                }"
                :disabled="true"
              >
              </el-input>
              <el-color-picker
                v-model="form.cancelReminderJson.keyword1.color"
                :predefine="predefine">
              </el-color-picker>
            </div>
            <div class="item inline">
              <h3 class="inline">关联联系人</h3>
              <el-input
                v-model="form.cancelReminderJson.keyword2.value"
                :style="{
                  width: '120px'
                }"
                :disabled="true"
              >
              </el-input>
              <el-color-picker
                v-model="form.cancelReminderJson.keyword2.color"
                :predefine="predefine">
              </el-color-picker>
            </div>
            <div class="item">
              <div>
                <span>结束语</span>
                <span  v-for="(item, index) in cancelReminderEndKeys" :key="index" @click="onAddCancelReminderEndContext(index)" class="key-clickspan">
                    {{item}}
                </span>
              </div>
              <div class="input-group">
                <el-input
                  v-model="form.cancelReminderJson.remark.value"
                  type="textarea"
                  :style="{
                    width: '415px',
                  }"
                  :autosize="{ minRows: 4}"
                  :placeholder="cancelReminderEndDes"
                  maxlength="200"
                  show-word-limit
                >
                </el-input>
                <el-color-picker style="margin-left: 20px;"
                  v-model="form.cancelReminderJson.remark.color"
                  :predefine="predefine">
                </el-color-picker>
              </div>
            </div>
            <div>
              <el-switch
                active-value="1"
                inactive-value="0"
                v-model="form.cancelReminderIsOpen"
                >
              </el-switch>
              <span class="xinhao">*</span>开启此功能后，当助力的好友取消关注时，则推送此处文案提醒上级用户（默认不开启）</div>
            <div>

              <el-switch
                active-value="1"
                inactive-value="0"
                v-model="form.cancelReminderNumIsOpen"
                >
              </el-switch>
              <span class="xinhao">*</span>为不打扰用户，当通知达到
              <el-input
                v-model.number="form.cancelReminderNum"
                onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                min='0'
                type="number"
                :style="{
                  width: '80px'
                }"
              >
              </el-input >
              （ 2-10 ）条时将不再通知，不影响人气值增加</div>
          </div>
          <div class="right">
            <h3>
              内容示例
            </h3>
            <div class="preview">
              <div class="content">
                <p>
                  {{form.cancelReminderJson.first.value}}
                </p>
                <ul>
                  <li>
                    提醒事项：
                    <mark
                      :style="{
                        color: form.cancelReminderJson.keyword1.color
                      }">
                      {{form.cancelReminderJson.keyword1.value}}
                    </mark>
                  </li>
                  <li>
                    关联联系人：
                    <mark
                      :style="{
                        color: form.cancelReminderJson.keyword2.color
                      }">
                      {{form.cancelReminderJson.keyword2.value}}
                    </mark>
                  </li>
                </ul>
                <p
                  :style="{
                    color: form.cancelReminderJson.remark.color
                  }">
                  {{form.cancelReminderJson.remark.value}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
  </el-form>
  <div class="button-div">
        <el-button type="success"  @click="onprev">上一步</el-button>
        <el-button type="primary"  @click="submit">下一步</el-button>
      </div>
    <!-- 查看示例弹框 -->
    <el-dialog :visible.sync="friendReminderResult" class="look-wrapper" width="25%">
      <p>开始语：您的好友为您增加了1人气值↑ 您现在的人气值为<span class="key-span">#当前人气值#</span>，还需<span class="key-span">#好友数#</span>位好友即可获得<span class="key-span">#活动目标奖品#</span><br>
      提醒事项： 人气值增加<br>
      关联联系人： <span class="key-span">#用户昵称#</span><br>
      结束语：胜利就在眼前， 快邀请更多的好友扫码识别您的海报吧</p>
    </el-dialog>
    <el-dialog :visible.sync="willReachedReminderResult" class="look-wrapper" width="26%">
      <p>开始语：目标即将达成！还需<span class="key-span">#好友数#</span>位好友即可获得<span class="key-span">#活动目标奖品#</span><br>
      提醒事项： 即将达标<br>
      关联联系人： <span class="key-span">#用户昵称#</span><br>
      结束语：赶紧点击下方链接进行兑换吧！</p>
    </el-dialog>
    <el-dialog :visible.sync="reachedReminderResult" class="look-wrapper" width="25%">
      <p>开始语：<span class="key-span">#用户昵称#</span>恭喜您！ 您已成功积攒了<span class="key-span">#达标人气值#</span>
      ，可获得<span class="key-span">#活动目标奖品#</span><br>
      提醒事项： 人气值即将达标<br>
      关联联系人： <span class="key-span">#用户昵称#</span><br>
      结束语：赶紧点击下方链接进行兑换吧！</p>
    </el-dialog>
    <el-dialog :visible.sync="cancelReminderResult" class="look-wrapper" width="28%">
      <p>噢噢！您的好友取关了，您的人气值-1<br>
      提醒事项：人气值减少<br>
      关联联系人： <span class="key-span">#用户昵称#</span><br>
      您现在人气值为<span class="key-span">#当前人气值#</span>，还需<span class="key-span">#好友数#</span>位还有即可获得<span class="key-span">#活动目标奖品#</span><br>
      点击下方链接查看奖品详情！</p>
    </el-dialog>
</div>
</template>
<script lang="ts">
  import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
  @Component({})
  export default class InviterActivity extends Vue {
    @Prop({default: null}) initForm!: any;
    friendReminderResult = false;
    willReachedReminderResult = false;
    reachedReminderResult = false;
    cancelReminderResult = false;
    form = {
      friendReminderIsOpen: '0',
      // 好友扫码提示语
      friendReminderJson: {
        first: {
          value: '',
        },
        remark: {
          value: '',
          color: '#000000'
        },
        keyword1: {
          value: '人气值增加',
          color: '#000000'
        },
        keyword2: {
          value: '#用户昵称#',
          color: '#000000'
        }
      },
      willReachedReminderIsOpen: '0',
        // 好友扫码提示语
      willReachedReminderJson: {
        first: {
          value: '',
        },
        remark: {
          value: '',
          color: '#ff0000'
        },
        keyword1: {
          value: '人气值即将达标',
          color: '#000000'
        },
        keyword2: {
          value: '#用户昵称#',
          color: '#000000'
        }
      },
      willReachedReminderUserNum: 0,
      cancelReminderNumIsOpen: '0',
      // 活动达标提示语
      reachedReminderJson: {
        first: {
          value: '',
        },
        remark: {
          value: '',
          color: '#ff0000'
        },
        keyword1: {
          value: '人气值达标',
          color: '#000000'
        },
        keyword2: {
          value: '#用户昵称#',
          color: '#000000'
        }
      },
      cancelReminderNum: 0,
      cancelReminderIsOpen: '0',
      // 好友取关扣人气提示语
      cancelReminderJson: {
        first: {
          value: '',
        },
        remark: {
          value: '',
          color: '#000000'
        },
        keyword1: {
          value: '人气值减少',
          color: '#ff0000'
        },
        keyword2: {
          value: '#用户昵称#',
          color: '#000000'
        }
      },
    };
    // 预设颜色
    predefine = [
      '#000000',
      '#ff0000',
      '#1e90ff',
      '#c71585',
      '#39bdc7',
    ];
    friendReminderStartDes = '请输入内容';
    friendReminderEndDes = '请输入内容';
    willReachedReminderStartDes = '请输入内容';
    willReachedReminderEndDes = '请输入内容';
    reachedReminderStartDes = '请输入内容';
    reachedReminderEndDes = '请输入内容';
    cancelReminderStartDes = '请输入内容';
    cancelReminderEndDes = '请输入内容';
    willReachedReminderIsOpen: boolean = false;
    cancelReminderNumIsOpen: boolean = false;
    friendReminderIsOpen: boolean = false;
    cancelReminderIsOpen: boolean = false;
    friendReminderKeys = ['#用户昵称#', '#当前人气值#', '#好友数#', '#活动目标奖品#'];
    willReachedReminderKeys = ['#用户昵称#', '#达标人气值#', '#活动目标奖品#', '#好友数#', '#当前人气值#'];
    reachedReminderKeys = ['#用户昵称#', '#达标人气值#', '#活动目标奖品#'];
    cancelReminderKeys = ['#用户昵称#', '#好友数#', '#当前人气值#'];
    cancelReminderEndKeys = ['#用户昵称#', '#好友数#', '#当前人气值#', '#活动目标奖品#'];
    @Watch('initForm')
    initData(val: any) {
      if (val) {
        this.form.friendReminderIsOpen = val.friendReminderIsOpen;
        if (val.friendReminderJson) {
          this.form.friendReminderJson = JSON.parse(val.friendReminderJson);
        }
        this.form.willReachedReminderIsOpen = val.willReachedReminderIsOpen;
        this.willReachedReminderIsOpen = (this.form.willReachedReminderIsOpen == '1');
        this.form.cancelReminderNumIsOpen = val.cancelReminderNumIsOpen;
        this.friendReminderIsOpen = (this.form.friendReminderIsOpen == '1');
        this.form.cancelReminderIsOpen = val.cancelReminderIsOpen;
        if (val.willReachedReminderJson) {
          this.form.willReachedReminderJson = JSON.parse(val.willReachedReminderJson);
        }
        this.form.willReachedReminderUserNum = val.willReachedReminderUserNum;
        if (val.reachedReminderJson) {
          this.form.reachedReminderJson = JSON.parse(val.reachedReminderJson);
        }
        this.form.cancelReminderNum = val.cancelReminderNum;
        if (val.cancelReminderJson) {
          this.form.cancelReminderJson = JSON.parse(val.cancelReminderJson);
        }
      }
    }
    onAddFriendReminderContext(index: number) {
      this.form.friendReminderJson.first.value += this.friendReminderKeys[index];
      this.form.friendReminderJson.first.value = this.form.friendReminderJson.first.value.substring(
      0,
      200
    );
    }
    onAddWillReachedReminderContext(index: number) {
      this.form.willReachedReminderJson.first.value += this.willReachedReminderKeys[index];
      this.form.willReachedReminderJson.first.value = this.form.willReachedReminderJson.first.value.substring(
      0,
      200
    );
    }
    onAddReachedReminderContext(index: number) {
      this.form.reachedReminderJson.first.value += this.reachedReminderKeys[index];
      this.form.reachedReminderJson.first.value = this.form.reachedReminderJson.first.value.substring(
      0,
      200
    );
    }
    onAddCancelReminderContext(index: number) {
      this.form.cancelReminderJson.first.value += this.cancelReminderKeys[index];
      this.form.cancelReminderJson.first.value = this.form.cancelReminderJson.first.value.substring(
      0,
      200
    );
    }
    onAddCancelReminderEndContext(index: number) {
      this.form.cancelReminderJson.remark.value += this.cancelReminderEndKeys[index];
    }
    onWillReachedReminderChange() {
      this.form.willReachedReminderIsOpen = ( this.willReachedReminderIsOpen) ? '1' : '0';
    }
    onFriendReminderChange() {
      this.form.friendReminderIsOpen = ( this.friendReminderIsOpen) ? '1' : '0';
    }
    goCancelReminderResult() {
      this.cancelReminderResult = true;
    }
    goReachedReminder() {
      this.reachedReminderResult = true;
    }
    goWillReachedReminder() {
      this.willReachedReminderResult = true;
    }
    gofriendReminder() {
      this.friendReminderResult = true;
    }
    onprev() {
      this.$emit('onPreActive');
    }

    submit() {
      (this.$refs.form as any).validate((valid: any) => {
        if (valid) {
        this.$emit('onNextActive');
        } else {
          this.$message({
            message: '请检查必填项',
            type: 'warning'
          })
        }
      })
    }
  }
</script>
<style lang='scss' scoped>
/deep/ input[type="number"]{
  -moz-appearance: none;
  text-align: center;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.activity-type-add {
  & > header {
    margin-bottom: 10px;
  }

  & /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    & img {
      height: 200px !important;
      width: auto !important;
    }

    &:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  & > .add-form /deep/ {
    .line {
      margin-bottom: 20px;
      height: 10px;
      background-color: #f5f5f5;
    }

    h3 {
      color: #606266;
      font-size: 14px;

      &.inline {
        display: inline-block;
      }
    }

    & .el-form-item__content {
      > div {
        color: #999999;
      }

      > ul {
        margin-top: 5px;
        list-style: none;
        line-height: 1.6;
        color: #999999;

        & > li {
          & > span {
            color: #ff0000;
          }
        }
      }

      > .content {
        display: flex;

        > .left {
          margin-right: 30px;
          width: 700px;

          > .item {
            width: 600px;
            &:not(:last-of-type) {
              margin-bottom: 20px;
            }

            > .input-group {
              display: flex;

              > .el-textarea{
                margin-right: 10px;
              }
            }

            > ul {
              margin-top: 5px;
              list-style: none;
              line-height: 1.6;
              color: #999999;

              & > li {
                & > span {
                  color: #ff0000;
                }
              }
            }

            &.inline {
              display: flex;
              align-items: center;

              > h3 {
                margin-right: 30px;
              }

              > .el-input {
                margin-right: 10px;
              }
            }
          }

        }

        > .right {
          > .preview {
            width: 320px;
            border-radius: 5px;
	          border: solid 1px #dddddd;

            > .content {
              padding: 13px;
              font-size: 12px;

              > p {
                line-height: 1.6;
                color: #000000;
                width:300px;
                word-wrap:break-word
              }

              > ul {
                color: #999999;
                line-height: 1.6;
              }
            }

            > .detail {
              border-top: 1px solid#dddddd;
              padding: 12px;
              color: #999999;
              line-height: 1;
            }
          }
        }
      }
    }
  }

  & /deep/ .el-form-item__error {
    position: absolute;
    top: 0;
    left: 430px;
  }
}
.key-span{
    color: #ff0000;
}
.key-ulspan{
    color: #1FC965;
    text-decoration:underline;
        cursor:pointer;
}
.key-clickspan{
    color: #ff0000;
     cursor:pointer;
}
.xinhao{
  color: #F56C6C;
  margin-right: 4px;
  margin-left: 4px;
}
</style>