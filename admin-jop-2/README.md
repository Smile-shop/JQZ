# jindun

### 介绍
金盾

### 软件架构
#### 目录结构
- api: 接口地址
- assets: 静态资源
- components: 基础组件
- layout: 布局组件
  - layout-main: 主要是布局组件, 一级目录需要引用
  - page-router-view: 页面路由中间件, 最后一级地址如果需要添加同级的页面时用
  - page-table: 页面表格组件, 如果页面中有表格需要使用这个组件
  - page-warpper: 页面容器组件, 每个拥有拥有头部信息的组件都需要引用
    - #header-extra: 头部右边放按钮的插槽
    - #header-content: 头部内容插槽
    - #header-footer: 头部内容插槽
- router: 路由
- store: 全局状态
- styles: 全局样式
- example: 模板例子
- typings: 全局类型
- utils: 工具
  - http: 网络请求
  - http: 可访问路径设置
- views: 页面
  - modules: 顶部导航栏里模块文件夹

### 前期开发
1. 模块的菜单暂时到store.state.menus中定义, 等金盾开发完后再到金盾中定义菜单与权限;
2. 可以使用2.0的开发模式, 但为了以后迁移,不能使用3.0禁用的特性, 如filter;
3. 访问router与store的时候建议引入后再使用,不要使用this访问, 为了3.0迁移方便;

### 开发规范
1. 目录与文件全部使用横杠形式分隔;
2. view目录中的文件结构需要与路由结构一致;
3. 非必要不能在全局store中添加状态, 请在modules文件夹的对应模块中添加状态;
4. 安装其它插件的时候需要申请;
5. 目前的代码规范是eslint标准的宽松模式, 如果有其它需求需要申请;
6. 非全局使用的组件不要在全局components中定义, 请到对应的模块或者文件中添加components文件夹后再定义;
7. 模块中的api写在对应模块的文件夹中;
8. 常用的页面代码可以放在example中, 方便使用;

### 安装教程

1.  npm install

### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
