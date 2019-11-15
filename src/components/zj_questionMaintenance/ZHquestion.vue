<template>
  <div>
      <el-row>
        <el-col :span="11" :offset="1">
          <el-form :model="reorganizeForm" ref="reorganizeForm">
          		<el-row>
          			<el-col :span="23" :offset="1">
          				<el-form-item label="题干：" prop="questionBody">
                      <el-input type="textarea" :autosize="autosize" v-model="reorganizeForm.questionBody"></el-input>
          				</el-form-item>
          			</el-col>
          	 	</el-row>

              <el-row>
                <el-col :span="23" :offset="1">
                    <el-form-item  prop="questionsTestingType">
                      选择题型：<br>
                        <el-radio-group v-model="questionsTestingType" v-for="(item, index) in testingTypes"  :key="index" v-if="item.value!=='COMPREHENSIVE'" @change="radiochange">
                          <el-radio :label="item.value">{{item.dictName}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
              </el-row>
              <xzquestion :multipleChoiceForm.sync="multipleChoiceForm" :isZH='true' :fileListArr.sync="fileListArr" :propressNum="propressNum" key="xzquestion" :fileList.sync="fileList" v-if="this.questionsTestingType === 'MULTIPLE_CHOICE'">

              </xzquestion>

              <tkquestion :gapFillingForm.sync="gapFillingForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="tkquestion" :fileList.sync="fileList" v-if="this.questionsTestingType === 'GAP_FILLING'">

              </tkquestion>

              <pdquestion :judgeForm.sync="judgeForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="pdquestion" :fileList.sync="fileList" v-if="this.questionsTestingType === 'CHECKING'">

              </pdquestion>

              <jdquestion :shortAnswerForm.sync="shortAnswerForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="jdquestion" :fileList.sync="fileList" v-if="this.questionsTestingType === 'SHORT_ANSWER'">

              </jdquestion>

              <dxquestion :radioChoiceForm.sync="radioChoiceForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="dxquestion" :fileList.sync="fileList" v-if="this.questionsTestingType === 'SINGLE_CHOICE'">

              </dxquestion>

              <lsquestion :discussForm.sync="discussForm" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="lsquestion" :fileList.sync="fileList" v-if="this.questionsTestingType === 'EXPOUND'">

              </lsquestion>

              <el-row v-if="this.questionsTestingType !== ''">
                <el-col :span="18" :offset="1">
                 <el-form-item label="添加子试题：" prop="questionAnswer">
                    <el-button type="primary" style="color:#fff" @click="addQuestion" plain size="mini">添加</el-button>
                 </el-form-item>
                </el-col>
              </el-row>
          </el-form>
        </el-col>

        <el-col :span="11" :offset="1" v-if="this.reorganizeForm.examinationSubquestions.length > 0">
          <el-table
            :data="data"
            border
            >
            <el-table-column
              prop="questionBody"
              :show-overflow-tooltip="true"
              label="题目内容"
              >
            </el-table-column>
            <el-table-column
              prop="questionTypes"
              label="试题类型"
              >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              >
              <template slot-scope="scope">

                <el-button
                  @click.native.prevent="editRow(scope.$index, reorganizeForm.examinationSubquestions)"
                  type="text"
                  size="small">
                  详情
                </el-button>

                <el-button
                  @click.native.prevent="editRow(scope.$index, reorganizeForm.examinationSubquestions)"
                  type="text"
                  size="small">
                  编辑
                </el-button>

                <el-button
                  @click.native.prevent="deleteRow(scope.$index, reorganizeForm.examinationSubquestions)"
                  type="text"
                  size="small">
                  删除
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <el-dialog modal-append-to-body append-to-body lock-scroll title="试题详情" :visible.sync="ZHXQdialogVisible" custom-class="qts" center close-on-press-escape lock-scroll :before-close="ZHXQhandleClose">

            <el-row v-if="changeQue">
              <el-col :span="23" :offset="1">
                <div style="overflow: hidden">
                  <el-form label-position="right" inline labelWidth="80px">
                     <el-col :span="8">
                       <el-form-item label="题型类别: ">
                         <b>{{XQRows.questionTypes}}</b>
                       </el-form-item>
                     </el-col>

                     <el-col>
                       <el-form-item label="题干: ">
                         <b>{{XQRows.questionBody}}</b>
                          <viewer :images="XQRows.eqBodyImageNameList1" class="tImg" v-if="XQRows.eqBodyImageNameList1"> 
                            <img
                              v-for="(src,index) in XQRows.eqBodyImageNameList1"
                              :src="getImgUrl(src)"
                              @click="clickImg(src,index,0)"
                              :key="index"
                            >
                          </viewer>
                       </el-form-item>
                     </el-col>

                     <el-col v-if="XQRows.questionType == 'MULTIPLE_CHOICE'|| XQRows.questionType == 'SINGLE_CHOICE'">
                       <el-form-item label="选项内容: ">
                         <p v-for="(item,index) in XQRows.questionOption"><span>{{item.key}}</span> &nbsp;:&nbsp;<b>{{item.value}}</b>
                            <viewer class="aImg" v-if="item.img">
                              <img
                                :src="getImgUrl(item.img)" 
                                :key="index"
                                @click="clickImg(item.img,index,1)"
                              >
                            </viewer>
                         </p>
                       </el-form-item>
                     </el-col>

                     <el-col v-if="XQRows.questionType == 'GAP_FILLING'">
                       <el-form-item label="参考答案: ">
                         <b v-for="item in XQRows.questionAnswer">&nbsp;&nbsp;<b>{{item.value}}</b></b>
                       </el-form-item>
                     </el-col>

                     <el-col v-else-if="XQRows.questionType == 'MULTIPLE_CHOICE'">
                       <el-form-item label="参考答案: ">
                         <b v-for="item in XQRows.questionAnswer"><b>&nbsp;&nbsp;{{item}}</b></b>
                       </el-form-item>
                     </el-col>

                     <el-col>
                       <el-form-item label="参考答案: " v-if="XQRows.questionType !== 'MULTIPLE_CHOICE' && XQRows.questionType !== 'GAP_FILLING'">
                         <b>{{XQRows.questionAnswer}}</b>
                       </el-form-item>
                     </el-col>

                     <el-col v-if="XQRows.keys">
                       <el-form-item label="关键字: ">
                         <b v-for="item in XQRows.keys"><b>&nbsp;&nbsp;{{item}}</b></b>
                       </el-form-item>
                     </el-col>

                     <el-col>
                       <el-form-item label="解析: " v-if="XQRows.questionAnalyze && (XQRows.questionAnalyze !== '')">
                         <b>{{XQRows.questionAnalyze}}</b>
                       </el-form-item>
                     </el-col>
                  </el-form>
                </div>
              </el-col>
            </el-row>

            <!-- 修改页面组件 -->
            <el-row v-if="!changeQue">
              <el-col :span="22" :offset="2">
                <!--以下组件判断-->
                <div>


                <xzquestion :multipleChoiceForm.sync="XQRows" :fileListArr.sync="fileListArr" :propressNum="propressNum" :fileList.sync="fileList" v-if="XQRows.questionType === 'MULTIPLE_CHOICE'">
                    <el-row slot="editQuestionData">
                      <el-col :span="8" :offset="15">
                        <el-button type="primary"  @click="handleSubmitData(XQRows)" >确认</el-button>
                        <el-button @click="changeQue=true">返回</el-button>
                      </el-col>
                    </el-row>
                </xzquestion>

                <tkquestion :gapFillingForm.sync="XQRows" :fileListArr.sync="fileListArr" :propressNum="propressNum" :fileList.sync="fileList" v-if="XQRows.questionType === 'GAP_FILLING'">
                    <el-row slot="editQuestionData">
                      <el-col :span="8" :offset="15">
                        <el-button type="primary"  @click="handleSubmitData(XQRows)" >确认</el-button>
                        <el-button @click="changeQue=true">返回</el-button>
                      </el-col>
                    </el-row>
                </tkquestion>

                <pdquestion :judgeForm.sync="XQRows" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="pdquestion" :fileList.sync="fileList" v-if="XQRows.questionType === 'CHECKING'">
                    <el-row slot="editQuestionData">
                      <el-col :span="8" :offset="6">
                        <el-button type="primary"  @click="handleSubmitData(XQRows)" >确认</el-button>
                        <el-button @click="changeQue=true">返回</el-button>
                      </el-col>
                    </el-row>
                </pdquestion>

                <jdquestion :shortAnswerForm.sync="XQRows" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="jdquestion" :fileList.sync="fileList" v-if="XQRows.questionType === 'SHORT_ANSWER'">
                    <el-row slot="editQuestionData">
                      <el-col :span="8" :offset="6">
                        <el-button type="primary"  @click="handleSubmitData(XQRows)" >确认</el-button>
                        <el-button @click="changeQue=true">返回</el-button>
                      </el-col>
                    </el-row>
                </jdquestion>

                <dxquestion :radioChoiceForm.sync="XQRows" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="dxquestion" :fileList.sync="fileList" v-if="XQRows.questionType === 'SINGLE_CHOICE'">
                    <el-row slot="editQuestionData">
                      <el-col :span="8" :offset="6">
                        <el-button type="primary"  @click="handleSubmitData(XQRows)" >确认</el-button>
                        <el-button @click="changeQue=true">返回</el-button>
                      </el-col>
                    </el-row>
                </dxquestion>

                <lsquestion :discussForm.sync="XQRows" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="lsquestion" :fileList.sync="fileList" v-if="XQRows.questionType === 'EXPOUND'">
                    <el-row slot="editQuestionData">
                      <el-col :span="8" :offset="6">
                        <el-button type="primary"  @click="handleSubmitData(XQRows)" >确认</el-button>
                        <el-button @click="changeQue=true">返回</el-button>
                      </el-col>
                    </el-row>
                </lsquestion>

                </div>
              </el-col>
            </el-row>
        <!-- 详情底部 -->
        <span slot="footer" class="dialog-footer" v-if="changeQue">
                <el-button type="primary"  @click.prevent="changeQuestion" >修改详情</el-button>
                <el-button type="warning" @click="deleteQuestion">删除此题</el-button>
                <el-button type="info" style="width: 100px" @click="ZHXQdialogVisible = false">取消</el-button>
        </span>
          </el-dialog>



        <slot name="handleQuestionData"></slot>
        <slot name="editQuestionData"></slot>


        </el-col>
  </el-row>

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
    props: [ 'reorganizeForm', 'addOrDel', 'fileListArr', 'propressNum', 'fileList' ],
    created () {
    },
    mounted () {
      this.$axiosGet(this.$axiosURL.b_dictionarys,{}).then((res)=>{
              this.$store.state.dictionarys = res;
              this.testingTypes = this.$store.state.dictionarys.question_type

      })
      // if(this.addOrDel){

      // }
      // console.log(this.addOrDel,1587878)
    },
    watch: {

    },
    computed: {
      // 试题类型格式化
      data: function(){
        let　data = this.reorganizeForm.examinationSubquestions
          for (var i = 0; i < data.length; i++) {
              var obj ={}
              obj = this.$store.state.dictionarys.question_type.find((item)=>{
                return item.value == data[i].questionType
              })
              data[i].questionTypes = obj.dictName 
            }
        return data
      }
    },
    data () {
      return {
          autosize: {minRows: 2},
          testingTypes: [],
          questionsTestingType: '',
          //  论述题数据
          discussForm: {
            questionBody: '',
            questionAnswer: '',
            questionAnalyze: '',
            keys:[]
          },
          changeQue: true,
          // 综合题详情 Dialog
          ZHXQdialogVisible: false,
          // 综合题详情单条数据
          XQRows: [],
          //  简答题数据
          shortAnswerForm: {
            questionBody: '',
            keys: [],
            questionAnswer: '',
            questionAnalyze: ''
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
          arrrr:[]
          // reorganizeForm.keys: ['标签一', '标签二', '标签三'],
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
    methods: {
      getImgUrl:function(url){
        return this.$imgThumbUrl + url
      },
      clickImg(src,index,i){
        if(i==0){
          $('.tImg img').eq(index).attr('src',this.$imgUrl + src)
        } else {
          $('.aImg img').eq(index).attr('src',this.$imgUrl + src)
        }
      },
      addQuestion(){
        if(this.questionsTestingType == ''){
          this.$message({
            message: '请选择题型',
            type: 'error'
          })
          return
        }

        if(this.questionsTestingType !== '' && this.questionsTestingType == 'MULTIPLE_CHOICE'){
        
          if(this.multipleChoiceForm.questionBody == '') {
              this.$message({
                message: '题干不能为空',
                type: 'error'
              })
              return
          }
          if(this.multipleChoiceForm.questionAnswer.length == 0) {
              this.$message({
                message: '答案不能为空',
                type: 'error'
              })
              return
          }

            for (var i = 0; i < this.multipleChoiceForm.questionOption.length; i++) {
                if(this.multipleChoiceForm.questionOption[i].value === '') {
                  this.$message({
                    message: '选项内容不能为空',
                    type: 'error'
                  })
                  return                  
                }
            }

            this.multipleChoiceForm['questionType'] = this.questionsTestingType

            if (this.addOrDel !== undefined) {
              var array = []
              for(var j=0; j< this.multipleChoiceForm.questionOption.length; j++){
                  var str = ''
                  str = this.multipleChoiceForm.questionOption[j].key + '.' + this.multipleChoiceForm.questionOption[j].value
                  array.push(str)
              }
              array.join(',')
              this.multipleChoiceForm.questionOption = array.join(';')

              var str =  this.multipleChoiceForm.questionAnswer
              this.multipleChoiceForm.questionAnswer = str.join(',')
              this.multipleChoiceForm['createTime'] = Date.parse(new Date())
              this.multipleChoiceForm['createUserID'] = this.$store.state.aId
              var params ={
                parentQuestionId: this.reorganizeForm.id,
                questionFunctionType: 'SUB',
                examinationQuestion: this.multipleChoiceForm
              }
              this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/subQuestion',params).then((res)=>{
                console.log(res,115468);

                var questionOptions = res.questionOption.split(";")
                res['questionOptions'] = questionOptions
                var newquestionOption =[]
                for (var i = 0; i < res.questionOptions.length; i++) {
                  var obj = {}
                  var xx = res.questionOptions[i].substr(0,1)
                  var nr = res.questionOptions[i].substr(2,res.questionOptions[i].length)
                  obj['key'] = xx
                  obj['value'] = nr
                  newquestionOption.push(obj)
                }
                res.questionOption = newquestionOption
                res.questionAnswer = res.questionAnswer.split(",")

                this.reorganizeForm.examinationSubquestions.push(res) 
              })
              // 调添加接口
            } else {
              this.multipleChoiceForm['createTime'] = Date.parse(new Date())
              this.multipleChoiceForm['createUserID'] = this.$store.state.aId
              this.reorganizeForm.examinationSubquestions.push(this.multipleChoiceForm)  
            }

            this.multipleChoiceForm = {
              questionAnalyze: '',
              questionBody: '',
              questionOption: [{value: '', key: 'A'},{value: '', key: 'B'},{value: '', key: 'C'},{value: '', key: 'D'}],
              questionAnswer: []
          }
        }


        if(this.questionsTestingType !== '' && this.questionsTestingType == 'GAP_FILLING'){
        
          if(this.gapFillingForm.questionBody == '') {
              this.$message({
                message: '题干不能为空',
                type: 'error'
              })
              return
          }
          if(this.gapFillingForm.questionAnswer.length == 0) {
              this.$message({
                message: '请添加答案',
                type: 'error'
              })
              return
          }
          for(var i=0; i< this.gapFillingForm.questionAnswer.length; i++){
            if (this.gapFillingForm.questionAnswer[i].value === '') {
                this.$message({
                  message: '答案不能为空',
                  type: 'error'
                })
                return
            }   
          }       
            this.gapFillingForm['questionType'] = this.questionsTestingType
            if (this.addOrDel !== undefined) {
              // 调添加接口
              // this.gapFillingForm.questionAnswer
              var arr = []
              for(var k=0; k< this.gapFillingForm.questionAnswer.length; k++){
                if ((this.gapFillingForm.questionAnswer[k].value === '')) {
                    this.$message({
                      message: '答案不能为空',
                      type: 'error'
                    })
                    return
                } else {
                    arr.push(this.gapFillingForm.questionAnswer[k].value)
                }
              }
              this.gapFillingForm.questionAnswer = arr
              this.gapFillingForm.questionAnswer = this.gapFillingForm.questionAnswer.join(',')
              this.gapFillingForm['createTime'] = Date.parse(new Date())
              this.gapFillingForm['createUserID'] = this.$store.state.aId
              var params ={
                parentQuestionId: this.reorganizeForm.id,
                questionFunctionType: "SUB",
                examinationQuestion: this.gapFillingForm
              }

              this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/subQuestion',params).then((res)=>{
                var tkquestionAnswer = res.questionAnswer.split(",")
                var tkquestionAnswerArr = []
                for (var i = 0; i < tkquestionAnswer.length; i++) {
                  var obj1 = {}
                  obj1['value'] = tkquestionAnswer[i]
                  tkquestionAnswerArr.push(obj1)
                }
                res.questionAnswer = tkquestionAnswerArr
                this.reorganizeForm.examinationSubquestions.push(res) 
              })
            } else {
              this.gapFillingForm['createTime'] = Date.parse(new Date())
              this.gapFillingForm['createUserID'] = this.$store.state.aId
              this.reorganizeForm.examinationSubquestions.push(this.gapFillingForm)  
            }
            this.gapFillingForm = {
              questionAnalyze: '',
              questionBody: '',
              questionAnswer: []
            }
        }


        if(this.questionsTestingType !== '' && this.questionsTestingType == 'CHECKING'){
        
          if(this.judgeForm.questionBody == '') {
              this.$message({
                message: '题干不能为空',
                type: 'error'
              })
              return
          }
          if(this.judgeForm.questionAnswer == '') {
              this.$message({
                message: '答案不能为空',
                type: 'error'
              })
              return
          }       
            this.judgeForm['questionType'] = this.questionsTestingType
            if (this.addOrDel !== undefined) {
              // 调添加接口
              this.judgeForm['createUserID'] = this.$store.state.aId

              this.judgeForm['createTime'] = Date.parse(new Date())
              var params ={
                parentQuestionId: this.reorganizeForm.id,
                questionFunctionType: "SUB",
                examinationQuestion: this.judgeForm
              }

              this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/subQuestion',params).then((res)=>{
                this.reorganizeForm.examinationSubquestions.push(res) 
              })
            } else {
              this.judgeForm['createTime'] = Date.parse(new Date())
              this.judgeForm['createUserID'] = this.$store.state.aId
              this.reorganizeForm.examinationSubquestions.push(this.judgeForm)  
            }
            this.judgeForm = {
              questionAnalyze: '',
              questionBody: '',
              questionAnswer: []
            }
        }


        if(this.questionsTestingType !== '' && this.questionsTestingType == 'SHORT_ANSWER'){
        
          if(this.shortAnswerForm.questionBody == '') {
              this.$message({
                message: '题干不能为空',
                type: 'error'
              })
              return
          }
          if(this.shortAnswerForm.questionAnswer == '') {
              this.$message({
                message: '答案不能为空',
                type: 'error'
              })
              return
          }
            this.shortAnswerForm['questionType'] = this.questionsTestingType
            if (this.addOrDel !== undefined) {
                // 调添加接口
              this.shortAnswerForm['createTime'] = Date.parse(new Date())
              this.shortAnswerForm['createUserID'] = this.$store.state.aId

                var params ={
                  parentQuestionId: this.reorganizeForm.id,
                  questionFunctionType: "SUB",
                  examinationQuestion: this.shortAnswerForm
                }

                this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/subQuestion',params).then((res)=>{
                this.reorganizeForm.examinationSubquestions.push(res) 

              })
            } else {
              this.shortAnswerForm['createTime'] = Date.parse(new Date())
              this.shortAnswerForm['createUserID'] = this.$store.state.aId

              this.reorganizeForm.examinationSubquestions.push(this.shortAnswerForm)  
            }
            this.shortAnswerForm = {
              questionBody: '',
              questionAnswer: '',
              questionAnalyze: ''
            }
        }
        if(this.questionsTestingType !== '' && this.questionsTestingType == 'SINGLE_CHOICE'){
        
          if(this.radioChoiceForm.questionBody == '') {
              this.$message({
                message: '题干不能为空',
                type: 'error'
              })
              return
          }
          if(this.radioChoiceForm.questionAnswer == '') {
              this.$message({
                message: '答案不能为空',
                type: 'error'
              })
              return
          }
          for (var i = 0; i < this.radioChoiceForm.questionOption.length; i++) {
              if(this.radioChoiceForm.questionOption[i].value === '') {
                this.$message({
                  message: '选项内容不能为空',
                  type: 'error'
                })
                return                  
              }
          }   
            this.radioChoiceForm['questionType'] = this.questionsTestingType
            if (this.addOrDel !== undefined) {
              var array = []
              for(var j=0; j< this.radioChoiceForm.questionOption.length; j++){
                  var str = ''
                  str = this.radioChoiceForm.questionOption[j].key + '.' + this.radioChoiceForm.questionOption[j].value
                  array.push(str)
              }
              this.radioChoiceForm.questionOption = array.join(';')
              this.radioChoiceForm['createUserID'] = this.$store.state.aId
             
              this.radioChoiceForm['createTime'] = Date.parse(new Date())
              var params ={
                parentQuestionId: this.reorganizeForm.id,
                questionFunctionType: 'SUB',
                examinationQuestion: this.radioChoiceForm
              }

              this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/subQuestion',params).then((res)=>{
                var questionOptions1 = res.questionOption.split(";")
                res['questionOptions1'] = questionOptions1
                var newquestionOption =[]
                for (var i = 0; i < res.questionOptions1.length; i++) {
                  var obj = {}
                  var xx = res.questionOptions1[i].substr(0,1)
                  var nr = res.questionOptions1[i].substr(2,res.questionOptions1[i].length)
                  obj['key'] = xx
                  obj['value'] = nr
                  newquestionOption.push(obj)
                }
                res.questionOption = newquestionOption
                this.reorganizeForm.examinationSubquestions.push(res)
              })
            } else {
              this.radioChoiceForm['createUserID'] = this.$store.state.aId

              this.radioChoiceForm['createTime'] = Date.parse(new Date())
              this.reorganizeForm.examinationSubquestions.push(this.radioChoiceForm)  
            }
            this.radioChoiceForm = {
              questionAnalyze: '',
              questionBody: '',
              questionOption: [{value: '', key: 'A'},{value: '', key: 'B'},{value: '', key: 'C'},{value: '', key: 'D'}],
              questionAnswer: ''
            }
        }
        if(this.questionsTestingType !== '' && this.questionsTestingType == 'EXPOUND'){
        
          if(this.discussForm.questionBody == '') {
              this.$message({
                message: '题干不能为空',
                type: 'error'
              })
              return
          }
          if(this.discussForm.questionAnswer == '') {
              this.$message({
                message: '答案不能为空',
                type: 'error'
              })
              return
          }
            this.discussForm['questionType'] = this.questionsTestingType
            if (this.addOrDel !== undefined) {
              this.discussForm['createUserID'] = this.$store.state.aId

              this.discussForm['createTime'] = Date.parse(new Date())
              var params ={
                parentQuestionId: this.reorganizeForm.id,
                questionFunctionType: "SUB",
                examinationQuestion: this.discussForm
              }
              this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/subQuestion',params).then((res)=>{
                this.reorganizeForm.examinationSubquestions.push(res) 
              })
              // 调添加接口
              this.reorganizeForm.examinationSubquestions.push(this.discussForm) 
            } else {
              this.discussForm['createUserID'] = this.$store.state.aId

              this.discussForm['createTime'] = Date.parse(new Date())
              this.reorganizeForm.examinationSubquestions.push(this.discussForm)  
            }
            this.discussForm = {
              questionBody: '',
              keys: [],
              questionAnswer: '',
              questionAnalyze: ''
            }
        }
        this.questionsTestingType = ''
        // console.log(this.reorganizeForm)
      },
      radiochange(){
        this.resetQuestionData()
      },
      resetQuestionData(){
        this.discussForm = {
          questionAnalyze: '',
          questionBody: '',
          questionAnswer: '',
          keys:[]
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
        //  简答题数据
        this.shortAnswerForm = {
          questionBody: '',
          keys:[],
          questionAnswer: '',
          questionAnalyze: ''
        }   
      },
      deleteRow(index, rows) {
        if (this.addOrDel !== undefined) {
          // 调删除的接口
            this.$axiosRes('delete',this.$axiosURL.k_examinationQuestion + rows[index].id ).then((res)=>{
              // this.questionTable()
              rows.splice(index, 1);
            })
          console.log(rows[index].id)
        } else {
          rows.splice(index, 1);
        }
      },
      editRow(index, rows) {
        if (this.addOrDel !=='' || this.addOrDel !== undefined) {
            // 调编辑接口
            this.ZHXQdialogVisible = true
            this.XQRows = rows[index]
        } else {
            this.ZHXQdialogVisible = true
            this.XQRows = rows[index]
        }
      },
      // 修改详情
      changeQuestion () {
        this.changeQue = false
      },
      //  详情界面删除此题
      deleteQuestion () {
        // this.delete(this.details.questionsId)
      },
      // 修改详情提交
      handleSubmitData(rows){
        if (rows.questionBody === '') {
          this.$message({
            message: '题干不能为空',
            type: 'error'
          })
          return
        }
        if (rows.questionAnswer && (!rows.questionAnswer.length)) {
          this.$message({
            message: '答案不能为空',
            type: 'error'
          })
          return
        }
        if (rows.questionAnswer === '') {
          this.$message({
            message: '答案不能为空',
            type: 'error'
          })
          return
        }
        if (rows.questionOption) {
          for (var i = 0; i < rows.questionOption.length; i++) {
              if(rows.questionOption[i].value === '') {
                this.$message({
                  message: '选项内容不能为空',
                  type: 'error'
                })
                return                  
              }
          }              
        }
        // this.XQRows
        rows.updateTime = Date.parse(new Date())
        rows.updateUserID = this.$store.state.aId
        this.XQRows = JSON.parse(JSON.stringify(rows))
        console.log(this.XQRows,1578798798987)
        this.ZHXQdialogVisible = false
        this.changeQue = true
      },
      ZHXQhandleClose(done){
        this.$confirm('确认关闭？').then(_ => {
          this.changeQue = true
          done()
        })
          .catch(_ => {
            this.$message({
              message: '已取消',
              type: 'warning'
            })
          })
      }
    }
}
</script>
