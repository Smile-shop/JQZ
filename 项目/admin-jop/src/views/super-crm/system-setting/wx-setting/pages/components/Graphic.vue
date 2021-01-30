<template>
  <div class="graphic">
    <el-row type="flex" justify="space-around">
      <el-col :span="4" class="item">
        <el-button type="text" @click="selectGraphicInit('news')" :style="{color: typeStyle('news')}">
          <span class="item-btn-text"><i class="iconfont icon-article"></i>图文消息</span>
        </el-button>
      </el-col>
      <el-col :span="4" class="item">
        <el-button type="text" @click="selectGraphicInit('text')" :style="{color: typeStyle('text')}">
          <span class="item-btn-text"><i class="iconfont icon-wenzi"></i>文字</span>
        </el-button>
      </el-col>
      <el-col :span="4" class="item">
        <el-button type="text" @click="selectGraphicInit('image')" :style="{color: typeStyle('image')}">
          <span class="item-btn-text"><i class="iconfont icon-image"></i>图片</span>
        </el-button>
      </el-col>
      <el-col :span="4" class="item">
        <el-button type="text" @click="selectGraphicInit('voice')" :style="{color: typeStyle('voice')}">
          <span class="item-btn-text"><i class="iconfont icon-yuyin"></i>语音</span>
        </el-button>
      </el-col>
      <el-col :span="4" class="item">
        <el-button type="text" @click="selectGraphicInit('video')" :style="{color: typeStyle('video')}">
          <span class="item-btn-text"><i class="iconfont icon-video"></i>视频</span>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class Graphic extends Vue {
  @Prop()
  value!: '';
  private selectGraphicInit(type: string) {
    this.$emit('input', type);
  }

  private typeStyle(item: any) {
    return this.value === item ? '#409eff' : '#999999';
  }
}
</script>

<style lang="scss" scoped>
.graphic {
  .item {
    text-align: center;
    .item-btn-text {
      display: flex;
      align-items: center;
      > .iconfont {
        font-size: 18px;
        margin-right: 8px;
      }
    }
    .item-btn-text:hover {
      color: #409eff;
    }
  }
}
</style>


