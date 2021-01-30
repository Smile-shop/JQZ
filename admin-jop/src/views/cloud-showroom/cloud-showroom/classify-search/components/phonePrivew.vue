<template>
  <div class="phonePrivew">
    <header class="article-title">预览</header>
    <article class="content">
      <img src="@/assets/images/super-crm/cloud-showroom/goods.png" alt="">
      <header class="content-title">{{title}}</header>
      <section class="content-substance">
        <div class="content-primary">
          <div v-for="(item, index) in menus" :key="index">
            <span v-if="item.state" class="content-primary-item">{{item.original}}</span>
          </div>
        </div>
      </section>
      <div class="content-aside">
        <div v-for="(item, index) in menus" :key="index">
        <div class="content-vice-title" v-if="item.state || item.isIndeterminate">{{item.alias || item.original}}</div>
        <span v-for="(vice, inde) in item.subclassList" :key="inde" class="content-group">
          <em v-if="vice.aliasSubclass && vice.stateSubclass" class="content-item">{{vice.aliasSubclass}}</em>
          <em v-if="vice.originalSubclass && vice.stateSubclass" class="content-item">{{vice.originalSubclass}}</em>
        </span>
      </div>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class PhonePrivew extends Vue {
  private title: string = '商品分类'
  @Prop() private menus: any
}
</script>

<style scoped>
.article-title {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}
.content {
  position: relative;
  border: 0px solid #000;
  border-radius: 12px;
  height: 695px;
  width: 365px;
  margin: 0 auto;
  overflow: hidden;
}
.content-title {
  position: absolute;
  top: 2.7rem;
  left: 50%;
  transform: translateX(-1.5rem);
}
.content-substance {
  position: absolute;
  top: 130px;
  height: 530px;
  overflow: auto;
  padding: 0 0 5px 5px;
  margin-left: 30px;
}

.content-aside  {
  position: absolute;
  right: 0;
  top: 130px;
  height: 540px;
  overflow: auto;
  padding: 0 5px 5px 10px;
  width: 215px;
  margin-right: 30px;
}

.content-primary {
  padding: 5px;
  background: #eaedf1;
}

.content-primary-item {
  display: inline-block;
  padding: 8px 5px;
  font-size: 14px;
}

.content-right {
  float: right;
}

.content-vice-title {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.content-item {
  display: inline-block;
  margin: 8px 8px 8px 0;
  padding: 5px 5px;
  background: #eaedf1;
  font-style: normal;
  font-size: 12px;
}
</style>