<template>
  <div class="program-manage-list">
    <section class="table">
      <el-table
        :data="dataList"
        :default-expand-all="false"
        :row-class-name="tableRowClassName"
        :row-key="rowId"
        :expand-row-keys="rootCatIdList"
        border
      >
        <el-table-column type="expand">
          <template
            slot-scope="scope"
            v-if="scope.row.catType === '0'"
          >
            <el-table
              :data="scope.row.subList"
              :show-header="false"
              border
            >
              <el-table-column
                label="栏目名称"
                prop="catName"
                width="150"
              >
                <template
                  slot-scope="scope"
                >
                  <span
                    v-if="!scope.row.isModify"
                  >
                    {{scope.row.catName}}
                  </span>
                  <el-input
                    v-if="scope.row.isModify"
                    v-model="scope.row.catName"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="栏目类型"
                prop="catType"
                width="150"
              >
                <template
                  slot-scope="scope"
                >
                  <el-select
                    v-model="scope.row.catType"
                    :disabled="!scope.row.isCreate"
                  >
                    <el-option
                      v-for="item in twoTypeSelectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="是否显示"
                width="150"
              >
                <template
                  slot-scope="scope"
                >
                  <el-icon
                    v-if="scope.row.isShow"
                    v-show="!scope.row.isModify"
                    type="el-icon-success"
                    size="30px"
                    color="#2d8cf0"
                  >
                  </el-icon>
                  <el-icon
                    v-else
                    v-show="!scope.row.isModify"
                    type="el-icon-error"
                    size="30px"
                    color="#bbbec4"
                  >
                  </el-icon>
                  <el-switch
                    v-show="scope.row.isModify"
                    v-model="scope.row.isShow"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                label="栏目排序"
                width="180"
              >
                <template slot-scope="scope2">
                  <el-button
                    v-if="!scope.row.isCreate"
                    icon="el-icon-arrow-up"
                    circle
                    size="small"
                    :disabled="scope2.$index == 0"
                    @click="moveUp('2', scope.row, scope2.$index)"
                  >
                  </el-button>
                  <el-button
                    v-if="!scope.row.isCreate"
                    icon="el-icon-arrow-down"
                    circle
                    size="small"
                    :disabled="scope2.$index + 1 == scope.row.subList.length"
                    @click="moveDown('2', scope.row, scope2.$index)"
                  >
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="!scope.row.isModify"
                    size="small"
                    @click="modifyColumn(scope.$index, scope.row)"
                  >
                    修改
                  </el-button>
                  <el-button
                    v-if="scope.row.isModify"
                    size="small"
                    @click="saveColumn(scope.$index, scope.row)"
                  >
                    保存
                  </el-button>
                  <el-button
                    v-if="scope.row.isModify"
                    size="small"
                    @click="cancelModifyColumn(scope.$index, scope.row)"
                  >
                    取消修改
                  </el-button>
                  <el-button
                    size="small"
                    v-if="scope.row.catType === '2' && !scope.row.isModify"
                    @click="toContentManage(scope.row)"
                  >
                    内容管理
                  </el-button>
                  <el-button
                    size="small"
                    v-if="scope.row.catType === '1' && !scope.row.isModify"
                    @click="toArticle"
                  >
                    文章管理
                  </el-button>
                  <el-button
                    size="small"
                    @click="copyLink(scope.row, true)"
                  >
                    复制链接
                  </el-button>
                  <el-button
                    v-if="!scope.row.isCreate"
                    type="danger"
                    size="small"
                    @click="deleteTwoColumn(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="栏目名称"
          prop="catName"
          width="150"
        >
          <template
            slot-scope="scope"
          >
            <span
              v-if="!scope.row.isModify"
            >
              {{scope.row.catName}}
            </span>
            <el-input
              v-if="scope.row.isModify"
              v-model="scope.row.catName"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="栏目类型"
          prop="catType"
          width="150"
        >
          <template
            slot-scope="scope"
          >
            <el-select
              v-if="scope.row.canDel === '1' || scope.row.isCreate"
              v-model="scope.row.catType"
              :disabled="!scope.row.isCreate"
            >
              <el-option
                v-for="item in oneTypeSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span
              v-else
            >
              {{scope.row.catCode | baseColumnType}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否显示"
          width="150"
        >
          <template
            slot-scope="scope"
          >
            <el-icon
              v-if="scope.row.isShow"
              v-show="!scope.row.isModify"
              type="el-icon-success"
              size="30px"
              color="#2d8cf0"
            >
            </el-icon>
            <el-icon
              v-else
              v-show="!scope.row.isModify"
              type="el-icon-error"
              size="30px"
              color="#bbbec4"
            >
            </el-icon>
            <el-switch
              v-show="scope.row.isModify"
              v-model="scope.row.isShow"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="栏目排序"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isCreate"
              icon="el-icon-arrow-up"
              circle
              size="small"
              :disabled="scope.$index == 0"
              @click="moveUp('1', scope.row, scope.$index)"
            >
            </el-button>
            <el-button
              v-if="!scope.row.isCreate"
              icon="el-icon-arrow-down"
              circle
              size="small"
              :disabled="scope.$index + 1 == dataList.length"
              @click="moveDown('1', scope.row, scope.$index)"
            >
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.catType === '0' && !scope.row.isModify"
              size="small"
              @click="addSubColumn(scope.$index, scope.row)"
            >
              添加子栏目
            </el-button>
            <el-button
              v-if="!scope.row.isModify"
              size="small"
              @click="modifyColumn(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="scope.row.isModify"
              size="small"
              @click="saveColumn(scope.$index, scope.row)"
            >
              保存
            </el-button>
            <el-button
              v-if="scope.row.isModify"
              size="small"
              @click="cancelModifyColumn(scope.$index, scope.row)"
            >
              取消修改
            </el-button>
            <el-button
              size="small"
              v-if="scope.row.catType === '2' && !scope.row.isModify"
              @click="toContentManage(scope.row)"
            >
              内容管理
            </el-button>
            <el-button
              size="small"
              v-if="scope.row.catType === '1' && !scope.row.isModify"
              @click="toArticle"
            >
              文章管理
            </el-button>
            <el-button
              size="small"
              @click="copyLink(scope.row)"
            >
              复制链接
            </el-button>
            <el-button
              v-show="scope.row.canDel === '1'"
              type="danger"
              size="small"
              @click="deleteOneColumn(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <app-gutter/>
    <section>
      <el-button
        @click="addOneColumn"
      >
        添加栏目
      </el-button>
    </section>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {Message} from 'element-ui';
import AppGutter from '@/components/AppGutter.vue';
import ElIcon from '@/components/ElIcon.vue';
import {
  getColumnOptions,
  setColumnOptions,
  deleteColumnOneOptions,
  updateColumnOrderOptions
} from '@/api/super-crm/wx-website';
import {getSessionStorage} from '@/utils/storage';

@Component({
  components: {
    ElIcon,
    AppGutter,
  },
  filters: {
    baseColumnType(value: string) {
      switch (value) {
        case 'lyfk':
          return '留言反馈'
        case 'onlineMember':
          return '微会员'
        case 'onlineShop':
          return '微商城'
        default:
          return ''
      }
    }
  },
})
export default class WxWebsiteProgramManageList extends Vue {
  dataList: any[] = []
  // 一级类型选择项
  oneTypeSelectOptions: any[] = [
    {
      value: '0',
      label: '根栏目',
    },
    {
      value: '1',
      label: '新闻列表',
    },
    {
      value: '2',
      label: '图文介绍',
    },
    /* {
      value: '3',
      label: '留言反馈',
    }, */
  ]
  // 二级菜单选择项
  twoTypeSelectOptions: any[] = [
    /* {
      value: '1',
      label: '新闻列表',
    }, */
    {
      value: '2',
      label: '图文介绍',
    },
  ]

  get rootCatIdList() {
    let list = [];

    list = this.dataList.filter((value, index) => {
      return value.catType === '0'
    })

    return list.map((value, index) => {
      return value.id
    })
  }

  mounted() {
    this.getColumn();
  }

  // 复制链接
  copyLink(row: any, isChild: boolean) {
    const {user} = getSessionStorage();

    const {id, pid} = row;
    const baseURL = `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.account.companyKey}&page=wx_website`;

    /* if (process.env.NODE_ENV === 'production') {
      baseURL = `http://www.jqzjop.com/wx-interface-web/wx/auth?companyKey=${user.account.companyKey}&page=wx_website`
    } else {
      baseURL = `http://www.jbfsoft.net/wx-web/wx/auth?companyKey=${user.account.companyKey}&page=wx_website`
    } */
    let childPage = null;

    if (isChild) {
      childPage = {
        pid,
        id
      }
    } else {
      childPage = {
        pid: id,
      }
    }

    const url = new URL(baseURL);
    const searchParams = url.searchParams;
    searchParams.set('childPage', JSON.stringify(childPage))

    const textArea = document.createElement('textarea');
    textArea.value = url.toString();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    textArea.remove()
    Message.success('复制成功');
  }

  // 返回行id
  rowId(row: any) {
    return row.id
  }

  // 向上移动
  moveUp(level: any, item: any, index: any) {
    return new Promise((resolve, reject) => {
      let body = {}

      switch (level) {
        case '1':
          body = {
            oneId: item.id,
            oneOrder: item.catOrder,
            twoId: this.dataList[index - 1].id,
            twoOrder: this.dataList[index - 1].catOrder,
          }
          break;
        case '2':
          body = {
            oneId: item.subList[index].id,
            oneOrder: item.subList[index].catOrder,
            twoId: item.subList[index - 1].id,
            twoOrder: item.subList[index - 1].catOrder,
          }
          break;
      }

      updateColumnOrderOptions(body).then((res: any) => {
        const {data} = res;

        this.getColumn();
        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 向下移动
  moveDown(level: any, item: any, index: any) {
    return new Promise((resolve, reject) => {
      let body = {}

      switch (level) {
        case '1':
          body = {
            oneId: item.id,
            oneOrder: item.catOrder,
            twoId: this.dataList[index + 1].id,
            twoOrder: this.dataList[index + 1].catOrder,
          }
          break;
        case '2':
          body = {
            oneId: item.subList[index].id,
            oneOrder: item.subList[index].catOrder,
            twoId: item.subList[index + 1].id,
            twoOrder: item.subList[index + 1].catOrder,
          }
          break;
      }

      updateColumnOrderOptions(body).then((res: any) => {
        const {data} = res;

        this.getColumn();
        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询栏目
  getColumn() {
    return new Promise((resolve, reject) => {
      const body = {}

      getColumnOptions(body).then((res: any) => {
        const {data} = res;

        this.dataList = data.map((value: any) => {
          value.isShow = value.isShow === '0' ? false : true;
          if (value.subList) {
            value.subList = value.subList.map((value: any) => {
              value.isShow = value.isShow === '0' ? false : true;
              return value;
            })
          }
          return value;
        });
        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 保存修改栏目
  saveColumn(index: number, row: any) {
    return new Promise((resolve, reject) => {
      const {catName, id, catType, isShow, catLevel, pid} = row;
      const body = {
        catName,
        id,
        catType,
        isShow: isShow ? '1' : '0',
        catLevel,
        pid,
      }

      setColumnOptions(body).then((res: any) => {
        const {data} = res;

        this.$set(row, 'isModify', false);
        Message.success('修改成功');
        this.getColumn();
        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 点击修改栏目
  modifyColumn(index: number, row: any) {
    this.$set(row, 'isModify', true);
  }

  // 点击取消修改
  cancelModifyColumn(index: number, row: any) {
    this.$set(row, 'isModify', false);
    this.getColumn();
  }

  // 删除二级栏目
  deleteTwoColumn(index: number, row: any) {
    return new Promise((resolve, reject) => {
      const {catName, id, catType, catOrder, isShow, catLevel, pid} = row;
      const body = {
        id,
        isDeleted: '1',
      }

      setColumnOptions(body).then((res: any) => {
        const {data} = res;

        this.getColumn();
        Message.success('删除成功');

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 删除一级栏目
  deleteOneColumn(index: number, row: any) {
    return new Promise((resolve, reject) => {
      const {catName, id, catType, catOrder, isShow, catLevel, pid} = row;
      const body = {
        id,
        isDeleted: '1',
        catType
      }

      deleteColumnOneOptions(body).then((res: any) => {
        const {data} = res;

        this.getColumn();
        Message.success('删除成功');

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 添加子栏目
  addSubColumn(index: number, row: any) {
    const item = this.dataList.find((value, index) => {
        return value.id == row.id;
      })

    if (item.subList.length <= 3) {
      item.subList.push({
        id: '',
        catName: '图文介绍',
        isShow: '0',
        pid: row.id,
        catType: '2',
        catLevel: '2',
        isModify: true,
        isCreate: true,
      })
    } else {
      Message.warning('最多添加4个');
    }
  }

  // 添加一级栏目
  addOneColumn() {
    this.dataList.push({
      id: '',
      catName: '新闻列表',
      isShow: '0',
      pid: '0',
      catType: '1',
      catLevel: '1',
      isModify: true,
      isCreate: true,
    })
  }

  // 表格行class
  tableRowClassName({row, rowIndex}: any) {
    return 'gray';
  }

  // 前往内容管理页面
  toContentManage(row: any) {
    this.$emit('edit', row)
  }

  // 前往文章管理页面
  toArticle() {
    this.$router.push({
      path: '/super-crm/wx-website/article-manage'
    })
  }
}
</script>

<style lang="scss" scoped>
</style>