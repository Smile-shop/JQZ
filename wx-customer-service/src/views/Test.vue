<template>
  <div class="home">
    <button class="button" @click="modal = !modal">渐变</button>
    <poup 
      v-if="modal"
      @poupBtnOk="poupBtnOk"
      @poupBtnCencal="poupBtnCencal">
      <!-- <div slot="header">标题</div> -->
      <div slot="body" style="text-align:center">是否拨打15928563258？</div>
      <!-- <div slot="footer"></div> -->
    </poup>

    <input type="file" ref="filElem" @change="getFile" accept="image/*">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Poup from '@/components/Poup.vue';

@Component({
  components: {
    Poup
  },
})
export default class Home extends Vue {
  private modal: boolean = false;
  private poupBtnCencal() {
    console.log(1111);
  }
  private poupBtnOk() {
    console.log(2222);
  }

  private getFile() {
    window.alert(1111);
  }
}
</script>

<style lang="less" scoped>
.button {
  width: 160px;
  height: 50px;
  background-color: red;
  transition-property: opacity, background-color, border-radius;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  transition-delay: 0s;
}
.button:hover {
  opacity: 0.3;  
  background-color: #fff000;
  border-radius: 100px;
}
</style>
