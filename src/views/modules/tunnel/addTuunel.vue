<template>
  <div class="tab-contain">
    <el-row>
      <el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm" label-position="left">
        <el-row>
          <h5>转发代理配置</h5>
          <el-col :span="10">
            <el-form-item label="连接名" prop="name" :rules="required">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="本地端口号" prop="src_port" :rules="portValid">
              <el-input v-model="form.src_port"></el-input>
            </el-form-item>
          </el-col>

          <el-col :offset="2" :span="10">
            <el-form-item label="目标服务地址" prop="dst_host" :rules="ipValid">
              <el-input v-model="form.dst_host"></el-input>
            </el-form-item>

            <el-form-item label="目标服务端口号" prop="dst_port" :rules="portValid">
              <el-input v-model="form.dst_port"></el-input>
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

        <el-form-item>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
          <el-button type="success" @click="test">测 试</el-button>
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
        src_port: 3307,
        ssh_host: '',
        dst_host: '',
        dst_port: null,
        ssh_port: null,
        ssh_user_name: '',
        ssh_password: '',
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
      let sql = `SELECT * FROM "main"."tunnel_ssh_config" WHERE "id" = ${this.$route.query.id}`
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
    getSql() {
      if (this.form.id) {
        return `UPDATE "main"."tunnel_ssh_config"
         SET "name" = '${this.form.name}',
        "src_port" = '${this.form.src_port}',
        "dst_host" = '${this.form.dst_host}',
        "dst_port" = '${this.form.dst_port}',
        "ssh_host" = '${this.form.ssh_host}',
        "ssh_port" = '${this.form.ssh_port}',
        "ssh_user_name" = '${this.form.ssh_user_name}',
        "ssh_password" = '${this.form.ssh_password}'
        WHERE
        "id" = ${this.form.id};
        `
      } else {

        return `
          INSERT INTO "main"."tunnel_ssh_config"
          ("name", "src_port", "dst_host", "dst_port", "ssh_host", "ssh_port", "ssh_user_name", "ssh_password")
          VALUES
          ("${this.form.name}",
           ${this.form.src_port},
            "${this.form.dst_host}",
            ${this.form.dst_port},
           "${this.form.ssh_host}",
           ${this.form.ssh_port},
           "${this.form.ssh_user_name}",
            "${this.form.ssh_password}"
            )
        `
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        let sql = this.getSql()

        window.sqlite.execute(sql).then(res => {
          this.$notify({
            title: res.result ? '成功' : '警告',
            message: res.msg,
            type: res.result ? 'success' : 'error',
            duration: 1500
          });
          this.$router.push({name: 'sshList'})
        })
      })
    },
    test() {
      let config = {
        sshOptions: {
          host:  this.form.ssh_host,
          port: this.form.ssh_port,
          username: this.form.ssh_user_name,
          password: this.form.ssh_password,
        },
        forwardOptions: {
          dstAddr: this.form.dst_host,
          dstPort: this.form.dst_port,
          srcPort: this.form.src_port
        }
      }
      window.ssh.connect(config).then(res => {
        if (!res.result) {
          this.$message({
            title: '失败',
            message: res.msg,
            type: 'error',
            duration: 2000
          });
          return
        }
        this.$message({
          title: '成功',
          message: res.msg,
          type: 'success',
          duration: 2000
        });
        window.ssh.close();
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
