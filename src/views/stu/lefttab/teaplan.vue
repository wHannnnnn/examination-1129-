<template>
    <div>
    <p @click="ashow">asd</p>
    <el-dialog :before-close="handleClose" title="创建学科" :visible.sync="knowPointsShow">
      <el-form :model="CJPointsForm" :rules="rules" ref="CJPointsForm">
        <el-form-item label="学科名称">
          <el-input v-model="CJPointsForm.name" autocomplete="off" placeholder="请输入学科名称"></el-input>
        </el-form-item>
        <el-form-item label="学科编号">
          <el-input v-model="CJPointsForm.khId" autocomplete="off" placeholder="请输入学科编号"></el-input>
        </el-form-item>

        <el-form-item label="科目描述">
          <el-input v-model="CJPointsForm.content" autocomplete="off" placeholder="请输入科目描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="CJsubmint('CJPointsForm')">立即创建</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
            knowPointsShow: false,
            CJPointsForm: {
                name: '',
                khId: null,
                content: '',
                createUserID: null,
                createTime: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入学科名称', trigger: 'change' }
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                khId: [
                    { required: true, message: '请输入学科编号', trigger: 'change' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'change' }
                ]          
            },
        }
    },
    methods: {
        handleClose(){
            this.knowPointsShow = false
            this.CJPointsForm= {
            name: '',
            khId: '',
            content: '',
            createUserID: null,
            createTime: ''
            }
        },
        ashow(){
            this.knowPointsShow = true
        }
    },
}
</script>