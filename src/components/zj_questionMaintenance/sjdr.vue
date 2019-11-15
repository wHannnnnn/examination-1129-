<template>
  <div class="tableChange scroll add">
        <el-row>
          <el-col :span="24">

            <div class="xzmb">

              <h2>1.下载模板</h2>

              <div class="neirong">

                <el-row>
                  <p>下载说明</p>
                </el-row>

                <el-row>
                 温馨提示：<br>
			尊敬的用户:<br>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您好!<br>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请您根据您的上传文件格式选择对应的上传文档模版，先进行模版下载，并详细阅读模版说明，之后再按照模版格式要求对自己相应的文档进行排版，最后再将自己要上传的文档进行上传。
                </el-row>

                <div class="xiazai">
                  <el-row>
                    <el-col :span="6">
                        <el-button size="medium" type="success" @click="wordxaizai" icon="el-icon-download">下载Word格式模板</el-button>
                    </el-col>
                  </el-row>
                </div>



              </div>

            </div>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="xzmb">

              <h2>2.试卷导入</h2>

              <div class="neirong">

                <el-row>



                </el-row>

                <div class="xiazai">
                  <el-row>
                    <el-col :span="7">
                      <el-upload
                        class="upload-demo"
                        name="eqFile"
                        :action="uploadUrl"
                        :on-success="uploadSuccess"
                        :show-file-list="false"
                        :beforeUpload="beforeAvatarUpload1"
                        :on-progress="uploadProgress"
                        accept=".doc,.docx"
                        >
                        <el-button size="medium" type="success">导入Word格式模板</el-button>
                      </el-upload>
                    </el-col>
                  </el-row>
                </div>

              </div>

            </div>
          </el-col>

          <el-col :span="24" v-if="this.uploadTable.length>0">
            <el-table
              :data="tableDataEnd"
              style="width: 100%"
              border
              >
              <el-table-column
                type="selection"
              >
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="questionBody"
                label="题目内容"
                >
              </el-table-column>
              <el-table-column
                prop="allknowledgePoints"
                label="知识点"
                >
              </el-table-column>
              <el-table-column
                prop="questionTypes"
                label="试题类型"
                >
              </el-table-column>
              <el-table-column
                prop="questionDifficultyName"
                label="难易程度"
                >
              </el-table-column>
              <el-table-column
                prop="neoUserName"
                label="创建人"
                >
              </el-table-column>
              <el-table-column
                prop="createTimes"
                label="创建时间"
                >
              </el-table-column>
              <el-table-column
                label="操作"
                width="320"
                >
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="default"
                    icon="edit"
                    @click="STEdit(scope.row.id, scope.$index, tableDataEnd)">试题详情
                  </el-button>   
                  <el-button
                   slot="reference"
                    size="small"
                    type="default"
                    @click="uploadFile(scope.row.id)"
                    >上传附件
                  </el-button>                
                  <el-button
                    @click.native.prevent="deleteRow(scope.row.id, scope.$index, tableDataEnd)"
                    type="danger"
                    size="small">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
                v-if="this.uploadTable.length>0"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 15]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems">
            </el-pagination>

            <el-dialog
               title="提示"
               :visible.sync="uploadTC"
               width="30%"
               >

               <div class="tjwj">
                 <el-upload
                   class="upload-demo"
                   ref="fileUpload"
                   :action="uploadUrl1"
                   :on-preview="handlePreview"
                   :on-success="handleAvatarSuccess"
                   :on-remove="handleRemove"
                   :before-remove="beforeRemove"
                   :on-change="headChange"
                   :beforeUpload="beforeUpload"
                   accept=".jpg,.jpeg,.png,.mp4,.mp3,.bmp,.gif,.svg,.wma,.flv"
                   multiple
                   :file-list="fileList">
                   <el-button size="small" type="primary">点击上传</el-button>
                 </el-upload>
               </div>

               <span slot="footer" class="dialog-footer">
                 <el-button @click="uploadQX">取 消</el-button>
                 <el-button type="primary" @click="uploadQX">确 定</el-button>
               </span>
             </el-dialog>
          <!-- 修改详情 -->
    <el-dialog modal-append-to-body append-to-body lock-scroll width="65%"  title="试题详情" :visible.sync="dialogVisible" custom-class="qts" center close-on-press-escape
                 lock-scroll :before-close="XQhandleClose">
        <el-row v-if="changeQue == 1">
          <el-col :span="23" :offset="1">
            <div style="overflow: hidden">
              <el-form label-position="right" inline labelWidth="80px">

                <el-col :span="8">
                  <el-form-item label="知识点: ">
                    <el-cascader
                      :options="ZSDdata"
                      change-on-select
                      :props="ZSDprops1"
                      size="small"
                      v-model="subjectsPathse"
                      :show-all-levels="false"
                      filterable
                      clearable
                      :disabled="changeControlPath"
                      expand-trigger="click"
                    >
                    </el-cascader>
                    <a @click="modify('Path',details.id)" class="modifyClass">{{modifyTitlePath}}</a>
                    <i class="el-icon-edit" @click="graphEdit"></i>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用途: ">
                  <el-select v-model="details.simulateOrOfficial" filterable placeholder="选择试题用途" size="small" :disabled="changeControlType">
                    <el-option v-for="item in initData.simulate_or_official" :label="item.dictName" :value="item.value"></el-option>
                  </el-select>
                    <a @click="modify('Type',details.id)" class="modifyClass">{{modifyTitleType}}</a>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="难易程度: ">
                    <el-select v-model="details.questionDifficulty" size="small" filterable placeholder="请选择" :disabled="changeControlDiff">
                      <el-option
                        v-for="item in initData.question_difficulty"
                        :key="item.value"
                        :label="item.dictName" 
                        :value="item.value">
                      </el-option>
                    </el-select>

                    <a @click="modify('Diff',details.id)" class="modifyClass">{{modifyTitleDiff}}</a>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="题型类别: ">
                    <b>{{details.questionTypes}}</b>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="创建者: ">
                    <b>{{details.neoUserName}}</b>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="使用次数: ">
                    <b>{{details.num}}</b>
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item label="题干: ">
                    <b>{{details.questionBody}}</b>
                    <viewer :images="details.eqBodyImageNameList1" class="tImg"> 
                      <img
                        v-for="(src,index) in details.eqBodyImageNameList1"
                        :src="getImgUrl(src)"
                        @click="clickImg(src,index,0)"
                        :key="index"
                      >
                    </viewer>
                  </el-form-item>
                </el-col>

                <el-col v-if="details.questionType == 'MULTIPLE_CHOICE' || details.questionType == 'SINGLE_CHOICE'">
                  <el-form-item label="选项内容: ">
                     <p v-for="(item,index) in details.questionOption"><span>{{item.key}}</span> &nbsp;:&nbsp;<b>{{item.value}}</b>
                     <viewer :images="details.eqBodyImageNameList1" class="aImg">
                      <img
                          :src="getImgUrl(item.img)" 
                          :key="index"
                          @click="clickImg(item.img,index,1)"
                        >
                      </viewer>
                    </p>
                  </el-form-item>
                </el-col>

                <el-col v-if="details.questionType == 'GAP_FILLING'">
                  <el-form-item label="参考答案: ">
                    <b v-for="item in details.questionAnswer">&nbsp;&nbsp;<b>{{item.value}}</b></b>
                  </el-form-item>
                </el-col>

                <el-col v-else-if="details.questionType == 'MULTIPLE_CHOICE'">
                  <el-form-item label="参考答案: ">
                    <b v-for="item in details.questionAnswer"><b>&nbsp;&nbsp;{{item}}</b></b>
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item label="参考答案: " v-if="details.questionType !== 'MULTIPLE_CHOICE' && details.questionType !== 'GAP_FILLING' && details.questionType !== 'COMPREHENSIVE'">
                    <b>{{details.questionAnswer}}</b>
                  </el-form-item>
                </el-col>

                <el-col v-if="details.keys">
                  <el-form-item label="关键字: ">
                    <b v-for="item in details.keys"><b>&nbsp;&nbsp;{{item}}</b></b>
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item label="解析: " v-if="details.questionAnalyze && (details.questionAnalyze !== '')">
                    <b>{{details.questionAnalyze}}</b>
                  </el-form-item>
                </el-col>

              </el-form>
            </div>                                      
          </el-col>
        </el-row>

        <el-row v-show="changeQue == 2">
          <el-col :span="22" :offset="1">
            <!--以下组件判断-->
            <div>
              <el-row :gutter="20">
                <el-col :span="20" v-for = "(index,item) in webkitDep" >
                    <el-card>
                      <div class="chart-box J_chartFocusBox"></div>
                    </el-card>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

          <div id="menu" >
            <el-button-group v-show="clickMenu">
              <el-button type="primary" icon="el-icon-circle-plus" @click="graphAdd"></el-button>
              <el-button type="primary" icon="el-icon-delete" @click="graphdel"></el-button>
            </el-button-group>
      
            <el-button-group v-show="clickMenu1">
              <!-- <el-button type="primary" icon="el-icon-edit" @click="graphEdit"></el-button> -->
              <el-button type="primary" icon="el-icon-delete" @click="graphdel"></el-button>
            </el-button-group>
          </div>

        <!-- 修改页面组件 -->
        <el-row v-if="changeQue == 3">
          <el-col :span="22" :offset="1">
            <!--以下组件判断-->
            <div>


            <xzquestion :multipleChoiceForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" :fileList.sync="fileList" v-if="details.questionType === 'MULTIPLE_CHOICE'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="15">
                    <el-button type="primary"  @click="handleSubmitData1(details)" >提交</el-button>
                    <el-button @click="changeQue=1">返回</el-button>
                  </el-col>
                </el-row>
            </xzquestion>

            <tkquestion :gapFillingForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" :fileList.sync="fileList" v-if="details.questionType === 'GAP_FILLING'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="15">
                    <el-button type="primary"  @click="handleSubmitData1(details)" >提交</el-button>
                    <el-button @click="changeQue=1">返回</el-button>
                  </el-col>
                </el-row>
            </tkquestion>

            <pdquestion :judgeForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="pdquestion" :fileList.sync="fileList" v-if="details.questionType === 'CHECKING'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData1(details)" >提交</el-button>
                    <el-button @click="changeQue=1">返回</el-button>
                  </el-col>
                </el-row>
            </pdquestion>

            <jdquestion :shortAnswerForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="jdquestion" :fileList.sync="fileList" v-if="details.questionType === 'SHORT_ANSWER'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData1(details)" >提交</el-button>
                    <el-button @click="changeQue=1">返回</el-button>
                  </el-col>
                </el-row>
            </jdquestion>

            <dxquestion :radioChoiceForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="dxquestion" :fileList.sync="fileList" v-if="details.questionType === 'SINGLE_CHOICE'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData1(details)" >提交</el-button>
                    <el-button @click="changeQue=1">返回</el-button>
                  </el-col>
                </el-row>
            </dxquestion>

            <lsquestion :discussForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="lsquestion" :fileList.sync="fileList" v-if="details.questionType === 'EXPOUND'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData1(details)" >提交</el-button>
                    <el-button @click="changeQue=1">返回</el-button>
                  </el-col>
                </el-row>
            </lsquestion>

            <zhquestion :reorganizeForm.sync="details" :addOrDel="anum" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="zhquestion" :fileList.sync="fileList" v-if="details.questionType === 'COMPREHENSIVE'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData1(details)" >提交</el-button>
                    <el-button @click="changeQue=1">返回</el-button>
                  </el-col>
                </el-row>
            </zhquestion>            

            </div>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer" v-if="changeQue == 1">
            <el-button type="primary"  @click.prevent="changeQuestion" >修改详情</el-button>
            <el-button type="warning" @click="deleteQuestion">删除此题</el-button>
            <el-button type="info" style="width: 100px" @click="quxiaodialog">取消</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="changeQue == 2">
            <el-button @click="changeQue=1,clickMenu = false,clickMenu1 = false">返回</el-button>
        </span>
      </el-dialog>

          </el-col>
        </el-row>

      <el-dialog title="知识点" :visible.sync="graphEditDel1">
                <el-row :gutter="20" type="flex"
                    <el-col :span="14">
                      <el-form ref="form" :model="form" label-position="left">
                        <el-col :span="10">
                          <el-form-item v-if="garphAddShow1 == true">
                              <ele-multi-cascaders
                                :options="options1"
                                v-model="form.isp2"
                                placeholder="选择知识点"
                                @change="ispChange"
                                >
                              </ele-multi-cascaders>
                          </el-form-item>
                        </el-col>
                      </el-form>
                    </el-col>
                </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="graphEdit1">取 消</el-button>
          <el-button type="primary" @click="graphAddSubmit1">确 定</el-button>
        </div>
    </el-dialog>
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
import Utils3 from '@/components/treeTable/utils3/index.js'
import Utils4 from '@/components/treeTable/utils4/index.js'
import Utils5 from '@/components/treeTable/utils5/index.js'
export default {
  data(){
      return{
        changeQue: 1,
        PLGXVisible:false,
        tableShow: true,
        testShow: false,
        graphShow:false,
        changeControlPath: true,
        changeControlType: true,
        changeControlDiff: true,
        clickMenu: false,
        clickMenu1: false,
        graphEditDel1: false,
        garphAddShow1: false,
        graphID: null,
        form: {
          isp2: []
        },
        options1:[],
        // 关系图数组
        webkitDep:[],
        webkitDep1:[],
        links:[],
        modifyTitleDiff: '变更',
        modifyTitlePath: '变更',
        modifyTitleType: '变更',
        FLlist: {},
        subjectsPathse: [],
        // 修改后数据
        originalData: {},

        uploadTable: [],
        //   初始化数据
        uploadUrl: this.$axiosURL.fm_fileManipulate + '/upload/bashImport/wordOrExcel' + '/' +this.$store.state.aId + '/' + 0,
        initData: {},
        inputVisible: false,
        neirong: false,
        chakan:false,
        graphEditDel: false,
        garphAddShow: false,
        options: [],
        form: {
          isp1: []
        },
        dialogVisible: false,
        details: {},

        msg: '关联知识点查看',
        inputValue: '',
        ZSDprops:{
          value:'id',
          label:'name',
          children:'knowledgePoints',
        },
        ZSDprops1:{
          value:'id',
          label:'name',
          children:'knowledgePoints',
        },
        ZSDprops2:{
          value:'name',
          label:'name',
          children:'knowledgePoints',
        },
        subjectsIdsStrs: [],
        subjectsIdsStrs1: [],
        examModality: '',
        examModalitys: '',
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
          questionAnswer: ''
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
          questionOption:''
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
        ZSDdata: [],
        // 学科相关知识点数组
        involveItem: [],
        delId: null,
        // 学科删除数组
        delItems:[],
        // 学科选中数组
        xuekeChangItems:[],
        index:null,
        totalItems: 0,
        currentPage: 1,
        pageSize: 5,
        tableDataEnd: [],
        filterTableDataEnd: [],
        tableDataName: '',
        selectvalue: '',
        flag: false,
        zindex: null,
        uploadTC: false,
        uploadUrl1: '',
        fileList: []
    }   
  },
  components: {
    xzquestion,
    tkquestion,
    pdquestion,
    jdquestion,
    zhquestion,
    dxquestion,
    lsquestion,
  },
  watch: {
    subjectsIdsStrs: function (val) {
      console.log(val,7777)
      this.directoryCreate.subjectsIdsStr = val[val.length - 1]
    }
  },
  computed:{
    data3: function () {
      let data3 = this.options
      return data3       
    }
  },
  created(){

  },
  mounted(){
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
    doFilter () {      
      this.tableDataEnd = []
      this.filterTableDataEnd = []

      if (this.selectvalue === '' && this.examModality === '') {
        this.tableDataEnd = this.uploadTable
        this.filterTableDataEnd = this.tableDataEnd
        // this.filterTableDataEnd.splice(0,2)
      }
      this.totalItems = this.filterTableDataEnd.length
      this.currentChangePage(this.filterTableDataEnd)
      console.log(this.filterTableDataEnd,333333)
      this.flag = true
      this.tableDataName = ''
    },
    resetForm(){
      this.examModality = ''
      this.selectvalue = ''      
    },
    currentChangePage (list) {
      let from = (this.currentPage - 1) * this.pageSize
      let to = this.currentPage * this.pageSize
      this.tableDataEnd = []
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from])
        }
      }

    },
    graphAdd(){
          // this.dataIndex = null
          // this.xuekeId = null
          this.clickMenu = false
          this.graphEditDel1 = true
          this.garphAddShow1 = true

          if(this.xuekeId) {
            console.log(this.graphID,'学科 添加 ')
            // this.dataIndex = null
            // this.xuekeId = null
            // this.clickMenu = false
            // 点击添加学科数据展示
            this.$axiosRes('get',this.$axiosURL.k_knowledgeHierachy+ '0/find/'+ this.graphID +'/theOtherAll').then((res)=>{
              this.options1 = res
              Utils4.MSDataTransfer.treeToArray(this.options1,this.webkitDep[0])
            })
          } else {
            console.log(this.graphID,'知识点 添加 ')
            this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy + '4/all').then((res)=>{
              this.options1 = res
              for (var i = 0; i < this.options1.length; i++) {
                this.options1[i]['disabled'] = true
              }
               Utils4.MSDataTransfer.treeToArray(this.options1,this.webkitDep[0])
            })
            // this.dataIndex = null
            // this.xuekeId = null
            // 点击添加知识点数据展示
            // this.$axiosRes('get',this.$axiosURL.k_knowledgePoint+ '4/find/nonParentHierachies/and/excludeHaveInvolvedPoints/' + this.graphID).then((res)=>{
            //   this.options = res
            //   for (var i = 0; i < this.options.length; i++) {
            //     this.options[i]['disabled'] = true
            //   }
            // })
          }
    },
    // 取消按钮
    graphEdit(){
        this.dataIndex = null
        this.xuekeId = null
        this.form.isp2 = []
        this.xuekeChangItems = []
        this.graphEditDel1 = false
        this.garphAddShow1 = false
    },
    graphAddSubmit1(){
        if(this.xuekeId) {
          var params ={
            eqId: this.details.id,
            minorKHIds: this.form.isp2
          }
          // console.log(this.xuekeId,'父 学科 添加',this.graphID)
          // this.dataIndex = null
          // this.xuekeId = null
          // this.clickMenu = false
          // this.graphEditDel1 = false
          // this.garphAddShow1 = false
          // console.log(this.form.isp2,69696969)

          this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/minor',params).then((res)=>{
            console.log(this.xuekeId,'父 学科 添加',this.graphID)
            Utils4.MSDataTransfer.treeToArray(this.options1,this.xuekeChangItems)
            for (var i = 0; i < this.xuekeChangItems.length; i++) {
              this.webkitDep[0].push(this.xuekeChangItems[i])
            }
            for (var i = 1; i < this.webkitDep[0].length; i++) {
              this.webkitDep[0][i].category = 2
            }
            for (var s = 0; s < this.webkitDep[0].length; s++) {
                var obj2 = {}
                obj2['source'] = 0
                obj2['target'] = s
                // this.oneGraphItem.pathGraph[i]
                this.links.push(obj2)
            }
            this.initChartgx()
            this.dataIndex = null
            this.xuekeId = null
            this.clickMenu = false
            this.form.isp2 = []
            this.graphEditDel1 = false
            this.garphAddShow1 = false
          }) 
        } else {
          var params ={
            eqId: this.details.id,
            minorKPIds: this.form.isp2
          }
          this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/minor',params).then((res)=>{
            console.log(this.xuekeId,'父 知识点 添加',this.graphID)
            Utils4.MSDataTransfer.treeToArray(this.options1,this.xuekeChangItems)
            for (var i = 0; i < this.xuekeChangItems.length; i++) {
              this.webkitDep[0].push(this.xuekeChangItems[i])
            }
            for (var s = 0; s < this.webkitDep[0].length; s++) {
                var obj2 = {}
                obj2['source'] = 0
                obj2['target'] = s
                // this.oneGraphItem.pathGraph[i]
                this.links.push(obj2)
            }
            this.initChartgx()
            this.dataIndex = null
            this.xuekeId = null
            this.clickMenu = false
            this.form.isp2 = []
            this.graphEditDel1 = false
            this.garphAddShow1 = false
            this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ '1/find/' + this.details.id).then((res)=>{
              console.log(res.knowledgePoints,78778787878)
                var arrr = []
                for (var i = 0; i < res.knowledgePoints.length; i++) {
                  arrr.push(res.knowledgePoints[i].name)
                }
                console.log(this.uploadTable[this.zindex],8888888888888)
                console.log(arrr,777777777777)
                console.log(this.uploadTable[this.zindex].knowledgePoints,9999999999999)
                this.uploadTable[this.zindex].allknowledgePoints = arrr.join(", ")
                this.handleSizeChange(this.pageSize)
            })
          })  
        }
    },
    ispChange(values, items) {
        this.xuekeChangItems = items
        console.log(this.form.isp2)
    },
    graphdel(){
        this.$confirm('此操作将永久删除该知识点关系, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          if(this.dataIndex == 0) {
            if(this.xuekeId) {
              // var arr = []
              // arr.push(this.graphID)
              if(this.webkitDep1.length <= 1) {
                return
              }
              var arrs = []
              for (var i = 1; i < this.webkitDep1.length; i++) {
                console.log(this.webkitDep1[i])
                arrs.push(this.webkitDep1[i].id)
              }
              var params ={
                minorKHIds: arrs,
                eqId: this.details.id
              }
              console.log(this.xuekeId,'父 学科 删除',this.graphID)
              this.$axiosResBody1('delete',this.$axiosURL.k_examinationQuestion+ 'delete/minor',params).then((res)=>{
                var yrr = []
                for (var i = 1; i < this.webkitDep[0].length; i++) {
                  yrr.push(i)
                }
                for (var i = 0; i < yrr.length; i++) {
                  delete this.webkitDep[0][yrr[i]]
                }
                var arrr=this.webkitDep[0].filter(item => item)
                this.webkitDep[0] = arrr
                this.dataIndex = null
                this.xuekeId = null
                this.clickMenu = false
                // this.$bus.$emit('graphEel','')
              })
            } else {
              // 父ID
              if(this.webkitDep1.length <= 1) {
                return
              }
              var arre = []
              for (var i = 1; i < this.webkitDep[0].length; i++) {
                console.log(this.webkitDep[0][i],888)
                arre.push(this.webkitDep[0][i].id)
              }
              var params ={
                minorKPIds: arre,
                eqId: this.details.id
              }

              this.$axiosResBody1('delete',this.$axiosURL.k_examinationQuestion+ 'delete/minor',params).then((res)=>{
                var yrr = []
                for (var i = 1; i < this.webkitDep[0].length; i++) {
                  yrr.push(i)
                }
                for (var i = 0; i < yrr.length; i++) {
                  delete this.webkitDep[0][yrr[i]]
                }
                var arrr=this.webkitDep[0].filter(item => item)
                this.webkitDep[0] = arrr
                this.$nextTick(function(){
                  this.initChartgx()
                })
                this.dataIndex = null
                this.xuekeId = null
                this.clickMenu = false
              })

            }
          } else {
            if(this.xuekeId) {
              var arr = []
              arr.push(this.graphID)
              var params ={
                minorKHIds: arr,
                eqId: this.details.id
              }
              delete this.webkitDep[0][this.dataIndex]
              var arrr = this.webkitDep[0].filter(item => item)
              this.webkitDep[0] = arrr
              // Utils3.MSDataTransfer.treeToArray(this.options,tag)

              this.$nextTick(function(){
                this.initChartgx()
              })
              this.$axiosResBody1('delete',this.$axiosURL.k_examinationQuestion+ 'delete/minor',params).then((res)=>{
                console.log(this.xuekeId,'子 学科 删除',this.graphID)
                this.dataIndex = null
                this.xuekeId = null
                this.clickMenu1 = false
              })
            } else {

              var arr = []
              arr.push(this.graphID)
              var params ={
                minorKPIds: arr,
                eqId: this.details.id
              }
              delete this.webkitDep[0][this.dataIndex]
              var arrr = this.webkitDep[0].filter(item => item)
              this.webkitDep[0] = arrr
              this.$nextTick(function(){
                this.initChartgx()
              })
              this.$axiosResBody1('delete',this.$axiosURL.k_examinationQuestion+ 'delete/minor',params).then((res)=>{
                this.dataIndex = null
                this.xuekeId = null
                this.clickMenu1 = false
              })
              console.log(this.xuekeId,'子 知识点 删除',this.graphID)
            }
          }

            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })       
        })
    },
    // 相关知识点关系图
    graphEdit(){
        this.changeQue = 2
        this.$nextTick(function(){
          this.initChartgx()
          this.initChartgx()
        })
    },
    initChartgx(){
          for (var i=0;i<document.getElementsByClassName('J_chartFocusBox').length;i++){
          this.$echarts.init(document.getElementsByClassName('J_chartFocusBox')[i]).showLoading();
          this.$echarts.init(document.getElementsByClassName('J_chartFocusBox')[i]).hideLoading();
        
           var option = {
                tooltip : {
                      show : true,   //默认显示
                      showContent:true, //是否显示提示框浮层
                      trigger:'item',//触发类型，默认数据项触发
                      triggerOn:'mousemove',//提示触发条件，mousemove鼠标移至触发，还有click点击触发
                      alwaysShowContent:false, //默认离开提示框区域隐藏，true为一直显示
                      showDelay:0,//浮层显示的延迟，单位为 ms，默认没有延迟，也不建议设置。在 triggerOn 为 'mousemove' 时有效。
                      hideDelay:200,//浮层隐藏的延迟，单位为 ms，在 alwaysShowContent 为 true 的时候无效。
                      enterable:false,//鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
                      position:'right',//提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。只在 trigger 为'item'的时候有效。
                      confine:false,//是否将 tooltip 框限制在图表的区域内。外层的 dom 被设置为 'overflow: hidden'，或者移动端窄屏，导致 tooltip 超出外界被截断时，此配置比较有用。
                      transitionDuration:0.4,//提示框浮层的移动动画过渡时间，单位是 s，设置为 0 的时候会紧跟着鼠标移动。
                      formatter: function (params) {
                        if(params.data.name) {
                          return '名称'+ ':' +params.data.name;//  设置提示框的内容和格式 节点和边都显示name属性
                        }
                      }
                },
                legend:[{
                  data:['知识点','试题','学科']
                }],
                series: [{
                    type : 'graph', //关系图
                    name : "考核管理系统", //系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                    layout : 'force', //图的布局，类型为力导图，'circular' 采用环形布局，见示例 Les Miserables
                    legendHoverLink : true,//是否启用图例 hover(悬停) 时的联动高亮。
                    hoverAnimation : true,//是否开启鼠标悬停节点的显示动画
                    coordinateSystem : null,//坐标系可选
                    xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
                    yAxisIndex : 0, //y轴坐标 
                    animation: true,
                    symbolSize: 60,
                    label: {
                        normal: {
                          show: true,
                            position: 'inside',
                            formatter: function(params){
                              return params.data.name;
                            },
                        }
                    },
                    draggable: true,
                    data: this.webkitDep[i].map(function (node, idx) {
                        // node.id = idx;
                        console.log(node)
                        return node;
                    }),
                    roam: 'move',
                    symbol:'circle',//关系图节点标记的图形。ECharts 提供的标记类型包括 'circle'(圆形), 'rect'（矩形）, 'roundRect'（圆角矩形）, 'triangle'（三角形）, 'diamond'（菱形）, 'pin'（大头针）, 'arrow'（箭头）  也可以通过 'image://url' 设置为图片，其中 url 为图片的链接。'path:// 这种方式可以任意改变颜色并且抗锯齿
                    nodeScaleRatio : 0.6,//鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
                    draggable : true,//节点是否可拖拽，只在使用力引导布局的时候有用。
                    focusNodeAdjacency : true,//是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
                    itemStyle : {//===============图形样式，有 normal 和 emphasis 两个状态。normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                        normal : { //默认样式
                            label : {
                                show:true
                            },
                            // color:'#2498a5',
                            borderType : 'dotted', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                            borderColor : '#dce8e391', //设置图形边框为淡金色,透明度为0.4
                            borderWidth : 0, //图形的描边线宽。为 0 时无描边。
                            opacity : 1
                        // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5

                        },
                        emphasis : {//高亮状态
                            borderType : 'dotted', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                            borderColor : '#dce8e391', //设置图形边框为淡金色,透明度为0.4
                            borderWidth : 4, //图形的描边线宽。为 0 时无描边。
                            opacity : 1
                        }
                    },
                    lineStyle : { //==========关系边的公用线条样式。
                        normal : {
                            show: true,
                            color : '#333',
                            width : '2',
                            type : 'dashed', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                            curveness : 0.1, //线条的曲线程度，从0到1
                            opacity : 1
                        // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
                        },
                        emphasis : {//高亮状态
                            show: true,
                            color : '#333',
                            width : '2',
                            type : 'dashed', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                            curveness : 0.1, //线条的曲线程度，从0到1
                            opacity : 1
                        }
                    },
                    edgeLabel : {//==============线条的边缘标签 
                          normal : {
                              show : false
                          },
                          emphasis : {//高亮状态

                          }
                    },
                    categories: [{ name: "知识点" },{ name: "试题"},{ name: "学科"}],
                    force: {
                      //initLayout: ,//力引导的初始化布局，默认使用xy轴的标点
                      repulsion : 100,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                      gravity : 0.03,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                      edgeLength :180,//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
                      layoutAnimation : true
                    },
                    edges: this.links
                }]
            };
            this.$echarts.init(document.getElementsByClassName('J_chartFocusBox')[i]).setOption(option);
            // 右键点击
            console.log(this.links,888)
              var _this = this
              function rightBT(params){
                  var event = params.event.event
                  var menu = document.getElementById("menu")
                  menu.style.left = event.pageX + 'px'
                  menu.style.top = event.pageY + 'px'
                  if(params.dataIndex == 0) {
                     _this.clickMenu = true
                     _this.clickMenu1 = false
                    _this.xuekeId  = params.data.khId
                    _this.dataIndex = params.dataIndex
                    _this.graphID  = params.data.id

                  } else {
                    _this.clickMenu = false
                    _this.clickMenu1 = true
                    _this.dataIndex = params.dataIndex
                    _this.graphID  = params.data.id
                    _this.xuekeId  = params.data.khId
                  }

                  console.log(params,22)
              }
              // 右键禁用
              document.getElementsByClassName('J_chartFocusBox')[i].oncontextmenu = function() {
                return false;
              }
              this.$echarts.init(document.getElementsByClassName('J_chartFocusBox')[i]).on('contextmenu', rightBT)
          }
    },
    XQhandleClose (done) {
      this.$confirm('确认关闭？').then(_ => {
        this.changeQue = 1
        this.clickMenu = false
        this.clickMenu1 = false
        // this.questionTable()
        done()
      })
        .catch(_ => {
          this.$message({
            message: '已取消',
            type: 'warning'
          })
        })
    },
    // 修改详情
    changeQuestion () {
      this.changeQue = 3
    },
     //  详情界面删除此题
    deleteQuestion () {
      // this.delete(this.details.questionsId)
    },
    changeQuestion () {
      this.changeQue = 3
    },
    quxiaodialog(){
      this.dialogVisible = false
      // this.questionTable()
    },
    STEdit(id, index, rows){
        // this.zindex = index + this.pageSize*(this.currentPage - 1)
        for (var i = 0; i < this.uploadTable.length; i++) {
          // console.log(this.uploadTable[i].id)
          if(this.uploadTable[i].id == id) {
            this.zindex = i
          }
        }
        // console.log(id)
        this.dialogVisible = true;
        this.webkitDep1 = []
        this.webkitDep = []
        this.links = []
        this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ '1/find/' + id).then((res)=>{
          // console.log(res)
          this.details = res
          // 详情页面数据转换
          // 试题用途
          if(this.details.eqBodyImageNameList){
            this.details.eqBodyImageNameList1 = this.details.eqBodyImageNameList
          }
          if(this.details.eqOptionImageNameList){
            this.details.eqOptionImageNameList1 = this.details.eqOptionImageNameList
          }

          if(this.details.simulateOrOfficial == true) {
            this.details.simulateOrOfficial = '正式考试'
          } else{
            this.details.simulateOrOfficial = '模拟训练'
          }
          // if(this.details.knowledgeHierachies.length > 0) {
          //   // 主要学科
          //   var arr = []
          //   arr.push(this.details.knowledgeHierachies[0].id)
          //   this.subjectsPathse = arr
          // } else {
            // 主要知识点
          this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ 'find/majorPointOrSubject/' + this.details.id).then((res)=>{
            if (res.majorKnowledgePoint !== null) {
              // 知识点
              this.$axiosRes('get',this.$axiosURL.k_common+ 'find/pathNodesId/byOnePoint/' + res.majorKnowledgePoint.id).then((   res)=>{
                this.subjectsPathse = res
              })
            } else {
              // 学科
              var arr = []
              arr.push(res.majorKnowledgeHierachy.id)
              this.subjectsPathse = arr
            }
            // this.subjectsPathse = res
          })

          // }
          // 次要知识点学科
          this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ 'find/minorPointOrSubject/' + this.details.id).then((res)=>{
            console.log(res,555)
            // this.subjectsPathse = res
            if(res.minorKnowledgePoints !== null) {
              console.log(res.minorKnowledgePoints,8989);
              // 知识点次要
              var obj1 = {}
              obj1.name = this.details.questionBody
              obj1.id = this.details.id
              obj1.category = 1
              this.webkitDep1 = res.minorKnowledgePoints
              this.webkitDep1.unshift(obj1)
              console.log(this.webkitDep1,5555)
              for (var i = 1; i < this.webkitDep1.length; i++) {
                this.webkitDep1[i].category = 0
              }
              for (var i = 0; i < this.webkitDep1.length; i++) {
                var obj2 = {}
                obj2['source'] = 0
                obj2['target'] = i
                // this.oneGraphItem.pathGraph[i]
                this.links.push(obj2)
              }
              this.webkitDep.push(this.webkitDep1)
            } else {
              if(res.minorKnowledgeHierachies !== null) {
                // 学科次要
                var obj = {}
                obj.name = this.details.questionBody
                obj.id = this.details.id
                obj.khId = 1
                obj.category = 1
                this.webkitDep1 = res.minorKnowledgeHierachies
                this.webkitDep1.unshift(obj)
                for (var i = 1; i < this.webkitDep1.length; i++) {
                  this.webkitDep1[i].category = 2
                }
                for (var i = 0; i < this.webkitDep1.length; i++) {
                  var obj3 = {}
                  obj3['source'] = 0
                  obj3['target'] = i
                  // this.oneGraphItem.pathGraph[i]
                  this.links.push(obj3)
                }
                this.webkitDep.push(this.webkitDep1)                
              } else {
                var obj1 = {}
                obj1.name = this.details.questionBody
                obj1.id = this.details.id
                obj1.category = 1
                // this.webkitDep1 = res.minorKnowledgePoints
                this.webkitDep1.unshift(obj1)
                for (var i = 1; i < this.webkitDep1.length; i++) {
                  this.webkitDep1[i].category = 2
                }
                for (var i = 0; i < this.webkitDep1.length; i++) {
                  var obj3 = {}
                  obj3['source'] = 0
                  obj3['target'] = i
                  // this.oneGraphItem.pathGraph[i]
                  this.links.push(obj3)
                }
                this.webkitDep.push(this.webkitDep1)
              }

            }
          })
          // 关系图数据
          // graph排序
          for (var i = 0; i < this.webkitDep1.length; i++) {
            var obj = {}
            obj['source'] = 0
            obj['target'] = i
            // this.oneGraphItem.pathGraph[i]
            this.links.push(obj)
          }
          console.log(this.links,123123213)
          // var idarr = [115,130]
          // idarr.push(this.details.name)
          // idarr.push(this.details.knowledgePoints[0].name)
          // this.subjectsPathse = idarr
          // console.log(this.details,this.details.knowledgePoints[0].id,idarr,5555555)
          // 题型
          var obj1 ={}
          obj1 = this.$store.state.dictionarys.question_type.find((item)=>{
            return item.value == this.details.questionType
          })
          this.details.questionTypes = obj1.dictName         

          // 选择选项内容
          if(this.details.questionType == "MULTIPLE_CHOICE" || this.details.questionType == "SINGLE_CHOICE") {
            var questionOptions = this.details.questionOption
            this.details['questionOptions'] = questionOptions
            var newquestionOption =[]
            for (var i = 0; i < this.details.questionOptions.length; i++) {
              var obj = {}
              var xx = this.details.questionOptions[i].substr(0,1)
              var nr = this.details.questionOptions[i].substr(2,this.details.questionOptions[i].length)
              obj['key'] = xx
              obj['value'] = nr
              if(this.details.eqOptionImageNameList){
                obj['img'] = this.details.eqOptionImageNameList1[i]
              }
              newquestionOption.push(obj)
            }
            this.details.questionOption = newquestionOption
          }

          // 选择答案
          if(this.details.questionType == "MULTIPLE_CHOICE") {
              this.details.questionAnswer = this.details.questionAnswer.split(",")
          }

          // 填空答案
          if(this.details.questionType == "GAP_FILLING") {
            var tkquestionAnswer = this.details.questionAnswer.split(",")
            var tkquestionAnswerArr = []
            for (var i = 0; i < tkquestionAnswer.length; i++) {
              var obj1 = {}
              obj1['value'] = tkquestionAnswer[i]
              tkquestionAnswerArr.push(obj1)
            }
            this.details.questionAnswer = tkquestionAnswerArr
            // var tkquestionAnswerarr = []
          }

          // 综合题
          if(this.details.questionType == "COMPREHENSIVE") {
            for (var i = 0; i < this.details.examinationSubquestions.length; i++) {
              if(this.details.examinationSubquestions[i].eqBodyImageNameList){
                this.details.examinationSubquestions[i].eqBodyImageNameList1 = this.details.examinationSubquestions[i].eqBodyImageNameList
              }
              if(this.details.examinationSubquestions[i].eqOptionImageNameList){
                this.details.examinationSubquestions[i].eqOptionImageNameList1 = this.details.examinationSubquestions[i].eqOptionImageNameList
              }
              // 综合题下的填空题答案数据转换
              if(this.details.examinationSubquestions[i].questionType == "GAP_FILLING") {
                  var zhtkquestionAnswer = this.details.examinationSubquestions[i].questionAnswer.split(",")
                  var zhtkquestionAnswerArr = []
                  for (var j = 0; j < zhtkquestionAnswer.length; j++) {
                    var obj2 ={}
                    obj2['value'] = zhtkquestionAnswer[j]
                    zhtkquestionAnswerArr.push(obj2)
                  }
                this.details.examinationSubquestions[i].questionAnswer = zhtkquestionAnswerArr
              }

              // 综合题下的选择题选项
            if(this.details.examinationSubquestions[i].questionType == "MULTIPLE_CHOICE" || this.details.examinationSubquestions[i].questionType == "SINGLE_CHOICE") {
              var questionOptions = this.details.examinationSubquestions[i].questionOption
              this.details.examinationSubquestions[i]['questionOptions'] = questionOptions
              var newquestionOption =[]
              for (var k = 0; k < this.details.examinationSubquestions[i].questionOptions.length; k++) {
                var obj3 = {}
                var xx = this.details.examinationSubquestions[i].questionOptions[k].substr(0,1)
                var nr = this.details.examinationSubquestions[i].questionOptions[k].substr(2,this.details.examinationSubquestions[i].questionOptions[k].length)
                obj3['key'] = xx
                obj3['value'] = nr
                if(this.details.examinationSubquestions[i].eqOptionImageNameList){
                  obj3['img'] = this.details.examinationSubquestions[i].eqOptionImageNameList1[k]
                }
                newquestionOption.push(obj3)
              }
              this.details.examinationSubquestions[i].questionOption = newquestionOption
            }

              // 综合题下的选择题答案
              if(this.details.examinationSubquestions[i].questionType == "MULTIPLE_CHOICE") {
                  this.details.examinationSubquestions[i].questionAnswer = this.details.examinationSubquestions[i].questionAnswer.split(",")
              }

            }

          }    

          console.log(this.details);
        })
    },
    // 上传附件
    uploadFile(id){
      this.uploadTC = true
      this.uploadUrl1 = this.$axiosURL.fm_fileManipulate + '/bash/upload/accessory/for/' + id + '/' + this.$store.state.aId
      this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ 'get/accessories/of/' + id).then((res)=>{
        console.log(res,8888888)
        this.fileList = res
        for (var i = 0; i < this.fileList.length; i++) {
          this.fileList[i].name = this.fileList[i].originalName
        }
      })
    },
    uploadQX(){
      this.uploadTC = false
      this.fileList = []
    },
    handleRemove(file, fileList) {
      this.$axiosResBody1('delete',this.$axiosURL.K_examinationQuestionAccessory + file.id).then((res)=>{
        console.log(res)
      })
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleAvatarSuccess(res, file){
      console.log(res,file)
    },
    beforeRemove(file, fileList) {
      // return;
    },
    beforeUpload(file){
      var isLoad = true
      const FileSize = file.size/1024/1024 < 500
      if(this.fileList.length){
        for (var i = 0; i < this.fileList.length; i++) {
          if(this.fileList[i].name == file.name){
            this.$message({
              showClose: true,
              message: '警告,不能上传相同文件。',
              type: 'warning'
            })
            isLoad = false
            console.log(this.fileList[i].name)
            break
          }
        }
      }
      return isLoad

      if(!FileSize) {
        this.$message.error('上传文件大小不能超过 500MB!');
      }
      return FileSize
    },
    headChange(file, fileList) {


      },
    handleSizeChange(val) {
        this.pageSize = val
        this.handleCurrentChange(this.currentPage)
    },
    // 当前页
    handleCurrentChange(val) {
        this.currentPage = val
        if (!this.flag) {
          this.currentChangePage(this.tableDataEnd)
        } else {
          this.currentChangePage(this.filterTableDataEnd)
        }
    },
    deleteRow(id, index, rows) {
      // console.log(rows)
      // console.log(id)


        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            // 试题删除  重新获取数据
            this.$axiosRes('delete',this.$axiosURL.k_examinationQuestion + id ).then((res)=>{
              // 删除根据id查找索引 不能直接索引
              // this.zindex = index + this.pageSize*(this.currentPage - 1)
                for (var i = 0; i < this.uploadTable.length; i++) {
                  // console.log(this.uploadTable[i].id)
                  if(this.uploadTable[i].id == id) {
                    this.zindex = i
                  }
                }
                console.log(this.zindex,this.uploadTable)
                this.uploadTable.splice(this.zindex, 1)
                this.totalItems = this.filterTableDataEnd.length
                if(this.selectvalue !== '' && this.examModality !== '') {
                  this.currentPage = 1
                }
                this.doFilter()
                this.currentChangePage(this.filterTableDataEnd)
            })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    beforeAvatarUpload1(file){
      const extension2 = file.name.split('.')[1] === 'doc'
      const extension3 = file.name.split('.')[1] === 'docx'
      if(!extension2 && !extension3) {
        this.$message({
          message: '请上传doc、docx格式文件',
          type: 'error'
        })
        return extension2 || extension3
      }
    },
    uploadProgress(){
       this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    uploadSuccess(res,file){
      this.uploadTable = res.examinationQuestions
      this.$loading().close()
      this.totalItems = this.uploadTable.length
      if (this.totalItems > this.pageSize) {
        console.log(this.pageSize,2323)
        for (let index = 0; index < this.pageSize; index++) {
          this.tableDataEnd.push(this.uploadTable[index])
          console.log(this.tableDataEnd)
        }
        this.doFilter()

      } else {
        this.tableDataEnd = this.uploadTable
        this.doFilter()
      }


      for(var i = 0;i < this.uploadTable.length;i++) {
        for(var j=0;j<this.uploadTable[i].knowledgePoints.length;j++){
          this.uploadTable[i].knowledgePoints[j] = this.uploadTable[i].knowledgePoints[j].name
          console.log(this.uploadTable[i].knowledgePoints[j],99999999999999999)

        }        
        this.uploadTable[i].allknowledgePoints = this.uploadTable[i].knowledgePoints.join(", ")
        console.log(this.uploadTable[i].allknowledgePoints)
        // 难度转换
        var obj ={}
        obj = this.$store.state.dictionarys.question_difficulty.find((item)=>{
          return item.value == this.uploadTable[i].questionDifficulty
        })
        this.uploadTable[i].questionDifficultyName = obj.dictName

        // 类型转换
        var obj1 ={}
        obj1 = this.$store.state.dictionarys.question_type.find((item)=>{
          return item.value == this.uploadTable[i].questionType
        })
        this.uploadTable[i].questionTypes = obj1.dictName


        this.uploadTable[i].createTimes = this.timestampToTime(this.uploadTable[i].createTime)         
      }
      console.log(res)
    },
    wordxaizai(){
      var url =this.$axiosURL.fm_fileManipulate + '/download/model/'+ '试卷综合试题批量导入模版.docx'
      window.location.href = url
    },

    // 取消
    graphEdit1(){
      this.graphEditDel = false
      this.garphAddShow = false
      this.form.isp1 =[]
      this.xuekeChangItems = []
    },

    timestampToTime(timestamp){
      var date = new Date(timestamp)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    handleSubmitData1 (formName) {
        console.log(formName,77777777)
        if (formName.questionAnswer && formName.questionBody === '') {
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
        if (formName.questionAnswer && formName.questionAnswer === '') {
          this.$message({
            message: '答案不能为空',
            type: 'error'
          })
          return
        }

        // 综合题部分校验
        if(formName.examinationSubquestions && formName.examinationSubquestions.length > 0) {
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
                if (formName.examinationSubquestions[i].questionAnswer[k].value === '') {
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
              formName.examinationSubquestions[i].questionAnswer = arr.join(',')

            }

          }
        }

        if (formName.questionOption) {
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

        if(formName.questionType == "MULTIPLE_CHOICE") {
            var str1 =  formName.questionAnswer
            formName.questionAnswer = str1.join(',')
        }

        if(formName.questionType == "GAP_FILLING"){
          var arr1 = []
          for(var i=0; i< formName.questionAnswer.length; i++){
            if ((formName.questionAnswer[i].value === '')) {
                this.$message({
                  message: '答案不能为空',
                  type: 'error'
                })
                return
            } else {
                arr1.push(formName.questionAnswer[i].value)
            }
          }
          formName.questionAnswer = arr1
          formName.questionAnswer = arr1.join(',')

        }
        // 选择题题干数据类型转换
        if(formName.questionType == "MULTIPLE_CHOICE" || formName.questionType == "SINGLE_CHOICE") {
          var array = []
          for(var i=0; i< formName.questionOption.length; i++){
              var str = ''
              str = formName.questionOption[i].key + '.' + formName.questionOption[i].value
              array.push(str)
          }
          // array.join(',')
          formName.questionOption = array.join(';')
        }
        if(formName.simulateOrOfficial =='模拟考试'){
          formName.simulateOrOfficial = false
        } else {
          formName.simulateOrOfficial = true
        }        
        this.changeQue=1
        this.dialogVisible = false
        var params = []
        params.push(formName)
        var aupdateTime = Date.parse(new Date())
        formName['updateTime'] = aupdateTime
        formName['updateUserID'] = this.$store.state.aId
        console.log(formName,125)
        this.$axiosResBody1('put',this.$axiosURL.k_examinationQuestion+ 'update',params).then((res)=>{
          // console.log(res)
          console.log(formName.questionBody,98988884444555)
          this.uploadTable[this.zindex].questionBody = formName.questionBody
          this.handleSizeChange(this.pageSize)
        })
    },
    handleSubmitDataOne(formName){
          // if(formName.exam_modality =='模拟考试'){
          //   formName.simulateOrOfficial = false
          // } else {
          //   formName.simulateOrOfficial = true
          // }
          formName.questionDifficulty = formName.questionsDifficultyId
          if(formName.questionDifficulty) {
            this.uploadTable[this.zindex].questionDifficulty = formName.questionDifficulty
            var obj ={}
            obj = this.$store.state.dictionarys.question_difficulty.find((item)=>{
              return item.value == this.uploadTable[this.zindex].questionDifficulty
            })
            this.uploadTable[this.zindex].questionDifficultyName = obj.dictName
          }
          var params = []
          params.push(formName)
          var aupdateTime = Date.parse(new Date())
          formName['updateTime'] = aupdateTime
          formName['updateUserID'] = this.$store.state.aId
          this.$axiosResBody1('put',this.$axiosURL.k_examinationQuestion+ 'update',params).then((res)=>{
            // console.log(res)
          })
    },

    //     详情页修改
    modify (val,id) {
        if (val === 'Type') {
          if (this.changeControlType) {
            this.changeControlType = false
            this.modifyTitleType = '保存'
          } else {
            this.originalData['simulateOrOfficial'] = this.details.simulateOrOfficial
            this.changeControlType = true
            this.modifyTitleType = '变更'
            // if (this.fileList.length) {
            //   let fileListStr = []
            //   for (let i = 0, k = this.fileList.length; i < k; i++) {
            //     fileListStr.push(this.fileList[i].fileId)
            //   }
            //   this.fileIdsStr = fileListStr.join(',')
            // }
            this.originalData.id = id

            this.handleSubmitDataOne(this.originalData)
          }
        } else if (val === 'Path') {
          if (this.changeControlPath) {
            this.changeControlPath = false
            this.modifyTitlePath = '保存'
          } else {
            this.originalData['subjectsIdsStr'] = this.subjectsPathse[this.subjectsPathse.length - 1]
            this.changeControlPath = true
            this.modifyTitlePath = '变更'
            // if (this.fileList.length) {
            //   let fileListStr = []
            //   for (let i = 0, k = this.fileList.length; i < k; i++) {
            //     fileListStr.push(this.fileList[i].fileId)
            //   }
            //   this.fileIdsStr = fileListStr.join(',')
            // }
            this.originalData.id = id
            if(this.subjectsPathse.length == 1) {
              var params ={
                eqId: this.originalData.id,
                khId: this.originalData.subjectsIdsStr
              }
            } else {
              var params ={
                eqId: this.originalData.id,
                kpId: this.originalData.subjectsIdsStr
              }
            }
            console.log(params,777)

            this.$axiosResBody1('put',this.$axiosURL.k_examinationQuestion + 'update/major',params).then((res)=>{
              this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ '1/find/' + id).then((res)=>{
                console.log(res.knowledgePoints,5454545454)
                var arrr = []
                for (var i = 0; i < res.knowledgePoints.length; i++) {
                  arrr.push(res.knowledgePoints[i].name)
                }
                console.log(this.uploadTable[this.zindex],8888888888888)
                console.log(arrr,777777777777)
                console.log(this.uploadTable[this.zindex].knowledgePoints,9999999999999)
                this.uploadTable[this.zindex].allknowledgePoints = arrr.join(", ")
                this.handleSizeChange(this.pageSize)
                
              })

            })



            // this.handleSubmitDataOne(this.originalData)
          }
        } else if (val === 'Diff') {
          if (this.changeControlDiff) {
            this.changeControlDiff = false
            this.modifyTitleDiff = '保存'
          } else {
            this.originalData['questionsDifficultyId'] = this.details.questionDifficulty
            this.changeControlDiff = true
            this.modifyTitleDiff = '变更'
            // if (this.fileList.length) {
            //   let fileListStr = []
            //   for (let i = 0, k = this.fileList.length; i < k; i++) {
            //     fileListStr.push(this.fileList[i].fileId)
            //   }
            //   this.fileIdsStr = fileListStr.join(',')
            // }
            this.originalData.id = id
            this.handleSubmitDataOne(this.originalData)
          }
        }
    },
  }
}
</script>
