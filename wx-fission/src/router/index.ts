import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";
import { config, hideAllNonBaseMenuItem, hideMenuItems, updateShare } from "@/utils/wechat";
import { wxConfigExcludePages } from "@/config";
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/loading.vue"),
    meta: {
      title: '加载中'
    }
  },
  {
    path: "/home",
    component: () => import("../views/home.vue"),
  },
  {
    path: "/user",
    component: () => import("../views/user.vue"),
    meta: {
      title: '排行榜'
    }
  },
  {
    path: "/invite-record",
    component: () => import("../views/invite-record.vue"),
    meta: {
      title: '邀请记录'
    }
  },
  {
    path: "/buy-form",
    component: () => import("../views/buy-form.vue"),
    meta: {
      title: '表单提交'
    }
  },
  {
    path: "/share",
    component: () => import("../views/share.vue"),
    meta: {
      title: '分享海报'
    }
  },
  {
    path: "/verification",
    component: () => import("../views/verification.vue"),
    meta: {
      title: '购买凭证'
    }
  },
  {
    path: "/complaint-feedback",
    component: () => import("../views/complaint-feedback.vue"),
    meta: {
      title: '投诉反馈'
    }
  },
  {
    path: "/complaint-feedback-detail",
    component: () => import("../views/complaint-feedback-detail.vue"),
    meta: {
      title: '投诉详情'
    }
  },
  {
    path: "/complaint-success",
    component: () => import("../views/complaint-success.vue"),
    meta: {
      title: '投诉反馈'
    }
  },
  {
    path: "/verification-code-detail",
    component: () => import("../views/verification-code-detail/index.vue"),
    meta: {
      title: '核销码详情'
    }
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import("../views/404.vue"),
    meta: {
      title: '404'
    }
  },
];

const router = createRouter({
  history: process.env.NODE_ENV == 'development' ? createWebHashHistory() :  createWebHistory('/fission'),
  routes,
  scrollBehavior(to) {
    return { top: 0 }
  }
});

router.afterEach(async (to, from, failure) => {
  const { meta, path } = to;
  const { title } = meta;

  if (failure == null) {
    // 设置title
    if (title) {
      document.title = title;
    } else {
      document.title = '商城';
    }

    // 微信config
    if (!wxConfigExcludePages.includes(path)) {
      await config();
      window.wx.ready(function () {
        updateShare();
        hideAllNonBaseMenuItem();
        hideMenuItems();
      })
    }
  }
})

router.beforeEach((to) => {
  const home = store.state.home;
  const { path, fullPath } = to;

  if (path == '/share') {
    if (home.isDistributionType == 0 && home.purchased == 0) {
      store.commit('setIsShowNeedBuy', true);
      return false;
    }
  }

  return true;
})

export default router;
