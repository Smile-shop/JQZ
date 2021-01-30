<template>
  <div class="activity-type-add">
    <el-form
      ref="form"
      label-width="180px"
      class="add-form"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        label="海报背景："
        prop="imgName"
      >
        <div>"最佳尺寸：750*1334，最佳大小：200KB以内"</div>
        <el-upload
          class="avatar-uploader"
          :multiple="false"
          :show-file-list="false"
          :limit="1"
          :http-request="uploadImg"
          action=""
        >
          <img v-if="form.imgName" :src="form.imgName" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="活动名称："
        prop="activityName"
      >
        <el-input
          :disabled="form.activeStatus == 2"
          v-model="form.activityName"
          :style="{
            width: '415px'
          }"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="绑定的奖品："
      >
        <el-input
          v-model="form.giftName"
          :style="{
            width: '415px'
          }"
          placeholder="暂未绑定奖品"
          :disabled="true"
        >
        </el-input>
        <div>
          请前往JMP设置绑定该活动的奖品
        </div>
      </el-form-item>
      <el-form-item
        label="奖品库存："
      >
        <el-input
          v-model="form.stock"
          :style="{
            width: '66px'
          }"
          :disabled="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="当前活动奖品数：">
        <el-input
          v-model="form.giftNum"
          :style="{
            width: '66px'
          }"
          :disabled="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="已发送：">
        <el-input
          v-model="form.hasGiven"
          :style="{
            width: '66px'
          }"
          :disabled="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="剩余：">
        <el-input
          v-model="form.margin"
          :style="{
            width: '66px'
          }"
          :disabled="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="触发关键字："
        prop="keyWord"
      >
        <el-input
          :disabled="form.activeStatus == 2"
          v-model="form.keyWord"
          :style="{
            width: '415px'
          }"
        >
        </el-input>
        <div>多个关键字请使用逗号隔开</div>
      </el-form-item>
      <el-form-item
        label="用户授权："
        prop="authentica"
      >
        <el-checkbox
          v-model="form.authentica">
          用户未授权能参加活动
        </el-checkbox>
        <div>取消勾选：未授权用户不能参加活动</div>
      </el-form-item>
      <el-form-item
        label="活动时间："
        prop="endTime"
      >
        <el-date-picker
          :disabled="form.activeStatus == 2"
          type="datetime"
          placeholder="开始时间"
          v-model="form.beginTime"
          style="width: 200px;"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="limitDate('start', $event)"
        >
        </el-date-picker>
        -
        <el-date-picker
          :disabled="form.activeStatus == 2"
          type="datetime"
          placeholder="结束时间"
          v-model="form.endTime"
          style="width: 200px;"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="limitDate('end', $event)"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="人气值："
        prop="popularity"
      >
        <el-input
          :style="{
            width: '415px'
          }"
          v-model="form.popularity"
          :disabled="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="指定活动门店："
        prop="designatedStore"
      >
        <el-checkbox
          :disabled="form.activeStatus == 2"
          v-model="checkAll"
          @change="handleCheckAllChange"
          :indeterminate="isIndeterminate"
        >
          全选
        </el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group
          :disabled="form.activeStatus == 2"
          @change="handleCheckedShopChange"
          v-model="checkedShop"
        >
          <el-checkbox
            v-for="item in shops"
            :label="item"
            :key="item"
          >
          {{item}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="未开始提示语："
        prop="beforeReminder"
      >
        <el-input
          v-model="form.beforeReminder"
          :style="{
            width: '415px'
          }"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="结束提示语："
        prop="overReminder"
      >
        <el-input
          v-model="form.overReminder"
          :style="{
            width: '415px'
          }"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="自主参与活动提示："
        prop="independentReminder"
      >
        <el-input
          v-model="form.independentReminder"
          type="textarea"
          :style="{
            width: '415px',
          }"
          :autosize="{ minRows: 4}"
        >
        </el-input>
        <ul>
          <li>
            <span>
              #昵称#
            </span>
            为当前粉丝微信昵称
          </li>
          <li>
            <span>
              #排行榜#
            </span>
            为当前活动排行榜链接
          </li>
          <li>
            <span>
              #活动奖品#
            </span>
            为奖品链接，名称为活动奖品名称
          </li>
          <li>
            <dl>
              <dt>
                例如：
              </dt>
              <dd>
                下图是您的专属活动海报图，将海报分享至朋友圈/微信好友邀请扫码关注提升人气值，完成18个人气值任务后即可到店领取#活动奖品#！
              </dd>
            </dl>
          </li>
        </ul>
      </el-form-item>
      <el-form-item
        label="扫码关注提示语："
        prop="sweepCodeReminder"
      >
        <el-input
          v-model="form.sweepCodeReminder"
          type="textarea"
          :style="{
            width: '415px',
          }"
          :autosize="{ minRows: 4}"
        >
        </el-input>
        <ul>
          <li>
            <span>
              #昵称#
            </span>
            为当前粉丝微信昵称
          </li>
          <li>
            <span>
              #邀请人#
            </span>
            为邀请人粉丝微信昵称
          </li>
          <li>
            <span>
              #排行榜#
            </span>
            为当前活动排行榜链接
          </li>
          <li>
            <span>
              #活动奖品#
            </span>
            为奖品链接，名称为活动奖品名称
          </li>
          <li>
            <dl>
              <dt>
                例如：
              </dt>
              <dd>
                #昵称#，感谢您为#邀请人#增加的人气值！
              </dd>
              <dd>
                #邀请人#邀请您一起领取#活动奖品#
              </dd>
              <dd>
                下图是您的专属活动海报图，将海报分享至朋友圈/微信好友邀请扫码关注提升人气值，完成18个人气值任务后即
              </dd>
              <dd>
                可到店领取#活动奖品#！
              </dd>
            </dl>
          </li>
        </ul>
      </el-form-item>
      <el-form-item
        label="已关注再次扫码提示："
        prop="repeatReminder"
      >
        <el-input
          v-model="form.repeatReminder"
          type="textarea"
          :style="{
            width: '415px',
          }"
          :autosize="{ minRows: 4}"
        >
        </el-input>
        <ul>
          <li>
            <span>
              #昵称#
            </span>
            为当前粉丝微信昵称
          </li>
          <li>
            <span>
              #排行榜#
            </span>
            为当前活动排行榜链接
          </li>
          <li>
            <dl>
              <dt>
                例如：
              </dt>
              <dd>
                嗨，#昵称#您已经关注公众号了
              </dd>
            </dl>
          </li>
        </ul>
      </el-form-item>
      <div class="line"></div>
      <el-form-item
        label="好友扫码提示语："
      >
        <div class="content">
          <div class="left">
            <div class="item">
              <h3>开始语</h3>
              <el-input
                v-model="form.friendReminderJson.first.value"
                type="textarea"
                :style="{
                  width: '415px',
                }"
                :autosize="{ minRows: 4}"
                maxlength="100"
                show-word-limit
              >
              </el-input>
              <ul>
                <li>
                  <dl>
                    <dt>
                      例如：
                    </dt>
                    <dd>
                      您的好友为您增加了1人气值↑
                    </dd>
                    <dd>
                      您现在的人气值为#当前人气值#，还需#好友数#位好友即可达标。
                    </dd>
                  </dl>
                </li>
              </ul>
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
                <el-input
                  v-model="form.friendReminderJson.remark.value"
                  type="textarea"
                  :style="{
                    width: '415px',
                  }"
                  :autosize="{ minRows: 4}"
                  maxlength="100"
                  show-word-limit
                >
                </el-input>
                <el-color-picker
                  v-model="form.friendReminderJson.remark.color"
                  :predefine="predefine">
                </el-color-picker>
              </div>
              <ul>
                <li>
                  <dl>
                    <dt>
                      例如：
                    </dt>
                    <dd>
                      胜利就在眼前，
                    </dd>
                    <dd>
                      快邀请更多的好友扫码识别您的海报吧！
                    </dd>
                    <dd>
                      点击下方链接查看奖品详情。
                    </dd>
                  </dl>
                </li>
                <li>
                  <span>
                    #昵称#
                  </span>
                  为当前粉丝微信昵称
                </li>
                <li>
                  <span>
                    #当前人气值#
                  </span>
                  为当前粉丝微信当前人气值
                </li>
                <li>
                  <span>
                    #好友数#
                  </span>
                  为当前粉丝微信好友数
                </li>
              </ul>
            </div>
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
      <div class="line"></div>
      <el-form-item
        label="好友取关扣人气提示："
      >
        <div class="content">
          <div class="left">
            <div class="item">
              <h3>开始语</h3>
              <el-input
                v-model="form.cancelReminderJson.first.value"
                type="textarea"
                :style="{
                  width: '415px',
                }"
                :autosize="{ minRows: 4}"
                maxlength="100"
                show-word-limit
              >
              </el-input>
              <ul>
                <li>
                  <dl>
                    <dt>
                      例如：
                    </dt>
                    <dd>
                      "噢喔！您的好友取关了，您的人气值-1↓"
                    </dd>
                  </dl>
                </li>
              </ul>
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
              <h3>结束语</h3>
              <div class="input-group">
                <el-input
                  v-model="form.cancelReminderJson.remark.value"
                  type="textarea"
                  :style="{
                    width: '415px',
                  }"
                  :autosize="{ minRows: 4}"
                  maxlength="100"
                  show-word-limit
                >
                </el-input>
                <el-color-picker
                  v-model="form.cancelReminderJson.remark.color"
                  :predefine="predefine">
                </el-color-picker>
              </div>
              <ul>
                <li>
                  <dl>
                    <dt>
                      例如：
                    </dt>
                    <dd>
                      您现在的人气值为#当前人气值#，还需#好友数#位好友即可达标。
                    </dd>
                    <dd>
                      快邀请更多的好友扫码识别您的海报吧！
                    </dd>
                    <dd>
                      点击下方链接查看奖品详情。
                    </dd>
                  </dl>
                </li>
                <li>
                  <span>
                    #昵称#
                  </span>
                  为当前粉丝微信昵称
                </li>
                <li>
                  <span>
                    #当前人气值#
                  </span>
                  为当前粉丝微信当前人气值
                </li>
                <li>
                  <span>
                    #好友数#
                  </span>
                  为当前粉丝微信好友数
                </li>
              </ul>
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
      <div class="line"></div>
      <el-form-item
        label="活动达标提示语："
      >
        <div class="content">
          <div class="left">
            <div class="item">
              <h3>开始语</h3>
              <el-input
                v-model="form.reachedReminderJson.first.value"
                type="textarea"
                :style="{
                  width: '415px',
                }"
                :autosize="{ minRows: 4}"
                maxlength="100"
                show-word-limit
              >
              </el-input>
              <ul>
                <li>
                  <dl>
                    <dt>
                      例如：
                    </dt>
                    <dd>
                      #昵称#恭喜您！
                    </dd>
                    <dd>
                      您已成功积攒了X人气值，
                    </dd>
                    <dd>
                      可获得#活动奖品#一套
                    </dd>
                  </dl>
                </li>
              </ul>
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
                <el-input
                  v-model="form.reachedReminderJson.remark.value"
                  type="textarea"
                  :style="{
                    width: '415px',
                  }"
                  :autosize="{ minRows: 4}"
                  maxlength="100"
                  show-word-limit
                >
                </el-input>
                <el-color-picker
                  v-model="form.reachedReminderJson.remark.color"
                  :predefine="predefine">
                </el-color-picker>
              </div>
              <ul>
                <li>
                  <dl>
                    <dt>
                      例如：
                    </dt>
                    <dd>
                      赶紧点击下方链接进行兑换吧！
                    </dd>
                    <dd>
                      （未填写兑换信息的不予兑换）
                    </dd>
                    <dd>
                      领取门店：XXXXX
                    </dd>
                  </dl>
                </li>
                <li>
                  <span>
                    #达标者微信昵称#
                  </span>
                  为当前达标用户的微信昵称
                </li>
                <li>
                  <span>
                    #活动奖品#
                  </span>
                  为奖品链接，名称为活动奖品名称
                </li>
              </ul>
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
      <el-form-item>
        <el-button
          v-if="form.activeStatus != 2"
          type="primary"
          @click="submit"
        >
          提交
        </el-button>

        <span
          v-else
        >
          当前活动状态不可修改
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import moment from 'moment';
import {
  getShopList,
  getActiveInfo,
  uploadBgImg,
  addActive
} from '@/api/super-mkt/activity-set/fans';

@Component({
})
export default class PrizeSetActivityTypeAdd extends Vue {
  form = {
    id: '',
    activeStatus: '1',
    imgName: '', // 图片名称
    activityName: '', // 活动名称
    parentActive: '人气值千金', // 活动类别
    keyWord: '', // 关键词
    authentica: true,
    beginTime: '', // 开始时间
    endTime: '', // 结束时间
    popularity: '', // 人气值
    designatedStore: '', // 指定门店
    beforeReminder: '', // 活动开始前提示语
    pauseReminder: '', // 活动暂停提示语
    overReminder: '', // 活动结束提示语
    independentReminder: '', // 自主参与提示语
    sweepCodeReminder: '', // 扫码关注提示语
    // 好友扫码提示语
    friendReminderJson: {
      first: {
        value: '',
      },
      remark: {
        value: '',
        color: '#000'
      },
      keyword1: {
        value: '人气值增加',
        color: '#000'
      },
      keyword2: {
        value: '#昵称#',
        color: '#000'
      }
    },
    repeatReminder: '', // 已关注再次扫码提示语
    // 好友取关扣人气提示语
    cancelReminderJson: {
      first: {
        value: '',
      },
      remark: {
        value: '',
        color: '#000'
      },
      keyword1: {
        value: '人气值减少',
        color: '#000'
      },
      keyword2: {
        value: '#昵称#',
        color: '#000'
      }
    },
    // 活动达标提示语
    reachedReminderJson: {
      first: {
        value: '',
      },
      remark: {
        value: '',
        color: '#000'
      },
      keyword1: {
        value: '人气值达标',
        color: '#000'
      },
      keyword2: {
        value: '#达标者微信昵称#',
        color: '#000'
      }
    },
    giftName: '', // 奖品名称
    giftNum: '', // 奖品数量
    onShelf: '', // 上架名称
    stock: '', // 库存余量
    margin: '', // 奖品剩余数量
    hasGiven: '', // 奖品已发放
  }

  color = '#000000'

  // 预设颜色
  predefine = [
    '#000000',
    '#ff0000',
    '#1e90ff',
    '#c71585',
    '#39bdc7',
  ]
  // 全选门店
  checkAll = false
  // 选择的门店
  checkedShop = []
  // 门店列表
  shops = []
  // 不确定性(门店列表)
  isIndeterminate = true
  // 规则
  rules = {
    imgName: [
      { required: true, message: '请上传海报背景', trigger: 'on-success' },
    ],
    activityName: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
    ],
    keyWord: [
      { required: true, message: '请输入关键字', trigger: 'blur' },
    ],
    beginTime: [
      { required: true, message: '请输入开始时间', trigger: 'change' },
    ],
    endTime: [
      { required: true, message: '请输入结束时间', trigger: 'change' },
    ],
    designatedStore: [
      { required: true, message: '请选择门店', trigger: 'change' },
    ],
    beforeReminder: [
      { required: true, message: '请输入活动开始前提示语', trigger: 'blur' },
    ],
    overReminder: [
      { required: true, message: '请输入活动结束提示语', trigger: 'blur' },
    ],
    independentReminder: [
      { required: true, message: '请输入自主参与提示语', trigger: 'blur' },
    ],
    sweepCodeReminder: [
      { required: true, message: '请输入扫码关注提示语', trigger: 'blur' },
    ],
    friendReminder: [
      { required: true, message: '请输入好友扫码提示语', trigger: 'blur' },
    ],
    repeatReminder: [
      { required: true, message: '请输入已关注再次扫码提示语', trigger: 'blur' },
    ],
    cancelReminder: [
      { required: true, message: '请输入好友取关扣人气提示语', trigger: 'blur' },
    ],
    reachedReminder: [
      { required: true, message: '请输入活动达标提示语', trigger: 'blur' },
    ],
  }
  // 查询字符串
  queryString: any = null

  @Watch('checkedShop')
  watchCheckedShop(value: any) {
    const form = this.form;
    form.designatedStore = value.join(',');
  }

  mounted() {
    this.getShopList();
    this.getQueryString();

    const queryString = this.queryString;

    if (queryString) {
      this.getActiveInfo(queryString);
    }
  }

  // 限制开始时间
  limitDate(option: any, date: any) {
    if (date) {
      const timestamp = moment(date).valueOf();
      const startDate = this.form.beginTime;
      const endDate = this.form.endTime;

      switch (option) {
        case 'start':
          if (endDate) {
            const endTimestamp = moment(endDate).valueOf();

            if (timestamp >= endTimestamp) {
              this.$set(this.form, 'beginTime', moment(endTimestamp).format('YYYY-MM-DD HH:mm:ss'));
              this.$message({
                message: '开始时间不能大于或等于结束时间',
                type: 'warning'
              })
            }
          } else if (timestamp < Date.now()) {
            this.$set(this.form, 'beginTime', moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'));
            this.$message({
              message: '开始时间不能小于当前时间',
              type: 'warning'
            })
          }
          break;
        case 'end':
          if (startDate) {
            const startTimestamp = moment(startDate).valueOf();

            if (timestamp <= startTimestamp) {
              this.$set(this.form, 'endTime', moment(startTimestamp).format('YYYY-MM-DD HH:mm:ss'));
              this.$message({
                message: '结束时间不能小于或等于开始时间',
                type: 'warning'
              })
            }
          } else if (timestamp < Date.now()) {
            this.$set(this.form, 'endTime', moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'));
            this.$message({
              message: '结束时间不能小于当前时间',
              type: 'warning'
            })
          }
          break;
      }
    }
  }

  // 获取查询字符串
  getQueryString() {
    const queryString = this.$route.query;

    if (queryString.id) {
      this.queryString = queryString;
    }
  }

  // 图片上传
  uploadImg(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('alias', 'market');

    uploadBgImg(formData).then((res: any) => {
      const {data} = res;
      this.form.imgName = res.data[0];
    })
  }

  // 门店全选
  handleCheckAllChange(val: any) {
    this.checkedShop = val ? this.shops : [];
    this.isIndeterminate = false;
  }

  // 门店单选
  handleCheckedShopChange(value: any) {
    const checkedCount = value.length;
    this.checkAll = checkedCount === this.shops.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.shops.length;
  }

  // 获取门店信息
  getShopList() {
    return new Promise((resolve, reject) => {
      const body = {}

      getShopList(body).then((res: any) => {
        const {data} = res;

        this.shops = data.map((value: any, index: number) => {
          return value.shopName;
        })

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 提交
  submit() {
    (this.$refs.form as any).validate((valid: any) => {
      if (valid) {
        this.addActive()
      } else {
        this.$message({
          message: '请检查必填项',
          type: 'warning'
        })
      }
    })
  }

  // 添加和修改
  addActive() {
    return new Promise((resolve, reject) => {
      const body = {
        ...this.form,
        authentica: this.form.authentica ? '1' : '0',
      }

      addActive(body).then((res: any) => {
        const {data} = res;

        this.$message({
          message: '添加成功',
          type: 'success'
        });

        setTimeout(() => {
          this.$router.back();
        }, 1000)

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询活动详情
  getActiveInfo(options: any) {
    return new Promise((resolve, reject) => {
      const {id, jmpId} = options;
      const body = {
        id,
        jmpId,
      }

      getActiveInfo(body).then((res: any) => {
        const {data} = res;

        const {
          designatedStore
        } = data;
        this.form = data;

        this.checkedShop = designatedStore.split(/[,|，]/g);

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
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

          > .item {
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
</style>
