<template>
<div class="rightLogin">
    <div class="right-top">

        <el-dropdown trigger="click" @command='change' class="loginuser" v-if="!this.$store.state.aId||this.$store.state.aId==null">
            <span class="el-dropdown-link">
                <i class="el-icon-user">{{aloginUser}}</i><i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="学生">学生</el-dropdown-item>
                <el-dropdown-item command="教师">教师</el-dropdown-item>
                <a :href="this.$BASEURL + '/api-b/index.html'" target="_blank"><el-dropdown-item command="运维">运维</el-dropdown-item></a>
            </el-dropdown-menu>
        </el-dropdown>

        <div v-if="!this.$store.state.aId||this.$store.state.aId==null">
            <div style="margin: 0px auto">
                <el-input
                placeholder="请输入用户名"
                prefix-icon="fa fa-address-book-o"
                @keyup.enter.native="login"
                v-model="loginInfo.name">
                </el-input>
            </div>
            <div style="margin-top: 30px;">
                <el-input
                placeholder="请输入密码"
                type='password'
                prefix-icon="fa fa-sort-numeric-asc"
                @keyup.enter.native="login"
                v-model="loginInfo.password">
                </el-input>
            </div>
            <el-row style="margin: 30px 0;">
                <el-col :span='15'>
                <el-input
                    placeholder="验证码"
                    prefix-icon="fa fa-sort-numeric-asc"
                    @keyup.enter.native="login"
                    v-model="loginInfo.YZM">
                </el-input>
                </el-col>
                <el-col :span='9'>
                <div class="YZimg">
                    <input type="button"  @click="createCode" style="height: 40px;width:100%" class="verification" v-model="loginInfo.checkCode"/>
                </div>
                </el-col>
            </el-row>
            <div>
                <el-button type="primary" style='width:100%' @click='login'>登  录</el-button>
            </div>
        </div>
        <div v-if="this.$store.state.aId&&this.$store.state.aId!=null" style="text-align: center">
            <el-avatar shape="square" :size="150" :src="squareUrl"></el-avatar>
            <p style="margin-top: 10px;">用户名：{{LoginUserName}}</p>
            <p style="margin-top: 10px;"><span class="mine" @click="mine">个人中心</span><span class="mine" @click="out">退出登录</span></p>
            <p style="margin-top: 30px;" v-if="this.$store.state.role == 'STUDENT'"></p>
            <p style="margin-top: 10px;" v-if="this.$store.state.role !== 'STUDENT'"><span class="mine" @click="tealogin">进入后台</span></p>
        </div>
    </div>

    <el-card class="box-card" v-if="scrollShowArr.indexOf(this.$route.path) !== -1"  :body-style="{ padding: '10px' }">
        <div slot="header" class="clearfix">
            <span style="test-align:center">信息公告</span>
        </div>
        <vue-seamless-scroll :data="textItem" :class-option="classOption" class="table-content"  @click='hancleClick($event)'>
            <div v-for="(item,index) in textItem" class="textitem" :data-details="item" @click="itemClick(item)">
                {{item.title}}
            </div>
        </vue-seamless-scroll>
    </el-card>
    <el-dialog
        title="信息公告"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <p>标题：{{itemData.title}}</p>
        <p>内容：{{itemData.content}}</p>
        <p>时间：{{UTCtoDate(itemData.createTime)}}</p>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
    name: '',
    data () {
        return {
            loginInfo:{
                    name:'',
                    password:'',
                    YZM:'',
                    checkCode:'',
            },
            isLogin: true,
            textItem:[],
            aloginUser: '学生',
            scrollShowArr: ['/hot_video','/blog','/teaplan','/hot_music','/hot_pic','/exam_plan'],
            dialogVisible: false,
            itemData: [],
            // squareUrl: require('../../assets/img/girl.png'),
            
        }
    },
    computed: {
      classOption () {
        return {
          hoverStop: true,
        }
      },
        ...mapState(['loginUser']),
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
    methods: {
        UTCtoDate:function(date){
            return this.$tools.UTCtoDate(date)
        },
        createCode(){
            //先清空验证码的输入
            this.code = "";
            this.loginInfo.checkCode = "";
            this.loginInfo.YZM = "";
            //验证码的长度  
                var codeLength = 4; 
                //随机数 
            var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');  
            for(var i = 0; i < codeLength; i++) {
            //取得随机数的索引（0~35）
                var index = Math.floor(Math.random()*36);   
            //根据索引取得随机数加到code上
                this.code += random[index];   
                    }
                    //把code值赋给验证码  
            this.loginInfo.checkCode = this.code; 
        },
        login(){
            if (this.loginInfo.YZM.toLowerCase() != this.loginInfo.checkCode.toLowerCase()) {
                this.$message.error('验证码输入错误')
                this.createCode()
                return ;
            }
            var data = {
                username:this.loginInfo.name,
                password:this.loginInfo.password,
            }
            // 学生登录
            if(this.aloginUser == '学生'){
                this.$axiosStuResBody1('post',this.$axiosURL.student+'login',data).then((res)=>{
                    console.log(res);
                    if (res.code == '401') {
                    this.$message.error(res.error_description)
                    } else if (res.code == '400') {
                        this.$message.error('用户名或密码错误！')
                    }else{
                        this.$message.success('用户名登录成功！')
                        this.dialogLogin = false
                        localStorage.setItem('access_token', res.access_token)
                        localStorage.setItem('loginUser', JSON.stringify(res.loginUser))
                        localStorage.setItem('role', res.loginUser.sysRole.code)

                        this.$store.state.loginUser = res.loginUser
                        this.$store.state.role = res.loginUser.sysRole.code;
                        this.$store.state.access_token = res.access_token;
                        this.LoginUserName = res.loginUser.username
    
                        this.$axiosStuRes('get',this.$axiosURL.b_dictionarys,'').then((res)=>{
                            localStorage.setItem('dictionarys', JSON.stringify(res))
                            this.$store.state.dictionarys = res;
                        })
                        this.isLogin = true;
                        this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+ 'find/' + res.loginUser.id).then((res)=>{
                            localStorage.setItem('aId', JSON.stringify(res.id))
                            this.$store.state.aId = res.id
                            // this.$router.push({path:'/'})
                        })
                        
                    }
                    this.createCode()
                })
            }
            if(this.aloginUser == '教师'){
                this.$axiosPost(this.$axiosURL.system + 'login',data).then((data)=>{
                    if (data.code == '401') {
                    this.$message.error(data.error_description)
                    this.createCode()
                    } else if(data.code == '400'){
                    this.$message.error('密码错误')
                    this.createCode()
                    }else if(data.loginUser.sysRole.code == 'STUDENT'){
                    this.$message.error('密码错误')
                    this.createCode()
                    }else{
                    if (data.access_token) {
                        localStorage.setItem('access_token', data.access_token)
                        localStorage.setItem('loginUser', JSON.stringify(data.loginUser))
                        localStorage.setItem('role', data.loginUser.sysRole.code)

                        this.$store.state.login = true;
                        this.$store.state.loginUser = data.loginUser
                        this.$store.state.role = data.loginUser.sysRole.code;
                        this.$store.state.access_token = data.access_token;
                        this.LoginUserName = data.loginUser.username
                        this.isLogin = true;
                        // this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+ 'find/' + res.loginUser.id).then((res)=>{
                        this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+ 'find/' + data.loginUser.id).then((res)=>{
                            localStorage.setItem('aId', JSON.stringify(res.id))
                            this.$store.state.aId = res.id
                            // this.$router.push({path:'/'})
                        })

                        this.$axiosRes('get',this.$axiosURL.b_dictionarys,{}).then((res)=>{
                            localStorage.setItem('dictionarys', JSON.stringify(res))
                            this.$store.state.dictionarys = res;
                        }).then(()=>{
                            if (this.$store.state.role =='QUESTIONS_BANK_TEACHER') {
                                this.$router.push({path: '/knowManagement'});
                            } else {
                                this.$router.push({path: '/teaindex'});
                                // const route = this.$router.resolve({path:'/teaindex'})
                                // window.open(route.href,'_blank',)
                            }
                        })
                    }
                    }
                })
            }
            // 教师登陆

        },
        tealogin(){
            if (this.$store.state.role =='QUESTIONS_BANK_TEACHER') {
                this.$router.push({path: '/knowManagement'});
            } else {
               this.$router.push({path: '/teaindex'});
            }
        },
        change(val){
            console.log(val)
            if(val == '运维'){

            }
            this.aloginUser = val
        },
        out: function () {
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
                // this.$store.state.student_login = false;
                this.isLogin = false;
            }).catch(() => {

            });
        },
        mine(){
            this.loginInfo = {
                    name:'',
                    password:'',
                    YZM:'',
                    checkCode:'',
            } 
            this.$router.push({path:'/user'})
        },
        getNews(){
            this.$axiosRes2('get', this.$axiosURL.u_notice + 'query/all?visible=3').then((res) => {
                this.textItem = res
            })
        },
        itemClick(data){
            console.log(data)
            this.itemData = data
            this.dialogVisible = true
        },
        hancleClick(event){
            console.log(event.target.dataset.details)
        }
    },
    created() {
        this.getNews()
        this.$store.state.loginUser=JSON.parse(localStorage.getItem('loginUser'))
        console.log(this.$store.state.loginUser);
        // this.$store.state.student_login = localStorage.getItem('student_login')
        this.aId = localStorage.getItem('aId')
        if (this.$store.state.loginUser) {
        this.isLogin = true
        this.LoginUserName = JSON.parse(localStorage.getItem('loginUser')).username
        }else{
        this.isLogin = false
        }
        this.createCode()
    },
}
</script>
<style lang="scss">
    .el-avatar {
        background: none
    }
</style>