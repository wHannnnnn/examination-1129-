<template>
<div class="login_after">
  <indexTop/>
  <div class="center">
    <div class="center_title">
      推荐
    </div>
    <el-row :gutter="20" >
      <el-col :span="8" :key="Math.random()" v-for="item in hotPointsRanking">
        <div class="ZSD">
          <el-row>
            <el-col :span="21" style='overflow:hidden;text-overflow:ellipsis;white-space:nowrap' :title='item.kpName'>{{item.kpName}}</el-col>
            <!-- <el-col :span="3"><i :class="isZSD(item)?'el-icon-close':'el-icon-plus'" @click='clickZSD(item)'></i></el-col> -->
            <el-col :span="3"><img :src="isZSD(item)?remove:add" @click='clickZSD(item)'></img></el-col>
          </el-row>         
        </div>
      </el-col>
    </el-row>
    <div class="toGRZX" @click="toGRZX">
      详细定制请到个人中心
    </div>
  </div>
</div>
</template>

<script>
import indexTop from './unit/index_top.vue'
export default {
  name: 'login_after',
  data () {
    return {
      hotPointsRanking:null,
      subscribedPoints:[],
      add:require('./../../assets/img/more/添加.png'),
      remove:require('./../../assets/img/more/删除.png')
    }
  },
  components:{
    indexTop
  },
  watch: {
    
  },
  methods: {
    cutString:function(str,len){
      return this.$tools.cutString(str,len)
    },
    toGRZX:function(){
      this.$router.push({path:'/user'})
    },
    isZSD:function(item){      
      for (var i = this.subscribedPoints.length - 1; i >= 0; i--) {
        if (this.subscribedPoints[i].id == item.kpId) {
          return true
        } 
      }
       return false
    },
    clickZSD:function(item){
      if (this.isZSD(item)) {
        this.$axiosStuResBody('delete',this.$axiosURL.K_neoUser+'bash/cancel/subscribedPoints/for/'+sessionStorage.getItem('student_aId'),[item.kpId]).then((res)=>{
        }).then(()=>{
          this.nowknowledge()
        })
      } else {
        this.$axiosStuResBody('post',this.$axiosURL.K_neoUser+'bash/subscribePoints/for/'+sessionStorage.getItem('student_aId'),[item.kpId]).then((res)=>{
        }).then(()=>{
          this.nowknowledge()
        })
      }
    },
    initData:function(){
      var  hierachy = null
      this.$axiosStuRes1('get',this.$axiosURL.k_knowledgeHierachy+'find/'+this.$store.state.student_loginUser.profession,{}).then((res)=>{
        hierachy = res
      }).then(()=>{
        this.$axiosStuRes1('get',this.$axiosURL.k_common+'get/hotPointsRanking',{hierachyId:hierachy.id,pageNum:1,pageSize:10}).then((res)=>{
          this.hotPointsRanking = res
        })
      })
      this.nowknowledge()
    },
    nowknowledge:function(){
      this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+sessionStorage.getItem('student_aId')+'/all/subscribedPoints',{}).then((res)=>{
        this.subscribedPoints = res
      })
    },
  },
  created:function(){
    this.$store.state.student_loginUser=JSON.parse(sessionStorage.getItem('student_loginUser'))
    console.log(this.$store.state.student_loginUser);
  },
  mounted:function(){
    this.initData()
      
  },

}
</script>

<style scoped>
.login_after{
  width: 100%;
  height: 100%;
  background: url('./../../assets/img/background2.png') center center no-repeat;
  background-size: 100% 100%;
  min-height: max-content;
  min-height: -moz-max-content;
}
.center{
  text-align: left;
  margin: 50px auto;
  padding: 70px 150px;
  width: 50%;
  height: 600px;
  background: url('./../../assets/img/login_after.png') center center no-repeat;
  background-size: 100% 100%;
}
.center_title{
  background: #2e9374;
  height: 30px;
  line-height: 30px;
  width: 70px;
  text-align: center;
}
.ZSD{
  margin: 10px auto;
  padding-left: 20px;
  width: 80%;
  height: 40px;
  line-height: 40px;
  background: url('./../../assets/img/login_after_div.png') center center no-repeat;
  background-size: 100% 100%;

}
.ZSD img{
  width: 28px;
  height:28px;
  margin-top: 4px;
  /*position: relative;
  top: 5px;
  right: -5%;*/
  cursor: pointer;
}
.toGRZX{
  text-align: center;
  position: relative;
  bottom: -400px;
  font-size: 20px;
  color: #2f8db4;
  cursor: pointer;
}
.toGRZX:hover{
  color: #fff;
  cursor: pointer;
}
</style>
