<template>
  <div class="ClassifySearch">
    <div class="preview">
      <div class="preview-title">
        <p class="preview-text">商品分类</p>
      </div>
      <div class="privew-section">
        <PhonePrivew :menus = "classifySearchList" />
      </div>
    </div>
    <div class="editor">
      <div class="editor-title">
        <p class="editor-text">编辑区域</p>
      </div>
      <p class="content-title">
      说明：JMP分类名称「线上展示名称」（
        <span class="tip">双击文字修改</span>）
      </p>
    <vuedraggable v-model="classifySearchList" @change="changeSearchList">
      <div v-for="(item, index) in classifySearchList" :key="index" class="groupItem">
        <template v-if="item.type != 2">
        <el-checkbox
          :indeterminate="item.isIndeterminate"
          v-model="item.state"
          @change="handleGroup(item.original)"
          class="parentItem"
        >
          <span @dblclick="changeAlias(item)">{{item.original}}</span>
          <span @dblclick="changeAlias(item)">「{{item.alias}}」</span>
        </el-checkbox>
        <el-checkbox-group v-model="test" @change="selectSingle" class="childItem">
          <el-checkbox
            v-for="city in item.subclassList"
            :label="city.primarySubclassId"
            :key="city.primarySubclassId"
            class="childItem-wrapper"
          >
            <span @dblclick="changeAlias(city)">{{city.originalSubclass}}</span>
            <span @dblclick="changeAlias(city)">「{{city.aliasSubclass}}」</span>
          </el-checkbox>
        </el-checkbox-group>
      </template>
      </div>
    </vuedraggable>
    
    <vuedraggable v-model="classifySearchList" @change="changeSearchList">
      <div v-for="(item, index) in classifySearchList" :key="index" class="groupItem">
        <template v-if="item.type == 2">
        <el-checkbox
          :indeterminate="item.isIndeterminate"
          v-model="item.state"
          @change="handleGroup(item.original)"
          class="parentItem"
        >
          <span @dblclick="changeAlias(item)">{{item.original}}</span>
          <span @dblclick="changeAlias(item)">「{{item.alias}}」</span>
        </el-checkbox>
        <el-checkbox-group v-model="test" @change="selectSingle" class="childItem">
          <el-checkbox
            v-for="city in item.subclassList"
            :label="city.primarySubclassId"
            :key="city.primarySubclassId"
            class="childItem-wrapper"
          >
            <span @dblclick="changeAlias(city)">{{city.originalSubclass}}</span>
            <span @dblclick="changeAlias(city)">「{{city.aliasSubclass}}」</span>
          </el-checkbox>
        </el-checkbox-group>
        </template>
      </div>
    </vuedraggable>
    
    <el-dialog title="线上展示名称" :visible.sync="openDialog" :width="dialogWidth">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="JMP 分类名称" :label-width="formLabelWidth" prop="original">
          <el-input v-model="form.original" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="展示名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer certain">
        <el-button type="primary" @click="openDialogSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-button class="submitBtn" type="primary" @click="submitInfo">保存</el-button>
    </div>
     <el-dialog
            title="提示"
            :visible.sync="deleteDialog"
            width="20%"
            :center='true'
            >
            <span style="display:block;text-align:center;">至少勾选一个筛选项</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="deleteDialog = false;" class="params-button">确 定</el-button>
            </span>
      </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import vuedraggable from 'vuedraggable'
import PhonePrivew from './components/phonePrivew.vue'
import { getDisplay, submit } from '@/api/super-crm/csr-classifySearch'

@Component({
  components: {
    vuedraggable,
    PhonePrivew,
  }
})
export default class ClassifySearch extends Vue {
  private dialogWidth: string = '35%'
  private openDialog: boolean = false
  private deleteDialog: boolean = false;
  private formLabelWidth: string = '120px'
  private temproray: any = {}
  private form: any = {
    original: '',
    name: ''
  }
  private test: any = []
  private classifySearchList: any = []
  private rules: any = {
    name: [
      { min: 0, max: 5, message: '长度 5 个字', trigger: 'blur' }
    ]
  }

  private created(): void {
    this.getDisplay()
  }
  // 查询
  private async getDisplay() {
    const res = await getDisplay({})
    const marklist = ['SALEPRICE', 'GOLDWET', 'MAINSTNWET', 'HANDSIZE', 'MAINSTNNUM', 'SUBSTNNUM', 'SUBSTNWET']
    const { data } = res
    const format = data.filter((item: any) => marklist.includes(item.identification)).map((item: any) => {
      if (item.state) {
        item.state = true
      } else {
        item.state = false
      }
      return item
    })
    format.map((item: any) => {
      if (item.subclassList) {
        const len: number = item.subclassList.length
        const temproray: any = []
        item.subclassList.map((childItem: any) => {
          if (childItem.stateSubclass) {
            temproray.push(childItem)
            if (temproray.length != len) {
              item.isIndeterminate = true
            } else {
              item.isIndeterminate = false
            }
          } else {
            childItem.stateSubclass = false
            if (item.isIndeterminate == undefined) {
              item.isIndeterminate = null
            }
          }
        })
      } else {
        item.isIndeterminate = false
      }
    })
    // 排序
    const result = format.sort((pre: any, next: any) => {
        return pre.number - next.number
    })
    this.classifySearchList = result
    await this.getChildSelected()
  }

  // 获得子选项选中
  private getChildSelected() {
    this.classifySearchList.map((item: any) => {
      item.subclassList.map((childItem: any): void => {
        if (childItem.stateSubclass) {
          this.test.push(childItem.primarySubclassId)
        }
      })
    })
  }

  // 修改别名
  private openDialogSubmit(formName: any) {
    const formNames: any = this.$refs[formName]
    const newAlias = this.form.name ? this.form.name : ''
    const temprorayId = this.temproray.original
      ? this.temproray.original
      : this.temproray.originalSubclass
      ? this.temproray.originalSubclass
      : ''
    const len = String(newAlias).length
    const mark = 5
    if (len > mark) {
        formNames.validate((valid: boolean): void => {
          return
        })
    } else {
    this.classifySearchList.map((item: any) => {
      if (item.original === temprorayId) {
        item.alias = newAlias
      } else {
        item.subclassList.map((childItem: any) => {
          if (childItem.originalSubclass === temprorayId) {
            childItem.aliasSubclass = newAlias
          }
        })
      }
    })
    this.openDialog = false
    }
  }

  // 全选一类
  private handleGroup(name: string) {
    let seletedGroup = false
    this.classifySearchList.map((item: any) => {
      if (item.original === name) {
        seletedGroup = item.state
      }
    })

    if (seletedGroup) {
      // 全选、遍历子类
      const group: any = this.getClassItemGroup(name)
      const child = group.subclassList ? group.subclassList : []
      const result = child.map((item: any) => item.primarySubclassId)
      result.push(name)
      result.map((item: any): void => {
        if (!this.test.includes(item)) {
          this.test.push(item)
        }
      })
      this.selectedAll(name, true)
      this.selectedItemAll(name, true)
    } else {
      // 取消全选、遍历子类
      const searial = this.getClassItemGroup(name)
      const child = searial.subclassList ? searial.subclassList : []
      const result = child.map((item: any) => item.primarySubclassId)
      result.push(name)
      result.map((item: any): void => {
        if (this.test.includes(item)) {
          const site = this.test.indexOf(item)
          this.test.splice(site, 1)
        }
      })
      this.selectedAll(name, false)
      this.selectedItemAll(name, false)
    }
  }
  // 全选小类
  private selectedItemAll(name: string, state: boolean) {
    this.classifySearchList.map((item: any) => {
      if (item.original === name) {
        item.subclassList.map((Childitem: any) => {
          Childitem.stateSubclass = state
        })
      }
    })
  }
  // 全选按钮
  private selectedAll(name: string, state: boolean) {
    this.classifySearchList.map((item: any) => {
      if (item.original === name) {
        item.state = state
        // item.isIndeterminate = !state
        item.isIndeterminate = null
      }
    })
  }
  private isSelectedType(name: string) {
    let result = false
    this.test.map((item: any): void => {
      if (item === name) {
        result = true
      }
    })
    return result
  }
  // 目前目前是否选中
  private getClassItemGroup(name: string) {
    let result: any = null
    this.classifySearchList.map((item: any) => {
      if (item.original === name) {
        result = item
      }
    })

    return result
  }
  private getSerialTest(name: string) {
    let result: number = 0
    this.test.map((item: any, index: number): void => {
      if (item.name === name) {
        result = index
      }
    })
    return result
  }
  // 选中一个
  private selectSingle(values: any) {
    const selected = values
    // 遍历全部的项目， 在选中值中就添加选中
    this.classifySearchList.map((item: any) => {
      item.subclassList.map((childrenItem: any) => {
        if (values.includes(childrenItem.primarySubclassId)) {
          childrenItem.stateSubclass = true
        } else {
          childrenItem.stateSubclass = false
        }
      })
    })
    // 查看选中的个数
    const classItem: any = []
    this.classifySearchList.map((item: any) => {
      const detail: any = {
        original: '',
        isCheck: 0,
        len: 0
      }
      detail.original = item.original
      detail.isCheck = 0
      detail.len = item.subclassList.length
      item.subclassList.map((childItem: any) => {
        if (childItem.stateSubclass) {
          detail.isCheck ++
        }
      })
      classItem.push(detail)
    })
    // 改变全部选中按钮
    classItem.map((detail: any) => {
      if (detail.len === detail.isCheck) {
        this.classifySearchList.map((item: any) => {
          if (item.original === detail.original) {
            item.state = true
            item.isIndeterminate = false
          }
        })
      } else {
        this.classifySearchList.map((item: any) => {
          if (item.original === detail.original) {
            item.state = false
            if ( detail.isCheck === 0) {
              item.isIndeterminate = null
            } else if ( detail.isCheck > 0) {
              item.isIndeterminate = true
            } else if (item.isIndeterminate != null) {
              item.isIndeterminate = true
            }
          }
        })
      }
    })
  }
  // 修改别名
  private changeAlias(options: any) {
    this.openDialog = true
    this.form.name = options.alias
      ? options.alias
      : options.aliasSubclass
      ? options.aliasSubclass
      : ''
    this.form.original = options.original
      ? options.original
      : options.originalSubclass
      ? options.originalSubclass
      : ''
    this.temproray = options
  }

  // 提交数据
  private submitInfo() {
    const middleTransform: any = JSON.parse(JSON.stringify(this.classifySearchList))
    // 获取序号
    const searial: any = middleTransform.map((item: any) => {
      return item.number
    })
    // 升序
    const order: any = searial.sort((pre: number, next: number) => {
      return pre - next
    })
    // 提交数据重新排序
    middleTransform.map((item: any, index: number) => {
      item.number = order[index]
    })
    let isSelecet: boolean = false;
    middleTransform.map((item: any): void => {
      if (item.state || item.isIndeterminate) {
        item.state = 1;
        isSelecet = true;
      } else {
        item.state = 0
      }
      if (item.subclassList) {
        item.subclassList.map((childItem: any): void => {
          if (childItem.stateSubclass) {
            childItem.stateSubclass = 1
          } else {
            childItem.stateSubclass = 0
          }
        })
      }
    })
    if (!isSelecet) {
      this.deleteDialog = true;
      return;
    }
    this.submit(middleTransform)
  }

  // 发送接口
  private async submit(data: any) {
    const res = await submit(data)
    const { code } = res
    if (code === 0) {
      this.$message({
        message: '保存成功',
        type: 'success'
      })
    }
  }

  // 拖动改变
  private changeSearchList(): void {
    // console.log(this.classifySearchList)
    // 提交保存统一处理
  }
}
</script>

<style scoped>
.ClassifySearch {
  display: flex;
}

.preview {
  flex: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  margin-right: 3rem;
  padding: 2rem;
}

.privew-section {
  margin: 0 auto;
}

.preview-title, .editor-title {
  border-bottom: 2px solid #EAEEF6;
  margin-bottom: 2rem;
}

.preview-text, .editor-text {
  display: inline-block;
  padding: 1rem 0;
  border-bottom: 2px solid #6699ff;
  margin-bottom: -2px;
}

.editor {
  flex: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  padding: 2rem;
}

.content-title {
  margin-bottom: 1rem;
}

.tip {
  color: #3e3ef4;
}
.parentItem {
  font-size: 20px;
  font-weight: bold;
}
.childItem {
  margin: 12px 12px 12px 60px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9e9e9;
}
.groupItem:last-child .childItem {
  border-bottom: none;
}
.childItem-wrapper {
  width: 180px;
}
.aliasUpdate {
  display: none;
}
.modifyAlias {
  display: inline-block;
}
.modifyTrue {
  cursor: pointer;
}
.modifyFalse {
  cursor: pointer;
}
.submitBtn {
  margin-top: 2rem;
}
.certain {
    display: flex;
  justify-content: center;
  align-items: center;
}
.filter-title {
  font-size: 20px;
  margin-bottom: 12px;
}
.serial {
  display: inline-block;
  width: 50px;
  font-size: 20px;
}
.serial-number {
  margin-right: 20px;
  font-size: 20px;
}
.serial-tip {
  font-size: 14px;
}
.filter-name {
  display: inline-block;
  width: 180px;
}
.content-input {
  display: inline-block;
}
.handle-input {
  width: 150px;
}
.case-filter {
  height: 50px;
  line-height: 50px;
}
</style>