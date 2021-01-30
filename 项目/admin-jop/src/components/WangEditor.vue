<template>
  <article class="wang-editor">
    <div :id="`editor-menu-${eleId}`" class="editor-menu"></div>
    <div class="column"></div>
    <div :id="`editor-con-${eleId}`" class="editor-con"></div>
    <!-- 限制字数 -->
    <div v-if="type === 'shelves' || type === 'news' || type==='mkt-gold-plus'" class="editor-limit-number">
      <span v-if="limitNumber > ((type === 'shelves'||type === 'mkt-gold-plus') ? 2000 : 20000)" class="tips">编辑内容已超过最大限制字数，您将无法保存，请重新编辑</span>
      <span :style="style">{{limitNumber}}</span> / {{ (type === 'shelves'||type === 'mkt-gold-plus') ? 2000 : 20000}}
    </div>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import E from 'wangeditor'
import user from '@/utils/user'

@Component({})
export default class WangEditor extends Vue {
  @Prop({ default: 'setting' })
  type!: string

  @Prop()
  contents!: string
  // @Prop({default: 0})
  // limitNumber: any

  @Prop({ default: `${new Date().getTime()}` })
  eleId!: string

  private editorContent: string = ''
  private editor: any = null
  private limitNumber: any = 0;
  private style: string = ''

  @Watch('contents')
  onContents(val: any) {
    this.setContent(val)
  }

  private mounted() {
    // 创建编辑器
    this.createEditor()
    // 清除div样式层次
    this.removeStyle()
  }

  // 清除div样式层次
  private removeStyle() {
    const item1 = document.querySelectorAll('.w-e-menu')
    item1.forEach(p => {
      p.removeAttribute('style')
    })
    const item2 = document.querySelector('.w-e-text-container')
    if (item2) {
      item2.removeAttribute('style')
    }
  }

  // 获取内容
  private getContent() {
    return this.editor.txt.html()
  }

  // 获取内容文本
  private getContentText() {
    return this.editor.txt.text()
  }

  // 设置内容
  private setContent(content: any) {
    this.editor.txt.clear()
    if (content && typeof content === 'string' && content.startsWith('<')) {
      this.editor.txt.html(`${content}`)
    } else if (content) {
      this.editor.txt.html(`<p>${content}</p>`)
    }
    if (this.type === 'shelves' || this.type === 'news' || this.type === 'mkt-gold-plus') {
      this.editorContent = content
      const temp = content.replace(/<\/?[^>]*>/g, '').replace(/[ | ]*\n/g, '\n').replace(/\n[\s| | ]*\r/g, '\n').replace(/&nbsp;/ig, 's');
      const imgVal = this.getContent();
      const regex = new RegExp(/<img\b[^>]*src\s*=\s*"[^>"]*\.(?:png|jpg|bmp|gif)" *?(?=alt=)[^>]*>/g);
      const emioLen = imgVal.match(regex);
      let imgLen = 0;
      if (emioLen && Array.isArray(emioLen) && emioLen.length > 0) {
        imgLen = emioLen.length;
      }
      this.limitNumber = temp.length + imgLen;
      if (this.type === 'news' && this.limitNumber > 20000) {
        this.style = 'color: red'
      } else if ((this.type === 'shelves' || this.type === 'mkt-gold-plus') && this.limitNumber > 2000) {
        this.style = 'color: red'
      } else {
        this.style = 'color: #000'
      }
    } else {
      this.editorContent = content
    }
  }

  // 创建富文本编辑器
  private createEditor() {
    this.editor = new E(`#editor-menu-${this.eleId}`, `#editor-con-${this.eleId}`)
    this.editor.customConfig.onchangeTimeout = 100
    this.$nextTick(() => {
      const textContent = document.getElementsByClassName('w-e-text')[0];
      (textContent as any).style.cssText = 'width: 100%; min-height: 300px; max-height: 600px;'
    })
    this.editor.customConfig.zIndex = 100
    if (this.type === 'word') {
      this.editor.customConfig.menus = ['link']
    }
    if (this.type === 'shelves') {
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'list',  // 列表
        'justify',  // 对齐方式
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'undo',  // 撤销
        'redo'  // 重复
      ]
      // 将图片大小限制为 500k
      this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024 / 2
    } else if (this.type === 'mkt-setting') {
        this.editor.customConfig.menus = []
    } else if (this.type === 'mkt-gold-plus') {
        // 人气值千金PLUS-将活动详情图片大小限制为 1M
      this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024;
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'list',  // 列表
        'justify',  // 对齐方式
        'image',  // 插入图片
        'table',  // 表格
        'undo',  // 撤销
        'redo'  // 重复
      ]
    }
    this.editor.customConfig.uploadImgShowBase64 = true

    this.editor.customConfig.uploadImgServer = `${VUE_APP_BASE_API}/jop-wx-web/file/upload`
    this.editor.customConfig.uploadImgParams = {
      edit: 'edit',
      alias: 'photos'
    }
    this.editor.customConfig.uploadFileName = 'file'
    this.editor.customConfig.uploadImgHeaders = {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey,
      accountId: user.serverUser.account.accountId
    }
    if (this.type === 'shelves' || this.type === 'news' || this.type === 'mkt-gold-plus') {
      this.editor.customConfig.onchange = (html: any) => {
          this.editorContent = html;
          const temp = html.replace(/<\/?[^>]*>/g, '').replace(/[ | ]*\n/g, '\n').replace(/\n[\s| | ]*\r/g, '\n').replace(/&nbsp;/ig, 's');
          const imgVal = this.getContent();
          const regex = new RegExp(/<img\b[^>]*src\s*=\s*"[^>"]*\.(?:png|jpg|bmp|gif)" *?(?=alt=)[^>]*>/g);
          const emioLen = imgVal.match(regex);
          let imgLen = 0;
          if (emioLen && Array.isArray(emioLen) && emioLen.length > 0) {
            imgLen = emioLen.length;
          }
          this.limitNumber = temp.length + imgLen;
          if (this.type === 'news' && this.limitNumber > 20000) {
            this.style = 'color: red'
          } else if ((this.type === 'shelves' || this.type === 'mkt-gold-plus') && this.limitNumber > 2000) {
            this.style = 'color: red'
          } else {
            this.style = 'color: #000'
          }
      }
    } else {
      this.editor.customConfig.onchange = (html: any) => {
        this.editorContent = html
      }
    }
    this.editor.create()
  }

  // 清除内容
  private destroyed() {
    this.editor.txt.clear()
    this.editor = null
  }
}
</script>

<style lang="scss" scoped>
.wang-editor {
  width: 100%;
  position: relative;
  z-index: 999;
  .editor-menu {
    border: 1px solid #ccc;
    flex-wrap: wrap;
  }
  .column {
    height: 5px;
  }
  .editor-con {
    border: 1px solid #ccc;
    position: static;
    min-height: 300px;
    max-height: 600px;
    overflow-y: auto;
    padding-bottom: 30px;
  }
  .editor-limit-number{
    position: absolute;
    bottom: 1px;
    right: 10px;
    background: #fff;
    width: calc(100% - 11px);
    text-align: right;
    height: 30px;
    line-height: 30px;
  }
  .tips{
    margin-right: 20px;
    font-size: 14px;
    color: red;
  }
}
/* ul ol 样式 */
ul,
ol {
  margin: 10px 0 10px 20px;
}
</style>


