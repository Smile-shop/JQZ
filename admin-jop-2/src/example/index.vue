<template>
  <ul>
    <li
      v-for="item of data.skuPropList"
      :key="item.id"
    >
      <div>
        {{item.name}}
      </div>
      <div>
        <button
          v-for="item of item.items"
          :key="item.id"
          :disabled="item.initDisable || item.disable"
        >
          {{item.name}}
        </button>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, watch } from '@vue/composition-api';

export default defineComponent({
  components: {
  },
  props: {
  },
  setup(props, context) {
    const data = reactive({
      skuPropList: []
    });

    async function getData() {
      // eslint-disable-next-line
      const res = await fetch("http://120.79.93.109:9012/emp-mall/spuFront/getSkuStock", {"credentials":"omit","headers":{"accept":"*/*","cache-control":"no-cache","content-type":"application/json","mini_token":"emp:mem:mini:3rds:941681eb-f20d-49a2-91dd-7d94910456af","pragma":"no-cache","token":"emp:mem:tk:b86b8379-9988-4610-8f41-148285649be6"},"referrer":"https://servicewechat.com/wx89e7999fccc35fb0/devtools/page-frame.html","referrerPolicy":"no-referrer-when-downgrade","body":"{\"appId\":\"68594CF2-E947-82FA-84D0-01D4556F9F54\",\"cliVersion\":\"\",\"param\":{\"storeId\":\"030492F2-5C19-4AE4-8B29-8775F0EF8000\",\"skuId\":\"\",\"spuId\":\"67D4EECB-B71D-3367-9B9C-01F0275502ED\"},\"sign\":\"\",\"signType\":\"\",\"source\":\"\",\"timestamp\":0,\"version\":\"\"}","method":"POST","mode":"cors"});
      const resJson = await res.json();
      const { skuPropList, skuStockList } = resJson.data;
      const initStock: Record<string, boolean>[] = [];

      // initStock初始化
      skuPropList.forEach((value: any, index: number) => {
        initStock[index] = {};

        value.propValue.forEach((propValueValue: any, propValueIndex: number) => {
          initStock[index][propValueValue] = true;
        })
      });

      skuStockList.forEach((value: any, index: number) => {
        const propMatchValueSplit = (value.propMatchValue as string).split('_');
        if (value.stock !== 0) {
          propMatchValueSplit.forEach((propMatchValueSplitValue, propMatchValueSplitIndex) => {
            initStock[propMatchValueSplitIndex][propMatchValueSplitValue] = false;
          });
        }
      });

      (skuPropList as any[]).forEach((value: any, index: number) => {
        value.items = [];

        value.propValue.forEach((propValueValue: any, propValueIndex: number) => {
          value.items.push({
            name: propValueValue,
            initDisable: initStock[index][propValueValue],
            disable: false,
          });
        })
      });

      data.skuPropList = skuPropList;
    }

    onMounted(() => {
      getData();
    })

    return {
      data,
    };
  },
});
</script>

<style lang="sass" scoped>

</style>
