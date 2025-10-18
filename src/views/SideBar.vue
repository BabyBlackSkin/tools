<template>
  <el-container id="sidebar-container">
    <div>
      <el-menu :default-active="$route.meta.name" class="el-menu-vertical-demo">
        <Menu v-for="menu in menuList" :menu="menu"></Menu>
      </el-menu>
    </div>
    <div style="position: absolute;bottom: 0">
      <el-menu :default-active="this.$route.meta.name" class="el-menu-vertical-demo">
        <Menu v-for="menu in footMenuList" :menu="menu"></Menu>
      </el-menu>
    </div>
  </el-container>
</template>

<script>
import Menu from "@/views/Menu.vue";

export default {
  name: "SideBar",
  components: {Menu},
  props: {
    menu: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      menuList: [
        {
          name: 'HomeView', // 路由的name
          meta: {
            icon: 'el-icon-house',
            title: 'Home', // 渲染的名称
            name: 'HomeView', // 用于与router.name比较，是否激活nav
          },
        },
        {
          name: 'sshList',
          meta: {
            icon: 'el-icon-connection',
            title: 'TunnelSSH',
            name: 'sshManager'
          },
        },
        // {
        //   name: 'Str',
        //   meta:{
        //     name:'Str',
        //     title:'字符串解析',
        //   },
        //   children: [
        //     {
        //       name: 'ParsingMapToStringStr',
        //       meta: {
        //         title: 'ParsingMapToStringStr',
        //         name: 'ParsingMapToStringStr'
        //       }
        //     }
        //   ]
        // }
        // {
        //   name: 'URLCoding',
        //   title: 'URL编码与解码',
        //   icon: 'el-icon-connection',
        //   meta: {
        //     name: 'URLCoding'
        //   },
        // }
      ],
      footMenuList: [
        {
          name: 'About',
          meta: {
            icon: 'el-icon-user',
            title: 'About',
            name: 'About'
          },
        },
        {
          name: 'Settings',
          meta: {
            icon: 'el-icon-setting',
            title: 'Settings',
            name: 'Settings'
          },
        },
      ]
    }
  },
  methods: {}
  ,
  computed: {}
}
</script>

<style scoped>
#sidebar-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

#sidebar-container > div {
  width: 100%;
}

::v-deep.el-menu {
  border: none;
}
</style>
