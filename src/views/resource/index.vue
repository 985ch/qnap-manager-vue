<template>
  <div class="app-container">
    <span>资源路径</span>
    <el-select v-model="curPath" placeholder="请选择">
      <el-option
        v-for="item in resPath"
        :key="item"
        :value="item"
      />
    </el-select>
    <el-button v-show="isAdmin" @click="updatePath">重新检查</el-button>
    <el-table
      v-loading="listLoading"
      :data="curList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="资源">
        <template slot-scope="scope">
          {{ scope.row.folder }}
        </template>
      </el-table-column>
      <el-table-column label="资源路径" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column label="MD5" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.hash }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.updatetime | timeFilter }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, updatePath } from '@/api/resource'
import { parseTime } from '@/utils'
import checkPermission from '@/utils/permission'

export default {
  filters: {
    timeFilter(time) {
      return parseTime(time)
    }
  },
  data() {
    return {
      curPath: '',
      list: null,
      listLoading: true
    }
  },
  computed: {
    isAdmin() {
      return checkPermission(['admin'])
    },
    groupList() {
      const json = {}
      const list = this.list
      for (const item of list) {
        if (!json[item.path]) {
          json[item.path] = []
        }
        json[item.path].push(item)
      }
      return json
    },
    resPath() {
      if (!this.list) return []
      const paths = []
      for (const key in this.groupList) {
        paths.push(key)
      }
      return paths
    },
    curList() {
      if (this.list && this.curPath !== '') {
        return this.groupList[this.curPath]
      }
      return []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 拉取数据
    async fetchData() {
      this.listLoading = true
      this.list = await getList()
      this.curPath = this.resPath[0] || ''
      this.listLoading = false
    },
    // 强制更新目录
    updatePath() {
      this.$confirm('即将重新扫描目录，这将会花费一定时间，确定要重新扫描吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true
        updatePath(this.curPath).then(() => {
          return this.fetchData()
        })
      }).catch((e) => {
        if (e !== 'cancel') throw e
      })
    }
  }
}
</script>
