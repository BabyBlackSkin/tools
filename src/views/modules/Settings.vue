<template>
  <el-row>
    Hello Word
<!--    <el-button @click="search">测试</el-button>-->
  </el-row>
</template>
<script>
export default {
  name: "Settings",
  data() {
    return {}
  },
  created() {
  },
  methods: {
    search() {
      window.dialogFile.getSelectedFilePath().then(res => {
        console.log(res)
      })
    },
  }
}
</script>

<style scoped>

</style>
