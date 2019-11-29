<template>
  <div class="score">
  	 <el-row :gutter="20">
       <el-col :span='4'>
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @select='MenuClick' >
            <el-menu-item :index="index+''" v-for="(item,index) in QDSTqueAllZL">
              <i class="el-icon-setting"></i>
              <span slot="title">试卷{{Number(index)+1}}</span>
            </el-menu-item>
        </el-menu>
         <el-button type="primary" v-if='!isGD' @click="clickWCPJ">完成判卷</el-button>
              <el-button type="primary" v-if='isGD' @click="clickSJGD">试卷归档</el-button>
      </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>考试试卷评分</span>
            </div>
            <div style="height: 630px">
              <el-table
                :data="questionsZL"
                border
                max-height="570"
                @row-click='handle'
                style="width: 100%">
                <el-table-column
                  prop="dictName"
                  label="题型">
                </el-table-column>
                <el-table-column
                  prop="STBH"
                  width="230"
                  label="试题编号">
                  <template slot-scope="scope">
                    <el-row>
                      <el-col :span="6" v-for="(item,index) in scope.row.ST">
                        <el-tag :type="item.ZT == 0?'warning':'success'">{{index+1}}</el-tag>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
              
            </div>
          </el-card>
        </el-col>
         <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{questionType}}</span>
            </div>
            <el-scrollbar style='height: 630px;overflow-x: hidden;'>
              <div style="height: 630px" >
                <div v-for='(item,index) in choiceQue' class="STclass">
                  <div class="queTG">第{{index+1}}题 ({{item.singleScore}}分)、{{item.questionBody}}</div>

                  <div v-if="questionType == '单选题'">
                    <div class="XZTOption" v-for="item1 in item.questionOption">
                      <div :class="DXTchoiceAnswer(item1,item.questionAnswer)?'redClass':''">{{item1}}</div>
                    </div>
                    <div>
                      学生答案: {{item.studentAnswer}}
                    </div>
                    <div>
                       得分:{{item.studentSingleScore}}
                    </div>
                  </div>

                  <div v-if="questionType == '多选题'">
                    <div class="XZTOption" v-for="item1 in item.questionOption">
                      <div :class="DUOXTchoiceAnswer(item1,item.questionAnswer)?'redClass':''">{{item1}}</div>
                    </div>
                    <div>
                      学生答案: {{item.studentAnswer}}
                    </div>
                    <div>
                       得分:{{item.studentSingleScore}}
                    </div>
                  </div>
  
                 <div v-if="questionType == '填空题'">
                    <div>
                      答案：{{item.questionAnswer}}
                    </div>
                    <div>
                      学生答案: {{item.studentAnswer}}
                    </div>
                    <div>
                       得分:<el-input-number v-model="item.studentSingleScore"  :min="0" :max="item.singleScore" size='small'></el-input-number>
                    </div>
                  </div>

                  <div v-if="questionType == '判断题'">
                    <div class="XZTOption" v-for="item1 in item.questionOption">
                      <div :class="PDTchoiceAnswer(item1,item.questionAnswer)?'redClass':''">{{item1}}</div>
                    </div>
                    <div>
                      学生答案: {{item.studentAnswer}}
                    </div>
                    <div>
                       得分:{{item.studentSingleScore}}
                    </div>
                  </div>

                  <div v-if="questionType == '简答题'">
                    <div>
                      答案：{{item.questionAnswer}}
                    </div>
                    <div>
                      关键字：{{item.keys?item.keys.join(','):''}}
                    </div>
                    <div>
                      学生答案:<div v-html="keysColorful(item.studentAnswer,item.keys)"></div>
                    </div>
                    <div>
                       得分:<el-input-number v-model="item.studentSingleScore"  :min="0" :max="item.singleScore" size='small'></el-input-number>
                    </div>
                  </div>

                  <div v-if="questionType == '论述题'">
                    <div>
                      答案：{{item.questionAnswer}}
                    </div>
                    <div>
                      学生答案: {{item.studentAnswer}}
                    </div>
                    <div>
                       得分:<el-input-number v-model="item.studentSingleScore"  :min="0" :max="item.singleScore" size='small'></el-input-number>
                    </div>
                  </div>
        
                </div>
                <el-button v-if="questionType != ''" type="primary" size='small' @click='clickCX' round>采信</el-button> 
              </div>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>
  </div>
</template>
<script>
export default {
  data(){
      return {
       examId:null,
       QDSTqueAllZL :[],   //所有que整理
       questionsZL:[{dictName:'单选题',value:'SINGLE_CHOICE',ST:[]},{dictName:'多选题',value:'MULTIPLE_CHOICE',ST:[]},{dictName:'填空题',value:'GAP_FILLING',ST:[]},{dictName:'判断题',value:'CHECKING',ST:[]},{dictName:'简答题',value:'SHORT_ANSWER',ST:[]},{dictName:'论述题',value:'EXPOUND',ST:[]}],     //选中试卷的que整理
       questionType:'',
       choiceQueZL:null,  //当前选中试题组
       choiceQue:null,

       redClass:'redClass',  // 红色字体class
       isGD:false,  //判卷&归档
  	}
  },
  watch: {
      
  },
  methods: {
    //单选题确定正确答案
    DXTchoiceAnswer:function(val,val1){
      if (val.substring(0,1) == val1) {
         return true
      } else {
         return false
      }
    },
    //多选题确定正确答案
    DUOXTchoiceAnswer:function(val,val1){
      if ($.inArray(val.substring(0,1),val1)>-1) {
         return true
      } else {
         return false
      }
    },
    //判断题确定正确答案
    PDTchoiceAnswer:function(val,val1){
      console.log(val.split('.')[1]);
      console.log(val1);
      if (val.split('.')[1] == val1) {
         return true
      } else {
         return false
      }
    },

    //关键字匹配高亮
    keysColorful:function(str,keys){
      if (keys) {
        var newStr = str
        keys.forEach((element)=>{
          var reg =  new RegExp("("+element+")", "g")
          newStr = newStr.replace(reg,"<font style='color:#f01'><b>$1</b></font>")
        })
        return newStr
      } else {
        return str
      }
    },
     clickWCPJ:function(){
      var a = true
      this.QDSTqueAllZL.forEach((element,index)=>{
         element.STall.forEach((element1,index1)=>{
          console.log(element1.ZT);
          if (element1.ZT == 0) {
            this.$message.error('请先完成所有试题的采信')
            a = false
          }
         })
      })
      if (!a) return
      this.$axiosRes1('post',this.$axiosURL.e_examination+'finishJudge',{examId:this.examId}).then((res)=>{
        if (res) {
          this.$message.success('判卷已完成')
          this.$bus.$emit('colseWindos','')
        } else {
          this.$message.error(res.message)
        }
          
      })
    },
    clickSJGD:function(){
      var a = true
      this.QDSTqueAllZL.forEach((element,index)=>{
         element.STall.forEach((element1,index1)=>{
          console.log(element1.ZT);
          if (element1.ZT == 0) {
            this.$message.error('请先完成所有试题的采信')
            a = false
          }
         })
      })
      if (!a) return
      this.$axiosRes1('post',this.$axiosURL.e_examination+'scoreSummarize',{examId:this.examId}).then((res)=>{
        if (res) {
          this.$message.success('试卷已归档')
          this.$bus.$emit('colseWindosGD','')
        } else {
          this.$message.error(res.message)
        }
          
      })
    },
    //采信
    clickCX:function(){
      var param2 = []
        this.choiceQue.forEach((element1,indx)=>{
          param2.push({id:element1.id,studentSingleScore:element1.studentSingleScore})
          element1.ZT = 1
        })
        this.$axiosResBody1('put',this.$axiosURL.k_examinationQuestion+'bash/update/studentSingleScore',param2).then((res)=>{
        })
    },
    handle:function(row){
      //当前选中试题组
      this.choiceQueZL = row
      this.choiceQue = row.ST
      //试题类型
      this.questionType = row.dictName
      console.log(row);
      //判题
      if(this.isGD) return
      if(row.ST.length&&row.ST[0].ZT==1) return
      if (this.questionType == '单选题') {
        row.ST.forEach((element)=>{
           if (element.studentAnswer&&element.studentAnswer.substring(0,1) == element.questionAnswer) {
            element.studentSingleScore = element.singleScore
           }else {
             element.studentSingleScore = 0
           }
        })
      }else if (row.dictName == '多选题') {
        row.ST.forEach((element)=>{
            var a = ''
            // element.studentAnswer.split(',').forEach((element2)=>{
            //   a += element2.substring(0,1)
            // })
            for (var i = 0; i <= element.studentAnswer.split(',').sort().length-1; i++) {
              a += element.studentAnswer.split(',').sort()[i].substring(0,1)
            }
           if (a == element.questionAnswer.split(',').join('')) {
            element.studentSingleScore = element.singleScore
           }else {
             element.studentSingleScore = 0
           }
        })
      }else if(row.dictName == '填空题'){
        row.ST.forEach((element)=>{
            var a = parseFloat(element.singleScore)/ element.questionAnswer.length //单空分值
            var b = 0  //临时分值
            element.questionAnswer.split(',').forEach((element2,index2)=>{
                if (element2 == element.studentAnswer.split(';')[index2]) {
                  b += a
                }
            })
            element.studentSingleScore = b== 0?0:Math.round(b)
        })
      }else if(row.dictName == '简答题'){
        row.ST.forEach((element)=>{
            if (element.keys) {
              var a = parseFloat(element.singleScore)/ element.keys.length //单个关键字分值
              var b = 0  //临时分值
              element.keys.forEach((element2,index2)=>{
                if (element.studentAnswer.indexOf(element2) != -1) {
                  b += a
                }
              })
              element.studentSingleScore = b== 0?0:Math.round(b)
            } else {
              element.studentSingleScore = 0
            }
        })
      }else if(this.questionType == '判断题'){
        row.ST.forEach((element)=>{
           if (element.studentAnswer&&element.studentAnswer.split('.')[1] == element.questionAnswer) {
            element.studentSingleScore = element.singleScore
           }else {
             element.studentSingleScore = 0
           }
        })
      }else if(this.questionType == '论述题'){
        row.ST.forEach((element)=>{
             element.studentSingleScore = 0   
        })
      }
      
    },
    MenuClick:function(index){
      var a = index
      this.questionsZL = [{dictName:'单选题',value:'SINGLE_CHOICE',ST:[]},{dictName:'多选题',value:'MULTIPLE_CHOICE',ST:[]},{dictName:'填空题',value:'GAP_FILLING',ST:[]},{dictName:'判断题',value:'CHECKING',ST:[]},{dictName:'简答题',value:'SHORT_ANSWER',ST:[]},{dictName:'论述题',value:'EXPOUND',ST:[]}]
      this.QDSTqueAllZL[a].STall.forEach((element, index)=>{
        let a = this.questionsZL.find((item)=>(item.value == element.questionType))
        a.ST.push(element)
        console.log('试题分类', this.questionsZL);
      })
      //questions整理

    },
    clearnAllData:function(){
      this.QDSTqueAllZL = []
      this.questionsZL = [{dictName:'单选题',value:'SINGLE_CHOICE',ST:[]},{dictName:'多选题',value:'MULTIPLE_CHOICE',ST:[]},{dictName:'填空题',value:'GAP_FILLING',ST:[]},{dictName:'判断题',value:'CHECKING',ST:[]},{dictName:'简答题',value:'SHORT_ANSWER',ST:[]},{dictName:'论述题',value:'EXPOUND',ST:[]}]
    },
    initData:function(data){
      this.examId = data.row.id
      if (data.res.length>0) {
        this.QDSTqueAllZL = []
        data.res.forEach((element,index)=>{
          var XSSJ = {STall:[]}
          this.$axiosRes1('post',this.$axiosURL.e_examinationPaper+'findStuPaperById',{paperId:element}).then((res)=>{
              res.examinationQuestions.forEach((element1)=>{
                // console.log(XSSJ.STall);
                // console.log(element1.question);
                element1.question['ZT'] = 0
                XSSJ.STall.push(element1.question)
              })
          })
          this.QDSTqueAllZL.push(XSSJ)
        })
      }
      console.log(this.QDSTqueAllZL);
    },
  },
  mounted:function(){
    this.clearnAllData()
    //随机试题考试
    this.$bus.$on('SJSTKS',(data)=>{
      this.initData(data)
      this.isGD = false
    })
    this.$bus.$on('SJSTGD',(data)=>{
      this.initData(data)
      this.isGD = true
    })
  }
}
</script>
<style scoped>
.score{
  height: 700px;
}
.redClass{
  color: red;
}
  
</style>