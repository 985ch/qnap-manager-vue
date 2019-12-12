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
      <el-tab-pane label="资源路径" name="resource_path">
        <array-input :list="resourcePath" listname="resource_path" placeholder="请输入完整路径" defaultitem="/新路径" />
        <el-button type="primary" @click="submitResourcePath()">提交</el-button>
      </el-tab-pane>
      <el-tab-pane label="归档服务器配置" name="archive_server">
        <el-form :model="archiveServer">
          <el-form-item label="服务器地址">
            <el-input v-model="archiveServer.host" placeholder="请输入服务器完整地址" />
          </el-form-item>
          <el-form-item label="服务器密钥">
            <el-input v-model="archiveServer.key" placeholder="请输入用于上传数据的密钥" />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submitArchiveServer()">提交</el-button>
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
      resourcePath: [],
      archiveServer: {
        host: '',
        key: ''
      },
      isLoading: true
    }
  },
  computed: {
    ...mapGetters('system', ['archive_path', 'resource_path', 'archive_server'])
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
      this.resourcePath = this.resource_path
      this.archiveServer = this.archive_server
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
    async submitResourcePath() {
      await this.$store.dispatch('system/setResourcePath', this.resourcePath)
      this.$message({
        message: '提交成功',
        type: 'success'
      })
    },
    // 提交归档服务器设置
    async submitArchiveServer() {
      await this.$store.dispatch('system/setArchiveServer', this.archiveServer)
      this.$message({
        message: '提交成功',
        type: 'success'
      })
    }
  }
}
</script>
