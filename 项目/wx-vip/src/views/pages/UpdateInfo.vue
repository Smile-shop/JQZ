<template>
  <div>
    <div class="content">
      <div class="corps" :style="{ 'color': themeColor }">将赠送{{credit}}积分</div>

      <div class="info-list" v-if="personalInfo">

        <div class="list-item" v-if="personalItemShow('phone')">
          <div class="item-header">手机号</div>
          <div class="item-body">{{ phone }}</div>
          <div class="item-footer">
            <i class="vip-v3-iconfont" @click="toClose('phone', false)" v-if="phoneClose">&#xe60b;</i>
            <i class="vip-v3-iconfont" @click="toClose('phone', true)" v-else>&#xe601;</i>
          </div>
        </div>

        <div class="list-item" v-if="personalItemShow('name')">
          <div class="item-header">*姓名</div>
          <div class="item-body">
            <InputField :maxLength="'8'" v-model="personalInfo.name" placeholder="姓名为必填项"></InputField>
          </div>
        </div>

        <div class="list-item" v-if="personalItemShow('sex')">
          <div class="item-header">*性别</div>
          <div class="item-body">
            <SelectField :initData="personalInfo.sex" type="select" @select="personalInfo.sex = $event" :columnsList="['男', '女']" placeholder="选择性别"></SelectField>
          </div>
        </div>

        <div class="list-item" :class="{'item-birthday' : editInfo.birthdayLimit === 'Y' && editInfo.birthdayLimitNum > 0 }" v-if="personalItemShow('birthDay')">
          <div class="item-header">*生日</div>
          <div class="item-body">
            <div class="list-overlay" v-if="editInfo.birthdayLimit === 'Y' && editInfo.birthdayLimitNum <= 0"></div>
            <DatePicker domClass="birthDay" :initData="personalInfo.birthDay" :maxDate="timeMax" :minDate="minDate" @select="personalInfo.birthDay = $event" placeholder="请选择时间"></DatePicker>
            <!-- <SelectField :initData="personalInfo.birthDay" :minDate="minDate" :maxDate="timeMax" type="date" @select="personalInfo.birthDay = $event" placeholder="请选择时间"></SelectField> -->
            <div v-if="editInfo.birthdayLimit === 'Y' && editInfo.birthdayLimitNum > 0" class="birthday-edit">还可修改<span>{{editInfo.birthdayLimitNum}}</span>次，请谨慎修改</div>
          </div>
          <div class="item-footer">
            <span>{{`${personalInfo.birthType ? '阳' : '阴'}历`}}</span>
            <van-switch v-model="personalInfo.birthType" />
          </div>
        </div>

        <div class="list-item" v-if="personalItemShow('idCard')">
          <div class="item-header">证件号</div>
          <div class="item-body">
            <InputField :maxLength="'18'" v-model="personalInfo.idCard" placeholder="证件号"></InputField>
          </div>
        </div>

        <div class="list-item" :class="{'item-birthday' : editInfo.marryLimit === 'Y' && editInfo.marryLimitNum > 0 }" v-if="personalItemShow('merryDay')">
          <div class="item-header">结婚日期</div>
          <div class="item-body">
            <div class="list-overlay" v-if="editInfo.marryLimit === 'Y' && editInfo.marryLimitNum <= 0"></div>
            <DatePicker domClass="merryDay" :initData="personalInfo.merryDay" :maxDate="timeMax" :minDate="minDate" @select="personalInfo.merryDay = $event" placeholder="结婚日期"></DatePicker>
            <!-- <SelectField :initData="personalInfo.merryDay"  :minDate="minDate" :maxDate="timeMax" type="date" @select="personalInfo.merryDay = $event" placeholder="结婚日期"></SelectField> -->
            <div v-if="editInfo.marryLimit === 'Y' && editInfo.marryLimitNum > 0" class="birthday-edit">还可修改<span>{{editInfo.marryLimitNum}}</span>次，请谨慎修改</div>
          </div>
        </div>

        <!-- <div v-if="personalItemShow('address')">
          <div class="list-item" v-if="personalItemShow('address')">
            <div class="item-header">详细地址</div>
            <div class="item-body">
              <InputField v-model="personalInfo.address" placeholder="地址"></InputField>
            </div>
          </div>
        </div> -->

        <div class="list-item" v-if="personalItemShow('address')">
          <div class="item-header">地址</div>
          <div class="item-body">
            <InputField v-model="personalInfo.address" placeholder="地址"></InputField>
          </div>
        </div>

        <div class="list-item" v-if="personalItemShow('eMail')">
          <div class="item-header">邮箱</div>
          <div class="item-body">
            <InputField v-model="personalInfo.eMail" placeholder="邮箱"></InputField>
          </div>
        </div>

        <div class="list-item" v-if="personalItemShow('tel')">
          <div class="item-header">电话</div>
          <div class="item-body">
            <InputField :maxLength="'13'" v-model="personalInfo.tel" placeholder="电话"></InputField>
          </div>
        </div>

        <div class="list-item" v-if="personalItemShow('fax')">
          <div class="item-header">传真</div>
          <div class="item-body">
            <InputField v-model="personalInfo.fax" placeholder="传真"></InputField>
          </div>
        </div>

        <div class="list-item" v-if="personalItemShow('work')">
          <div class="item-header">职业</div>
          <div class="item-body">
            <SelectField :initData="personalInfo.work" type="select" @select="personalInfo.work = $event" :columnsList="['其他', '教师', '学生', '老板', '财务', '行政', '经理']" placeholder="选择职业"></SelectField>
          </div>
        </div>

        <div class="list-item" v-if="personalItemShow('education')">
          <div class="item-header">学历</div>
          <div class="item-body">
            <SelectField :initData="personalInfo.education" type="select" @select="personalInfo.education = $event" :columnsList="['其他', '大专', '本科', '研究生', '硕士', '博士']" placeholder="选择学历"></SelectField>
          </div>
        </div>

        <div class="list-item" v-if="personalItemShow('qqNum')">
          <div class="item-header">QQ</div>
          <div class="item-body">
            <InputField v-model="personalInfo.qqNum" placeholder="QQ"></InputField>
          </div>
        </div>

      </div>

      <div class="bottom-btn">
        <div class="submit-btn" v-if="submitBtnDisabled" :style="{ 'background-color': themeColor }" @click="updateWXMember">保存</div>
        <div class="submit-btn" v-else>提交中...</div>
      </div>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Switch } from 'vant';
import DatePicker from '../../components/DatePicker.vue';
export default {
  components: {
    VanSwitch: Switch,
    DatePicker
  },
  data() {
    return {
      value: '',
      phoneClose: false,
      idCardClose: false,
      personalInfo: null,
      credit: null,
      submitBtnDisabled: true,
      minDate: '1920-01-01',
      personalShowItemList: [],
      editInfo: {
        birthdayLimit: '', // 修改限制 N|没有限制 Y|有修改限制
        birthdayLimitNum: null,
        marryLimit: '',
        marryLimitNum: null
      }
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      urlData: state => state.urlData
    }),
    phone() {
      let phone = this.personalInfo && this.personalInfo.phone ? this.personalInfo.phone : '';
      return this.phoneClose ? phone : `${phone}`.replace(/^(.{0})(?:\d+)(.{0})$/,"$1***********$2");
    },
    timeMax() {
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return `${year + 2}-${month}-${day}`;
    },
    user() {
      const userStr = window.localStorage.getItem('urlData');
      if(userStr) {
        return JSON.parse(userStr);
      }
    }
  },
  mounted() {
    this.getWXMemberInfo();
  },
  methods: {
    getWXMemberInfo() {
      let params = {
        openid: this.user.openid,
        companyKey: this.user.companyKey
      };
      this._http({url: '/jop-web/wxMemberInfo/wxMemberInfo'}, params).then(res => {
        if(res.data.code === 0) {
          this.personalInfo = res.data.data.wxMemberInfo || null;
          this.personalShowItemList = res.data.data.params || [];
          
          if(this.personalInfo.birthDay && this.personalInfo.birthDay >= -1577952000000)
          {
            //处理IOS环境没有夏令时问题   
            var birthDay = new Date(this.personalInfo.birthDay);
            if(birthDay.getHours()>22){
              this.personalInfo.birthDay = this.personalInfo.birthDay+60*60*1000;
            }
            this.personalInfo.birthDay = new Date(this.personalInfo.birthDay).format('yyyy-MM-dd');
          }
          else
          {
            this.personalInfo.birthDay = "";
          } 

          if(this.personalInfo.merryDay && this.personalInfo.merryDay >= -1577952000000)
          {
            //处理IOS环境没有夏令时问题   
            var merryDay = new Date(this.personalInfo.merryDay);
            if(merryDay.getHours()>22){
              this.personalInfo.merryDay = this.personalInfo.merryDay+60*60*1000;
            }
            this.personalInfo.merryDay = new Date(this.personalInfo.merryDay).format('yyyy-MM-dd');
          }else{
            this.personalInfo.merryDay = "";
          }
    
          this.personalInfo.birthType = this.personalInfo.birthType === '1';
          this.credit = res.data.data.credit || null;
          this.editInfo.birthdayLimit = res.data.data.birthdayLimit || null;
          this.editInfo.birthdayLimitNum = res.data.data.birthdayLimitNum || null;
          this.editInfo.marryLimit = res.data.data.marryLimit || null;
          this.editInfo.marryLimitNum = res.data.data.marryLimitNum || null;
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    personalItemShow(data) {
      let item = this.personalShowItemList.find(p => {
        return `${p.name}`.includes(data);
      })
      if(item) {
        return item.isWrite == '1'; // 记得改为1
      } else {
        return false;
      }
    },
    toClose(name, close) {
      if(name == 'phone') {
        this.phoneClose = close;
        return
      }
    },
    updateWXMember() {
      if(this.personalInfo.name === '') {
        this.$toast({
          message: '姓名不能为空！',
          duration: 1000
        })
        return;
      }
      if(this.personalInfo.sex === '') {
        this.$toast({
          message: '性别不能为空！',
          duration: 1000
        })
        return;
      }
      if(this.personalInfo.birthDay === '') {
        this.$toast({
          message: '生日不能为空！',
          duration: 1000
        })
        return;
      }
      this.submitBtnDisabled = false;
      // this.$store.dispatch('updateWXMember');
      let params = {
        openid: this.urlData.openid,
        companyKey: this.urlData.companyKey,
        phone: this.personalInfo.phone,
        cardNum: this.personalInfo.cardNum,
        name: this.personalInfo.name,
        sex: this.personalInfo.sex,
        birthDay: this.personalInfo.birthDay == '' ? 0 : new Date(`${this.personalInfo.birthDay}`.replace(/\-/g, '/')).getTime(),
        idCard: this.personalInfo.idCard,
        merryDay: this.personalInfo.merryDay == '' ? 0 : new Date(`${this.personalInfo.merryDay}`.replace(/\-/g, '/')).getTime(),
        address: this.personalInfo.address,
        eMail: this.personalInfo.eMail,
        tel: this.personalInfo.tel,
        fax: this.personalInfo.fax,
        work: this.personalInfo.work,
        education: this.personalInfo.education,
        qqNum: this.personalInfo.qqNum,
        birthType: this.personalInfo.birthType ? '1' : '0',
        customerType: this.personalInfo.customerType ? this.personalInfo.customerType : ''
      }
      this._http({url: '/jop-web/wxMemberInfo/wxMemberUpdate'}, params).then(res => {
        this.submitBtnDisabled = true;
        if(res.data.code === 0) {
          this.$toast({
            message: '修改成功！',
            duration: 1000
          })
          window.setTimeout(() => {
            this.$router.go(-1);
          }, 1000)
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: calc(100vh - 75px);
  background-color: white;
  overflow: auto;
  .corps {
    text-align: center;
    font-size: 12px;
    border-bottom: 1px solid #EEEEEE;
    height: 25px;
    line-height: 22.5px;
  }
  .info-list {
    width: 100%;
    .list-item {
      border-bottom: 1px solid #EEEEEE;
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 14px;
      color: #666666;
      position: relative;
      .item-header {
        width: 60px;
        padding: 0 10px;
        font-weight: bold;
      }
      .item-body {
        flex-basis: 50%;
        flex-grow: 1;
        padding-left: 10px;
        .list-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9;
        }
      }
      .item-footer {
        width: 120px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
    }
    .item-birthday {
      height: 80px;
      .date-picker-content {
        height: 35px;
      }
      .birthday-edit {
        font-size: 14px;
        color: #ccc;
        span {
          color: #FF0000;
        }
      }
    }
    .list-item:first-child {
      background-color: #EEEEEE;
    }
  }
  .bottom-btn {
    width: 100%;
    .submit-btn {
      width: calc(100% - 30px);
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      color: white;
      margin: 15px auto;
      border-radius: 5px;
      background-color: gray;
    }
  }
}
</style>
