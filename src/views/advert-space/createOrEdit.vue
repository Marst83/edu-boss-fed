<template>
  <div>
    <el-card class="addOrAddAdvert">
      <el-form
        ref="form"
        :rules="dialogRules"
        label-width="120px"
        :model="form"
      >
        <el-form-item label="广告位名称：" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdate } from '@/services/advert-space'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CreateOrEditAdSpace',
  props: ['editObj', 'isEdit'],
  data() {
    return {
      form: {
        name: ''
      },
      name: '1',
      dialogRules: {
        name: [{ required: true, message: '请输入广告位名称', trigger: 'blur' }]
      }
    }
  },

  created() {
    if (this.isEdit === '1') {
      this.loadRole()
    }
  },

  methods: {
    loadRole() {
      this.form = this.editObj
    },

    async onSubmit() {
      try {
        await this.$confirm('确认提交？', '提示')
        await (this.$refs.form as Form).validate()
        await saveOrUpdate(this.form)
        this.$router.push({ name: 'addAdvertise' })
      } catch (error) {
        if (error === 'cancel') {
          this.$message.info('取消操作')
        } else {
          this.$message.error('操作失败')
          console.log(error)
        }
      }
    },
    reset() {
      const r = (this.$refs.form as Form).resetFields()
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .addOrAddAdvert .el-form-item__content {
  width: 1000px;
}
</style>
