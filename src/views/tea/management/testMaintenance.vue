<template>
  <div class="teatable">
    <el-row type="flex" style="margin-top: 20px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="formInline.SJMC" placeholder="试卷名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.XKHY" placeholder="学科/行业">
            <el-option v-for = '(item,index) in XKHYdata'
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.SJZT" placeholder="试卷状态">
            <el-option v-for = '(item,index) in this.$store.state.dictionarys.paper_state'
              :key="index"
              :label="item.dictName"
              :value="item.dictName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="formInline.RQ"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row type="flex" style="margin-bottom: 20px">
        <unit_button :msg='XJ' @click.native='clickXJ'></unit_button>
        <unit_button :msg='PLSC' @click.native='clickPLSC'></unit_button>
        <unit_button :msg='XSXSZ' @click.native='clickXSXSZ'></unit_button>
        <unit_button :msg='ZSDXQ' @click.native='clickZSDXQ'></unit_button>
    </el-row>

    <el-table
        :data="tableData"
        border
        style="width: 100%"
        size='mini'
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="id"
          :selectable='checkselectable'
          type="selection"
          width="50"> 
        </el-table-column>
        <el-table-column prop="paperName" label="试卷名称" :key="Math.random()" v-if='columnIsShow(1)'>
        </el-table-column>
        <el-table-column  prop="paperGenMethod"  label="出题方式" :key="Math.random()" v-if='columnIsShow(2)'>
        </el-table-column>
        <el-table-column prop="labels" label="试卷状态" :key="Math.random()" v-if='columnIsShow(3)'>
          <template slot-scope="scope">
            {{findPaperState(scope.row.labels)}}
          </template>
        </el-table-column>
<!--         <el-table-column  prop="xkhy"  label="学科/行业" :key="Math.random()" v-if='columnIsShow(4)'>
        </el-table-column> -->
        <el-table-column  label="出题人" :key="Math.random()" v-if='columnIsShow(5)'>
          <template slot-scope="scope">
            {{scope.row.createBy?scope.row.createBy.name:'无'}}
           </template>
        </el-table-column>
        <el-table-column  prop="createTime"  label="出题时间" :key="Math.random()" v-if='columnIsShow(6)'>
        </el-table-column>
        <el-table-column  prop="totalScore"  label="总分数" :key="Math.random()" v-if='columnIsShow(7)'>
        </el-table-column>
        <el-table-column  prop="stuScore"  label="学生分数" :key="Math.random()" v-if='columnIsShow(8)'>
        </el-table-column>
        <el-table-column  prop="updateBy"  label="修改人" :key="Math.random()" v-if='columnIsShow(9)'>
        </el-table-column>
        <el-table-column  prop="updateTime"  label="修改时间" :key="Math.random()" v-if='columnIsShow(10)'>
        </el-table-column>
        <el-table-column  prop="bz"  label="备注" :key="Math.random()" v-if='columnIsShow(11)'>
        </el-table-column>
        <el-table-column label="操作" width="290" :key="Math.random()" >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="success"
              icon="edit"
              @click="handleLook(scope.$index, scope.row,false)">详情
            </el-button>
            <el-button
              size="small"
              type="warning"
              icon="edit"
              :disabled="findPaperState(scope.row.labels) !='未关联考试'"
              @click="handleEdit(scope.$index, scope.row,true)">编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              :disabled="findPaperState(scope.row.labels) !='未关联考试'"
              @click="handleRemove(scope.$index, scope.row)">删除
            </el-button>
            <el-button
              size="small"
              type="default"
              @click="downloadSJ(scope.row)">打印
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
      title="显示项设置"
      :visible.sync="dialogVisibleZSDXQ"
      top='100px'
      width="1100px">
      <div style="height:600px">
        <el-row :gutter="20" style="margin-top: 20px">
              <el-col :span="8">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>知识点</span>
                    </div>
                    <div style='height:500px'>
                      <el-scrollbar style='height: 500px;'>
                         <el-tree
                          :data="ZSDdata1"
                          :check-strictly='true'
                          :props="defaultProps"
                          @node-click='nodeClick'>
                        </el-tree>
                      </el-scrollbar>
                    </div>  
                  </el-card>
              </el-col>
              <el-col :span="16">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>详情</span>
                  </div>
                  <div style='height:500px'>
                      <div class="chart-box" ref='barcharts'></div>
                  </div>  
                </el-card>
              </el-col>
            </el-row>
      </div>   
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleZSDXQ = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
      return {
        //按钮名称
        XJ:'创建试卷',
        PLSC:'批量删除',
        XSXSZ:'显示项设置',
        ZSDXQ:'知识点详情',
        XKHYdata:[],
        // table查询
        formInline: {
          SJMC: '',
          XKHY: '',
          SJZT: '',
          RQ: null,
        },
        tableSelection:{},  //多选选中的值
        XSXSZdata:[{key:1,desc:'试卷名称'},{key:2,desc:'出题方式'},{key:3,desc:'试卷状态'},{key:4,desc:'学科/行业'},{key:5,desc:'出题人'},{key:6,desc:'出题时间'},{key:7,desc:'总分数'},{key:8,desc:'学生分数'},{key:9,desc:'修改人'},{key:10,desc:'修改时间'},{key:11,desc:'备注'}],
        XSXSZdata1:[1,2,3,4,5,6,11],
        pageNum:1,  //页码
        pageSize:10,  //每页数量
        total:20,   //总数
        dialogVisibleXSXSZ: false,
        dialogVisibleZSDXQ: false,
        // 表格内容
        tableData:null,
        ZSDdata1:[],
        defaultProps: {
          children: 'knowledgePoints',
          label: 'name'
        },
        ZSDdata2:{
          data:[],
          num:[]
        }
      }     
  },
  methods: {
    findPaperState:function(data){
      for (var i = data.length - 1; i >= 0; i--) {
        var a = this.$store.state.dictionarys.paper_state.find((item)=>(item.dictName==data[i]))
        if (a) {
          return a.dictName
        } 
      }
      return ''
    },
    nodeClick:function(data,node){
      console.log(data);
      if (data.historicalScoringAverage&&data.historicalScoringAverage.length != 0) {
        this.ZSDdata2={data:[],num:[]}
        for (var i = 0; i <= data.historicalScoringAverage.length-1; i++) {
          this.ZSDdata2.num.push('考试'+(i+1))
          this.ZSDdata2.data.push(data.historicalScoringAverage[i])
        }
        
        this.$nextTick(function(){
          this.initChartbar()
        })
      } else {
        this.$message.error('详情为空')
      }
    },
    initChartbar(){
        this.$echarts.init(this.$refs.barcharts).showLoading();
        this.$echarts.init(this.$refs.barcharts).hideLoading();
        var option = {
          textStyle:{
                color: '#95d3f2'
              },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
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
            grid: {
                top:'7%',                
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis:  {
                type: 'value'
            },
            xAxis: {
                type: 'category',
                data:  this.ZSDdata2.num
            },
            series: [
                {
                    name: '平均通过率',
                    type: 'line',
                    stack: '',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data:  this.ZSDdata2.data
                }
            ]     
        }
        this.$echarts.init(this.$refs.barcharts).setOption(option);
    },
    downloadSJ:function(row){
      console.log(row.id);
      var url = this.$axiosURL.e_examinationPaper+'findPaperDownload?id=' + row.id+'&rel=true'
      window.location.href = url
    },
    clickXJ:function(){
      this.$bus.$emit('clickXJ','')
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
            this.$axiosRes1('delete',this.$axiosURL.e_examinationPaper+'delPaper',param).then((res)=>{
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
     checkselectable:function(row,index){
        if (this.findPaperState(row.labels) !='未关联考试') {
          return 0
        }else {
          return 1
        }
     },
      columnIsShow:function(num){
        return $.inArray(num,this.XSXSZdata1)<0 ? false : true;
      },
      clickXSXSZ:function(){
        this.dialogVisibleXSXSZ = true;
      },
      clickZSDXQ:function(){
        this.dialogVisibleZSDXQ = true;
      },
      handleSelectionChange:function(val){
        this.tableSelection = val
      },
      handleLook:function(index, row){
        this.$store.state.addSJ.dialogVisible = true
        this.$bus.$emit('EditLook',row)
      },
      handleEdit:function(index, row){
        this.$store.state.addSJ.dialogVisible = true
        this.$bus.$emit('EditSJ',row)
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
          this.$axiosRes1('delete',this.$axiosURL.e_examinationPaper+'delPaper',param).then((res)=>{
            if (res.message) {
              this.$message.error(res.message)
            }else{
              this.$message.success('删除成功')
              this.findPaperPage()
            }  
              console.log('删除',res);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });    
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
      paperExport(index, row){

      },
      addOrUpdateHandle(){
        this.dialogVisible = true;
      },

      //tableData查询
      findPaperPage:function(){
        console.log(this.$store.state.dictionarys);
     
        var a = this.$store.state.dictionarys.paper_type.find((item)=>(item.dictName=='普通试卷'))
        var param ={
          paperName:this.formInline.SJMC,
          //addKnowledgePoints:this.formInline.XKHY,
          paperState:this.formInline.SJZT,
          fStartTime:this.formInline.RQ?this.formInline.RQ[0]:'',
          fEndTime:this.formInline.RQ?this.formInline.RQ[1]:'',
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          paperType:a.value,
          rel:true
        }
        console.log(param);
        this.$axiosResBody('post',this.$axiosURL.e_examinationPaper+'findPaperPage',param).then((res)=>{
            console.log(res.data);
            this.tableData = res.data
            this.total = res.total
        })
      }
  },
  mounted:function(){
    this.findPaperPage()
    this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
      console.log(2,res);
      this.XKHYdata = res;
      this.$store.state.knowledgeHierachy = res;
    })


    this.$bus.$on('findPaperPageSJ',()=>{
      this.findPaperPage()
    })

    this.ZSDdata1 = []
    this.$axiosRes('get',this.$axiosURL.k_common+ 'get/allPoints/historicalAverageScore',{}).then((res)=>{
        res.forEach( (element, index)=> {
          element['disabled']= true
          this.ZSDdata1.push(element)
        });
      })
   
  }

}
</script>
<style scope>
  .el-tag {
    background-color: transparent;
    border: none;
  }
  .el-dialog__body {
      padding: 30px 60px 30px 20px;
  }
  .stepClass{
    height: 500px;
    padding-top: 20px;
  }
  .chart-box {
    min-height: 100%;
    min-height: 100%;
    max-width: 100%;
    background: transparent;
  }
</style>