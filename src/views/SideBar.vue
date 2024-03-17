<template>
  <el-container
      style="display: flex;flex-direction: column;justify-content: space-between;height: 100%;width: 100%;box-sizing: border-box;">
    <div>
      <a class="nav-item" v-for="menu in menuList" @click="route(menu.name)"
         :class="{'nav-item-active':routerName === menu.meta.name}">
        <i v-if="menu.icon" :class="menu.icon"></i>
        <span slot="title">{{ menu.title }}</span>
      </a>
    </div>
    <div>
      <a class="nav-item" @click="route('About')"
         :class="{'nav-item-active':routerName === 'About'}">
        <i class="el-icon-user"></i>
        <span slot="title">About</span>
      </a>
      <a class="nav-item" @click="route('Settings')"
         :class="{'nav-item-active':routerName === 'Settings'}">
        <i class="el-icon-setting"></i>
        <span slot="title">Settings</span>
      </a>

    </div>
  </el-container>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {
      menuList: [
        {
          name: 'HomeView',
          title: 'Home',
          icon: 'el-icon-house',
          meta: {
            name: 'HomeView'
          },
        },
        {
          name: 'sshList',
          title: '数据库SSH',
          icon: 'el-icon-connection',
          meta: {
            name: 'sshManager'
          },
        },
        // {
        //   name: 'URLCoding',
        //   title: 'URL编码与解码',
        //   icon: 'el-icon-connection',
        //   meta: {
        //     name: 'URLCoding'
        //   },
        // }
      ]
    }
  },
  methods: {
    route(name) {
      this.$router.push({name: name}).catch((e) => {
        this.$notify({
          title: '错误',
          message: '配置页不存在',
          type: 'error',
          duration: 1500
        });

      })
    }
  },
  computed: {
    routerName() {
        return this.$route.meta.name
    },
  }
}
</script>

<style scoped>

.side-bar {
  height: 100%;
  box-sizing: border-box;
  padding: 40px;

}

.nav-item {
  display: flex;
  box-sizing: border-box;
  align-content: center;
  align-items: center;
  font-size: .8rem;
  height: 32px;
  padding: 5px 40px;
  border-radius: 2px;
  margin: 2px 5px;
  cursor: pointer;
  transition: .3s all;
  position: relative;
}


.nav-item-active::before {
  content: '';
  display: inline;
  width: 2px;
  height: 50%;
  background-color: #0d5181;
  position: absolute;
  left: 0;
}
.nav-item i {
  margin-right: 10px;
}

.nav-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: #f3f3f3;
  //box-shadow: 0 0 5px rgb(206, 199, 199);
}

.nav-item-active {
  background-color: #f3f3f3;
  //box-shadow: 0 0 5px rgb(206, 199, 199);
}
</style>
