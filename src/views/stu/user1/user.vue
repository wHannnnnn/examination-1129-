<template>
  <div class="user change">
    <div class="app_header">
        <impheader></impheader>
    </div>
    <div class="user_con">
      <div class="top">
          <div class="top_left">
            <el-avatar :size="100" :src="student.url"></el-avatar>
          </div>
          <div class="top_right">
            <div style="height: 30%;padding:20px 0 0 43px">
              <el-row class="height100">
                <el-col :span="12" class="top_info">
                  学生姓名：{{student.nickname}}
                </el-col>
                <el-col :span="12" class="top_info">
                  学生性别：{{student.sex}}
                </el-col>
              </el-row>
            </div>
            <div style="height: 30%;padding-left: 43px">
              <el-row >
                <el-col :span="12" class="top_info">
                  手机号：{{student.phone}}
                </el-col>
                <el-col :span="12" class="top_info">
                  邮箱：{{student.email}}
                </el-col>
              </el-row>
            </div>
            <div style="height: 30%;padding-left: 43px">
              <el-row >
                <el-col :span="12" class="top_info">
                  部门：{{student.deptName}}
                </el-col>
                <el-col :span="12" class="top_info">
                  职业：{{student.profession}}
                </el-col>
              </el-row>
            </div>
          </div>
      </div>
      <div class="bottom">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="考试信息" name="first">
              <div>
                <div>
                  <div class="KSXX">姓名：{{student.nickname}}</div>
                  <div class="KSXX">部门：{{student.deptName}}</div>
                  <div class="KSXX">应考场次：{{KSXXinfo.shouldCount}}</div>
                  <div class="KSXX">参考次数：{{KSXXinfo.realCount}}</div>
                  <div class="KSXX">参考率：{{KSXXinfo.shouldCount==0?0:(KSXXinfo.realCount/KSXXinfo.shouldCount*100)}}%</div>
                </div>
                <el-table :data="KSXXtable" border style="width: 100%;margin-top: 20px" max-height="390" size='mini'>
                  </el-table-column>
                  <el-table-column prop="examName" label="考试名称">
                  </el-table-column>
                  <el-table-column prop="examType" label="考试形式">
                  </el-table-column>
                  <el-table-column prop="startTime" label="开考时间">
                  </el-table-column>
                  <el-table-column prop="examState" label="试卷状态">
                  </el-table-column>
                  <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                      <el-button size="mini" type="primary" icon="edit" @click="wordDownload(scope.$index, scope.row)">打印准考证
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[5, 10, 20]"
                  :page-size="pageSize" layout=" sizes, prev, pager, next">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="知识点订阅" name="second">
              <div>
                <div v-show='!isAddZSD'>
                  <div class="center_title">
                    已订阅的知识点
                  </div>
                  <el-row :gutter="10">
                    <el-col :span="6" :key="Math.random()" v-for="item in subscribedPoints">
                      <div class="ZSD">
                        <el-row>
                          <el-col :span="21" style='overflow:hidden;text-overflow:ellipsis;white-space:nowrap' :title='item.name'>{{item.name}}</el-col>
                          <el-col :span="3"><i class="el-icon-close" @click='deleteZSD(item)'></i></el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-row>
                  <div class="XZDY" @click='addDY'>
                    新增订阅
                  </div>
                </div>
                <div v-show='isAddZSD'>
                  <el-row :gutter="50">
                    <el-col :span="4">
                      <div class="addZSDleft">
                        <div v-for='item in initProfession' class="left_XK" :title='item.name' @click='getZSD(item)'>
                          {{item.name}}
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="20">
                      <div class="center_title" style="width: 90px">
                        知识点
                      </div>
                      <el-row :gutter="10" class="rightZSD">
                        <el-col :span="6" :key="Math.random()" v-for="item in nowZSD">
                          <div class="ZSD">
                            <el-row>
                              <el-col :span="21" style='overflow:hidden;text-overflow:ellipsis;white-space:nowrap' :title='item.name'>{{item.name}}</el-col>
                              <el-col :span="3"><i :class="isZSD(item)?'el-icon-close':'el-icon-plus'" @click='clickZSD(item)'></i></el-col>
                            </el-row>
                          </div>
                        </el-col>
                      </el-row>
                      <div class="XZDY" @click='isAddZSD = false'>
                        添加完成
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="试卷分析" name="third">
              <div>
                成绩列表
                <el-table :data="SJFXData" border style="width: 100%;margin-top: 20px" max-height="180">
                  </el-table-column>
                  <el-table-column prop="examName" label="考试名称">
                  </el-table-column>
                  <el-table-column prop="totalScore" label="总分">
                  </el-table-column>
                  <el-table-column prop="gainScore" label="本人得分">
                  </el-table-column>
                  <el-table-column prop="avgScore" label="平均得分">
                  </el-table-column>
                  <el-table-column prop="examType" label="考试类型">
                  </el-table-column>
                  <el-table-column prop="pdjg" label="得分/等级/过关">
                    <template slot-scope="scope">
                      {{scope.row.examType=='水平考试'?'第'+scope.row.pdjg+'名':scope.row.examType=='等级考试'?'第'+scope.row.pdjg+'级':scope.row.pdjg}}
                    </template>
                  </el-table-column>
                  <el-table-column label="答题时长">
                    <template slot-scope="scope">
                      {{Math.round(scope.row.duration/60000)}}分
                    </template>
                  </el-table-column>
                  <el-table-column label="平均时长">
                    <template slot-scope="scope">
                      {{Math.round(scope.row.avgDuration/60000)}}分
                    </template>
                  </el-table-column>
                </el-table>
                <div class="echarts_CJLB">
                  <div class="chart-box" ref='CJFXcharts'></div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="个人消息" name="fourth">
              <div>
                <el-table :data="GRXXData" border style="width: 100%;margin-top: 20px" max-height="280">
                  </el-table-column>
                  <el-table-column prop="content" label="消息">
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间">
                    <template slot-scope="scope">
                      {{UTCtoDate(scope.row.createTime)}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
      </div>
    </div>
    <div class="app_bottom">
      <bottom/>
    </div>
  </div>
</template>

<script>
import impheader from '@/components/layout/header1'
import bottom from "@/components/layout/bottom.vue"
export default {
  name: 'index',
  components:{
    impheader,bottom
  },
  data () {
    return {
      activeName: 'first',
      aId:null,
      KSXX:'考试信息',
      ZSDDY:'知识点订阅',
      SJFX:'试卷分析',
      GRXX:'个人消息',
      loginUser:null,
      student:{
        url:require('@/assets/img/touxiang.jpg'),
        nickname:'',
        sex:'',
        phone:'',
        email:'',
        deptName:'',
        profession:'',
      },
      time:'',
      checked:false,  //已读选中
      timeZT:false,  //倒计时是否完成
      KSdata : this.$store.state.KSdata,
      isChoose:1,
      subscribedPoints:[],
      isAddZSD:false,
      initProfession:[],
      nowZSD:[],
      KSXXinfo:{
        shouldCount:0,
        realCount:0
      },
      KSXXtable:[],
      pageNum:1,  //页码
      pageSize:5,  //每页数量

      SJFXData:[],
      GRXXData:[],
      option : {
          textStyle:{color: '#95d3f2'},
          title: {
              text: '成绩分析',
              textStyle:{color: '#95d3f2'},
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
            // 表头 对应  数据name
            data:['本人得分','平均得分']
          },
          xAxis:  {
              type: 'category',
              // boundaryGap: false,
              data: ['0~30','31~60','61~90','91~95','98~100']
          },
          yAxis: {
              type: 'value',
              // y轴数据 显示内容
              axisLabel: {
                  // formatter: '{value} °C'
              }
          },
          // 具体数据
          series: [
              {
                  name:'本人得分',
                  type:'line',
                  // 索引对应X轴星期
                  data:[],
              },
              {
                  name:'平均得分',
                  type:'line',
                  // 索引对应X轴星期
                  data:[],
              },
          ]
        }
    }
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab.index);
      if(tab.index == 1){
        this.isAddZSD = false
      }
    },
    addDY(){
      this.isAddZSD = true
      this.getZSD(this.initProfession[0])
      $('.left_XK').removeClass('is-active1')
      $('.left_XK:eq(0)').addClass('is-active1')
    },
    wordDownload:function(index,row){
      this.$axiosStuDownload(this.$axiosURL.e_examination+'exportTickets',{examId:row.id,stuId:this.loginUser.id}).then((res)=>{
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
    },
    UTCtoDate:function (timestamp) {
      var date = new Date(timestamp)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
      var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
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
    clickZSD:function(item){
      if (this.isZSD(item)) {
        this.$axiosStuResBody('delete',this.$axiosURL.K_neoUser+'bash/cancel/subscribedPoints/for/'+this.aId,[item.id]).then((res)=>{
        }).then(()=>{
          this.nowknowledge()
        })
      } else {
        this.$axiosStuResBody('post',this.$axiosURL.K_neoUser+'bash/subscribePoints/for/'+this.aId,[item.id]).then((res)=>{
        }).then(()=>{
          this.nowknowledge()
        })
      }
    },
    isZSD:function(item){      
      for (var i = this.subscribedPoints.length - 1; i >= 0; i--) {
        if (this.subscribedPoints[i].id == item.id) {
          return true
        } 
      }
       return false
    },
    getZSD:function(item){
      var that = this
        $('.left_XK').click(function () {
          $('.left_XK').removeClass('is-active1')
          $(this).addClass('is-active1')
      })
      this.$axiosStuRes1('get',this.$axiosURL.k_common+'find/allPoints/underTheHierachy/'+item.id,{}).then((res)=>{
        this.nowZSD = res
      })
    },
     initData:function(){
      this.student = {
        url:require('@/assets/img/touxiang.jpg'),
        nickname:this.loginUser.nickname,
        sex:this.loginUser.sex==true?'男':this.loginUser.sex==false?'女':'',
        phone:this.loginUser.phone,
        email:this.loginUser.email,
        deptName:this.loginUser.deptName,
        profession:this.loginUser.profession,
      }
        this.nowknowledge()
        this.$axiosStuRes1('get',this.$axiosURL.k_knowledgeHierachy+'0/all',{}).then((res)=>{
          this.initProfession = res;
        })
        this.$axiosStuRes1('get',this.$axiosURL.e_examination+'countByStuId',{stuId:this.loginUser.id}).then((res)=>{
          this.KSXXinfo = res
        })
        this.findPaperPage()
        //试卷分析
        var userId = JSON.parse(localStorage.getItem('loginUser')).id
        this.$axiosStuResBody('post',this.$axiosURL.b_findStuStatistics,{userId:userId}).then((res)=>{
          this.SJFXData = res.data
          this.option.xAxis.data = []
          this.option.series[0].data = []
          this.option.series[1].data = []
          res.data.forEach((element, index)=> {
            this.option.xAxis.data.push(element.examName)
            this.option.series[0].data.push(element.gainScore==null?0:element.gainScore)
            this.option.series[1].data.push(element.avgScore==null?0:element.avgScore)
          });
        }).then(()=>{
          this.$nextTick(function(){
              this.initChartgx()
          })
        })
        //个人消息
        this.$axiosStuRes1('post',this.$axiosURL.n_notice+'findPage',{userId:userId}).then((res)=>{
          this.GRXXData = res.list
        })
     },

     findPaperPage:function(){
      var param ={
          stuId:this.loginUser.id,
          skip:(this.pageNum-1) * this.pageSize,
          limit:this.pageSize
        }
        this.$axiosStuRes1('post',this.$axiosURL.e_examination+'findByStuId',param).then((res)=>{
          console.log(444,res.length);
          if (typeof(res.length) != 'undefined') {
            this.KSXXtable = res
          }
          
        })
     },
     nowknowledge:function(){
      this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+this.aId+'/all/subscribedPoints',{}).then((res)=>{
        this.subscribedPoints = res
      })
    },
    deleteZSD:function(item){
      console.log(item);
      this.$axiosStuResBody('delete',this.$axiosURL.K_neoUser+'bash/cancel/subscribedPoints/for/'+this.aId,[item.id]).then((res)=>{
        }).then(()=>{
          this.nowknowledge()
        })
    },
     click1:function(){
        this.isChoose = 1
     },
     click2:function(){
       this.isChoose = 2
       this.isAddZSD = false
     },
     click3:function(){
       this.isChoose = 3
     },
     click4:function(){
       this.isChoose = 4
     },
    initChartgx(){
      this.$echarts.init(this.$refs.CJFXcharts).showLoading();
      this.$echarts.init(this.$refs.CJFXcharts).hideLoading();
      this.$echarts.init(this.$refs.CJFXcharts).setOption(this.option);
    },      
  },

   created:function(){
    this.loginUser=JSON.parse(localStorage.getItem('loginUser'))
    this.aId = localStorage.getItem('aId')
    console.log(this.aId);
  },
  mounted:function(){
    console.log(this.aId);
    this.initData()
    
  },


}
</script>
