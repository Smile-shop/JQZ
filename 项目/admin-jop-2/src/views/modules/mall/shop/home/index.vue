<template>
  <page-wrapper>
    <page-preview
      :tabs="data.setTabs"
    >
      <template
        #preview
      >
        <preview
          :componentsData="data.componentsData"
        />
      </template>
      <template v-slot="{ activeTabKey }">
        <home-carousel
          v-show="activeTabKey === 'homeCarousel'"
          @setComponentsData="setComponentsData"
        />
        <home-nav
          v-show="activeTabKey === 'homeNav'"
          @setComponentsData="setComponentsData"
        />
        <home-recommend-one
          v-show="activeTabKey === 'homeRecommendOne'"
          kind="RCD1"
          @setComponentsData="setComponentsData"
        />
        <home-recommend-two
          v-show="activeTabKey === 'homeRecommendTwo'"
          kind="RCD2"
          @setComponentsData="setComponentsData"
        />
      </template>
    </page-preview>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';
import PagePreview from '@/layout/page-preview.vue';
import Preview from './components/preview.vue';
import homeCarousel from './components/carousel.vue';
import Nav from './components/nav.vue';
import Recommend from './components/recommend.vue';

interface Data {
  carousel: any[];
  nav: any[];
}

export default defineComponent({
  components: {
    PagePreview,
    Preview,
    homeCarousel,
    homeNav: Nav,
    homeRecommendOne: Recommend,
    homeRecommendTwo: Recommend,
  },
  setup() {
    const data = reactive({
      componentsData: {
        carousel: [],
        nav: [],
        homeRecommendOne: {
          info: {
            imgUrl: '',
            title: '',
            visible: 'Y',
            remark: '',
            id: '',
          },
          list: []
        },
        homeRecommendTwo: {
          info: {
            imgUrl: '',
            title: '',
            visible: 'Y',
            remark: '',
            id: '',
          },
          list: []
        },
      },
      setTabs: [
        {
          key: 'homeCarousel',
          tab: '轮播图设置',
        },
        {
          key: 'homeNav',
          tab: '快捷导航设置',
        },
        {
          key: 'homeRecommendOne',
          tab: '推荐位1',
        },
        {
          key: 'homeRecommendTwo',
          tab: '推荐位2',
        },
      ]
    })

    function setComponentsData(name: keyof Data, value: any) {
      data.componentsData[name] = value;
    }

    return {
      data,
      setComponentsData
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
