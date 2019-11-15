<template>
  <div class="classRoom change">
    <indexTop/>
    <div class="classRoom_index">
      <el-row :gutter="20">
        <el-col :span='5'>
          <div class="classRoom_left">
            <div style="padding-top: 20px;">
              <div  style="padding: 20px 30px;">
                <div class="classRoom_title">
                  相关知识点
                </div>
                <el-tree
                  :data="ZSDdata"
                  :props="defaultProps"
                  ref="tree1"
                  @node-click="nodeClick">
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span='19'>
          <el-row>
            <el-col :span='5'>
              <div :class="chooseType=='3'?'classRoom_button1':'classRoom_button'" @click="chooseTypeClick('3')">
                视频文件
              </div>
            </el-col>
            <el-col :span='5'>
              <div :class="chooseType=='0'?'classRoom_button1':'classRoom_button'" @click="chooseTypeClick('0')">
                文档文件
              </div>
            </el-col>
            <el-col :span='5'>
              <div :class="chooseType=='1'?'classRoom_button1':'classRoom_button'" @click="chooseTypeClick('1')">
                图片文件
              </div>
            </el-col>
          </el-row>
          <div class="classRoom_right">
            <el-row>
              <el-col :span='16'>
                <!-- {{fileList[fileIndex].name}} -->
                  <div class="right_title">
                    课程介绍
                  </div>
                  <div style="margin-top:10px;height:40px;">
                    {{fileList[fileIndex]?fileList[fileIndex].fileName:''}}
                  </div>
                  <div style="margin-top:10px;height:40px;">
                    {{fileList[fileIndex]?fileList[fileIndex].summary:''}}
                  </div>
                  <!-- {{fileList.length!=0?fileList[fileIndex].name:''}} -->
                <el-carousel type="card" height="400px" :autoplay='false' @change='changeCarousel'>
                  <el-carousel-item v-for="(item,index) in fileList" :key='index' :style="'background: url('+ImgSrc(item)+') center center no-repeat'" @click.native='clickCarousel'>
                  </el-carousel-item>
                </el-carousel>
              </el-col>
              <el-col :span='6'>
                <div class="rightDiv" v-show='fileList[fileIndex]'>
                  <div class="right_title">
                    相关课程说明
                  </div>
                  <div class="right_text">
                    文件标题：{{fileList[fileIndex]?fileList[fileIndex].fileTitle:''}}
                  </div>
                  <div class="right_text">
                    文件后缀：{{fileList[fileIndex]?fileList[fileIndex].fileExtension:''}}
                  </div>
                  <!-- <div class="right_text">
                    播放路径：{{fileList[fileIndex]?fileList[fileIndex].onlinePath:''}}
                  </div> -->
                  <div class="right_text">
                    上传时间：{{fileList[fileIndex]?UTCtoDate(fileList[fileIndex].updateTime):''}}
                  </div>
                  <div class="right_text">
                    关键字：{{fileList[fileIndex]?fileList[fileIndex].keyword:''}}
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    
  </div>
</template>

<script>
import indexTop from '../unit/index_top.vue'
export default {
  name: 'index',
  components:{
    indexTop
  },
  data () {
    return {
      ZSDdata:[],
      defaultProps: {
        children: 'knowledgePoints',
        label: 'name'
      },
      chooseType:'',
      nowXKdataId:'',
      nowZSDdataId:'',
      fileList:[],
      fileIndex:0,
      wordImg:'./../../../assets/img/train/3.png',
      pictureImg:'./../../../assets/img/train/3.png',
      videoImg:'./../../../assets/img/train/3.png',
    }
  },

  methods: {
    ImgSrc:function(data){
      if (data.fileType == 0||data.fileType==3) {
        return data.videoImg
      } else {
        return data.onlinePath
      }
    },
    UTCtoDate:function(date){
      return this.$tools.UTCtoDate(date)
    },
    clickCarousel:function(){
      this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+this.fileList[this.fileIndex].userId+'/find',{}).then((res)=>{
          this.fileList[this.fileIndex]['userName'] = res.name
      }).then(()=>{
        this.$axiosStuRes1('get',this.$axiosURL.K_knowledgePoint+this.fileList[this.fileIndex].kpointId,{}).then((res)=>{
          this.fileList[this.fileIndex]['ZSDname'] = res.name
        }).then(()=>{
          sessionStorage.setItem('LSKJ',JSON.stringify(this.fileList[this.fileIndex]))
          const route = this.$router.resolve({name:'classRoom'})
          window.open(route.href,'_blank',)
        })
      })
      // this.fileList[this.fileIndex].ZSDname = 
      // sessionStorage.setItem('LSKJ',JSON.stringify(this.fileList[this.fileIndex]))
      // const route = this.$router.resolve({name:'classRoom'})
      // window.open(route.href,'_blank',)
    },
    changeCarousel:function(index){
      this.fileIndex = index
    },
    chooseTypeClick:function(val){
      this.chooseType = val
      this.search()
    },
    DG:function(node){
      if (node.level!=1) {
        return this.DG(node.parent)
      }else{
        return node
      }
    },
    nodeClick:function(data,node){
      if (node.parent) {
        var a = this.DG(node)
        this.nowXKdataId = a.data.id
        this.nowZSDdataId = data.id
      } else {
        this.nowXKdataId = data.id
        this.nowZSDdataId = ''
      }
      this.search()
    },
    search:function(){
      var params = {
        subjectId: this.nowXKdataId,
        kpointId:this.nowZSDdataId,
        fileType: Number(this.chooseType),
      }
      console.log(params)
      this.$axiosStuResBody('post',this.$axiosURL.f_file+'list' ,params).then((res)=>{     
        if(res !=null){
           this.fileList =  res   
        } else {
          this.$message.error('文件列表为空')
        }
        console.log(3,res);
      })
    },
    checkChange:function(){
       console.log(this.$refs.tree1.getCheckedNodes());
       this.$refs.tree1.getCheckedNodes().forEach((element, index)=> {
         var a ={
          name:element.name,
          id:element.id,
          khId:element.khId,
         }
       });
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
    initData:function(){
      this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
        this.ZSDdata = this.getTreeData(res);
      })
      this.search()
    }
  },
 
  created:function(){
    
  },
  mounted:function(){
    this.initData()
    
  },


}
</script>


<style scoped>
.classRoom{
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  min-height: max-content;
  min-height: -moz-max-content;
}
.classRoom_index{
  padding: 50px 150px;
}
.classRoom_left{
  width: 100%;
  height: 740px;
  background-size: 100% 100%;
}
.classRoom_title{
  font-size: 24px;
  color: #338eb8;
  padding: 20px 0px;
}
.classRoom_button{
  width: 210px;
  height: 50px;
  line-height: 50px;
  background-size: 100% 100%;
  color: #2ca3d3;
  cursor: pointer;
}
.classRoom_button1{
  width: 210px;
  height: 50px;
  line-height: 50px;
  background-size: 100% 100%;
  color: #fff;
  cursor: pointer;
}
.classRoom_right{
  margin-top: 20px;
  padding: 30px;
  width: 95%;
  height: 607px;
  background-size: 100% 100%;
}
.rightDiv{
  padding: 30px;
  width: 95%;
  height: 550px;
  background-size: 100% 100%;
}
.right_title{
  font-size: 24px;
}
.right_text{
  text-align: left;
  margin:6px;
}
</style>
