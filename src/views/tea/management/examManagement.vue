<template>
  <div class="teatable">
    <el-row type="flex" style="margin-top: 20px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size='mini'>
        <el-form-item label="考试名称">
          <el-input v-model="formInline.ksName" placeholder="考试名称"></el-input>
        </el-form-item>
        <el-form-item label="考试形式">
          <el-select v-model="formInline.ksxs" placeholder="考试形式">
            <el-option v-for = 'item in this.$store.state.dictionarys.exam_modality'
              :label="item.dictName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试类型">
          <el-select v-model="formInline.kslx" placeholder="考试类型">
            <el-option v-for = 'item in this.$store.state.dictionarys.exam_type'
              :label="item.dictName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试状态">
          <el-select v-model="formInline.kszt" placeholder="考试状态">
             <el-option v-for = 'item in this.$store.state.dictionarys.exam_state'
              :key="item.value"
              :label="item.dictName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row type="flex" style="margin-bottom: 20px">
      <unit_button :msg='XJ' @click.native='clickXJ'></unit_button>
      <unit_button :msg='XSXSZ' @click.native='clickXSXSZ'></unit_button>
      <unit_button :msg='PLCS' @click.native='clickPLSC'></unit_button>   
    </el-row>

    <el-table
        :data="tableData"
        border
        style="width: 100%"
        max-height="490"
        @selection-change="handleSelectionChange"
        size='mini'>
        <el-table-column
          prop="id"
          type="selection"
          :selectable='checkselectable'
          width="50"> 
        </el-table-column>
        <el-table-column prop="examName" label="考试名称" :key="Math.random()" v-if='columnIsShow(1)'>
        </el-table-column>
        <el-table-column  prop="examType"  label="考试类型" :key="Math.random()" v-if='columnIsShow(2)'>
        </el-table-column>
        <el-table-column prop="examState" label="考试状态" :key="Math.random()" v-if='columnIsShow(3)'>
        </el-table-column>
        <el-table-column  prop="examModality"  label="考试形式" :key="Math.random()" v-if='columnIsShow(4)'>
        </el-table-column>
        <el-table-column  label="出题人" :key="Math.random()" v-if='columnIsShow(5)'>
           <template slot-scope="scope">
            {{scope.row.createBy?scope.row.createBy.name:'无'}}
           </template>
        </el-table-column>
        <el-table-column  prop="createTime"  label="出题时间" :key="Math.random()" v-if='columnIsShow(6)'>
        </el-table-column>
        <el-table-column  prop="startTime"  label="开始时间" :key="Math.random()" v-if='columnIsShow(7)'>
        </el-table-column>
        <el-table-column  prop="endTime"  label="结束时间" :key="Math.random()" v-if='columnIsShow(8)'>
        </el-table-column>
        <el-table-column  prop="updateBy"  label="修改人" :key="Math.random()" v-if='columnIsShow(9)'>
        </el-table-column>
        <el-table-column  prop="updateTime"  label="修改时间" :key="Math.random()" v-if='columnIsShow(10)'>
        </el-table-column>
        <el-table-column  prop="totalTime"  label="考试时长" :key="Math.random()" v-if='columnIsShow(11)'></el-table-column>
        <el-table-column label="操作" width="340">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="success"
              icon="edit"
              @click="handleLook(scope.$index, scope.row,true)">详情
            </el-button>
            <el-button
              size="small"
              type="warning"
              icon="edit"
              :disabled="scope.row.examState !='未发布' "
              @click="handleEdit(scope.$index, scope.row,true)">编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              :disabled="scope.row.examState !='未发布' "
              @click="handleRemove(scope.$index, scope.row)">删除
            </el-button>
            <el-button
              size="small"
              type="default"
              v-if="scope.row.examState =='备考阶段' "
              @click="wordDownload(scope.$index, scope.row)">
              打印准考证
            </el-button>
            <el-button
              size="small"
              type="default"
              v-if="scope.row.examState =='结束' "
              @click="downSJ(scope.row)">
              导出学生试卷
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
      title="详情查看"
      :visible.sync="dialogVisibleXQ"
      top = "40px"
      width="1000px">
         <el-row >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>基本信息</span>
            </div>
            <div style="height: 150px">
                <el-form label-position="right" label-width="80px" disabled size='mini' :model="formXQ">
                  <el-row :gutter="20">
                    <el-col :span='8'>
                      <el-form-item label="考试名称">
                        <el-input v-model="formXQ.KSMC" ></el-input>
                      </el-form-item>
                      <el-form-item label="考试类型">
                        <el-input v-model="formXQ.KSLX"></el-input>
                      </el-form-item>
                      <el-form-item label="考试形式">
                        <el-input v-model="formXQ.KSXS"></el-input>
                      </el-form-item>
                      <el-form-item label="参考人数">
                        <el-input v-model="formXQ.CKRS"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                      <el-form-item label="考试状态">
                        <el-input v-model="formXQ.KSZT" ></el-input>
                      </el-form-item>
                      <el-form-item label="试卷满分">
                        <el-input v-model="formXQ.SJMF"></el-input>
                      </el-form-item>
                      <el-form-item label="考试时长">
                        <el-input v-model="formXQ.KSSC"></el-input>
                      </el-form-item>
                      <el-form-item label="考试日期">
                        <el-input v-model="formXQ.KSRQ"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                      <el-form-item label="评审人员">
                        <el-input v-model="formXQ.PSRY"></el-input>
                      </el-form-item>
                      <el-form-item label="主审人">
                        <el-input v-model="formXQ.ZSR"></el-input>
                      </el-form-item>
                      <el-form-item label="参考人员">
                        <el-input type="textarea" v-model="formXQ.CKRY"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                </el-form>
            </div>
          </el-card>
        </el-row>

        <el-row style="margin-top: 20px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>试卷详情</span>
            </div>
            <div style="height: 400px">
               <el-scrollbar style='height: 400px;'>
      <div  style="margin-top: 20px">
        <div v-if="CTZJdata.length != 0">
          抽题组卷
          <el-table
          :data="CTZJdata"
          border
          style="width: 100%"
          max-height="240"
          size='mini'>
          <el-table-column
          prop="ZSD"
          label="知识点"> 
            </el-table-column>
            <el-table-column
            prop="STLXlabel"
            label="试题类型"> 
            </el-table-column>
            <el-table-column
            prop="STSL"
            label="试题数量"> 
            </el-table-column>
            <el-table-column
            prop="DTFZ"
            label="分值/题"> 
            </el-table-column>
            <el-table-column
            prop="FZXJ"
            label="分值小计"> 
            </el-table-column>
        </el-table>
        </div>
        <div v-if="XTandRGdataQC.length != 0">
          <div v-for='item in this.STYLdata'>
            <div style="font-size: 20px" v-if='item.ST.length !=0'>{{item.dictName}}</div>
            <div v-for='details in item.ST'>
            <el-row >
                  <el-col :span="23" :offset="1">
                    <el-form label-position="right" inline labelWidth="80px">
                    <div style="overflow: hidden">
                       <el-col>
                          <el-form-item label="题干: ">
                            <b>{{details.questionBody}}</b>({{details.singleScore}}分)
                          </el-form-item>
                        </el-col>

                        <el-col v-if="details.questionOption">
                          <el-form-item label="选项内容: ">
                            <p v-for="item2 in details.questionOption.split(';')"><span>{{item2.split(';')[0]}}</span> &nbsp;&nbsp;<b>{{item2.split(';')[1]}}</b></p>
                          </el-form-item>
                        </el-col>

                        <el-col v-if="details.questionType == 'GAP_FILLING'">
                          <el-form-item label="参考答案: ">
                            <b v-for="item2 in details.questionAnswer">&nbsp;&nbsp;<b>{{item2.value}}</b></b>
                          </el-form-item>
                        </el-col>

                        <el-col v-else-if="details.questionType == 'MULTIPLE_CHOICE'">
                          <el-form-item label="参考答案: ">
                            <b v-for="item2 in details.questionAnswer"><b>&nbsp;&nbsp;{{item2}}</b></b>
                          </el-form-item>
                        </el-col>

                        <el-col>
                          <el-form-item label="参考答案: " v-if="details.questionType !== 'MULTIPLE_CHOICE' && details.questionType !== 'GAP_FILLING' && details.questionType !== 'COMPREHENSIVE'">
                            <b>{{details.questionAnswer}}</b>
                          </el-form-item>
                        </el-col>

                        <el-col v-if="details.keys">
                          <el-form-item label="关键字: ">
                            <b v-for="item2 in details.keys"><b>&nbsp;&nbsp;{{item2}}</b></b>
                          </el-form-item>
                        </el-col>

                        <el-col>
                          <el-form-item label="解析: " v-if="details.questionAnalyze && (details.questionAnalyze !== '')">
                            <b>{{details.questionAnalyze}}</b>
                          </el-form-item>
                        </el-col>
                    </div>
                    </el-form>                                      
                  </el-col>
                </el-row>
            </div>
          </div>
        </div>
      </div>
      <div  style="margin-top: 20px" v-if="SJZJdata.length != 0">
        随机组卷
        <el-table
        :data="SJZJdata"
        border
        style="width: 100%"
        max-height="240"
        size='mini'>
          <el-table-column
          prop="ZSD"
          label="知识点"> 
            </el-table-column>
            <el-table-column
              prop="STLXlabel"
              label="试题类型"> 
            </el-table-column>
            <el-table-column
            prop="STSL"
            label="试题数量"> 
            </el-table-column>
            <el-table-column
            prop="DTFZ"
            label="分值/题"> 
            </el-table-column>
            <el-table-column
            prop="FZXJ"
            label="分值小计"> 
            </el-table-column>
            <el-table-column label="操作"  >
        </el-table-column>
      </el-table>
      </div>
      
    </el-scrollbar>
            </div>
          </el-card>
        </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleXQ = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {

  data(){
      return {
        XSXSZdata:[{key:1,desc:'试卷名称'},{key:2,desc:'试卷类型'},{key:3,desc:'试卷状态'},{key:4,desc:'考试形式'},{key:5,desc:'出题人'},{key:6,desc:'出题时间'},{key:7,desc:'开始时间'},{key:8,desc:'结束时间'},{key:9,desc:'修改人'},{key:10,desc:'修改时间'},{key:11,desc:'考试时长'}],
        XSXSZdata1:[1,2,3,4,5,7,11],
        pageNum:1,  //页码
        pageSize:10,  //每页数量
        total:20,   //总数
        //按钮名称
        XSXSZ:'显示项设置',
        PLCS:'批量删除',
        XJ:'创建考试',
        tableData:[],// 表格内容
        tableSelection:{},  //多选选中的值
        // table查询
        formInline: {
          ksName: '',
          ksxs: '',
          kslx: '',
          kszt: ''
        },
        //详情页form
        formXQ:{
          KSMC:'',
          KSLX:'',
          KSXS:'',
          CKRS:'',
          KSZT:'',
          SJMF:'',
          KSSC:'',
          KSRQ:'',
          PSRY:'',
          ZSR:'',
          CKRY:'',
        },
        
        dialogVisibleXSXSZ: false, //显示项设置
        dialogVisibleXQ: false, //详情

        dictionarys:[],
        STall:[],  //总试题列表
        STallQC:[], //总试题去重
        CTZJdata:[],
        SJZJdata:[],
        XTandRGdata:null,  //选题和人工所有 
        XTandRGdataQC:[],  //选题和人工所有去重
        STYLdata:[{dictName:'单选题',value:'1',ST:[]},{dictName:'多选题',value:'2',ST:[]},{dictName:'填空题',value:'3',ST:[]},{dictName:'判断题',value:'4',ST:[]},{dictName:'简答题',value:'5',ST:[]},{dictName:'论述题',value:'6',ST:[]},{dictName:'综合题',value:'7',ST:[]}], //抽题和人工试题预览data
      }     
  },
  watch:{
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      XTandRGdata:function(val){
        if (val) {
          //去重  
          var oldData = val
          var newData = [];
          var arr = []
          for (var i = oldData.length - 1; i >= 0; i--) {
            if(arr.indexOf(oldData[i].id) == -1){
              arr.push(oldData[i].id);
              newData.push(oldData[i])
            }
          }
          this.XTandRGdataQC = newData  
        } 
      },
      XTandRGdataQC:function(val){  
        var test1 = []
        var id = 10000000
        this.dictionarys.question_type.forEach((element, index)=>{
          let a = {id:id++, dictName:element.dictName , value:element.value , ST:[]}
          test1.push(a)
        })
        val.forEach( function(element, index) {
          let a = test1.find((item)=>(item.value == element.questionType))
          a.ST.push(element)
        })
        this.STYLdata = test1
        console.log('预览试题',this.STYLdata);
      },
    },
  created(){
    this.dictionarys = JSON.parse(sessionStorage.getItem('dictionarys'))
  },
  methods: {
    wordDownload:function(index,row){

      this.$axiosDownload(this.$axiosURL.e_examination+'exportTickets',{examId:row.id}).then((res)=>{
          if (!res) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([res]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url 
          link.setAttribute('download', '准考证.doc')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
      })

      // var url = this.$axiosURL.e_examination+'exportTickets?examId=' + row.id
      // window.location.href = url
    },
    downSJ:function(row){
      console.log(row);
      var paperId = ''
      if (row.examQuesWay == '确定试题考试') {
        row.papers.forEach((element)=>{
          if (element.paper.paperType=="普通试卷") {
            paperId = element.paper.id
          } 
        })
        var url = this.$axiosURL.e_examinationPaper+'exportStuPapers?examId=' + row.id+'&paperId='+paperId
        window.location.href = url
        
      } else {
        row.papers.forEach((element)=>{
          if (element.paper.paperType=="模板试卷") {
            paperId = element.paper.id
          } 
        })
        var url = this.$axiosURL.e_examinationPaper+'exportStuPapers?examId=' + row.id+'&paperId='+paperId+'&isSj=true'
        window.location.href = url
      }
      
      
    },
    handleLook:function(index,row){
        
        this.dialogVisibleXQ = true

        var judgeTeacher = ''
        for (var i = row.judgeTeacher.length - 1; i >= 0; i--) {
          if (i == 0) {
            judgeTeacher = judgeTeacher + row.judgeTeacher[i].name 
          }else {
            judgeTeacher = judgeTeacher + row.judgeTeacher[i].name+'、'
          }
        }
        var students = ''
        for (var i = row.students.length - 1; i >= 0; i--) {
          if (i == 0) {
            students = students + row.students[i].name 
          }else {
            students = students + row.students[i].name +'、'
          }
        }
        this.formXQ = {
          KSMC:row.examName,
          KSLX:row.examType,
          KSXS:row.examModality,
          CKRS:row.students.length,
          KSZT:row.examState,
          SJMF:row.papers[0].paper.totalScore,
          KSSC:row.totalTime,
          KSRQ:row.startTime,
          PSRY:judgeTeacher,
          ZSR:row.chiefTeacher?row.chiefTeacher.name:'',
          CKRY:students,
        }

        this.CTZJdata = row.papers[0].paper.ctzj?JSON.parse(row.papers[0].paper.ctzj):[]
        this.SJZJdata = row.papers[0].paper.sjzj?JSON.parse(row.papers[0].paper.sjzj):[]
        this.XTandRGdata = []
        if (row.papers[0].paper.xtzj) {
          JSON.parse(row.papers[0].paper.xtzj).forEach((element, index)=> {
            this.XTandRGdata.push(element)
          });
        }
        console.log(33,this.XTandRGdata);
        setTimeout(()=>{
          console.log(44,this.XTandRGdataQC);
        },1000)
        
    },
    handleRemove:function(index, row){
        this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param ={
            id:row.id
          }
          this.$axiosRes1('delete',this.$axiosURL.e_examination+'delExam',param).then((res)=>{
              this.$message.success('删除成功')
              this.findPaperPage()
              console.log('删除',res);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });    
      },
      clickPLSC:function(){
      if (Object.keys(this.tableSelection).length) {
        this.$confirm('此操作将删除所有选中的信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.tableSelection.forEach( (element, index)=> {
            var param ={
              id:element.id
            }
            this.$axiosRes1('delete',this.$axiosURL.e_examination+'delExam',param).then((res)=>{
               this.findPaperPage()
            })  
            });
        }).then(() => {
           this.$message.success('删除成功')
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });    
        
      }
     },
     handleSelectionChange:function(val){
        this.tableSelection = val
      },
    clickXSXSZ:function(){
      this.dialogVisibleXSXSZ = true;
    },
    clickXJ:function(){
      this.$bus.$emit('clickXJKS','')
    },
    checkselectable:function(row,index){
        if (row.examState =='未发布') {
          return 1
        }else {
          return 0
        }
    },
    handleEdit:function(index, row){
      console.log(row,339)
      this.$store.state.addKS.dialogVisible = true
      this.$bus.$emit('EditKS',row)
    },
    columnIsShow:function(num){
        return $.inArray(num,this.XSXSZdata1)<0 ? false : true;
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
    onSubmit(){
          this.findPaperPage()
    },
    //tableData查询
    findPaperPage:function(){
      var param ={
        examName:this.formInline.ksName,
        examModality:this.formInline.ksxs,
        examType:this.formInline.kslx,
        examState:this.formInline.kszt,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        rel:true
      }
      console.log(param);
      this.$axiosGet(this.$axiosURL.e_examination+'findPageByProperty',param).then((res)=>{
          console.log(res.data);
          this.tableData = res.data
          this.total = res.total
      })
    }
  },
  mounted:function(){
    this.findPaperPage()

    this.$bus.$on('findPaperPageKS',()=>{
      this.findPaperPage()
    }) 
   
  }
}
</script>
<style >
  .el-tag {
    background-color: transparent;
    border: none;
  }

  .SJXQ .el-container{
    cursor: pointer ;
    background-color: #315aa2;
    width: 170px;
    height: 160px;
    text-align: center;
  }

  .demo:after{
    display: inline-block;
    content: '√';
    color: #fff;
    width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-left: 20px solid transparent;
    border-bottom: 20px solid #74B8DD;
    border-right: 20px solid #74B8DD;
    position: relative;
    bottom: 0px;
    right: -130px;

}
</style>