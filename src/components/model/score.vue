<template>
  <div class="tableChange">
  	 <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>考试试卷评分</span>
            </div>
            <div style="height: 650px">
              <el-table
                :data="QDSTqueAllZL"
                border
                @row-click='handle'
                style="width: 100%">
                <el-table-column
                  prop="dictName"
                  label="题型">
                </el-table-column>
                <el-table-column
                  prop="STBH"
                  width="240"
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
              <el-button type="primary" v-if='!isGD' @click="clickWCPJ">完成判卷</el-button>
              <el-button type="primary" v-if='isGD' @click="clickSJGD">试卷归档</el-button>
            </div>
          </el-card>
        </el-col>
         <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{questionType}}</span>
            </div>
            <el-scrollbar style='height: 650px;overflow-x: hidden;'>
              <div style="height: 650px" >
                <div v-for='(item,index) in this.choiceQue' class="STclass">
                  {{item.singleScore}}
                  <div class="queXH">第{{index+1}}题 ({{item.singleScore}}分)、</div>
                  <div class="queTG">{{item.questionBody}}</div>

                  <div v-if="questionType == '单选题'">
                    <div class="XZTOption" v-for="item1 in item.allData[0].questionOption">
                      <div :class="DXTchoiceAnswer(item1,item.allData[0].questionAnswer)?'redClass':''">{{item1}}</div>
                    </div>
                    <el-tag type="warning" >答对人次:{{item.trueSTnum}}</el-tag>
                    <el-tag type="success">正确率:{{item.STZQL*100}}%</el-tag>
                  </div>

                  <div v-if="questionType == '判断题'">
                    <div class="XZTOption" v-for="item1 in item.allData[0].questionOption">
                      <div :class="PDTchoiceAnswer(item1,item.allData[0].questionAnswer)?'redClass':''">{{item1}}</div>
                    </div>
                    <el-tag type="warning" >答对人次:{{item.trueSTnum}}</el-tag>
                    <el-tag type="success">正确率:{{item.STZQL*100}}%</el-tag>
                  </div>

                  <div v-if="questionType == '多选题'">
                    <div class="XZTOption" v-for="item1 in item.allData[0].questionOption">
                      <div :class="DUOXTchoiceAnswer(item1,item.allData[0].questionAnswer)?'redClass':''">{{item1}}</div>
                    </div>
                    <el-tag type="warning" >答对人次:{{item.trueSTnum}}</el-tag>
                    <el-tag type="success">正确率:{{item.STZQL*100}}%</el-tag>
                  </div>
  
                  <div v-if="questionType == '填空题'">
                    答案：{{item.questionAnswer}}<br/>
                    <el-table
                      :data="item.allData"
                      size="mini"
                      border
                      style="width: 100%">
                     <el-table-column
                        type="index">
                      </el-table-column>
                       <el-table-column
                        label="考生答案">
                        <template slot-scope="scope">
                          <div v-for="(item1,index1) in scope.row.studentAnswer.split(';')" style="display: inline-block;margin: 0 3px">
                            <el-tag :type="item1==scope.row.questionAnswer.split(',')[index1]?'success':'danger'">{{item1}}</el-tag>
                          </div>
                        </template>
                      </el-table-column>
                       <el-table-column
                        width='150px'
                        label="得分">
                        <template slot-scope="scope">
                          <el-input-number v-model="scope.row.studentSingleScore"  :min="0" :max="scope.row.singleScore" size='small'></el-input-number>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-tag type="warning" >平均得分:{{item.gainScore/item.STnum}}</el-tag>
                    <el-tag type="success">得分率:{{100*item.gainScore/(item.STnum*item.singleScore)}}%</el-tag>
                  </div>

                  <div v-if="questionType == '简答题'">
                    关键字：{{item.keys?item.keys.join(','):''}}<br/>
                    <el-table
                      :data="item.allData"
                      size="mini"
                      border
                      style="width: 100%">
                    <el-table-column
                        type="index">
                      </el-table-column>
                       <el-table-column
                        label="考生答案">
                        <template slot-scope="scope">
                          <div v-html="keysColorful(scope.row.studentAnswer,item.keys)"></div>
                        </template>
                      </el-table-column>
                       <el-table-column
                        width='150px'
                        label="得分">
                        <template slot-scope="scope">
                          <el-input-number v-model="scope.row.studentSingleScore"  :min="0" :max="scope.row.singleScore" size='small'></el-input-number>
                        </template>
                      </el-table-column>
                    </el-table>
                     <el-tag type="warning" >平均得分:{{item.gainScore/item.STnum}}</el-tag>
                    <el-tag type="success">得分率:{{100*item.gainScore/(item.STnum*item.singleScore)}}%</el-tag>
                  </div>

                  <div v-if="questionType == '论述题'">
                    答案：{{item.questionAnswer}}<br/>
                    <el-table
                      :data="item.allData"
                      size="mini"
                      border
                      style="width: 100%">
                    <el-table-column
                        type="index">
                      </el-table-column>
                       <el-table-column
                        label="考生答案">
                        <template slot-scope="scope">
                          {{scope.row.studentAnswer}}        
                        </template>
                      </el-table-column>
                       <el-table-column
                        width='150px'
                        label="得分">
                        <template slot-scope="scope">
                          <el-input-number v-model="scope.row.studentSingleScore"  :min="0" :max="scope.row.singleScore" size='small'></el-input-number>
                        </template>
                      </el-table-column>
                    </el-table>
                     <el-tag type="warning" >平均得分:{{item.gainScore/item.STnum}}</el-tag>
                    <el-tag type="success">得分率:{{100*item.gainScore/(item.STnum*item.singleScore)}}%</el-tag>
                  </div>

                  <div v-if="questionType == '综合题'" >
                     <el-table
                      :data="item.allData"
                      style="width: 100%">
                      <el-table-column type="expand" :key='Math.random()'>
                        <template slot-scope="props">
                          
                          <div v-for='(item1,index1) in  props.row.examinationSubquestions' class="STclass">
                            <div class="queTG">第{{index1+1}}题 ({{item1.singleScore}}分)、{{item1.questionBody}}</div>

                            <div v-if="item1.questionType == 'SINGLE_CHOICE'">
                              <div class="XZTOption" v-for="item2 in item1.questionOption">
                                <div :class="DXTchoiceAnswer(item2,item1.questionAnswer)?'redClass':''">{{item2}}</div>
                              </div>
                              <div>
                                学生答案{{item1.studentAnswer}}  得分{{item1.studentSingleScore}}
                              </div>
                            </div>
                            <div v-if="item1.questionType == 'MULTIPLE_CHOICE'">
                              <div class="XZTOption" v-for="item2 in item1.questionOption">
                                <div :class="DUOXTchoiceAnswer(item2,item1.questionAnswer)?'redClass':''">{{item2}}</div>
                              </div>
                              <div>
                                学生答案{{item1.studentAnswer}}  得分{{item1.studentSingleScore}}
                              </div>
                            </div>
                            <div v-if="item1.questionType == 'GAP_FILLING'">
                              <div>
                                参考答案:{{item1.questionAnswer}}
                              </div>
                              <div>
                                学生答案: <span v-for="(item2,index2) in item1.studentAnswer.split(';')" style="display: inline-block;margin: 0 3px">
                                  <a :class="item2==item1.questionAnswer.split(',')[index2]?'redClass':''">{{item2}}</a>
                                </span>
                              </div>
                              <div>
                                 得分:<el-input-number v-model="item1.studentSingleScore"  :min="0" :max="item1.singleScore" size='small'></el-input-number>
                              </div>
                            </div>
                            <div v-if="item1.questionType == 'CHECKING'">
                               <div class="XZTOption" v-for="item2 in item1.questionOption">
                                <div :class="PDTchoiceAnswer(item2,item1.questionAnswer)?'redClass':''">{{item2}}</div>
                                </div>
                                <div>
                                  学生答案{{item1.studentAnswer}}  得分{{item1.studentSingleScore}}
                                </div>
                              </div>
                            <div v-if="item1.questionType == 'SHORT_ANSWER'">
                              <div>
                                参考答案:{{item1.questionAnswer}}
                              </div>
                              <div>
                                学生答案: <span v-html="keysColorful(item1.studentAnswer,item1.keys)"></span>
                              </div>
                              <div>
                                 得分:<el-input-number v-model="item1.studentSingleScore"  :min="0" :max="item1.singleScore" size='small'></el-input-number>
                              </div>
                              
                            </div>
                            <div v-if="item1.questionType == 'EXPOUND'">
                              <div>
                                参考答案:{{item1.questionAnswer}}
                              </div>
                              <div>
                                学生答案: {{item1.studentAnswer}}
                              </div>
                              <div>
                                 得分:<el-input-number v-model="item1.studentSingleScore"  :min="0" :max="item1.singleScore" size='small'></el-input-number>
                              </div>
                            </div>
                          </div>

                        </template>
                      </el-table-column>
                      <el-table-column
                      :key='Math.random()'
                        type="index"
                        width="50">
                      </el-table-column>
                      <el-table-column
                        :key='Math.random()'
                        label="ID"
                        prop="id">
                      </el-table-column>
                      <el-table-column
                        :key='Math.random()'
                        label="总分"
                        prop="studentSingleScore">
                      </el-table-column>
                    </el-table>                  
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
        SJtype:'',  //试卷类型
        QDSTqueAll:[],  //确定试题考试 所有试题
        QDSTqueAllZL:[{dictName:'单选题',value:'SINGLE_CHOICE',ST:[]},{dictName:'多选题',value:'MULTIPLE_CHOICE',ST:[]},{dictName:'填空题',value:'GAP_FILLING',ST:[]},{dictName:'判断题',value:'CHECKING',ST:[]},{dictName:'简答题',value:'SHORT_ANSWER',ST:[]},{dictName:'论述题',value:'EXPOUND',ST:[]},{dictName:'综合题',value:'COMPREHENSIVE',ST:[]}],  //确定试题考试 所有试题 整理
        queType:'客观题',  //试题类型,主观题，客观题
        questionType:'',  //选择、填空、判断、、、
        examId:'', //当前考试id
        choiceQueZL:null,
        choiceQue:null,  //当前选中的试题组

        redClass:'redClass',  // 红色字体class
        isGD:false,  //判卷&归档
  	}
  },
  watch: {
      QDSTqueAllZL:{
        handler(val){
          val.forEach((element)=>{
            element.ST.forEach((element1)=>{
              var a = 0
              element1.allData.forEach((element2)=>{
                if (element2.studentSingleScore != null) {
                  a += element2.studentSingleScore
                }
              })
              element1.gainScore = a
            })
            //更新综合题总分
            if (element.dictName == '综合题') {
              element.ST.forEach((element1)=>{
                var b = 0
                element1.allData.forEach((element2)=>{
                    var a = 0
                    element2.examinationSubquestions.forEach((element3)=>{
                      a += element3.studentSingleScore
                    })
                    element2.studentSingleScore = a
                    b += a
                })
                element1.gainScore = b
              })
            }
          })
        },
      deep:true,
      immediate:false
    }
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
    //采信
    clickCX:function(){
      this.choiceQue.forEach((element)=>{
        var param ={examId:this.examId,queId:element.queId } 
        var param1 = ''
        this.$axiosRes1('get',this.$axiosURL.e_examinationPaper+'findPaperIdAndPointIdByExamIdAndQueId',param).then((res)=>{
          var a = this.choiceQueZL.dictName
          if (a=='单选题'||a=='多选题'||a=='判断题') {
            param1 ={
              examId:this.examId,
              queId:element.queId,
              paperId:res.paperId,
              pointId:res.pointId,
              singleScore:element.singleScore,
              answerCount:element.STnum,
              rightCount:element.trueSTnum,
              gainScore:element.gainScore,
              rightRatio:element.STZQL,
              questionType:element.questionType,
              questionDifficulty:element.questionDifficulty,
            }
          } else if(a=='填空题'||a=='简答题'||a=='论述题'||a=='综合题') {
            param1 ={
              examId:this.examId,
              queId:element.queId,
              paperId:res.paperId,
              pointId:res.pointId,
              singleScore:element.singleScore,
              answerCount:element.STnum,
              gainScore:element.gainScore,
              questionType:element.questionType,
              questionDifficulty:element.questionDifficulty,
            }
          }
        }).then(()=>{
          this.$axiosResBody('post',this.$axiosURL.b_queStatistics,param1).then((res)=>{
            element.ZT = 1
            if (res == '该条信息已统计，不可重复提交！') {
              this.$message.error(res)
            }else {
              this.$message.success(res)
              var param2 = []
              element.allData.forEach((element1,indx)=>{
                if (element1.questionType == "COMPREHENSIVE") {
                  var a = {id:element1.id,studentSingleScore:element1.studentSingleScore,examinationSubquestions:[]}
                  element1.examinationSubquestions.forEach((element2)=>{
                    a.examinationSubquestions.push({id:element2.id,studentSingleScore:element2.studentSingleScore})
                  })
                  param2.push(a)
                } else {
                  param2.push({id:element1.id,studentSingleScore:element1.studentSingleScore})
                }

              })
              this.$axiosResBody1('put',this.$axiosURL.k_examinationQuestion+'bash/update/studentSingleScore',param2).then((res)=>{
              })
            }
          })
        })
      })
    },

    clearnAllData:function(){
      this.QDSTqueAll = []
      this.QDSTqueAllZL = [{dictName:'单选题',value:'SINGLE_CHOICE',ST:[]},{dictName:'多选题',value:'MULTIPLE_CHOICE',ST:[]},{dictName:'填空题',value:'GAP_FILLING',ST:[]},{dictName:'判断题',value:'CHECKING',ST:[]},{dictName:'简答题',value:'SHORT_ANSWER',ST:[]},{dictName:'论述题',value:'EXPOUND',ST:[]},{dictName:'综合题',value:'COMPREHENSIVE',ST:[]}]
      this.questionType=''
      this.examId=''
      this.choiceQueZL=null
      this.choiceQue=null
    },
    clickWCPJ:function(){
      var a = true
      this.QDSTqueAllZL.forEach((element,index)=>{
        console.log(element);
         element.ST.forEach((element1,index1)=>{
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
        console.log(element);
         element.ST.forEach((element1,index1)=>{
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
    handle:function(row, event, column){
      //当前选中试题组
      this.choiceQueZL = row
      this.choiceQue = row.ST
      //试题类型
      this.questionType = row.dictName
      
      if(row.ST.length&&row.ST[0].ZT==1) return
      //判题
      if(this.isGD) {
        if (this.questionType == '单选题') {
          row.ST.forEach((element)=>{
            element.trueSTnum = 0
            element.allData.forEach((element1)=>{
             if (element1.studentAnswer&&element1.studentAnswer.substring(0,1) == element1.questionAnswer) {
              element1.studentSingleScore = element1.singleScore
              element.trueSTnum++
             }else {
               element1.studentSingleScore = 0
             }
            })
            element.STZQL = element.trueSTnum/element.STnum
          })
        }else if (row.dictName == '多选题') {
          row.ST.forEach((element)=>{
            element.trueSTnum = 0
            element.allData.forEach((element1)=>{
              var a = ''
              // element1.studentAnswer.split(',').forEach((element2)=>{
              //   a += element2.substring(0,1)
              // })
              for (var i = 0; i <= element1.studentAnswer.split(',').sort().length-1; i++) {
                a += element1.studentAnswer.split(',').sort()[i].substring(0,1)
              }
             if (a == element1.questionAnswer.split(',').join('')) {
              element1.studentSingleScore = element1.singleScore
              element.trueSTnum++
             }else {
               element1.studentSingleScore = 0
             }
            })
            element.STZQL = element.trueSTnum/element.STnum
          })
        }else if(this.questionType == '判断题'){
          row.ST.forEach((element)=>{
            element.trueSTnum = 0
            element.allData.forEach((element1)=>{
             if (element1.studentAnswer&&element1.studentAnswer.split('.')[1] == element1.questionAnswer) {
              element1.studentSingleScore = element1.singleScore
              element.trueSTnum++
             }else {
               element1.studentSingleScore = 0
             }
            })
            element.STZQL = element.trueSTnum/element.STnum
          })
        }
      }else{
        if (this.questionType == '单选题') {
          row.ST.forEach((element)=>{
            element.trueSTnum = 0
            element.allData.forEach((element1)=>{
             if (element1.studentAnswer&&element1.studentAnswer.substring(0,1) == element1.questionAnswer) {
              element1.studentSingleScore = element1.singleScore
              element.trueSTnum++
             }else {
               element1.studentSingleScore = 0
             }
            })
            element.STZQL = element.trueSTnum/element.STnum
          })
        }else if (row.dictName == '多选题') {
          row.ST.forEach((element)=>{
            element.trueSTnum = 0
            element.allData.forEach((element1)=>{
              var a = ''
              // element1.studentAnswer.split(',').forEach((element2)=>{
              //   a += element2.substring(0,1)
              // })
              for (var i = 0; i <= element1.studentAnswer.split(',').sort().length-1; i++) {
                a += element1.studentAnswer.split(',').sort()[i].substring(0,1)
              }
             if (a == element1.questionAnswer.split(',').join('')) {
              element1.studentSingleScore = element1.singleScore
              element.trueSTnum++
             }else {
               element1.studentSingleScore = 0
             }
            })
            element.STZQL = element.trueSTnum/element.STnum
          })
        }else if(row.dictName == '填空题'){
          row.ST.forEach((element)=>{
            element.gainScore = 0 //得分总和清零
            element.allData.forEach((element1)=>{
              var a = parseFloat(element.singleScore)/ element.questionAnswer.length //单空分值
              var b = 0  //临时分值
              element1.questionAnswer.split(',').forEach((element2,index2)=>{
                  if (element2 == element1.studentAnswer.split(';')[index2]) {
                    b += a
                  }
              })
              element1.studentSingleScore = b== 0?0:Math.round(b)
              element.gainScore += element1.studentSingleScore
            })
          })
        }else if(row.dictName == '简答题'){
          row.ST.forEach((element)=>{
            element.gainScore = 0 //得分总和清零
            element.allData.forEach((element1)=>{

              if (element.keys) {
                var a = parseFloat(element.singleScore)/ element.keys.length //单个关键字分值
                var b = 0  //临时分值
                element1.keys.forEach((element2,index2)=>{
                  if (element1.studentAnswer.indexOf(element2) != -1) {
                    b += a
                  }
                })
                element1.studentSingleScore = b== 0?0:Math.round(b)
                element.gainScore += element1.studentSingleScore
              } else {
                element1.studentSingleScore = 0
              }
              
            })
          })
        }else if(this.questionType == '判断题'){
          row.ST.forEach((element)=>{
            element.trueSTnum = 0
            element.allData.forEach((element1)=>{
             if (element1.studentAnswer&&element1.studentAnswer.split('.')[1] == element1.questionAnswer) {
              element1.studentSingleScore = element1.singleScore
              element.trueSTnum++
             }else {
               element1.studentSingleScore = 0
             }
            })
            element.STZQL = element.trueSTnum/element.STnum
          })
        }else if(this.questionType == '论述题'){
          row.ST.forEach((element)=>{
            element.allData.forEach((element1)=>{
               element1.studentSingleScore = 0   
            })
          })
        }else if(this.questionType == '综合题'){
          row.ST.forEach((element)=>{
            element.allData.forEach((element1)=>{
              element1.examinationSubquestions.forEach((element2)=>{
                if (element2.questionType == 'SINGLE_CHOICE') {
                    if (element2.studentAnswer&&element2.studentAnswer.substring(0,1) == element2.questionAnswer) {
                      element2.studentSingleScore = element2.singleScore
                     }else {
                       element2.studentSingleScore = 0
                     }
                }else if(element2.questionType == 'MULTIPLE_CHOICE'){
                    var a = ''
                    // element2.studentAnswer.split(';').forEach((element3)=>{
                    //   a += element3.substring(0,1)
                    // })
                    for (var i = 0; i <= element2.studentAnswer.split(';').sort().length-1; i++) {
                      a += element2.studentAnswer.split(';').sort()[i].substring(0,1)
                    }
                    if (a == element2.questionAnswer.split(',').join('')) {
                      element2.studentSingleScore = element2.singleScore
                    }else {
                      element2.studentSingleScore = 0
                    }
                }else if(element2.questionType == 'GAP_FILLING'){
                    var a = parseFloat(element2.singleScore)/ element2.questionAnswer.length //单空分值
                    var b = 0  //临时分值
                    element2.questionAnswer.split(',').forEach((element3,index2)=>{
                        if (element3 == element2.studentAnswer.split(';')[index2]) {
                          b += a
                        }
                    })
                    element2.studentSingleScore = b== 0?0:Math.round(b)
                }else if(element2.questionType == 'CHECKING'){
                      if (element2.studentAnswer&&element2.studentAnswer.split('.')[1] == element2.questionAnswer) {
                        element2.studentSingleScore = element2.singleScore
                        element.trueSTnum++
                       }else {
                         element2.studentSingleScore = 0
                       }
                }else if(element2.questionType == 'SHORT_ANSWER'){
                    if (element2.keys) {
                        var a = parseFloat(element2.singleScore)/ element2.keys.length //单个关键字分值
                        var b = 0  //临时分值
                        element2.keys.forEach((element3)=>{
                          if (element2.studentAnswer.indexOf(element3) != -1) {
                            b += a
                          }
                        })
                        element2.studentSingleScore = b== 0?0:Math.round(b)
                    } else {
                        element2.studentSingleScore = 0
                    }
                      
                }else if(element2.questionType == 'EXPOUND'){
                      element2.studentSingleScore = 0
                }
                
              })
            })
          })
        }
      }
      
      
      console.log(this.choiceQue);
    },
    initData:function(data){
      this.SJtype = '确定试题考试'
      this.clearnAllData()
      this.examId = data.row.id
      if (data.res.length>0) {
        var nowIndex = 0
        data.res.forEach((element,index)=>{
          var param1 ={
            examId:data.row.id,
            queId:element
          }
          this.$axiosRes1('post',this.$axiosURL.e_examinationPaper+'findStuQuesByExamIdAndQuesId',param1).then((res)=>{
              var a = {
                examId:data.row.id,
                queId:element,
                questionBody:res[0].questionBody,
                questionOption:res[0].questionOption,
                questionAnalyze:res[0].questionAnalyze,
                questionAnswer:res[0].questionAnswer,
                questionType:res[0].questionType,
                questionDifficulty:res[0].questionDifficulty,
                singleScore:res[0].singleScore,
                keys:res[0].keys,
                STnum:res.length,
                trueSTnum:0,
                gainScore:0,
                STZQL:0,
                ZT:0,
                allData:res
              }
              this.QDSTqueAll.push(a)
          }).then(()=>{
            nowIndex++
            if (nowIndex == data.res.length) {
              //试题分类
                this.QDSTqueAll.forEach((element, index)=>{
                  let a = this.QDSTqueAllZL.find((item)=>(item.value == element.questionType))
                  a.ST.push(element)
                  console.log('试题分类', this.QDSTqueAllZL);
                })
            } 
          })
        })
      }    
    },
  },
  mounted:function(){
    //确定试题考试
  	this.$bus.$on('QDSTKS',(data)=>{
      this.initData(data)
      this.isGD = false
    })
    //确定试题归档
    this.$bus.$on('QDSTGD',(data)=>{
      this.initData(data)
      this.isGD = true
    })
                 
  }
}
</script>
<style scoped>
.queXH{
  font-size: 20px;
}
.redClass{
  color: red;
}
.STclass{
  padding: 10px 0;
}
</style>