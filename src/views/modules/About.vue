
<template>
  <div class="tab-contain">
    功能持续增加中....
    <ul>
      <li><span>ISSUES & 源码：</span>
<!--        title="标题"-->
        <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            content="已复制到剪贴板，通过浏览器打开">
          <el-button slot="reference" @click="copy">打开</el-button>
        </el-popover>
<!--        <span>https://gitee.com/BabyBlackSkin/tools</span>-->
      </li>
    </ul>
  </div>
</template>
<script setup>


const copy = ()=>{
  navigator.clipboard.writeText("https://gitee.com/BabyBlackSkin/tools").then(() => {
    // this.$message.success('复制成功')
  })
}
</script>

<style scoped>
a {
  color: #eaeaea;
}
</style>
