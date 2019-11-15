<template>
  <div class="teatable">
    <el-row :gutter="10" style="margin: 10px 0">
      <el-col :span="12"><div class="grid-content" @click="mulu">知识目录</div></el-col>
      <el-col :span="12"><div class="grid-content" @click="guanlian">多维知识关联</div></el-col>
    </el-row>
    <!-- 搜索查询部分 -->
    <el-row type="flex" v-show="mulushow == true">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="pointName" size='mini' placeholder="输入关键字进行筛选"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size='mini' @click="gjzSearch">查询</el-button>
        </el-form-item>
      </el-form>
        <unit_button  :msg='CJZSD' @click.native='CJKnowPoints'></unit_button>
        <!-- <unit_button  :msg='PLDR' @click.native=''></unit_button> -->
    </el-row>

    <el-row :gutter="20" type="flex" v-show="mulushow == false">
        <el-col :span="14">
          <el-form ref="form" :model="form" label-position="left">
            <el-col :span="10">
              <el-form-item>
                  <ele-multi-cascader
                    :options="options"
                    v-model="form.isp"
                    placeholder="选择知识点"
                    :multiple-limit='2'
                    @change="ispChange"
                    >
                  </ele-multi-cascader>
              </el-form-item>
            </el-col>
  
            <el-col :span="4">
              <el-form-item>
                  <el-button type="primary" @click="submit">查看</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
    </el-row>

    <!-- 树形表格 -->
    <treegrid v-show="mulushow == true" :tree-structure="true" ref="treeGrid"></treegrid>

    <!-- 树形图 -->
    <treegraph v-show="mulushow == false" ref="agraph"></treegraph>

    <!-- 创建学科弹框 -->
    <el-dialog :before-close="handleClose" title="创建学科" :visible.sync="knowPointsShow">
      <el-form :model="CJPointsForm" :rules="rules" ref="CJPointsForm">
        <el-form-item label="学科名称">
          <el-input v-model="CJPointsForm.name" autocomplete="off" placeholder="请输入学科名称"></el-input>
        </el-form-item>
        <el-form-item label="学科编号">
          <el-input v-model="CJPointsForm.khId" autocomplete="off" placeholder="请输入学科编号"></el-input>
        </el-form-item>

        <el-form-item label="科目描述">
          <el-input v-model="CJPointsForm.content" autocomplete="off" placeholder="请输入科目描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="CJsubmint('CJPointsForm')">立即创建</el-button>
          <el-button @click="qxSubmit">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import treegrid from '../../../components/treeTable/TreeGrid'
import treegraph from '../../../components/treeTable/TreeGraph'

export default {
  name: 'hello',
  data () {
    return {
      options: [],
      form: {
        isp: []
      },
      changeID: [],
      mulushow: true,
      // 关键字查询
      pointName: '',
      // 创建知识点弹框
      knowPointsShow: false,
      // 创建知识点表单
      CJPointsForm: {
          name: '',
          khId: null,
          content: '',
          createUserID: null,
          createTime: ''
      },
      rules: {
          name: [
            { required: true, message: '请输入学科名称', trigger: 'change' }
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          khId: [
            { required: true, message: '请输入学科编号', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请输入内容', trigger: 'change' }
          ]          
      },
      editableTabsValue: '0',
      PLDR: '批量导入',
      CJZSD: '创建学科',
      graphItem: [],
      graphID: 1,
      checkedID: [],
      xuekeID: null,
      oneGraphItem: {
        pathGraph:[],
        pathGraphIndex:[]
      }
    }
  },
  components: {
    treegrid,
    treegraph
  },
  mounted(){
    this.ZSDTable()
     this.$bus.$on('graphEel',() => {
      this.submit()
     })
  },
  created(){
      // this.$refs.agraph.aaa()
  },
  methods: {
    ZSDTable(){
      this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
        this.options = res;
      })
    },
    ispChange(values, items) {
      this.checkedID = items
    },
    submit() {
      if( this.form.isp.length == 1) {
        // 学科
        if(this.checkedID[0].khId) {
          this.$axiosRes('get',this.$axiosURL.k_knowledgeHierachy+'find/' + this.form.isp[0] + '/involvedHierachy').then((res)=>{
            console.log(res,333)
            var obj1= {}
            obj1.id = res.id
            obj1.name = res.name
            obj1.khId = res.khId
            obj1.category = 3
            // this.oneGraphItem.pathGraph
            var arr1 = []
            arr1 = res.involveKnowledgeHierachies
            arr1.unshift(obj1)
            this.oneGraphItem.pathGraph.push(arr1)
            var arr = []
            for (var i = 0; i < res.involveKnowledgeHierachies.length; i++) {
              var obj = {}
              obj['source'] = 0
              obj['target'] = i
              // this.oneGraphItem.pathGraph[i]
              arr.push(obj)
            }
            this.oneGraphItem.pathGraphIndex.push(arr)
            this.oneGraphItem.graphID = 1
            this.oneGraphItem.xuekeID = res.khId
            this.$bus.$emit('graphClick',this.oneGraphItem)
            this.oneGraphItem.pathGraph = []
            this.oneGraphItem.pathGraphIndex = []
          })
        } else {
          // 知识点
          this.$axiosRes('get',this.$axiosURL.k_knowledgePoint+'find/' + this.form.isp[0] + '/correlatedPoint').then((res)=>{
            // res.correlateKnowledgePoints.push(res)
            var obj1= {}
            obj1.id = res.id
            obj1.name = res.name
            obj1.category = 3
            // this.oneGraphItem.pathGraph
            var arr1 = []
            arr1 = res.correlateKnowledgePoints
            arr1.unshift(obj1)
            this.oneGraphItem.pathGraph.push(arr1)
            var arr = []
            for (var i = 0; i < res.correlateKnowledgePoints.length; i++) {
              var obj = {}
              obj['source'] = 0
              obj['target'] = i
              // this.oneGraphItem.pathGraph[i]
              arr.push(obj)
            }
            this.oneGraphItem.pathGraphIndex.push(arr)
            this.oneGraphItem.graphID = 1
            this.oneGraphItem.xuekeID = res.khId
            this.$bus.$emit('graphClick',this.oneGraphItem)
            this.oneGraphItem.pathGraph = []
            this.oneGraphItem.pathGraphIndex = []
          })

        }

      }
      if(this.form.isp.length > 2) {
        this.$message({
          message: '请选择两个知识点',
          type: 'warning'
        })
        return
      } 
      if(this.form.isp.length == 2){
        this.$axiosRes('get',this.$axiosURL.k_common+ 'find/shortestPath/' + this.form.isp[0] + '/' +this.form.isp[1]).then((res)=>{
          this.graphItem = res
          this.graphItem.pathGraph[0][0].category = 2
          this.graphItem.pathGraph[0][this.graphItem.pathGraph[0].length-1].category = 2
          this.$bus.$emit('graphClick',this.graphItem)
        })        

      }

    },
    // tab切换
      mulu(){
        this.mulushow = true
      },
      guanlian(){
        this.mulushow = false
        this.ZSDTable()

      },
      // 关键字查询
      gjzSearch(){
        if(this.pointName == ''){
          this.$refs.treeGrid.getTableTree(this.pointName)
        } else {
          this.$refs.treeGrid.search(this.pointName,1,5)
        }
      },
      // 创建知识点
      CJKnowPoints(){
        this.knowPointsShow = true
      },
      handleClose(){
        this.knowPointsShow = false
        this.CJPointsForm= {
          name: '',
          khId: '',
          content: '',
          createUserID: null,
          createTime: ''
        }
      },
      qxSubmit(){
        this.knowPointsShow = false
        this.CJPointsForm= {
          name: '',
          khId: '',
          content: '',
          createUserID: null,
          createTime: ''
        }
      },
      CJsubmint(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.CJPointsForm.name == '') {
              this.$message({
                type: 'warning',
                message: '学科名称不能为空!'
              });
              return
            }
            if(this.CJPointsForm.khId == '') {
              this.$message({
                type: 'warning',
                message: '学科编号不能为空!'
              });
              return
            }
            if(this.CJPointsForm.content == '') {
              this.$message({
                type: 'warning',
                message: '请填写科目描述!'
              });
              return
            }
            this.CJPointsForm.createTime = Date.parse(new Date())
            this.CJPointsForm.createUserID = this.$store.state.aId
            this.$refs.treeGrid.addPoint(this.CJPointsForm)
            this.knowPointsShow = false
            this.CJPointsForm= {
              name: '',
              khId: '',
              content: '',
              createUserID: null,
              createTime: ''
            },
            this.pointName = ''
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        // this.knowPointsShow = false
        // this.$axios({
        //   method: 'POST',
        //   url: this.$axiosURL.k_knowledgeHierachy+'save',
        //   data: params
        // }).then((res)=>{
        //   console.log(res)
        // })
      }
  }
}
</script>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .grid-content {
    border-radius: 0;
    text-align: center;
    line-height: 36px;
    color: #fff;
    border-radius: 4px;
    background-color: #44bdf42e;
  }
  .grid-content:hover{
    background-color: #3bb1bdd1;
    cursor: pointer;
  }
</style>
