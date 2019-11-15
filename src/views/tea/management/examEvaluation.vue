  <template>
  <div class="teatable chartscroll">
  <el-row type="flex" style="margin-top: 20px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="formInline.SJMC" placeholder="试卷名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.KSLX" placeholder="考试类型">
           <el-option v-for = 'item in this.$store.state.dictionarys.exam_type'
              :label="item.dictName"
              :value="item.value"
              :key='item.id'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.ZJFS" placeholder="组卷方式">
            <el-option v-for = 'item in this.$store.state.dictionarys.paper_gen_method'
              :label="item.dictName"
              :value="item.value"
              :key='item.id'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.KSXS" placeholder="考试形式">
            <el-option v-for = 'item in this.$store.state.dictionarys.exam_modality'
              :key='item.id'
              :label="item.dictName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜 索</el-button>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogVisibleXSXSZ = true">显示项设置</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
        :data="tableData"
        border
        style="width: 100%"
        max-height="490"
        size='mini'>
        <el-table-column
          prop="id"
          type="selection"
          width="50"> 
        </el-table-column>
        <el-table-column prop="examName" label="考试名称" :key="Math.random()" v-if='columnIsShow(1)'>
        </el-table-column>
        <el-table-column  prop="address"  label="考场地址" :key="Math.random()" v-if='columnIsShow(2)'>
        </el-table-column>
        <el-table-column prop="totalTime" label="考试时长" :key="Math.random()" v-if='columnIsShow(3)'>

        </el-table-column>
        <el-table-column  prop="pdgz"  label="评定规则" :key="Math.random()" v-if='columnIsShow(4)'>
        </el-table-column>
        <el-table-column  prop="startTime"  label="开考时间" :key="Math.random()" v-if='columnIsShow(5)'>
        </el-table-column>
        <el-table-column  prop="endTime"  label="结束时间" :key="Math.random()" v-if='columnIsShow(6)'>
        </el-table-column>
        <el-table-column  prop="stuNum"  label="应考人数" :key="Math.random()" v-if='columnIsShow(7)'>
        </el-table-column>
        <el-table-column  prop="examModality"  label="考试形式" :key="Math.random()" v-if='columnIsShow(8)'>
        </el-table-column>
        <el-table-column  prop="examType"  label="考试类型" :key="Math.random()" v-if='columnIsShow(9)'>
        </el-table-column>
        <el-table-column  prop="examQuesWay"  label="确定试题考试、随机试题考试" :key="Math.random()" v-if='columnIsShow(10)'>
        </el-table-column>
        <el-table-column  prop="bz"  label="备注" :key="Math.random()" v-if='columnIsShow(11)'>
        </el-table-column>
        <el-table-column label="操作" width="150" :key="Math.random()" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.examQuesWay=='随机试题考试'"
              @click="clickXQ(scope.$index, scope.row)">详情
            </el-button>
          </template>
        </el-table-column>
    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>


  <el-dialog
      title="显示项设置"
      :visible.sync="dialogVisibleXSXSZ"
      width="560px">
         <el-transfer
          v-model="XSXSZdata1"
          :titles="['隐藏项', '显示项']"
          :props="{
            key: 'key',
            label: 'desc'
          }"
          :data="XSXSZdata">
        </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleXSXSZ = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="考试详情"
      :visible.sync="dialogVisible"
      width="80%"
      top = "20px">
      <div style="height: 760px">
        <el-row >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{STXQ.examName}}</span>
            </div>
            <el-row>
              <el-col :span="8">
                考试类型：{{STXQ.examName}}
              </el-col>
              <el-col :span="8">
                组卷方式：{{STXQ.zjfs}}
              </el-col>
              <el-col :span="8">
                考试形式：{{STXQ.examModality}}
              </el-col>
              <el-col :span="8">
                答题时长：{{STXQ.totalTime}}分钟
              </el-col>
<!--               <el-col :span="8">
                参考部门：{{STXQ.CKBM}}
              </el-col> -->
              <el-col :span="8">
                平均答题时长：{{STXQ.pjsc}}分钟
              </el-col>
              <el-col :span="8">
               考试时间：{{STXQ.startTime}}
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>分析图表</span>
              </div>
              <div style="height: 500px;">
                <el-tabs type="border-card" v-model='activeName' @tab-click='changeCharts'>
                  <el-tab-pane lazy>
                    <el-row style="float: right;z-index: 9999999">
                      <el-button type="primary" size="mini" @click.native='KSTJqiehuan'>{{msg}}</el-button>
                    </el-row>
                    <span slot="label"><i class="el-icon-date"></i> 考生统计</span>
                      <!-- 图表 -->
                      <el-row :gutter="24" v-show='KSTJtable'>
                        <el-col :span="24">
                            <el-card>
                              <div class="chart-box" ref='zxcharts'></div>
                            </el-card>
                        </el-col>
                      </el-row>

                      <!-- 表单 -->
                      <el-row :gutter="24" v-show='KSTJtable == false'>
                        <el-col :span="24">
                          <el-table
                              :data="KSTJDate"
                              border
                              style="width: 100%;margin-top: 20px"
                              max-height="490"
                              size='mini'>
                              </el-table-column>
                              <el-table-column prop="userName" label="姓名" >
                              </el-table-column>
                              <el-table-column prop="deptName" label="部门" >
                              </el-table-column>
                              <el-table-column prop="totalScore" label="分值" >
                              </el-table-column>
                              <el-table-column prop="duration1" label="时长(分钟)" >
                              </el-table-column>
                              <el-table-column prop="gainScore" label="成绩" >
                              </el-table-column>
                               <el-table-column prop="pdjg" label="得分/等级/过关" width="130">
                                <template slot-scope="scope">
                  {{scope.row.examType=='水平考试'?'第'+scope.row.pdjg+'名':scope.row.examType=='等级考试'?'第'+scope.row.pdjg+'级':scope.row.pdjg}}
                                </template>
                              </el-table-column>
                              <el-table-column prop="KSMaxScore" label="最高分" >
                              </el-table-column>
                               <el-table-column prop="KSMinScore" label="最低分" >
                              </el-table-column>
                               <el-table-column prop="KSAvgScore" label="平均分" >
                              </el-table-column>
                          </el-table>
                          <el-pagination
                              @size-change="KSTJhandleSizeChange"
                              @current-change="KSTJhandleCurrentChange"
                              :current-page="KSTJpageNum"
                              :page-sizes="[5, 10, 20]"
                              :page-size="KSTJpageSize"
                              layout="total, sizes, prev, pager, next, jumper"
                              :total="KSTJtotal">
                          </el-pagination>
                        </el-col>
                      </el-row>

                  </el-tab-pane>
                  <el-tab-pane>
                    <span slot="label"><i class="el-icon-date"></i> 知识点分析</span>
                    <el-row :gutter="24">
                        <el-col :span="24">
                            <el-card>
                              <div class="chart-box" ref='piecharts'></div>
                            </el-card>
                        </el-col>
                    </el-row>

                   <el-row :gutter="24">
                     <el-col :span="24">
                         <el-card>
                           <div class="chart-box" ref='barcharts'></div>
                         </el-card>
                     </el-col>
                   </el-row>

                  </el-tab-pane>
                  <el-tab-pane>
                    <span slot="label"><i class="el-icon-date"></i> 分数段统计</span>

                      <el-row :gutter="24">
                        <el-col :span="24">
                            <el-card>
                              <div class="chart-box" ref='fsdcharts'></div>
                            </el-card>
                        </el-col>
                      </el-row>
                  </el-tab-pane>
                  <el-tab-pane>
                    <span slot="label"><i class="el-icon-date"></i> 参考率统计</span>
                      <el-row :gutter="24">
                        <el-col :span="24">
                            <el-card>
                              <div class="chart-box" ref='cklcharts'></div>
                            </el-card>
                        </el-col>
                      </el-row>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>分析列表</span>
              </div>
              <div style="height: 500px;">
                <el-tabs type="border-card">
                  <el-tab-pane>
                    <span slot="label"><i class="el-icon-date"></i> 试题分析</span>
                    <div style="height: 430px">
                      <el-form :inline="true" :model="formSTFX" size="mini">
                        <el-row>
                          <el-col :span='6'>
                            <el-form-item>
                              <el-cascader
                                placeholder="知识点,可搜索"
                                v-model="STFXPoints"
                                :options="ZSDdata"
                                :props="ZSDprops"
                                :show-all-levels="false"
                                filterable
                                change-on-select
                                ref='cascader2'
                                ></el-cascader>
                            </el-form-item>
                          </el-col>
                          <el-col :span='6'>
                            <el-form-item>
                              <el-select v-model="formSTFX.TX" placeholder="题型">
                                <el-option v-for = 'item in this.$store.state.dictionarys.question_type'
                                  :key='item.id'
                                  :label="item.dictName"
                                  :value="item.value"
                                ></el-option>
                              </el-select>
                            </el-form-item> 
                          </el-col>
                          <el-col :span='6'>
                            <el-form-item>
                              <el-select v-model="formSTFX.STND" placeholder="试题难度">
                                <el-option v-for = 'item in this.$store.state.dictionarys.question_difficulty'
                                  :label="item.dictName"
                                  :value="item.value"
                                  :key='item.id'
                                ></el-option>
                              </el-select>
                            </el-form-item> 
                          </el-col>
                          <el-col :span='3'>
                            <el-button type="success" size="mini" @click="stfxTable">检索</el-button>
                          </el-col>
<!--                           <el-col :span='3'>
                            <el-button type="info" size="mini" @click="">详情导出</el-button>
                          </el-col> -->
                        </el-row>
                        </el-form>
                        <el-table
                          :data="STFXtableData"
                          border
                          style="width: 100%"
                          max-height="490"
                          :show-overflow-tooltip="true"
                          size='mini'>
                          </el-table-column>
                          <el-table-column prop="questionTypes" label="题型" >
                          </el-table-column>
                          <el-table-column prop="queId" label="题号" >
                          </el-table-column>
                          <el-table-column prop="questionBody" label="试题内容" :show-overflow-tooltip="true">
                          </el-table-column>
                          <el-table-column prop="answerCount" label="答题人次" >
                          </el-table-column>
                          <el-table-column prop="rightCount" label="正确人次" >
                          </el-table-column>
                          <el-table-column prop="rightRatio" label="正确率" >
                          </el-table-column>
                      </el-table>
                      <el-pagination
                          @size-change="STFXhandleSizeChange"
                          @current-change="STFXhandleCurrentChange"
                          :current-page="STFXpageNum"
                          :page-sizes="[5, 10, 20]"
                          :page-size="STFXpageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="STFXtotal">
                      </el-pagination>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane>
                    <span slot="label"><i class="el-icon-date"></i> 参与部门分析</span>
                    <div style="height: 430px">
                      <el-row style="text-align: right;">
                         <!-- <el-button type="info" size="mini" @click="">详情导出</el-button> -->
                      </el-row>
                        <el-table
                          :data="bmtjList"
                          border
                          style="width: 100%;margin-top: 20px"
                          max-height="490"
                          :show-overflow-tooltip="true"
                          size='mini'>
                          </el-table-column>
                          <el-table-column prop="deptName" label="部门" >
                          </el-table-column>
                          <el-table-column prop="shouldCount" label="应考人数" >
                          </el-table-column>
                          <el-table-column prop="stuNum" label="实考人数" >
                          </el-table-column>
                          <el-table-column prop="CKL" label="参考率" >
                          </el-table-column>
                          <el-table-column prop="DJ" label="等级" v-if="this.STXQ.examType == '等级考试'">
                          </el-table-column>
                          <el-table-column prop="TGL" label="通过率" v-if="this.STXQ.examType == '过关考试'">
                          </el-table-column>
<!--                           <el-table-column prop="TGL" label="等级" >
                          </el-table-column> -->
                          <el-table-column prop="maxScore" label="最高分" >
                          </el-table-column>
                           <el-table-column prop="minScore" label="最低分" >
                          </el-table-column>
                           <el-table-column prop="PJF" label="平均分" >
                          </el-table-column>
                           <el-table-column prop="sumDuration1" label="平均时长（分钟）" >
                          </el-table-column>
                      </el-table>
                        
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data(){
      return {
        KSTJtable:true,
        STXQ:{},
        Allname:[],
        gainScore:[],
        KSTimes:[],
        formInline: {
          SJMC: '',
          KSLX: '',
          ZJFS: '',
          KSXS: '',
        },
        activeName: '',
        formSTFX:{
          ZSD:null,
          TX:'',
          STND:''
        },
        msg:'图表切换',
        STFXtableData:[{
        }],
        CKBMtableData:[{
        }],
        tableData:[],
        ZSDdata:[],
        STFXPoints:[],
        ZSDprops:{
          value:'id',
          label:'name',
          children:'knowledgePoints',
        },
        XSXSZdata:[{key:1,desc:'考试名称'},{key:2,desc:'考场地址'},{key:3,desc:'考试时长'},{key:4,desc:'评定规则'},{key:5,desc:'开考时间'},{key:6,desc:'结束时间'},{key:7,desc:'应考人数'},{key:8,desc:'考试形式'},{key:9,desc:'考试类型'},{key:10,desc:'确定试题考试、随机试题考试'},{key:11,desc:'备注'}],
        XSXSZdata1:[1,2,3,5,6,7,8,9],
        dialogVisibleXSXSZ:false,
        pageNum:1,  //页码
        pageSize:10,  //每页数量
        total:20,   //总数

        dialogVisible:false,
        KSXXform:{
        },
        KSTJDate:[],
        AllKSTJDate: [],
        STFXpageSize: 5,
        STFXpageNum: 1,
        STFXtotal: 5,
        KSTJpageSize: 5,
        KSTJpageNum: 1,
        KSTJtotal: 5,
        KSMaxScore: null,
        KSMinScore: null,
        KSAvgScore:null,
        sjId:null,
        bmtjList: [],
        BMList: [],
        CKLBMList: [],
        CKLBCKLList: [],
        CKLPJFList: [],
        CKLDTSCList: [],
        CKLJGLList:[],
        CKLTitle:[],
        FSDList:[],
        ZSDFXNameList:[],
        ZSDFXCountList:[],
        ZSDFXList:[],
        ALLZSDList:[],
        ZSDZQLList:[],
        ZSDCWLList:[]
      }     
    },
  methods: {
    STFXhandleSizeChange(val) {
        this.STFXpageSize = val
        this.stfxTable()
    },
    // 当前页
    STFXhandleCurrentChange(val) {
        this.STFXpageNum = val
        this.stfxTable()
    },
    KSTJhandleSizeChange(val) {
        this.KSTJpageSize = val
        this.kstjTable()
    },
    // 当前页
    KSTJhandleCurrentChange(val) {
        this.KSTJpageNum = val
        this.kstjTable()
    },
    KSTJqiehuan(){
      if(this.KSTJtable == true) {
          this.KSTJtable = false
      } else {
          this.KSTJtable = true
      }
    },
    resetForm() {
        this.formInline.SJMC = ''
        this.formInline.KSLX = ''
        this.formInline.ZJFS = ''  
        this.formInline.KSXS = ''
    },
    clickXQ:function(index,row){
      this.bmtjList = []
      this.AllKSTJDate = []
      this.STFXtableData = []
      this.KSTJDate = []
      this.FSDList = []
      this.Allname = []
      this.gainScore = []
      this.KSTimes = []
      this.ZSDFXNameList = []
      this.ZSDFXCountList = []
      this.ZSDFXList = []
      this.ALLZSDList = []
      this.ZSDZQLList = []
      this.ZSDCWLList = []
      this.dialogVisible = true
      this.sjId = row.id
      this.STXQ = row 
      for (var i = 0; i < this.STXQ.papers.length; i++) {
        if(this.STXQ.papers[i].paper.paperType == '普通试卷') {
          this.STXQ.zjfs = this.STXQ.papers[i].paper.paperGenMethod
          this.STXQ.pjsc = Math.round(this.STXQ.papers[i].avgDuration/60000)
          this.KSMaxScore = this.STXQ.papers[i].maxScore
          this.KSMinScore = this.STXQ.papers[i].minScore
          this.KSAvgScore = this.STXQ.papers[i].avgScore
        }
      }

      var params = {
        examId: row.id
      }
      // 考生统计  不传页码 全部数据
      this.$axiosResBody('post',this.$axiosURL.b_stuStatistics,params).then((res)=>{
          this.AllKSTJDate = res.data
          var str = ''
          var str1 = ''
          var str2 = ''
          for (var i = 0; i < this.AllKSTJDate.length; i++) {
            this.AllKSTJDate[i].duration1 =Math.round(this.AllKSTJDate[i].duration/60000)
            this.Allname.push(this.AllKSTJDate[i].userName)
            this.gainScore.push(this.AllKSTJDate[i].gainScore)
            this.KSTimes.push(this.AllKSTJDate[i].duration1)
          }

          // this.Allname = str.slice(0,str.length-1).split(',')
          // this.gainScore = str1.slice(0,str1.length-1).split(',')
          this.$nextTick(function(){
              this.initChartgx()
          })
          this.changeCharts()
      })
      this.kstjTable()
      // 知识点分析
      this.zsdfxTable()
      // 试题分析
      this.stfxTable()
      // 部门统计
      this.$axiosRes1('get',this.$axiosURL.e_examination + 'deptStatisticsByExam',params).then((res)=>{
          // bmtjList
          for(var i in res) {
            res[i].bmId = i
            this.bmtjList.push(res[i])
          }
          // for (var i = 0; i < this.bmtjList.length; i++) {
          //   this.bmtjList[i].sumDuration1 = Math.round(this.bmtjList[i].sumDuration/60000)
          //   this.bmtjList[i].CKL = (this.bmtjList[i].stuNum/this.bmtjList[i].shouldCount*100).toFixed(2) +'%'
          //   this.bmtjList[i].PJF = this.bmtjList[i].sumScore/this.bmtjList[i].stuNum
          //   var obj1 ={}
          //   obj1 = this.BMList.find((item)=>{
          //     return item.id == this.bmtjList[i].deptId
          //   })
          //   this.bmtjList[i].deptName = obj1.name
          // }
          this.bmtjList.forEach(v => {
            for(var key in v){
              if(isNaN(key) == false) {
                v.DJ = '第' + key + '级'
                console.log(key,337)
              }
            }
            v.sumDuration1 = Math.round(v.sumDuration/60000)
            v.CKL = (v.stuNum/v.shouldCount*100).toFixed(2) +'%'
            v.PJF = v.sumScore/v.stuNum
            v.TGL = v.sumPass*100 + '%'
            var obj1 ={}
            obj1 = this.BMList.find((item)=>{
              return item.id == v.bmId
            })
            v.deptName = obj1.name
          })
          this.changeCharts()
      })

      this.changeCharts()
    },
    // 知识点分析
    zsdfxTable(){
      var params = {
        examId: this.sjId
      }
       this.$axiosRes1('get',this.$axiosURL.e_examination + 'pointStatisticsByExam',params).then((res)=>{
        for(var i in res) {
          this.ZSDFXList.push(res[i])
        }
          // this.ZSDFXList = res
      }) 
    },
    // 试题分析列表
    stfxTable(){
      var params = {
        examId: this.sjId,
        pointId: this.STFXPoints[this.STFXPoints.length - 1],
        questionType: this.formSTFX.TX,
        questionDifficulty: this.formSTFX.STND,
        pageSize: this.STFXpageSize,
        pageNum: this.STFXpageNum
      }
      this.$axiosRes1('get',this.$axiosURL.e_examination + 'queStatisticsByExam',params).then((res)=>{
         this.STFXtableData = res.data
         this.STFXtotal = res.total
         this.STFXtableData.forEach(e => {
            var obj1 ={}
            obj1 = this.$store.state.dictionarys.question_type.find((item)=>{
              return item.value == e.questionType
            })
            e.questionTypes = obj1.dictName
         })
      })
    },
    // 考生统计列表
    kstjTable(){
      // this.BMList = []

            // var obj1 ={}
      // obj1 = this.$store.state.dictionarys.question_type.find((item)=>{
      //   return item.value == this.details.questionType
      // })
      // this.details.questionTypes = obj1.dictName
      var params1 = {
        examId: this.sjId,
        pageSize: this.KSTJpageSize,
        pageNum: this.KSTJpageNum
      }
      // 考生统计  传页码 部分数据
      this.$axiosResBody('post',this.$axiosURL.b_stuStatistics,params1).then((res)=>{
          this.KSTJDate = res.data
          for (var i = 0; i < this.KSTJDate.length; i++) {

            var obj1 ={}
            obj1 = this.BMList.find((item)=>{
              return item.id == this.KSTJDate[i].deptId
            })
            this.KSTJDate[i].deptName = obj1.name

            this.KSTJDate[i].duration1 =Math.round(this.KSTJDate[i].duration/60000)
            this.KSTJDate[i].KSMaxScore = this.KSMaxScore
            this.KSTJDate[i].KSMinScore = this.KSMinScore
            this.KSTJDate[i].KSAvgScore = this.KSAvgScore
          }
          // console.log(this.KSTJDate,56565656565)
          this.KSTJtotal = res.total
      })
      this.changeCharts()   
    },
    changeCharts(){
      if(this.activeName == 1) {
        var ALLZSDList = []
        var ZSDFXCountList = []
        var ZSDFXNameList = []
        var ZSDZQLList = []
        var ZSDCWLList = []
        this.ZSDFXList.forEach(v => {
          var obj = {}
          obj.name = v.point.name
          obj.value = v.count
          ALLZSDList.push(obj)
          ZSDFXCountList.push(v.count)
          ZSDFXNameList.push(v.point.name)
          if(v.totalScore == 0){
            var ZSDZQL = 0
          } else {
            var ZSDZQL = (v.gainScore/v.totalScore*100).toFixed(2)
          }
          ZSDZQLList.push(ZSDZQL)
          var ZSDCWL = (100 - ZSDZQL).toFixed(2)
          ZSDCWLList.push(ZSDCWL)
        })
        this.ALLZSDList = ALLZSDList
        this.ZSDFXCountList = ZSDFXCountList
        this.ZSDFXNameList = ZSDFXNameList
        this.ZSDZQLList = ZSDZQLList
        this.ZSDCWLList = ZSDCWLList

        // for(var i in this.zsdFXList) {
        //   console.log(this.zsdFXList[i],777)
        //   // console.log(this.zsdFXList[i].count,777)
        //   this.ZSDFXCountList.push(this.zsdFXList[i].count)
        //   this.ZSDFXNameList.push(this.zsdFXList[i].point.name)
        // }
        this.$nextTick(function(){
            this.initChartpie()
            this.initChartbar()
        })
      }
      if(this.activeName == 3) {
        var CKLBMList = []
        var CKLBCKLList = []
        var CKLPJFList = []
        var CKLDTSCList = []
        var CKLJGLList = []

        for (var i = 0; i < this.bmtjList.length; i++) {
          CKLBMList.push(this.bmtjList[i].deptName)
          CKLBCKLList.push(this.bmtjList[i].CKL.substr(0,this.bmtjList[i].CKL.length-1))
          CKLPJFList.push(this.bmtjList[i].PJF)
          CKLDTSCList.push(this.bmtjList[i].sumDuration1)
          if(this.bmtjList[i].sumPass){
            CKLJGLList.push(this.bmtjList[i].sumPass)
          }
        }
        if(this.STXQ.examType == '过关考试') {
          this.CKLTitle = ['参考率','及格率','平均分','平均答题时长']
          this.CKLJGLList = CKLJGLList

        } else {
          this.CKLTitle = ['参考率','平均分','平均答题时长']
        }
        this.CKLBMList = CKLBMList
        this.CKLBCKLList = CKLBCKLList
        this.CKLPJFList = CKLPJFList
        this.CKLDTSCList = CKLDTSCList
          // CKLBMList:部门
        this.$nextTick(function(){
          this.initChartCKL()
        })
      }
      if(this.activeName == 2) {
        this.FSDList = []
        var first = 0
        var second = 0
        var third = 0
        var fouth = 0
        for (var i = 0; i < this.KSTJDate.length; i++) {
          if(0 <= this.KSTJDate[i].gainScore <= 30) {
            first++
          } else if(31 <= this.KSTJDate[i].gainScore <= 60) {
            second++
          } else if(61 <= this.KSTJDate[i].gainScore <= 90) {
            third++
          } else if(91 <= this.KSTJDate[i].gainScore) {
            fouth++
          }
        }
        this.FSDList.push(first,second,third,fouth)
        this.$nextTick(function(){
          this.initChartFSD()
        })
      }
    },
      handleSizeChange(val) {
        this.pageNum = 1
        this.pageSize = val
        this.findPaperPage()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.findPaperPage()
      },
      columnIsShow:function(num){
        return $.inArray(num,this.XSXSZdata1)<0 ? false : true;
      },
      onSubmit(){
          this.findPaperPage()
      },
      //tableData查询
      findPaperPage:function(){
        var param ={
          examName:this.formInline.SJMC,
          examType:this.formInline.KSLX,
          paperGenMethod:this.formInline.ZJFS,
          examModality:this.formInline.KSXS,
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          rel:true
        }
        this.$axiosRes1('post',this.$axiosURL.e_examination+'findPageByProperty',param).then((res)=>{
            this.tableData = res.data
            this.total = res.total
        })
      },
      initChartgx(){
        this.$echarts.init(this.$refs.zxcharts).showLoading();
        this.$echarts.init(this.$refs.zxcharts).hideLoading();
      
        var option = {
          title: {
              text: '考生统计'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              // 表头 对应  数据name
              data:['分数','考试时间']
          },
          toolbox: {
              show: true,
              feature: {
                  dataZoom: {
                      yAxisIndex: 'none'
                  },
                  magicType: {type: ['line', 'bar','pie']},
                  restore: {},
                  saveAsImage: {}
              }
          },
          dataZoom:[
            {
              // type: 'slider',
              show: true,
              xAxisIndex: [0],
              left:'9%',
              bottom: -5,
              start: 0,
              end: 30
            },
            // {
            //   startValue: '0'
            // },
            // {
            //   type: 'inside'
            // }
          ],
          xAxis:  {
              type: 'category',
              // boundaryGap: false,
              data: this.Allname
          },
          yAxis: [
              {
                name:'分数',
                type: 'value',
                // y轴数据 显示内容
                axisLabel: {
                    // formatter: '{value} °C'
                }
              },
              {
                name:'考试时间（分钟）',
                type: 'value',
                interval: 10,
                min: 0,
                // y轴数据 显示内容
                axisLabel: {
                    // formatter: '{value} °C'
                },
                axisTick:{
                  show: true
                }
                // inverse: true,
                // nameLocation: 'start',
              }
          ],

          // 具体数据
          series: [
              {
                  name:'分数',
                  type:'line',
                  yAxisIndex:0,
                  // 索引对应X轴星期
                  data:this.gainScore,
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'}
                      ]
                  },
                  markLine: {
                      data: [
                          {
                              type: 'average', name: '平均值'}
                      ]
                  }
              },
              {
                  name:'考试时间',
                  type:'line',
                  yAxisIndex:1,
                  data: this.KSTimes,
                  // 关键点
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'},
                          // {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                      ]
                  },
                  markLine: {
                      data: [
                          {
                              type: 'average', name: '平均值'
                          },
                          [
                              {
                                  symbol: 'none',
                                  x: '90%',
                                  yAxis: 'max'
                              }, 
                              {
                                  symbol: 'circle',
                                  label: {
                                      normal: {
                                          position: 'start',
                                          formatter: '最大值'
                                      }
                                  },
                                  type: 'max',
                                  name: '最高点'
                              }
                          ]
                      ]
                  }
              }          
          ]
        };
          this.$echarts.init(this.$refs.zxcharts).setOption(option);
      },
      initChartpie(){
        this.$echarts.init(this.$refs.piecharts).showLoading();
        this.$echarts.init(this.$refs.piecharts).hideLoading();
        var option = {
            title: {
                text: '知识点分析'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data:this.ZSDFXNameList
            },
            series: [
                {
                    name:'知识点题数',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '60%'],
        
                    label: {
                        normal: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                // abg: {
                                //     backgroundColor: '#333',
                                //     width: '100%',
                                //     align: 'right',
                                //     height: 22,
                                //     borderRadius: [4, 4, 0, 0]
                                // },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                    data:this.ALLZSDList
                },
            ]
                    }
        this.$echarts.init(this.$refs.piecharts).setOption(option);
      },
      initChartbar(){
        this.$echarts.init(this.$refs.barcharts).showLoading();
        this.$echarts.init(this.$refs.barcharts).hideLoading();
        var option = {
            title: {
                text: '知识点正确率'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['知识点正确率', '知识点错误率']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            yAxis: {
                type: 'category',
                data: this.ZSDFXNameList
            },
            series: [
                {
                    name: '知识点正确率',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: this.ZSDZQLList
                },
                {
                    name: '知识点错误率',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: this.ZSDCWLList
                }
            ]     
        }
        this.$echarts.init(this.$refs.barcharts).setOption(option);
      },
      initChartCKL(){
        this.$echarts.init(this.$refs.cklcharts).showLoading();
        this.$echarts.init(this.$refs.cklcharts).hideLoading();
      
        var option = {
          title: {
              text: '参考率统计'
          },
          tooltip: {
              trigger: 'axis',
              // formatter: function(params){
              //   // for (var i = 0; i < params.length; i++) {
              //   //   // params[i]
              //   //   console.log(params[i],9999999999)
              //   //   // if(params[i].seriesName == '参考率') {

              //   //   // }
              //   // }
              // }
          },
          legend: {
              // 表头 对应  数据name
              data:this.CKLTitle
          },
          toolbox: {
              show: true,
              feature: {
                  dataZoom: {
                      yAxisIndex: 'none'
                  },
                  magicType: {type: ['bar', 'line','pie']},
                  restore: {},
                  saveAsImage: {}
              }
          },
          xAxis:  {
              type: 'category',
              // boundaryGap: false,
              data: this.CKLBMList
          },
          yAxis: {
              type: 'value',
              // y轴数据 显示内容
              axisLabel: {
                  formatter: '{value} %'
              }
          },
          // 具体数据
          series: [
              {
                  name:'参考率',
                  type:'bar',
                  // 索引对应X轴星期
                  data:this.CKLBCKLList,
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'}
                      ]
                  },
                  itemStyle: {
                    label: {
                      show:true,
                      formatter: '{b}\n\{c}%'
                    }
                  },
                  markLine: {
                      data: [
                          {
                              type: 'average', name: '平均值'}
                      ]
                  }
              },
              {
                  name:'及格率',
                  type:'bar',
                  data: this.CKLJGLList,
                  // 关键点
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'},
                          // {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                      ]
                  },
                  markLine: {
                      data: [
                          {
                              type: 'average', name: '平均值'
                          },
                          [
                              {
                                  symbol: 'none',
                                  x: '90%',
                                  yAxis: 'max'
                              }, 
                              {
                                  symbol: 'circle',
                                  label: {
                                      normal: {
                                          position: 'start',
                                          formatter: '最大值'
                                      }
                                  },
                                  type: 'max',
                                  name: '最高点'
                              }
                          ]
                      ]
                  }
              },
              {
                  name:'平均分',
                  type:'bar',
                  // 索引对应X轴星期
                  data: this.CKLPJFList,
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'}
                      ]
                  },
                  markLine: {
                      data: [
                          {
                              type: 'average', name: '平均值'}
                      ]
                  }
              },
              {
                  name:'平均答题时长',
                  type:'bar',
                  data: this.CKLDTSCList,
                  // 关键点
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'},
                          // {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                      ]
                  },
                  markLine: {
                      data: [
                          {
                              type: 'average', name: '平均值'
                          },
                          [
                              {
                                  symbol: 'none',
                                  x: '90%',
                                  yAxis: 'max'
                              }, 
                              {
                                  symbol: 'circle',
                                  label: {
                                      normal: {
                                          position: 'start',
                                          formatter: '最大值'
                                      }
                                  },
                                  type: 'max',
                                  name: '最高点'
                              }
                          ]
                      ]
                  }
              }                     
          ]
        };
          this.$echarts.init(this.$refs.cklcharts).setOption(option);
      },
      initChartFSD(){
        this.$echarts.init(this.$refs.fsdcharts).showLoading();
        this.$echarts.init(this.$refs.fsdcharts).hideLoading();
      
        var option = {
          title: {
              text: '分数段统计',

          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              // 表头 对应  数据name
              // data:['最高分','最低分']
          },
          toolbox: {
              show: true,
              feature: {
                  dataZoom: {
                      yAxisIndex: 'none'
                  },
                  magicType: {type: ['line', 'bar','pie']},
                  restore: {},
                  saveAsImage: {}
              }
          },
          xAxis:  {
              type: 'category',
              // boundaryGap: false,
              data: ['0~30','31~60','61~90','91~100']
          },
          yAxis: {
              type: 'value',
              // y轴数据 显示内容
              axisLabel: {
                  // formatter: '{value} °C'
              }
          },
          yAxis: [
              {
                name:'人数',
                type: 'value',
                // y轴数据 显示内容
                axisLabel: {
                    // formatter: '{value} °C'
                }
              },
          ],
          // 具体数据
          series: [
              {
                  name:'人数',
                  type:'line',
                  // 索引对应X轴星期
                  data: this.FSDList,
                  markPoint: {
                      data: [
                          {type: 'max', name: '最大值'},
                          {type: 'min', name: '最小值'}
                      ]
                  },
                  markLine: {
                      data: [
                          {
                              type: 'average', name: '平均值'}
                      ]
                  }
              },
              // {
              //     name:'最低分',
              //     type:'line',
              //     data:[12, 12, 42, 55, 73],
              //     // 关键点
              //     markPoint: {
              //         data: [
              //             {type: 'max', name: '最大值'},
              //             {type: 'min', name: '最小值'},
              //             // {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
              //         ]
              //     },
              //     markLine: {
              //         data: [
              //             {
              //                 type: 'average', name: '平均值'
              //             },
              //             [
              //                 {
              //                     symbol: 'none',
              //                     x: '90%',
              //                     yAxis: 'max'
              //                 }, 
              //                 {
              //                     symbol: 'circle',
              //                     label: {
              //                         normal: {
              //                             position: 'start',
              //                             formatter: '最大值'
              //                         }
              //                     },
              //                     type: 'max',
              //                     name: '最高点'
              //                 }
              //             ]
              //         ]
              //     }
              // }          
          ]
        };
          this.$echarts.init(this.$refs.fsdcharts).setOption(option);
      },      
  },
  mounted:function(){
      this.$axiosRes1('get',this.$axiosURL.u_user + 'depts/all').then((res)=>{
          this.BMList = res

      })
    this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
      this.ZSDdata = res;
    })
    this.findPaperPage()
    // this.$nextTick(function(){
    //   console.log(this.$refs.zxcharts)
    //     this.initChartgx()
    //     // this.initChartpie()
    //     // this.initChartbar()
    //     // this.initChartCJZX()
    // })
  }
}
</script>
<style scoped>
    .chart-box {
      min-height: 400px;
      background-color: #fff
    }
</style>