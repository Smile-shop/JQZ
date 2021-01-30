<template>
  <div>
    <WzAuthQrcode />
  </div>
</template>

<script lange='ts'>
import { Vue, Component, Prop, Watch, Model } from 'vue-property-decorator'
import WzAuthQrcode from './component/wzauthQrcode.vue'
@Component({
  components: {
    WzAuthQrcode,
  },
})

export default class WxAuth extends Vue {

}
</script>

<style lang="scss" scoped>

</style>