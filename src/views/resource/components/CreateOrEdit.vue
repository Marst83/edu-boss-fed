<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑资源' : '添加资源'"
      :visible.sync="dialogVisible.show"
      width="30%"
    >
      <el-form
        label-width="100px"
        class="resourceDialog"
        :rules="dialogRules"
        ref="form"
        :model="form"
      >
        <el-form-item prop="name" label="资源名称:">
          <el-input v-model="form.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="资源路径:">
          <el-input v-model="form.url" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item prop="categoryId" label="资源分类:">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择资源分类:"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in resourceCategories"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:" size="small" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            style="width: 250px"
            :rows="3"
          ></el-input>
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
    isEdit: {
      type: Boolean,
      default: false
    },
    resourceCategories: {
      type: Array
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
      form: {
        name: '',
        url: '',
        categoryId: '',
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
      this.form = this.editObj
    },

    async onSubmit() {
      try {
        await (this.$refs.form as Form).validate()
        this.$emit('success', this.form)
      } catch (error) {
        this.$message.error('提交失败')
        console.log(error)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
