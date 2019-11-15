<template>
  <div class="learning change">
    <div class="app_header">
        <impheader></impheader>
    </div>
    <el-row class="search">
      <el-col :span='21' >
        <el-input placeholder="请输入内容" v-model="formInline.GJZ" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click='kjglSearch'></el-button>
        </el-input>
      </el-col>
      <el-col :span='3'>
          <el-button style="height: 50px;border: 1px solid #DCDFE6;" type="primary" @click="XXCX">详细查询{{XXCXisShow?'↑↑':'↓↓'}}</el-button>
      </el-col>
    </el-row>
    <div class="detail">
        <el-form :inline="true" :model="formInline"  v-if='XXCXisShow'>
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
        </el-form>
    </div>
       
    <div class="rightList">
      <ul>
        <li v-for="(item,index) in kjglList" @click="clickZL(item)">
          <div class="listImg">
            <img :src="imgSrc(item)" alt="">
          </div>
          <h3 class="listTiele">{{item.fileTitle}}</h3>
          <p>{{item.summary}}</p>
          <p>
            浏览量:<a class="biao">{{item.browsingNum?item.browsingNum:0}}</a>
            收藏次数:<a class="biao">{{item.collectionNum?item.collectionNum:0}}</a>
          </p>
        </li>
      </ul>
    </div>
        <!-- <div v-for="item in kjglList">
          <el-container class='learning_container'>
            <el-aside class='learning_ZL_left' style='width: 240px' @click.native="clickZL(item)" >
              <img :src="imgSrc(item)" style="width: 100%;height:95%" >
            </el-aside>
            <el-container>
              <el-header class='learning_ZL_Header'  style="height:30px;">
                {{item.fileTitle}}
              </el-header>
              <el-main class='learning_ZL_Main'>
                {{item.summary}}
              </el-main>
              <el-footer class='learning_ZL_Footer' style="height:28px;">
                <span style="padding-right: 10px"><img :src="learn1">知识分类:<a class="biao">{{item.ZSDname}}</a></span> 
                <span ><img :src="learn2">上传时间:<a class="biao">{{UTCtoDate(item.uploadTime)}}</a></span> 
                <!-- <span><img :src="learn3">下载量:<a class="biao">{{item.downloadNum?item.downloadNum:0}}</a></span> 
                <span ><img :src="learn3">浏览量:<a class="biao">{{item.browsingNum?item.browsingNum:0}}</a></span> 
                <span ><img :src="learn3">收藏次数:<a class="biao">{{item.collectionNum?item.collectionNum:0}}</a></span> 
                <span ><img :src="learn4">文件类型:<a class="biao">{{searchFileType(item.fileType)}}</a></span> 
                <span ><img :src="learn5">上传人:<a class="biao">{{item.userName}}</a></span>  -->
              <!-- </el-footer> -->
            <!-- </el-container> -->
          <!-- </el-container> -->
          <!-- </div> -->
    <!-- </div> -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
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
      wordImg:require('./../../../assets/img/train/3.png'),
      pictureImg:require('./../../../assets/img/train/3.png'),
      videoImg:require('./../../../assets/img/train/3.png'),
      userData:'',
      nowZSDname:'',
      learn1:require('./../../../assets/img/classroom/learn1.png'),
      learn2:require('./../../../assets/img/classroom/learn2.png'),
      learn3:require('./../../../assets/img/classroom/learn3.png'),
      learn4:require('./../../../assets/img/classroom/learn4.png'),
      learn5:require('./../../../assets/img/classroom/learn5.png'),
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
      if (item.fileType == 0) {
        return this.wordImg
      } else if(item.fileType == 1){
        return item.onlinePath? this.$BASEURL + item.onlinePath:this.pictureImg
      }else if(item.fileType == 3){
        return item.videoImg? this.$BASEURL + item.videoImg:this.videoImg
      }
    },
    clickZL:function(item){
      sessionStorage.setItem('LSKJ',JSON.stringify(item))
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
      
      if(this.formInline.ZSD.length > 1) {
        var params = {
              pageNum:  this.pageNum,
              pageSize: this.pageSize,
              fileTitle: this.formInline.KJMC,
              kpointId: this.formInline.ZSD[this.formInline.ZSD.length - 1],
              fileType: this.formInline.WJLX,
              firTime: this.formInline.time?this.formInline.time[0]:'',
              endTime: this.formInline.time?this.formInline.time[1]:''
        }
      } else if(this.formInline.ZSD.length == 1) {
        var params = {
              pageNum:  this.pageNum,
              pageSize: this.pageSize,
              fileTitle: this.formInline.KJMC,
              subjectId:this.formInline.ZSD[0],
              fileType: this.formInline.WJLX,
              firTime: this.formInline.time?this.formInline.time[0]:'',
              endTime: this.formInline.time?this.formInline.time[1]:''
        }
      }else{
        var params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          fileTitle: this.formInline.KJMC,
          fileType: this.formInline.WJLX,
          firTime: this.formInline.time?this.formInline.time[0]:'',
          endTime: this.formInline.time?this.formInline.time[1]:''
        }
      }

      if(this.formInline.GJZ == '' || this.formInline.GJZ == undefined) {
        var gjc = "null"
      } else {
        var gjc = this.formInline.GJZ.trim()
      }
      var a = []
      this.$axiosStuResBody1('post',this.$axiosURL.f_file+'list/' + gjc ,params).then((res)=>{
          this.total = res.total
          if(res.data !==null){
            this.kjglList = res.data   
            console.log(res.data);      
          } else {
            this.kjglList = []
          }
      }).then(()=>{ 
        this.kjglList.forEach((element, index)=> {
          this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+element.userId+'/find',{}).then((res)=>{
              element['userName'] = res.name
          }).then(()=>{
              this.$axiosStuRes1('get',this.$axiosURL.K_knowledgePoint+element.kpointId,{}).then((res)=>{
                element['ZSDname'] = res.name
            }).then(()=>{
              a.push(element)
            })
          })
        });
      }).then(()=>{
        this.kjglList = a
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
    this.dictionarys = JSON.parse(sessionStorage.getItem('dictionarys'))
    console.log(this.dictionarys);
    this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
      this.ZSDdata = this.getTreeData(res);
    })
  },
  mounted:function(){
    this.formInline.GJZ = this.$route.params.keyword
    this.kjglSearch()
  },


}
</script>


<style>
</style>
