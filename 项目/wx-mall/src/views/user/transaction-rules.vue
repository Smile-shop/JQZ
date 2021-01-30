<template>
  <base-layout
    :isShowFooter="true"
    :isShowHeader="true"
    title="交易规则"
  >
    <article
      id="transaction-rules"
      v-html="data"
    >
    </article>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component, Watch} from 'vue-property-decorator';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import {Toast} from 'vant';

// http
import {httpReq} from '@/utils/http-req';
import {
  selectSellRulesReq,
} from '@/serves/user';

@Component({
  components: {
    BaseLayout,
  },
})
export default class TransactionRules extends Vue {
  private data: string = '';

  private mounted() {
    this.selectSellRules();
  }

  // 查询交易规则
  private selectSellRules() {
    return new Promise((resolve, reject) => {
      const body = {
      };

      selectSellRulesReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(selectSellRulesReq);

      httpRes.then(data => {
        this.data = data.content;
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }
}
</script>

<style lang="scss" scoped>
#transaction-rules {
  padding: 1rem;
}
</style>