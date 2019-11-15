<template>
  <div class="testTrain change">
    <div class="app_header">
        <impheader></impheader>
    </div>
      <el-menu class="el-menu-vertical-demo" default-active="/testTrain_test?testTrain=3" mode="horizontal" router :unique-opened='true' @select="handleOpen">

          <el-menu-item index="/testTrain_test?testTrain=3"><i class="el-icon-menu"></i>日常训练</el-menu-item>
          <el-menu-item index="/testTrain_test?testTrain=2"><i class="el-icon-menu"></i>错题训练</el-menu-item>
          <el-menu-item index="/testTrain_test?testTrain=4"><i class="el-icon-menu"></i>难题训练</el-menu-item>
          <el-menu-item index="/mockExam_index"><i class="el-icon-menu"></i>模拟考试</el-menu-item>
      </el-menu>
      <div class="content-center">
          <transition
          name="custom-classes-transition"
          enter-active-class="animated slideInRight">
              <router-view v-if="isAlive"></router-view>
          </transition>
      </div>
  </div>
</template>

<script>
import impheader from '@/components/layout/header1'
export default {
  name: 'index',
  components:{
    impheader
  },
  data () {
    return {
      isAlive: true
    }
  },

  methods: {
    handleOpen(key, keyPath){
      console.log(this.$route.path)
      this.isAlive = false
      this.$nextTick(()=>{
        this.isAlive = true
      })
    },
    clickImg1:function(){

    },
    clickImg2:function(){
      sessionStorage.setItem('testTrain',2)
      // const route = this.$router.resolve({name:'testTrain_test'})
      // window.open(route.href,'_blank',)
    },
    clickImg3:function(){
      sessionStorage.setItem('testTrain',3)
      const route = this.$router.resolve({name:'testTrain_test'})
      window.open(route.href,'_blank',)
    },
    clickImg4:function(){
      sessionStorage.setItem('testTrain',4)
      const route = this.$router.resolve({name:'testTrain_test'})
      window.open(route.href,'_blank',)
    },
  },
 
  created:function(){
    
  },
  mounted:function(){
    
    
    
  },


}
</script>


<style scoped>
/* .testTrain{
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  min-height: max-content;
  min-height: -moz-max-content;
} */
.top{
  margin: 0 auto;
  margin-top: 110px;
  width: 110px;
  height: 110px;
  background: url('./../../../assets/img/train/top.png') center center no-repeat;
  background-size: 100% 100%;
}
.center{
  margin: 0 auto;
  margin-top: 80px;
  width: 510px;
  height: 360px;
  color: #55be82;
  font-size: 38px;
  padding-top: 150px;
  background: url('./../../../assets/img/train/center.png') center center no-repeat;
  background-size: 100% 100%;
}
.ZTXL{
  position: absolute;
  top: 550px;
  left: 6%;
  height: 150px;
  width: 450px;
  text-align: right;
  color: #44bdf4;
}
.img{
  width: 150px;
  height: 115px;
  padding-top: 35px;
  background: url('./../../../assets/img/train/back1.png') center center no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.img:hover{
  width: 150px;
  height: 115px;
  padding-top: 35px;
  background: url('./../../../assets/img/train/back.png') center center no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.ZTXLicon{
  margin: 0 auto;
  width: 80px;
  height: 80px;
  background: url('./../../../assets/img/train/3.png') center center no-repeat;
  background-size: 100% 100%;
}


.CTXL{
  position: absolute;
  top: 350px;
  left: 14%;
  height: 150px;
  width: 450px;
  text-align: right;
  color: #44bdf4;
}
.CTXLicon{
  margin: 0 auto;
  width: 80px;
  height: 80px;
  background: url('./../../../assets/img/train/4.png') center center no-repeat;
  background-size: 100% 100%;
}

.RCXL{
  position: absolute;
  top: 350px;
  right: 14%;
  height: 150px;
  width: 450px;
  text-align: left;
  color: #44bdf4;
}
.RCXLicon{
  margin: 0 auto;
  width: 80px;
  height: 80px;
  background: url('./../../../assets/img/train/2.png') center center no-repeat;
  background-size: 100% 100%;
}

.NTXL{
  position: absolute;
  top: 550px;
  right: 6%;
  height: 150px;
  width: 450px;
  text-align: left;
  color: #44bdf4;
}
.NTXLicon{
  margin: 0 auto;
  width: 80px;
  height: 80px;
  background: url('./../../../assets/img/train/2.png') center center no-repeat;
  background-size: 100% 100%;
}

.title{
  margin-top: 20px;
  font-size: 30px;
}
</style>
