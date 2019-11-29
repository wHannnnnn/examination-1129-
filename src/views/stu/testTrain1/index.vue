<template>
  <div class="testTrain change">
    <div class="app_header">
        <impheader></impheader>
    </div>
      <el-menu class="el-menu-vertical-demo testUl" default-active="/testTrain_test?testTrain=3" mode="horizontal" router :unique-opened='true' @select="handleOpen">
          <el-menu-item index="/testTrain_test?testTrain=3">日常训练</el-menu-item>
          <el-menu-item index="/testTrain_test?testTrain=2">错题训练</el-menu-item>
          <el-menu-item index="/testTrain_test?testTrain=4">难题训练</el-menu-item>
          <el-menu-item index="/mockExam_index">模拟考试</el-menu-item>
      </el-menu>
      <div class="content-center">
          <transition
          name="custom-classes-transition"
          enter-active-class="animated slideInRight">
              <router-view v-if="isAlive"></router-view>
          </transition>
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
  name: 'index',
  components:{
    impheader,bottom
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
      localStorage.setItem('testTrain',2)
      // const route = this.$router.resolve({name:'testTrain_test'})
      // window.open(route.href,'_blank',)
    },
    clickImg3:function(){
      localStorage.setItem('testTrain',3)
      const route = this.$router.resolve({name:'testTrain_test'})
      window.open(route.href,'_blank',)
    },
    clickImg4:function(){
      localStorage.setItem('testTrain',4)
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
