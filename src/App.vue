<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-aside width="250px" style="min-width: 200px;border-right: 1px solid #f3f3f3;">
        <side-bar></side-bar>
      </el-aside>

      <el-container>
        <keep-alive>
          <router-view/>
        </keep-alive>
      </el-container>

    </el-container>
  </div>
</template>

<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //background-color: #f3f3f3;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

//滚动条整体部分
*::-webkit-scrollbar {
  width: 10px;
}

//滚动条中的滑块
*::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: #d8d8d8;
}
//滚动条中的外层轨道 ::-webkit-scrollbar-track

</style>
<script setup>
import SideBar from "@/views/SideBar.vue";
</script>
