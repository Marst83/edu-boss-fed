<template>
  <div>
    <el-card class="addOrAddAdvert">
      <el-form
        :rules="dialogRules"
        ref="form"
        label-width="120px"
        :model="form"
      >
        <el-form-item label="广告名称：" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="广告位置：" prop="spaceId">
          <el-select v-model="form.spaceId" placeholder="请选择">
            <el-option
              v-for="item in spaceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间：" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上线/下线：" prop="status">
          <el-radio v-model="form.status" :label="1">上线</el-radio>
          <el-radio v-model="form.status" :label="0">下线</el-radio>
        </el-form-item>
        <el-form-item label="广告图片：" prop="">
          <course-image v-model="form.img" />
        </el-form-item>
        <el-form-item label="广告链接：" prop="link">
          <el-input v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item label="广告备注" prop="text">
          <el-input type="textarea" v-model="form.text"></el-input>
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
import { Form } from 'element-ui'
import { saveOrUpdate } from '@/services/advert'
import CourseImage from '../course/components/CourseImage.vue'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: ['editObj', 'isEdit', 'spaceList'],
  components: {
    CourseImage
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        spaceId: 0,
        startTime: '',
        endTime: '',
        status: 0,
        img: '',
        link: '',
        text: '',
        sort: 0
      },
      dialogRules: {
        name: [{ required: true, message: '请输入广告名称', trigger: 'blur' }],
        startTime: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ],
        link: [{ required: true, message: '请输入广告名称', trigger: 'blur' }]
      }
    }
  },

  created() {
    // 如果是编辑操作，则根据角色 ID 加载展示角色信息
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
        this.$message.info('操作成功')
        this.$router.push({ name: 'advert' })
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
