<template>
  <div class="page-preview">
    <a-card :title="previewTitle">
      <div class="preview">
        <div class="preview-content">
          <slot name="preview" />
        </div>
      </div>
    </a-card>
    <a-card
      :title="setTitle"
      :tab-list="tabs"
      :active-tab-key="data.activeTabKey"
      @tabChange="onTabChange"
    >
      <slot
        :active-tab-key="data.activeTabKey"
      />
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';

export default defineComponent({
  name: 'EnterpriseAccount',
  components: {
  },
  props: {
    previewTitle: {
      type: String,
      default: '预览',
    },
    setTitle: {
      type: String,
    },
    tabs: {
      type: Array
    }
  },
  setup(props) {
    const data = reactive({
      activeTabKey: '',
    });

    function onTabChange(key: string) {
      data.activeTabKey = key;
    }

    function init() {
      if (props.tabs) {
        data.activeTabKey = (props.tabs as any[])[0].key;
      }
    }

    onMounted(() => {
      init();
    })
    return {
      data,
      onTabChange
    };
  },
});
</script>

<style lang="scss" scoped>
.page-preview {
  display: grid;
  grid-template-columns: 450px auto;
  gap: 20px;

  .preview {
    padding: 55px 35px;
    min-height: 900px;
    background: url(~@/assets/img/common/phone.png);
    background-size: contain;
    background-repeat: no-repeat;

    > .preview-content {
      position: relative;
      overflow-x: hidden;
      overflow-y: auto;
      height: 650px;
      background-color: #FFF;
    }
  }
}
</style>
