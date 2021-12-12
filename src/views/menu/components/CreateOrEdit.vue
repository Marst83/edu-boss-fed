<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="菜单名称" prop="name" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href" required>
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId" required>
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option :value="-1" label="无上级菜单"></el-option>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in parentMenuList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description" required>
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon" required>
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="shown" required>
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum" required>
          <el-input-number
            v-model="form.orderNum"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="isLoading"
            >提交</el-button
          >
          <el-button
            v-if="!isEdit"
            @click="resetForm('form')"
            :loading="isLoading"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdateMenu, getEditMenuInfo } from '@/services/menu'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'MenuCreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        parentId: -1, // -1 表示没有上级菜单
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: false
      },
      parentMenuList: [], // 父级菜单列表
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        href: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入图标', trigger: 'blur' }],
        orderNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        shown: [{ required: true, message: '请输入是否显示', trigger: 'blur' }],
        parentId: [
          { required: true, message: '请输入上级菜单', trigger: 'blur' }
        ]
      },
      isLoading: false
    }
  },

  created() {
    this.loadMenuInfo()
  },

  methods: {
    async loadMenuInfo() {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1)
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo
      }
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
      }
    },

    async onSubmit() {
      try {
        this.isLoading = true
        // 1. 表单验证
        await (this.$refs.form as Form).validate()
        // 2. 验证通过，提交表单
        const { data } = await createOrUpdateMenu(this.form)
        if (data.code === '000000') {
          this.$message.success('提交成功')
          this.$router.back()
        }
      } catch (error) {
        this.$message.error('提交失败')
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    resetForm(formName: string) {
      const form = this.$refs[formName] as Form
      form.resetFields()
    }
  }
})
</script>

<style lang="scss" scoped></style>
