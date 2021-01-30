<template>
  <div class="date-picker-content">
    <div class="body" :id="domClass">{{initData || placeholder}}</div>
  </div>
</template>

<script>
import datePicker from '../utils/date_picker';
export default {
  props: {
    domClass: {
      type: String,
      required: true
    },
    initData: {
      type: String
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    maxDate: {
      type: String
    },
    minDate: {
      type: String
    }
  },
  mounted() {
    const initData = this.initData ? this.initData : '1980-01-01';
    let calendar = new datePicker();
    calendar.init({
      'initDate': `${initData}`,
      'trigger': `#${this.domClass}`, /*按钮选择器，用于触发弹出插件*/
      'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
      'minDate': `${this.minDate}`,/*最小日期*/
      'maxDate': `${this.maxDate}`,/*最大日期*/
      'onSubmit': () => {/*确认时触发事件*/
        this.$emit('select', calendar.value);
      },
      'onClose': function(){/*取消时触发事件*/
      }
    });
  }
}
</script>

<style lang="less" scoped>
.date-picker-content {
  width: 100%;
  display: flex;
  align-items: center;
  height: 50px;
  .header {
    width: 40px;
    text-align: center;
    font-size: 0;
    .iconfont {
      font-size: 24px;
      color: #7c7c7c;
    }
  }
  .body {
    font-size: 14px;
    color: #7c7c7c;
    flex-grow: 1;
  }
}
</style>

