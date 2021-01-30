<template>
  <div class="goods-info">
    <a-card style="width: 100%">
      <div>
        <div class="base-title">
          <span class="tip">|</span>
          <span class="base-text">基础信息</span>
        </div>
        <div class="base-content">
          <div class="wx-nickName">
            <span class="item">微信昵称:</span>
            <span>{{ initData.payload.nickName }}</span>
            <div class="wx-img">
              <img :src="initData.payload.avatarUrl" alt />
            </div>
          </div>
          <div>
            <span class="item">会员id:</span>
            <span v-if="initData.payload.member.id">{{ initData.payload.member.id }}</span>
            <span v-else>——</span>
          </div>
          <div>
            <span class="item">openid:</span>
            <span v-if="initData.payload.openId">{{ initData.payload.openId }}</span>
            <span v-else>——</span>
          </div>
          <div>
            <span class="item">创建时间:</span>
            <span v-if="initData.payload.createTime">
              {{
              initData.payload.createTime
              }}
            </span>
            <span v-else>——</span>
          </div>
          <div>
            <span class="item">注册时间:</span>
            <span v-if="initData.payload.member.createTime">{{ initData.payload.member.createTime }}</span>
            <span v-else>——</span>
          </div>
          <div>
            <span class="item">手机号码:</span>
            <span v-if="initData.payload.member.phone">
              {{
              initData.payload.member.phone
              }}
            </span>
            <span v-else>——</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="user-info">
          <span class="tip">|</span>
          <span class="base-text">账户信息</span>
        </div>
        <div class="user-content">
          <div>
            <span class="item">会员卡号:</span>
            <span v-if="initData.payload.member.cardNo">{{ initData.payload.member.cardNo }}</span>
            <span v-else>——</span>
          </div>
          <div>
            <span class="item">所属门店:</span>
            <span v-if="initData.payload.store.name">{{ initData.payload.store.name }}</span>
            <span v-else>——</span>
          </div>
          <div>
            <span class="item">关联导购:</span>
            <span v-if="initData.payload.member.guideName">{{ initData.member.guideName }}</span>
            <span v-else>——</span>
          </div>
          <div>
            <span class="item">可用积分:</span>
            <span
              v-if="initData.payload.member.availablePoint >= 0"
            >{{ initData.payload.member.availablePoint }}</span>
            <span v-else>——</span>
            <span class="detail">积分明细</span>
          </div>
          <div>
            <span class="item">线上消费金额:</span>
            <span
              v-if="initData.payload.member.totalAmount >= 0"
            >{{ initData.payload.member.totalAmount }}</span>
            <span v-else>——</span>
            <span class="detail">订单明细</span>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent, reactive, onMounted } from '@vue/composition-api'
import { queryMemberDetail } from '@/api/modules/mall/member-manage'
export default defineComponent({
  setup(props, context) {
    const initData = reactive({
      baseInfo: {},
      userInfo: {},
      payload: {
        customer: {
          sex: {},
        },
        member: {},
        store: {},
      } as any,
      gender: {
        M: {
          alias: '男',
          attributes: 'M',
        },
        F: {
          alias: '女',
          attributes: 'F',
        },
        U: {
          alias: '未知',
          attributes: 'U',
        },
      } as any,
    })

    const pageInfo = async (data: any) => {
      const mark: any = data
      const flag: string = mark.member.sex
      const gender: any = initData.gender[flag] || ''
      mark.member.sex = gender
      initData.payload = mark
      console.log('初始化数据', initData.payload)
    }

    // 查询会员详情
    const pageQueryMemberDetail = async (id: string) => {
      const body: string = id
      const res: any = await queryMemberDetail(body)
      pageInfo(res)
    }

    onMounted(() => {
      const id: any = router.currentRoute.query.id || ''
      pageQueryMemberDetail(id)
    })

    return {
      initData,
    }
  },
})
</script>

<style lang="scss" scoped>
.wx-nickName {
  display: flex;
  align-items: center;
}
.wx-img {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 10px;
}
.base-title,
.user-info {
  height: 56px;
  line-height: 56px;
  background: rgba(245, 247, 250, 1);
  box-shadow: 0px 1px 0px 0px rgba(235, 238, 245, 1);
  margin-bottom: 24px;
}
.base-title .tip,
.user-info .tip {
  width: 2px;
  height: 12px;
  background: rgba(0, 69, 255, 1);
  margin-left: 11px;
  margin-right: 7px;
}
.base-text {
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(38, 52, 70, 1);
  line-height: 20px;
}
.base-content,
.user-content {
  margin-left: 30px;
}
.item {
  margin-right: 10px;
}
.detail {
  margin-left: 10px;
  text-decoration-line: underline;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 69, 255, 1);
  line-height: 20px;
}
.detail:hover {
  cursor: pointer;
}
.footer {
  margin-top: 30px;
}
</style>
