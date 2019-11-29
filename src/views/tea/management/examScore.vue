<template>
  <div class="teatable">
	<el-row type="flex" style="margin-top: 20px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="formInline.SJMC" placeholder="考试名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.KSLX" placeholder="考试类型">
           <el-option v-for = 'item in this.$store.state.dictionarys.exam_type'
              :label="item.dictName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.ZJFS" placeholder="组卷方式">
            <el-option v-for = 'item in this.$store.state.dictionarys.paper_gen_method'
              :label="item.dictName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.KSXS" placeholder="考试形式">
            <el-option v-for = 'item in this.$store.state.dictionarys.exam_modality'
              :label="item.dictName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜 索</el-button>
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
              :disabled="checkClick(scope.row)"
              @click="clickKSPJ(scope.$index, scope.row)">开始判卷
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
      title="判题"
      :visible.sync="dialogVisible"
      width="1200px"
      top = "20px">
    <score v-show='showScore'/>
    <scoreSJ v-show='!showScore'/>
    </el-dialog>
  </div>
</template>
<script>
  import score from "../../../components/model/score.vue"
  import scoreSJ from "../../../components/model/scoreSJ.vue"
export default {
  data(){
      return {
        formInline: {
          SJMC: '',
          KSLX: '',
          ZJFS: '',
          KSXS: '',
        },
        tableData:[],
        XSXSZdata:[{key:1,desc:'考试名称'},{key:2,desc:'考场地址'},{key:3,desc:'考试时长'},{key:4,desc:'评定规则'},{key:5,desc:'开考时间'},{key:6,desc:'结束时间'},{key:7,desc:'应考人数'},{key:8,desc:'考试形式'},{key:9,desc:'考试类型'},{key:10,desc:'确定试题考试、随机试题考试'},{key:11,desc:'备注'}],
        XSXSZdata1:[1,2,3,5,6,7,8,9],
        dialogVisibleXSXSZ:false,
        dialogVisible:false,
        pageNum:1,  //页码
        pageSize:10,  //每页数量
        total:20,   //0总数

        showScore:true,
      }     
    },
    components: {
      score,scoreSJ
  },
  methods: {
    checkClick:function(row){
        for (var i = row.judgings.length - 1; i >= 0; i--) {
          if (row.judgings[i] == this.$store.state.aId) {
            console.log('false');
            return false
          }
        }
        return true
    },
  	clickKSPJ:function(index,row){
      var param ={
          examId:row.id,
          //tchId:this.$store.state.aId
          tchId:this.$store.state.loginUser.id
        }

        this.$axiosRes1('post',this.$axiosURL.e_examinationPaper+'findJudgingObjs',param).then((res)=>{
            console.log(777,res);
            if (row.examQuesWay == '确定试题考试') {
              var data = {
                res:res,
                row:row
              }
              this.showScore = true
              this.$bus.$emit('QDSTKS',data)
            } else {
              if (res.length>0) {
                var data = {
                  res:res,
                  row:row
                }
                this.showScore = false
                this.$bus.$emit('SJSTKS',data)
              }
            }
            
        })
  		this.dialogVisible = true

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
          start:(this.pageNum-1) * this.pageSize,
          length:this.pageSize
        }
        this.$axiosRes1('post',this.$axiosURL.e_examination+'findJudgingByParam',param).then((res)=>{
          this.tableData = res.data
          this.total = res.total
        })
      }
  },
  mounted:function(){
  	this.findPaperPage()
    this.$bus.$on('colseWindos',()=>{
      this.dialogVisible = false
      this.findPaperPage()
    })

  }
}
</script>
<style scope>
  
</style>