<template>
  <div class="more change">
    <indexTop/>
    <div class="more_backg">
      <div class="more_title">
        {{title}}
      </div>
      <div class="more_table">
        <el-table
            v-if='lx == 0'
            :data="RMSPtable"
            border
            style="width: 100%;margin-top: 20px"
            max-height="500"
            @row-click="clickRMSPtable"
            size='mini'>
             <el-table-column
                type="index"
                width="50">
              </el-table-column>
            <el-table-column prop="fileTitle" label="视频标题" >
            </el-table-column>
            <el-table-column prop="browsingNum" label="浏览量" >
            </el-table-column>
        </el-table>
        <el-table
            v-if='lx == 1'
            :data="RMZSDtable"
            border
            style="width: 100%;margin-top: 20px"
            max-height="500"
            size='mini'>
             <el-table-column
                type="index"
                width="50">
              </el-table-column>
            <el-table-column prop="kpName" label="关键字名称" >
            </el-table-column>
            <el-table-column prop="heatNum" label="热度" >
            </el-table-column>
        </el-table>
        <el-table
            v-if='lx == 2'
            :data="RMSStable"
            border
            style="width: 100%;margin-top: 20px"
            max-height="500"
            size='mini'>
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column prop="keyword" label="关键字" >
            </el-table-column>
            <el-table-column prop="num" label="搜索次数" >
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{UTCtoDate(scope.row.createTime)}}
              </template>
            </el-table-column>
        </el-table>
        <el-table
            v-if='lx == 3||lx == 4'
            :data="tableData"
            border
            style="width: 100%;margin-top: 20px"
            max-height="600"
            @row-click="clickRMSPtable"
            size='mini'>
             <el-table-column
                type="index"
                width="50">
              </el-table-column>
            <el-table-column prop="fileTitle" label="视频标题" >
            </el-table-column>
            <el-table-column prop="browsingNum" label="浏览量" >
            </el-table-column>
        </el-table>
        <div style='bottom:74px;position:absolute;width:71%' v-if='lx == 0||lx == 1||lx == 2'>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            :total="total"
            layout=" sizes, prev, pager, next">
          </el-pagination>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import indexTop from '../unit/index_top.vue'
export default {
  name: 'index',
  components:{
    indexTop
  },
  data () {
    return {
      lx:0,
      title:'',
      RMSPtable:[],
      RMZSDtable:[],
      RMSStable:[],
      tableData:[],
      pageNum:1,  //页码
      pageSize:10,  //每页数量
      total:10,
      studentLoginUser:{},
      student_aId:'',
    }
  },

  methods: {
    clickRMSPtable:function(row){
      localStorage.setItem('LSKJ',JSON.stringify(row))
      console.log(this.$store.state.LSZL);
      const route = this.$router.resolve({name:'classRoom'})
      window.open(route.href,'_blank',)
      //window.open(href,'_blank','toolbar = yes,width=1300,height=800,')
      //this.$router.push({name:'classRoom',params:{data:row}})
      //this.$bus.$on('clickRMS',row)
    },
    UTCtoDate:function(date){
      return this.$tools.UTCtoDate(date)
    },
    initData:function(){
      this.lx = this.$route.params.lx||localStorage.getItem('morelx')
      this.findPaperPage()
    },
    findPaperPage:function(){
      if (this.lx == 0) {
        this.title = '热门视频排行'
        var a = []
        this.$axiosStuResBody('post',this.$axiosURL.f_file+'hotVideo',{pageNum:this.pageNum,pageSize:this.pageSize}).then((res)=>{
          this.RMSPtable  = res.data
          this.total = res.total
      }).then(()=>{ 
        this.RMSPtable.forEach((element, index)=> {
          this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+element.userId+'/find',{}).then((res)=>{
              element['userName'] = res.name
          }).then(()=>{
              this.$axiosStuRes1('get',this.$axiosURL.K_knowledgePoint+element.kpointId,{}).then((res)=>{
                element['ZSDname'] = res.name
            }).then(()=>{
              a.push(element)
            })
          })
        });
      }).then(()=>{
        this.RMSPtable = a
      })
      } else if(this.lx == 1){
        this.title = '知识点热度排行'
        this.$axiosStuRes1('get',this.$axiosURL.k_common+'get/hotPointsRanking',{pageNum:1,pageSize:6}).then((res)=>{
          this.RMZSDtable  = res
        })
      }else if(this.lx == 2){
        this.title = '热门搜索排行'
        this.$axiosStuResBody('post',this.$axiosURL.f_file+'hotSearch',{pageNum:this.pageNum,pageSize:this.pageSize}).then((res)=>{
            this.RMSStable = res.data
            this.total = res.total
            console.log(this.RMSStable);
        })
      }else if(this.lx == 3){
        this.title = '我的订阅'
        //查询用户订阅
        this.$axiosStuRes1('get',this.$axiosURL.K_neoUser+this.student_aId+'/all/subscribedPoints',{}).then((res)=>{
          this.tableData = []
          res.forEach( (element, index)=> {
            console.log(55,element.id);
            var params = {
              pageNum:  1,
              pageSize: 50,
              fileTitle: '',
              kpointId: element.id,
              fileType: '',
              firTime: '',
              endTime: ''
            }
            this.$axiosStuResBody('post',this.$axiosURL.f_file+'list/null' ,params).then((res)=>{
            if(res.data !==null){
                this.tableData = this.tableData.concat(res.data)
              }
            })
          });
        })
      }else if(this.lx == 4){
        this.title = '我的收藏'
        //查询用户收藏
        this.$axiosStuRes1('get',this.$axiosURL.f_file+'selectCollectFile/'+this.studentLoginUser.id,'').then((res)=>{
          this.tableData =res
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
  },
 
  created:function(){
    this.studentLoginUser = JSON.parse(localStorage.getItem('loginUser'))
    this.student_aId = localStorage.getItem('student_aId')
  },
  mounted:function(){
    this.initData()
  },


}
</script>


<style scoped>
.more{
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  min-height: max-content;
  min-height: -moz-max-content;
}
.more_backg{
  margin: 0 auto;
  margin-top: 45px;
  width: 80%;
  height: 750px;
  background-size: 100% 100%;
}
.more_title{
  padding-top: 40px;
  font-size: 30px;
  color: #fff;
}
.more_table{
  width: 90%;
  margin:0 auto;
}

</style>
