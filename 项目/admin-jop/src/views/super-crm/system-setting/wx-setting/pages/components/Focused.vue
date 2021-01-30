<template>
  <div class="focus">
    <div class="received-msg-content">
      <div class="msg-content">
        <header>
          <Graphic v-model="msgType" @input="selectGraphicInit" class="graphic-select"></Graphic>
        </header>
        <section>
          <div v-if="msgType === 'text'">
            <WangEditor ref="ue" type="word" eleId="focus"></WangEditor>
          </div>
          <div v-else-if="replayContent[msgType]">

            <Popover>
              <div slot="show-content" v-if="msgType === 'news'">
                <div class="news-box-content" v-for="(item, index) in replayContent[msgType].wxContents.news_item" :key="item.thumb_media_id">
                  <div class="first-item" v-if="index === 0">
                    <img :src="item.thumb_url" alt="graphic-logo">
                    <p>{{ item.title }}</p>
                  </div>
                  <div class="no-first-item" v-else>
                    <span>{{ item.title }}</span>
                    <img :src="item.thumb_url" alt="graphic-logo">
                  </div>
                </div>
              </div>
              <div slot="show-content" v-if="msgType === 'image'">
                <div class="image-box-content">
                  <img :src="replayContent[msgType].wxContents.url" alt="graphic-logo">
                </div>
              </div>
              <div slot="show-content" v-if="msgType === 'voice'">
                <div class="voice-box-content">
                  {{replayContent[msgType].wxContents.name}}
                </div>
              </div>
              <div slot="show-content" v-if="msgType === 'video'">
                <div class="voice-box-content">
                  {{replayContent[msgType].wxContents.name}}
                </div>
              </div>
              <div slot="reference">
                <!-- <el-button v-if="item.msgType === '1'" icon="el-icon-edit" circle></el-button> -->
                <el-button icon="el-icon-delete" @click="removeReplayContent" circle></el-button>
              </div>
            </Popover>

          </div>
          <div class="no-graphic" v-else>
            <div @click="selectGraphic">
              <i class="iconfont icon-sucaiku"></i>
              <p>从素材库选择</p>
            </div>
          </div>
        </section>
      </div>
      <el-button type="primary" style="margin-left:15px" @click="submitReceivedMsg">保存</el-button>
      <el-button @click="removeAutoItem">删除回复</el-button>
    </div>

    <PoupBox
      width="980"
      @cancel="graphicShow = false"
      v-model="graphicShow">
      <div slot="header" class="poup-box-header">
        {{computedGraphicName}}<span>( 素材来源于微信素材管理中心，如需要添加素材请前往微信公众平台素材管理 )</span>
      </div>
      <div slot="body" class="poup-box-body">
        <div class="news-box-content" v-if="msgType === 'news'">
          <div class="media-item" v-for="mediaItem in graphicList" :key="mediaItem.media_id">
            <div class="item" @click="selectedGraphicItem = mediaItem" :class="{'selected-item': selectedGraphicItem && (selectedGraphicItem.media_id === mediaItem.media_id)}">
              <div v-for="(item, index) in mediaItem.content.news_item" :key="item.thumb_media_id">
                <div v-if="index === 0">
                  <img :src="item.thumb_url" alt="graphic-logo">
                  <p>{{ item.title }}</p>
                </div>
                <div class="item-tot" v-else>
                  <span class="span">{{ item.title }}</span>
                  <img class="img" :src="item.thumb_url" alt="graphic-logo">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="img-box-content" v-if="msgType === 'image'">
          <div class="media-item"
             @click="selectedGraphicItem = mediaItem"
             :class="{'selected-item': selectedGraphicItem && (selectedGraphicItem.media_id === mediaItem.media_id)}"
            v-for="mediaItem in graphicList"
            :key="mediaItem.media_id">
            <img :src="mediaItem.url" alt="graphic">
          </div>
        </div>

        <div class="voice-box-content" v-if="msgType === 'voice'">
          <div class="media-item" v-for="mediaItem in graphicList" :key="mediaItem.media_id">
            <el-radio class="name" v-model="selectedGraphicItem" :label="mediaItem">{{mediaItem.name}}</el-radio>
            <span>{{mediaItem.update_time*1000 | momentFilter('YYYY-MM-DD')}}</span>
          </div>
        </div>

        <div class="video-box-content" v-if="msgType === 'video'">
          <div class="media-item"
             @click="selectedGraphicItem = mediaItem"
             :class="{'selected-item': selectedGraphicItem && (selectedGraphicItem.media_id === mediaItem.media_id)}"
            v-for="mediaItem in graphicList"
            :key="mediaItem.media_id">
            <span>{{mediaItem.name}}</span>
          </div>
        </div>

        <el-pagination
          class="page-box"
          v-if="menuContent !== 'text'"
          background
          layout="total, prev, pager, next, jumper"
          :page-sizes="[12, 50, 100, 200, 500]"
          :page-size.sync="pageSize"
          @size-change="selectGraphic"
          @current-change="selectGraphic"
          :current-page.sync="currentPage"
          :total="pageTotal">
        </el-pagination>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="selectGraphicOk">确定</el-button>
        <el-button @click="selectGraphicCancel">取消</el-button>
      </div>
    </PoupBox>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import Graphic from './Graphic.vue';
import PoupBox from '@/components/PoupBox.vue';
import WangEditor from '@/components/WangEditor.vue';
import Popover from '@/components/Popover.vue';
import { getWxAutoReplyInfo, getGraphic, submitAutoReplay, removeReplayContent } from '@/api/super-crm/wx-params-set';
import { getENString, getCNString } from '@/utils/nameExchange';

@Component({
  components: {
    PoupBox,
    WangEditor,
    Graphic,
    Popover
  }
})
export default class Focus extends Vue {
  @Prop({ default: '1' })
  replyState!: string;

  private msgType: string = 'news';
  private menuContent: string = 'news';

  private graphicShow: boolean = false;
  private graphicList = [];
  private selectedGraphicItem: any = null;

  private pageSize: number = 12;
  private currentPage: number = 1;
  private pageTotal: number = 0;

  private replayContent = {
    news: '',
    text: '',
    image: '',
    voice: '',
    video: ''
  };
  private replayId: any = '';

  get computedGraphicName() {
    return getCNString(this.menuContent);
  }

  private mounted() {
    this.getWxAutoReplyInfo();
  }

  private getWxAutoReplyInfo() {
    const params = {
      keyState: 'bindMsg'
    }
    getWxAutoReplyInfo(params).then((res: any) => {
      if (res.data.length > 0) {
        this.msgType = getENString(res.data[0].replyType) || 'news';
        const content = res.data[0].contents ? res.data[0].contents[0] : null;
        if (content) {
          (this.replayContent as any)[this.msgType] = {
            wxContents: this.msgType === 'text' ? '' : JSON.parse(content.wxContents),
            content: content.content,
            msgType: content.msgType,
            replyId: content.replyId
          };
          this.replayId = content.replyId;
          if (this.msgType === 'text') {
            this.$nextTick(() => {
              (this.$refs.ue as any).setContent(content.content);
            })
          }
        }
      }
    })
  }

  private selectGraphicInit(type: string) {
    this.msgType = type;
  }

  // 选择素材
  private selectGraphic() {
    const params = {
      type: this.msgType,
      indexSet: (this.currentPage - 1) * this.pageSize,
      count: this.pageSize
    }
    getGraphic(params).then((res: any) => {
      this.graphicList = res.data.item;
      this.pageTotal = res.data.total_count;
      this.graphicShow = true;
    })
  }

  // 选中素材
  private selectGraphicOk() {
    const wxContents = this.computedGraphicContent(this.msgType, this.selectedGraphicItem, true);
    const content = this.computedGraphicContent(this.msgType, this.selectedGraphicItem, false);
    (this.replayContent as any)[this.msgType] = {
      msgType: getENString(this.msgType),
      wxContents,
      replyId: '',
      content
    }
    this.selectGraphicCancel();
  }
  private computedGraphicContent(type: string, item: any, wxType: boolean) {
    if (type === 'news') {
      return wxType ? item.content : item.media_id;
    } else {
      return wxType ? item : item.media_id;
    }
  }

  // 取消选中素材
  private selectGraphicCancel() {
    this.graphicShow = false;
    this.graphicList = [];
    this.selectedGraphicItem = null;
    // this.msgType = '';
  }

  // 删除选择的素材
  private removeReplayContent() {
    (this.replayContent as any)[this.msgType] = '';
    // const replyId = (this.replayContent as any)[this.msgType].replyId;
    // if (replyId) {
    //   removeReplayContent({replyIds: [replyId]}).then((res: any) => {
    //     (this.replayContent as any)[this.msgType] = '';
    //   })
    // } else {
    //   (this.replayContent as any)[this.msgType] = '';
    // }
  }
  // 删除自动回复
  private removeAutoItem() {
    this.$confirm('是否确定删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const replyId = (this.replayContent as any)[this.msgType].replyId;
      removeReplayContent({replyIds: [replyId]}).then((res: any) => {
        this.getWxAutoReplyInfo();
      })
    }).catch(err => {
      console.log(err);
    });
  }

  private submitReceivedMsg() {
    if (this.msgType === 'text') {
      const text = (this.$refs.ue as any).getContentText();
      if (!text) {
        this.$message({
          type: 'warning',
          message: '文字不能为空!'
        });
        return
      }
      const replayTextContent = (this.$refs.ue as any).getContent().replace(/target="_blank"/g, '');
      this.submitMethod(replayTextContent, this.msgType);
    } else {
      if (!(this.replayContent as any)[this.msgType]) {
        this.$message({
          type: 'warning',
          message: '请选取素材!'
        });
        return
      }
      this.submitMethod((this.replayContent as any)[this.msgType], this.msgType);
    }
  }

  private submitMethod(data: any, type: string) {
    const contents = {
      msgType: '6',
      replyId: this.replayId,
      wxContents: '',
      content: ''
    };
    if (type === 'text') {
      contents.content = data;
    } else if (type === 'news') {
      contents.content = contents.wxContents = {
        media_id: data.content,
        ...data.wxContents
      };
    } else {
      contents.content = data.wxContents.media_id;
      contents.wxContents = data.wxContents;
    }
    const params = {
      replyType: getENString(type),
      keywordHalf: '',
      keyword: '',
      title: '关注回复',
      replyState: this.replyState,
      contents: [contents]
    }
    submitAutoReplay(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！'
      });
    })
  }

}
</script>

<style lang="scss" scoped>
.focus {
  .key-word-info {
    font-size: 14px;
    color: #333333;
  }
  .received-msg-content {
    border-top: 1px solid #dddddd;
    .msg-content {
      width: calc(100% - 30px);
      margin: 15px auto;
      border: solid 1px #e4e7ed;
      > header {
        height: 48px;
        background-color: #fafafa;
        .graphic-select {
          max-width: 500px;
          min-width: 400px;
        }
      }
      > section {
        min-height: 250px;

        .news-box-content {
          width: 236px;
          border: solid 1px #eeeeee;
          cursor: pointer;
          margin: 15px 0;
          .first-item {
            width: 100%;
            font-size: 0;
            > img {
              width: 230px;
              display: block;
              margin: 2px auto;
            }
            > p {
              font-size: 14px;
              padding: 0 2px;
              line-height: 36px;
            }
          }
          .no-first-item {
            width: calc(100% - 4px);
            margin: 2px auto;
            height: 54px;
            display: flex;
            align-items: center;
            font-size: 0;
            > span {
              font-size: 12px;
              color: #333333;
              flex-grow: 1;
              line-height: 20px;
              overflow: hidden;
            }
            > img {
              width: 40px;
              height: 40px;
            }
          }
        }
        .image-box-content {
          width: 236px;
          border: solid 1px #eeeeee;
          cursor: pointer;
          font-size: 0;
          margin: 15px 0;
          padding-top: 2px;
          text-align: center;
          > img {
            width: calc(100% - 4px);
          }
        }
        .voice-box-content {
          cursor: pointer;
          font-size: 14px;
          padding: 15px 2px;
          border: solid 1px #eeeeee;
          margin: 15px 0;
        }

        .no-graphic {
          display: flex;
          height: 260px;
          align-items: center;
          justify-content: center;
          > div {
            cursor: pointer;
            text-align: center;
            i {
              font-size: 34px;
              color: #999999;
            }
            p {
              font-size: 14px;
              color: #999999;
            }
          }
        }
      }
    }
  }
  .poup-box-header {
    font-size: 14px;
    > span {
      font-size: 12px;
      padding-left: 8px;
      color: #999999;
    }
  }
  .poup-box-body {
    height: 500px;
    position: relative;
    .news-box-content {
      height: 460px;
      overflow: auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: max-content;
      grid-gap: 10px;
      .media-item {
        > .item {
          border: solid 1px #eeeeee;
          cursor: pointer;
          box-sizing: border-box;
          > div {
            > div:first-child {
              width: calc(100% - 4px);
              margin: 2px auto;
              font-size: 0;
              img {
                width: 100%;
              }
              p {
                font-size: 14px;
                color: #333333;
                padding: 8px;
              }
            }
            > .item-tot {
              width: calc(100% - 4px);
              margin: 2px auto;
              height: 54px;
              display: flex;
              align-items: center;
              font-size: 0;
              border-top: 1px solid #dddddd;
              > .span {
                font-size: 12px;
                color: #333333;
                padding: 8px;
                flex-grow: 1;
                overflow: hidden;
              }
              > .img {
                width: 40px;
                height: 40px;
              }
            }
          }
        }
        > .item:hover {
          border: 1px solid #409eff;
        }
        > .selected-item {
          border: 1px solid #409eff;
        }
      }
    }
    .img-box-content {
      height: 460px;
      overflow: auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: max-content;
      grid-gap: 10px;
      > .media-item {
        border: solid 1px #eeeeee;
        cursor: pointer;
        box-sizing: border-box;
        padding: 2px;
        > img {
          width: 100%;
        }
      }
      > .media-item:hover {
        border: 1px solid #409eff;
      }
      > .selected-item {
        border: 1px solid #409eff;
      }
    }
    .voice-box-content {
      > .media-item {
        border-bottom: 1px solid #dddddd;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        color: #999999;
        .name {
          width: 420px;
        }
      }
    }
    .video-box-content {
      height: 460px;
      overflow: auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: max-content;
      grid-gap: 10px;
      > .media-item {
        border: solid 1px #eeeeee;
        cursor: pointer;
        box-sizing: border-box;
        padding: 2px;
        font-size: 14px;
      }
      > .media-item:hover {
        border: 1px solid #409eff;
      }
      > .selected-item {
        border: 1px solid #409eff;
      }
    }
    .page-box {
      position: absolute;
      bottom: 0;
      right: 10px;
    }
  }
}
</style>
