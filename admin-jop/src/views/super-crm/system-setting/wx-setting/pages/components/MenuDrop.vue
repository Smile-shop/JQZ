<template>
  <div class="menu-drop">
    <draggable class="list-group" :list="list" @change="change">
      <div class="list-group-item" v-for="(element, index) in list" :key="index">
        <div class="boot-item">
          <i class="iconfont icon-gongneng"></i>
          {{ element.name }}
        </div>
        <draggable class="list-item" :list="element.childList1" @change="change">
          <div class="item" v-for="(item, i) in element.childList1" :key="i">
            <i class="iconfont icon-gongneng"></i>
            {{ item.name }}
          </div>
        </draggable>
      </div>
    </draggable>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import vuedraggable from 'vuedraggable';
// import Sortable from 'sortablejs';

@Component({
  components: {
    draggable: vuedraggable
  }
})
export default class MenuDrop extends Vue {
  @Prop()
  list!: any;

  private change() {
    this.$emit('dropMenu', this.list);
  }
}
</script>

<style lang="scss" scoped>
.menu-drop {
  width: 100%;
  .list-group {
    display: flex;
    .list-group-item {
      flex-grow: 1;
      display: flex;
      flex-direction: column-reverse;
      height: 556px;
      .boot-item {
        text-align: center;
        font-size: 14px;
        height: 42px;
        line-height: 42px;
        border: 1px solid #dddddd;
        cursor: pointer;
      }
      .list-item {
        // display: flex;
        // flex-direction: column-reverse;
        > .item {
          text-align: center;
          font-size: 14px;
          height: 42px;
          line-height: 42px;
          border: 1px solid #dddddd;
          cursor: pointer;
        }
      }
    }
  }
}
</style>


