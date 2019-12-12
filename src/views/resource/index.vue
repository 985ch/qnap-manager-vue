<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
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
import { getList } from '@/api/resource'
import { parseTime } from '@/utils'

export default {
  filters: {
    timeFilter(time) {
      return parseTime(time)
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
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
      this.listLoading = false
    }
  }
}
</script>
