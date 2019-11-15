<template>
  <div class="classRoom change">
    <div class="app_header">
        <impheader></impheader>
    </div>
    <div class="classRoom_div">
       <el-row :gutter="20">
        <el-col :span='18'>
          <div class='classRoom_left'>
            <div class='classRoom_player' v-if='isuniPlayer'>
              <uniPlayer :FJdata='nowFJ' ></uniPlayer>
            </div>
          </div>
          <div class='classRoom_left1'>
            <div>
              <img :src="learn1">所属知识点:{{nowFJ.ZSDname}}
              <img :src="learn2">浏览:{{nowFJ.browsingNum}} <img :src="learn3">收藏:{{nowFJ.collectionNum}} <img :src="learn4">下载:{{nowFJ.downloadNum}}
              <img :src="learn5">上传人:{{nowFJ.userName}} <img :src="learn5">上传时间:{{UTCtoDate(nowFJ.uploadTime)}}
            </div>
            <div class='classRoom_CZ'>
              <div style='cursor: pointer;background: #090b16ad;width: 60px' @click='add_remove_CollectData'>
                  <img :src="isCollectData?imgSrc2:imgSrc1" style='width: 20px;height:20px;position:relative;top:4px;'>
                <div style='display: inline-block;'>{{isCollectData?'取消':'收藏'}}</div>
              </div>
              <div style='cursor:pointer;background: #090b16ad;width: 60px' @click='downCollectData'>
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
                <div class="classRoom_border" :style="'background-size: 100%  100%;background: url('+ImgSrc(item) +') center center / 100% 100% no-repeat;'" @click='toClassRoom(item)'>
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
    <el-dialog title="请先登录" :visible.sync="loginShow" width="30%">
        <newlogin></newlogin>
    </el-dialog>
  </div>
</template>

<script>
import impheader from '@/components/layout/header1'
import uniPlayer from '../unit/unit_player.vue'
import { mapState } from 'vuex'
import newlogin from '@/components/layout/newlogin'
export default {
  name: 'index',
  components:{
    uniPlayer,impheader,newlogin
  },
  data () {
    return {
      loginShow: false,
      nowFJ:{
        ZSDname:'',
        browsingNum:'',
        collectionNum:'',
        downloadNum:'',
        uploadTime:'',
        subjectId:null
      },
      name:'',
      XGflie:[],
      TJflie:[],
      isuniPlayer:true,
      CollectData:[],
      isCollectData:false,
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
  computed: {
      ...mapState(['loginUser']),
      aid(){
          return this.loginUser==null? null: this.loginUser.id
      }
  },
  methods: {
    add_remove_CollectData:function(){
      if (this.isCollectData) {
        this.$axiosStuRes1('delete',this.$axiosURL.f_file+'delCollectFile/'+this.nowFJ.fileId+'/'+this.aid,{}).then((res)=>{
          this.isCollectData = !this.isCollectData
        })
      } else {
        this.$axiosStuRes1('get',this.$axiosURL.f_file+'addCollectFile/'+this.nowFJ.fileId+'/'+this.aid,{}).then((res)=>{
          if(res.error == 'invalid_token') {
              this.loginShow = true
              return
          }
          this.isCollectData = !this.isCollectData
        })
      }
    },
    downCollectData:function(){
      var url = this.$axiosURL.f_downloadFile+'download/' + this.nowFJ.fileId
      window.location.href = url
    },
    toClassRoom:function(item){
      this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+item.userId+'/find',{}).then((res)=>{
          item['userName'] = res.name
      }).then(()=>{
        this.$axiosStuRes1('get',this.$axiosURL.K_knowledgePoint+item.kpointId,{}).then((res)=>{
          item['ZSDname'] = res.name
        }).then(()=>{
          sessionStorage.setItem('LSKJ',JSON.stringify(item))
          this.nowFJ = item
          this.initData()
          this.isuniPlayer = false
          this.$nextTick(()=>{
            this.isuniPlayer = true
          })
        })
      })
      
    },
    ImgSrc:function(data){
      if (data.fileType == 0||data.fileType==3) {
        return this.$BASEURL +  data.videoImg
      } else {
        return this.$BASEURL +  data.onlinePath
      }
    },
    toTest:function(){
      this.$router.push({name:'testTrain_index'})
    },
    UTCtoDate:function(date){
      // return this.$tools.UTCtoDate(date)
    },
    selectCollectFile:function(){
      //查询用户收藏
      this.$axiosStuRes1('get',this.$axiosURL.f_file+'selectCollectFile/'+this.aid,'').then((res)=>{
        this.CollectData ==res
        //判断是否存在
        var a = res.filter((element)=>{
          return element.fileId == this.nowFJ.fileId
        })
        if (a.length>0) {
          this.isCollectData = true
        }else{
          this.isCollectData = false
        }
      })
    },
    initData:function(){
      if (typeof(this.nowFJ)=='undefined') {
        this.$router.push({path:'./'})
        return
      }
      //添加浏览量
      this.$axiosStuRes1('get',this.$axiosURL.f_file+'browsingNumUpdate/'+this.nowFJ.fileId,{}).then((res)=>{
      })
      this.selectCollectFile()
      this.$axiosStuRes1('get',this.$axiosURL.K_knowledgePoint+this.nowFJ.kpointId,{}).then((res)=>{
          this.ZSDname = res.name
      })
      this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+this.nowFJ.userId+'/find',{}).then((res)=>{
          this.name = res.name
      })
      var params = {
        subjectId: this.nowFJ.subjectId,
        kpointId:this.nowFJ.kpointId,
        fileType: '',
      } 
      this.$axiosStuResBody('post',this.$axiosURL.f_file+'list' ,params).then((res)=>{
        this.XGflie = res 
      })
      this.TJflie = []
      this.$axiosStuRes1('get',this.$axiosURL.K_knowledgePoint+'find/'+ this.nowFJ.kpointId+'/correlatedPoint',{}).then((res)=>{
          res.correlateKnowledgePoints.forEach((element)=>{
            var params = {
              pageNum: 1,
              pageSize: 55,
              fileName: '',
              kpointId: element.id,
              fileType: '',
            }
            this.$axiosStuResBody('post',this.$axiosURL.f_file+'list/null' ,params).then((res)=>{
                this.TJflie = this.TJflie.concat(res.data)
            })
          })
          console.log(this.TJflie);
      })
    }
  },
 
  created:function(){
    //this.nowFJ = this.$route.params.data
    this.nowFJ = JSON.parse(sessionStorage.getItem('LSKJ'))
    console.log('nowFJ',this.nowFJ);
    console.log('nowFJ',this.$route.params);
  },
  mounted:function(){
      this.initData()
      //this.nowFJ = this.$route.params.nowFJ
      // this.$bus.$emit('clickRMS',(row)=>{
      //   this.nowFJ = row
      // })
  },
}
</script>

