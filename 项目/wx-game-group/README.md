# wx-game-group

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

# 微信小游戏

## 项目依赖
* node 8.0 以上
* npm 5.0 以上
* axios 0.18.0 以上
* animate.css 3.7.0 以上
* animejs 3.1.0 以上
* better-scroll 1.15.2 以上
* vue-awesome-swiper 3.1.3 以上
* vue 2.6.10 以上
* vue-router 3.1.3 以上
* vuex 3.0.1 以上

## 目录结构
* public -- 公共资源
  * assets -- 图片资源
  * music -- 音乐资源
  * config.js -- 全局域名配置
  * index.html -- 全局页面挂载点
* src -- 页面资源
  * assets -- 静态资源
    * iconfont -- 字体资源
    * images -- 图片资源
    * js -- js 库
    * logo.png -- 项目 logo
    * rem.scss -- 使用 scss 重置视口像素
    * reset.css -- 重置视口像素单位
  * axios -- 请求方法
    * api -- 公共请求接口
    * cat-and-mouse.js -- 猫鼠大作战接口
    * index.js -- 封装请求方法
    * tiger.js -- 老虎机接口
  * components -- 公共组件
    * dialog -- 对话组件
    * layout -- 布局组件
    * ranking-list -- 排行榜组件
    * rule -- 游戏规则组件
    * Toast -- 提示组件
    * winning-dialog -- 警告提示组件
    * AppHeader.vue -- 头部组件
    * CatMousePic.vue -- 猫鼠画板组件
    * confirm.vue -- 对话组件
    * EnvelopeMark.vue -- 红包分享组件
    * fpMark.vue -- 翻牌分享组件
    * jggPlay.vue -- 九宫格分享组件
    * Mark.vue -- 分享组件
    * Mask.vue -- 分享无文字组件
    * MusicBtn.vue -- 播放游戏背景音乐组件
    * Tip.vue -- 注意小组件
    * WinningInfo.vue -- 中奖组件
  * config -- 全局配置
    * config.js -- 项目域名配置
    * constants.js -- 项目常量配置
    * url.js -- 项目名称配置
  * router -- 路由
  * store -- 状态管理
    * flop -- 翻牌
    * jiugongge -- 九宫格
    * index.js -- 导出
    * store.js -- 状态集合
  * utils -- 工具
  * views -- 页面
    * cat-and-mouse -- 猫鼠大作战游戏
    * common -- 公共页面
      * gifedetail.vue -- 礼品详情
      * Rule.vue -- 游戏规则
    * Flop -- 翻牌游戏
    * Jiugongge -- 九宫格游戏
    * RedEnvelope -- 翻红包游戏
    * Tigger -- 老虎机游戏
    * index.vue -- 游戏列表页
    * test.vue -- 检测浏览器不支持展示页面
  * App.vue -- 入口
  * main.js -- 挂载
* browserlistrc -- 浏览器
* .eslintrc.js -- eslint 规则
* .gitignore -- git 规则
* babel.config.js -- babel 编译规则
* package.json -- 依赖集
* postcss.config.js -- css 编译规则
* README.md -- 项目文档
* vue.config.js -- vue 项目配置
