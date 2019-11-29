<template>
  <div class="mockexam change">
    <div class="mock_index">
      <!-- <el-row :gutter="20"> -->
        <!-- <el-col :span='6'> -->
          <div class="mockexam_left">
            <div>
              <el-radio-group v-model="ZSDradio" @change='clearnZSDnode'>
                <el-radio-button label="教学大纲"></el-radio-button>
                <!-- <el-radio-button label="相关知识点"></el-radio-button> -->
              </el-radio-group>
                <div v-if="ZSDradio =='教学大纲'">
                <el-tree
                  :data="ZSDdata1"
                  show-checkbox
                  ref="tree1"
                  node-key='id'
                  :check-strictly='true'
                  :props="defaultProps"
                  :render-content="renderContent"
                  @check-change="checkChange">
                </el-tree>
              </div>
              <!-- <div v-if="ZSDradio =='相关知识点'">
                <el-tree
                  :data="ZSDdata"
                  :props="defaultProps"
                  node-key='id'
                  :check-strictly='true'
                  show-checkbox
                  ref="tree2"
                  @check-change="checkChange">
                </el-tree>
              </div> -->
            </div>
          </div>
        <!-- </el-col>
        <el-col :span='18'> -->
          <div class="mockexam_right">
            <div class="mockexam_right_title"  v-if="checkZSDnode.length > 0" >已选择的知识点</div>
            <div class="mockexam_right_title"  v-if="checkZSDnode.length <= 0" >
              <span>温馨提示：您好，请您先选择左侧的知识点，再设置右侧的试题数！</span>
            </div>
            
            <div class="mockexam_right_ZSD">
                <el-row :key="Math.random()" v-for="item in checkZSDnode">
                  <div class="mockexam_right_ZSDname">
                    {{item.name}}
                  </div> 
                  <div class="mockexam_right_ZSDnum">
                    单选题<el-input-number v-model="item.allTypesAndNum.SINGLE_CHOICE" controls-position="right" size='small' :min="0" :max="item.DX"></el-input-number>
                  </div>
                  <div class="mockexam_right_ZSDnum">
                   多选题 <el-input-number v-model="item.allTypesAndNum.MULTIPLE_CHOICE" controls-position="right" size='small' :min="0" :max="item.duoX"></el-input-number>
                  </div>
                  <div class="mockexam_right_ZSDnum">
                    填空题 <el-input-number v-model="item.allTypesAndNum.GAP_FILLING" controls-position="right" size='small' :min="0" :max="item.TK"></el-input-number>
                  </div>
                  <div class="mockexam_right_ZSDnum">
                    判断题 <el-input-number v-model="item.allTypesAndNum.CHECKING" controls-position="right" size='small' :min="0" :max="item.PD"></el-input-number>
                  </div>
                  <div class="mockexam_right_ZSDnum">
                    简答题 <el-input-number v-model="item.allTypesAndNum.SHORT_ANSWER" controls-position="right" size='small' :min="0" :max="item.JD"></el-input-number>
                  </div>
                  <div class="mockexam_right_ZSDnum">
                    论述题 <el-input-number v-model="item.allTypesAndNum.EXPOUND" controls-position="right" size='small' :min="0" :max="item.LS"></el-input-number>
                  </div>
                  <div class="mockexam_right_ZSDnum">
                    综合题 <el-input-number v-model="item.allTypesAndNum.COMPREHENSIVE" controls-position="right" size='small' :min="0" :max="item.ZH"></el-input-number>
                  </div>
                  <div style="display: inline-block;">
                    <el-button type="danger" @click='removeZSD(item)' icon="el-icon-delete" circle></el-button>
                  </div>
                </el-row>
            </div>
            <el-button class="mockexam_right_button" v-if="checkZSDnode.length > 0" type="primary" @click='szTime'>设定考试时间</el-button>
            <!-- <div class="mockexam_right_button" @click='dialogLogin = true'>设定考试时间</div> -->
          </div>
        <!-- </el-col>
      </el-row> -->
    </div>
    <el-dialog
      :visible.sync="dialogLogin"
      width="350px">
      <div style="width: 100%;text-align: center;margin: 0px auto;color: #000">
        <el-row>
          <el-col :span='14' style='color: #333;text-align: right;font-size: 18px;height:30px;line-height: 30px;'>
            考试时长(分):
          </el-col>
          <el-col :span='10' style='text-align: left;'>
            <el-input-number v-model="testTime" controls-position="right" size='small' :min="1" ></el-input-number>
          </el-col>
        </el-row>
        
      </div>
      <div style="width: 70%;text-align: center;margin: 20px auto;">
        <el-button type="primary"  @click='test'>进入考试</el-button>
      </div>
    </el-dialog>
      <el-dialog title="请先登录" :visible.sync="loginShow" width="30%">
          <newlogin></newlogin>
      </el-dialog>
  </div>
</template>
<script>
import newlogin from '@/components/layout/newlogin'
export default {
  name: 'index',
  data () {
    return {
      loginShow: false,
      ZSDradio:"教学大纲",
      ZSDdata:[],
      ZSDdata1:[],
      defaultProps: {
        children: 'knowledgePoints',
        label: 'name'
      },
      defaultProps1: {
        children: 'knowledgePoints',
        label: 'name'
      },
      dialogLogin:false,
      testTime:0,
      STdata:[],
      checkZSDnode:[],
    }
  },
  components:{
    newlogin
  },
  methods: {
    szTime(){
      this.dialogLogin = true
    },
    test:function(){
      var params=[]
      this.checkZSDnode.forEach((element, index)=> {
        var a = {
          kpId:element.id,
          kpName:element.name,
          singleChoiceNum:element.allTypesAndNum.SINGLE_CHOICE,
          multipleChoiceNum:element.allTypesAndNum.MULTIPLE_CHOICE,
          gapFillingNum:element.allTypesAndNum.GAP_FILLING,
          checkingNum:element.allTypesAndNum.CHECKING,
          shortAnswerNum:element.allTypesAndNum.SHORT_ANSWER,
          expoundNum:element.allTypesAndNum.EXPOUND,
          comprehensiveNum:element.allTypesAndNum.COMPREHENSIVE,
        }
        params.push(a)
      });
      this.$axiosStuResBody('post',this.$axiosURL.k_examinationQuestion+ 'bash/randomQuestions/simulateExam',params).then((res)=>{
        console.log(res)
        if(res.length == 0){
          this.$message.error('试题为空')
          return false
        } else {
          this.STdata = res
        }
      }).then((data)=>{
        console.log(data)
        if(data == false) return
        localStorage.setItem('mockExam_test',JSON.stringify({time:this.testTime,STdata:this.STdata}))
        // this.$router.push({name:'mockExam_test',params:{time:this.testTime,STdata:this.STdata}})
        //this.$router.push({name:'mockExam_test'})
        const route = this.$router.resolve({name:'mockExam_test'})
        window.open(route.href,'_blank',)
        this.dialogLogin = false
      })
    },
    removeZSD:function(item){
      if (this.ZSDradio=="教学大纲") {
        this.$refs.tree1.setChecked(item.node,false)
      } else {
        this.$refs.tree2.setChecked(item.node,false)
      }
    },
    checkChange:function(){
      var treeNode = null
      if (this.ZSDradio=="教学大纲") {
        treeNode = this.$refs.tree1.getCheckedNodes()
      } else {
        treeNode = this.$refs.tree2.getCheckedNodes()
      }
      var checkNode = [] //临时
      treeNode.forEach((element, index)=> {
        console.log(element);
          var a ={
          name:element.name,
          id:element.id,
          node:element,
          DX:0,
          duoX:0,
          TK:0,
          PD:0,
          LS:0,
          JD:0,
          ZH:0,
          allTypesAndNum:{},
         }
         checkNode.push(a)
       });
      //判断添加删除
      checkNode.forEach((element, index)=> {
        var c = this.checkZSDnode.filter((element1)=>{
          return element1.id == element.id
        })
        if (c.length == 0) {
          this.$axiosStuRes1('get',this.$axiosURL.k_common+ 'count/allTypesAndNum/for/'+element.name,{}).then((res)=>{
            if(res.error == "invalid_token") {
              this.loginShow = true
              return
            }
            element.DX = res.SINGLE_CHOICE
            element.duoX = res.MULTIPLE_CHOICE
            element.TK = res.GAP_FILLING
            element.PD = res.CHECKING
            element.LS = res.EXPOUND
            element.JD = res.SHORT_ANSWER
            element.ZH = res.COMPREHENSIVE
            element.allTypesAndNum = res
            this.checkZSDnode.push(element)
          })
        }
      })
      this.checkZSDnode.forEach((element, index)=> {
        var c = checkNode.filter((element1)=>{
          return element1.id == element.id
        })
        if (c.length == 0) {
          this.checkZSDnode.splice(index,1)
        }
      }) 
    },
    clearData:function(){
      this.clearnZSDnode()
      this.ZSDdata = []
      this.ZSDdata1 = []
    },
    clearnZSDnode:function(){
      this.checkZSDnode = []
    },
    initData:function(){
      this.clearData();
      this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
        res.forEach( (element, index)=> {
          element['disabled']= true
          this.ZSDdata.push(element)
        });
      })
      this.$axiosStuRes('get',this.$axiosURL.k_common+ 'get/allPoints/historicalAverageScore',{}).then((res)=>{
        res.forEach( (element, index)=> {
          element['disabled']= true
          console.log(element);
          this.ZSDdata1.push(element)
        });
      })
    },
    renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              {data.historicalAverageScore==null?'':'('+data.historicalAverageScore.toFixed(3)*100+'%)'}
            </span>
          </span>);
      },
  },
 
  created:function(){
    
  },
  mounted:function(){
    this.clearData()
    this.initData()
    
  },


}
</script>


<style scoped>
  .el-radio-button:first-child:last-child .el-radio-button__inner{
    font-size: 16px
  }
</style>
