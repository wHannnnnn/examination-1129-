<template>
  <div class="teatable">
    <div style="margin: 10px">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
          <!-- 关键字 -->
          <el-form-item v-show="qiehuan == true">
            <el-input v-model="formInline.CXGJZ" placeholder="请输入查询关键字" size="mini"></el-input>
          </el-form-item>
          <!-- 高级 -->
            <el-form-item  v-show="qiehuan == false">
              <el-input v-model="formInline.KJMC" placeholder="课件名称"></el-input>
            </el-form-item>

              <el-form-item  v-show="qiehuan == false">
                  <el-cascader
                    placeholder="选择知识点"
                     size="mini"
                    :options="ZSDFL"
                    :props="ZSDprops"
                    ref="cascader2"
                    v-model="XZknowPoints"
                    :show-all-levels="false"
                    filterable
                    change-on-select
                   >
                  </el-cascader>
              </el-form-item>

            <el-form-item v-show="qiehuan == false">
              <el-select v-model="formInline.WJLX" placeholder="文件类型">
                <el-option v-for = 'item in this.$store.state.dictionarys.file_info'
                  v-if="item.value != 2"
                  :key="item.dictName"
                  :label="item.dictName"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-show="qiehuan == false">
              <el-date-picker
                v-model="formInline.RQ"
                value-format="timestamp"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
               >
              </el-date-picker>
            </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="CZSearch">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="gjqh">高级切换</el-button>
          </el-form-item>
        </el-form>
        <unit_button :msg='XJ' @click.native='clickXJ'></unit_button>
        <unit_button :msg='PLSC' @click.native='clickPLSC'></unit_button>
        <unit_button :msg='XSXSZ' @click.native='clickXSXSZ'></unit_button>
    </div>
      <el-table
        ref="multipleTable"
        :data="kjglList"
        border
        v-loading="listLoading"
        @row-click='rowClick'
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="id"
          type="selection"
         > 
        </el-table-column>
        <el-table-column label="图片" width="100">
          <template slot-scope="scope">
            <img :src="imgSrc(scope.row.sourceAsMap?scope.row.sourceAsMap:scope.row)" style="width: 100%;height:100%">
          </template>
        </el-table-column>
        <el-table-column label="标题" >
          <template slot-scope="scope">
            {{scope.row.sourceAsMap?scope.row.sourceAsMap.fileTitle:scope.row.fileTitle}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="summary" label="内容" >
        </el-table-column> -->
        <el-table-column prop="ZSDname" label="知识分类" v-if='columnIsShow(1)'>
        </el-table-column>
        <el-table-column label="上传时间" v-if='columnIsShow(2)'>
          <template slot-scope="scope">
            {{UTCtoDate(scope.row.sourceAsMap?scope.row.sourceAsMap.updateTime:scope.row.updateTime)}}
          </template> 
        </el-table-column>
        <el-table-column label="下载量" v-if='columnIsShow(3)'>
          <template slot-scope="scope">
            {{scope.row.sourceAsMap?scope.row.sourceAsMap.downloadNum:scope.row.downloadNum}}
          </template>
        </el-table-column>
        <el-table-column  label="浏览量" v-if='columnIsShow(4)'>
          <template slot-scope="scope">
            {{scope.row.sourceAsMap?scope.row.sourceAsMap.browsingNum:scope.row.browsingNum}}
          </template>
        </el-table-column>
        <el-table-column  label="收藏次数" v-if='columnIsShow(5)'>
          <template slot-scope="scope">
            {{scope.row.sourceAsMap?scope.row.sourceAsMap.collectionNum:scope.row.collectionNum}}
          </template>
        </el-table-column>
        <el-table-column  label="文件类型" v-if='columnIsShow(6)'>
          <template slot-scope="scope">
            {{filetypeName(scope.row.sourceAsMap?scope.row.sourceAsMap.fileType:scope.row.fileType)}}
          </template> 
        </el-table-column>
        <el-table-column  prop="userName"  label="上传人" v-if='columnIsShow(7)'>
        </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  
      <el-dialog title="学习资料上传" :visible.sync="dialogFormVisible" :show-close="false" :close-on-click-modal="false">

          <el-form :model="form">
            <el-col :span="24">
              <el-col :span="12" :offset="2">
                  <el-cascader
                    placeholder="选择知识点"
                     size="mini"
                    :options="ZSDFL"
                    :props="ZSDprops"
                    ref="cascader2"
                    v-model="XZknowPoints1"
                    :show-all-levels="false"
                    filterable
                    change-on-select
                    >
                  </el-cascader>
              </el-col>
              <el-col :span="12">

              </el-col>
            </el-col>
          </el-form>


        <div class="top" v-for = "(item, index) in fileList">
          <el-row>
  <!--           <el-col :span="3">      
              <div class="wjimg">
                <img src="../../assets/img/171.png" width="100%">
              </div>
            </el-col> -->
              <el-col :span="8" :offset="2">
                <div class="zlnr xxzlsc">
                  <el-input v-model="item.name" placeholder="文件名称自动获取" :disabled="true"></el-input>
                  <el-input v-model="item.keyword" placeholder="关键字" @input="updateInput"></el-input>
                </div>
              </el-col>

              <el-col :span="8" :offset="3">
                <div class="zlnr xxzlsc">
                  <el-input v-model="item.fileTitle" placeholder="文件标题" @input="updateInput"></el-input>
                  <el-select v-model="readType[index]" placeholder="资料可见范围" size="small">
                    <el-option label="考生可见" value="1"></el-option>
                    <el-option label="全部用户可见" value="0"></el-option>
                  </el-select>
                </div>
              </el-col>              

          </el-row>
        </div>
        <div class="tjwj" v-if="this.XZknowPoints1[this.XZknowPoints1.length - 1] > 0">
      <el-col :span="9" :offset="2">
            <el-upload
              class="upload-demo"
              ref="fileUpload"
              :action="this.$axiosURL.f_upload+'studyMaterials/' + this.XZknowPoints1[0] + '/' + this.XZknowPoints1[this.XZknowPoints1.length - 1] + '/' + this.$store.state.aId"
              :headers="myHeaders"
              :on-preview="handlePreview"
              :on-success="handleAvatarSuccess"
              :on-error="handleError"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :on-remove="handleRemove"
              :on-change="headChange"
              accept=".jpg,.jpeg,.png,.gif,.doc,.docx,.pdf,.mp3"
              :file-list="files">
                <el-button size="small" type="primary">添加文件</el-button>
            </el-upload>
          </el-col>
            
        <el-col :span="9" :offset="2"> 
          <div id="uploader" class="wu-example">
            <div class="scsp">点击上传视频文件</div>
            <!--用来存放文件信息-->
            <div id="thelist" class="uploader-list"></div>
            <div class="btns">
                <div id="picker"></div>
            </div>
          </div>
        </el-col>


        </div>
        <div slot="footer" class="dialog-footer">
          
          <!-- <el-button @click="QXUpload" size="small">取 消</el-button> -->
          <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">确定</el-button>

        </div>
      </el-dialog>

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
  </div>
</template>

<script>
export default {
  data(){
      return {
        //按钮名称
        nowFJ:{},
        myHeaders: { Authorization: '' },
        XJ:'新建',
        PLSC:'批量删除',
        XSXSZ:'显示项设置',
        XKHYdata:[],
        ZSDFL:[],
        ZSDFLValue:'',
        form: {
          name: '',
          region: ''
        },
        uploadUrl:'',
        fileList: [],
        checked: '1',
        dialogFormVisible: false,
        dialogVisibleKJXQ: false,
        qiehuan: true,
        dates:[
        ],
        // table查询
        formInline: {
          CXGJZ:'',
          KJMC: '',
          XKHY: '',
          WJLX: '',
          RQ: null,
        },
        ZSDprops:{
          value:'id',
          label:'name',
          children:'knowledgePoints',
        },
        readType:[],
        XZknowPoints: [],
        XZknowPoints1: [],
        tableSelection:{},  //多选选中的值
        XSXSZdata:[{key:1,desc:'知识分类'},{key:2,desc:'上传时间'},{key:3,desc:'下载量'},{key:4,desc:'浏览量'},{key:5,desc:'收藏次数'},{key:6,desc:'文件类型'},{key:7,desc:'上传人'}],
        XSXSZdata1:[1,2,3,4,5,6,7],
        pageNum:1,  //页码
        pageSize:5,  //每页数量
        total:20,   //总数
        dialogVisibleXSXSZ: false,
        kjglList: [],
        checkAll: false,
        isIndeterminate: true,
        files:[],
        // 表格内容
        // tableData:null,
        btn:'',
        isuniPlayer: false,
        listLoading: false,
        changeSelect: []
      }     
  },
  methods: {
    getlocalStorage:function() {
      this.myHeaders.Authorization = 'Bearer '+ localStorage.getItem('access_token')
    },
    // 全选
    handleCheckAllChange(val){
      // 全选
      if(val == true) {
        console.log(val)
        for (var i = 0; i < this.kjglList.length; i++) {
          this.kjglList[i].isCheck = true
        }     
      } else {
        for (var i = 0; i < this.kjglList.length; i++) {
          this.kjglList[i].isCheck = false
        }  
      }
    },
    handelChange(val){
      console.log(val,339)
    },
    clickZL:function(item){
      this.nowFJ = item
      // this.dialogVisibleKJXQ = true
      // console.log(this.nowFJ,5555555)
      this.$router.push({name:'课件详情',params:{data:item}})
    },

    keysColorful:function(str,keys){
      console.log(str,keys,333)
      if(str){
        if (keys) {
          var newStr = str
          var reg =  new RegExp("("+keys+")", "g")
            newStr = newStr.replace(reg,"<font  style='color:#f01'><b>$1</b></font>")
          return newStr
        } else {
          return str
        }
      }

      
    },
    rowClick(item){
      this.nowFJ = item
      this.$router.push({ name: '课件详情', params: { data: item } })
    },
    handleSelectionChange(val){
      console.log(val)
      this.changeSelect = val
    },
    imgSrc: function (item) {
      if (item.fileType == 0 ||item.fileType == 2) {
        return  this.$BASEURL + item.videoImg
      } else if (item.fileType == 1) {
        return this.$BASEURL + item.onlinePath
      } else if (item.fileType == 3) {
        return this.$BASEURL + item.videoImg
      }
    },
    filetypeName(type){
      if (type == 0) {
        return '文档'
      } else if (type == 1) {
        return '图片'
      } else if (type == 2) {
        return '音频'
      } else if (type == 3) {
        return '视频'
      }
    },
    UTCtoDate:function(date){
        return this.$tools.UTCtoDate(date)
    },
    kjglSearch() {
      if(this.qiehuan == false){
        this.formInline.CXGJZ = ''
      }
      if(this.formInline.CXGJZ == '') {
        var gjc = 'null'
        var params = {
          data:{
            pageNum:  this.pageNum,
            pageSize: this.pageSize,
            fileTitle: this.formInline.KJMC,
            kpointId: this.XZknowPoints[this.XZknowPoints.length - 1],
            fileType: this.formInline.WJLX,
            firTime: this.formInline.RQ?this.formInline.RQ[0]:'',
            endTime: this.formInline.RQ?this.formInline.RQ[1]:''
          }
        }
      } else {
        var gjc = this.formInline.CXGJZ.trim()
        var params = {
            currentPageNum:  this.pageNum,
            perPageNum: this.pageSize,
        }
      }
      var a = []
      this.$axiosResBody('post', this.$axiosURL.Fr_es + 'anon/find/fileinfo/' + gjc, params).then((res) => {
        this.total = res.totalNum
        if(res.dataList == null){
          return res.searchHits
        } else {
           return res.dataList
        }
      }).then((data) => {
        if(data == null){
          a= []
        } else {
          data.forEach((element, index) => {
            var userid= element.userId?element.userId:element.sourceAsMap.userId
            this.$axiosRes1('get', this.$axiosURL.K_neoUser + userid + '/find', {}).then((res) => {
              element['userName'] = res.name
            }).then(() => {
              var pointid = element.kpointId?element.kpointId:element.sourceAsMap.kpointId
              this.$axiosRes1('get', this.$axiosURL.K_knowledgePoint + pointid, {}).then((res) => {
                element['ZSDname'] = res.name
              }).then(() => {
                a.push(element)
              })
            })
          });
        }
        return a
      }).then((data) => {
        this.kjglList = data
      })
    },
          // 时间转换
    timestampToTime(timestamp){
        var date = new Date(timestamp)
        console.log(timestamp,999)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
        var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return Y + M + D + h + m + s
    },
    gjqh(){
        this.qiehuan = !this.qiehuan
    },
    clickXJ:function(){
      // this.$bus.$emit('clickXJ','')
      this.dialogFormVisible = true
      
    },
     clickPLSC:function(){
      if (Object.keys(this.changeSelect).length) {
        this.$confirm('此操作将删除所有选中的信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            var arr = []
            this.changeSelect.forEach( (element, index)=> {
                arr.push(element.fileId)
            });
              console.log(arr,5656556)
              this.$axiosResBody('delete',this.$axiosURL.f_file+'deleteBatch' ,arr).then((res)=>{
                this.kjglSearch()
              })
             // var param ={
             //   id:element.id
             // }
             // this.$axiosRes1('delete',this.$axiosURL.e_examinationPaper+'delPaper',arr).then((res)=>{
                
             // })  
        }).then(() => {
           this.$message.success('删除成功')
           this.changeSelect = []
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });    
        
      }
     },
     // checkselectable:function(row,index){
     //    if (row.labels[1] =='已关联考试') {
     //      return 0
     //    }else {
     //      return 1
     //    }
     // },
      columnIsShow:function(num){
        return $.inArray(num,this.XSXSZdata1)<0 ? false : true;
      },
      clickXSXSZ:function(){
        this.dialogVisibleXSXSZ = true;

      },
      handleSizeChange(val) {
        this.pageNum = 1
        this.pageSize = val
        this.kjglSearch()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.kjglSearch()
      },
      onSubmit(){
          this.kjglSearch()
      },
      CZSearch(){
        this.formInline.CXGJZ = ''
        this.formInline.KJMC = ''
        this.formInline.XKHY = ''
        this.formInline.WJLX = ''
        this.formInline.RQ = ''
        this.XZknowPoints = []
      },
      CZSearch1(){
        this.XZknowPoints = []
      },
      paperExport(index, row){

      },
      addOrUpdateHandle(){

        this.dialogVisible = true;

      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      updateInput(e) {
        this.$forceUpdate()
      },
      handleAvatarSuccess(res,file){
        if(res == false) {
          this.$message({
            message: '文件已存在',
            type: 'warning'
          })
          this.$loading().close()
          return     
        }else{
          this.$loading().close()
          file.keyword = ''
          file.fileTitle = ''
          file.readType = ''
          this.readType.push(file.readType)
          this.fileList.push(file)
          console.log(this.files,this.fileList,555)
        }

      },
      handleError(res,file){
        console.log(res,333)
      },
      beforeRemove(file, fileList) {
        // return;
      },
      beforeUpload(file){
        const extension = file.name.split('.')[1] === 'mp4'
        if(extension){
            this.$message({
              message: '上传视频啦',
              type: 'warning'
            })

            console.log('asd')
          return !extension
        }
        this.$loading({
          lock: true,
          text: '上传文件中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },
      headChange(file, fileList) {
        if(this.XZknowPoints1 == []||this.XZknowPoints1.length==0){
            this.$message({
              message: '请选择知识点',
              type: 'warning'
            })
            return
        }
        this.files = []
        this.files.push(file)

      },
      zlSubmit(){
        if(this.readType.length > 0){
          for (var i = 0; i < this.readType.length; i++) {
            this.fileList[i].readType =  this.readType[i]
          }
        }

        console.log(this.fileList,33)

        // this.$axiosResBody2('post',this.$axiosURL.f_upload+'studyMaterials/' + this.XZknowPoints1[this.XZknowPoints1.length - 1], this.fileList).then((res)=>{
        //     console.log(res)
        // })
        // console.log(params)
      },
      QXUpload(){
        this.dialogFormVisible = false
        this.fileList = []
        this.XZknowPoints1 = []

      },
      getTreeData(data){
        for (var i = 0; i < data.length; i++) {
          if(data[i].knowledgePoints.length < 1) {
            data[i].knowledgePoints = undefined
          } else {
            this.getTreeData(data[i].knowledgePoints)
          }
        }
        return data
      },
      submitUpload() {
        console.log(this.fileList,33)
        for (var i = 0; i < this.fileList.length; i++) {
          if(this.fileList[i].keyword == ''){
              this.$message({
                message: '请填写关键字',
                type: 'warning'
              })
              return          
          }
          if(this.fileList[i].fileTitle == ''){
              this.$message({
                message: '请填写文件标题',
                type: 'warning'
              })
              return          
          }
        }
        for (var i = 0; i < this.readType.length; i++) {
          this.fileList[i].readType =  this.readType[i]
        }
        // this.uploadUrl = this.$axiosURL.f_upload+'studyMaterials/' + this.XZknowPoints1[this.XZknowPoints1.length - 1]
        // this.$refs.upload1.submit();
        this.$axiosResBody('post',this.$axiosURL.f_upload+'updateFile', this.fileList).then((res)=>{
            console.log(res)
            this.dialogFormVisible = false
            this.fileList = []
            this.XZknowPoints1 = []
            this.readType = []
        })
        this.kjglSearch()
        this.dialogFormVisible = false
      },
      // handleAvatarSuccess1(res,file){
      //   console.log(res,file,358)
      // },
  },
  mounted:function(){

   this.getlocalStorage()
    
    this.kjglSearch()
    this.$axiosRes('get',this.$axiosURL.k_knowledgeHierachy+ '0/all',{}).then((res)=>{
      console.log(2,res);
      this.XKHYdata = res;
    })
    this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
      res.forEach(ele=>{
          ele.disabled = true
      })
      this.ZSDFL = this.getTreeData(res);
    })
  },
  updated:function(){
    var $btn = $('#ctlBtn');
    var $stopBtn = $('#stopBtn');
    var $thelist = $('#thelist');
    var chunkSize = 1 * 1024 * 1024;
    var XZknowPoints1 = this.XZknowPoints1
    // var fileList = this.fileList
    var _this = this;
    // HOOK 这个必须要在uploader实例化前面 实现断点续传
    /** 实现webupload hook ,触发上传前，中，后的调用关键**/
    WebUploader.Uploader.register({
        'before-send-file': 'beforeSendFile', // 整个文件上传前
        'before-send': 'beforeSend' // 每个分片上传前
    }, {
        beforeSendFile: function (file) {
          
          console.log(_this);
          
            console.log("beforeSendFile");
            // Deferred对象在钩子回掉函数中经常要用到，用来处理需要等待的异步操作。
            var task = new $.Deferred();
            // 根据文件内容来查询MD5
            uploader.md5File(file).progress(function (percentage) {  // 及时显示进度
                _this.$loading({
                    lock: true,
                    text: '上传视频中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                console.log('计算md5进度:', percentage);

                getProgressBar(file, percentage, "MD5", "MD5");
            }).then(function (val) { // 完成
                console.log('md5 result:', val);
                file.md5 = val;
                // 模拟用户id
                // file.uid = new Date().getTime() + "_" + Math.random() * 100;
                // file.uid = WebUploader.Base.guid();
                file.uid = file.name + file.size; // 拿到上传文件的唯一名称
                console.log('file.uid: ',file.uid);
                var chunks = chunkSize ? Math.ceil( file.source.size / chunkSize ) : 1;
                //进行md5判断
                console.log(localStorage.getItem('access_token'),999999999999)
                // $.ajax({
                //   url: _this.$axiosURL.f_upload + 'check-md5',
                //   type: 'post',
                //   dataType: 'json',
                //   data: {chunks: chunks, md5: file.md5},
                //   headers: {
                //     // "Authorization": 'Bearer '+ localStorage.getItem('access_token'),
                //     // 'Content-Type': 'application/json'
                //   },
                //   // contenttype: 'application/json',
                //   success: function(data) {
                //       var d = data.data;
                //       console.log('status', d.status);
                //       console.log('message: ',d.message);
                //       var status = d.status;
                //       if (status == 101) {
                //           // 文件不存在，那就正常流程
                //           task.resolve();
                //       } else if (status == 100) {
                //           // 忽略上传过程，直接标识上传成功；
                //           uploader.skipFile(file);
                //           file.pass = true;
                //           task.reject();
                //           _this.$message({
                //             type: 'warning',
                //             message: '文件已存在'
                //           });
                //       } else if (status == 102) {
                //           // 部分已经上传到服务器了，但是差几个模块。
                //           file.missChunks = d.data;
                //           task.resolve();
                //       }
                //   }

                // })
                $.post(_this.$axiosURL.f_upload + 'check-md5', {chunks: chunks, md5: file.md5},
                    function (data) {
                        // var d = data.data;
                        console.log('status', data.data.status);
                        console.log('message: ',data.data.message);
                        var status = data.data.status;
                        if (status == 101) {
                            // 文件不存在，那就正常流程
                            task.resolve();
                        } else if (status == 100) {
                            // 忽略上传过程，直接标识上传成功；
                            uploader.skipFile(file);
                            file.pass = true;
                            task.reject();
                            _this.$message({
                              type: 'warning',
                              message: '文件已存在'
                            });
                            _this.$loading().close()
                        } else if (status == 102) {
                            // 部分已经上传到服务器了，但是差几个模块。
                            file.missChunks = data.data.data;
                            task.resolve();
                        }
                    });
            });
            return $.when(task);
        },
        // 每个分片上传前
        beforeSend: function (block , data) {
            //block 为分块数据
            var task = new $.Deferred();
            var file = block.file;  // file为分块对应的file对象
            var missChunks = file.missChunks;
            var blockChunk = block.chunk;
            console.log("当前分块：" + blockChunk + "分块大小："+ (block.end - block.start)/1024/1024 + "M");
            console.log("missChunks:" + missChunks);
            if (missChunks !== null && missChunks !== undefined && missChunks !== ''){
                var flag = true;
                for (var i = 0; i < missChunks.length; i++) {
                    if (blockChunk == missChunks[i]) {
                        console.log(file.name + ":" + blockChunk + ":还没上传，现在上传去吧。");
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    task.reject();
                } else {
                    task.resolve();
                }
            } else {
                task.resolve();
            }
            return $.when(task);
        }
    });
    /**/

    /**/


    // 实例化
    var uploader = WebUploader.create({
        pick: {
            id: '#picker',
            label: '点击选择文件'
        },
        //dnd: '#dndArea',
        //paste: '#uploader',
        swf: '../static/js/Uploader.swf',
        chunked: true, // 是否要分片处理大文件上传
        chunkSize: chunkSize, // 字节 1M分块 
        threads: 1,//上传并发数，允许同时最大上传进程数
        server: this.$axiosURL.f_upload+'studyMaterials/' + this.XZknowPoints1[0] + '/' + this.XZknowPoints1[this.XZknowPoints1.length - 1] + '/' + this.$store.state.aId, //文件接收服务端
        auto: true, //选完文件后，是否自动上传
        chunkRetry: 1, //如果摸个分片由于网络问题出错，允许自动重传多少次
        // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
        disableGlobalDnd: true,
        accept:{
          title: '视频上传',
          extensions: 'mp4,avi,wmv,flv,rmvb,3gp',
          mimeTypes: 'video/*,application/*',
          // extensions: 'mp4'
        }
//        fileNumLimit: 1024,
//        fileSizeLimit: 1024 * 1024 * 1024,    // 200 M
//        fileSingleSizeLimit: 1024 * 1024 * 1024    // 50 M
    });

    // 当有文件被添加进队列的时候
    uploader.on('fileQueued', function (file) {
        console.log("fileQueued");
        // $thelist.append('<div id="' + file.id + '" class="item">' +
        //     '<h4 class="info">' + file.name + '</h4>' +
        //     '<p class="state">等待上传...</p>' +
        //     '</div>');
    });

    //当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
    uploader.onUploadBeforeSend = function (obj, data) {
        console.log("onUploadBeforeSend");
        var file = obj.file;

        data.md5 = file.md5 || '';
        data.uid = file.uid;
        
    };
    // uploader.on('uploadBeforeSend', function (obj, data, headers) {
    //   headers = $.extend(headers,{
    //     // "Authorization": 'Bearer '+ localStorage.getItem('access_token'),
    //     'Content-Type': 'multipart/form-data'
    //   })
    // });
    // 上传中
    uploader.on('uploadProgress', function (file, percentage) {
        getProgressBar(file, percentage, "FILE", "上传进度");
    });
    // 上传返回结果
    uploader.on('uploadSuccess', (file)=>{
        var text = '已上传';
        if (file.pass) {
            text = "文件妙传功能，文件已上传。"
        }
        // $('#' + file.id).find('p.state').text(text);
        // XXXX
        this.$loading().close()
        var obj = {}
        obj.name = file.name
        obj.keyword = ''
        obj.fileTitle = ''
        obj.readType = ''

        // file.keyword = ''
        // file.fileTitle = ''
        // file.readType = ''
        this.readType.push(obj.readType)
        this.fileList.push(obj)
        console.log(this.fileList,339)

    });

    

    uploader.on('uploadError', function (file) {
        var text = "上传出错";
        if(file.pass){
            text = "文件已存在，秒传成功。";
        }
        // $('#' + file.id).find('p.state').text(text);
    });
    uploader.on('uploadComplete', function (file, response) {
        console.log(response);
        // alert(response.data);


        // 隐藏进度条
        // fadeOutProgress(file, 'MD5');
        // fadeOutProgress(file, 'FILE');
    });
    // 文件上传
    $btn.on('click', function () {
        console.log("start upload");
        uploader.upload();
        // console.log("上传成功");
    });

    $stopBtn.on('click', function () {
        console.log("pause upload...");
        uploader.stop(true);
    });
    /**
     *  生成进度条封装方法
     * @param file 文件
     * @param percentage 进度值
     * @param id_Prefix id前缀
     * @param titleName 标题名
     */
    function getProgressBar(file, percentage, id_Prefix, titleName) {
        var $li = $('#' + file.id), $percent = $li.find('#' + id_Prefix + '-progress-bar');
        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div id="' + id_Prefix + '-progress" class="progress progress-striped active">' +
                '<div id="' + id_Prefix + '-progress-bar" class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>'
            ).appendTo($li).find('#' + id_Prefix + '-progress-bar');
        }
        var progressPercentage = percentage * 100 + '%';
        $percent.css('width', progressPercentage);
        $percent.html(titleName + ':' + progressPercentage);
    }
    /**
     * 隐藏进度条
     * @param file 文件对象
     * @param id_Prefix id前缀
     */
    function fadeOutProgress(file, id_Prefix) {
        $('#' + file.id).find('#' + id_Prefix + '-progress').fadeOut();
    }
  }

}
</script>
<style scoped>
/*  .el-upload, .el-button--small, .el-button--small.is-round{
    width: 100%
  }*/
  .top {
    margin: 20px 0 10px
  }
  .tjwj {
    margin-top: 60px;
  }
  .el-select {
    width: 100%;
  }
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
  .cont{
    width: 84%;
    height: 80px;
    background-color: #44bdf42e;
    margin: 6px;
    padding: 6px;
    position: relative;
    margin-left: 30px;
  }
  .quan .el-checkbox {
    position: absolute;
    top: -5%;
    left: 0
  }
  .all {
    position: relative;
    margin-top: 20px;

  }
  .allitem {
    height: 600px;
    overflow-y: auto;
    overflow: auto;
    min-width: 1450px;
  }
  .el-checkbox{
    position: absolute;
    left: -2%;
    top: 43%
  }
  .aimg {
    float: left;
    /*width: 8%;*/
    width: 100px;
    height: 80px;
    margin-right: 10px
  }
  .aimg img {
    width: 100px;
    height: 80px;
  } 
  .aname {
    display: inline-block;
    color: #fff;
    width: 77%;
    overflow: hidden;
    height: 24%;
    line-height: 20px;
  }
  .awen, .alian {
    display: inline-block;
    width: 90%;
    overflow: hidden;
    color: #00bcf7;
    word-wrap: break-word;
    word-break: normal
}
  .awen {
    width: 90%;
    height: 44%;
    overflow-y:auto;
  }
  .alian span {
    margin-right: 40px;
    font-size: 14px
  }
  .alian .biao {
    color: #c33d3d
  }
  .wjimg {
    width: 100%;
  }
  .zlnr {
    margin-top: 10px;
  }
  .wu-example{
    position: relative;
  }
  .scsp{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 34px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    line-height: 34px;
    font-size: 12px
  }
/*  .scsp:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
    cursor: pointer;
  }*/
  .btns {
    opacity: 0;
  }
</style>