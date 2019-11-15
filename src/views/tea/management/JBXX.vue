<template>
  <div class="teatable">
      <el-row class="animated zoomIn ">
        <!--:span="20" :offset="1"-->
        <el-col  class="personal_bg" style="padding: 20px;">
          <div class="title">
            <i class="el-icon-warning"></i>  管理员基本信息
          </div>

          <el-form :model="JBXX" label-width="120px">
            <el-form-item label="登录名：">
              <span>{{JBXX.username}}</span>
            </el-form-item>
            <el-form-item label="姓名：">
              <span>{{JBXX.realname}}</span>
            </el-form-item>
            <el-form-item label="密码：">
              <span>{{JBXX.password}}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
<!--               <a href="javascript:;" @click.prevent="dialogVisiblePassword = true" class="xgmm">修改密码</a> -->
            </el-form-item>
            <el-form-item label="用户类别：">
              <span>{{JBXX.sysRole.name}}</span>
            </el-form-item>
            <el-form-item label="所在单位/岗位：">
              <span>{{JBXX.deptID}}</span>
            </el-form-item>
            <el-form-item label="关注领域：">
              <span>{{JBXX.profession}}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <!-- <a href="#" @click.prevent="editFocusAreas">编辑关注领域</a> -->
            </el-form-item>


            <!--修改密码-->
<!--             <el-dialog modal-append-to-body append-to-body lock-scroll  title="密码"
                       :visible.sync="dialogVisiblePassword" width="30%" :before-close="handleClose">
              <el-form :model="passwordForm" status-icon :rules="rules" ref="passwordForm" label-width="100px">
                <el-form-item label="密码" prop="pass">
                  <el-input type="password" v-model="passwordForm.pass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                  <el-input type="password" v-model="passwordForm.checkPass" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisiblePassword = false">取 消</el-button>
           <el-button type="primary" @click="handleNewPassword('passwordForm')">确 定</el-button>
         </span>
            </el-dialog> -->


            <!--修改关注领域-->
<!--             <el-dialog modal-append-to-body append-to-body lock-scroll  title="关注领域"
                       :visible.sync="dialogVisibleFocusAreas" width="30%" :before-close="handleClose">
              <el-form  status-icon  label-width="100px">
                <el-form-item label="关注领域">
                  <el-input v-model="changeUserFocusAreas" auto-complete="off">
                    <el-button slot="append" @click="handleNewFocusSubs"> 确定 </el-button>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-dialog> -->
          </el-form>
        </el-col>
      </el-row>
  </div>
</template>
<script>
export default {
  data(){
      return {
        JBXX: {}
      }     
    },
  methods: {

  },
  mounted:function(){
    // this.$axiosRes1('post',this.$axiosURL.u_notice+'findPage',{userId:this.$store.state.aId}).then((res)=>{
    //   // this.GRXXData = res.list
    //   console.log(res);
    // })
    console.log(this.$store.state.loginUser)
    this.JBXX = this.$store.state.loginUser
  }
}
</script>
<style scoped>
    .chart-box {
      min-height: 300px;
      background-color: #fff
    }
    .xgmm {
      color: #26daef
    }
</style>