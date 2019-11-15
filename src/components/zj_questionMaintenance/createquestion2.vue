<template>
  <div class="tableChange">
      <xzquestion :multipleChoiceForm.sync="multipleChoiceForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="xzquestion" :fileList.sync="fileList" v-if="this.directoryCreate.questionsTestingType === 'MULTIPLE_CHOICE'">
                <el-row slot="handleQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(multipleChoiceForm)" >提交</el-button>
                    <el-button @click="resetQuestionData('multipleChoiceForm')" >重置</el-button>
                  </el-col>
                </el-row>
            </xzquestion>

            <tkquestion :gapFillingForm.sync="gapFillingForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="tkquestion" :fileList.sync="fileList" v-if="this.directoryCreate.questionsTestingType === 'GAP_FILLING'">
                <el-row slot="handleQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(gapFillingForm)" >提交</el-button>
                    <el-button @click="resetQuestionData('gapFillingForm')" >重置</el-button>
                  </el-col>
                </el-row>
            </tkquestion>

            <pdquestion :judgeForm.sync="judgeForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="pdquestion" :fileList.sync="fileList" v-if="this.directoryCreate.questionsTestingType === 'CHECKING'">
                <el-row slot="handleQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(judgeForm)" >提交</el-button>
                    <el-button @click="resetQuestionData('judgeForm')" >重置</el-button>
                  </el-col>
                </el-row>
            </pdquestion>

            <jdquestion :shortAnswerForm.sync="shortAnswerForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="jdquestion" :fileList.sync="fileList" v-if="this.directoryCreate.questionsTestingType === 'SHORT_ANSWER'">
                <el-row slot="handleQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(shortAnswerForm)" >提交</el-button>
                    <el-button @click="resetQuestionData('shortAnswerForm')" >重置</el-button>
                  </el-col>
                </el-row>
            </jdquestion>

            <zhquestion :reorganizeForm.sync="reorganizeForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="zhquestion" :fileList.sync="fileList" v-if="this.directoryCreate.questionsTestingType === 'COMPREHENSIVE'">
                <el-row slot="handleQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(reorganizeForm)" >提交</el-button>
                    <el-button @click="resetQuestionData('reorganizeForm')" >重置</el-button>
                  </el-col>
                </el-row>
            </zhquestion>

            <dxquestion :radioChoiceForm.sync="radioChoiceForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="dxquestion" :fileList.sync="fileList" v-if="this.directoryCreate.questionsTestingType === 'SINGLE_CHOICE'">
                <el-row slot="handleQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(radioChoiceForm)" >提交</el-button>
                    <el-button @click="resetQuestionData('radioChoiceForm')" >重置</el-button>
                  </el-col>
                </el-row>
            </dxquestion>

            <lsquestion :discussForm.sync="discussForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="lsquestion" :fileList.sync="fileList" v-if="this.directoryCreate.questionsTestingType === 'EXPOUND'">
                <el-row slot="handleQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(discussForm)" >提交</el-button>
                    <el-button @click="resetQuestionData('discussForm')" >重置</el-button>
                  </el-col>
                </el-row>
            </lsquestion>
  </div>
</template>
<script>
import xzquestion from '@/components/zj_questionMaintenance/XZquestion.vue'
import tkquestion from '@/components/zj_questionMaintenance/TKquestion.vue'
import pdquestion from '@/components/zj_questionMaintenance/PDquestion.vue'
import jdquestion from '@/components/zj_questionMaintenance/JDquestion.vue'
import zhquestion from '@/components/zj_questionMaintenance/ZHquestion.vue'
import dxquestion from '@/components/zj_questionMaintenance/DXquestion.vue'
import lsquestion from '@/components/zj_questionMaintenance/LSquestion.vue'

export default {
  data(){
      return{
        //   初始化数据
        initData: {},
        ZSDprops:{
          value:'id',
          label:'name',
          children:'knowledgePoints',
        },
        directoryCreate: {
          subjectsIdsStr: '',
          question_difficulty: '',
          exam_modality: '',
          questionsTestingType: '',
          question_ability_norm: ''
        },
        rules: {
          subjectsIdsStr: [
            { required: true, message: '请选择知识节点', trigger: 'change' }
          ],
          question_ability_norm: [
            { required: true, message: '请选择能力指标', trigger: 'change' }
          ],
          exam_modality: [
            { required: true, message: '请选择用途', trigger: 'change' }
          ],
          question_difficulty: [
            { required: true, message: '请选择试题难度', trigger: 'change' }
          ]
        },
//      附件数据集合
        fileListArr: [],
        fileList: [],
        propressNum: 0,
        //  论述题数据
        discussForm: {
          questionAnalyze: '',
          questionBody: '',
          questionAnswer: '',
          keys:[]
        },
        // 填空题数据
        gapFillingForm: {
          questionAnalyze: '',
          questionBody: '',
          questionAnswer: []
        },
        //  判断题数据
        judgeForm: {
          questionAnalyze: '',
          questionBody: '',
          questionAnswer: '',
          questionOption:[]
        },
        //  多选题数据
        multipleChoiceForm: {
          questionAnalyze: '',
          questionBody: '',
          questionOption: [{value: '', key: 'A'},{value: '', key: 'B'},{value: '', key: 'C'},{value: '', key: 'D'}],
          questionAnswer: []
        },
        //  单选题数据
        radioChoiceForm: {
          questionAnalyze: '',
          questionBody: '',
          questionOption: [{value: '', key: 'A'},{value: '', key: 'B'},{value: '', key: 'C'},{value: '', key: 'D'}],
          questionAnswer: ''
        },
        //  综合题数据
        reorganizeForm: {
          questionBody: '',
          examinationSubquestions: [
          ]

        },
        //  简答题数据
        shortAnswerForm: {
          questionBody: '',
          keys:[],
          questionAnswer: '',
          questionAnalyze: ''
        },
        ZSDdata: []
    }   
  },
  components: {
    xzquestion,
    tkquestion,
    pdquestion,
    jdquestion,
    zhquestion,
    dxquestion,
    lsquestion
  },

  mounted(){
    this.$bus.$on('changeRadio',(directoryCreate)=>{
      this.directoryCreate = directoryCreate
    })
    this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
      // console.log(12,res);
      this.ZSDdata = res;
    })
    this.$axiosGet(this.$axiosURL.b_dictionarys,{}).then((res)=>{
            this.$store.state.dictionarys = res;
            this.initData = this.$store.state.dictionarys
            console.log(1,this.initData)
            // console.log(2,this.initData.question_difficulty)
            // for( var i = 0; i < this.initData.question_difficulty.length;i++ ) {
            //   console.log(this.initData.question_difficulty[i])
            // }
    })
  },
  methods: {
    // (val){
    //   // console.log(val)
    //   if( val.length > 1) {
    //     console.log(val)
    //   }
    // },
    handleSubmitData(formName){
            if (formName.questionBody === '') {
              this.$message({
                message: '题干不能为空',
                type: 'error'
              })
              return
            }
            if (formName.questionAnswer && (!formName.questionAnswer.length)) {
              this.$message({
                message: '答案不能为空',
                type: 'error'
              })
              return
            }
            if (formName.questionAnswer === '') {
              this.$message({
                message: '答案不能为空',
                type: 'error'
              })
              return
            }

            // 综合题部分校验
            if(formName.examinationSubquestions) {
              if(formName.examinationSubquestions.length <= 0) {
              this.$message({
                message: '请先添加试题',
                type: 'error'
              })
              return
              }

              for (var i = 0; i < formName.examinationSubquestions.length; i++) {
                // console.log(formName.examinationSubquestions[i])
                // 综合题下的选择题 选项数据类型转换
                if(formName.examinationSubquestions[i].questionType == "MULTIPLE_CHOICE" || formName.examinationSubquestions[i].questionType == "SINGLE_CHOICE") {
                  var array = []
                  for(var j=0; j< formName.examinationSubquestions[i].questionOption.length; j++){
                      // for( var k in formName.examinationSubquestions[i].questionOption[i]){
                      //   var str = ''
                      //   str = str + formName.examinationSubquestions[i].questionOption[i][k] + '.' + i
                      // }
                      // console.log(str)
                      var str = ''
                      str = formName.examinationSubquestions[i].questionOption[j].key + '.' + formName.examinationSubquestions[i].questionOption[j].value
                      array.push(str)
                  }
                  array.join(',')
                  formName.examinationSubquestions[i].questionOption = array.join(';')
                }

                if(formName.examinationSubquestions[i].questionType == "MULTIPLE_CHOICE") {
                    var str =  formName.examinationSubquestions[i].questionAnswer
                    formName.examinationSubquestions[i].questionAnswer = str.join(',')
                }

                // 综合题下的填空题数据转换
                if(formName.examinationSubquestions[i].questionType == "GAP_FILLING") {
                  var arr = []
                  for(var k=0; k< formName.examinationSubquestions[i].questionAnswer.length; k++){
                    if ((formName.examinationSubquestions[i].questionAnswer[k].value === '')) {
                        this.$message({
                          message: '答案不能为空',
                          type: 'error'
                        })
                        return
                    } else {
                        arr.push(formName.examinationSubquestions[i].questionAnswer[k].value)
                    }
                  }
                  formName.examinationSubquestions[i].questionAnswer = arr
                  formName.examinationSubquestions[i].questionAnswer = formName.examinationSubquestions[i].questionAnswer.join(',')


                }

              }
            }
            
            if (formName.questionOption && formName.questionOption instanceof Array) {
              for (var i = 0; i < formName.questionOption.length; i++) {
                  if(formName.questionOption[i].value === '') {
                    this.$message({
                      message: '选项内容不能为空',
                      type: 'error'
                    })
                    return                  
                  }
              }              
            }

            // if(this.directoryCreate.exam_modality == '模拟考试') {
            //   var modality =  false
            // } else {
            //   var modality =  true
               
            // }
            var params ={
              questionFunctionType: "NORMAL",

              examinationQuestion:{
                questionImportWay: 'ARTIFACT_IMPORT',
                questionType: this.directoryCreate.questionsTestingType,
                questionDifficulty: this.directoryCreate.question_difficulty,
                simulateOrOfficial: true,
                questionAbilityNorm: this.directoryCreate.question_ability_norm,
                createUserID: this.$store.state.aId,
                createTime: ''
              }

            }
            var IDArr = [] 
            // for (var i = 0; i < this.involveItem.length; i++) {
            //   IDArr.push(this.involveItem[i].id)
            // }
            console.log(IDArr,333)
            
            params.examinationQuestion.createTime = Date.parse(new Date())
            if(this.directoryCreate.subjectsIdsStr.length>1){
              // 知识点
              params['kpId'] = Number(this.directoryCreate.subjectsIdsStr[this.directoryCreate.subjectsIdsStr.length - 1])
               params.minorKPIds = IDArr
            } else {
              // 学科
              params['khId'] = Number(this.directoryCreate.subjectsIdsStr[this.directoryCreate.subjectsIdsStr.length - 1])
              params.minorKHIds = IDArr
            }
            $.extend(true, params.examinationQuestion, formName)

            // 填空选择答案数据类型转换
            if (formName.questionAnswer instanceof Array) {

              if(params.examinationQuestion.questionType == "MULTIPLE_CHOICE") {
                  var str =  formName.questionAnswer
                  params.examinationQuestion.questionAnswer = str.join(',')
              }

              if(params.examinationQuestion.questionType == "GAP_FILLING"){
                console.log(params.examinationQuestion.questionBody,123456789)
                var arr = []
                for(var i=0; i< formName.questionAnswer.length; i++){
                  if ((formName.questionAnswer[i].value === '')) {
                      this.$message({
                        message: '答案不能为空',
                        type: 'error'
                      })
                      return
                  } else {
                      arr.push(formName.questionAnswer[i].value)
                  }
                }
                formName.questionAnswer = arr
                params.examinationQuestion.questionAnswer = formName.questionAnswer.join(',')

              }

            }
            // 选择题题干数据类型转换
            if(params.examinationQuestion.questionType == "MULTIPLE_CHOICE" || params.examinationQuestion.questionType == "SINGLE_CHOICE") {
              var array = []
              for(var i=0; i< params.examinationQuestion.questionOption.length; i++){
                  var str = ''
                  str = params.examinationQuestion.questionOption[i].key + '.' + params.examinationQuestion.questionOption[i].value
                  array.push(str)
              }
              params.examinationQuestion.questionOption = array
            }
            console.log(params,123123)

            this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/andRefersTo',params).then((res)=>{
                
                this.directoryCreate = {
                  subjectsIdsStr: '',
                  question_difficulty: '',
                  exam_modality: '',
                  questionsTestingType: '',
                  question_ability_norm: ''
                }
                this.directoryCreate.questionsTestingType = ''
                this.$bus.$emit('createdRes',res)
                //  手动  重置    待写
                this.resetQuestionData()
            })            
    },
    handleData(formName){
    },
    resetQuestionData(){
        this.discussForm = {
          questionAnalyze: '',
          questionBody: '',
          questionAnswer: '',
          keys: []
        }
        this.gapFillingForm = {
          questionAnalyze: '',
          questionBody: '',
          questionAnswer: []
        }
        //  判断题数据
        this.judgeForm = {
          questionAnalyze: '',
          questionBody: '',
          questionAnswer: '',
          questionOption:''
        }
        //  多选题数据
        this.multipleChoiceForm = {
          questionAnalyze: '',
          questionBody: '',
          questionOption: [{value: '', key: 'A'},{value: '', key: 'B'},{value: '', key: 'C'},{value: '', key: 'D'}],
          questionAnswer: []
        }
        //  单选题数据
        this.radioChoiceForm = {
          questionAnalyze: '',
          questionBody: '',
          questionOption: [{value: '', key: 'A'},{value: '', key: 'B'},{value: '', key: 'C'},{value: '', key: 'D'}],
          questionAnswer: ''
        }
        //  综合题数据
        this.reorganizeForm = {
          questionBody: '',
          examinationSubquestions: [
          ]

        }
        //  简答题数据
        this.shortAnswerForm = {
          questionBody: '',
          keys:[],
          questionAnswer: '',
          questionAnalyze: ''
        }   
    }
  }
}
</script>
<style scope>
.el-tabs--border-card {
  background-color: transparent;
}
.el-tabs--border-card>.el-tabs__content {
  height: 500px;
  overflow-y: scroll;
}
</style>