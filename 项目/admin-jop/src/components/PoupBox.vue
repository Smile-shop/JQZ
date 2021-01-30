<template>
  <section class="poup-box" v-if="value">
    <div class="content">
      <div class="box" :style="{'width': `${width}px`}">
        <header>
          <div class="header">
            <slot name="header">
              <span>{{title}}</span>
            </slot>
          </div>
          <i class="el-icon-close icon-close" @click="$emit('cancel')"></i>
        </header>
        <section>
          <slot name="body"></slot>
        </section>
        <footer>
          <slot name="footer">
            <el-button @click="$emit('cancel')">取消</el-button>
            <el-button type="primary" @click="$emit('ok')">确定</el-button>
          </slot>
        </footer>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class PoupBox extends Vue {
  @Prop()
  value!: boolean
  @Prop()
  width!: string
  @Prop({ default: '信息' })
  title!: string
}
</script>

<style lang="scss" scoped>
.poup-box {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba($color: #000000, $alpha: .5);
  left: 0;
  top: 0;
  z-index: 1020;
  .content {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 0 5px gray;
      min-width: 500px;
      > header {
        height: 55px;
        line-height: 55px;
        border-bottom: 1px solid #dddddd;
        padding: 0 24px;
        display: flex;
        align-items: center;
        .header {
          flex-grow: 1;
          font-weight: bold;
          font-size: 14px;
        }
        .icon-close {
          cursor: pointer;
        }
      }
      > section {
        padding: 12px;
      }
      > footer {
        border-top: 1px solid #dddddd;
        padding: 8px 24px;
        text-align: right;
      }
    }
  }
}
</style>


