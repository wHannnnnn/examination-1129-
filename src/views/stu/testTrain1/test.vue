<template>
  <div>
    <div class='testTrain_top'>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
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
        <el-form-item label="试题类型">
          <el-select v-model="formInline.STLX" placeholder="试题类型">
           <el-option :key="Math.random()" v-for = 'item in removelast(this.dictionarys.question_type)'
            :label="item.dictName"
            :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="练习方式">
          <el-select v-model="formInline.LXFS" placeholder="练习方式">
           <el-option label="顺序" :value="true"></el-option>
           <el-option label="随机" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试题难度" v-if='lx==2||lx==3'>
          <el-select v-model="formInline.STND" placeholder="试题难度">
          <el-option :key="Math.random()" v-for = 'item in this.dictionarys.question_difficulty'
            :label="item.dictName"
            :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100px">
          <el-button type="primary" @click="onSubmit">开始测试</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class='testTrain_main' v-if='STdata.length != 0'>
      <!-- <el-scrollbar style='height: 550px;'> -->
        <div class="testTrain_main_queType">
          {{findQueType(STdata[nowIndex].questionType)}}
        </div>
        <div class="testTrain_main_title">
          第{{nowIndex+1}}题  {{ STdata[nowIndex].questionBody}}

           <viewer :images="STdata[nowIndex].eqBodyImageNameList1" class="tImg" v-if="STdata[nowIndex].eqBodyImageNameList1"> 
             <img
               v-for="(src,index) in STdata[nowIndex].eqBodyImageNameList1"
               :src="getImgUrl(src)"
               @click="clickImg(src,index,0)"
               :key="index"
             >
           </viewer>

          <!-- <span v-for="item in STdata[nowIndex].eqBodyImageNameList1"><img :src="getImgUrl(item)" alt=""></span> -->
        </div>
        <div class="testTrain_main_title" v-if='STdata[nowIndex].questionAccessories.length !=0'>
          <div class="video" v-for='(it,index1) in STdata[nowIndex].questionAccessories'>
            <!-- <el-tag type="success" @click.native='clickAccessories(it)'>附件{{index1+1}}</el-tag> -->

            <av-bars
              v-if="it.questionAccessoryType == 'VOICE'"
              caps-color="#FFF"
              :bar-color="['#f00', '#ff0', '#0f0']"
              canv-fill-color="#000"
              :caps-height="2"
              :cors-anonym="true"
              :audio-src= "getAudioUrl(it.accessUrl)"
            ></av-bars>
            <video v-if="it.questionAccessoryType == 'VIDEO'" controls width="300" :src="getAudioUrl(it.accessUrl)"></video>
<!--             <video-player v-if="it.questionAccessoryType == 'VIDEO'"  class="video-player vjs-custom-skin"
             ref="videoPlayer"
             :playsinline="true"
             :options="playerOptions">
            </video-player> -->
          </div>
        </div>
        <div v-if="findQueType(STdata[nowIndex].questionType) == '单选题'">
          <div class="XZTOption" v-for="(item1,index) in STdata[nowIndex].questionOption">
            <el-radio v-model="STdata[nowIndex].studentAnswer" :label="item1">{{item1}}</el-radio>
            <!-- <img :src="getImgUrl(STdata[nowIndex].eqOptionImageNameList1[index])" alt=""> -->
            <viewer class="aImg" v-if="STdata[nowIndex].eqOptionImageNameList1[index]">
              <img
                  :src="getImgUrl(STdata[nowIndex].eqOptionImageNameList1[index])" 
                  :key="index"
                  @click="clickImg(STdata[nowIndex].eqOptionImageNameList1[index],index,1)"
                >
            </viewer>
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            正确答案：{{STdata[nowIndex].questionAnswer}}
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            解析：{{STdata[nowIndex].questionAnalyze?STdata[nowIndex].questionAnalyze:'无'}}
          </div>
        </div>

        <div v-if="findQueType(STdata[nowIndex].questionType) == '多选题'">
          <el-checkbox-group v-model="STdata[nowIndex].studentAnswer">
            <div class="XZTOption" v-for="(item2,index) in STdata[nowIndex].questionOption">
              <el-checkbox :label="item2"></el-checkbox>
              <!-- <img :src="getImgUrl(STdata[nowIndex].eqOptionImageNameList1[index])" alt="" > -->
              <viewer class="aImg" v-if="STdata[nowIndex].eqOptionImageNameList1[index]">
                <img
                    :src="getImgUrl(STdata[nowIndex].eqOptionImageNameList1[index])" 
                    :key="index"
                    @click="clickImg(STdata[nowIndex].eqOptionImageNameList1[index],index,1)"
                  >
              </viewer>
            </div>
          </el-checkbox-group>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            正确答案：{{STdata[nowIndex].questionAnswer}}
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            解析：{{STdata[nowIndex].questionAnalyze?STdata[nowIndex].questionAnalyze:'无'}}
          </div>
        </div>

        <div v-if="findQueType(STdata[nowIndex].questionType) == '填空题'">
          <el-row :gutter="10" style='margin:15px;'>
            <el-col :span='4' :key="index1" v-for='(val,index1) in analysisTKT(STdata[nowIndex].questionBody)'>
              <el-input
                size="small"
                :placeholder="'内容'+(index1+1)"
                v-model="STdata[nowIndex].studentAnswer[index1].value"
                clearable>
              </el-input>
            </el-col>
          </el-row>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            正确答案：{{STdata[nowIndex].questionAnswer}}
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            解析：{{STdata[nowIndex].questionAnalyze?STdata[nowIndex].questionAnalyze:'无'}}
          </div>
        </div>

        <div v-if="findQueType(STdata[nowIndex].questionType) == '判断题'">
          <div class="XZTOption" v-for="item1 in STdata[nowIndex].questionOption">
            <el-radio v-model="STdata[nowIndex].studentAnswer" :label="item1">{{item1}}</el-radio>
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            正确答案：{{STdata[nowIndex].questionAnswer}}
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            解析：{{STdata[nowIndex].questionAnalyze?STdata[nowIndex].questionAnalyze:'无'}}
          </div>
        </div>

        <div v-if="findQueType(STdata[nowIndex].questionType) == '简答题'">
          <el-input
            type="textarea"
            :autosize="{minRows: 4}"
            placeholder="请输入答案"
            v-model="STdata[nowIndex].studentAnswer">
          </el-input>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            正确答案：{{STdata[nowIndex].questionAnswer}}
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            关键字：{{STdata[nowIndex].keys.join(',')}}
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            解析：{{STdata[nowIndex].questionAnalyze?STdata[nowIndex].questionAnalyze:'无'}}
          </div>
        </div>

        <div v-if="findQueType(STdata[nowIndex].questionType) == '论述题'">
          <el-input
            type="textarea"
            :autosize="{minRows: 4}"
            placeholder="请输入答案"
            v-model="STdata[nowIndex].studentAnswer">
          </el-input>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            正确答案：{{STdata[nowIndex].questionAnswer}}
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            关键字：{{STdata[nowIndex].keys.join(',')}}
          </div>
          <div :class="isRed?'nowIsQuestionAnswerRed':'nowIsQuestionAnswerGreen'" v-show='nowIsQuestionAnswer'>
            解析：{{STdata[nowIndex].questionAnalyze?STdata[nowIndex].questionAnalyze:'无'}}
          </div>
        </div>
      <!-- </el-scrollbar> -->
      <div class='testTrain_button'>
        <el-button type="warning" v-if="lx==2&&(findQueType(STdata[nowIndex].questionType) == '填空题'||findQueType(STdata[nowIndex].questionType) == '简答题'||findQueType(STdata[nowIndex].questionType) == '论述题')" @click='removeQue'>从错题库移除</el-button>
        <el-button type="primary" @click='up'>上一题</el-button>
        <el-button type="success" @click='check'>确认</el-button>
        <el-button type="primary" @click='down'>下一题</el-button>
      </div>
    </div>
    <div class='testTrain_bottom' v-if='STdata.length != 0'>
      <!-- <div class="testTrain_bottom_title"> -->
        <span style="font-size: 18px">答题卡: </span>
      <!-- </div> -->
      <div v-for="(item,index) in STdata" style="display: inline-block;margin-right: 8px;">
        <el-tag :type="nowIndex >=index?'warning':''">{{index+1}}</el-tag>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisibleFJ"
      top='100px'
      width="1000px">
      <div style='height:600px;' v-if='dialogVisibleFJ == true'>
        <uniPlayer :FJdata='nowFJ' ></uniPlayer>
      </div>   
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleFJ = false">关 闭</el-button>
      </span>
    </el-dialog>
      <el-dialog title="请先登录" :visible.sync="loginShow" width="30%">
          <newlogin></newlogin>
      </el-dialog>
  </div>
</template>

<script>
import indexTop from '../unit/index_top.vue'
import uniPlayer from '../unit/unit_player.vue'
import newlogin from '@/components/layout/newlogin'
export default {
  name: 'index',
  components:{
    indexTop,
    uniPlayer,
    newlogin
  },
  data () {
    return {
      lx:null,  //2错题训练 3日常 4难度
      loginShow: false,
      ZSDdata:[],
      formInline:{
        ZSD:[],
        STLX:'',
        LXFS:false,
        STND:'',
      },
      ZSDprops:{
        value:'name',
        label:'name',
        children:'knowledgePoints',
      },
      dictionarys:null, //字典表
      playerOptions: null,
      pageNum : 1, //默认当前页码
      itemSize : 20,//默认每页条数

      STdata:[],
      nowIndex:0,
      nowIsQuestionAnswer:false,
      isRed:false,
      dialogVisibleFJ:false,
      nowFJ:null,
    }
  },

  methods: {
    getImgUrl:function(url){
      return this.$imgThumbUrl + url
    },
    getAudioUrl(url){
      return this.$BASEURL + url
    },
    clickImg(src,index,i){
      // var arr = src.split('/')
      // var pos = arr[arr.length-1].indexOf('__')
      if(i==0){
        $('.tImg img').eq(index).attr('src',this.$imgUrl + src)
      } else {
        $('.aImg img').eq(index).attr('src',this.$imgUrl + src)
      }
    },
    clickAccessories:function(data){
      // this.dialogVisibleFJ= true
      this.nowFJ = data
      console.log(data,1111)
      this.playerOptions = {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "",
          src: this.$BASEURL + data.accessUrl //url地址
        }],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      }
    },
    analysisTKT:function(data){
      console.log(data);
      var a = data.split('_')
      var b = []
      for (var i = a.length - 2; i >= 0; i--) {
        b.push({})
      }
      return b
    },
    clearData:function(){
      this.STdata = []
      this.nowIndex = 0
      this.nowIsQuestionAnswer = false
    },
    up:function(){
      if (this.nowIndex>0) {
        this.nowIndex--
        this.nowIsQuestionAnswer = false
        this.changeStudentAnswer()
      } 
    },
    down:function(){
      if (this.nowIndex == this.STdata.length-1) {
        this.pageNum++
        this.onSubmit()
      } else {
        this.nowIndex++
        this.nowIsQuestionAnswer = false
        this.changeStudentAnswer()
      }
      
    },
    check:function(){
      console.log(this.STdata);
      var ST = this.STdata[this.nowIndex]
      var questionType = this.findQueType(ST.questionType)
      this.nowIsQuestionAnswer = true
      if (questionType == '单选题') {
        if (ST.studentAnswer&&ST.studentAnswer.substring(0,1) == ST.questionAnswer) {
          this.$message.success('回答正确')
          this.isRed = false
          this.trueQuestions()
        }else {
          this.$message.error('回答错误')
          this.isRed = true
          this.wrongQuestions()   
        }
      } else if(questionType == '多选题'){
          var a = ''
          console.log(ST.studentAnswer);
            for (var i = 0; i <= ST.studentAnswer.sort().length-1; i++) {
              a += ST.studentAnswer.sort()[i].substring(0,1)
            }
           if (a == ST.questionAnswer.split(',').join('')) {
              this.$message.success('回答正确')
              this.isRed = false
              this.trueQuestions()
           }else {
              this.$message.error('回答错误')
              this.isRed = true
              this.wrongQuestions()
           }
      }else if(questionType == '判断题'){
        console.log(ST.studentAnswer,ST.studentAnswer.substr(2),ST.questionAnswer)
        if (ST.studentAnswer.substr(2) == ST.questionAnswer) {
          this.$message.success('回答正确')
          this.isRed = false
          this.trueQuestions()
        }else {
          this.$message.error('回答错误')
          this.isRed = true
          this.wrongQuestions()   
        }
      }else if(questionType == '填空题'){
        var istrue = true
        ST.questionAnswer.split(',').forEach((element2,index2)=>{
            if (element2 != ST.studentAnswer[index2].value) {
              istrue = false
            }
        })
        if (istrue) {
          this.$message.success('回答正确')
          this.isRed = false
          this.trueQuestions()
        } else {
          this.$message.error('回答错误')
          this.isRed = true
          this.wrongQuestions()
        }
      }else if(questionType == '简答题'||questionType == '论述题'){
        var istrue = ST.keys.length==0?false:true
         ST.keys.forEach((element2,index2)=>{
            if (ST.studentAnswer.indexOf(element2) == -1) {
              istrue = false
            }
          })
         if (istrue) {
          this.$message.success('回答正确')
          this.isRed = false
          this.trueQuestions()
        } else {
          this.$message.error('回答错误')
          this.isRed = true
          this.wrongQuestions()
        }
      }
    },
    trueQuestions:function(){
      if (this.lx==2) {
        var aId = localStorage.getItem('aId')
        this.$axiosStuResBody('Delete',this.$axiosURL.K_neoUser+'bash/delete/'+aId+'/wrongQuestions',[this.STdata[this.nowIndex].id]).then((res)=>{
          this.STdata.splice(this.nowIndex,1)
          this.nowIsQuestionAnswer = false
        })
      }
    },
    wrongQuestions:function(){
      if (this.lx==3||this.lx==4) {
        var aId = localStorage.getItem('aId')
        this.$axiosStuResBody('post',this.$axiosURL.K_neoUser+'bash/create/'+aId+'/wrongQuestions',[this.STdata[this.nowIndex].id]).then((res)=>{
        })
      }
    },
    removeQue:function(){
      var aId = localStorage.getItem('aId')
      this.$axiosStuResBody('Delete',this.$axiosURL.K_neoUser+'bash/delete/'+aId+'/wrongQuestions',[this.STdata[this.nowIndex].id]).then((res)=>{
        this.$message.success('此题已从错题库中移除')
        this.STdata.splice(this.nowIndex,1)
        this.nowIsQuestionAnswer = false
      })
    },
    findQueType:function(queType){
      var a = this.dictionarys.question_type.find((item)=>(item.value==queType))
      return a.dictName
    },
    removelast:function(data){
      var m = []
      for (var i = 0; i < data.length-1; i++) {
        m.push(data[i])
      }
      return m
    },
    initData:function(){
      if (this.lx == null) {
        this.$router.push({path:'./testTrain_index'})
      }
    },
    onSubmit:function(){
      this.clearData()
      var relZSD = this.formInline.ZSD.length==0?'': this.formInline.ZSD[this.formInline.ZSD.length-1]
      if (this.lx==2) {
        var param ={
          pageNum : this.pageNum,
            itemSize : this.itemSize,
            sequenceOrRandom :this.formInline.LXFS,
            selfConditions : {
              right:false,
              questionDifficulty:this.formInline.STND,
              questionType:this.formInline.STLX
            },
            conditions : {
              name: relZSD
            },
            neoUserId: localStorage.getItem('aId')
        }
        this.$axiosStuResBody('post',this.$axiosURL.k_examinationQuestion+'find/simulateQuestion',param).then((res)=>{
          console.log(res,9999)          
          if(res.error == "invalid_token") {
            this.loginShow = true
          }
          if (res.responseState == 'success') {
            if (this.formInline.LXFS) {
              //顺序出题
              if (res.entities) {
                this.STdata = res.entities
              } else {
                this.$message.error('所选范围不存在试题')
                this.pageNum = 1
              }
            } else {
              // 随机出题
              if (res.nonRepeatedEntities ) {
                this.STdata = res.nonRepeatedEntities
              } else {
                this.$message.error('所选范围不存在试题')
                this.pageNum = 1
              }
            }
          }
        }).then(()=>{
          this.changeStudentAnswer()
        })
      } else if(this.lx==3){
        if (this.formInline.ZSD.length==0) {
          this.$message.error('请先选择知识点')
          return
        }
        var param ={
          pageNum : this.pageNum,
            itemSize : this.itemSize,
            sequenceOrRandom :this.formInline.LXFS,
            selfConditions : {
              right:true,
              questionDifficulty:this.formInline.STND,
              questionType:this.formInline.STLX
            },
            conditions : {
              name: relZSD
            },
            neoUserId: localStorage.getItem('aId')
        }
        this.$axiosStuResBody('post',this.$axiosURL.k_examinationQuestion+'find/simulateQuestion',param).then((res)=>{
          console.log(res,7777)             
          if(res.error == "invalid_token") {
            this.loginShow = true
          }
          if (res.responseState == 'success') {
            if (this.formInline.LXFS) {
              //顺序出题
              if (res.entities) {
                  res.entities.forEach((element,index)=>{
                    if(element.questionType == "COMPREHENSIVE"){
                      res.entities.splice(index,1)
                    }
                  })
                this.STdata = res.entities
              } else {
                this.$message.error('所选范围不存在试题')
                this.pageNum = 1
              }
            } else {
              // 随机出题
              if (res.nonRepeatedEntities ) {
                  res.nonRepeatedEntities.forEach((element,index)=>{
                    if(element.questionType == "COMPREHENSIVE"){
                      res.nonRepeatedEntities.splice(index,1)
                    }
                  })
                this.STdata = res.nonRepeatedEntities
              } else {
                this.$message.error('所选范围不存在试题')
                this.pageNum = 1
              }
            }
          }
        }).then(()=>{
          this.changeStudentAnswer()
        })
      }else if(this.lx==4){
        if (this.formInline.ZSD.length==0) {
          this.$message.error('请先选择知识点')
          return
        }
        var param ={
          pageNum : this.pageNum,
            itemSize : this.itemSize,
            sequenceOrRandom :this.formInline.LXFS,
            selfConditions : {
              right:true,
              questionDifficulty:"DIFFICULT",
              questionType:this.formInline.STLX
            },
            conditions : {
              name: relZSD
            },
            neoUserId: localStorage.getItem('aId')
        }
        this.$axiosStuResBody('post',this.$axiosURL.k_examinationQuestion+'find/simulateQuestion',param).then((res)=>{
          if(res.error == "invalid_token") {
            this.loginShow = true
            return
          }
          console.log(res,8888)
          if (res.responseState == 'success') {
            if (this.formInline.LXFS) {
              //顺序出题
              if (res.entities) {
                this.STdata = res.entities
              } else {
                this.$message.error('所选范围不存在试题')
                this.pageNum = 1
              }
            } else {
              // 随机出题
              if (res.nonRepeatedEntities ) {
                this.STdata = res.nonRepeatedEntities
              } else {
                this.$message.error('所选范围不存在试题')
                this.pageNum = 1
              }
            }
          }
        }).then(()=>{
          this.changeStudentAnswer()
        })
      }  
    },
    //更改studentAnswer
    changeStudentAnswer:function(){
      console.log(this.STdata)

      for (var i = 0; i < this.STdata.length; i++) {
        if(this.STdata[i].eqBodyImageNameList && this.STdata[i].eqBodyImageNameList.length>0){
          this.STdata[i].eqBodyImageNameList1 = this.STdata[i].eqBodyImageNameList

        } else {
          this.STdata[i].eqBodyImageNameList1 = []
        }
        if(this.STdata[i].eqOptionImageNameList && this.STdata[i].eqOptionImageNameList.length>0){
          this.STdata[i].eqOptionImageNameList1 = this.STdata[i].eqOptionImageNameList

        } else {
          this.STdata[i].eqOptionImageNameList1 = []
        }
      }
      this.STdata.forEach((element,index)=>{
        if (this.findQueType(element.questionType) == '多选题') {
          element.studentAnswer = []
        } else if(this.findQueType(element.questionType) == '填空题'){
          element.studentAnswer = [{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''}]
        }else if(this.findQueType(element.questionType) == '综合题'){
          // this.STdata.splice(index,1)
        }else{
          element.studentAnswer = ''
        }
      })
      console.log(this.STdata,998)
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
    // this.lx = JSON.parse(localStorage.getItem('testTrain'))
    this.lx = this.$route.query.testTrain
    console.log(this.lx)
    this.dictionarys = JSON.parse(localStorage.getItem('dictionarys'))
    console.log(this.dictionarys);
    this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
      this.ZSDdata = this.getTreeData(res);
    })
  },
  mounted:function(){
    this.initData()
    
  },


}
</script>


<style scoped>

</style>
