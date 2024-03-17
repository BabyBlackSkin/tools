<template>
  <el-form :inline="true" :model="form">
    <template v-for="item in formItemList">
      <el-form-item v-if="!item.type || item.type === 'input'"
                    :label="item.label">
        <el-input v-model="form[item.prop]" :placeholder="item.placeholder ? item.placeholder : item.label" ></el-input>
      </el-form-item>
    </template>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "quickly-search-form",
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formItemList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    search() {
      this.$emit("search")
    }
  }
}
</script>

<style scoped>

</style>
