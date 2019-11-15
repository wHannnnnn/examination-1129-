<template>
<div class="index change">
            <div class="app_header">
                <impheader></impheader>
            </div>

          <div class="app_content">

            <div class="app_content_left">
                <div class="search">
                    <el-input placeholder="请输入内容" v-model="input3" class="input-with-select" @keyup.enter.native="searchAll">
                      <el-button slot="append" icon="el-icon-search" @click='searchAll'></el-button>
                    </el-input>
                </div>


                <div class="searchListHide"  v-if="searchListShow==false" style="display: flex;height:calc(100% - 60px)">
                  <div class="app_nav">
                      <sidenav></sidenav>
                  </div>

                  <div class="content-center">
                    <transition
                    name="custom-classes-transition"
                    enter-active-class="animated slideInRight">
                        <router-view></router-view>
                    </transition>
                  </div>
                </div>

                <transition
                name="custom-classes-transition"
                enter-active-class="animated slideInRight">
                      <div class="searchListShow" v-if="searchListShow==true" style="display: flex;height:calc(100% - 60px)">
                            <allsearch :searchValue="input3"></allsearch>
                      </div>
                </transition>
                <el-page-header @back="goBack" v-if="searchListShow==true">
                </el-page-header>
            </div>

            <newlogin></newlogin>
          </div>
          <div class="app_bottom">
            <bottom/>
          </div>
  </div>
</template>

<script>
import impheader from "@/components/layout/header1.vue"
import sidenav from "@/components/layout/SideNav1.vue"
import newlogin from "@/components/layout/newlogin.vue"
import bottom from "@/components/layout/bottom.vue"
import allsearch from "./allSearch/allSearch.vue"
import Vue from 'vue'
export default {
  name: 'Index',
  data () {
    return {
        commentImg: require("@/assets/img/comment.png"),
        pathName: this.$route.name,
        input3: '',
        pageNum: 1,
        pageSize: 5,
        // searchList:[],
        searchListShow: false
    }
  },
  components: {
      impheader,
      sidenav,
      newlogin,
      allsearch,
    //   addSJ,
    //   addKS
  },
  methods: {
    checktime:function(){
      this.$axiosGet(this.$axiosURL.system+'expire/validate').then((res)=>{
        if (res.expire) {
          this.$message.error(res.message)
        }
      })
    },
    imgSrc:function(item){
      if (item.fileType == 0) {
        return this.wordImg
      } else if(item.fileType == 1){
        return item.onlinePath? this.$BASEURL + item.onlinePath:this.pictureImg
      }else if(item.fileType == 3){
        return item.videoImg? this.$BASEURL + item.videoImg:this.videoImg
      }
    },
    searchAll(){
    //   // this.$router.push({name:'learning_index',params:{keyword:this.input3}})
    //   var params = {
    //       currentPageNum: this.pageNum,
    //       perPageNum: this.pageSize,
    //       text:  this.input3
    //   }
    //   this.$axiosStuRes('get',this.$axiosURL.Fr_es + 'anon/find/all',params).then((res)=>{
    //     console.log(res.searchHits)
    //     // res.searchHits.forEach((ele,index) => {          
    //     //   Vue.set(this.searchList, index, ele)
    //     // });
        this.searchListShow = false
        this.$nextTick(()=>{
          this.searchListShow = true
        })
    //     this.searchList = res.searchHits
    //   })
    },
    goBack() {
        this.searchListShow = false
    }
  },
  watch: {
    '$route': function(){
      this.pathName = this.$route.name;
    }
  },
  mounted(){
    // this.checktime()
  },
  created:function(){
    // this.$store.state.loginUser=JSON.parse(sessionStorage.getItem('loginUser'))
    // console.log(this.$store.state.loginUser);
    // this.$store.state.dictionarys = JSON.parse(sessionStorage.getItem('dictionarys'))
    // console.log('dictionarys',this.$store.state.dictionarys);
    // this.$store.state.aId = sessionStorage.getItem('aId')
    // this.$store.state.role = sessionStorage.getItem('role')
    this.$axiosStuRes('get',this.$axiosURL.b_dictionarys,'').then((res)=>{
      sessionStorage.setItem('dictionarys', JSON.stringify(res))
      this.$store.state.dictionarys = res;
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* .index{
  background:transparent !important;
} */
 #app{
    height: 100%;
    display: flex;
    flex-flow: column;
  }
  .left_bottom{
    /* flex: 1; */
    /* display: flex; */
    /* flex-flow: row; */
    /* justify-content: space-between */
  }

</style>
