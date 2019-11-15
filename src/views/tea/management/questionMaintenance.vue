<template>
  <div class="teatable">
        <el-form :inline="true" :model="gjSearch" status-icon ref="gjSearch" label-width="100px" class="demo-ruleForm" size="mini">
          <el-form-item label="题干查询">
            <el-input v-model="nameSearchVal" placeholder="题干查询" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="知识点">
              <el-cascader
                placeholder="选择知识点"
                  size="mini"
                :options="ZSDdata"
                :props="ZSDprops"
                ref="cascader2"
                v-model="gjSearch.knowPoints"
                :show-all-levels="false"
                filterable
                change-on-select
                @change="">
              </el-cascader>
          </el-form-item>
          <el-form-item label="试题类型">
            <el-select v-model="gjSearch.knowlx" placeholder="请选择试题类型"  size="mini">
                  <el-option v-for = 'item in initData.question_type'
                    :label="item.dictName"
                    :value="item.value"
                  ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难易程度">
            <el-select v-model="gjSearch.knowny" placeholder="请选择难易程度"  size="mini">
              <el-option v-for="item in initData.question_difficulty" :label="item.dictName" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="能力指标">
              <el-select v-model="gjSearch.knowzb"  filterable placeholder="选择能力指标" size="mini">
                <el-option v-for="(item, index) in initData.question_ability_norm"
                  :key="index" :label="item.dictName" :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="用途">
              <el-select v-model="gjSearch.knowyt" placeholder="选择试题用途"  size="mini">
                <el-option v-for="item in initData.simulate_or_official" :label="item.dictName" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="录入方式">
              <el-select v-model="gjSearch.knowfs" placeholder="录入方式"  size="mini">
                <el-option v-for="item in initData.question_import_way" :label="item.dictName" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="日期查询">
            <el-date-picker
              v-model="gjSearch.createTime"
                size="mini"
              value-format="timestamp"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="nameSearch('gjSearch')" size="mini">查询</el-button>
          <el-button @click="resetForm('gjSearch')" size="mini">重置</el-button>
        </el-form>
    </el-row>

      <el-row type="flex" style="margin: 20px 0">
      <unit_button  :msg='TJST' @click.native='addQuestion'></unit_button>
      <!-- <unit_button  :msg='STCC' @click.native='clickSTCC'></unit_button> -->
      <unit_button  :msg='PLGX' @click.native='PLGXTest'></unit_button>
      <unit_button  :msg='PLSC' @click.native='PLSCTest'></unit_button>
      <unit_button  :msg='DCWD' @click.native='DCWDTest'></unit_button>
      <el-tooltip class="item" effect="dark" content="Excel不能导出综合题" placement="top">
        <unit_button  :msg='DCEL' @click.native='DCELTest'></unit_button>
      </el-tooltip>
     </el-row>
  			<!-- <unit_button  :msg='GJCX' @click.native='' slot="reference"></unit_button> -->
   <!-- </el-row> -->
    <!-- table表格 -->
    <div v-if="tableShow == true">
    <el-table
    :data="data"
    border
    style="width: 100%"
    @selection-change="handleSelectionChange"
    :row-style="showTr"
    max-height="500"
    >
    <el-table-column
      type="selection"
      width="55"
      >
    </el-table-column>
    <el-table-column :show-overflow-tooltip="true" v-for="(column, index) in columns" :key="column.dataIndex"
      :label="column.text" :type="column.type">
      <template scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <button style="border:0;background:transparent;outline:none;" class="button is-outlined is-primary is-small " v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon el-icon-arrow-right" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon el-icon-arrow-right el-table__expand-icon--expanded" aria-hidden="true"></i>
        </button>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        {{scope.row[column.dataIndex]}}
      </template>
    </el-table-column>

    <el-table-column label="操作" v-if="treeType === 'normal'" width="320">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="edit"
              @click="STEdit(scope.row.id)">试题详情
            </el-button>

              <el-button
               slot="reference"
                size="mini"
                type="warning"
                @click="uploadFile(scope.row.id)"
                >上传附件
              </el-button>


            <el-button
              size="mini"
              type="danger"
              @click="STDelete(scope.row.id)"
              >删除
            </el-button>
          </template>
    </el-table-column>
  </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </div>
    <!-- 上传附件弹出 -->
    <el-dialog
      title="提示"
      :visible.sync="uploadTC"
      width="30%"
      >

      <div class="tjwj">
          <!-- list-type="picture" -->
        <el-upload
          class="upload-demo"
          ref="fileUpload"
          :action="uploadUrl"
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

  <!-- x修改试题 -->
  <el-dialog modal-append-to-body append-to-body lock-scroll width="65%"  title="试题详情" :visible.sync="dialogVisible" custom-class="qts" center close-on-press-escape
                 lock-scroll :before-close="XQhandleClose">
        <!--详情 start-->
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
                    <!--点击变更后 切换为确定 -->
                    <a @click="modify('Path',details.id)" class="modifyClass">{{modifyTitlePath}}</a>
                    <i class="el-icon-edit" @click="graphEdit"></i>
                    <!--点击确定后 向后台提交-->
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用途: ">
                  <el-select v-model="details.simulateOrOfficial" filterable placeholder="选择试题用途" size="small" :disabled="changeControlType">
                    <el-option v-for="item in initData.simulate_or_official" :label="item.dictName" :value="item.value"></el-option>
                  </el-select>
                    <!--<el-radio-group v-model="details.questionsTypeId"  :key="index">-->
                    <!--<el-radio :disabled="changeControl"  :label="val.schemeTypeId">{{val.schemeTypeName}}</el-radio>-->
                    <!--</el-radio-group>-->
                    <!--点击变更后 切换为确定 -->
                    <a @click="modify('Type',details.id)" class="modifyClass">{{modifyTitleType}}</a>
                    <!--点击确定后 向后台提交-->
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="难易程度: ">
                    <!--<b>{{details.complexity}}</b>-->
                    <el-select v-model="details.questionDifficulty" size="small" filterable placeholder="请选择" :disabled="changeControlDiff">
                      <el-option
                        v-for="item in initData.question_difficulty"
                        :key="item.value"
                        :label="item.dictName" 
                        :value="item.value">
                      </el-option>
                    </el-select>

                    <!--点击变更后 切换为确定 -->
                    <a @click="modify('Diff',details.id)" class="modifyClass">{{modifyTitleDiff}}</a>
                    <!--点击确定后 向后台提交-->
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
                    <viewer :images="details.eqBodyImageNameList1" class="tImg" v-if="details.eqBodyImageNameList1"> 
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
 <!--                    <el-col :span="8"> -->
                     <p v-for="(item,index) in details.questionOption"><span>{{item.key}}</span> &nbsp;:&nbsp;<b>{{item.value}}</b>
                     <viewer class="aImg" v-if="item.img">
                      <img
                          :src="getImgUrl(item.img)" 
                          :key="index"
                          @click="clickImg(item.img,index,1)"
                        >
                      </viewer>
                    </p>
                    <!-- <p v-for="item in details.questionOption"><span>{{item.key}}</span> &nbsp;:&nbsp;<b>{{item.value}}</b> &nbsp;&nbsp;<img :src="item.img" v-if="item.img"></p> -->
                  <!-- </el-col> -->
<!--                   <el-col :span="8">
                    <p v-for="(images,index) in details.eqOptionImageNameList1">
                      <img :src="images">
                    </p>
                  </el-col> -->
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
                    <el-button type="primary"  @click="handleSubmitData(details)" >提交</el-button>
                    <el-button @click="fhClick(details.id)">返回</el-button>
                  </el-col>
                </el-row>
            </xzquestion>

            <tkquestion :gapFillingForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" :fileList.sync="fileList" v-if="details.questionType === 'GAP_FILLING'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="15">
                    <el-button type="primary"  @click="handleSubmitData(details)" >提交</el-button>
                    <el-button @click="fhClick(details.id)">返回</el-button>
                  </el-col>
                </el-row>
            </tkquestion>

            <pdquestion :judgeForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="pdquestion" :fileList.sync="fileList" v-if="details.questionType === 'CHECKING'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(details)" >提交</el-button>
                    <el-button @click="fhClick(details.id)">返回</el-button>
                  </el-col>
                </el-row>
            </pdquestion>

            <jdquestion :shortAnswerForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="jdquestion" :fileList.sync="fileList" v-if="details.questionType === 'SHORT_ANSWER'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(details)" >提交</el-button>
                    <el-button @click="fhClick(details.id)">返回</el-button>
                  </el-col>
                </el-row>
            </jdquestion>

            <dxquestion :radioChoiceForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="dxquestion" :fileList.sync="fileList" v-if="details.questionType === 'SINGLE_CHOICE'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(details)" >提交</el-button>
                    <el-button @click="fhClick(details.id)">返回</el-button>
                  </el-col>
                </el-row>
            </dxquestion>

            <lsquestion :discussForm.sync="details" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="lsquestion" :fileList.sync="fileList" v-if="details.questionType === 'EXPOUND'">
                <el-row slot="editQuestionData">
                  <el-col :span="8" :offset="6">
                    <el-button type="primary"  @click="handleSubmitData(details)" >提交</el-button>
                    <el-button @click="fhClick(details.id)">返回</el-button>
                  </el-col>
                </el-row>
            </lsquestion>

            <zhquestion :reorganizeForm.sync="details" :addOrDel="anum" :fileListArr.sync="fileListArr" :propressNum="propressNum" key="zhquestion" :fileList.sync="fileList" v-if="details.questionType === 'COMPREHENSIVE'">
                <el-row slot="editQuestionData">
                    <el-button type="primary"  @click="handleSubmitData(details)" >提交</el-button>
                    <el-button @click="fhClick(details.id)">返回</el-button>
                </el-row>
            </zhquestion>            

            </div>
          </el-col>
        </el-row>

        <!-- 详情底部 -->
        <span slot="footer" class="dialog-footer" v-if="changeQue == 1">
                <el-button type="primary"  @click.prevent="changeQuestion" >修改详情</el-button>
                <!-- <el-button type="warning" @click="deleteQuestion">删除此题</el-button> -->
                <el-button type="info" style="width: 100px" @click="quxiaodialog">取消</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="changeQue == 2">
            <el-button @click="changeQue=1,clickMenu = false,clickMenu1 = false">返回</el-button>
        </span>

   </el-dialog>

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
          <el-button type="primary" @click="graphAddSubmit">确 定</el-button>
        </div>
      </el-dialog>

    <el-dialog title="批量更新" :visible.sync="PLGXVisible">
      <el-form :model="PLGXForm">
        <el-form-item label="能力指标：">
          <el-select v-model="PLGXForm.nlzb"  filterable placeholder="选择能力指标">
            <el-option v-for="(item, index) in initData.question_ability_norm"
              :key="index" :label="item.dictName" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择用途：">
          <el-select v-model="PLGXForm.xzyt"  filterable placeholder="选择用途">
            <el-option v-for="(item, index) in initData.simulate_or_official"
              :key="index" :label="item.dictName" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="试题难度：">
          <el-select v-model="PLGXForm.stnd" placeholder="请选择试题难度">
            <el-option
              v-for="item in initData.question_difficulty"
              :key="item.value"
              :label="item.dictName" 
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="PLGXqx">取 消</el-button>
        <el-button type="primary" @click="PLGXSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加试题组件 -->
    <createquestion v-if="testShow == true"></createquestion>
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
import Utils4 from '@/components/treeTable/utils4/index.js'
import Utils3 from '@/components/treeTable/utils3/index.js'
import createquestion from '@/components/zj_questionMaintenance/createquestion.vue'
export default {
  props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
  },
  data(){
      return {
        uploadTC: false,
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
        // initData:{},
        options1:[],
        // 关系图数组
        webkitDep:[],
        webkitDep1:[],
        links:[],
        modifyTitleDiff: '变更',
        modifyTitlePath: '变更',
        modifyTitleType: '变更',
        FLlist: {},
        // 题干查询
        nameSearchVal: '',
        anum: 'as',
        // 高级查询
        gjSearch: {
          questionBody: '',
          knowPoints: null,
          knowlx: '',
          knowny: '',
          knowzb: '',
          knowyt: '',
          knowfs: '',
          createTime: null,
          username: ''
        },
        ZSDprops:{
          value:'name',
          label:'name',
          children:'knowledgePoints',
        },
        ZSDprops1:{
          value:'id',
          label:'name',
          children:'knowledgePoints',
        },
        // 高级查询显示隐藏
        visible2: false,
        TJST: '添加试题',
        STCC: '试题查重',
		    PLGX: '批量更新',
		    PLSC: '批量删除',
		    GJCX: '高级查询',
        DCWD: '导出Word',
        DCEL: '导出Excel',
        listLoading: false,
        dialogVisible: false,
        // 表格内容
        columns: [
          {
            text: '题目内容',
            dataIndex: 'questionBody'
          },
          {
            text: '知识点',
            dataIndex: 'knowledgePoints'
          },
          {
            text: '试题类型',
            dataIndex: 'questionTypes'
          },
          {
            text: '难易程度',
            dataIndex: 'questionDifficultyName'
          },
          {
            text: '试题用途',
            dataIndex: 'simulateOrOfficialName'
          },
          {
            text: '创建人',
            dataIndex: 'neoUserName'
          },
          {
            text: '创建时间',
            dataIndex: 'createTimes'
          }        
        ],
        // 批量更新
        PLGXForm:{
          nlzb:'',
          xzyt:'',
          xzytboo:'',
          stnd:''
        },
        //  附件数据集合
        fileListArr: [],
        //  进度条
        propressNum: 0,
        ZSDdata: [],
        initData:{},
        dataSource: [],
        // 总条数
        total: 0,
        pageNum: 1,
        pageSize: 5,
        checkAll: {},
        PLSCArr:[],
        // 修改后数据
        originalData: {},
        // 知识点详情数据
        details: {},
        // 试题难度
        questionDifficulty: [],
        subjectsTree: [],
        // 用途
        useType: [],
        // 题型
        tsetingType: [],
        //      接收查询数据
        //      录入方式
        InputType: [],
        //      知识点
        subjectsPaths: [],
        // 当前实体知识点
        subjectsPathse: [],
        fileList:[],
        xuekeChangItems:[],
        uploadUrl: ''
      }     
  },
  computed: {
    // 格式化数据源
      data: function () {
        for(var i = 0;i < this.dataSource.length;i++) {
          for(var j=0;j<this.dataSource[i].knowledgePoints.length;j++){
            this.dataSource[i].knowledgePoints[j] = this.dataSource[i].knowledgePoints[j].name

          }
          this.dataSource[i].knowledgePoints = this.dataSource[i].knowledgePoints.join(", ")
        }
        // this.dataSource = Utils.MSDataTransfer.treeToArray(this.dataSource)
        
        return this.dataSource
      }
  },
  components: {
    createquestion,
    xzquestion,
    tkquestion,
    pdquestion,
    jdquestion,
    zhquestion,
    dxquestion,
    lsquestion
  },
  created(){

  },
  mounted(){
    this.questionTable()
    // this.$axiosGet(this.$axiosURL.b_dictionarys,{}).then((res)=>{
    //   this.$store.state.dictionarys = res;
    //   this.initData = this.$store.state.dictionarys
    //   console.log(1,this.initData)
    // })
    this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
      this.ZSDdata = this.getTreeData(res);

    })
    this.$axiosGet(this.$axiosURL.b_dictionarys,{}).then((res)=>{
            this.$store.state.dictionarys = res;
            this.initData = this.$store.state.dictionarys
    })

    this.$bus.$on('onclick',()=>{
          this.nameSearch()
    })
    
    this.$bus.$on('shuaxin',()=>{
      this.nameSearch()
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
    clickSTCC:function(){
      this.$axiosRes('delete',this.$axiosURL.k_examinationQuestion+ 'delete/replicatedQuestions',{}).then((res)=>{
        this.questionTable()
      })
    },
      graphAdd(){
          // this.dataIndex = null
          // this.xuekeId = null
          this.clickMenu = false
          this.graphEditDel1 = true
          this.garphAddShow1 = true

          if(this.xuekeId) {
            // this.dataIndex = null
            // this.xuekeId = null
            // this.clickMenu = false
            // 点击添加学科数据展示
            this.$axiosRes('get',this.$axiosURL.k_knowledgeHierachy+ '0/find/'+ this.graphID +'/theOtherAll').then((res)=>{
              this.options1 = res
              Utils4.MSDataTransfer.treeToArray(this.options1,this.webkitDep[0])
            })
          } else {
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
      graphEdit1(){
        this.dataIndex = null
        this.xuekeId = null
        this.form.isp2 = []
        this.xuekeChangItems = []
        this.graphEditDel1 = false
        this.garphAddShow1 = false
      },
      graphAddSubmit(){
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
          })  
        }
      },
      ispChange(values, items) {
        this.xuekeChangItems = items
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
                arrs.push(this.webkitDep1[i].id)
              }
              var params ={
                minorKHIds: arrs,
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

              }
              // 右键禁用
              document.getElementsByClassName('J_chartFocusBox')[i].oncontextmenu = function() {
                return false;
              }
              this.$echarts.init(document.getElementsByClassName('J_chartFocusBox')[i]).on('contextmenu', rightBT)
          }
      },
      // graph配置
    // 显示行
      showTr: function (row, index) {
        let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
        row.row._show = show
        return show ? '' : 'display:none;'
      },
    // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
    // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
    // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (me.treeStructure && index === 0 && record.sonsssss && record.sonsssss.length > 0) {
          return true
        }
        return false
      },
      // 时间转换
      timestampToTime(timestamp){
        var date = new Date(timestamp)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
        var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return Y + M + D + h + m + s
      },
      questionTable(){
        if (this.gjSearch.knowPoints && this.gjSearch.knowPoints.length > 0){
          var points = this.gjSearch.knowPoints[this.gjSearch.knowPoints.length - 1]
        } else {
          var points = ''
        }
        // if(this.gjSearch.knowyt == '正式考试') {
        //   var ayt = true
        // } else if(this.gjSearch.knowyt == '模拟训练') {
        //   var ayt = false
        // } else {
        //   var ayt = ''
        // }
        if(this.gjSearch.createTime!==null) {
          var startTime = this.gjSearch.createTime[0]
          var endTime = this.gjSearch.createTime[1]
        }
        var params = {
          pageNum: this.pageNum,
          itemSize: this.pageSize,
          conditions:{
            bodyKey: this.nameSearchVal,
            kpName: points,
            questionType: this.gjSearch.knowlx,
            questionDifficulty: this.gjSearch.knowny,
            questionAbilityNorm: this.gjSearch.knowzb,
            simulateOrOfficial: this.gjSearch.knowyt,
            questionImportWay: this.gjSearch.knowfs,
            userName: this.gjSearch.username,
            startTime: startTime,
            endTime: endTime
          }
        }
        this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'find/1/advancedQuery/pageable/0',params).then((res)=>{

          for (var i = 0; i < res.entities.length; i++) {
            if(res.entities[i].simulateOrOfficial == false) {
              res.entities[i].simulateOrOfficialName = '模拟训练'
            } else if(res.entities[i].simulateOrOfficial == true){
              res.entities[i].simulateOrOfficialName = '正式考试'
            }
            // 难度转换
            var obj ={}
            obj = this.$store.state.dictionarys.question_difficulty.find((item)=>{
              return item.value == res.entities[i].questionDifficulty
            })
            res.entities[i].questionDifficultyName = obj.dictName

            // 类型转换
            var obj1 ={}
            obj1 = this.$store.state.dictionarys.question_type.find((item)=>{
              return item.value == res.entities[i].questionType
            })
            res.entities[i].questionTypes = obj1.dictName


            res.entities[i].createTimes = this.timestampToTime(res.entities[i].createTime) 

          }

            this.dataSource = res.entities
            this.total = res.total
            })
      },
      // 每页条数
      handleSizeChange(val) {
          this.pageSize = val
          this.questionTable()
      },
      // 当前页
      handleCurrentChange(val) {
          this.pageNum = val
          this.questionTable()
      },
      quxiaodialog(){
        this.dialogVisible = false
        this.questionTable()
      },
      // 上传附件
      uploadFile(id){
        this.uploadTC = true
        this.uploadUrl = this.$axiosURL.fm_fileManipulate + '/bash/upload/accessory/for/' + id + '/' + this.$store.state.aId
        this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ 'get/accessories/of/' + id).then((res)=>{
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
        })
      },
      handlePreview(file) {
      },
      handleAvatarSuccess(res, file){
      },
      beforeRemove(file, fileList) {
        // return;
      },
      beforeUpload(file){
        var isLoad = true
        if(this.fileList.length){
          for (var i = 0; i < this.fileList.length; i++) {
            if(this.fileList[i].name == file.name){
              this.$message({
                showClose: true,
                message: '警告,不能上传相同文件。',
                type: 'warning'
              })
              isLoad = false
              break
            }
          }
        }
        return isLoad
        // .jpg,.jpeg,.png,.mp4,.mp3,.bmp,.gif,.svg,.wma,.flv
        // const extension = file.name.split('.')[1] === 'jpg'
        // const extension1 = file.name.split('.')[1] === 'jpeg'
        // const extension2 = file.name.split('.')[1] === 'png'
        // const extension3 = file.name.split('.')[1] === 'mp4'
        // const extension4 = file.name.split('.')[1] === 'mp3'
        // const extension5 = file.name.split('.')[1] === 'bmp'
        // const extension6 = file.name.split('.')[1] === 'gif'
        // const extension7 = file.name.split('.')[1] === 'svg'
        // const extension8 = file.name.split('.')[1] === 'wma'
        // const extension9 = file.name.split('.')[1] === 'flv'
        // if(!extension && !extension1 && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8 && !extension9) {
        //   this.$message({
        //     message: '请上传xls、xlsx格式文件',
        //     type: 'error'
        //   })
        //   return extension || extension1 || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8 || extension9
        // }
      },
      headChange(file, fileList) {

      },
      fhClick(id){
        this.STEdit(id)
        this.changeQue = 1
      },
      // 试题详情
      STEdit(id){
        this.dialogVisible = true;
        this.webkitDep1 = []
        this.webkitDep = []
        this.links = []
        this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ '1/find/' + id).then((res)=>{
          this.details = res
          if(this.details.eqBodyImageNameList){
            this.details.eqBodyImageNameList1 = this.details.eqBodyImageNameList
            for (var i = 0; i < this.details.eqBodyImageNameList1.length; i++) {
              this.details.eqBodyImageNameList1[i] =  this.details.eqBodyImageNameList1[i]
            }

          }
          if(this.details.eqOptionImageNameList){
            //this.details.eqBodyImageNameList1 =  this.details.eqBodyImageNameList
            this.details.eqOptionImageNameList1 = this.details.eqOptionImageNameList
            for (var i = 0; i < this.details.eqOptionImageNameList1.length; i++) {
              this.details.eqOptionImageNameList1[i] =  this.details.eqOptionImageNameList1[i]
            }
          }

          // 详情页面数据转换
          // 试题用途
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
            // this.subjectsPathse = res
            if(res.minorKnowledgePoints !== null) {
              // 知识点次要
              var obj1 = {}
              obj1.name = this.details.questionBody
              obj1.id = this.details.id
              obj1.category = 1
              this.webkitDep1 = res.minorKnowledgePoints
              this.webkitDep1.unshift(obj1)
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
            //var questionOptions = this.details.questionOption.split(";")
            this.details['questionOptions'] = this.details.questionOption
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

        })
      },
      // dialog 关闭
      XQhandleClose (done) {
        this.$confirm('确认关闭？').then(_ => {
          this.changeQue = 1
          this.clickMenu = false
          this.clickMenu1 = false
          this.questionTable()
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
      // 试题删除
      STDelete(id){

        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            // 试题删除  重新获取数据
            this.$axiosRes('delete',this.$axiosURL.k_examinationQuestion + id ).then((res)=>{
                this.questionTable()
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

      // 题干查询
      nameSearch(){
        if(this.testShow == true) {
          this.testShow = false
          this.tableShow = true
        }
        this.pageNum = 1
        this.questionTable()

      },
      // 高级查询表单重置
      resetForm() {
          var obj = {}
          obj.stopPropagation = () =>{}
          this.$refs.cascader2.clearValue(obj)
          this.gjSearch.knowPoints = []
          this.gjSearch.knowlx = ''
          this.gjSearch.knowny = ''  
          this.gjSearch.knowfs = ''
          this.gjSearch.knowyt = ''
          this.gjSearch.createTime = '' 
          this.gjSearch.username = ''
          this.gjSearch.knowzb = ''
          this.nameSearchVal = ''

      },
      // 批量选择操作
      handleSelectionChange(val){
        this.checkAll = val
      },
      // 批量更新
      PLGXTest(){
          this.PLSCArr = []
          if(Object.keys(this.checkAll).length)
            this.checkAll.forEach( (element,index)=> {
              this.PLSCArr.push(element.id)
          })
          if(this.PLSCArr.length == 0){
            this.$message({
              message: '请选择要更新的试题',
              type: 'error'
            }) 
            return
          } else {
            this.PLGXVisible = true
          }
      },
      PLGXqx(){
          this.PLGXVisible = false
          this.PLGXForm = {
            stnd: '',
            nlzb: '',
            xzyt: '',
            xzytboo: ''
          }
      },
      PLGXSubmit(){
        // if(this.PLGXForm.xzyt !== '') {
        //   if(this.PLGXForm.xzyt == '模拟考试'){
        //       this.PLGXForm.xzytboo = false
        //   } else {
        //     this.PLGXForm.xzytboo = true
        //   }
        // } else {
        //   this.PLGXForm.xzytboo = ''
        // }
        var params = {
          eqIds: this.PLSCArr,
          questionDifficulty: this.PLGXForm.stnd,
          questionAbilityNorm: this.PLGXForm.nlzb,
          simulateOrOfficial: this.PLGXForm.xzyt
        }
        this.$axiosResBody1('put',this.$axiosURL.k_examinationQuestion+ 'bash/update/commonField',params).then((res)=>{
          this.PLGXVisible = false
          this.PLGXForm = {
            stnd: '',
            nlzb: '',
            xzyt: '',
            xzytboo: ''
          }
          this.questionTable()
        })
      },
      // 批量删除
      PLSCTest() {
        if(Object.keys(this.checkAll).length)
          this.checkAll.forEach( (element,index)=> {
            this.PLSCArr.push(element.id)
        })
        if(this.PLSCArr.length == 0){
          this.$message({
            message: '请选择要删除的试题',
            type: 'error'
          }) 
          return
        } 
        this.$confirm('此操作将永久删除文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            // s试题删除  重新获取数据
          this.PLSCArr = []
          if(Object.keys(this.checkAll).length)
            this.checkAll.forEach( (element,index)=> {
              var obj ={
                id: element.id
              }
              this.PLSCArr.push(obj)
          })
          if(this.PLSCArr.length > 0) {
            this.$axiosResBody1('delete',this.$axiosURL.k_examinationQuestion + 'all/entities', this.PLSCArr).then((res)=>{
                this.questionTable()
            })
          } else {
              this.$message({
                message: '请选择要删除的试题',
                type: 'error'
              })  
          }
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

      DCWDTest() {
        this.PLSCArr = []
        if(Object.keys(this.checkAll).length)
          this.checkAll.forEach( (element,index)=> {
            this.PLSCArr.push(element.id)
        })
        if(this.PLSCArr.length == 0){
          this.$message({
            message: '请选择要导出的试题',
            type: 'error'
          }) 
          return
        } 
          // if(this.gjSearch.knowyt == '正式考试') {
          //   var ayt1 = true
          // } else if(this.gjSearch.knowyt == '模拟考试') {
          //   var ayt1 = false
          // } else {
          //   var ayt1 = ''
          // }
          var params = {
              eqIds: this.PLSCArr,
              wordOrExcel: true,
              questionDifficulty: this.gjSearch.knowny,
              questionAbilityNorm: this.gjSearch.knowzb,
              simulateOrOfficial: this.gjSearch.knowyt

          }
          this.$axiosResBody1('post',this.$axiosURL.fm_fileManipulate+ '/download/bashExport/wordOrExcel',params).then((res)=>{
              window.location.href = res.requestFullPathAndFileName
               // $.ajax({
               //  url: res.requestFullPathAndFileName,
               //  type: 'get',
               //  data: {'fileName': 'word.docx'},
               //  headers: {"Authorization": 'Bearer '+ sessionStorage.getItem('access_token')},
               //  success: function(data){
               //    console.log(data,333)
               //    $.download()
               //  }
               // })
               // var url = res.requestFullPathAndFileName
               // var fileName = "word.docx"
               // var form = $("<form></form>").attr("action",url).attr("method","get")
               // form.append($("<input></input>").attr("name","fileName").attr("value",fileName))
               // form.appendTo('body').submit().remove()
            //  this.$axiosDownload(res.requestFullPathAndFileName,{}).then((res)=>{
            //     if (!res) {
            //       return
            //     }
            //     let url = window.URL.createObjectURL(new Blob([res]))
            //     let link = document.createElement('a')
            //     link.style.display = 'none'
            //     link.href = url 
            //     link.setAttribute('download', 'word.docx')
            //     document.body.appendChild(link)
            //     link.click()
            //     document.body.removeChild(link)
            //     window.URL.revokeObjectURL(url)
            // })
          })
      },
      // 导出Excel
      DCELTest(){
        this.PLSCArr = []
        if(Object.keys(this.checkAll).length)
          for (var i = 0; i < this.checkAll.length; i++) {
            if(this.checkAll[i].questionType =='COMPREHENSIVE') {
              this.$message({
                message: 'Excel不能导出综合题',
                type: 'error'
              }) 
              return
            }
        }
        if(Object.keys(this.checkAll).length)
          this.checkAll.forEach( (element,index)=> {
            this.PLSCArr.push(element.id)
        })
        if(this.PLSCArr.length == 0){
          this.$message({
            message: '请选择要导出的试题',
            type: 'error'
          }) 
          return
        } 
        var params = {
            eqIds: this.PLSCArr,
            wordOrExcel: false,

        }
        this.$axiosResBody1('post',this.$axiosURL.fm_fileManipulate+ '/download/bashExport/wordOrExcel',params).then((res)=>{
             window.location.href = res.requestFullPathAndFileName
            //  this.$axiosDownload(res.requestFullPathAndFileName,{}).then((res)=>{
            //     if (!res) {
            //       return
            //     }
            //     let url = window.URL.createObjectURL(new Blob([res]))
            //     let link = document.createElement('a')
            //     link.style.display = 'none'
            //     link.href = url 
            //     link.setAttribute('download', 'excel.xlsx')
            //     document.body.appendChild(link)
            //     link.click()
            //     document.body.removeChild(link)
            //     window.URL.revokeObjectURL(url)
            // })
        })

      },
      // 添加试题点击
      addQuestion(){
        this.tableShow = false
        this.testShow = true
      },
      // 根据所需要的条件传值 修改详情
      handleSubmitData (formName) {
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
              console.log(formName.questionOption[i])
              if(formName.questionOption[i].value === '' && !formName.questionOption[i].img) {
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
          formName.questionOption = array
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
        this.$axiosResBody1('put',this.$axiosURL.k_examinationQuestion+ 'update',params).then((res)=>{
          this.questionTable()
        })
      },

      handleSubmitDataOne(formName){
          // if(formName.exam_modality =='模拟考试'){
          //   formName.simulateOrOfficial = false
          // } else {
          //   formName.simulateOrOfficial = true
          // }
          formName.questionDifficulty = formName.questionsDifficultyId
          var params = []
          params.push(formName)
          var aupdateTime = Date.parse(new Date())
          formName['updateTime'] = aupdateTime
          formName['updateUserID'] = this.$store.state.aId
          this.$axiosResBody1('put',this.$axiosURL.k_examinationQuestion+ 'update',params).then((res)=>{
            this.questionTable()
          })
      },

      //     详情页修改
      modify (val,id) {
        if (val === 'Type') {
          if (this.changeControlType) {
            this.changeControlType = false
            this.modifyTitleType = '保存'
          } else {
            this.originalData['exam_modality'] = this.details.simulateOrOfficial
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

            this.$axiosResBody1('put',this.$axiosURL.k_examinationQuestion + 'update/major',params).then((res)=>{

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
<style scoped>
/*  .el-row {
    margin-bottom: 10px;
  }*/
  .el-tag {
    background-color: transparent;
    border: none;
  }
  .el-dialog__body {
      padding: 30px 60px 30px 20px;
  }
  .chart-box {
      height: 500px;
  }
  #menu {
      position: fixed;
      left: 0;
      top: 0;
      /*display: none*/
  }
</style>