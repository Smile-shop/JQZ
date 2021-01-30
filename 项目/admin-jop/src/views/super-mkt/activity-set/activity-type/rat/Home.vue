<template>
  <div class="home">
    <header>
      <el-button icon="el-icon-plus" type="primary" @click="toAddPage">添加活动</el-button>
    </header>
    <el-table empty-text="暂无游戏" :data="dataList" border style="width: 100%">
      <el-table-column label="编号" width="100">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="activityName" label="活动名称" width="180"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" width="160">
        <template slot-scope="scope">{{scope.row.beginTime | ymdhm}}</template>
      </el-table-column>
      <el-table-column prop="beginTime" label="结束时间" width="160">
        <template slot-scope="scope">{{scope.row.endTime | ymdhm}}</template>
      </el-table-column>
      <el-table-column label="活动状态" width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.activeStatus == 1" type="danger" size="small">未开始</el-button>
          <el-button v-if="scope.row.activeStatus == 2" type="success" size="small">进行中</el-button>
          <el-button v-if="scope.row.activeStatus == 3" type="warning" size="small">已暂停</el-button>
          <el-button v-if="scope.row.activeStatus == 4" type="info" size="small">已结束</el-button>
          <el-tooltip class="item" effect="light" :content="scope.row.errorState" placement="left">
            <el-button
              v-if="scope.row.activeStatus == 5"
              type="warning"
              size="small"
              icon="el-icon-question"
            >异常状态</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-setting" size="small" @click="toPage('set', scope.row)">活动设置</el-button>
          <!-- <el-button
            icon="el-icon-delete"
            size="small"
            @click="setActive('delete',scope.row)"
          >
            删除
          </el-button>-->
          <el-button
            :class="scope.row.isPublish==='1' ? 'closeTestLink': ''"
            icon="el-icon-tickets"
            size="small"
            @click="showQRURL(scope.row)"
          >测试链接</el-button>
          <el-button icon="el-icon-tickets" size="small" @click="publishGamge(scope.row)">发布链接</el-button>
          <el-button icon="el-icon-tickets" size="small" @click="toPage('data', scope.row)">活动数据</el-button>
          <el-switch
            class="switch-btn"
            @change="setActive('stop', scope.row,isPaused[scope.$index])"
            v-model="isPaused[scope.$index]"
            active-color="#67c23a"
            inactive-color="#f56c6c"
            active-text="开启"
            inactive-text="关闭"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div class="layer" v-show="addCtive">
      <div class="add-box" v-loading="loading">
        <div class="content-box">
          <div>
            <span>活动标题:</span>
            <input type="text" placeholder="请输入活动标题" v-model="activeform.activityName" />
            <button @click.stop="addActiver">保存</button>
          </div>
        </div>
      </div>
    </div>
    <div class="QRLayer" v-show="showQR">
      <div class="QRcode-box">
        <div>
          <p class="title">
            你可将 “
            <span class="name">{{ ActiveName }}</span>” 通过以下方式发布出去
          </p>
          <i class="close" @click="hideQRLayer"></i>
        </div>
        <div class="QRcode-view">
          <div class="QRimg">
            <div class="QRcode">
              <canvas id="canvas-qr"></canvas>
              <p>
                <span>微信扫一扫</span>
                <a class="downloadQR" ref="downloadQR" href download>下载二维码</a>
              </p>
            </div>
          </div>
          <div class="copyLink">
            <div>
              <p style="font-size:18px;color:#333;">活动网址</p>
              <div class="Linkview">
                <input class="LinkVule" ref="Link" :value="Linkvalue" />
                <span class="copyBtn" @click="copyText">复制</span>
              </div>
              <p style="font-size:13px;color:#ddd;">可将链接复制到公众号</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  updatePaused,
  gameActiveDel,
  queryActiveList,
  pauseActive,
  overActive,
  publishNewGame
} from '@/api/super-mkt/activity-set/nine'
import { mapMutations } from 'vuex'
import QRious from 'qrious'
import user from '@/utils/user'
import moment from 'moment'
export default {
  data() {
    return {
      wxUserInfo: {},
      Linkvalue: '',
      // 二维码大小 默认 100
      ActiveName: '',
      showQR: false,
      isPaused: [],
      dataList: [],
      loading: false,
      addCtive: false,
      user: '',
      activeform: {
        activityName: '',
        parentActive: '鼠年大翻身'
      }
    }
  },
  mounted() {
    this.getActiveList()
    this.user = window.localStorage.getItem('user')
  },
  methods: {
    ...mapMutations(['setsingleActiveData']),
    showQRURL(item) {
      const data = item
      const gameName = 'cat-and-mouse'
      this.ActiveName = data.activityName
      this.Linkvalue = `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}&shareId=${data.id}&childPage=${gameName}&page=wx_game_group`
      const params = {
        element: document.getElementById('canvas-qr'),
        value: this.Linkvalue,
        size: 219
      }
      const qRious = new QRious(params)
      const canvas = document.getElementById('canvas-qr')
      const imgSrc = canvas.toDataURL('image/png')
      this.showQR = true
      this.$refs.downloadQR.setAttribute('href', imgSrc)
    },
    publishNewGameTip(options) {
      this.$confirm(
        '是否确定发布该活动，若发布后游戏的总参与次数、每天参与次数、中奖次数限制、分享获得次数不得修改',
        '温馨提示',
        {
          confirmButtonText: '发布',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          publishNewGame(options)
            .then(res => {
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
              this.getActiveList()
            })
            .catch(reason => {
              this.$message({
                type: 'warning',
                message: reason || '发布失败!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          })
        })
    },
    publishGamge(item) {
      const { id, isPublish } = item
      console.log('发布的游戏', id, isPublish, item)
      const options = { id }
      const publish = Number(isPublish)
      if (publish === 0) {
        this.publishNewGameTip(options)
      } else {
        this.showQRURL(item)
      }
    },
    hideQRLayer() {
      this.showQR = false
    },
    copyText() {
      const Url = this.$refs.Link
      Url.select()
      document.execCommand('Copy')
      this.$message({
        message: '恭喜你，这是一条成功消息',
        type: 'success'
      })
    },
    // 删除游戏活动
    toggleHide() {
      this.addCtive = false
    },
    // 获取活动列表
    getActiveList() {
      return new Promise((resolve, reject) => {
        const options = {
          parentActive: '鼠年大翻身'
        }
        queryActiveList(options)
          .then(res => {
            const { data, code, msg } = res
            if (code == 0) {
              this.dataList = data
              if (!data) {
                return
              }
              data.forEach((val, i) => {
                if (val.isPaused == 0) {
                  this.isPaused[i] = true
                } else {
                  this.isPaused[i] = false
                }
              })
              resolve(data)
            } else {
              reject(msg)
            }
          })
          .catch(reason => {
            reject(reason)
          })
      })
    },
    // 页面跳转
    toPage(page, item) {
      this.setsingleActiveData(item)
      switch (page) {
        case 'set':
          this.$router.push({
            path: '/super-mkt/activity-set/activity-type/rat/edit',
            query: {
              companyKey: item.companyKey,
              id: item.id,
              name: item.activityName
            }
          })
          break
        case 'data':
          this.$router.push({
            path: '/super-mkt/activity-set/activity-type/rat/data',
            query: {
              id: item.id,
              jmpId: item.jmpId,
              name: item.activityName
            }
          })
          break
        default:
          break
      }
    },
    // 添加标题
    toAddPage() {
      this.$router.push('/super-mkt/activity-set/activity-type/rat/add')
    },
    // 活动设置
    setActive(type, item, status) {
      switch (type) {
        case 'delete':
          this.$confirm('是否确定删除该活动', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteActive(item)
                .then(res => {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                  this.getActiveList()
                })
                .catch(reason => {
                  this.$message({
                    type: 'warning',
                    message: reason || '删除失败!'
                  })
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          break
        case 'start':
          this.$confirm('是否确定开始/关闭该活动', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.topauseActive(item, { isPaused: '0' })
                .then(res => {
                  this.$message({
                    type: 'success',
                    message: '活动已开始!'
                  })
                  this.getActiveList()
                })
                .catch(reason => {
                  this.$message({
                    type: 'warning',
                    message: reason || '活动开始失败!'
                  })
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取修改！'
              })
            })
          break
        case 'pause':
          this.$confirm('是否确定暂停该活动', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.topauseActive(item, { isPaused: '1' })
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '活动已暂停!'
                })

                this.getActiveList()
              })
              .catch(reason => {
                this.$message({
                  type: 'warning',
                  message: reason || '活动暂停失败!'
                })
              })
          })
          break
        case 'stop':
          this.$confirm(
            '是否确定结束该活动，结束后将无法再次开启',
            '温馨提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              this.setupdatePaused({
                activeId: item.id,
                isPaused: status ? 0 : 1
              })
                .then(msg => {
                  this.$message({
                    type: 'success',
                    message: msg || '活动状态修改成功!'
                  })
                  const timeout = setTimeout(() => {
                    this.getActiveList()
                    clearInterval(timeout)
                  }, 1000)
                })
                .catch(err => {
                  this.$message({
                    type: 'warning',
                    message: err || '活动暂停修改失败!'
                  })
                  const timeout = setTimeout(() => {
                    this.getActiveList()
                    clearInterval(timeout)
                  }, 1000)
                })
              // this.overActive(item).then((res: any) => {
              //   this.$message({
              //     type: 'success',
              //     message: '活动结束!'
              //   });

              //   this.getActiveList();
              // }).catch((reason) => {
              //   this.$message({
              //     type: 'warning',
              //     message: reason || '活动结束失败!'
              //   });
              // })
            })
            .catch(err => {
              this.$message({
                type: 'warning',
                message: err.message || '活动暂停取消!'
              })
              this.getActiveList()
            })
          break
        default:
          break
      }
    },
    setupdatePaused(body) {
      return new Promise((resolve, reject) => {
        updatePaused(body)
          .then(res => {
            const { data, code, msg } = res
            if (code == 0) {
              resolve(msg)
            } else {
              reject(msg)
            }
          })
          .catch(reason => {
            reject(reason)
          })
      })
    },
    // 删除活动
    deleteActive(item) {
      return new Promise((resolve, reject) => {
        const body = {
          id: item.id
        }
        gameActiveDel(body)
          .then(res => {
            const { data, code, msg } = res
            if (code == 0) {
              resolve(data)
            } else {
              reject(msg)
            }
          })
          .catch(reason => {
            reject(reason)
          })
      })
    },
    // 暂停或启动活动
    topauseActive(item, options) {
      return new Promise((resolve, reject) => {
        const body = {
          id: item.id,
          jmpId: item.jmpId,
          isPaused: options.isPaused
        }
        pauseActive(body)
          .then(res => {
            const { data, code, msg } = res
            if (code == 0) {
              resolve(data)
            } else {
              reject(msg)
            }
          })
          .catch(reason => {
            reject(reason)
          })
      })
    },
    // 结束活动
    overActive(item) {
      return new Promise((resolve, reject) => {
        const body = {
          id: item.id,
          jmpId: item.jmpId,
          isOver: '1'
        }
        overActive(body)
          .then(res => {
            const { data, code, msg } = res
            if (code == 0) {
              resolve(data)
            } else {
              reject(msg)
            }
          })
          .catch(reason => {
            reject(reason)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.QRLayer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.65);

  .close {
    position: absolute;
    top: 20px;
    right: 30px;
    width: 25px;
    height: 25px;
    background-image: url('~@/assets/images/super-crm/mine/close.png');
    background-repeat: no-repeat;
    background-size: 100%;
  }
  .QRcode-box {
    width: 768px;
    height: 396px;
    margin: 0 auto;
    background: #fff;
    margin-top: 171px;
    position: relative;
    padding-top: 30px;
    .title {
      font-size: 24px;
      text-align: center;
      margin: 30px 0px;
      .name {
        color: #6699ff;
      }
    }
    .QRcode-view {
      width: 100%;
      display: flex;

      & > div {
        flex: 1;
      }
      .QRimg {
        border-right: 1px solid #ddd;

        .QRcode {
          width: 219px;
          height: 219px;
          margin: 0 auto;
        }
        .downloadQR {
          color: #6699ff;
          float: right;
        }
      }
      .copyLink {
        display: flex;
        justify-content: center;
        align-items: center;

        .Linkview {
          width: 263px;
          height: 45px;
          border: 1px solid #ddd;
          margin: 10px;
          border-radius: 8px;
          font-size: 16px;
          background: rgba(0, 0, 0, 0);
          margin-left: -1px;
          display: flex;

          .LinkVule {
            height: 43px;
            width: 200px;
            vertical-align: middle;
            flex: 1;
            border: none;
            outline: none;
          }
          .copyBtn {
            display: inline-block;
            height: 45px;
            line-height: 45px;
            border-left: 1px solid #ddd;
            padding-left: 10px;
            width: 50px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.home {
  & > header {
    margin-bottom: 10px;
  }
  .closeTestLink {
    display: none;
  }
  .layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;

    .add-box {
      flex: 1;
      height: auto;
      position: relative;

      .content-box {
        width: 50%;
        position: absolute;
        padding: 50px 15px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 10px;
        left: 25%;
        opacity: 0;
        transform: scale(0.3);
        animation: Boxshow 0.6s linear 1s forwards;

        .title {
          height: 50px;
          line-height: 50px;
          padding-left: 20px;
          border-bottom: 1px solid #f3f3f3;
          font-size: 18px;
        }
        & > div {
          margin: 30px 0;

          & > span {
            font-size: 18px;
            padding-right: 10px;
          }
          & > input {
            border: solid 1px #dcdfe6;
            width: 350px;
            height: 38px;
            border-radius: 8px;
            padding-left: 10px;
            font-size: 15px;
            outline: none;
          }

          & > button {
            width: 98px;
            height: 40px;
            border: none;
            background: #409eff;
            color: #fff;
            font-size: 14px;
            border-radius: 8px;
            margin-left: 10px;
          }
        }
      }
    }
  }
}

@keyframes Boxshow {
  0% {
    opacity: 0.3;
    transform: scale(0.5);
  }
  30% {
    opacity: 0.5;
    transform: scale(0.7);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.switch-btn {
  display: inline-block;
  margin-left: 20px;
}
</style>


