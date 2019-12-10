<template>
  <div class="app-container">
    <el-tabs
      v-model="activeConfig"
      v-loading="isLoading"
      element-loading-text="Loading"
    >
      <el-tab-pane label="归档源路径" name="archive_path">
        <array-input :list="archivePath" listname="archive_path" placeholder="请输入完整路径" defaultitem="/新路径" />
        <el-button type="primary" @click="submitArchivePath()">提交</el-button>
      </el-tab-pane>
      <el-tab-pane label="资源路径" name="titles_path">
        <array-input :list="titlesPath" listname="titles_path" placeholder="请输入完整路径" defaultitem="/新路径" />
        <el-button type="primary" @click="submitTitlesPath()">提交</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    ArrayInput: () => import('@/components/ArrayInput/index.vue')
  },
  data() {
    return {
      activeConfig: 'archive_path',
      archivePath: [],
      titlesPath: [],
      isLoading: true
    }
  },
  computed: {
    ...mapGetters('system', ['archive_path', 'titles_path'])
  },
  async created() {
    await this.fetchData()
  },
  methods: {
    // 获取配置数据
    async fetchData() {
      this.isLoading = true
      await this.$store.dispatch('system/loadConfig')
      this.archivePath = this.archive_path
      this.titlesPath = this.titles_path
      this.isLoading = false
    },
    // 添加新路径
    addPath(data) {
      data.push('new path')
    },
    // 提交归档路径
    async submitArchivePath() {
      await this.$store.dispatch('system/setArchivePath', this.archivePath)
      this.$message({
        message: '提交成功',
        type: 'success'
      })
    },
    // 提交资源路径
    async submitTitlesPath() {
      await this.$store.dispatch('system/setTitlesPath', this.titlesPath)
      this.$message({
        message: '提交成功',
        type: 'success'
      })
    }
  }
}
</script>
