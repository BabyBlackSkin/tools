<template>
  <el-dialog
      title="提示"
      :close-on-click-modal="closeOnclickModal"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="30%">
    <el-form ref="form" :model="form" label-width="100px" class="demo-ruleForm">
      <el-form-item
          v-for="(item, key)  in formItem"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :required="item.required"
          :rules="item.rules"
          :error="item.error"
          :show-message="item.showMessage"
          :inline-message="item.inlineMessage"
          :size="item.size"
      >
        <template slot-scope="scope">
          <template v-if="!item.type || item.type === 'input'">
            <el-input v-model:value="form[item.prop]" clearable :placeholder="item.placeholder"></el-input>
          </template>
          <template v-else-if="item.type === 'select'">
            <el-select v-model="form[item.prop]" clearable :multiple="item.options.multiple" style="width: 100%"
                       :collapse-tags="item.options.collapseTags" :placeholder="item.placeholder">
              <el-option
                  v-for="item in item.options.dataDic"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'dateTimePicker'">
            <el-date-picker
                v-model="form[item.prop]"
                :type="item.options && item.options.type ? item.options.type: 'datetime'"
                :format="item.options.format"
                :value-format="item.options.valueFormat"
                placeholder="选择日期时间">
            </el-date-picker>
          </template>

          <template v-else-if="item.type === 'upload'">
            <el-upload
                class="avatar-uploader"
                :action="item.action"
                :show-file-list="false"
                :on-success="(response, file, fileList)=>{
                  if(item.onSuccess){
                    item.onSuccess(response, file, fileList)
                  }
                }"
                :on-error="()=>{
                  this.$message.error('上传失败')
                }"
            >
              <img style="width: 100px;padding: 5px; border: 1px solid #ccc;border-radius: 5px;box-shadow: 0 0 5px #ddd"
                   v-if="form[item.prop]" :src="resourcesUrl + form[item.prop]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>
        </template>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'dialog-form',
  props: {
    closeOnclickModal: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formItem: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {

      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dialogVisible: false
    }
  },
  computed: {},
  created() {
    console.log("我是dialog")
  },
  mounted() {
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('beforeClose')
            done();
          })
          .catch(_ => {
          });
    },
    submit() {
      this.$emit('submit')
    },
    show() {
      this.dialogVisible = true
    },

    hide() {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    cancel() {
      this.hide()
      this.$emit('cancel')
    }
  }
}
</script>
<style scoped lang="scss">

</style>
