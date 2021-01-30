<template>
  <section class="select-field">
    <div class="select-field-content" @click="PopupShow = true">
      <div class="select-field-content-header" :style="updateInfoHeader">
        <slot name="header"></slot>
      </div>
      <div class="select-field-content-body" :style="updateInfoBody">{{ selectValue || placeholder }}</div>
      <div class="select-field-content-footer">
        <i class="vip-v3-iconfont">&#xe60e;</i>
      </div>
    </div>

    <van-popup v-model="PopupShow" position="bottom">
      <section class="select-field-popup-body">
        <van-datetime-picker :max-date="maxDate" :min-date="minDate" v-model="initDate" @confirm="selectDay" @cancel="PopupShow = false" :type="type" v-if="type == 'date' || type == 'datetime'" />
        <van-picker v-else :columns="pickerColumns" :show-toolbar="true" @confirm="onChange" @cancel="PopupShow = false"/>
      </section>
    </van-popup>

  </section>
</template>

<script>
import {mapState} from 'vuex';
import { Picker, DatetimePicker } from 'vant';
export default {
  components: {
    VanPicker: Picker,
    VanDatetimePicker: DatetimePicker
  },
  props: {
    initData: {
      type: [String, Number],
      default: '1980/1/1',
      required: true
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    type: {
      type: String,
      default: 'select'
    },
    columnsList: {
      type: Array
    },
    isComplete: {
      type: Boolean
    },
    maxDate: {
      type: Date
    },
    minDate: {
      type: Date
    }
  },
  data() {
    return {
      selectValue: '',
      PopupShow: false,
      changeValue: '',
      pickerColumns: [],
      initDate: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
    }
  },
  computed: {
    ...mapState({
      themeColor: state => {
        return state.indexPageData && state.indexPageData.colorname ? state.indexPageData.colorname : '#d41010'
      }
    }),
    updateInfoHeader() {
      if(this.isComplete) {
        return {
          width: '110px',
          textAlign: 'left',
          paddingLeft: '15px'
        }
      } else {
        return {
          width: 0
        };
      }
    },
    updateInfoBody() {
      if(this.isComplete) {
        return {
          width: 'calc(100% - 70px)',
        }
      } else {
        return {
          width: 'calc(100% - 30px)'
        };
      }
    }
  },
  watch: {
    selectValue(value) {
      this.$emit('select', value);
    },
    initData(value) {
      this.selectValue = value;
    },
    columnsList(value) {
      this.pickerColumns = value;
      // if(this.type == 'date') {
      //   this.changeValue = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;
      // };
      // if(this.type == 'select') {
      //   this.changeValue = this.columnsList[0];
      // }
    }
  },
  mounted() {
    this.selectValue = this.initData;
    if(this.type == 'select') {
      this.pickerColumns = this.columnsList;
      this.changeValue = this.columnsList[0];
    }
  },
  methods: {
    onChange(value) {
      this.PopupShow = false;
      this.changeValue = value.length > 0 ? value : '';
      this.selectValue = value.length > 0 ? this.changeValue : '';
    },
    selectDay(value) {
      this.PopupShow = false;
      this.changeValue = new Date(value).format("yyyy-MM-dd hh:mm");
      this.selectValue = this.changeValue;
    }
  }
}
</script>


<style lang="less" scoped>
.select-field {
  width: 100%;
  // background-color: white;
  &-content {
    display: flex;
    align-items: center;
    height: 42px;
    &-header {
      width: 40px;
      text-align: center;
      font-size: 0;
      .iconfont {
        font-size: 24px;
        color: #7c7c7c;
      }
    }
    &-body {
      width: calc(100% - 70px);
      font-size: 14px;
      color: #7c7c7c;
      background: none;  
      outline: none;  
      border: 0px;
      padding: 0 8px;
    }
    &-footer {
      width: 30px;
      text-align: center;
      font-size: 14px;
      color: #7c7c7c;
    }
  }
  &-popup-body {
    // height: 280px;
  }
}
</style>

