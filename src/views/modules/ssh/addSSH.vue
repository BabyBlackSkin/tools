<template>
  <div class="tab-contain">
    <el-row>
      <el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm" label-position="left">
        <el-row>
          <el-col :span="10">
            <h5>代理配置</h5>
            <el-form-item label="连接名" prop="name" :rules="required">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="本地端口号" prop="service_port" :rules="portValid">
              <el-input v-model="form.service_port"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <h5>跳板机信息</h5>
            <el-form-item label="跳板机地址" prop="ssh_host" :rules="ipValid">
              <el-input v-model="form.ssh_host"></el-input>
            </el-form-item>

            <el-form-item label="跳板机端口号" prop="ssh_port" :rules="portValid">
              <el-input v-model="form.ssh_port"></el-input>
            </el-form-item>

            <el-form-item label="跳板机用户名" prop="ssh_user_name" :rules="required">
              <el-input v-model="form.ssh_user_name"></el-input>
            </el-form-item>

            <el-form-item label="跳板机密码" prop="ssh_password" :rules="required">
              <el-input v-model="form.ssh_password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <h5>目标服务器信息</h5>
          <el-col :span="10">
            <el-form-item label="数据库地址" prop="db_host" :rules="ipValid">
              <el-input v-model="form.db_host"></el-input>
            </el-form-item>

            <el-form-item label="数据库端口号" prop="db_port" :rules="portValid">
              <el-input v-model="form.db_port"></el-input>
            </el-form-item>

            <el-form-item label="数据库用户名">
              <el-input v-model="form.db_user_name"></el-input>
            </el-form-item>

            <el-form-item label="数据库密码">
              <el-input v-model="form.db_password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="数据库测试SQL映射列">
              <el-input v-model="form.test_column"></el-input>
            </el-form-item>

            <el-form-item label="数据库测试SQL">
              <el-input v-model="form.test_sql"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'dialog-form',
  data() {
    return {
      isUpt: false,
      form: {
        name: '',
        service_port: 3307,
        ssh_host: '',
        ssh_port: null,
        ssh_user_name: '',
        ssh_password: '',
        db_host: '',
        db_port: null,
        db_user_name: '',
        db_password: '',
        test_column: 'name',
        test_sql: 'SELECT * FROM mob_base.mall_info',
      },
      required: [
        {required: true, message: '必填', trigger: 'blur'},
      ],
      portValid: [
        {required: true, message: '端口号必填', trigger: 'blur'},
        {validator: this.isPort, trigger: 'blur'}
      ],
      ipValid: [
        {required: true, message: 'IP必填', trigger: 'blur'},
        {validator: this.isIP, trigger: 'blur'}
      ],
    }
  },
  computed: {},
  created() {
  },
  mounted() {
    this.isUpt = !!this.$route.query.id
    if (this.isUpt) {
      this.getById(this.$route.query.id)
    }
  },
  methods: {
    isPort(rule, value, callback) {
      const result = new RegExp('^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$').test(value)
      if (result) {
        callback();
      } else {
        callback(new Error("请输入正确的端口号(正整数，范围[0:65535])"));
      }
    },
    isIP(rule, value, callback) {
      const result = new RegExp('([1-9]?\\d|1\\d{2}|2[0-4]\\d|25[0-5])(\\.([1-9]?\\d|1\\d{2}|2[0-4]\\d|25[0-5])){3}$').test(value)
      if (result) {
        callback();
      } else {
        callback(new Error("请输入正确的IP"));
      }
    },
    getById(id) {
      let sql = `SELECT * FROM "main"."db_config" WHERE "id" = ${this.$route.query.id}`
      console.log(sql)
      window.sqlite.execute(sql).then(res => {
        if (!res.result) {
          this.$notify({
            title: '错误',
            message: res.msg,
            type: 'error',
            duration: 3000
          });
          this.$router.push({name: 'sshList'})
          return
        }
        if (!res.data || res.data.length === 0) {
          this.$notify({
            title: '错误',
            message: '数据不存在',
            type: 'error',
            duration: 3000
          });
          this.$router.push({name: 'sshList'})
          return
        }
        this.form = res.data[0]
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }

        let sql = `
          INSERT INTO "main"."db_config"
          ("name", "service_port", "ssh_host", "ssh_port", "ssh_user_name", "ssh_password", "db_host", "db_port", "db_user_name", "db_password", "test_column", "test_sql")
          VALUES
          ("${this.form.name}",
           ${this.form.service_port},
           "${this.form.ssh_host}",
           ${this.form.ssh_port},
           "${this.form.ssh_user_name}",
            "${this.form.ssh_password}",
            "${this.form.db_host}",
            ${this.form.db_port},
            "${this.form.db_user_name}",
            "${this.form.db_password}",
            "${this.form.test_column}",
            "${this.form.test_sql}");
        `
        window.sqlite.execute(sql).then(res => {
          this.$notify({
            title: res.result ? '成功' : '警告',
            message: res.msg,
            type: res.result ? 'success' : 'error',
            duration: 0
          });
          this.$router.push({name: 'sshList'})
        })
      })
    },
    cancel() {
      this.$router.push({name: 'sshList'})
    }
  },
}
</script>
<style scoped lang="scss">
h5 {
  text-indent: 20px;

  &:nth-child(n+2) {
    margin-top: 50px;
  }
}

.demo-ruleForm {
  padding-left: 20px;
}
</style>
