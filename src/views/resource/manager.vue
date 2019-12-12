<template>
  <div class="app-container">
    <el-table
      v-show="list && list.length > 0"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="优先级" width="95">
        <template slot-scope="scope">
          {{ scope.row.orderID }}
        </template>
      </el-table-column>
      <el-table-column label="匹配规则">
        <template slot-scope="scope">
          {{ scope.row.regular }}
          <el-button size="mini" @click="showEditRuleDlg(scope.$index)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="归档方案" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.rule | ruleFilter }}
        </template>
      </el-table-column>
      <el-table-column label="来源路径" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标路径" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.target }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="启用状态" width="110" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :type="scope.row.enable?'success':'danger'"
            @click="switchEnabled(scope.$index)"
          >
            {{ scope.row.enable ? '启用中' : '已禁用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="showEditRuleDlg(-1)">添加归档规则</el-button>
    <el-dialog :close-on-click-modal="false" :title="curIndex >= 0?'编辑规则':'添加规则'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="优先级">
          <el-input-number v-model="form.orderID" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="匹配规则">
          <el-input v-model="form.regular" placeholder="请输入匹配规则的正则表达式" />
        </el-form-item>
        <el-form-item label="测试文件名" placeholder="请输入一个文件名用于测试">
          <el-input v-model="testText">
            <div slot="append">
              <el-button @click="testRegular">匹配测试</el-button>
            </div>
          </el-input>
        </el-form-item>
        <el-form-item label="归档方案">
          <el-select v-model="form.rule" placeholder="请选择归档方案">
            <el-option label="直接复制" value="default" />
            <el-option label="复制目录内文件" value="files" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源路径">
          <el-autocomplete
            v-model="form.path"
            class="inline-input"
            :fetch-suggestions="queryArchivePath"
            placeholder="选择来源路径"
          />
        </el-form-item>
        <el-form-item label="目标路径">
          <el-autocomplete
            v-model="form.target"
            class="inline-input"
            :fetch-suggestions="queryResourcePath"
            placeholder="选择目标路径"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbitForm">{{ curIndex >= 0?'修 改':'添 加' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { getRules, addRule, editRule, setRuleEnable } from '@/api/archive'

export default {
  filters: {
    ruleFilter(rule) {
      const rules = {
        default: '直接复制',
        files: '复制目录内文件'
      }
      return rules[rule]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      curIndex: -1,
      testText: '',
      form: {
        orderID: 0,
        regular: '',
        rule: 'default',
        path: '',
        target: '',
        enable: 1
      },
      dialogFormVisible: false
    }
  },
  computed: {
    ...mapGetters('system', ['archive_path', 'resource_path'])
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 拉取数据
    async fetchData() {
      this.listLoading = true
      await this.$store.dispatch('system/loadConfig')
      this.list = await getRules()
      this.listLoading = false
    },
    // 显示添加规则对话框
    showEditRuleDlg(index) {
      if (index >= 0) {
        this.form = _.clone(this.list[index])
      } else {
        this.form = {
          orderID: 0,
          regular: '',
          rule: 'default',
          path: '',
          target: '',
          enable: 1
        }
      }
      this.curIndex = index
      this.dialogFormVisible = true
    },
    // 对传入的数组根据关键字进行筛选之后返回备选数组
    filterList(raw, str) {
      const list = []
      for (const item of raw) {
        if (!str || item.indexOf(str) >= 0) list.push({ value: item })
      }
      return list
    },
    // 查询符合条件的归档路径
    queryArchivePath(str, cb) {
      cb(this.filterList(this.archive_path, str))
    },
    // 查询符合条件的资源路径
    queryResourcePath(str, cb) {
      cb(this.filterList(this.resource_path, str))
    },
    // 测试正则表达式
    testRegular() {
      if (this.testText !== '') {
        const tester = new RegExp(this.form.regular)
        if (tester.test(this.testText)) {
          this.$message({
            message: '测试成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '测试失败',
            type: 'warning'
          })
        }
      }
    },
    // 查找同样的规则
    checkSameRule() {
      const list = this.list
      const form = this.form
      for (let i = 0; i < list.length; i++) {
        if (i === this.curIndex) continue
        const cur = list[i]
        if (cur.path === form.path && cur.regular === form.regular) return true
      }
      return false
    },
    // 提交表单
    async sumbitForm() {
      if (this.checkSameRule()) {
        return this.$message({
          message: '已经存在同样的规则了',
          type: 'error'
        })
      }

      const form = this.form
      form.enable = 1
      if (this.curIndex >= 0) {
        const cur = this.list[this.curIndex]
        await editRule(cur.path, cur.regular, form)
        this.$set(this.list, [this.curIndex], form)
      } else {
        await addRule(form)
        this.list.push(form)
      }

      this.dialogFormVisible = false
      this.$message({
        message: '规则修改成功',
        type: 'success'
      })
    },
    // 切换规则启用状态
    async switchEnabled(index) {
      const cur = this.list[index]
      const enable = cur.enable ? 0 : 1
      await setRuleEnable(cur.path, cur.regular, enable)
      cur.enable = enable
      this.$set(this.list, index, cur)
    }
  }
}
</script>
