<template>
  <el-container>
    <el-header>
      <quickly-search-form :form="form" :form-item-list="formItemList" @search="search"></quickly-search-form>
    </el-header>
    <el-header>
      <el-button @click="()=>{$router.push({name:'addSSH'})}">新增</el-button>
    </el-header>

    <el-main style="overflow: hidden">
      <quickly-table :table-header="tableHeader" :table-data="tableData" :page-info="tablePageInfo"
                     :table-prop="tableProp">
        <template v-slot:expand="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="本地端口号">
              <span>{{ scope.row.src_port }}</span>
            </el-form-item>
            <el-form-item label="目标服务地址">
              <span>{{ scope.row.dst_host }}</span>
            </el-form-item>
            <el-form-item label="目标服务端口号">
              <span>{{ scope.row.dst_port }}</span>
            </el-form-item>
            <el-form-item label="跳板机地址">
              <span>{{ scope.row.ssh_host }}</span>
            </el-form-item>
            <el-form-item label="跳板机端口号">
              <span>{{ scope.row.ssh_user_name }}</span>
            </el-form-item>
          </el-form>
        </template>
        <template v-slot:statusSlot="scope">
          <el-tag type="info" v-if="!scope.row.status || scope.row.status === 0">断开</el-tag>
          <el-tag type="success" v-if="scope.row.status === 1">Port:{{ scope.row.src_port }}</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 2">连接失败</el-tag>
        </template>
      </quickly-table>
    </el-main>
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
      demoDialog: false,
      form: {
        name:''
      },
      formItemList: [
        {label: '名称', prop: 'name'}
      ],
      tableProp: {
        expand: true
      },
      tableHeader: [
        {prop: 'name', label: '名称'},
        {prop: 'status', label: '状态', slot: 'statusSlot'},
        {
          prop: '',
          label: '操作',
          operation: [
            {
              name: '连接',
              btnType: 'success',
              clickFun: this.openConnection,
              format: (row) => {
                return !row.status || row.status === 0 || row.status === 2
              }
            },
            {
              name: '断开',
              btnType: 'danger',
              clickFun: this.closeConnection,
              format: (row) => {
                return row.status === 1
              }
            },
            {
              name: '修改',
              clickFun: this.getByIdForUpt,
            },
            {
              name: '删除',
              clickFun: this.delById,
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
      tableData: [],

    }
  },
  created() {
  },
  mounted() {
    this.search()
  },
  methods: {
    search() {
      let sql = 'SELECT * FROM "main"."tunnel_ssh_config"'
      if(this.form.name){
        sql = `${sql} where name LIKE '%${this.form.name}%'`
      }
      console.log(sql)
      window.sqlite.execute(sql).then(res => {
        if (!res.result) {
          this.$notify({
            title: '查询失败',
            message: res.msg,
            type: 'error',
            duration: 0
          });
          return
        }
        for (let c of res.data) {
          c.status = 0
        }
        this.tableData = res.data
      })
    },
    openConnection(row, index) {
      let config = {
        sshOptions: {
          host: row.ssh_host,
          port: row.ssh_port,
          username: row.ssh_user_name,
          password: row.ssh_password,
        },
        forwardOptions: {
          dstAddr: row.dst_host,
          dstPort: row.dst_port,
          srcPort: row.src_port
        }
      }
      window.ssh.connect(config).then(res => {
        this.$notify({
          title: res.result ? '成功' : '警告',
          message: res.msg,
          type: res.result ? 'success' : 'error',
          duration: 2000
        });
        row.status = res.result ? 1 : 2
      })
    },
    closeConnection(row, index) {
      window.ssh.close().then(res => {
        this.$notify({
          title: res.result ? '已断开' : '断开失败',
          message: res.msg,
          type: res.result ? 'warning' : 'error',
          duration: 2000
        });
        row.status = 0
      })
    },
    getByIdForUpt(row, $index) {
      this.$router.push({name: 'addSSH', query: {id: row.id}})
    },
    delById(row, $index) {
      let sql = `DELETE FROM "main"."tunnel_ssh_config" WHERE "id" = ${row.id}`
      window.sqlite.execute(sql).then(res => {
        this.$notify({
          title: res.result ? '删除成功' : '删除失败',
          message: res.msg,
          type: res.result ? 'success' : 'error',
          duration: 2000
        });
        this.search()
      })
    }
  },
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  box-sizing: border-box;
  padding: 0 10%;
}

.el-form-item__content {
  color: #a0a0a0;
}
</style>
