<template>
  <div class="nav">
      <el-menu :default-active="this.$store.state.role =='QUESTIONS_BANK_TEACHER'?'/knowManagement':'/home'" class="el-menu-vertical-demo" router :unique-opened='true'>
        <div v-if="this.$store.state.role =='ADMIN' ||  this.$store.state.role =='EXAM_PLAN_TEACHER'">
            <el-menu-item index="/home"><i class="el-icon-menu"></i>系统首页</el-menu-item>
            <el-menu-item index="/stuManagement"><i class="el-icon-menu"></i>考生管理</el-menu-item>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-message"></i>考核管理</template>
              <el-menu-item index="/testMaintenance">试卷信息维护</el-menu-item>
              <el-menu-item index="/examManagement">考试信息管理</el-menu-item>
              <el-menu-item index="/examScore">试卷评分</el-menu-item>
              <el-menu-item index="/examGD">试卷归档</el-menu-item>
              <el-submenu index="55">
                <template slot="title">统计分析</template>
                <el-menu-item index="/examEvaluation">试卷分析</el-menu-item>
                <el-menu-item index="/stuEvaluation">考生分析</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-message"></i>课程管理</template>
              <el-menu-item index="/kjgl">课件管理</el-menu-item>
              <!-- <el-menu-item index="/stuManagement">资料检索</el-menu-item> -->
            </el-submenu>

            <el-submenu index="3">
              <template slot="title"><i class="el-icon-message"></i>个人中心</template>
              <el-menu-item index="/jbxx">基本信息</el-menu-item>
              <el-menu-item index="/messagetz">消息通知</el-menu-item>
            </el-submenu>
        </div>
        <div v-if="this.$store.state.role =='ADMIN' || this.$store.state.role =='QUESTIONS_BANK_TEACHER'">
          <!-- 系统2 -->
          <el-menu-item index="/knowManagement"><i class="el-icon-menu"></i>知识点管理</el-menu-item>
          <el-menu-item index="/questionMaintenance" @click = "shuaxin"><i class="el-icon-menu"></i>试题管理</el-menu-item>
          <el-menu-item index="/testStatistics"><i class="el-icon-menu"></i>题库统计</el-menu-item>
        </div>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'login',
    data() {
      return {
        
      }
    },
    methods: {
      shuaxin(){
        this.$bus.$emit('shuaxin','')
      }
    }
  }
</script>>

<style>
.nav{
  background:transparent ;
  background: url('./../../assets/img/main_left.png') center center no-repeat;
  background-size: 100% 100%;
  margin:40px 40px 0px 40px;
  padding: 20px 20px;
  height: 720px;
  width: 180px;
  color: #FFF;
}
</style>