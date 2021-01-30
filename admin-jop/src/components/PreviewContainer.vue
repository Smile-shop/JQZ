<template>
  <div class="preview-container">
    <div class="title">
      【效果预览】
    </div>
    <div class="page">
      <header>
        <div class="left">
          <i class="icon el-icon-close"></i>
          <span>
            {{title}}
          </span>
        </div>
        <div class="right">
          <i class="icon el-icon-more"></i>
        </div>
      </header>
      <main>
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({
  components: {
  }
})
export default class Preview extends Vue {
  @Prop({
    type: String,
    required: false,
    default: '标题'
  })
  title!: string
}
</script>

<style lang="scss" scoped>
.preview-container {
  flex-shrink: 0;
  width: 450px;
  margin-right: 33px;

  > .title {
    margin-bottom: 17px;
    text-align: center;
    color: #409eff;
  }

  > .page {
    border: 1px solid #e3e0e0;

    > header {
      display: flex;
      justify-content: space-between;
      padding: 16px 14px;
      background-color: #f3f3f3;
      color: #333333;
      font-size: 15px;

      > .left {
        display: flex;
        align-items: center;
        font-size: 15px;

        > .icon {
          margin-right: 12px;
        }
      }
    }

    > main {
      position: relative;
      overflow: hidden;
      height: 800px;
    }
  }

}
</style>


