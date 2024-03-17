<template>
  <div style="height: 100%">
    <div>
      <quickly-search-form :form="form" :form-item-list="formItemList"  @search="search"></quickly-search-form>
    </div>
    <div style="height: calc(100% - 65px)">
      <quickly-table :table-header="tableHeader" :table-data="tableData" :page-info="tablePageInfo"></quickly-table>
    </div>
  </div>
</template>

<script>
import QuicklySearchForm from "@/components/minpoint/form/quickly-search-form.vue";
import QuicklyTable from "@/components/minpoint/table/qucikly-table.vue";
import {Message} from "element-ui";

export default {
  name: "DataBaseSSH",
  components: {QuicklyTable, QuicklySearchForm},
  data() {
    return {
      form: {},
      formItemList: [
        {label: '名称', prop: name}
      ],
      tableHeader: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: '',
          label: '操作',
          operation: [
            {
              name: '连接',
              clickFun: this.openConnection
            },
            {
              name: '断开',
              clickFun: this.closeConnection
            },
            {
              name: '修改'
            },
            {
              name: '删除'
            }
          ]
        }
      ],
      tablePageInfo: {
        // 总页数
        pages: 0,
        // 总条数
        total: 0,
        // 页大小
        pageSize: 10,
        // 页码
        pageNum: 1
      },
      tableData: []
    }
  },
  created() {
    alert("window.myAPI：" + window.myAPI.deskTop())
    // console.log("window.myAPI：" + window.myAPI)
    // console.log("window.myApi2：" + window.myApi2)
  },
  methods: {
    search() {
      console.log(window.sqlite.selectPaging)
      // this.$dbSSH.selectPaging({}).then(res => {
      //   console.log(res)
      // }).catch(err=>{
      //   Message({
      //     message: '服务异常',
      //     type: 'error',
      //     duration: 1.5 * 1000,
      //     customClass: 'element-error-message-zindex'
      //   })
      // })
    },
    openConnection(row, index) {
      this.$post(`/dbConfig/openConnection/${row['id']}`).then(res => {
        Message({
          message: '开启成功',
          type: 'success',
          duration: 1.5 * 1000,
          customClass: 'element-error-message-zindex'
        })
      }).catch(err=>{
        Message({
          message: '开启异常',
          type: 'error',
          duration: 1.5 * 1000,
          customClass: 'element-error-message-zindex'
        })
      })
    },
    closeConnection(row, index) {
      this.$post(`/dbConfig/closeConnection/${row['id']}`).then(res => {
        Message({
          message: '关闭成功',
          type: 'success',
          duration: 1.5 * 1000,
          customClass: 'element-error-message-zindex'
        })
      }).catch(err=>{
        Message({
          message: '关闭异常',
          type: 'error',
          duration: 1.5 * 1000,
          customClass: 'element-error-message-zindex'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
