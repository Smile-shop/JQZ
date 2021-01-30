<template>
  <div class="activity-type-add">
    <el-form ref="form" label-width="180px" class="add-form" :model="form" :rules="rules">
      <el-form-item label="活动名称：" prop="activitiyName">
        <el-input
          :disabled="form.status==2||form.status==3"
          v-model="form.activitiyName"
          maxlength="50"
          :style="{
              width: '415px'
            }"
        ></el-input>
      </el-form-item>
      <el-form-item label="触发关键字：" prop="keyWord">
        <el-input
          v-model="form.keyWord"
          maxlength="30"
          :style="{
            width: '415px'
          }"
        ></el-input>
      </el-form-item>
      <el-form-item label="自主参与活动提示：" prop="independentReminder">
        <div>
          <span
            v-for="(item, index) in independentReminderKeys"
            :key="index"
            @click="onAddContext(index)"
            class="key-clickspan"
          >{{item}}</span>
          <span class="key-ulspan" @click="goLook">查看示例</span>
        </div>
        <el-input
          v-model="form.independentReminder"
          type="textarea"
          maxlength="200"
          show-word-limit
          :style="{
            width: '415px',
          }"
          :autosize="{ minRows: 4}"
          :placeholder="independentDes"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户手机授权：">
        <el-switch v-model="authentica" active-text="手机号授权访问"></el-switch>
        <div>开启后，需授权手机号才可进行访问用户数据</div>
      </el-form-item>
      <el-form-item label="活动时间：" prop="endTime">
        <el-date-picker
          type="datetime"
          placeholder="开始时间"
          v-model="form.beginTime"
          style="width: 200px;"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="limitDate('start', $event)"
          :disabled="form.status==2||form.status==3"
        ></el-date-picker>-
        <el-date-picker
          type="datetime"
          placeholder="结束时间"
          v-model="form.endTime"
          style="width: 200px;"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          @change="limitDate('end', $event)"
          :disabled="form.status==2||form.status==3"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="指定活动门店：" prop="designatedStore">
        <el-checkbox
          v-model="checkAll"
          @change="handleCheckAllChange"
          :indeterminate="isIndeterminate"
        >全选</el-checkbox>
        <el-checkbox v-model="isShowOutShopName">优先显示分销商别名（括号内）默认选择</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group @change="handleCheckedShopChange" v-model="checkedShop">
          <el-checkbox
            v-for="item in shops"
            :label="item.shopName"
            :key="item.shopName"
          >{{item.shopName}}{{`${item.nameOut ? '('+item.nameOut+')': '' }`}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="活动阶梯设置：">
        <div style="margin:5px" v-for="(item,index) in awards" :key="index">
          <el-switch
            v-model="item.isOpen"
            :active-text="item.name"
            :disabled="(form.status==2||form.status==3||index==0)"
            @click.native="handleUpdate(item)"
          ></el-switch>
          <span style="margin:15px">所需人气值</span>
            <el-input-number 
             :disabled="(form.status==2||form.status==3||!item.isOpen)"
              v-model="item.popularity" :controls="false" :min="1" :max="99999" :style="{width: '120px'}"></el-input-number>
          <span v-if="item.giftCode===''">
            <span class="red-ulspan" @click="addRecevice(item,true)">添加商品</span>
          </span>
          <span v-else-if="item.isValid=='0'" @click="addRecevice(item,false)">
            <span class="blue-ulspan">已添加</span>
            <span class="hui-ulspan">{{item.shelfGiftName}}({{item.giftCode}})</span>
            <span style="color:#ff0000">(已失效)</span>
          </span>
          <span v-else @click="addRecevice(item,false)">
            <span class="blue-ulspan">已添加</span>
            <span class="olle-ulspan">{{item.shelfGiftName}}({{item.giftCode}})</span>
          </span>
        </div>
        <div>注：*1人气值=邀请新关注一人</div>
      </el-form-item>
      <el-form-item label="未开始提示语：" prop="beforeReminder">
        <el-input
          v-model="form.beforeReminder"
          placeholder="活动还未开始，敬请期待！"
          maxlength="100"
          :style="{
              width: '415px'
            }"
        ></el-input>
      </el-form-item>
      <el-form-item label="结束提示语：" prop="overReminder">
        <el-input
          maxlength="100"
          v-model="form.overReminder"
          placeholder="活动已结束，谢谢参与！"
          :style="{
              width: '415px'
            }"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动轮播图：" prop="bannerImgList">
        <div style="display: flex">
          <div class="param-upload-box">
            <el-button
              @click="goUpLoad"
              class="el-icon-upload upload-btn"
              size="small"
              type="primary"
            >点击从本地上传</el-button>
            <el-upload
              class="upload-demo"
              ref="upload"
              :headers="opt()"
              :action="uploadUrl()"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :show-file-list="false"
              list-type="picture-card"
              :on-change="chanFile"
              :on-success="uploadLogoSuccess"
              :on-error="uploadLogoError"
              :before-upload="beforeAvatarUpload"
              :limit="8"
              :on-exceed="limitUpload"
              :auto-upload="true"
            >
              <el-button
                ref="uploadUp"
                style="display:none"
                class="el-icon-upload upbtn"
                slot="trigger"
                size="small"
                type="primary"
              >点击从本地上传</el-button>
            </el-upload>
            <ul class="upload-img-box" v-if="fileList">
              <li class="upload-li" v-for="(item, index) in fileList" :key="index">
                <div class="upload-im">
                  <img v-if="item.url" :src="item.url" alt />
                  <img v-else src="@/assets/images/super-crm/cloud-showroom/default.png" />
                </div>
                <p @click="deleteDialogFun(index)" class="upload-delete">删除</p>
              </li>
            </ul>
          </div>
          <div class="rightcontext">
            <div class="prompt">
              图片单张图片大小不能超过500k；
              <br />图片最佳尺寸750*666像素（宽*高）；
              <br />图片总数量，最多上传8张图片；
              <br />轮播图图片的格式为JPG/PNG
              <br />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="活动详情：">
        <div style="display:flex">
          <wang-editor ref="ue" type="mkt-gold-plus" style="width:800px" />
          <div class="rightcontext2">
            <div class="prompt">
              活动详情图片单张大小不能超过1M；
              <br />建议图片高度为750像素，图片宽度不大于1500像素；
              <br />图片的格式为JPG/GIF/PNG
              <br />
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="button-div"><el-button type="primary" @click="submit">下一步</el-button></div>
    <!-- 图片删除弹窗 -->
    <el-dialog title="提示" :visible.sync="deleteDialog" width="20%" :center="true">
      <span style="display:block;text-align:center;">是否删除推荐位图片，删除后小程序不显示哦</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false" class="params-button">取 消</el-button>
        <el-button type="primary" @click="deleteImg" class="params-button">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="deleteAwardDialog" width="20%" :center="true">
      <span style="display:block;text-align:center;">确定关闭{{deleteAwardIndex+1}}级奖品？ 关闭后再次开启需重新设置奖品</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteAwardDialog = false" class="params-button">取 消</el-button>
        <el-button type="primary" @click="deleteAwardImg" class="params-button">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看示例弹框 -->
    <el-dialog :visible.sync="lookResult" class="look-wrapper" width="25%">
      <p>
        亲爱的
        <span class="key-span">#用户昵称#</span>，下图是您的专属活动海报图，将海报分享至朋友圈/微信好友邀请扫码关注，成功邀请5个好友关注后，即可到店领取奖品。
      </p>
    </el-dialog>
    <AwardDialog
      v-if="awardVisible"
      :giftGrade="giftGrade"
      :giftList="awards"
      :dialogTableVisible.sync="awardVisible"
      :gift="gift"
      :status="this.form.status"
      @addConfirm="addConfirm"
      @cancelDialog="cancelDialog"
    ></AwardDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';
import { imagesUrl } from '@/utils/imageUrl';
import {
  getActiveFirst,
  saveActiveFirst,
  queryShopOutList,
} from '@/api/super-mkt/activity-set/fans_plus';
import user from '@/utils/user';
import WangEditor from '@/components/WangEditor.vue';
import AwardDialog from './award-dialog.vue';
@Component({
  components: {
    WangEditor,
    AwardDialog,
  },
})
export default class BaseSetActivity extends Vue {
  @Prop({ default: '' }) curToken!: string;
  form = {
    activitiyId: '', // 活动ID
    activitiyName: '', // 活动名称
    curToken: '',
    keyWord: '',
    independentReminder: '',
    authentica: '',
    beginTime: '', // 开始时间
    endTime: '', // 结束时间
    designatedStore: '', // 指定门店
    giftList: [] as any[], // 赠品
    isShowOutShopName: '', // 是否显示店铺别名
    beforeReminder: '活动还未开始，敬请期待！', // 活动开始前提示语
    overReminder: '活动已结束，谢谢参与！', // 活动结束提示语
    detail: '', // 赠品
    bannerImgList: [] as any[], // 活动轮播图
    status: 0, // 状态（1，待发布，2，已发布，3，进行中，4，已暂停，5，已结束，6，已删除）
  };
  // 规则
  rules = {
    activitiyName: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
    ],
    keyWord: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
    beginTime: [
      { required: true, message: '请输入开始时间', trigger: 'change' },
    ],
    endTime: [{ required: true, message: '请输入结束时间', trigger: 'change' }],
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
    bannerImgList: [
      { required: true, message: '请添加轮播图', trigger: 'blur' },
    ],
  };
  independentReminderKeys = ['#用户昵称#', '#活动链接#', '#活动目标奖品#'];
  awardVisible = false;
  // 是否刷新标识
  isFresh = false;
  awards = [
    {
      isOpen: true,
      name: '一级奖品',
      giftCode: '',
      giftName: '',
      giftGrade: '1',
      id: 0,
      remainCount: 0,
      warningCount: 0,
      isSelfGet: 'N',
      isValid: '1',
      shelfGiftName: '',
      index: 0
    },
    {
      isOpen: false,
      name: '二级奖品',
      giftCode: '',
      giftName: '',
      giftGrade: '2',
      id: 0,
      remainCount: 0,
      warningCount: 0,
      isSelfGet: 'N',
      isValid: '1',
      shelfGiftName: '',
       index: 1
    },
    {
      isOpen: false,
      name: '三级奖品',
      giftCode: '',
      giftName: '',
      giftGrade: '3',
      id: 0,
      remainCount: 0,
      warningCount: 0,
      isSelfGet: 'N',
      isValid: '1',
      shelfGiftName: '',
      index: 2
    }
  ] as any[];
  // 门店列表
  shops = [];
  // 不确定性(门店列表)
  isIndeterminate = true;
  checkAll = false;
  // 选择的门店
  checkedShop = [] as any[];
  deleteDialog = false;
  deleteAwardDialog = false;
  deleteAwardIndex = 0;
  authentica = false;
  deleteIndex = 0;
  fileList: any[] = [];
  activitiyId: any;
  lookResult = false;
  isShowOutShopName = false;
  giftGrade: string = '1';
  gift: any = {};
  independentDes =
    '请输入内容';
  mounted() {
    if (this.$route.query.id) {
      this.activitiyId = this.$route.query.id;
    }

    let body: any;
    if (this.curToken != '' && this.activitiyId) {
      body = { activitiyId: this.activitiyId, curToken: this.curToken };
    } else if (this.activitiyId) {
      body = { activitiyId: this.activitiyId };
    } else if (this.curToken != '') {
      body = { curToken: this.curToken };
    }
    if (body) {
      getActiveFirst(body).then((res: any) => {
        if (res.code === 0) {
          this.form = res.data;
          this.initForm();
        }
      });
    } else {
      this.initForm();
    }
    this.getShopList();
  }

  deleteAwardImg() {
     this.deleteAwardDialog = false;
     this.awards[this.deleteAwardIndex].isOpen = false;
     this.awards[this.deleteAwardIndex].giftCode = '';
     this.awards[this.deleteAwardIndex].giftName = '';
     this.awards[this.deleteAwardIndex].shelfGiftName = '';
     this.awards[this.deleteAwardIndex].isSelfGet = 'N',
     this.awards[this.deleteAwardIndex].remainCount = 0;
     this.awards[this.deleteAwardIndex].warningCount = 0;
     delete this.awards[this.deleteAwardIndex].popularity;
  }
  // 点击开启开关
  handleUpdate(item: any) {
    if (this.form.status == 2 || this.form.status == 3) {return false; }
    this.deleteAwardIndex = item.index;
    if (!item.isOpen) {
        if (this.deleteAwardIndex == 1 && this.awards[2].isOpen) {
            this.$message({
              message: '关闭二级奖品，需先关闭三级奖品',
              type: 'warning',
            });
            this.awards[this.deleteAwardIndex].isOpen = true;
            return false;
       } else {
        this.deleteAwardDialog = true;
        this.awards[this.deleteAwardIndex].isOpen = true;
       }
    } else {
       if (this.deleteAwardIndex == 2 && !this.awards[1].isOpen) {
            this.$message({
              message: '需要开启二级奖品',
              type: 'warning',
            });
            this.awards[this.deleteAwardIndex].isOpen = false;
            return false;
       }
    }
  }
  onAddContext(index: number) {
    this.form.independentReminder += this.independentReminderKeys[index];
    this.form.independentReminder = this.form.independentReminder.substring(
      0,
      200
    );
  }
  initForm() {
    this.form.curToken = this.curToken;
    this.authentica = this.form.authentica == '1';
    this.form.giftList.map((item: any, index) => {
      if (item.giftGrade) {
        this.awards[Number(item.giftGrade) - 1].isOpen = item.isDelete == '0';
        this.awards[Number(item.giftGrade) - 1].giftCode = item.giftCode;
        this.awards[Number(item.giftGrade) - 1].giftName = item.giftName;
        this.awards[Number(item.giftGrade) - 1].popularity = item.popularityValue + '';
        this.awards[Number(item.giftGrade) - 1].id = item.id;
        this.awards[Number(item.giftGrade) - 1].isValid = item.isValid;
        this.awards[Number(item.giftGrade) - 1].warningCount = item.warningCount;
        this.awards[Number(item.giftGrade) - 1].remainCount = item.remainCount;
        this.awards[Number(item.giftGrade) - 1].isSelfGet = item.isSelfGet;
        this.awards[Number(item.giftGrade) - 1].shelfGiftName = item.shelfGiftName;
      }
    });
    this.fileList = [];
    this.form.bannerImgList.map((item, index) => {
      this.fileList.push({ url: item });
    });
    (this.$refs.ue as any).setContent(this.form.detail);
    this.isShowOutShopName = this.form.isShowOutShopName == '1';
    this.checkedShop = this.form.designatedStore.split(',');
    this.curToken = this.form.curToken;
  }

  initSendForm() {
    const giftList: any[] = [];
    this.awards.map((item, index) => {
      if (item.giftCode != '') {
        const gift: any = {
          giftCode: '',
          giftGrade: '',
          isDelete: '',
          popularityValue: 0,
          remainCount: item.remainCount,
          isSelfGet: item.isSelfGet,
          shopName: '',
          warningCount: item.warningCount,
          shelfGiftName: item.shelfGiftName,
          isValid: '1',
        };
        if (item.id > 0) {
          gift.id = item.id;
        }
        gift.isDelete = item.isOpen ? '0' : '1';
        gift.giftCode = item.giftCode;
        gift.popularityValue = !Number(item.popularity) ? 0 : Number(item.popularity);
        gift.shopName = item.giftName;
        gift.giftGrade = index + 1 + '';
        gift.isValid = item.isValid;
        giftList.push(gift);
      }
    });
    this.form.giftList = giftList;
    const bannerImgList: any[] = [];
    this.fileList.map((item, index) => {
      if (item.response && item.response.data) {
        bannerImgList.push(item.response.data[0]);
      } else {
        bannerImgList.push(item.url);
      }
    });
    this.form.bannerImgList = bannerImgList;
    this.form.authentica = this.authentica ? '1' : '0';
    this.form.isShowOutShopName = this.isShowOutShopName ? '1' : '0';
    this.form.detail = (this.$refs.ue as any).getContent();
  }

  @Watch('checkedShop')
  watchCheckedShop(value: any) {
    const form = this.form;
    form.designatedStore = value.join(',');
  }
  // 打开新增接收人弹框
  addConfirm(data: any) {
    this.awardVisible = false;
    this.awards.map((item, index) => {
      if (item.giftGrade == data.giftGrade) {
        item.giftCode = data.giftCode;
        item.warningCount = data.warningCount;
        item.remainCount = data.remainCount;
        item.shelfGiftName = data.shelfGiftName;
        item.giftName = data.giftName;
        item.isSelfGet = data.isSelfGet ? 'Y' : 'N';
      }
    });
  }
  addRecevice(item: any, isAdd: boolean) {
    if ((this.form.status == 2 || this.form.status == 3) && isAdd) {
        this.$message({
          message: '活动已经进行中不能添加新奖品',
          type: 'warning',
        });
        return false;
    }
    if (!item.isOpen) {
      this.$message({
        message: '请开启礼品',
        type: 'warning',
      });
      return false;
    }
    this.giftGrade = item.giftGrade;
    this.gift = item;
    this.awardVisible = true;
    this.isFresh = false;
  }
  // 关闭通知人数弹框
  cancelDialog() {
    this.awardVisible = false;
  }
  // 提交
  submit() {
    this.initSendForm();
    (this.$refs.form as any).validate((valid: any) => {
      if (valid) {
        this.onSaveActiveFirst();
      } else {
        this.$message({
          message: '请检查必填项',
          type: 'warning',
        });
      }
    });
  }
  goLook() {
    this.lookResult = true;
  }
  onSaveActiveFirst() {
    return new Promise((resolve, reject) => {
      const body: any = {
        ...this.form,
      };
      if (!this.activitiyId) {
        delete body.activitiyId;
      }
      saveActiveFirst(body)
        .then((res: any) => {
          if (res.code === 0) {
            this.$emit('onNextActive', res.data);
          }
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }

  // 获取门店信息
  getShopList() {
    return new Promise((resolve, reject) => {
      const body = {};
      queryShopOutList(body)
        .then((res: any) => {
          const { data } = res;
          this.shops = data;
          resolve(res);
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }
  // 点击上传文件
  goUpLoad() {
    const upbtn: any = document.querySelector('.upbtn');
    upbtn.click();
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
              this.$set(
                this.form,
                'beginTime',
                moment(endTimestamp).format('YYYY-MM-DD HH:mm:ss')
              );
              this.$message({
                message: '开始时间不能大于或等于结束时间',
                type: 'warning',
              });
            }
          } else if (timestamp < Date.now()) {
            this.$set(
              this.form,
              'beginTime',
              moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            );
            this.$message({
              message: '开始时间不能小于当前时间',
              type: 'warning',
            });
          }
          break;
        case 'end':
          if (startDate) {
            const startTimestamp = moment(startDate).valueOf();

            if (timestamp <= startTimestamp) {
              this.$set(
                this.form,
                'endTime',
                moment(startTimestamp).format('YYYY-MM-DD HH:mm:ss')
              );
              this.$message({
                message: '结束时间不能小于或等于开始时间',
                type: 'warning',
              });
            }
          } else if (timestamp < Date.now()) {
            this.$set(
              this.form,
              'endTime',
              moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            );
            this.$message({
              message: '结束时间不能小于当前时间',
              type: 'warning',
            });
          }
          break;
      }
    }
  }
  // 门店单选
  handleCheckedShopChange(value: any) {
    const checkedCount = value.length;
    this.checkAll = checkedCount === this.shops.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.shops.length;
  }
  // 门店全选
  handleCheckAllChange(val: any) {
    this.checkedShop = val ? this.shops.map((item: any) => item.shopName) : [];
    this.isIndeterminate = false;
  }

  // 删除图片确认框
  deleteDialogFun(index: number) {
    this.deleteDialog = true;
    this.deleteIndex = index;
  }

  handleRemove(file: any) {
    console.log(file);
  }

  handlePreview(file: any) {
    console.log(file);
  }

  chanFile(file: any, fileList: any) {
    this.fileList = fileList;
  }

  uploadUrl() {
    return `${VUE_APP_BASE_API}/jop-marketing-web/market/upload`;
  }

  opt() {
    const opt = {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey,
    };
    return opt;
  }
  // 删除图片
  deleteImg() {
    if (this.fileList.length > 0) {
      this.fileList.splice(this.deleteIndex, 1);
      this.deleteDialog = false;
    }
  }

  uploadLogoSuccess(res: any, file: any, fileList: any) {
    if (res.code == '0') {
      // this.presenterUrl = res.data[0];
      // this.updateRecommend();
    } else {
      this.$message({
        type: 'error',
        message: res.msg,
      });
    }
  }

  // 上传文件限制个数
  limitUpload(files: any, fileList: any) {
    this.$message({
      message: '最多可添加8张图片',
      type: 'error',
    });
  }

  // 上传图片之前
  beforeAvatarUpload(file: any) {
    const imgMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
    const extension =
      imgMsg === 'jpg' ||
      imgMsg === 'JPG' ||
      imgMsg === 'png' ||
      imgMsg === 'PNG';
    const isLt50M = file.size / 1024 / 1024 <= 0.5;
    if (!extension) {
      this.$message.error('仅支持jpg，png格式的图片');
      return false;
    }
    if (!isLt50M) {
      this.$message.error('上传图片大小不能超过500k');
      return false;
    }
    return extension && isLt50M;
  }

  uploadLogoError() {
    this.$message.error('上传失败，请重新上传！');
  }
}
</script>
<style lang='scss' scoped>
/deep/ input[type='number'] {
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
      border-color: #409eff;
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

              > .el-textarea {
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
      }
    }
  }

  & /deep/ .el-form-item__error {
    position: absolute;
    top: 0;
    left: 430px;
  }
}
.param-upload-box {
  /deep/ .el-upload--picture-card {
    display: none;
  }
  .img-tip {
    font-size: 12px;
    font-weight: 400;
    color: #40445c;
  }
  .upload-btn {
    margin: 14px 0;
    width: 400px;
    background: #fff;
    border: 1px solid #d9d9d9;
    color: #5b81fe;
    font-size: 12px;
    font-weight: 400;
    &::before {
      margin-right: 12px;
    }
  }
  .upload-img-box {
    &::after {
      display: block;
      content: '';
      clear: both;
    }
    li {
      width: 80px;
      float: left;
      margin-right: 10px;
      .upload-im {
        width: 100%;
        height: 80px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .upload-wrap {
          position: absolute;
          width: 100%;
          height: 80px;
          top: 0;
          left: 0;
          background: rgba(2, 2, 2, 1);
          opacity: 0.59;
          display: flex;
          justify-content: center;
          align-items: center;
          display: none;
          span {
            color: #fff;
            cursor: pointer;
            width: 0;
            height: 0;
            margin: auto 4px;
          }
          .left {
            border-top: 9px solid transparent;
            border-bottom: 9px solid transparent;
            border-right: 9px solid rgba(255, 255, 255, 1);
            position: relative;
            i {
              position: absolute;
              width: 1px;
              height: 16px;
              border-left: 2px solid rgba(255, 255, 255, 1);
              top: -8px;
              left: -4px;
            }
          }
          .lastleft {
            border-right: 9px solid rgba(255, 255, 255, 1);
            i {
              border-left-color: rgba(187, 186, 186, 1);
            }
          }
          .turn-left {
            border-top: 9px solid transparent;
            border-bottom: 9px solid transparent;
            border-right: 9px solid #fff;
          }
          .turn-right {
            border-top: 9px solid transparent;
            border-bottom: 9px solid transparent;
            border-left: 9px solid #fff;
          }
          .right {
            border-top: 9px solid transparent;
            border-bottom: 9px solid transparent;
            border-left: 9px solid #fff;
            position: relative;
            i {
              position: absolute;
              width: 1px;
              height: 16px;
              border-left: 2px solid #fff;
              top: -8px;
              right: -4px;
            }
          }
        }
      }
      .upload-delete {
        text-align: center;
        color: #5b81fe;
        margin: 6px 0;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }
}
.key-span {
  color: #ff0000;
}
.key-clickspan {
  color: #ff0000;
  cursor: pointer;
}
.key-ulspan {
  color: #1fc965;
  text-decoration: underline;
  cursor: pointer;
}
.red-ulspan {
  margin: 15px;
  color: #ff0000;
  text-decoration: underline;
  cursor: pointer;
}
.blue-ulspan {
  margin: 15px;
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
.olle-ulspan {
  margin: 15px;
  color: #ff936b;
  text-decoration: underline;
  cursor: pointer;
}
.hui-ulspan {
  margin: 15px;
  color: #696868;
  text-decoration: underline;
  cursor: pointer;
}
.rightcontext {
  margin-left: 50px;
  margin-top: 10px;
  display: flex;
  font-size: 14px;
}
.rightcontext2 {
  margin-left: 10px;
  display: flex;
  font-size: 14px;
}
.prompt {
  width: 500px;
  height: 80px;
  line-height: 24px;
  border-radius: 4px;
  font-size: 14px;
}
</style>