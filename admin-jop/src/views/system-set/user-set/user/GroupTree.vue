<template>
  <article class="ly-tree-container">
    <el-tree
      :data="tree"
      :props="defaultProps"
      draggable
      :allow-drag="isDrag"
      :allow-drop="isAllowDrag"
      :expand-on-click-node="false"
      @node-click="nodeClick"
      :render-content="renderContent">
    </el-tree> 
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class GroupTree extends Vue {
  @Prop()
  tree: any;
  private defaultProps = {
    children: 'listAPG',
    label: 'name'
  };
  private isEdit: boolean = false;
  private editName: string = '';
  private isSuperuser: boolean = true;
  private selectId: any = null;
  private selectLevel: any = null;
  private selectNode: any = null;

  nodeClick(data: any) {
    this.$emit('nodeClick', data);
  }

  isDrag(draggingNode: any) {
    return draggingNode.level === 1;
  }

  isAllowDrag(draggingNode: any, dropNode: any, type: any) {
    return type !== 'inner' && dropNode.level !== 2;
  }

  nameChange(e: any) {
    e = event || window.event;
    e.stopPropagation();
    this.editName = e.target.value;
  }

  isSelect(data: any) {
    return data.id === this.selectId;
  }

  renderContent(h: any, { node, data }: any) {
    if (this.isEdit && this.isSelect(data)) {
      return h('span', {
        class: 'ly-tree-node'
      }, [
        h('input', {
          style: {
            width: '100px',
            fontSize: '12px'
          },
          attrs: {
            placeholder: '名称不能为空',
            value: this.editName
          },
          class: 'ly-edit__text',
          on: {
            keyup: () => this.nameChange(Event)
          }
        }),
        this.getEditContent(h, data, node)
      ]);
    } else {
      return h('span', [
        h('span', `${data.name}${node.level === 2 ? ` / ${data.nickName}` : ''}`),
        this.getDefaultContent(h, data, node)
      ]);
    }
  }

  getEditContent(h: any, data: any, node: any) {
    return h('span', {
      class: 'ly-visible'
    }, [
      h('el-button', {
        attrs: {
          size: 'mini',
          type: 'text'
        },
        on: {
          click: () => this.close(node, data, Event)
        }
      }, '取消'),
      h('el-button', {
        attrs: {
          size: 'mini',
          type: 'text'
        },
        on: {
          click: () => this.editMsg(node, data, Event)
        }
      }, '确认')
    ])
  }

  getDefaultContent(h: any, data: any, node: any) {
    if (this.isSuperuser && node.level === 1) {
      return h('span', {
        class: 'ly-visible'
      }, [
        h('el-button', {
          attrs: {
            size: 'mini',
            type: 'text'
          },
          on: {
            click: () => this.update(node, data, Event)
          }
        }, '编辑'),
        h('el-button', {
          attrs: {
            size: 'mini',
            type: 'text'
          },
          on: {
            click: () => this.remove(node, data, Event)
          }
        }, '删除')
      ])
    }
  }

  remove(node: any, data: any, e: any) {
    e = event || window.event;
    e.stopPropagation();
    if (this.isEdit) {
      this.$notify({
        type: 'error',
        title: '操作提示',
        message: '有正在编辑或添加的选项未完成！',
        duration: 2000
      });
      return;
    }
    this.selectNode = node;
    this.$emit('handleNode', {
      type: 'remove',
      node: node.data
    })
  }

  update(node: any, data: any, e: any) {
    e = event || window.event;
    e.stopPropagation();
    if (this.isEdit) {
      this.$notify({
        type: 'error',
        title: '操作提示',
        message: '有正在编辑或添加的选项未完成！',
        duration: 2000
      });
      return;
    }
    this.selectId = data.id;
    this.selectLevel = data.level;
    this.editName = data.name;
    this.isEdit = true;
  }

  editMsg(node: any, data: any, e: any) {
    e = event || window.event;
    e.stopPropagation();
    if (this.editName.replace(/^\s+|\s+$/g, '')) {
      this.isEdit = false;
      this.selectId = null;
      this.selectLevel = null;
      this.$emit('handleNode', {
        type: 'edit',
        node: node.data,
        name: this.editName
      })
    }
  }

  close(data: any, node: any, e: any) {
    e = event || window.event;
    e.stopPropagation();
    this.selectId = null;
    this.selectLevel = null;
    this.editName = data.name;
    this.isEdit = false;
  }
}
</script>

<style lang="scss">
.ly-tree-container {
  padding: 12px;

  span {
    font-size: 12px;
  }

  .el-tree > .el-tree-node > .el-tree-node__content:first-child {
    position: relative;
    &::before,
    &::after {
      border: none;
    }
  }

  .ly-visible {
    visibility: hidden;
    position: absolute;
    right: 0;
    top: 2px;
  }

  .ly-edit__text {
    width: 25%;
    height: 25px;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    color: #666;
    text-indent: 10px;
  }

  .ly-tree__loading {
    color: #666;
    font-weight: bold;
  }

  .ly-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    justify-content: flex-start;
    font-size: 16px;
    padding-right: 8px;
    color: black;
  }

  .ly-tree-node > div > span:last-child {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  .ly-tree-node > span:last-child {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  .el-tree-node .el-tree-node__content {
    height: 30px;

    &:hover .ly-visible {
      visibility: visible;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      right: auto;
    }

    &::before {
      border-left: 1px solid #e6e6e6;
      bottom: 50px;
      height: 100%;
      top: 0;
      width: 1px;
      margin-left: -5px;
      margin-top: -15px;
    }

    &::after {
      border-top: 1px solid #e6e6e6;
      height: 20px;
      top: 14px;
      width: 10px;
      margin-left: -5px;
    }
  }

  .el-tree .el-tree-node {
    position: relative;
  }
}
</style>
