<template>
<div class="teaindex change">
 	
	<div class="app_header">
 		<impheader></impheader>
 	</div>
    <div class="tea_content">
      <div class="tea_nav">
        <side-nav></side-nav>
      </div>
      <div class="tea_right">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{pathName}}</el-breadcrumb-item>

          </el-breadcrumb>
        </div>
          <transition
            name="custom-classes-transition"
            enter-active-class="animated slideInRight">
             <router-view></router-view>
          </transition>
      </div>
    </div>
    <addSJ/>
    <addKS/>
</div>
</template>

<script>
import impheader from "../../components/layout/header2.vue"
import SideNav from "../../components/layout/SideNav2.vue"
import bottom from "../../components/layout/bottom.vue"
import addSJ from "../../components/model/addSJ.vue"
import addKS from "../../components/model/addKS.vue"
export default {
  name: 'HelloWorld',
  data () {
    return {
        pathName: this.$route.name
    }
  },
  components: {
      impheader,
      SideNav,
      addSJ,
      addKS,
      bottom
  },
  methods: {
    checktime:function(){
      this.$axiosGet(this.$axiosURL.system+'expire/validate').then((res)=>{
        if (res.expire) {
          this.$message.error(res.message)
        }
      })
    }
  },
  watch: {
    '$route': function(){
      this.pathName = this.$route.name;
    }
  },
  mounted(){
    this.checktime()
  },
  created:function(){
    this.$store.state.loginUser=JSON.parse(sessionStorage.getItem('loginUser'))
    console.log(this.$store.state.loginUser);
    this.$store.state.dictionarys = JSON.parse(sessionStorage.getItem('dictionarys'))
    console.log('dictionarys',this.$store.state.dictionarys);
    this.$store.state.aId = sessionStorage.getItem('aId')
    this.$store.state.role = sessionStorage.getItem('role')
  }
}
</script>

