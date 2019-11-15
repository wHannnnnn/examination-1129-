<template>
  <div class="teatable">
  <el-row type="flex" style="margin-top: 20px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="formInline.KSXM" placeholder="考生姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.XB" placeholder="性别">
            <el-option label="男" :value='true'></el-option>
            <el-option label="女" :value='false'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.BM" placeholder="部门">
            <el-option v-for = 'item in this.BMdata'
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.ZY" placeholder="职业">
            <el-option v-for = 'item in this.ZYdata'
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.SJHM" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.ZHZT" placeholder="账号状态">
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
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
        max-height="490"
        size='mini'>
        <el-table-column prop="headImgUrl" label="头像" :key="Math.random()" v-if='columnIsShow(1)'>
           <template slot-scope="scope">
            <img :src="scope.row.headImgUrl" >
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" :key="Math.random()" v-if='columnIsShow(2)'>
        </el-table-column>
        <el-table-column  prop="nickname"  label="昵称" :key="Math.random()" v-if='columnIsShow(3)'>
        </el-table-column>
        <el-table-column  prop="realname"  label="真实姓名" :key="Math.random()" v-if='columnIsShow(4)'>
        </el-table-column>
        <el-table-column  prop="sex"  label="性别" :key="Math.random()" v-if='columnIsShow(5)'>
          <template slot-scope="scope">
            {{ scope.row.sex==true ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column  prop="age"  label="年龄" :key="Math.random()" v-if='columnIsShow(6)'>
        </el-table-column>
        <el-table-column  prop="deptID"  label="部门" :key="Math.random()" v-if='columnIsShow(7)'>
        </el-table-column>
        <el-table-column  prop="email"  label="电子邮件" :key="Math.random()" v-if='columnIsShow(8)'>
        </el-table-column>
        <el-table-column  prop="phone"  label="手机号" :key="Math.random()" v-if='columnIsShow(9)'>
        </el-table-column>
        <el-table-column  prop="enabled"  label="状态" :key="Math.random()" v-if='columnIsShow(10)'>
           <template slot-scope="scope">
            {{ scope.row.enabled==true ? '可用' : '不可用' }}
          </template>
        </el-table-column>
        <el-table-column  prop="profession"  label="职业" :key="Math.random()" v-if='columnIsShow(12)'>
        </el-table-column>
        <el-table-column  prop="ticketNum"  label="编号" :key="Math.random()" v-if='columnIsShow(13)'>
        </el-table-column>
         <el-table-column  prop="type"  label="类型" :key="Math.random()" v-if='columnIsShow(14)'>
        </el-table-column>
        <el-table-column  prop="updateTime"  label="修改时间" :key="Math.random()" v-if='columnIsShow(15)'>
        </el-table-column>
        <el-table-column  prop="updateUserID"  label="修改人" :key="Math.random()" v-if='columnIsShow(16)'>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="default"
              icon="edit"
              @click="clickKSPJ(scope.$index, scope.row)">详情
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
          :data="XSXSZdata"
          >
        </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleXSXSZ = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="考生情况总览"
      :visible.sync="dialogVisible"
      width="1200px"
      top = "20px">
      <div style="height: 760px">
        <el-row >
          <el-card class="box-card">
            <el-row>
              <el-col :span="4">
                考生姓名：{{XSXXform.nickname}}
              </el-col>
              <el-col :span="4">
                所在部门：{{XSXXform.deptName}}
              </el-col>
              <el-col :span="4">
                应考场次：{{XSXXform.ykcc}}
              </el-col>
              <el-col :span="4">
                参考次数：{{XSXXform.ckcs}}
              </el-col>
              <el-col :span="4">
                参考率：{{XSXXform.ckl}}
              </el-col>
            </el-row>
          </el-card>
        </el-row>

        <el-row >
          <el-col :span="24">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>分析列表</span>
                <!-- <el-button type="info" size="mini" @click="">导出</el-button> -->
                <el-select v-model="stuName" multiple-limit="3" filterable multiple placeholder="选择考生" size="mini">
                  <el-option v-for="(item, index) in stuList"
                    :key="index" :label="item.nickname" :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="primary" size="mini" @click="ksdbSearch">搜索</el-button>
              </div>
                    <div>
                        <el-table
                          :data="KSFXList"
                          border
                          style="width: 100%;margin-top: 20px"
                          max-height="490"
                          size='mini'>
                          </el-table-column>
                          <el-table-column prop="examName" label="考试名称" width="200">
                          </el-table-column>
                          <el-table-column prop="ggxx" label="总分  /  平均得分  /  平均时长（分钟）" width="300">
                          </el-table-column>
                          <el-table-column prop="ksxx" label="考生姓名 / 本人得分  /  答题时长（分钟）  /  排名/等级/过关" width="400">
                          </el-table-column>
   <!--                         <el-table-column prop="userName" label="姓名" >
                          </el-table-column> -->
    <!--                       <el-table-column prop="TGL" label="排名/等级/过关" width="300">
                          <template slot-scope="scope">{{ scope.row.examType }}</template>
                          </el-table-column> -->
<!--                           <el-table-column prop="duration1" label="答题时长（分钟）" width="300">
                          </el-table-column> -->

                          <!-- <template v-for="(item,index) in cols"> -->
                            <el-table-column v-for="(item, index) in cols" :prop="item.prop" label="考生姓名  /  本人得分  /  答题时长（分钟）  /  排名/等级/过关" width="300">
                            </el-table-column>
                          <!-- </template> -->

<!--                            <el-table-column prop="PJSC" label="得分" >
                          </el-table-column>
                           <el-table-column prop="PJSC" label="排名/等级/过关" >
                          </el-table-column>
                          <el-table-column prop="PJSC" label="答题时长" >
                          </el-table-column> -->
      
                      </el-table>
                      <el-pagination
                          @size-change="CJLBhandleSizeChange"
                          @current-change="CJLBhandleCurrentChange"
                          :current-page="CJLBpageNum"
                          :page-sizes="[5, 1, 20]"
                          :page-size="CJLBpageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="CJLBtotal">
                      </el-pagination>  
                    </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
              <el-card>
                <div class="chart-box" ref='CJZXcharts'></div>

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
        stuName: [],
        stuList: [],
        ashow: true,
        cols:[
            // {
            //   prop:'ksxx1',
            // },
            // {
            //   prop:'ksxx2',
            // },
            // {
            //   prop:'ksxx3',
            // }


        ],
        formInline: {
          KSXM: '',
          XB: null,
          BM: '',
          ZY: '',
          SJHM: '',
          ZHZT: '',
        },
        XSXXform:{
        },
        BMdata:[],
        ZYdata:[],
        ZHZTdata:[],
        tableData:[],
         XSXSZdata:[{key:2,desc:'用户名'},{key:3,desc:'昵称'},{key:4,desc:'真实姓名'},{key:5,desc:'性别'},{key:6,desc:'年龄'},{key:7,desc:'部门'},{key:8,desc:'电子邮件'},{key:9,desc:'手机号'},{key:10,desc:'状态'},{key:12,desc:'职业'},{key:15,desc:'修改时间'}],
        XSXSZdata1:[2,3,4,5,6,7,8,10],
        dialogVisibleXSXSZ:false,
        pageNum:1,  //页码
        pageSize:10,  //每页数量
        total:20,   //总数
        dialogVisible:false,
        CJLBpageSize: 5,
        CJLBpageNum: 1,
        CJLBtotal: 5,
        BMList: [],
        KSFXList:[],
        stuId: null,
        depIDS: null,
        otherList:[],
        allZXList: [],
        allSTUList: [],
        userNameList: []
      }     
    },
  methods: {
      renderFunc(h, option) {
        var _this = this;
        return h(
          'span', {
            attrs: {
              id: option.label
            },
            domProps: {
              innerHtml: option.label
            },
            on: {
              click: function () {
                console.log(h,option)
              }
            }
          }
        )
      },
      clickKSPJ:function(index,row){
        this.KSFXList = []
        this.cols = []
        this.otherList = []
        this.allKSName = []
        this.userNameList = []
        this.allZXList = []
        this.depIDS = row.depID
        var param ={
          deptId:this.depIDS,
          start:0,
          length: 99999999,
        }
        this.$axiosGet(this.$axiosURL.u_user+'users',param).then((res)=>{
          console.log(row.use)
          for (var i = 0; i < res.data.length; i++) {
            if(res.data[i].username == row.username){
              res.data[i].disabled = true
            }
          }
          this.stuList = res.data
        })
        this.stuId = row.id
        var param ={
          stuId:this.stuId,
          pageNum:  this.CJLBpageNum,
          pageSize: this.CJLBpageSize
        }
        this.$axiosRes1('get',this.$axiosURL.e_examination+'findExamStatisticsByStu',param).then((res)=>{
          this.XSXXform = row
          this.XSXXform.ykcc = res.shouldCount
          this.XSXXform.ckcs = res.realCount
          if(res.shouldCount && res.realCount) {
            this.XSXXform.ckl = (res.realCount/res.shouldCount*100).toFixed(2) +'%'
          }
          var obj1 ={}
          obj1 = this.BMList.find((item)=>{
            return item.id == this.XSXXform.deptID
          })
          this.XSXXform.deptName = obj1.name
          this.KSFXList = res.examStatistics
          // 循环列表
          for (var i = 0; i < this.KSFXList.length; i++) {
            this.KSFXList[i].avgDuration1 =(this.KSFXList[i].avgDuration/60000).toFixed(2)
            this.KSFXList[i].duration1 =(this.KSFXList[i].duration/60000).toFixed(2)
            this.KSFXList[i].ggxx = this.KSFXList[i].totalScore + ' ' + '/' + ' ' + this.KSFXList[i].avgScore  + ' ' + '/' + ' ' + this.KSFXList[i].avgDuration1
            if(this.KSFXList[i].examType == '水平考试') {
              var pmdjgg = '第'+this.KSFXList[i].pdjg+'名'

            } else if (this.KSFXList[i].examType == '等级考试') {

              var pmdjgg = '第'+this.KSFXList[i].pdjg+'级'

            } else {
              var pmdjgg = this.KSFXList[i].pdjg
            }
            this.KSFXList[i].ksxx = this.KSFXList[i].userName + ' ' + '/' + ' ' + this.KSFXList[i].gainScore + ' ' + '/' + ' ' + this.KSFXList[i].duration1  + ' / ' + pmdjgg
            // this.KSFXList[i].ksxx.push(this.KSFXList[i].totalScore + ' ' + '/' + ' ' + this.KSFXList[i].avgScore  + ' ' + '/' + ' ' + this.KSFXList[i].avgDuration1)
          }

          var aobj = {}
          aobj.data = []
          var num = 0
          for (var i = 0; i < this.KSFXList.length; i++) {
              aobj.data.push(this.KSFXList[i].gainScore)
              aobj.name = this.KSFXList[i].userName
              aobj.type = 'line'
          }

          this.allZXList.push(aobj)
          console.log(this.allZXList,3393)


          this.CJLBtotal = res.realCount
          this.KSFXList.forEach(item =>{
            this.allKSName.push(item.examName)
          })
          this.userNameList.push(this.XSXXform.username)
          this.$nextTick(function(){
              this.initChartCJZX()
          })
          console.log(this.stuList)
        })

        this.dialogVisible = true


      },
      ksdbSearch(){
        this.KSFXList = []
        this.cols = []
        this.otherList = []
        this.allKSName = []
        this.allZXList = []
        this.userNameList = []
        var param ={
          stuId:this.stuId,
          pageNum: this.CJLBpageNum,
          pageSize: this.CJLBpageSize
        }
        this.$axiosRes1('get',this.$axiosURL.e_examination+'findExamStatisticsByStu',param).then((res)=>{
          this.KSFXList = res.examStatistics
          // 循环列表
          for (var i = 0; i < this.KSFXList.length; i++) {
            this.KSFXList[i].avgDuration1 =(this.KSFXList[i].avgDuration/60000).toFixed(2)
            this.KSFXList[i].duration1 =(this.KSFXList[i].duration/60000).toFixed(2)
            this.KSFXList[i].ggxx = this.KSFXList[i].totalScore + ' ' + '/' + ' ' + this.KSFXList[i].avgScore  + ' ' + '/' + ' ' + this.KSFXList[i].avgDuration1



            if(this.KSFXList[i].examType == '水平考试') {
              var pmdjgg = '第'+this.KSFXList[i].pdjg+'名'

            } else if (this.KSFXList[i].examType == '等级考试') {

              var pmdjgg = '第'+this.KSFXList[i].pdjg+'级'

            } else {
              var pmdjgg = this.KSFXList[i].pdjg
            }
            this.KSFXList[i].ksxx = this.KSFXList[i].userName + ' ' + '/' + ' ' + this.KSFXList[i].gainScore + ' ' + '/' + ' ' + this.KSFXList[i].duration1 +' ' + '/' + ' ' + pmdjgg
            // this.KSFXList[i].ksxx.push(this.KSFXList[i].totalScore + ' ' + '/' + ' ' + this.KSFXList[i].avgScore  + ' ' + '/' + ' ' + this.KSFXList[i].avgDuration1)
          }

          var aobj = {}
          aobj.data = []
          var num = 0
          for (var i = 0; i < this.KSFXList.length; i++) {
              aobj.data.push(this.KSFXList[i].gainScore)
              aobj.name = this.KSFXList[i].userName
              aobj.type = 'line'
          }

          this.allZXList.push(aobj)


          this.CJLBtotal = res.realCount
          this.KSFXList.forEach(item =>{
            this.allKSName.push(item.examName)
          })
          this.userNameList.push(this.XSXXform.username)
          this.$nextTick(function(){
              this.initChartCJZX()
          })

          if(this.stuName.length > 0) {
            var aindex = 0
            for (let i = 0; i < this.stuName.length; i++) {
              var param ={
                stuId:this.stuName[i],
                pageNum: this.CJLBpageNum,
                pageSize: this.CJLBpageSize
              }
              this.$axiosRes1('get',this.$axiosURL.e_examination+'findExamStatisticsByStu',param).then((res)=>{
                aindex ++
                this.otherList = []
                for (let i = 0; i < this.KSFXList.length; i++) {
                  var obj = {}
                  obj =  res.examStatistics.find((item)=>{
                    if(item.examName == this.KSFXList[i].examName){
                      return item.examName == res.examStatistics[i].examName
                    }
                  })
                  this.otherList.push(obj)
                }
                    // {
                    //     name:'考生1',
                    //     type:'line',
                    //     data: [26.4,0,40]
                    // },
                var aobj = {}
                aobj.data = []
                var num = 0
                for (var i = 0; i < this.otherList.length; i++) {
                  aobj.type = 'line'
                  if(this.otherList[i] == undefined){
                    aobj.data.push(0)
                  } else {
                    this.userNameList.push(this.otherList[i].userName)
                    aobj.name = this.otherList[i].userName
                    aobj.data.push(this.otherList[i].gainScore)
                  }
                  // console.log(this.otherList[i].name)
                }
                this.allZXList.push(aobj)
                console.log(this.allZXList,1111111111111)
                for (let i = 0; i < this.KSFXList.length; i++) {
                    for (let j = 0; j < this.otherList.length; j++) {
                      if(this.otherList[j] !== undefined && this.KSFXList[i].examName == this.otherList[j].examName) {
                        // if(this.otherList[j].examType == '水平考试') {
                        //   var pmdjgg = ' '
                        // } else if (this.otherList[j].examType == '过关考试') {
                        //   var pmdjgg = ' ' + '/' + ' ' + this.otherList[j].sumPass
                        // }

                        if(this.otherList[j].examType == '水平考试') {
                          var pmdjgg = '第'+this.otherList[j].pdjg+'名'

                        } else if (this.otherList[j].examType == '等级考试') {

                          var pmdjgg = '第'+this.otherList[j].pdjg+'级'
                          
                        } else {
                          var pmdjgg = this.otherList[j].pdjg
                        }

                        this.otherList[j].duration1 =(this.otherList[j].duration/60000).toFixed(2)
                        this.KSFXList[i]['ksxx' + aindex] = this.otherList[j].userName + ' ' + '/' + ' ' + this.otherList[j].gainScore + ' ' + '/' + ' ' + this.otherList[j].duration1  + pmdjgg
                      }
                    }
                }

              })

            }

            // this.ashow = false
            var obj1 ={}
            var obj2 ={}
            var obj3 ={}
            setTimeout(()=>{

              for (let i = 0; i < this.KSFXList.length; i++) {
                if(this.KSFXList[i].ksxx1){
                  obj1.prop = 'ksxx1'
                }
                if(this.KSFXList[i].ksxx2){
                  obj2.prop = 'ksxx2'
                }
                if(this.KSFXList[i].ksxx3){
                  obj3.prop = 'ksxx3'
                }
              }
              this.cols.push(obj1,obj2,obj3)
              var arrs = []
              for (var i = 0; i < this.cols.length; i++) {
                if(this.cols[i].prop){
                  arrs.push(this.cols[i])
                }
              }
              this.cols = arrs
              for (var i = 0; i < this.allZXList.length; i++) {
                console.log(this.allZXList[i].name)
                this.userNameList.push(this.allZXList[i].name)
              }
              this.$nextTick(function(){
                  this.initChartCJZX()
              })
            },500)  
          }

          // var aobj1 = {}
          //     aobj1.data = []
          //     var num = 0
          //     for (var i = 0; i < this.KSFXList.length; i++) {
          //         aobj1.type = 'line'
          //         this.userNameList.push(this.KSFXList[i].userName)
          //         aobj1.name = this.KSFXList[i].userName
          //         aobj1.data.push(this.KSFXList[i].gainScore)
          //     }

          //     this.allZXList.push(aobj1)
          //     console.log(this.allZXList,3393)
          //     this.$nextTick(function(){
          //         this.initChartCJZX()
          //     })
        })

      },
      CJLBhandleSizeChange(val) {
        this.CJLBpageSize = val
        this.ksdbSearch()

      },
      // 当前页
      CJLBhandleCurrentChange(val) {
        this.CJLBpageNum = val
          this.ksdbSearch()
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
          username:this.formInline.KSXM,
          sex:this.formInline.XB,
          deptId:this.formInline.BM,
          profession:this.formInline.KSXS,
          phone:this.formInline.SJHM,
          enabled:this.formInline.ZHZT,
          start:(this.pageNum-1) * this.pageSize,
          length:this.pageSize
        }
        this.$axiosRes1('get',this.$axiosURL.u_user+'users',param).then((res)=>{
            this.tableData = res.data
            this.total = res.total
        })
      },
      dataInit:function(){
        this.$axiosRes1('get',this.$axiosURL.u_user+'depts/all','').then((res)=>{
            this.BMdata = res
        })
        this.$axiosRes1('get',this.$axiosURL.u_user+'profession/all','').then((res)=>{
            this.ZYdata = res
        })
      },
      initChartCJZX(){
        this.$echarts.init(this.$refs.CJZXcharts).showLoading();
        this.$echarts.init(this.$refs.CJZXcharts).hideLoading();
        var option = {
                // color: colors,

                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: this.userNameList
                },

                grid: {
                    top: 70,
                    bottom: 50
                },
                toolbox: {
                    show: true,
                    feature: {

                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },               
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                // color: colors[1]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '考试  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: this.allKSName
                    },
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                // color: colors[0]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '分数  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                      name:'分数',
                      type: 'value',
                      // y轴数据 显示内容
                      axisLabel: {
                          // formatter: '{value} °C'
                      }
                    },                
                ],
                series: this.allZXList
        }
        this.$echarts.init(this.$refs.CJZXcharts).setOption(option,true);
      }
  },
  mounted:function(){
    this.findPaperPage()
    this.dataInit()
      this.$axiosRes1('get',this.$axiosURL.u_user + 'depts/all').then((res)=>{
          this.BMList = res

      })
  }
}
</script>
<style scoped>
    .chart-box {
      min-height: 300px;
      background-color: #fff
    }
</style>