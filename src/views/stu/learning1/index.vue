<template>
  <div class="learning change">
    <div class="app_header">
        <impheader></impheader>
    </div>
    <div class="search_con">
      <el-row class="search" v-show='!XXCXisShow'>
        <el-col :span='21' >
          <el-input placeholder="请输入内容" v-model="formInline.GJZ" class="input-with-select" @keyup.enter.native="kjglSearch">
            <el-button slot="append" icon="el-icon-search" @click='kjglSearch'></el-button>
          </el-input>
        </el-col>
        <el-col :span='3'>
            <el-button style="height: 50px;border: 1px solid #DCDFE6;" type="primary" @click="XXCX">详细查询{{XXCXisShow?'↑↑':'↓↓'}}</el-button>
        </el-col>
      </el-row>
      <div class="detail" v-show='XXCXisShow'>
          <el-form :inline="true" :model="formInline">
              <el-form-item label="知识点">
                <el-cascader
                  placeholder="知识点,可搜索"
                  v-model="formInline.ZSD"
                  :options="ZSDdata"
                  :props="ZSDprops"
                  :show-all-levels="false"
                  filterable
                  change-on-select
                  ref='cascader1'
                  ></el-cascader>
              </el-form-item>
              <el-form-item label="课件名称">
                <el-input v-model="formInline.KJMC" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="文件类型">
                <el-select v-model="formInline.WJLX" placeholder="文件类型">
                <el-option v-for = 'item in removeFile(dictionarys.file_info)'
                    :key="item.dictName"
                    :label="item.dictName"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间">
                <el-form-item>
                  <el-date-picker
                    v-model="formInline.time"
                    value-format="timestamp"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"  icon="el-icon-search" @click="kjglSearch"></el-button>
              </el-form-item>
              <el-button type="primary" @click="XXCX">详细查询{{XXCXisShow?'↑↑':'↓↓'}}</el-button>
          </el-form>
      </div>    
      <div class="rightList">
        <ul>
          <li v-for="(item,index) in kjglList" @click="clickZL(item.sourceAsMap?item.sourceAsMap:item)">
            <div class="listImg">
              <img :src="imgSrc(item.sourceAsMap?item.sourceAsMap:item)" alt="">
            </div>
            <h3 style="height: 24px" class="listTiele">{{item.sourceAsMap?item.sourceAsMap.fileTitle:item.fileTitle}}</h3>
            <p style="height: 20px">{{item.sourceAsMap?item.sourceAsMap.summary:item.summary}}</p>
            <p>
              浏览量:<a class="biao">{{item.sourceAsMap?item.sourceAsMap.browsingNum:item.browsingNum}}</a>
              收藏次数:<a class="biao">{{item.sourceAsMap?item.sourceAsMap.collectionNum:item.collectionNum}}</a>
            </p>
          </li>
        </ul>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <div class="app_bottom">
      <bottom/>
    </div>
    <el-dialog title="请先登录" :visible.sync="loginShow" width="30%">
        <newlogin></newlogin>
    </el-dialog>
</div>
</template>

<script>
import impheader from '@/components/layout/header1'
import bottom from "@/components/layout/bottom.vue"
import newlogin from '@/components/layout/newlogin'
export default {
  name: 'index',
  components:{
    impheader,bottom,newlogin
  },
  data () {
    return {
      loginShow: false,
      input:'',
      XXCXisShow:false,
      ZSDdata:[],
      formInline:{
        GJZ:'',
        ZSD:[],
        KJMC:'',
        WJLX:'',
        time:[],
      },
      ZSDprops:{
        value:'id',
        label:'name',
        children:'knowledgePoints',
      },
      dictionarys:null, //字典表
      pageNum:1,  //页码
      pageSize:10,  //每页数量
      total:5,   //总数
      kjglList:[],
      userData:'',
      nowZSDname:'',
    }
  },

  methods: {
    removeFile:function(data){
      return data.filter((element)=>{
        return element.dictName != '音频'
      })
    },
    searchFileType:function(id){

      var a = this.dictionarys.file_info.find((element)=>{
        return element.value == id
      })
      return a.dictName
    },
    UTCtoDate:function(date){
      return this.$tools.UTCtoDate(date)
    },
    imgSrc:function(item){
      if (item.fileType == 0 || item.fileType == 2) {
        return this.$BASEURL + item.videoImg
      } else if(item.fileType == 1){
        return this.$BASEURL + item.onlinePath
      }else if(item.fileType == 3){
        return this.$BASEURL + item.videoImg
      }
    },
    clickZL:function(item){
      if(!localStorage.getItem('aId')){
        this.loginShow = true
        return
      }
      localStorage.setItem('LSKJ',JSON.stringify(item))
      const route = this.$router.resolve({name:'classRoom'})
      window.open(route.href,'_blank',)
    },
    handleSizeChange:function(val){
      this.pageNum = 1
      this.pageSize = val
      this.kjglSearch()
    },
    handleCurrentChange:function(val){
      this.pageNum = val
      this.kjglSearch()
    },
    XXCX:function(){
      this.XXCXisShow = !this.XXCXisShow
    },
    kjglSearch() {
      if(this.XXCXisShow == true){
        this.formInline.GJZ = ''
      }
      if(this.formInline.GJZ == '' ) {
        var gjc = "null"
        var params = {
          data:{
            pageNum:  this.pageNum,
            pageSize: this.pageSize,
            fileTitle: this.formInline.KJMC,
            kpointId: this.formInline.ZSD[this.formInline.ZSD.length - 1],
            fileType: this.formInline.WJLX,
            firTime: this.formInline.time?this.formInline.time[0]:'',
            endTime: this.formInline.time?this.formInline.time[1]:''
          }
        }
      } else {
        var gjc = this.formInline.GJZ.trim()
        var params = {
            currentPageNum:  this.pageNum,
            perPageNum: this.pageSize,
        }
      }
      var a = []
      this.$axiosStuResBody1('post', this.$axiosURL.Fr_es + 'anon/find/fileinfo/' + gjc, params).then((res) => {
        this.total = res.totalNum
        if(res.dataList == null){
          return res.searchHits
        } else {
           return res.dataList
        }
      }).then((data) => {
        // if(data == null){
        //   a= []
        // } else {
          // data.forEach((element, index) => {
          //   var userid= element.userId?element.userId:element.sourceAsMap.userId
          //   this.$axiosStuRes('get', this.$axiosURL.K_neoUser + userid + '/find', {}).then((res) => {
          //     element['userName'] = res.name
          //   }).then(() => {
          //     var pointid = element.kpointId?element.kpointId:element.sourceAsMap.kpointId
          //     this.$axiosStuRes('get', this.$axiosURL.K_knowledgePoint + pointid, {}).then((res) => {
          //       element['ZSDname'] = res.name
          //     }).then(() => {
          //       a.push(element)
          //     })
          //   })
          // });
        // }
        return data
      }).then((data) => {
        this.kjglList = data
      })
    },
    getTreeData(data){
      for (var i = 0; i < data.length; i++) {
        if(data[i].knowledgePoints.length < 1) {
          data[i].knowledgePoints = undefined
        } else {
          this.getTreeData(data[i].knowledgePoints)
        }
      }
      return data
    },
  },
 
  created:function(){
    this.dictionarys = JSON.parse(localStorage.getItem('dictionarys'))
    console.log(this.dictionarys);
    this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
      this.ZSDdata = this.getTreeData(res);
    })
    this.kjglSearch()
  },
  mounted:function(){
    // this.formInline.GJZ = this.$route.params.keyword
  },


}
</script>


<style>
</style>
