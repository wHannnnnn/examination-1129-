<template>
  <div class="teatable">
    <el-row type="flex">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item label="考生姓名">
          <el-input v-model="formInline.username" placeholder="考生姓名"></el-input>
        </el-form-item>
        <el-form-item label="部门/年级">
          <el-select v-model="formInline.deptID" placeholder="部门/年级">
           <el-option
              v-for="item in initDepts"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科/行业">
          <el-select v-model="formInline.profession" placeholder="学科/行业">
            <el-option
              v-for="item in initProfession"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row type="flex" style="margin-bottom: 10px">
        <unit_button :msg='XJ' @click.native='createStu'></unit_button>
        <unit_button :msg='PLDR' @click.native='inputStu'></unit_button>
        <unit_button :msg='DC' @click.native='studentOut'></unit_button>
        <unit_button :msg='XSXSZ' @click.native='clickXSXSZ'></unit_button>
    </el-row>

    <el-table
        ref="multipleTable"
        :data="tableData"
        border
        size='mini'
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="id"
          type="selection"
          width="50"> 
        </el-table-column>
        <!-- <el-table-column prop="headImgUrl" label="头像" :key="Math.random()" v-if='columnIsShow(1)'>
           <template slot-scope="scope">
            <img :src="scope.row.headImgUrl" >
          </template>
        </el-table-column> -->
        <el-table-column prop="username" label="用户名" :key="Math.random()" v-if='columnIsShow(2)'>
        </el-table-column>
        <!-- <el-table-column  prop="nickname"  label="昵称" :key="Math.random()" v-if='columnIsShow(3)'>
        </el-table-column> -->
        <el-table-column  prop="realname"  label="真实姓名" :key="Math.random()" v-if='columnIsShow(4)'>
        </el-table-column>
        <el-table-column  prop="sex"  label="性别" :key="Math.random()" v-if='columnIsShow(5)'>
          <template slot-scope="scope">
            {{ scope.row.sex==true ? '男' : scope.row.sex==false ?'女':'' }}
          </template>
        </el-table-column>
        <el-table-column  prop="age"  label="年龄" :key="Math.random()" v-if='columnIsShow(6)'>
        </el-table-column>
        <el-table-column  prop="dept"  label="部门" :key="Math.random()" v-if='columnIsShow(7)'>
        </el-table-column>
        <el-table-column  prop="email"  label="电子邮件" :key="Math.random()" v-if='columnIsShow(8)'>
        </el-table-column>
        <el-table-column  prop="phone"  label="手机号" :key="Math.random()" v-if='columnIsShow(9)'>
        </el-table-column>
        <el-table-column  prop="enabled"  label="状态" :key="Math.random()" v-if='columnIsShow(10)'>
           <template slot-scope="scope">
            {{ scope.row.enabled==true ? '可用' : '不可用' }}
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column  prop="profession"  label="学科/行业" :key="Math.random()" v-if='columnIsShow(12)'>
        </el-table-column>
        <el-table-column  prop="updateTime"  label="修改时间" :key="Math.random()" v-if='columnIsShow(15)'>
          <template slot-scope="scope">
            {{UTCtoDate(scope.row.updateTime)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="edit"
              @click="handleLook(scope.$index, scope.row)">详情
            </el-button>
            <el-button
              size="mini"
              type="warning"
              icon="edit"
              :disabled="scope.row.enabled!=true"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              :type="scope.row.enabled==true?'danger':''"
              @click="handleEnabled(scope.$index, scope.row)">启/停
            </el-button>
          </template>
        </el-table-column>
    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

  <el-dialog
    title="学生信息"
    :visible.sync="dialogVisible"
    width="50%"
    :close-on-click-modal=false
    :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :disabled="pointType == 'look'">
        <!-- 登录信息 -->
          <el-row>
            <el-col :span="4">
              <el-tag>登录信息</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="登录名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="pointType != 'look'">
              <el-form-item label="密码" prop="password" >
                <el-input v-model="ruleForm.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="pointType != 'look'">
              <el-form-item label="确认密码" prop="passwordQR">
                <el-input v-model="ruleForm.passwordQR"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 基本信息 -->
          <el-row>
            <el-col :span="4">
              <el-tag>基本信息</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="realname">
                <el-input v-model="ruleForm.realname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="ruleForm.sex" placeholder="性别">
                  <el-option label="男" :value='true'></el-option>
                  <el-option label="女" :value='false'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄" prop="age">
                <el-input type='number' min='1' v-model="ruleForm.age"></el-input>
              </el-form-item>            
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门/年级" prop="deptID">
                <el-select v-model="ruleForm.deptID" placeholder="部门/年级">
                  <el-option
                    v-for="item in initDepts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="邮箱" prop="email">
                <el-input type="email" v-model="ruleForm.email"></el-input>
              </el-form-item>            
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="学科/行业" prop="profession">
                <el-select v-model="ruleForm.profession" placeholder="学科/行业">
                  <el-option
                    v-for="item in initProfession"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>            
            </el-col>
          </el-row>
        </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button  @click='clearnForm'>取 消</el-button>
      <el-button type="primary" v-if="pointType == 'create'" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button type="primary"  v-if="pointType == 'edit'" @click="changeForm('ruleForm')">确定更改</el-button>
    </span>
  </el-dialog>
   </el-dialog>
      <el-dialog
      title="显示项设置"
      :visible.sync="dialogVisibleXSXSZ"
      width="560px">
         <el-transfer
          v-model="XSXSZdata1"
          :titles="['隐藏项', '显示项']"
          :props="{
            key: 'key',
            label: 'desc'
          }"
          :data="XSXSZdata">
        </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleXSXSZ = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="学生批量导入"
      :visible.sync="dialogVisibleXSDR"
      width="30%"
      :before-close="handleCloseXSDR">
      <el-form :inline="true" :model="studentInput" class="demo-form-inline" size="mini">
       <el-form-item label="部门/年级">
          <el-select v-model="studentInput.deptID" placeholder="部门/年级">
           <el-option
              v-for="item in initDepts"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科/行业">
          <el-select v-model="studentInput.profession" placeholder="学科/行业">
            <el-option
              v-for="item in initProfession"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-demo"
        :headers="headers"
        :action="this.$axiosURL.u_user+'users/upStu/'+this.studentInput.deptID+'/'+this.studentInput.profession"
        :on-success='uploadSuccess'
        :before-upload="beforeUpload"
        accept=".xls,.xlsx"
        ref="upload"
        >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    var checkPhone = (rule,value,callback)=>{
      const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error('请输入正确手机号'))
      }
    }
      return {
        pageNum:1,  //页码
        pageSize:10,  //每页数量
        total:20,   //总数
        XSXSZdata:[{key:2,desc:'用户名'},{key:4,desc:'真实姓名'},{key:5,desc:'性别'},{key:6,desc:'年龄'},{key:7,desc:'部门'},{key:8,desc:'电子邮件'},{key:9,desc:'手机号'},{key:10,desc:'状态'},{key:12,desc:'学科/行业'},{key:15,desc:'修改时间'}],
        XSXSZdata1:[2,4,5,7,8,9,10],
        //按钮名称
        PLDR:'批量导入',
        DC:'导出',
        XSXSZ:'显示项设置',
        XJ:'新建考生',
        pointType:null, //弹框点击状态
        // table查询
        formInline: {
          username: '',  //姓名
          deptID: '',  //年级
          profession: ''  //学科
        },
        studentInput:{
          deptID: '',  //年级
          profession: ''  //学科
        },
        initDepts:[], //初始化部门
        initDepts1:'', //临时初始化部门，更改table 的ID
        initProfession:{}, //初始化行业
        listLoading: false,
        dialogVisible: false,
        dialogVisibleXSXSZ: false,
        dialogVisibleXSDR: false,
        // 表格内容
        tableData:null,
        // 表单内容
        ruleForm: {
          id:'',       //更改时需要
          enabled:'',  //更改时需要
          username: '',
          password: '',
          passwordQR: '',
          realname: '',
          sex: '',
          profession: '',
          phone: '',
          deptID: '',
          email: '',
          age:''
          },
          multioleSelection:[],
          headers:{'Authorization':'Bearer '+this.getlocalStorage()},
          // 提示错误信息
        rules: {
          username: [
            { required: true, message: '请输入登录名', trigger: 'change' },
            { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
          ],
          passwordQR: [
            { required: true, message: '请确认密码', trigger: 'change' }
          ],
          realname: [
            { required: true, message: '请输入姓名', trigger: 'change' }
          ],
          age: [
            { required: true, message: '请输入年龄', trigger: 'change' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          profession: [
            { required: true, message: '请选择学科/行业', trigger: 'change' }
          ],
          phone: [
            { required: true, message: '请填写手机号', trigger: 'change' },
            { validator:checkPhone, message: '请填写正确的手机号', trigger: 'change' }
          ],
          deptID: [
            { required: true, message: '请选择部门/年级', trigger: 'change' }
          ],
          email: [
            { required: true, message: '请填写邮箱', trigger: 'change' },
            { type:'email', message: '请填写正确的邮箱地址', trigger: 'change' }
          ]
        }
      }     
    },
  methods: {
    UTCtoDate:function (timestamp) {
      var date = new Date(timestamp)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.date.getMonth() + 1) + '-'
      var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
      var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    inputStu:function(){
      this.dialogVisibleXSDR = true
      this.studentInput = {deptID: '',profession: ''}
    },
    beforeUpload:function(){
      if (this.studentInput.deptID&&this.studentInput.profession) {
        return true
      } else {
        this.$message.error('请先填写部门及学科信息');
        return false
      }
      
    },
    uploadSuccess:function(response){
      console.log(33,response);
      if (response) {
        this.$message.success('导入成功')
      } else {
        this.$message.success('导入失败')
      }
      this.$refs['upload'].clearFiles();
      this.dialogVisibleXSDR = false
      this.findPaperPage()
    },

    getlocalStorage:function(){
      if (!localStorage.getItem('access_token')) {
        return ''
      }
      return localStorage.getItem('access_token');
    },
    studentOut:function(){
      console.log(this.multioleSelection);
      this.$axiosDownload2(this.$axiosURL.u_users+'expExcel',this.multioleSelection).then((res)=>{
        if (!res) {
            return
          }
          console.log(res);
          let url = window.URL.createObjectURL(new Blob([res]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url 
          link.setAttribute('download', 'STU.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
      })
      // var url = this.$axiosURL.u_anon+'expExcel?'+JSON.param(this.multioleSelection)
      // window.location.href = url
    },
    clearnForm :function(){
      this.$refs['ruleForm'].resetFields();
      this.dialogVisible = false
    },
    createStu:function(){
      this.ruleForm = {username: '',password: '',passwordQR:'',realname:'',sex:'',profession:'',phone:'',deptID:'',email:'',age:''}
      this.pointType = 'create'
      this.dialogVisible = true;
    },
    clickXSXSZ:function(){
        this.dialogVisibleXSXSZ = true;
      },
    columnIsShow:function(num){
        return $.inArray(num,this.XSXSZdata1)<0 ? false : true;
      },
      handleSelectionChange(val){
        this.multioleSelection = val
      },
      handleLook(index, row){
        this.ruleForm = {username: '',password: '',passwordQR:'',realname:'',sex:'',profession:'',phone:'',deptID:'',email:'',age:''}
        this.pointType = 'look';
        this.dialogVisible = true;
        this.ruleForm = {
          username: row.username,
          password: row.password,
          passwordQR: row.passwordQR,
          realname: row.realname,
          sex: row.sex,
          profession: row.profession,
          phone: row.phone,
          deptID: row.deptID,
          email: row.email,
          age: row.age
        }
      },
      handleEdit(index, row){
        this.ruleForm = {username: '',password: '',passwordQR:'',realname:'',sex:'',profession:'',phone:'',deptID:'',email:'',age:''}
        this.pointType = 'edit';
        this.dialogVisible = true;
        this.ruleForm = {
          id:row.id,
          enabled:row.enabled,
          username: row.username,
          password: '',
          passwordQR: '',
          realname: row.realname,
          sex: row.sex,
          profession: row.profession,
          phone: row.phone,
          deptID: row.deptID,
          email: row.email,
          age: row.age
        }
      },

      handleEnabled:function(index, row){
        this.$axiosPost(this.$axiosURL.u_user+'users/toggleUserEnabled',{'userId':row.id+''}).then((res)=>{
            this.findPaperPage()
        })
      },
      handleRoleConfig(index, row){

      },
      handleSizeChange(val) {
        this.pageNum = 1
        this.pageSize = val
        this.findPaperPage()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.findPaperPage()
      },
      // 右上角X
      handleClose(){
        this.clearnForm();
      },
      handleCloseXSDR(){
        this.dialogVisibleXSDR = false
      },
      onSubmit(){
        this.findPaperPage()
      },
      paperExport(index, row){

      },
      addOrUpdateHandle(){
        this.dialogVisible = true;
      },
      // 表单创建
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.password != this.ruleForm.passwordQR) {
                this.$message.error('两次输入密码不匹配')
                return false;
            }
             var param ={
                roleID:3, //必填项
                //deptID:1, //必填项
                username: this.ruleForm.username,
                password: this.ruleForm.password,
                realname: this.ruleForm.realname,
                sex: this.ruleForm.sex,
                profession: this.ruleForm.profession,
                phone: this.ruleForm.phone,
                deptID: this.ruleForm.deptID,
                email: this.ruleForm.email,
                age:this.ruleForm.age
              }
              this.$axiosResBody('post',this.$axiosURL.u_user+'users-anon/register',param).then((res)=>{
                  this.clearnForm()
                  this.findPaperPage()
                  if (res.message) {
                    this.$message.error(res.message)
                  } else {
                    this.$message.success('创建成功')
                  }

              })
              
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 表单更改
      changeForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.password != this.ruleForm.passwordQR) {
                this.$message.error('两次输入密码不匹配')
                return false;
            }
             var param ={
                enabled:this.ruleForm.enabled ,  //必填项
                roleID:1, //必填项
                id:this.ruleForm.id ,  //必填项
                username: this.ruleForm.username,
                password: this.ruleForm.password,
                realname: this.ruleForm.realname,
                sex: this.ruleForm.sex,
                profession: this.ruleForm.profession,
                phone: this.ruleForm.phone,
                deptID: this.ruleForm.deptID,
                email: this.ruleForm.email
              }
              this.$axiosResBody('put',this.$axiosURL.u_user+'users',param).then((res)=>{
                  this.clearnForm()
                  this.findPaperPage()
                  if (res.message) {
                    this.$message.error(res.message)
                  } else {
                    this.$message.success('创建成功')
                  }
              })
              
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      //tableData查询
      findPaperPage:function(){
        var param ={
          username:this.formInline.username,
          deptId:this.formInline.deptID,
          profession:this.formInline.profession,
          start:(this.pageNum-1) * this.pageSize,
          length:this.pageSize,
          type:3
        }
        this.tableData = []
        this.$axiosGet(this.$axiosURL.u_user+'users',param).then((res)=>{
            res.data.forEach((element, index)=> {
              var a = JSON.parse(this.initDepts1).find((element1)=>{
                return element1.id == element.deptID
              })
              element['dept'] = a?a.name:''
              this.tableData.push(element)
            });
            this.total = res.total
        })
      }
  },
  mounted:function(){
    
    //初始化部门
    this.$axiosGet(this.$axiosURL.u_user+'depts/all',{}).then((res)=>{
      console.log(res);
      this.initDepts = res;
      this.initDepts1 = JSON.stringify(res);
      console.log(this.initDepts);
    }).then(()=>{
      this.findPaperPage()
    })
    //初始化行业
    // this.$axiosGet(this.$axiosURL.u_user+'profession/all',{}).then((res)=>{
    //   this.initProfession = res;
    // })
    this.$axiosRes('get',this.$axiosURL.k_knowledgeHierachy+'0/all',{}).then((res)=>{
      this.initProfession = res;
    })
  }
}
</script>
<style scoped>
  .el-tag {
    background-color: transparent;
    border: none;
  }
  .el-dialog__body {
      padding: 30px 60px 30px 20px;
  }
</style>