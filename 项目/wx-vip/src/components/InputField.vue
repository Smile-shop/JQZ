<template>
  <section class="input-field">
    <input v-model="inputValue" @blur="blur" class="input-field-body" :disabled="isDisable" :maxLength="maxLength" :placeholder="placeholder" :type="type">
    <div class="input-field-footer" v-show="footerDivShow && !isDisable">
      <!-- <i class="iconfont" @click="clear">&#xe60a;</i> -->
      <i class="vip-v3-iconfont iconfont" @click="clear">&#xe606;</i>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    type: {
      type: String,
      default: 'text'
    },
    maxLength: {
      type: String
    },
    isDisable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  watch: {
    inputValue(value) {
      this.$emit('input', value);
    },
    value(value) {
      this.inputValue = value;
    }
  },
  computed: {
    footerDivShow() {
      return this.inputValue != '';
    }
  },
  mounted() {
    this.inputValue = this.value;
  },
  methods: {
    blur(e) {
      // window.scroll(0, 0);
      e.target.scrollIntoView({block: 'center', inline: 'center'});
    },
    clear() {
      this.inputValue = '';
    }
  }
}
</script>


<style lang="less" scoped>
.input-field {
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  &-body {
    width: calc(100% - 30px);
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
  }
}
</style>

