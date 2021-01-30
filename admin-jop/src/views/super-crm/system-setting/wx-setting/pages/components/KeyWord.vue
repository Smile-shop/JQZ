<template>
  <div class="key-word">
    <div v-if="editKeyWordShow">
      <el-button type="primary" @click="editKeyWordShow = false" icon="el-icon-plus">新建关键词</el-button>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;border:1px solid #ebeef5">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="table-expand-item">
              <div class="title">关键词</div>
              <div>
                {{computedKeyWord(props.row)}}
              </div>
            </div>
            <div class="table-expand-item">
              <div class="title">回复内容</div>
              <div class="content">
                <div class="replay-content">
                  <div class="replay-item" v-for="(item, index) in props.row.contents" :key="index">
                    <div v-if="item.msgType === '2'">
                      <div class="news-box-content" v-for="(media, mediaIndex) in JSON.parse(item.wxContents).news_item" :key="mediaIndex">
                        <div class="first-item" v-if="mediaIndex === 0">
                          <img :src="media.thumb_url" alt="graphic-logo">
                          <p>{{ media.title }}</p>
                        </div>
                        <div class="no-first-item" v-else>
                          <span>{{ media.title }}</span>
                          <img :src="media.thumb_url" alt="graphic-logo">
                        </div>
                      </div>
                    </div>
                    <div v-if="item.msgType === '1'">
                      <div v-html="item.content"></div>
                    </div>
                    <div v-if="item.msgType === '3'">
                      <div class="image-box-content">
                        <img :src="JSON.parse(item.wxContents).url" alt="graphic-logo">
                      </div>
                    </div>
                    <div v-if="item.msgType === '5'">
                      <div class="voice-box-content">
                        {{JSON.parse(item.wxContents).name}}
                      </div>
                    </div>
                    <div v-if="item.msgType === '4'">
                      <div class="voice-box-content">
                        {{JSON.parse(item.wxContents).name}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="规则名称"
          prop="title">
        </el-table-column>
        <el-table-column
          label="关键词"
          prop="name">
          <template slot-scope="scope">
            <div>{{scope.row.keyword}}{{scope.row.keyword && scope.row.keywordHalf ? ',' : ''}}{{scope.row.keywordHalf}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="回复内容"
          prop="desc">
          <template slot-scope="scope">
            <div>{{computedReplayContent(scope.row)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="140"
          prop="desc">
          <template slot-scope="scope">
            <el-row>
              <!-- <el-col :span="8"><el-link type="primary" :underline="false">详情</el-link></el-col> -->
              <el-col :span="12"><el-link type="primary" @click="editAutoItem(scope.row)" :underline="false">编辑</el-link></el-col>
              <el-col :span="12"><el-link type="danger" @click="removeAutoItem(scope.row)" :underline="false">删除</el-link></el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="edit-content" v-else>
      <el-form
        class="edit-form"
        label-position="right"
        ref="form"
        :model="form"
        label-width="100px">
        <el-form-item label="规则名称：">
          <el-input style="width: calc(100% - 150px)" :maxlength="60" placeholder="输入规则名称" v-model="form.name"></el-input>
          <p class="edit-form-info">规则名最多60个字</p>
        </el-form-item>
        <el-form-item label="关键词：">
          <div class="keyword-item" v-for="(item, index) in keywordList" :key="index">
            <el-input style="width: calc(100% - 150px)" :maxlength="30" placeholder="输入关键词" v-model="item.keyword">
              <el-select style="width:100px" v-model="item.match" slot="prepend" placeholder="请选择">
                <el-option label="全匹配" value="1"></el-option>
                <el-option label="半匹配" value="2"></el-option>
              </el-select>
            </el-input>
            <el-button
              @click="addKeywordItem"
              v-if="keywordList.length > 0 && (keywordList.length === index + 1) && keywordList.length < 9"
              style="margin-left:12px"
              icon="el-icon-plus"
              circle></el-button>
            <el-button
              @click="removeKeywordItem(index)"
              v-if="keywordList.length > 1"
              style="margin-left:12px"
              icon="el-icon-minus"
              circle></el-button>
          </div>
        </el-form-item>
        <el-form-item label="回复内容：">
          <div class="replay-content">
            <div class="replay-item" v-for="(item, index) in replayContentList" :key="index">

              <Popover>
                <div slot="show-content" v-if="item.msgType === '2'">
                  <div class="news-box-content" v-for="(item, index) in item.wxContents.news_item" :key="item.thumb_media_id">
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
                <div slot="show-content" v-if="item.msgType === '1'">
                  <div v-html="item.content"></div>
                </div>
                <div slot="show-content" v-if="item.msgType === '3'">
                  <div class="image-box-content">
                    <img :src="item.wxContents.url" alt="graphic-logo">
                  </div>
                </div>
                <div slot="show-content" v-if="item.msgType === '5'">
                  <div class="voice-box-content">
                    {{item.wxContents.name}}
                  </div>
                </div>
                <div slot="show-content" v-if="item.msgType === '4'">
                  <div class="voice-box-content">
                    {{item.wxContents.name}}
                  </div>
                </div>
                <div slot="reference">
                  <!-- <el-button v-if="item.msgType === '1'" icon="el-icon-edit" circle></el-button> -->
                  <el-button @click="removeReplayContent(item, index)" icon="el-icon-delete" circle></el-button>
                </div>
              </Popover>

            </div>
          </div>
          <Popover>
            <div slot="show-content" style="height:50px">
              <el-button slot="reference" icon="el-icon-plus" circle></el-button>
            </div>
            <div slot="reference" style="width:522px;border:1px solid #dddddd">
              <Graphic v-model="msgType" @input="selectGraphicInit"></Graphic>
            </div>
          </Popover>
        </el-form-item>
        <el-form-item label="回复方式：">
          <el-radio-group v-model="form.replyType">
            <el-radio label="0">回复全部</el-radio>
            <el-radio label="1">随机回复一条</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="okCreate">保存</el-button>
          <el-button @click="cancelCreate">取消</el-button>
        </el-form-item>
      </el-form>

    </div>

    <PoupBox
      width="980"
      @cancel="graphicShow = false"
      v-model="graphicShow">
      <div slot="header" class="poup-box-header">
        {{computedGraphicName}}<span>( 素材来源于微信素材管理中心，如需要添加素材请前往微信公众平台素材管理 )</span>
      </div>
      <div slot="body" class="poup-box-body">
        <div class="news-box-content" v-if="menuContent === 'news'">
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

        <div class="text-box-content" v-if="menuContent === 'text'">
          <WangEditor ref="ue" type="word" :contents="replayTextContent"></WangEditor>
        </div>

        <div class="img-box-content" v-if="menuContent === 'image'">
          <div class="media-item"
             @click="selectedGraphicItem = mediaItem"
             :class="{'selected-item': selectedGraphicItem && (selectedGraphicItem.media_id === mediaItem.media_id)}"
            v-for="mediaItem in graphicList"
            :key="mediaItem.media_id">
            <img :src="mediaItem.url" alt="graphic">
          </div>
        </div>

        <div class="voice-box-content" v-if="menuContent === 'voice'">
          <div class="media-item" v-for="mediaItem in graphicList" :key="mediaItem.media_id">
            <el-radio class="name" v-model="selectedGraphicItem" :label="mediaItem">{{mediaItem.name}}</el-radio>
            <span>{{mediaItem.update_time*1000 | momentFilter('YYYY-MM-DD')}}</span>
          </div>
        </div>

        <div class="video-box-content" v-if="menuContent === 'video'">
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
import { getWxAutoReplyInfo, getGraphic, removeReplayContent, submitAutoReplay } from '@/api/super-crm/wx-params-set';
import PoupBox from '@/components/PoupBox.vue';
import WangEditor from '@/components/WangEditor.vue';
import Graphic from './Graphic.vue';
import Popover from '@/components/Popover.vue';
import { getCNString, getENString } from '@/utils/nameExchange';

@Component({
  components: {
    PoupBox,
    WangEditor,
    Graphic,
    Popover
  }
})
export default class KeyWord extends Vue {
  @Prop({ default: '1' })
  replyState!: string;

  private tableData = [];
  private editKeyWordShow: boolean = true;
  private form = {
    name: '',
    replyType: '1'
  };
  private keywordList = [
    {
      keyword: '',
      match: '1'
    }
  ];
  private msgType: string = '';

  private pageSize: number = 12;
  private currentPage: number = 1;
  private pageTotal: number = 0;

  private menuContent: string = 'news';
  private selectedGraphicItem: any = null;
  private graphicList = [];
  private graphicShow: boolean = false;
  private replayTextContent: string = '';
  private replayContentList = [];

  get computedGraphicName() {
    return getCNString(this.menuContent);
  }

  private mounted() {
    this.getWxAutoReplyInfo();
  }

  private computedKeyWord(item: any) {
    return `${item.keyword ? `${item.keyword}(全匹配)` : ''} - ${item.keywordHalf ? `${item.keywordHalf}(半匹配)` : ''}`
  }

  private computedReplayContent(item: any) {
    return item.contents.map((p: any, i: number) => {
      return `${i + 1} ${getCNString(p.msgType)}`;
    }).join(', ');
  }

  private getWxAutoReplyInfo() {
    const params = {
      keyState: 'keyMsg'
    }
    getWxAutoReplyInfo(params).then((res: any) => {
      this.tableData = res.data || [];
    })
  }

  private addKeywordItem() {
    this.keywordList.push({
      keyword: '',
      match: '1'
    })
  }

  private computedKeywordList(item: string, match: string) {
    if (!item) {
      return [];
    };
    return item.split(',').map((p: any) => {
      return {
        keyword: p,
        match
      };
    })
  }

  private editAutoItem(item: any) {
    this.editKeyWordShow = false;
    this.form = {
      name: item.title,
      replyType: item.replyType
    };
    this.keywordList = [...this.computedKeywordList(item.keyword, '1'), ...this.computedKeywordList(item.keywordHalf, '2')];
    // this.replyState = item.replyState;
    // this.$emit('replayStateChange', item.replyState);
    this.replayContentList = item.contents.map((p: any) => {
      return {
        content: p.content,
        msgType: p.msgType,
        replyId: p.replyId,
        wxContents: p.wxContents ? JSON.parse(p.wxContents) : ''
      }
    });
  }

  private removeKeywordItem(index: number) {
    this.keywordList.splice(index, 1);
  }

  private selectGraphicInit(type: string) {
    this.menuContent = type;
    if (type === 'text') {
      this.graphicShow = true;
    } else {
      this.selectGraphic();
    }
  }

  // 选择素材
  private selectGraphic() {
    const params = {
      type: this.menuContent,
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
    if (this.menuContent === 'text' && (this.$refs.ue as any).getContentText().length <= 0) {
      this.$message({
        type: 'warning',
        message: '回复文字不能为空!'
      });
      return;
    }
    if (this.menuContent !== 'text' && !this.selectedGraphicItem) {
      this.$message({
        type: 'warning',
        message: '请选择素材!'
      });
      return;
    }
    const wxContents = this.computedGraphicContent(this.menuContent, this.selectedGraphicItem, true);
    const content = this.computedGraphicContent(this.menuContent, this.selectedGraphicItem, false);
    const replayContent = {
      msgType: getENString(this.menuContent),
      replyId: '',
      wxContents,
      content
    };
    (this.replayContentList as any).push(replayContent);
    this.selectGraphicCancel();
  }
  private computedGraphicContent(type: string, item: any, wxType: boolean) {
    if (type === 'text') {
      return wxType ? '' : (this.$refs.ue as any).getContent().replace(/target="_blank"/g, '');
    } else if (type === 'news') {
      return {
        media_id: item.media_id,
        ...item.content
      };
    } else {
      return wxType ? item : item.media_id;
    }
  }
  // 取消选中素材
  private selectGraphicCancel() {
    this.graphicShow = false;
    this.selectedGraphicItem = null;
    this.msgType = '';
  }
  // 删除选择的素材
  private removeReplayContent(item: any, index: number) {
    if (item.replyId) {
      removeReplayContent({replyIds: [item.replyId]}).then((res: any) => {
        this.replayContentList.splice(index, 1);
      })
    } else {
      this.replayContentList.splice(index, 1);
    }
  }
  // 删除自动回复
  private removeAutoItem(item: any) {
    this.$confirm('是否确定删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const replyIdList = item.contents.map((p: any) => p.replyId);
      removeReplayContent({replyIds: replyIdList}).then((res: any) => {
        this.getWxAutoReplyInfo();
      })
    }).catch(err => {
      console.log(err);
    });
  }
  private okCreate() {
    if (this.form.name === '') {
      this.$message({
        type: 'warning',
        message: '请填写规则名称!'
      });
      return;
    }
    const keyList = this.keywordList.map((p: any) => p.keyword);
    if (keyList.includes('')) {
      this.$message({
        type: 'warning',
        message: '请填写关键词!'
      });
      return;
    }
    if (this.replayContentList.length <= 0) {
      this.$message({
        type: 'warning',
        message: '回复内容不能为空!'
      });
      return;
    }
    const keyword = this.keywordList.filter((p: any) => p.match === '1').map((p: any) => p.keyword).join(',');
    const keywordHalf = this.keywordList.filter((p: any) => p.match === '2').map((p: any) => p.keyword).join(',');
    const params = {
      replyType: this.form.replyType,
      keywordHalf,
      title: this.form.name,
      keyword,
      contents: this.replayContentList
    }
    return submitAutoReplay(params).then((res: any) => {
      this.cancelCreate();
      this.$message({
        type: 'success',
        message: '保存成功！'
      });
    })
  }

  private cancelCreate() {
    this.editKeyWordShow = true;
    this.keywordList = [{
      keyword: '',
      match: '1'
    }];
    this.replayContentList = [];
    this.form = {
      name: '',
      replyType: '1'
    }
    this.getWxAutoReplyInfo();
  }
}
</script>

<style lang="scss" scoped>
.key-word {
  .key-word-info {
    font-size: 14px;
    color: #333333;
  }
  .table-expand-item {
    display: flex;
    font-size: 14px;
    .title {
      color: #999999;
      width: 80px;
      flex-shrink: 0;
    }
    .content {
      flex-grow: 1;
    }
  }
  .table-expand-item:first-child {
    margin-bottom: 20px;
  }
  .replay-content {
    width: calc(100% - 150px);
    margin-bottom: 20px;
    > .replay-item {
      padding: 18px 0;
      border-bottom: 1px solid #dddddd;
      .news-box-content {
        width: 236px;
        border: solid 1px #eeeeee;
        cursor: pointer;
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
        padding-top: 2px;
        text-align: center;
        > img {
          width: calc(100% - 4px);
        }
      }
      .voice-box-content {
        cursor: pointer;
        font-size: 14px;
        padding: 2px;
      }
    }
    > .replay-item:first-child {
      padding-top: 0;
    }
  }

  .edit-content {
    border-top: 1px solid #dddddd;
    .edit-form {
      margin-top: 20px;
      width: calc(100% - 30px);
      .edit-form-info {
        font-size: 12px;
      	color: #606266;
      }
      .keyword-item:not(:last-child) {
        margin-bottom: 20px;
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


