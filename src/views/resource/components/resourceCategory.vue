<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="addOrEdit(false)" :disabled="isLoading"
          >添加</el-button
        >
      </div>
      <el-table
        :data="resourcesCategory"
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading"
      >
        <el-table-column prop="id" label="编号" min-width="100">
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="180">
        </el-table-column>
        <el-table-column prop="createdTime" min-width="180" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" min-width="180" label="排序">
        </el-table-column>
        <el-table-column min-width="180" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="addOrEdit(true, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
    <create-or-edit-category
      v-if="dialogVisible.show"
      :isEdit="isEdit"
      :dialogVisible="dialogVisible"
      :editObj="editObj"
      :dialogRules="dialogRules"
      @success="onSuccess"
      @cancel="dialogVisible.show = false"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getResourceCategories,
  deleteResourceCategories,
  addOrEditResourceCategories
} from '@/services/resource-category'
import { Form } from 'element-ui'
import CreateOrEditCategory from './CreateOrEditCategory.vue'

export default Vue.extend({
  name: 'ResourceList',
  components: { CreateOrEditCategory },
  data() {
    return {
      resourcesCategory: [], // 资源列表
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第1页数据
        size: 10, // 每页大小
        categoryId: null // 资源分类
      },
      totalCount: 0,
      resourceCategories: [], // 资源分类列表
      isLoading: true, // 加载状态
      dialogVisible: {
        show: false
      },
      isEdit: false,
      editObj: {},
      dialogRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.loadResourceCategories()
  },

  methods: {
    async loadResourceCategories() {
      const { data } = await getResourceCategories()
      this.resourcesCategory = data.data
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },

    onSubmit() {
      this.form.current = 1 // 筛选查询从第 1 页开始
    },

    handleDelete(item: any) {
      this.$confirm('确定删除该资源分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteResourceCategories(item.id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadResourceCategories()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handleSizeChange(val: number) {
      this.form.size = val
      this.form.current = 1 // 每页大小改变重新查询第1页数据
      this.loadResourceCategories()
    },

    handleCurrentChange(val: number) {
      this.form.current = val // 修改要查询的页码
      this.loadResourceCategories()
    },

    onReset() {
      const form = this.$refs.form as Form
      form.resetFields()
      this.form.current = 1 // 重置回到第1页
      this.loadResourceCategories()
    },

    addOrEdit(flag: boolean, row: any) {
      this.isEdit = flag
      this.dialogVisible.show = true
      if (row) {
        this.editObj = JSON.parse(JSON.stringify(row))
      }
    },

    async onSuccess(param: any) {
      await addOrEditResourceCategories(param)
      this.$message.success('操作成功')
      this.dialogVisible.show = false // 关闭对话框
      this.loadResourceCategories() // 重新加载数据列表
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
