<template>
  <article class="menu-setting">
    <div class="info">
      <p>1.使用本模块，必须在微信公众平台申请自定义菜单使用的AppId和AppSecret。</p>
      <p>2.最多创建3 个一级菜单，每个一级菜单下最多可以创建 5 个二级菜单，菜单最多支持两层。</p>
      <p>3.URL格式请输入完整地址，例如：http://www.baidu.com。</p>
    </div>
    <section class="menu-set-content">
      <div class="phone-content">
        <div class="phone">
          <header>公众号</header>
          <div class="phone-show" v-if="menuOrderControl">
            <div class="msg-icon">
              <div><i class="iconfont icon-xiaoxi"></i></div>
            </div>
            <div class="boot-menu-item" v-for="(item, index) in menuList" :key="item.menuId">
              <div class="boot-menu" @click="editMenuItem(item)" :class="{'select-menu': selectedItem && (selectedItem.menuId === item.menuId)}">{{item.name}}</div>
              <div class="add-btn" @click="addChildMenu(index)" v-if="item.type === '0' && item.childList.length < 5">+</div>
              <div class="child-menu" @click="editMenuItem(child)" :class="{'select-menu': selectedItem && (selectedItem.menuId === child.menuId)}" v-for="child in item.childList" :key="child.menuId">{{child.name}}</div>
            </div>
            <div class="add-icon" v-if="menuList.length < 3"><div :class="{'is-last': menuList.length === 0}" @click="addBootMenu">+</div></div>
          </div>

          <div class="phone-show" v-else>
            <div class="msg-icon">
              <div><i class="iconfont icon-xiaoxi"></i></div>
            </div>
            <MenuDrop :list="showMenuList" @dropMenu="dropMenu"></MenuDrop>
          </div>
        </div>
        <el-button class="btn" v-if="menuOrderControl" @click="menuOrderControl = false" plain>菜单排序</el-button>
        <el-button class="btn" v-else @click="rankMenuOver" plain>完成排序</el-button>
      </div>
      <div class="menu-edit" v-if="menuOrderControl && (editMenuItemShow === 'new' || editMenuItemShow === 'edit')">
        <div class="edit">
          <div class="edit-header">
            <div>菜单名称</div>
            <div @click="removeMenu" v-if="editMenuItemShow === 'edit' && form.menuId !== -1">删除菜单</div>
          </div>
          <el-form class="form" ref="form" :model="form" label-width="80px">
            <p class="edit-menu-info" v-if="form.hasChild === '1'">已添加子菜单，仅可设置菜单名称。</p>
            <el-form-item label="菜单名称" class="form-item">
              <el-input style="width:300px" maxlength="8" v-model="form.name" placeholder="菜单名称"></el-input>
              <p class="form-info">仅支持中英文和数字，字数不超过4个汉字或8个字母</p>
            </el-form-item>
            <el-form-item label="菜单内容" class="form-item" v-if="form.hasChild === '0'">
              <el-radio-group v-model="form.type">
                <el-radio label="0" v-if="form.level === '1'">主菜单</el-radio>
                <el-radio label="3">发送消息</el-radio>
                <el-radio label="1">关键词回复</el-radio>
                <el-radio label="2">跳转网页</el-radio>
                <el-radio label="4">跳转小程序</el-radio>
              </el-radio-group>
              <div class="menu-content-select" v-if="form.type === '3'">
                <div class="header">
                  <div class="header-item" @click="menuContent = 'news', graphicList = []" :class="{'header-item-select': menuContent === 'news'}">
                    <i class="iconfont icon-article"></i>
                    图文消息
                  </div>
                  <div class="header-item" @click="menuContent = 'image', graphicList = []" :class="{'header-item-select': menuContent === 'image'}">
                    <i class="iconfont icon-image"></i>
                    图片
                  </div>
                  <div class="header-item" @click="menuContent = 'voice', graphicList = []" :class="{'header-item-select': menuContent === 'voice'}">
                    <i class="iconfont icon-yuyin"></i>
                    语音
                  </div>
                  <div class="header-item" @click="menuContent = 'video', graphicList = []" :class="{'header-item-select': menuContent === 'video'}">
                    <i class="iconfont icon-video"></i>
                    视频
                  </div>
                </div>
                <div class="selected-wx-graphic" v-if="selectedGraphicItemShow[menuContent]">
                  <Popover>
                    <div slot="show-content" v-if="menuContent === 'news'">
                      <div class="news-box-content" v-for="(item, index) in selectedGraphicItemShow[menuContent].news_item" :key="item.thumb_media_id">
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
                    <div slot="show-content" v-if="menuContent === 'image'">
                      <div class="image-box-content">
                        <img :src="selectedGraphicItemShow[menuContent].url" alt="graphic-logo">
                      </div>
                    </div>
                    <div slot="show-content" v-if="menuContent === 'voice'">
                      <div class="voice-box-content">
                        {{selectedGraphicItemShow[menuContent].name}}
                      </div>
                    </div>
                    <div slot="show-content" v-if="menuContent === 'video'">
                      <div class="voice-box-content">
                        {{selectedGraphicItemShow[menuContent].name}}
                      </div>
                    </div>
                    <div slot="reference">
                      <el-button @click="selectedGraphicItemShow[menuContent] = null" icon="el-icon-delete" circle></el-button>
                    </div>
                  </Popover>
                </div>
                <div class="select-wx-graphic" v-else>
                  <div @click="selectGraphic">
                    <i class="iconfont icon-sucaiku"></i>
                    <p>从素材库选择</p>
                  </div>
                </div>
              </div>
              <div class="menu-content-url" v-if="form.type === '2'">
                <span>页面地址</span>
                <el-input style="width: 300px;margin-right:10px" v-model="form.url" placeholder="http://www.jqzms.com"></el-input>
                <el-button type="primary" @click="getFunctionList">从功能库添加</el-button>
              </div>
              <div class="menu-content-pro" v-if="form.type === '4'">
                <el-tabs v-model="programeSelectActivement">
                  <el-tab-pane label="JOP小程序" name="self_programe">
                    <span class="title">小程序 : </span>
                    <el-select v-model="selfProgrameItem" @change="selectPrograme" placeholder="请选择">
                      <el-option
                        v-for="item in selfProgrameList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <div class="wx-programe-code">
                      <img ref="wx_code" alt="wc_code" :src="wxProgrameCodeUrl('jop').url" v-if="wxProgrameCodeUrl('jop').show">
                      <div class="code-info" v-if="wxProgrameCodeUrl('jop').show">
                        <span>微信扫一扫</span>
                        <el-link type="primary" :underline="false" @click="downloadWxCode(1)">下载二维码</el-link>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="第三方小程序" name="second_programe">
                    <div class="third-pro-info">*填写第三方小程序需公众号已关联该小程序</div>
                    <div class="third-pro-content">
                      <div class="wx-programe-code">
                        <img ref="wx_code" alt="wc_code" :src="wxProgrameCodeUrl().url">
                        <div class="code-info" v-if="wxProgrameCodeUrl().show">
                          <span>微信扫一扫</span>
                          <el-link type="primary" :underline="false" @click="downloadWxCode(0)">下载二维码</el-link>
                        </div>
                      </div>
                      <el-form class="third-pro-input-con" ref="third-pro-form" :model="thirdProForm" style="width:300px;margin-left:25px">
                        <el-form-item label="小程序APP ID：" size="mini" style="font-weight:bold">
                          <el-input size="medium " v-model="thirdProForm.appid" style="width:100%"></el-input>
                        </el-form-item>
                        <el-form-item label="小程序APP Secret：" size="mini" style="font-weight:bold">
                          <el-input size="medium " v-model="thirdProForm.secret" style="width:100%" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="页面路径 & 参数：" size="mini" style="font-weight:bold">
                          <el-input size="medium " v-model="thirdProForm.pagepath" style="width:100%"></el-input>
                        </el-form-item>
                        <el-form-item size="mini">
                          <el-button type="primary" size="medium" @click="selectPrograme(-1)">生成二维码</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="menu-content-url" v-if="form.type === '1'">
                <span>关键词</span>
                <el-input style="width: 300px;margin-right:10px" v-model="keyWordMsg" placeholder="请输入自动回复中设置的关键词"></el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <el-button class="btn" type="primary" @click="submitMenuEdit">保存</el-button>
        <el-button class="btn" type="danger" @click="uploadWxMenu">发布</el-button>
      </div>
      <div v-else class="no-menu-edit">
        <div></div>
        <el-button class="btn" type="danger" @click="uploadWxMenu">发布</el-button>
      </div>
    </section>

    <PoupBox
      width="700"
      title="功能库"
      @cancel="URLPoupCancel"
      @ok="URLPoupOk"
      v-model="URLShow">
      <div slot="body" class="function-poup-body">
        <el-tabs v-model="activeName">
          <el-tab-pane label="功能模块" name="1">
            <el-radio-group v-model="webUrl">
              <el-radio :disabled="isFreeMember === 1 ? checkRadio(item) : false" style="width:100px;line-height:32px" v-for="item in functionList" :key="item" :label="item">{{item}}</el-radio>
            </el-radio-group>
          </el-tab-pane>
          <el-tab-pane label="资讯文章" name="2">
            <div class="info-poup-body">
              <div class="poup-box-info-list">
                <el-row style="line-height:32px" v-for="item in infoList" :key="item.id">
                  <el-col :span="18">
                    <el-radio v-model="webUrl" :label="item.id">{{item.title}}</el-radio>
                  </el-col>
                  <!-- <el-col :span="6" style="text-align: right;font-size:12px;color:#999999;padding-right:8px">{{item.modifyTime.split(' ')[0]}}</el-col> -->
                  <el-col :span="6" style="text-align: right;font-size:12px;color:#999999;padding-right:8px">{{item.modifyTime | momentFilter('YYYY-MM-DD')}}</el-col>
                </el-row>
              </div>
              <el-pagination
                class="function-page-box"
                background
                layout="total, prev, pager, next, jumper"
                :page-sizes="[10, 50, 100, 200, 500]"
                :page-size.sync="pageSizeInfo"
                @size-change="getFunctionList"
                @current-change="getFunctionList"
                :current-page.sync="currentPageInfo"
                :total="pageTotalInfo">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </PoupBox>

    <PoupBox
      width="980"
      @cancel="graphicShow = false"
      v-model="graphicShow">
      <div slot="header" class="poup-box-header">
        选择{{computedGraphicName}}<span>( 素材来源于微信素材管理中心，如需要添加素材请前往微信公众平台素材管理 )</span>
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
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getWxMenu, createWxMenu, updateWxMenu, removeMenu, getGraphic, getFunction, uploadWxMenu, sortMenuMethods, getProgrameList, getProgrameCode } from '@/api/super-crm/wx-params-set';
import PoupBox from '@/components/PoupBox.vue';
import user from '@/utils/user';
import { computedWebUrl } from '@/utils/wxMemberPageUrl';
import MenuDrop from './components/MenuDrop.vue';
import Popover from '@/components/Popover.vue';
import axios from 'axios';

@Component({
  components: {
    PoupBox,
    MenuDrop,
    Popover
  }
})
export default class MenuSetting extends Vue {
  private isFreeMember = null; // 是否免费身份标识 1免费会员 0正常收费会员
  private form = {
    hasChild: '0',
    name: '',
    type: '0',
    level: '1',
    sort: -1,
    menuId: -10,
    parentId: -1,
    url: ''
  };
  private menuContent: string = 'news';
  private menuOrderControl: boolean = true;
  private menuList = [];
  private selectedItem: any = null;
  private editMenuItemShow: string = '';

  private programeSelectActivement: string = 'self_programe';
  private selfProgrameItem: string = '';
  private selfProgrameList = [];

  private pageSize: number = 12;
  private currentPage: number = 1;
  private pageTotal: number = 0;

  private selectedGraphicItem: any = null;
  private selectedGraphicItemShow: any = {
    news: '',
    image: '',
    voice: '',
    video: ''
  };
  private graphicList = [];
  private graphicShow: boolean = false;

  private URLShow: boolean = false;
  private activeName: string = '1';
  private webUrl: string = '';
  private functionList = [];
  private infoList = [];
  private pageSizeInfo: number = 10;
  private currentPageInfo: number = 1;
  private pageTotalInfo: number = 0;

  private sortMenuOverList = [];

  private wxProgrameCode: any = null;
  private thirdWxProgrameCode: any = null;
  private thirdProForm = {
    appid: '',
    pagepath: '',
    secret: '',
    url: `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}`
  };

  // 关键词
  private keyWordMsg: string = '';

  // 免费会员
  private checkRadio(item: any) {
    if (item === '今日金价' || item === '我的礼品' || item === '开心小游戏' || item === '微好礼' || item === '在线预约' || item === '优惠券' || item === '微商城') {
      return true
    }
  }

  get computedGraphicName() {
    const mapList = {
      news: '图文消息',
      image: '图片',
      voice: '音频',
      video: '视频'
    }
    return (mapList as any)[this.menuContent];
  }

  get showMenuList() {
    // 展示子菜单倒排序
    const list = this.menuList.map((p: any) => {
      const childList = p.childList.slice();
      return {
        childList1: childList.sort((a: any, b: any) => a.sort - b.sort),
        ...p
      }
    })
    return list;
  }

  private mounted() {
    this.getWxMenu();
    this.getProgrameList();
    this.isFreeMember = user.serverUser.isFreeMember;
  }
  // 小程序列表获取
  private getProgrameList() {
    getProgrameList().then((res: any) => {
      this.selfProgrameList = res.data || []
    }).catch(err => {
      this.selfProgrameList = [];
    })
  }
  // 生成二维码图片
  private wxProgrameCodeUrl(type: string) {
    const urlBlob = type === 'jop' ? this.wxProgrameCode : this.thirdWxProgrameCode;
    let url = '';
    let show = false;
    try {
      url = URL.createObjectURL(urlBlob);
      show = true;
    } catch (error) {
      url = type === 'jop' ? '' : require('../../../../../assets/images/super-crm/wx-member/no-ewm.png');
      show = false;
    }
    return {
      url,
      show
    }
  }
  // 选择小程序获取二维码
  private selectPrograme(val: number) {
    const selfProgrameItem = val >= 0 ? this.selfProgrameList.find((item: any) => item.id === val) : this.thirdProForm;
    if (val < 0 && (!(selfProgrameItem as any).appid)) {
      this.$message({
        type: 'info',
        message: '请输入小程序APPID!'
      });
      return;
    }
    if (val < 0 && (!(selfProgrameItem as any).secret)) {
      this.$message({
        type: 'info',
        message: '请输入小程序APP Secret!'
      });
      return;
    }
    if (val < 0 && (!(selfProgrameItem as any).pagepath)) {
      this.$message({
        type: 'info',
        message: '请输入页面路经 & 参数!'
      });
      return;
    }
    // const selfProgrameItem = this.selfProgrameList.find((item: any) => item.id === val);
    if (selfProgrameItem) {
      const params = {
        appid: (selfProgrameItem as any).appid,
        pagepath: (selfProgrameItem as any).pagepath,
        secret: (selfProgrameItem as any).secret
      }
      getProgrameCode(params).then((res: any) => {
        const response: any = res;
        if ((response as any).type === 'application/json') {
          const r = new FileReader();
          r.onload = (result) => {
            const readResult = (result as any).target.result;
            const resData = JSON.parse(readResult);
            if (resData !== 0) {
              this.$message({
                message: resData.msg,
                type: 'error'
              })
            }
          }
          r.readAsText(response);
        } else {
          if (response.size > 0) {
            if (val >= 0) {
              this.wxProgrameCode = response;
            } else {
              this.thirdWxProgrameCode = response;
            }
          } else {
            this.$message({
              message: '生成二维码失败!',
              type: 'error'
            })
          }
        }
      })
    }
  }
  // 下载二维码
  private downloadWxCode(type: number) {
    const codeBlob = type ? this.wxProgrameCode : this.thirdWxProgrameCode;
    const blob = new Blob([codeBlob], {type: 'application/octet-binary'});
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    if (typeof a.download === 'undefined') {
      (window as any).location = objectUrl;
    } else {
      a.href = objectUrl;
      a.download = 'wx_code.jpg';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }
  // 菜单顺序
  private dropMenu(data: any) {
    this.sortMenuOverList = data;
  }
  // 结束排序
  private rankMenuOver() {
    const list: any[] = [];
    this.sortMenuOverList.forEach((p: any, index: number) => {
      list.push({
        menuId: p.menuId,
        sort: index + 1
      });
      p.childList1.forEach((item: any, i: number) => {
        list.push({
          menuId: item.menuId,
          sort: 1 + i
        });
      })
    })
    sortMenuMethods(list).then((res: any) => {
      this.getWxMenu();
      this.menuOrderControl = true;
      this.$message({
        type: 'success',
        message: '排序成功!'
      });
    })
  }
  // 获取所有菜单
  private getWxMenu() {
    getWxMenu().then((res: any) => {
      const menu = res.data || [];
      const mainMenu = menu.filter((p: any) => p.level === '1');
      this.menuList = mainMenu.map((item: any) => {
        const childList = menu.filter((p: any) => p.level === '2' && item.menuId === p.parentId).sort((a: any, b: any) => b.sort - a.sort);
        // console.log(childList)
        return {
          childList,
          ...item
        }
      }).sort((a: any, b: any) => a.sort - b.sort);
      (this.sortMenuOverList as any) = this.showMenuList;
    })
  }
  // 清空输入框
  private initForm(sort: number, level: string, name?: string, type?: string, menuId?: number, parentId?: number, hasChild?: string, url?: string) {
    this.form = {
      menuId: menuId || -1,
      name: name || '',
      type: type || '3',
      level,
      sort,
      hasChild: hasChild || '0',
      parentId: parentId || -1,
      url: url || ''
    }
  }
  // 新增主菜单
  private addBootMenu() {
    const sort = this.menuList.length > 0 ? (this.menuList[this.menuList.length - 1] as any).sort + 1 : 1;
    const bootItem = {
      menuId: -1,
      name: '菜单名称',
      sort,
      type: ''
    };
    (this.menuList as any).push(bootItem);
    this.selectedItem = bootItem;
    this.initForm(this.menuList.length, '1', '菜单名称', '', -1);
    this.editMenuItemShow = 'new';
  }
  // 新增子菜单
  private addChildMenu(index: number) {
    const sort = (this.menuList[index] as any).childList.length > 0 ? (this.menuList[index] as any).childList[0].sort + 1 : 1;
    const childItem = {
      menuId: -1,
      name: '菜单名称',
      sort,
      type: '',
      level: '2'
    };
    (this.menuList[index] as any).childList.unshift(childItem);
    this.selectedItem = childItem;
    this.initForm(this.menuList.length, '2', '菜单名称', '', -1, (this.menuList[index] as any).menuId);
    this.editMenuItemShow = 'new';
  }
  // 菜单编辑
  private editMenuItem(item: any) {
    // 确定菜单内容的类型
    try {
      const url = JSON.parse(item.url);
      if (item.type === '4') {
        if (url.id) {
          this.programeSelectActivement = 'self_programe';
          this.selfProgrameItem = url.id;
          this.selectPrograme(url.id);
        } else {
          this.programeSelectActivement = 'second_programe';
          this.thirdProForm = url;
          this.selectPrograme(-1);
        }
      } else if (item.type === '1') {
        this.keyWordMsg = item.url;
      } else {
        this.menuContent = url.thirdState;
        this.selectedGraphicItemShow[this.menuContent] = url;
      }
    } catch {
      if (item.type === '1') {
        this.keyWordMsg = item.url;
      } else {
        this.menuContent = 'news';
      }
    }
    this.selectedItem = item;
    const hasChild = item.childList && item.childList.length > 0 ? '1' : '0';
    this.initForm(item.sort, item.level, item.name, item.type, item.menuId, item.parentId, hasChild, item.url);
    this.editMenuItemShow = 'edit';
  }
  // 保存
  private submitMenuEdit() {
    if (this.form.name === '' || this.form.name === '菜单名称') {
      this.$message({
        type: 'warning',
        message: '请填写菜单名称!'
      });
      return;
    }
    if (this.form.type === '4') {
      let programeData: any = ''
      if (this.programeSelectActivement === 'self_programe') {
        programeData = this.selfProgrameList.find((item: any) => item.id === this.selfProgrameItem);
      }
      if (this.programeSelectActivement === 'second_programe') {
        programeData = this.thirdProForm;
      }
      this.form.url = JSON.stringify(programeData);
    }
    if (this.form.type === '1') {
      this.form.url = this.keyWordMsg;
    }
    if (this.form.type !== '0' && this.form.url === '') {
      this.$message({
        type: 'warning',
        message: '请输入菜单内容!'
      });
      return;
    }
    if (this.form.menuId === -1) {
      const params = {
        name: this.form.name,
        type: this.form.type,
        level: this.form.level,
        sort: this.form.sort,
        parentId: this.form.parentId,
        url: this.form.url
      }
      createWxMenu(params).then((res: any) => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        });
        this.selectedItem = null;
        this.editMenuItemShow = '';
        this.getWxMenu();
      })
    } else {
      const params = {
        name: this.form.name,
        type: this.form.type,
        level: this.form.level,
        sort: this.form.sort,
        parentId: this.form.parentId,
        url: this.form.url,
        menuId: this.form.menuId
      }
      updateWxMenu(params).then((res: any) => {
        this.$message({
          type: 'success',
          message: '更新成功!'
        });
        this.selectedItem = null;
        this.editMenuItemShow = '';
        this.getWxMenu();
        this.selectedGraphicItemShow = {
          news: '',
          image: '',
          voice: '',
          video: ''
        };
      })
    }
  }
  // 删除菜单
  private removeMenu() {
    const title = this.form.hasChild === '1' ? `删除后"${this.form.name}"菜单下的设置内容将被删除？` : `确定删除"${this.form.name}"菜单？`;
    this.$confirm(title, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      removeMenu({menuId: this.form.menuId}).then((res: any) => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.selectedItem = null;
        this.selectedGraphicItemShow = {
          news: '',
          image: '',
          voice: '',
          video: ''
        };
        this.editMenuItemShow = '';
        this.getWxMenu();
      })
    }).catch(err => {
      console.log(err);
    });
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
    if (!this.selectedGraphicItem) {
      this.$message({
        type: 'info',
        message: `请选择${this.computedGraphicName}`
      });
      return;
    }
    if (this.menuContent === 'news') {
      const url = {
        thirdState: this.menuContent,
        media_id: this.selectedGraphicItem.media_id,
        news_item: this.selectedGraphicItem.content.news_item
      }
      this.selectedGraphicItemShow.news = url;
      this.form.url = JSON.stringify(url);
    } else {
      Object.defineProperty(this.selectedGraphicItem, 'thirdState', {
        value: this.menuContent,
        enumerable: true
      })
      this.selectedGraphicItemShow[this.menuContent] = this.selectedGraphicItem;
      this.form.url = JSON.stringify(this.selectedGraphicItem);
    }
    this.graphicShow = false;
    this.selectedGraphicItem = null;
  }
  // 取消选中素材
  private selectGraphicCancel() {
    this.graphicShow = false;
    this.selectedGraphicItem = null;
    this.selectedGraphicItemShow = {
      news: '',
      image: '',
      voice: '',
      video: ''
    };
  }
  // 选择功能
  private getFunctionList() {
    const params = {
      title: '',
      pageSize: this.pageSizeInfo,
      pageNum: this.currentPageInfo
    }
    getFunction(params).then((res: any) => {
      this.functionList = res.data.functionList || [];
      this.infoList = res.data.companyNews.list || [];
      this.pageTotalInfo = res.data.companyNews.page.total || 0;
      this.URLShow = true;
    })
  }
  // 确定选中路径
  private URLPoupOk() {
    if (typeof(this.webUrl) === 'number') {
      this.form.url = `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}&page=wx_member&childPage=consult-details/${this.webUrl}`;
    };
    if (typeof(this.webUrl) === 'string') {
      this.form.url = computedWebUrl(this.webUrl);
    };
    this.URLPoupCancel();
  }
  // 取消选中路径
  private URLPoupCancel() {
    this.URLShow = false;
  }
  // 上传微信
  private uploadWxMenu() {
    uploadWxMenu().then((res: any) => {
      this.$message({
        type: 'success',
        message: '创建成功！'
      });
    })
  }
}
</script>

<style lang="scss" scoped>
.menu-setting {
  .info {
    height: 100px;
    background-color: #f5faff;
    border: solid 1px #409eff;
    border-radius: 5px;
    padding: 12px;
    font-size: 14px;
    color: #333333;
    p {
      line-height: 24px;
    }
  }
  .menu-set-content {
    display: flex;
    .phone-content {
      width: 332px;
      margin-top: 24px;
      text-align: center;
      .phone {
        width: 320px;
        height: 600px;
        border: 1px solid #dddddd;
        header {
          height: 44px;
          line-height: 44px;
          text-align: center;
          font-size: 14px;
          color: #ffffff;
          background-color: black;
        }
        > .phone-show {
          height: 556px;
          display: flex;
          > .msg-icon {
            width: 52px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column-reverse;
            div {
              box-sizing: border-box;
              height: 42px;
              line-height: 42px;
              border-top: 1px solid #dddddd;
              border-right: 1px solid #dddddd;
              i {
                font-size: 20px;
              }
            }
          }
          > .boot-menu-item {
            flex-basis: 20%;
            flex-grow: 1;
            display: flex;
            flex-direction: column-reverse;
            > .boot-menu {
              box-sizing: border-box;
              height: 42px;
              line-height: 40px;
              border-top: 1px solid #dddddd;
              border-right: 1px solid #dddddd;
              font-size: 14px;
              // font-weight: bold
              cursor: pointer;
            }
            > .add-btn {
              margin: 0 auto;
              width: 96%;
              height: 42px;
              line-height: 35px;
              border: 1px solid #dddddd;
              // border-top: 0;
              box-sizing: border-box;
              font-size: 24px;
              margin-bottom: 12px;
              margin-top: 2px;
              cursor: pointer;
            }
            > .child-menu {
              margin: 0 auto;
              width: 96%;
              height: 42px;
              line-height: 40px;
              border-left: 1px solid #dddddd;
              border-right: 1px solid #dddddd;
              border-bottom: 1px solid #dddddd;
              box-sizing: border-box;
              font-size: 14px;
              cursor: pointer;
            }
            > .child-menu:last-child {
              border-top: 1px solid #dddddd;
            }
            > .boot-menu:hover, .add-btn:hover, .child-menu:hover {
              border: 1px solid #409EFF;
              color: #409EFF;
            }
            > .select-menu {
              border: 1px solid #409EFF !important;
            }
          }
          > .add-icon {
            flex-basis: 25%;
            display: flex;
            flex-direction: column-reverse;
            div {
              box-sizing: border-box;
              height: 42px;
              line-height: 35px;
              border-top: 1px solid #dddddd;
              font-size: 24px;
              cursor: pointer;
            }
            .is-last {
              border-right: 1px solid #dddddd;
            }
            div:hover {
              border: 1px solid #409EFF;
              color: #409EFF;
            }
          }
        }
      }
      .btn {
        margin-top: 24px;
      }
    }
    .menu-edit {
      flex-grow: 1;
      margin-top: 24px;
      .edit {
        height: 600px;
        background-color: #f5f5f5;
        .edit-header {
          height: 43px;
          display: flex;
          align-items: center;
          font-size: 14px;
          border-bottom: 1px solid #dddddd;
          div:first-child {
            flex-grow: 1;
            padding: 0 18px;
          }
          div:last-child {
            padding: 0 18px;
            color: #409eff;
            cursor: pointer;
          }
        }
        .form {
          margin: 14px;
          .edit-menu-info {
            font-size: 12px;
            color: #409eff;
            padding: 12px;
          }
          .form-item {
            margin-bottom: 0;
            .form-info {
              font-size: 12px;
              color: #606266;
            }
            .menu-content-select {
              height: 408px;
              background-color: #ffffff;
              .header {
                background-color: #fafafa;
                height: 42px;
                display: flex;
                align-items: center;
                padding: 0 8px;
                .header-item {
                  width: 100px;
                  text-align: center;
                  flex-shrink: 0;
                  font-size: 14px;
                  cursor: pointer;
                  i {
                    margin-right: 5px;
                  }
                }
                .header-item-select {
                  color: #409eff;
                }
              }
              .selected-wx-graphic {
                padding: 8px;
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
              .select-wx-graphic {
                height: 350px;
                display: flex;
                justify-content: center;
                align-items: center;
                > div {
                  text-align: center;
                  cursor: pointer;
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
            .menu-content-url {
              height: 88px;
              background-color: #ffffff;
              display: flex;
              align-items: center;
              > span {
                width: 80px;
                text-align: right;
                padding-right: 5px;
                flex-shrink: 0;
                color: #606266;
              }
            }
            .menu-content-pro {
              background-color: #ffffff;
              min-height: 300px;
              padding: 12px;
              .title {
                font-size: 14px;
                color: #606266;
                padding-right: 12px;
              }
              .wx-programe-code {
                margin: 15px 65px;
                width: 180px;
                img {
                  width: 180px;
                }
                .code-info {
                  display: flex;
                  justify-content: space-between;
                }
              }
              .third-pro-info {
                color: #ff0000;
              }
              .third-pro-content {
                display: flex;
                .wx-programe-code {
                  margin: 0;
                  flex-shrink: 0;
                }
              }
            }
          }
        }
      }
      .btn {
        margin: 24px 0 0 24px;
      }
    }
    .no-menu-edit {
      margin-top: 24px;
      flex-grow: 1;
      > div {
        height: 600px;
        background-color: #f5f5f5;
      }
      .btn {
        margin: 24px 0 0 24px;
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
      grid-template-columns: repeat(8, 1fr);
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
  .function-poup-body {
    .info-poup-body {
      position: relative;
      height: 360px;
      .poup-box-info-list {
        max-height: 320px;
        overflow: auto;
      }
      .function-page-box {
        position: absolute;
        bottom: 0;
        right: 15px;
      }
    }
  }
}
</style>