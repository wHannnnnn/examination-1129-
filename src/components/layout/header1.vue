<template>
<div style="width: 100%">
        <el-row>
                <el-col :span="5">
                    <div class="grid-content bg-purple">
                        <span class="title" @click="index" style="cursor:pointer;padding: 0 10px;">综合训练考核系统</span>
                    </div>
                </el-col>
                <el-col :span="4" style="text-align: center;">
                    <el-button @click="clickKSKS">快速进入考场</el-button>
                </el-col> 
                <el-col :span="4" style="text-align: center;">
                        <el-button @click="clickKHXL">开始我的训练</el-button>
                </el-col>  
                <el-col :span="4" style="text-align: center;">
                        <el-button @click="clickJLPT">在线交流平台</el-button>
                </el-col>  
                <el-col :span="4" style="text-align: center;">
                        <el-button @click="clickXXZL">学习资源中心</el-button>
                </el-col> 
                <el-col :span="3" style="text-align: right">
                    <el-dropdown  v-if="this.studentLoginUser&&this.studentLoginUser!=null" style="position: relative;top:8px">
                        <el-tooltip class="item" effect="dark" :content="studentLoginUser" placement="left-end">
                            <span class="el-dropdown-link">
                                <!-- {{this.$store.state.loginUser.nickname}} -->
                                <el-avatar :size="30" :src="squareUrl"></el-avatar>
                            </span>
                        </el-tooltip>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="mine">个人中心</el-dropdown-item>
                            <el-dropdown-item @click.native="output1">退出登录</el-dropdown-item>
                            <el-dropdown-item v-if="this.$store.state.role !== 'STUDENT'" @click.native="tealogin">进入后台</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown @command='change' trigger="click">
                            <span class="el-dropdown-link">
                            <!-- {{this.$store.state.loginUser.nickname}} -->
                            换肤
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>默认</el-dropdown-item>
                                <el-dropdown-item command="theme1">背景一</el-dropdown-item>
                            </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
        </el-row>
         <el-dialog :visible.sync="loginShow" width="400px" :before-close="handleClose">
            <div class="loginDiv">
                <div style="width: 100%;text-align: center;font-size: 26px">考试中心登录页</div>
                <div style="width: 70%;margin: 10px auto">
                    <el-input
                    placeholder="请输入考生姓名"
                    prefix-icon="fa fa-address-book-o"
                    v-model="login.KSXM">
                    </el-input>
                </div>
                <div style="width: 70%;margin: 10px auto">
                    <el-input
                    placeholder="请输入准考证号"
                    prefix-icon="fa fa-sort-numeric-asc"
                    v-model="login.ZKZH">
                    </el-input>
                </div>
                <div style="width: 70%;margin: 10px auto">
                    <el-button @click.native='handlelogin()'>登录</el-button>
                </div>
            </div>
        </el-dialog>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: '',
  data () {
    return {
      loginShow: false,
        loginMsg:'登录',
        login:{
            KSXM:'',
            ZKZH:''
        },
        circleUrl:'',
        outHideList:['/blog','hot_video','/teaplan','hot_music','/hot_pic','/hot_app','/exam_plan']
    }
  },
    computed: {
        ...mapState(['loginUser']),
        ...mapState(['aId']),
        studentLoginUser(){
            return this.loginUser==null? null: this.loginUser.username
        },
        asex(){
            return this.loginUser==null? null: this.loginUser.sex
        },
        squareUrl(){
            if(this.asex == true){
                return require('../../assets/img/boy.png')
                }else {
                return require('../../assets/img/girl.png')
            }
        }
    },
  mounted() {
  },
  methods: {
    tealogin(){
        if (this.$store.state.role =='QUESTIONS_BANK_TEACHER') {
            this.$router.push({path: '/knowManagement'});
        } else {
            this.$router.push({path: '/teaindex'});
        }
    },
    index(){
        this.$router.push({path: '/'})
    },
    output1:function(){
            this.$confirm('是否退出登录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('loginUser')
                localStorage.removeItem('role')
                localStorage.removeItem('aId')
                this.$store.state.access_token = null
                this.$store.state.loginUser = null
                this.$store.state.role = null
                this.$store.state.aId = null
                this.isLogin = false;
                this.$router.push({path: '/'});
            }).catch(() => {

            });
    },
    mine(){
        this.$router.push({path:'/user'})
    },
    change(command){
        console.log(command)
        if(command){
            window.document.documentElement.setAttribute('data-theme',command)
        } else {
            window.document.documentElement.removeAttribute('data-theme','')
        }
    },
    clickKSKS(){
    //   this.$router.push({path:'/test_login'})
      this.loginShow = true
    },
    clickKHXL:function(){
      this.$router.push({path:'testTrain_test?testTrain=3'})
    },
    clickKSZX:function(){
      this.$router.push({path:'/mockExam_index'})
    },
    clickXXZL:function(){
      this.$router.push({path:'/learning_index'})
    },
    clickZXKT:function(){
      this.$router.push({path:'/classRoom_index'})
    },
    clickJLPT(){
      this.$router.push({path:'/online'})
    },
    handlelogin:function(){
        if (!this.login.KSXM || !this.login.ZKZH) {
        this.$message.error('信息填写不完整')
        return ;
        }
        var params = {
            ticket:this.login.ZKZH,
            realName:this.login.KSXM,
            rel:true
        }
        this.$axiosStuRes('post',this.$axiosURL.e_examination+ 'loginExam',params).then((res)=>{
            console.log(res);
            if (res.message) {
            this.$message.error(res.message)
            return
            }
            // this.$store.state.isTset = true
            // this.$store.state.ticket = this.login.ZKZH
            // this.$store.state.realName = this.login.KSXM
            localStorage.setItem('isTset', true)
            localStorage.setItem('ticket', this.login.ZKZH)
            localStorage.setItem('realName', this.login.KSXM)
            // this.$store.state.KSdata = res
            localStorage.setItem('KSdata', JSON.stringify(res))

            this.$axiosStuRes('get',this.$axiosURL.b_dictionarys,'').then((res)=>{
            localStorage.setItem('dictionarys', JSON.stringify(res))
            this.$store.state.dictionarys = res;
            })
            // this.$router.push({path:'/test_first'})
            const route = this.$router.resolve({name:'test_first'})
            window.open(route.href,'_blank',)
        })
        
    },
    handleClose(){
        this.loginShow = false
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.el-dropdown {
    margin-right: 15px
}
.header-right{
    text-align: right
}
</style>
