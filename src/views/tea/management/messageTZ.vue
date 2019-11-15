<template>
  <div class="teatable">
    <el-table
      :data="XXTZList"
      border
       height="500"
      >
      <el-table-column
        prop="content"
        label="消息内容"
        >
      </el-table-column>
      <el-table-column
        prop="createTimes"
        label="创建时间"
        >
      </el-table-column>
    </el-table>
<!--     <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination> -->
  </div>
</template>
<script>
export default {
  data(){
      return {
        XXTZList: [],
        pageNum:1,  //页码
        pageSize:5,  //每页数量
        total:20,   //总数
      }     
    },
  methods: {
    handleSizeChange(val) {
      this.pageNum = 1
      this.pageSize = val
      this.findMessage()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.findMessage()
    },
    findMessage(){
      var params = {
        userId:this.$store.state.aId,
        pageSize: this.pageSize,
        pageNum: (this.pageNum-1) * this.pageSize
      }
      this.$axiosRes1('post',this.$axiosURL.n_notice+'findPage', params).then((res)=>{
        this.XXTZList = res.list
        this.XXTZList.forEach(v => {
          // v.createTime
          var d = new Date(v.createTime)
          var month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() +1) : d.getMonth() + 1
          var day = d.getDate() < 10 ? '0' +  d.getDate() :  d.getDate()
          var hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
          var minutes = d.getMinutes() < 10 ? '0' +  d.getMinutes() :  d.getMinutes()
          var seconds = d.getSeconds() < 10 ? '0' +  d.getSeconds() :  d.getSeconds()

          var times = d.getFullYear() + '-' + (month) + '-' + day + '  ' + hours + ':' + minutes + ':' + seconds
          // d.getMonth() + 1 < 10 ? '0' + (d.getMonth() +1) : d.getMonth() + 1
          v.createTimes = times
        })
        this.total = res.total
        console.log(this.XXTZList);
      })
    }
  },
  mounted:function(){
    this.findMessage()
  }
}
</script>
<style scoped>
    .chart-box {
      min-height: 300px;
      background-color: #fff
    }
</style>