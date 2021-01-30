declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'weixin-js-sdk';
declare module 'vconsole';
declare module 'eruda';
