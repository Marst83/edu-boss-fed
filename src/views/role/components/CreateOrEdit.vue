<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible.show"
      width="50%"
    >
      <el-form :rules="dialogRules" ref="form" :model="role">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="role.code"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input type="textarea" v-model="role.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="$emit('cancel')">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    roleId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    editObj: {
      type: Object
    },
    dialogVisible: {
      type: Object
    },
    dialogRules: {
      type: Object
    }
  },
  data() {
    return {
      role: {
        code: '',
        name: '',
        description: ''
      }
    }
  },

  created() {
    // 如果是编辑操作，则根据角色 ID 加载展示角色信息
    if (this.isEdit) {
      this.loadRole()
    }
  },

  methods: {
    loadRole() {
      this.role = this.editObj
    },

    async onSubmit() {
      try {
        await (this.$refs.form as Form).validate()
        this.$emit('success', this.role)
      } catch (error) {
        this.$message.error('提交失败')
        console.log(error)
      }
    }
  }
})
</script>

<style lang="scss" scoped></style>
