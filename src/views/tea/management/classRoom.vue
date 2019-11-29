<template>
  <div class="classRoom change">
    <div class="classRoom_div">
       <el-row style="height: 100%">
        <el-col :span='19' style="height: 100%;padding-right:10px;box-sizing:boder-box">
          <div class='classRoom_left'>
            <div class='classRoom_player' v-if='isuniPlayer'>
              <uniPlayer :FJdata='nowFJ' ></uniPlayer>
            </div>
          </div>
          <div class='classRoom_left1'>
            <div>
              <img :src="learn1">所属知识点:{{nowFJ.ZSDname}}
              <img :src="learn2">浏览:{{nowFJ.browsingNum}} <img :src="learn3">收藏:{{nowFJ.collectionNum}} <img :src="learn4">下载:{{nowFJ.downloadNum}}
              <!-- <img :src="learn5">上传人:{{nowFJ.userName}} <img :src="learn5">上传时间:{{UTCtoDate(nowFJ.uploadTime)}} -->
            </div>
            <div class='classRoom_CZ'>
              <!-- <div style='cursor: pointer;background: #090b16ad;width: 60px' @click='add_remove_CollectData'>
                  <img :src="isCollectData?imgSrc2:imgSrc1" style='width: 20px;height:20px;position:relative;top:4px;'>
                <div style='display: inline-block;'>{{isCollectData?'取消':'收藏'}}</div>
              </div> -->
              <div style='cursor:pointer;width: 60px' @click='downCollectData'>
                <img :src="imgDown" style='width: 20px;height:20px;position:relative;top:4px;'>
                <div style='display: inline-block;'>下载</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span='5' class="relevant">
          相关课件资料
          <el-row :gutter="7">
              <el-col :span='12' :key='item.id' v-for='item in XGflie'>
                <div class="classRoom_border" :style="'background-size: 100%  100%;background: url('+ImgSrc(item) +') center center / 100% no-repeat;'" @click='toClassRoom(item)'>
                  <div class="classRoom_border_fileTitle">
                    {{item.fileTitle}}
                  </div>
                </div>
              </el-col>
          </el-row>
          <!-- <div class="classRoom_button" @click='toTest'>
            课后练习
          </div> -->
        </el-col>
        <el-col :span='5' class="relevant">
          知识点推荐
          <el-row :gutter="7">
            <el-col :span='12' :key='item.id' v-for='item in TJflie'>
              <div class="classRoom_border" :style="'background: url('+ImgSrc(item) +') center center no-repeat;background-size: 100% 100%'" @click='toClassRoom(item)'>
                <div class="classRoom_border_fileTitle">
                  {{item.fileTitle}}
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import uniPlayer from '@/components/unit/unit_player.vue'
export default {
  name: 'index',
  components:{
    uniPlayer
  },
  data () {
    return {
      nowFJ:{
        browsingNum:'',
        collectionNum:'',
        downloadNum:'',
        uploadTime:'',
        subjectId:null
      },
      name:'',
      ZSDname:'',
      XGflie:[],
      TJflie:[],
      isuniPlayer:true,
      imgSrc1:require('./../../../assets/img/classroom/sc.png'),
      imgSrc2:require('./../../../assets/img/classroom/sc1.png'),
      imgDown:require('./../../../assets/img/classroom/down.png'),
      learn1:require('./../../../assets/img/classroom/learn1.png'),
      learn2:require('./../../../assets/img/classroom/learn2.png'),
      learn3:require('./../../../assets/img/classroom/learn3.png'),
      learn4:require('./../../../assets/img/classroom/learn4.png'),
      learn5:require('./../../../assets/img/classroom/learn5.png'),
    }
  },

  methods: {
    toClassRoom:function(item){
       this.$axiosRes1('get',this.$axiosURL.k_neoUser+item.userId+'/find',{}).then((res)=>{
          item['userName'] = res.name
      }).then(()=>{
        this.$axiosRes1('get',this.$axiosURL.k_knowledgePoint+item.kpointId,{}).then((res)=>{
          item['ZSDname'] = res.name
        }).then(()=>{
          localStorage.setItem('LSKJ',JSON.stringify(item))
          this.nowFJ = item
          this.initData()
          this.isuniPlayer = false
          this.isuniPlayer = true
        })
      })

    },
    ImgSrc:function(data){
      if (data.fileType == 0||data.fileType==3||data.fileType==2) {
        return this.$BASEURL + data.videoImg
      } else {
        return this.$BASEURL + data.onlinePath
      }
    },
    toTest:function(){
      this.$router.push({name:'testTrain_index'})
    },
    UTCtoDate:function(date){
      //return this.$tools.UTCtoDate(date)
    },
    initData:function(){
      if (typeof(this.nowFJ)=='undefined') {
        this.$router.push({path:'./teaindex'})
        return
      }
      this.$axiosRes1('get',this.$axiosURL.k_knowledgePoint+this.nowFJ.kpointId,{}).then((res)=>{
          this.ZSDname = res.name
      })
      this.$axiosRes1('get',this.$axiosURL.k_neoUser+this.nowFJ.userId+'/find',{}).then((res)=>{
          this.name = res.name
      })
      var params = {
        subjectId: this.nowFJ.subjectId,
        kpointId:this.nowFJ.kpointId,
        fileType: '',
      } 
      this.$axiosResBody('post',this.$axiosURL.f_file+'list' ,params).then((res)=>{
        this.XGflie = res 
      })
      this.TJflie = []
      this.$axiosRes1('get',this.$axiosURL.k_knowledgePoint+'find/'+ this.nowFJ.kpointId+'/correlatedPoint',{}).then((res)=>{
        console.log(res,33999)
          res.correlateKnowledgePoints.forEach((element)=>{
            var params = {
              data:{
                pageNum: 1,
                pageSize: 55,
                fileName: '',
                kpointId: element.id,
                fileType: '',
              }
            }
            this.$axiosResBody('post', this.$axiosURL.Fr_es + 'anon/find/fileinfo/null', params).then((res) => {
                this.TJflie = this.TJflie.concat(res.dataList)
            })
          })
      })
    },
    downCollectData: function () {
      var url = this.$axiosURL.f_downloadFile + 'download/' + this.nowFJ.fileId
      window.location.href = url
    },
  },
 
  created:function(){
    this.nowFJ = this.$route.params.data
    console.log('nowFJ',this.nowFJ);
  },
  mounted:function(){
      this.initData()

  },
}
</script>

