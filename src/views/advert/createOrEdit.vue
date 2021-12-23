<template>
  <div>
    <el-card class="addOrAddAdvert">
      <el-form :rules="dialogRules" ref="form" label-width="100px">
        <el-form-item label="广告名称：" prop="">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="广告位置：" prop="">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="开始时间：" prop="">
          <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="">
          <el-date-picker
            v-model="value2"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上线/下线：" prop="">
          <el-radio v-model="radio" label="1">上线</el-radio>
          <el-radio v-model="radio" label="2">下线</el-radio>
        </el-form-item>
        <el-form-item label="广告图片：" prop="">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :show-file-list="false"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }" v-if="file">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告链接：" prop="">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="广告备注" prop="">
          <el-input type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="$emit('cancel')">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    editObj: {
      type: Object
    },
    dialogRules: {
      type: Object
    }
  },
  data() {
    return {
      advert: {
        code: '',
        name: '',
        description: ''
      },
      value1: '',
      value2: '',
      radio: ''
    }
  },

  created() {
    // 如果是编辑操作，则根据角色 ID 加载展示角色信息
    this.loadRole()
  },

  methods: {
    loadRole() {
      this.advert = this.editObj
    },

    async onSubmit() {
      try {
        await (this.$refs.form as Form).validate()
        this.$emit('success', this.advert)
      } catch (error) {
        this.$message.error('提交失败')
        console.log(error)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .addOrAddAdvert .el-form-item__content {
  width: 1000px;
}
</style>
