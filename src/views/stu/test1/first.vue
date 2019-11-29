<template>
  <div class="ready change">
    <div class="app_header">
      <impheader></impheader>
    </div>
    <div class="top">
        <div class="top_left">
          <!-- <img :src='student.url'></img> -->
          <el-avatar :size="100" :src="student.url"></el-avatar>
        </div>
        <div class="top_right">
            <el-row>
              <el-col :span="16" class="stuexam">
                考试名称：{{test.name}}
              </el-col>
              <el-col :span="8" class="stuexam">
                考试方式：{{test.examType}}
              </el-col>
            </el-row>
          <div>
            <el-row >
              <el-col :span="8" class="stuexam">
                姓名：{{student.nickname}}
              </el-col>
              <el-col :span="8" class="stuexam">
                性别：{{student.sex?'男':'女'}}
              </el-col>
              <el-col :span="8" class="stuexam">
                部门/班级：{{student.deptName}}
              </el-col>
            </el-row>
          </div>
          <div >
            <el-row >
              <el-col :span="8" class="stuexam">
                开始时间：{{test.startTime}}
              </el-col>
              <el-col :span="8" class="stuexam">
                结束时间：{{test.endTime}}
              </el-col>
              <el-col :span="8" class="stuexam">
                考试时长：{{test.totalTime}}分钟
              </el-col>
            </el-row>
          </div>
          
        </div>
    </div>
    <div class="bottom">
      <div class="bottom_title">
        考试须知
      </div>
      <div class="KSXZ">
        <p class="bottom_title1">考试前</p>
        <p>1、考试前30分钟进入考场，考试正式开始10分钟后将不允许进入考场。</p>
        <p>2、进入考场务必出示校园IC卡、学生证或身份证（无证不得进入考场）。</p>
        <p>3、进入考场后务必关闭手机，考试过程中如手机响起将根据学校考务规定当作弊处理。</p>
        <p>4、听从监考老师提示，启动并检测电脑、确认考试帐号已注册等。</p>
        <p>5、考试前务必关闭Office文件、IE网页及其他与考试相关的软件，否则考试无法正常进行。</p>
        <p class="bottom_title1">考试</p>
        <p>1、考试中出现死机或特殊情况时，可以重启电脑或更换电脑（进入考试系统后由死机时的题目继续做题，如更换了电脑则试卷会重置并从第一题开始）。每张试卷重启的次数不能超过三次</p>
        <p>2、考试过程中如遇到有疑问的题目可以先点击“跳过”，其他题目都完成后会自动返回跳过的题目。所有题目完成后没有再检查机会。</p>
        <p>考试后</p>
        <p>1、考试结束后需举手，让监考老师检查确认成绩并正常上传，签名确认后方可离开考场。</p>
        <p>2、考试结束即时得到考试成绩，务必关闭成绩对话框，保证成绩成功上传服务器！通过者获得由美国颁发的证书。</p>
      </div>
      <div class="KS">
        <el-checkbox v-model="checked">我已阅读</el-checkbox>
      </div>
      <div class="KS">
        <b v-if='!timeZT'>距离开考时间还有{{time}}</b>
        <el-button v-if='timeZT' type="primary"  :disabled='!checked || !timeZT'  @click='joinTset'>进入考试</el-button>
      </div>
    </div>
    <div class="app_bottom">
          <bottom/>
    </div>
  </div>
</template>

<script>
import impheader from '@/components/layout/header1'
import bottom from "@/components/layout/bottom.vue"
export default {
  components:{
    impheader,bottom
  },
  data () {
    return {
      test:{
        name:JSON.parse(localStorage.getItem('KSdata')).examName,
        startTime:JSON.parse(localStorage.getItem('KSdata')).startTime,
        endTime:JSON.parse(localStorage.getItem('KSdata')).endTime,
        totalTime:JSON.parse(localStorage.getItem('KSdata')).totalTime,
        examModality:JSON.parse(localStorage.getItem('KSdata')).examModality,
        examType:JSON.parse(localStorage.getItem('KSdata')).examType,
      },
      student:{
        url:require('@/assets/img/touxiang.jpg'),
        nickname:'',
        sex:'',
        phone:'',
        email:'',
        deptName:'',
        profession:'',
      },
      time:'',
      checked:false,  //已读选中
      timeZT:false,  //倒计时是否完成
      KSdata : JSON.parse(localStorage.getItem('KSdata'))
    }
  },

  methods: {
    joinTset:function(){
      if (JSON.parse(localStorage.getItem('KSdata')).examType == '水平考试') {
        this.$router.push({path:'/test_test'})
      } else if(JSON.parse(localStorage.getItem('KSdata')).examType == '过关考试') {
        this.$router.push({path:'/test_test'})
      }else if(JSON.parse(localStorage.getItem('KSdata')).examType == '等级考试') {
        this.$router.push({path:'/test_test'})
      }
      
    },
     initData:function(){
        this.$axiosStuRes('get',this.$axiosURL.u_user+ 'users/byTicket',{ticket: localStorage.getItem('ticket')}).then((res)=>{
          console.log(res);
          this.student.nickname = res.nickname
          this.student.sex = res.sex
          this.student.phone = res.phone
          this.student.email = res.email
          this.student.deptName = res.deptName
          this.student.profession = res.profession
        })

        //倒计时
        var startTime = new Date(JSON.parse(localStorage.getItem('KSdata')).startTime).getTime()
        var endTime = new Date(JSON.parse(localStorage.getItem('KSdata')).endTime).getTime()
        //var totalTime = JSON.parse(localStorage.getItem('KSdata')).endTime * 60*1000
        var serverTime = new Date(JSON.parse(localStorage.getItem('KSdata')).serverTime).getTime()
        //是否已结束
        
        console.log(11,JSON.parse(localStorage.getItem('KSdata')));
        console.log(22,serverTime);
        if (startTime && serverTime) {
          var isOver = serverTime-endTime<= 0 ? false:true
          if (isOver) {
            this.$message({
              showClose: true,
              message: '考试已结束!',
              type: 'error',
              duration:0
            });
            return
          }

          if (startTime-serverTime <= 0 ) {
            this.timeZT = true
          }else{
            var timeC = startTime-serverTime
            var time = setInterval(()=>{
              timeC -= 1000
              this.time = this.$tools.MtoSFM(timeC/1000)
              //停止
              if (timeC<=0) {
                clearInterval(time)
                this.timeZT = true
              }
            },1000)
            var timeC = startTime-serverTime
            
          }
        }else{
          this.$message({
            showClose: true,
            message: '请重新登录考试!',
            type: 'error',
            duration:0
          });
        }
       
     }
  },
  mounted:function(){
    window.onbeforeunload=function(){
      return '确定退出考试吗？'
    }
    this.initData()
    
  },
  watch: {
    
  }

}
</script>
<style scoped>

</style>
