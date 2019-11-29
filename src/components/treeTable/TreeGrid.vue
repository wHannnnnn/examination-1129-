<template>
<div>
  <div id="grid">
  <el-table
    :data="data"
    border
    style="width: 100%"
    @select-all="checkChangeAll"
    @select="checkChange"  
    :row-class-name="showTr"
    >
<!--     <el-table-column
      type="selection"
      width="55"
      >
    </el-table-column> -->
    <el-table-column :show-overflow-tooltip="true" v-for="(column, index) in columns" :key="column.dataIndex"
      :label="column.text" :type="column.type">
      <template scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <button style="border:0;background:transparent;outline:none;" class="button is-outlined is-primary is-small " v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
          <i style="color: #333" v-if="!scope.row._expanded" class="el-icon el-icon-arrow-right" aria-hidden="true"></i>
          <i style="color: #333" v-if="scope.row._expanded" class="el-icon el-icon-arrow-right el-table__expand-icon--expanded" aria-hidden="true"></i>
        </button>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        {{scope.row[column.dataIndex]}}
      </template>
    </el-table-column>

    <el-table-column label="操作" v-if="treeType === 'normal'" width="260">
      <template scope="scope">
        <button type="button" class="el-button el-button--success el-button--mini" @click="addPoints(scope.row.id, scope.$index, scope.row.khId)">新增</button>
        <button type="button" class="el-button el-button--warning el-button--mini" @click="editPoint(scope.row.id, scope.$index, scope.row.khId)">修改</button>
        <button type="button" class="el-button el-button--danger el-button--mini" @click="deletePoint(scope.row.id, scope.$index, scope.row.khId)">删除</button>
      </template>
    </el-table-column>
  </el-table>
  </div>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
      
    <el-dialog title="新增知识点" :before-close="handleClose" :visible.sync="knowPointsShow">
      <el-form :model="XZPointsForm" ref="XZPointsForm" >
        <el-form-item label="知识点名称" prop="name">
          <el-input v-model="XZPointsForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="知识点编号" prop="kpId">
          <el-input v-model="XZPointsForm.kpId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重要程度" prop="pointImportantLevel">
          <el-select v-model="XZPointsForm.pointImportantLevel" placeholder="请选择重要程度">
              <el-option v-for="item in initData.point_important_level" :label="item.dictName" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="XZsubmint('XZPointsForm')">确认</el-button>
          <el-button @click="QXsubmit">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  <!-- @keyup.enter.native="XGsubmint('XGPointsForm')" -->
    <el-dialog title="修改知识点" :visible.sync="XGknowPointsShow">
      <el-form :model="XGPointsForm" :rulesXG="rules" ref="XGPointsForm" >
        <el-form-item label="知识点名称" prop="name">
          <el-input v-model="XGPointsForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="知识点编号" prop="khIdandkpId">
          <el-input v-model="XGPointsForm.khIdandkpId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重要程度" prop="pointImportantLevel"  v-if="handleType === 'points'">
          <el-select v-model="XGPointsForm.pointImportantLevel" placeholder="请选择难易程度">
                  <el-option v-for="item in initData.point_important_level" :label="item.dictName" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目描述" v-if="handleType === 'subject'">
          <el-input v-model="XGPointsForm.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="XGsubmint('XGPointsForm')">确认</el-button>
          <el-button @click="XGknowPointsShow = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</div>
</template>
<script>
  import Utils from './utils/index.js'
//  import Vue from 'vue'
  export default {
    name: 'tree-grid',
    props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {
        knowPointsShow: false,
        XGknowPointsShow: false,
        handleType: 'points',
        // 总条数
        total: 0,
        // 每页条数
        pageSize: 5,
        // 当前页码
        pageNum: 1,
        // 这是相应的字段展示
        columns: [
          {
            text: '知识点名称',
            dataIndex: 'name'
          },
          {
            text: '重要程度',
            dataIndex: 'pointImportantLevel1'
          },
          {
            text: '创建人',
            dataIndex: 'neoUserName'
          },
          {
            text: '创建时间',
            dataIndex: 'createTimes'
          },
        ],
        // 这是数据源
        dataSource: [],
        changeID: 0,
        changdeIndex: 0,
        changdelevel: true,
        // 搜索的关键字
        searchVal: '',
        // 新增知识结点表单
        XZPointsForm: {
            name: '',
            kpId: '',
            pointImportantLevel: '',
            logo: null,
            createUserID: null,
            createTime: null
        },
        XGPointsForm: {
            name: '',
            khIdandkpId: '',
            pointImportantLevel: '',
            content: '',
            logo: null
        },
        rules: {
          name: [
            { required: true, message: '请输入知识点名称', trigger: 'change' }
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          kpId: [
            { required: true, message: '请输入知识点编号', trigger: 'change' }
          ],
          pointImportantLevel: [
            { required: true, message: '请选择层级', trigger: 'change' }
          ]
        },
        rulesXG: {
          name: [
            { required: true, message: '请输入知识点名称', trigger: 'change' }
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          khIdandkpId: [
            { required: true, message: '请输入知识点编号', trigger: 'change' }
          ],
          pointImportantLevel: [
            { required: true, message: '请选择层级', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请选择难度', trigger: 'change' }
          ]
        },
        initData:{}
      }
    },
    computed: {
    // 格式化数据源
      data: function () {
        // let this = this
        if (this.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(this.dataSource, null, null, this.defaultExpandAll)
          for (var i = 0; i < data.length; i++) {
            // 知识点难度转换
            if(data[i].pointImportantLevel) {
              var obj ={}
              obj = this.$store.state.dictionarys.point_important_level.find((item)=>{
                return item.value == data[i].pointImportantLevel
              })
              data[i].pointImportantLevel1 = obj.dictName 
            }
            if(data[i].createTime) {
              data[i].createTimes = this.timestampToTime(data[i].createTime) 
            }
            // 学科难度转换
            
          }
          return data
        }
        return this.dataSource
      }
    },
    mounted(){
      this.$axiosGet(this.$axiosURL.b_dictionarys,{}).then((res)=>{
        this.$store.state.dictionarys = res;
        this.initData = this.$store.state.dictionarys
      })
      this.getTableTree()
    },
    methods: {
      search(val,pageNum,pageSize){
        var params = {
          name: val,
          pageNum: pageNum,
          itemSize: pageSize
        }
        this.$axiosRes('get',this.$axiosURL.k_knowledgePoint+'findLike', params).then((res)=>{
          console.log(res)
          this.dataSource = res.entities
          this.total = res.total
          this.searchVal = val
        })
      },
      // 获取数据
      getTableTree(val){
        var params = {
          pageNum: this.pageNum,
          itemSize: this.pageSize
        }
        this.$axiosRes('get',this.$axiosURL.k_knowledgeHierachy+ '2/all/pageable',params).then((res)=>{
        console.log(res)

        this.searchVal = val
        this.dataSource = res.entities
        this.total = res.total
        })
      },
      // 分页部分
      // 每页条数
      handleSizeChange(val) {
          this.pageSize = val
          // this.getTableTree()
          if(this.searchVal == '' || this.searchVal == undefined){
            this.getTableTree()
          } else {
            this.search(this.searchVal,this.pageNum,this.pageSize)
          }
      },
      // 当前页
      handleCurrentChange(val) {
          this.pageNum = val
          // this.getTableTree()
          if(this.searchVal == '' || this.searchVal == undefined){
            this.getTableTree()
          } else {
            this.search(this.searchVal,this.pageNum,this.pageSize)
          }
      },
      // prevClick(val) {

      // },
      // nextClick(val) {

      // },
    // 显示行
      showTr: function (row) {
        console.log(row)
        let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
        row.row._show = show
        return show ? '' : 'asdasd'
      },
    // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
    // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
    // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (me.treeStructure && index === 0 && record.knowledgePoints && record.knowledgePoints.length > 0) {
          return true
        }
        return false
      },
      // 新增知识点
      addPoints(id,index,level){
        console.log(id)
        this.changeID = id
        this.changdeIndex = index
        if(level) {
          this.changdelevel = true
        } else {
          this.changdelevel = false          
        }
        this.knowPointsShow = true
        // var params = {
        //   mainpointId: id,
        //   subPoint:{
        //     name:'aa',
        //     kpId: 11
        //   }
        // }

      },
      handleClose(){
         this.XZPointsForm = {
          name: '',
          kpId: '',
          pointImportantLevel: '',
          createUserID: null,
          createTime: ''
        }
        this.knowPointsShow = false 
      },
      QXsubmit(){
        this.XZPointsForm = {
          name: '',
          kpId: '',
          pointImportantLevel: '',
          createUserID: null,
          createTime: ''
        }
        this.knowPointsShow = false
      },
      // 新增知识点提交
      XZsubmint(formName){
        // console.log(this.changeID)
        this.$refs[formName].validate((valid) => {
          if(this.XZPointsForm.name == '') {
            this.$message({
              type: 'warning',
              message: '学科名称不能为空!'
            });
            return
          }
          if(this.XZPointsForm.kpId == '') {
            this.$message({
              type: 'warning',
              message: '学科编号不能为空!'
            });
            return
          }
          if(this.XZPointsForm.pointImportantLevel == '') {
            this.$message({
              type: 'warning',
              message: '请选择学科重要程度!'
            });
            return
          }
          if (valid) {
            if(this.changdelevel == true) {
              this.XZPointsForm.createTime = Date.parse(new Date())
              this.XZPointsForm.createUserID = this.$store.state.aId
              var params = {
                hierachyId: this.changeID,
                mainPoint: this.XZPointsForm
              }
              // 学科下知识点添加
                this.$axiosResBody1('post',this.$axiosURL.k_knowledgeHierachy+'save/and/establish/relationship',params).then((res)=>{
                    if(this.searchVal == '' || this.searchVal == undefined) {
                      this.getTableTree()
                      console.log('空')
                    } else {
                      console.log(this.searchVal)
                    }
                   // this.data[this.changdeIndex]._expanded = true
                    // this.data[this.changdeIndex]._expanded = true
                    // params.subPoint._level = 
                    // this.data.splice(this.changdeIndex+1, 0, params.subPoint)
                    // console.log(this.data)
                })              
              console.log('11111111')
            } else {
              // 知识点下知识点添加
                this.XZPointsForm.createTime = Date.parse(new Date())
                this.XZPointsForm.createUserID = this.$store.state.aId
                var params = {
                  mainpointId: this.changeID,
                  subPoint: this.XZPointsForm
                }
                this.$axiosResBody1('post',this.$axiosURL.k_knowledgePoint+'save/and/establish/relationship',params).then((res)=>{
                  if(this.searchVal == ''|| this.searchVal == undefined){
                    this.getTableTree()
                  } else {
                    this.search(this.searchVal,this.pageNum,this.pageSize)
                  }
                   // this.data[this.changdeIndex]._expanded = true
                    // this.data[this.changdeIndex]._expanded = true
                    // params.subPoint._level = 
                    // this.data.splice(this.changdeIndex+1, 0, params.subPoint)
                    // console.log(this.data)
                })
            }
            this.XZPointsForm = {
              name: '',
              kpId: '',
              pointImportantLevel: '',
              logo: null,
              createUserID: null,
              createTime: ''
            }
            this.knowPointsShow = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 修改知识点学科
      XGsubmint(formName){
        // console.log(this.changeID)
        this.$refs['XGPointsForm'].validate((valid) => {
          if(this.XGPointsForm.name == '') {
            this.$message({
              type: 'warning',
              message: '知识点名称不能为空!'
            });
            return
          }
          if(this.XGPointsForm.khIdandkpId == '') {
            this.$message({
              type: 'warning',
              message: '知识点编号不能为空!'
            });
            return
          }
          // if(this.XGPointsForm.content == '') {
          //   this.$message({
          //     type: 'warning',
          //     message: '请填写科目描述!'
          //   });
          //   return
          // }
          if (valid) {
            if(this.changdelevel == true) {
              var aupdateTime = Date.parse(new Date())
              var params = [{
                id: this.changeID,
                khId: this.XGPointsForm.khIdandkpId,
                name: this.XGPointsForm.name,
                content: this.XGPointsForm.content,
                logo: this.XGPointsForm.null,
                updateTime: aupdateTime,
                updateUserID: this.$store.state.aId
              }]
              // 学科修改
             this.$axiosResBody1('put',this.$axiosURL.k_knowledgeHierachy + 'update',params).then((res)=>{
                  if(this.searchVal == ''|| this.searchVal == undefined){
                    this.getTableTree()
                  } else {
                    this.search(this.searchVal,this.pageNum,this.pageSize)
                  }
             })      
            } else {
              // 知识点下知识点修改
              var aupdateTime = Date.parse(new Date())
                var params = [{
                  id: this.changeID,
                  kpId: this.XGPointsForm.khIdandkpId,
                  name: this.XGPointsForm.name,
                  pointImportantLevel: this.XGPointsForm.pointImportantLevel,
                  updateTime: aupdateTime,
                  updateUserID: this.$store.state.aId
                }]
                this.$axiosResBody1('put',this.$axiosURL.k_knowledgePoint + 'update',params).then((res)=>{
                  if(this.searchVal == ''|| this.searchVal == undefined){
                    this.getTableTree()
                  } else {
                    this.search(this.searchVal,this.pageNum,this.pageSize)
                  }
                })
            }
            this.XGknowPointsShow = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      editPoint(id, index, level){
        // this.$axiosRes('post',this.$axiosURL.k_knowledgePoint+'save',params).then((res)=>{
        //   console.log(res)
        //   // this.dataSource = res
        // })
        // this.search()
        this.changeID = id
        if(level) {
          // 学科编辑
          this.changdelevel = true
          this.handleType = 'subject'
          this.$axiosRes('get',this.$axiosURL.k_knowledgeHierachy + id ).then((res)=>{
            console.log(res)
            this.XGPointsForm.name = res.name
            this.XGPointsForm.khIdandkpId = res.khId
            this.XGPointsForm.pointImportantLevel = res.pointImportantLevel
            this.XGPointsForm.content = res.content
          })
        } else {
          // console.log('asd')
          // 知识点编辑
          this.changdelevel = false          
          this.handleType = 'points'
          this.$axiosRes('get',this.$axiosURL.k_knowledgePoint + id ).then((res)=>{
            console.log(res)
            this.XGPointsForm.name = res.name
            this.XGPointsForm.khIdandkpId = res.kpId
            this.XGPointsForm.pointImportantLevel = res.pointImportantLevel

          })
        }
        this.XGknowPointsShow = true
        console.log(this.XGPointsForm)
      },
      // 删除知识点
      deletePoint(id, index, level){
        this.$confirm('此操作将永久删除该知识点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(level) {
            // 学科删除  重新获取数据
            this.$axiosRes('delete',this.$axiosURL.k_knowledgeHierachy + id ).then((res)=>{
              var newarr = this.data[index]
              if(newarr.knowledgePoints.length > 0) {
                  newarr._expanded = false
              }
              // this.data.splice(index,1)
              if(this.searchVal == '' || this.searchVal == undefined){
                this.getTableTree()
              } else {
                this.search(this.searchVal,this.pageNum,this.pageSize)
              }
            })
          } else {
            // 知识点删除  this.data页面数据删除
            this.$axiosRes('delete',this.$axiosURL.k_knowledgePoint + id ).then((res)=>{
              var newarr = this.data[index]
              if(newarr.knowledgePoints.length > 0) {
                  newarr._expanded = false
              }
              this.data.splice(index,1)
            })
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 创建学科
      addPoint(params){
        // this.$axios({
        //   method: 'POST',
        //   url: this.$axiosURL.k_knowledgeHierachy+'save',
        //   data: params
        // }).then((res)=>{
        //   // console.log(res)
        //   this.getTableTree()
        // })
        this.$axiosResBody('post',this.$axiosURL.k_knowledgeHierachy+'save',params).then((res)=>{
            console.log(res)
            this.getTableTree()
        })
      },
      // 多选
      checkChange(val){
        var arr=[]
        if(val.length>0){
          for(let i=0;i<val.length;i++){
            arr.push(val[i].id)
          }
          // console.log(arr)
        }
      },
      // 时间转换
      timestampToTime(timestamp){
        var date = new Date(timestamp)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.date.getMonth() + 1) + '-'
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
        var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return Y + M + D + h + m + s
      },
      // 全选
      checkChangeAll(val){
        var arr=[]
        if(val.length > 0){
          for(let i=0;i<val.length;i++){
            arr.push(val[i].id)
          }
          // console.log(arr)
        }
      }
    }
  }
</script>
<style>
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    line-height: 1;
    width: 18px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
  .el-table__expand-icon--expanded {
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
}
#grid .el-table__body .el-table__row td:first-child .cell{
  text-align: left
}
.asdasd{
  display: none
}
</style>
