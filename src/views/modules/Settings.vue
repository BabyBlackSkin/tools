<template>
    <div class="setting-page">
      <el-card class="setting-card" shadow="hover">
        <div class="header">
          <img src="@/assets/logo.png" alt="App Logo" class="logo" />
          <h2 class="title">应用设置</h2>
        </div>

        <el-divider />

        <div class="info-section">
          <div class="info-item">
            <span class="label">当前版本：</span>
            <el-tag type="info">{{ version }}</el-tag>
          </div>

          <div class="info-item">
            <span class="label">检查更新：</span>
            <el-button
                type="primary"
                size="small"
                :loading="checking"
                @click="handleCheckUpdate">
              {{ checking ? '正在检查...' : '检查更新' }}
            </el-button>
          </div>
        </div>

        <el-divider />

        <div class="footer">
        <span class="copyright">
          © 2025 BabyBlackSkin | All rights reserved
        </span>
        </div>
      </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const version = ref('加载中...')
const checking = ref(false)
onMounted(async () => {
  // 从主进程获取应用版本号
  version.value = await window.app.getVersion()
  // version.value = await window.app.checkUpdate()
})


async function handleCheckUpdate() {
  checking.value = true
  try {
    const result = await window.app.checkForUpdate()

    console.log(result)
    // if (result.hasUpdate) {
    //   this.$message.confirm(
    //       `发现新版本 ${result.version}，是否立即更新？`,
    //       '更新提示',
    //       { type: 'info' }
    //   ).then(() => {
    //     // ipcRenderer.send('startUpdate')
    //   })
    // } else {
    //   this.$message.success('当前已是最新版本')
    // }
  } catch (err) {
    console.error( err)
  } finally {
    checking.value = false
  }
}
// export default {
//   name: "Settings",
//   data() {
//     return {
//       version:''
//     }
//   },
//   created() {
//   },
//   mounted() {
//     window.setting.getVersion().then(res => {
//       this.version = res
//       console.log(res)
//     })
//   },
//   methods: {
//     search() {
//       window.dialogFile.getSelectedFilePath().then(res => {
//         console.log(res)
//       })
//     },
//   }
// }
</script>

<style scoped>
.setting-page {
  display: flex;
  flex:1;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--el-bg-color-page);
}

.setting-card {
  width: 400px;
  padding: 20px;
  text-align: center;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 10px;
}

.title {
  font-weight: 600;
  font-size: 20px;
}

.info-section {
  margin: 20px 0;
  text-align: left;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.label {
  width: 90px;
  //color: var(--el-text-color-secondary);
}

.footer {
  font-size: 12px;
  //color: var(--el-text-color-secondary);
}
</style>
