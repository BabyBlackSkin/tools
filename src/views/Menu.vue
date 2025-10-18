<template>
  <el-submenu :index="menu.meta.name" v-if="menu.children && menu.children.length > 0">
        <template v-slot:title v-if="menu.meta.title">
          <i :class="menu.meta.icon" v-if="menu.meta.icon"></i>
          <span>{{ menu.meta.title }}</span>
        </template>
        <template v-for="subMenu in menu.children">
          <el-menu-item-group v-if="subMenu.meta.isGroup">
            <template slot="title" v-if="subMenu.meta.title">分组一</template>
            <Menu :menu="subMenu.children"></Menu>
          </el-menu-item-group>

          <el-submenu :index="subMenu.meta.name" v-else-if="subMenu.children && subMenu.children.length > 0">
            <template slot="title" v-if="subMenu.meta.title">{{ subMenu.meta.title }}</template>
            <Menu :menu="sonMenu" v-for="sonMenu in subMenu.children"></Menu>
          </el-submenu>
          <el-menu-item v-else>
            <i :class="subMenu.meta.icon" v-if="subMenu.meta.icon"></i>
            <span>{{ subMenu.meta.title }}</span>
          </el-menu-item>
        </template>
  </el-submenu>

  <el-menu-item v-else :index="menu.meta.name" @click="route(menu.name)">
    <i :class="menu.meta.icon" v-if="menu.meta.icon"></i>
    <span>{{ menu.meta.title }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: "Menu",
  props: {
    menu: {
      type: Object,
      require: true
    }
  },
  data() {
    return {}
  },
  methods: {
    route(name) {
      this.$router.push({name: name}).catch(err => {
        console.log(err)
        // this.$message.error("404 Not Found")
      })
    }
  },
  computed: {}
}
</script>

<style scoped>
::v-deep.el-menu.el-submenu__title{
  height: 32px;
  line-height: 32px;
}

::v-deep.el-menu-item {
  height: 32px;
  line-height: 32px;
  position: relative;
}

::v-deep.el-menu-item.is-active {
  color: #303133;
  position: relative;
  background-color: #f3f3f3;
}

::v-deep.el-menu-item:hover {
  background-color: #f3f3f3;
}

::v-deep.el-menu-item:hover::before {
  content: '';
  display: inline-block;
  width: 2px;
  height: 50%;
  top: 25%;
  background-color: #0d8120;
  position: absolute;
  left: 0;
}

::v-deep.is-active::before {
  content: '';
  display: inline-block;
  width: 2px;
  height: 50%;
  top: 25%;
  background-color: #0d5181;
  position: absolute;
  left: 0;
}
</style>
