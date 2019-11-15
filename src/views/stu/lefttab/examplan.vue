<template>
    <div>
        <el-table :data="KSXXtable" border style="width: 100%;margin-top: 20px" max-height="390" size='mini'>
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

        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-size="pageSize" :total="1000" layout="prev, pager, next">
        </el-pagination>

    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      KSdata : this.$store.state.KSdata,
      isChoose:1,
      isAddZSD:false,
      KSXXtable:[],
      pageNum:1,  //页码
      pageSize:5,  //每页数量
    }
  },
  computed: {
      ...mapState(['loginUser']),
  },
  methods: {
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
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.date.getMonth() + 1) + '-'
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
     initData:function(){
        this.findPaperPage()
     },

     findPaperPage:function(){
      var param ={
          stuId:this.loginUser.id,
          skip:(this.pageNum-1) * this.pageSize,
          limit:this.pageSize
        }
        this.$axiosStuRes1('post',this.$axiosURL.e_examination+'findByStuId',param).then((res)=>{
          console.log(444,res); //需要返回总页码
          if (typeof(res.length) != 'undefined') {
            this.KSXXtable = res
          }
        })
     },  
  },

   created:function(){
     this.initData()
  },
  mounted:function(){
  },


}
</script>