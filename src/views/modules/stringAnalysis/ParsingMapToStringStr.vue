<template>
  <el-container>
    <el-row>
      <el-input
          type="textarea"
          :autosize="{ minRows: 10}"
          placeholder="请输入内容"
          v-model="rowStr">
      </el-input>
    </el-row>
    <el-divider direction="vertical"></el-divider>
    <el-row>
      <el-input
          type="textarea"
          :autosize="{ minRows: 10}"
          placeholder="请输入内容"
          v-model="parseStr">
      </el-input>
    </el-row>
  </el-container>
</template>

<script>
import QuicklySearchForm from "@/components/minpoint/form/quickly-search-form.vue";
import QuicklyTable from "@/components/minpoint/table/qucikly-table.vue";
import DialogForm from "@/components/minpoint/form/dialog-form.vue";

export default {
  name: "DataBaseSSH",
  components: {DialogForm, QuicklyTable, QuicklySearchForm},
  data() {
    return {
      rowStr:'',
      parseStr:''
    }
  },
  created() {
  },
  mounted() {
    this.search()
  },
  methods: {

  },
}
</script>

<style scoped>

</style>
