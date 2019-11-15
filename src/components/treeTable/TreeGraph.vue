<template>
<div class="tableChange" @click="clickMenu = false,clickMenu1 = false">
      <el-row :gutter="20">
        <el-col :span="24" v-for = "(index,item) in webkitDep" v-if="showFalse==true">
            <el-card>
              <div class="chart-box J_chartFocusBox"></div>
            </el-card>
        </el-col>

        <el-col :span="24" v-for = "(index,item) in webkitDep1" v-if="showFalse == false">
            <el-card>
              <div class="chart-box J_chartFocusBox1"></div>
            </el-card>
        </el-col>
      </el-row>

    <div id="menu" >
      <el-button-group v-show="clickMenu">
        <el-button type="primary" icon="el-icon-circle-plus" @click="graphAdd"></el-button>
        <el-button type="primary" icon="el-icon-delete" @click="graphdel"></el-button>
      </el-button-group>

      <el-button-group v-show="clickMenu1">
        <!-- <el-button type="primary" icon="el-icon-edit" @click="graphEdit"></el-button> -->
        <el-button type="primary" icon="el-icon-delete" @click="graphdel"></el-button>
      </el-button-group>
    </div>
<!-- 
    <div id="menu" v-show="clickMenu1">

    </div> -->

    <!-- 编辑删除表单 -->
    <el-dialog title="添加知识点" :visible.sync="graphEditDel">
<!--         <el-form-item label="活动名称">
          <el-input v-model="graphForm.name" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-row :gutter="20" type="flex"
            <el-col :span="14">
              <el-form ref="form" :model="form" label-position="left">
                <el-col :span="10">
                  <el-form-item v-if="garphAddShow == true">
                      <ele-multi-cascaders
                        :options="options"
                        v-model="form.isp1"
                        placeholder="选择知识点"
                        @change="ispChange"
                        >
                      </ele-multi-cascaders>
                  </el-form-item>
                </el-col>
  
<!--                 <el-col :span="4">
                  <el-form-item>
                      <el-button type="primary" @click="submit">查看</el-button>
                  </el-form-item>
                </el-col> -->
              </el-form>
            </el-col>
        </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="graphEdit">取 消</el-button>
        <el-button type="primary" @click="graphAddSubmit">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>
  export default {
      data () {

        return {
          graphID: null,
          dataIndex: null,
          dadID: null,
          showFalse: true,
          clickMenu: false,
          clickMenu1: false,
          graphEditDel: false,
          garphAddShow: false,
          links:[],
          webkitDep:[],
          webkitDep1:[],
          getGraphID: null,
          // 编辑删除表单
          graphForm: {
            name: '',
            region: ''
          },
          options: [],
          form: {
            isp1: []
          },
          xuekeId: null
        }
      },
      created(){
      },
      mounted () {
        // this.initChartgx()
        this.$bus.$on('graphClick',(res) =>{
          if(res.pathGraph == 0) {
            this.$message({
              message: '没有相关数据',
              type: 'warning'
            })            
            return
          } else {
            if(res.graphID == 1) {
                this.showFalse =true
                this.webkitDep = res.pathGraph
                console.log(this.webkitDep,2323)
                this.links = res.pathGraphIndex
                this.$nextTick(function(){
                  this.initChartgx()
                })
            } else {
                this.showFalse =false
                this.webkitDep1 = res.pathGraph
                this.links = res.pathGraphIndex
                // this.xuekeId = this.webkitDep1.xuekeID
                this.$nextTick(function(){
                  this.initChartgx1()
                })
                this.graphEditDel = false
            }
          }

        })

      },
      methods: {
        graphAdd(){
          this.clickMenu = false
          this.graphEditDel = true
          this.garphAddShow = true

          if(this.xuekeId) {
            // 点击添加学科数据展示
            this.$axiosRes('get',this.$axiosURL.k_knowledgeHierachy+ '0/find/'+ this.graphID +'/theOtherAll').then((res)=>{
              this.options = res
            })
          } else {
            // 点击添加知识点数据展示
            this.$axiosRes('get',this.$axiosURL.k_knowledgePoint+ '4/find/nonParentHierachies/and/excludeHaveInvolvedPoints/' + this.graphID).then((res)=>{
              this.options = res
              for (var i = 0; i < this.options.length; i++) {
                this.options[i]['disabled'] = true
              }
            })
          }
        },
        // 取消按钮
        graphEdit(){
          this.dataIndex = null
          this.xuekeId = null
          this.form.isp1 = []
          this.graphEditDel = false
          this.garphAddShow = false
        },
        graphAddSubmit(){
          if(this.xuekeId) {
            var params ={
              hierachyId: this.graphID,
              involveSubjectsIds: this.form.isp1
            }
            this.$axiosResBody1('post',this.$axiosURL.k_knowledgeHierachy + 'bash/establish/involve/oneToMany',params).then((res)=>{
              console.log(this.xuekeId,'父 学科 添加',this.graphID)
              this.dataIndex = null
              this.xuekeId = null
              this.form.isp1 = []
              this.graphEditDel = false
              this.garphAddShow = false
              this.$bus.$emit('graphEel','')

            }) 
          } else {
            var params ={
              mainpointId: this.graphID,
              involvedPointsIds: this.form.isp1
            }
            this.$axiosResBody1('post',this.$axiosURL.k_knowledgePoint + 'bash/establish/involve/oneToMany',params).then((res)=>{
              console.log(this.xuekeId,'父 知识点 添加',this.graphID) 
              this.dataIndex = null
              this.xuekeId = null
              this.form.isp1 = []
              this.graphEditDel = false
              this.garphAddShow = false
              this.$bus.$emit('graphEel','')
            })   
          }
        },
        ispChange(values, items) {
          console.log(this.form.isp1)
        },
        graphdel(){
          this.$confirm('此操作将永久删除该知识点关系, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            if(this.dataIndex == 0) {
              if(this.xuekeId) {
                this.$axiosRes('delete',this.$axiosURL.k_knowledgeHierachy+ 'detach/allInvolvedRelationship/' + this.graphID).then((res)=>{
                  console.log(this.xuekeId,'父 学科 删除',this.graphID)
                  this.dataIndex = null
                  this.xuekeId = null
                  this.$bus.$emit('graphEel','')
                })
              } else {
                // 父ID
                this.$axiosRes('delete',this.$axiosURL.k_knowledgePoint+ 'detach/allInvolvedRelationship/' + this.graphID).then((res)=>{
                  console.log(this.xuekeId,'父 知识点 删除',this.graphID)
                  this.dataIndex = null
                  this.xuekeId = null
                  this.$bus.$emit('graphEel','')
                })
              }
            } else {
              if(this.xuekeId) {

                var params ={
                  knowledgeHierachyId: this.webkitDep[0][0].id,
                  relationshipType: 'INVOLVE',
                  otherId: this.graphID
                }
                this.$axiosRes('delete',this.$axiosURL.k_knowledgeHierachy+ 'detach',params).then((res)=>{
                  console.log(this.xuekeId,'子 学科 删除',this.graphID)
                  this.dataIndex = null
                  this.xuekeId = null
                  this.$bus.$emit('graphEel','')
                })
              } else {

                var params ={
                  mainpointId: this.webkitDep[0][0].id,
                  relationshipType: 'CORRELATE',
                  subpointId: this.graphID
                }
                this.$axiosRes('delete',this.$axiosURL.k_knowledgePoint+ 'detach',params).then((res)=>{
                  console.log(this.xuekeId,'子 知识点 删除',this.graphID)
                  this.dataIndex = null
                  this.xuekeId = null
                  this.$bus.$emit('graphEel','')
                })
              }
            }

              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })       
          })
        },
        // 一个可修改
        initChartgx(){
          for (var i=0;i<document.getElementsByClassName('J_chartFocusBox').length;i++){
          this.$echarts.init(document.getElementsByClassName('J_chartFocusBox')[i]).showLoading();
          this.$echarts.init(document.getElementsByClassName('J_chartFocusBox')[i]).hideLoading();
        
           var option = {
                tooltip : {
                      show : true,   //默认显示
                      showContent:true, //是否显示提示框浮层
                      trigger:'item',//触发类型，默认数据项触发
                      triggerOn:'mousemove',//提示触发条件，mousemove鼠标移至触发，还有click点击触发
                      alwaysShowContent:false, //默认离开提示框区域隐藏，true为一直显示
                      showDelay:0,//浮层显示的延迟，单位为 ms，默认没有延迟，也不建议设置。在 triggerOn 为 'mousemove' 时有效。
                      hideDelay:200,//浮层隐藏的延迟，单位为 ms，在 alwaysShowContent 为 true 的时候无效。
                      enterable:false,//鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
                      position:'right',//提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。只在 trigger 为'item'的时候有效。
                      confine:false,//是否将 tooltip 框限制在图表的区域内。外层的 dom 被设置为 'overflow: hidden'，或者移动端窄屏，导致 tooltip 超出外界被截断时，此配置比较有用。
                      transitionDuration:0.4,//提示框浮层的移动动画过渡时间，单位是 s，设置为 0 的时候会紧跟着鼠标移动。
                      formatter: function (params) {
                        if(params.data.name) {
                          return '姓名'+ ':' +params.data.name +'<br>' +'年龄'+ ':' + params.data.value;//  设置提示框的内容和格式 节点和边都显示name属性
                        }
                      }
                },
                series: [{
                    type : 'graph', //关系图
                    name : "考核管理系统", //系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                    layout : 'force', //图的布局，类型为力导图，'circular' 采用环形布局，见示例 Les Miserables
                    legendHoverLink : true,//是否启用图例 hover(悬停) 时的联动高亮。
                    hoverAnimation : true,//是否开启鼠标悬停节点的显示动画
                    coordinateSystem : null,//坐标系可选
                    xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
                    yAxisIndex : 0, //y轴坐标 
                    animation: true,
                    symbolSize: 60,
                    label: {
                        normal: {
                          show: true,
                            position: 'inside',
                            formatter: function(params){
                              return params.data.name;
                            },
                        }
                    },
                    draggable: true,
                    data: this.webkitDep[i].map(function (node, idx) {
                        // node.id = idx;
                        return node;
                    }),
                    roam: 'move',
                    symbol:'circle',//关系图节点标记的图形。ECharts 提供的标记类型包括 'circle'(圆形), 'rect'（矩形）, 'roundRect'（圆角矩形）, 'triangle'（三角形）, 'diamond'（菱形）, 'pin'（大头针）, 'arrow'（箭头）  也可以通过 'image://url' 设置为图片，其中 url 为图片的链接。'path:// 这种方式可以任意改变颜色并且抗锯齿
                    nodeScaleRatio : 0.6,//鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
                    draggable : true,//节点是否可拖拽，只在使用力引导布局的时候有用。
                    focusNodeAdjacency : true,//是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
                    itemStyle : {//===============图形样式，有 normal 和 emphasis 两个状态。normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                        normal : { //默认样式
                            label : {
                                show:true
                            },
                            // color:'#2498a5',
                            borderType : 'dotted', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                            borderColor : '#dce8e391', //设置图形边框为淡金色,透明度为0.4
                            borderWidth : 0, //图形的描边线宽。为 0 时无描边。
                            opacity : 1
                        // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5

                        },
                        emphasis : {//高亮状态
                            borderType : 'dotted', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                            borderColor : '#dce8e391', //设置图形边框为淡金色,透明度为0.4
                            borderWidth : 4, //图形的描边线宽。为 0 时无描边。
                            opacity : 1
                        }
                    },
                    lineStyle : { //==========关系边的公用线条样式。
                        normal : {
                            show: true,
                            color : '#dce8e391',
                            width : '2',
                            type : 'dashed', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                            curveness : 0.1, //线条的曲线程度，从0到1
                            opacity : 1
                        // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
                        },
                        emphasis : {//高亮状态
                            show: true,
                            color : '#dce8e391',
                            width : '2',
                            type : 'dashed', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                            curveness : 0.1, //线条的曲线程度，从0到1
                            opacity : 1
                        }
                    },
                    edgeLabel : {//==============线条的边缘标签 
                          normal : {
                              show : false
                          },
                          emphasis : {//高亮状态

                          }
                    },
                    categories: [{ name: "学科" }, {name: "知识"},{ name: "知识点"},{ name: "相关"},{ name: "知识点1"}],
                    force: {
                      //initLayout: ,//力引导的初始化布局，默认使用xy轴的标点
                      repulsion : 100,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                      gravity : 0.03,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                      edgeLength :180,//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
                      layoutAnimation : true
                    },
                    edges: this.links[i]
                }]
            };
            this.$echarts.init(document.getElementsByClassName('J_chartFocusBox')[i]).setOption(option);
            // 右键点击

              var _this = this
              function rightBT(params){
                  var event = params.event.event
                  var menu = document.getElementById("menu")
                  menu.style.left = event.pageX + 'px'
                  menu.style.top = event.pageY + 'px'
                  if(params.dataIndex == 0) {
                     _this.clickMenu = true
                     _this.clickMenu1 = false
                    _this.xuekeId  = params.data.khId
                    _this.dataIndex = params.dataIndex
                    _this.graphID  = params.data.id

                  } else {
                    _this.clickMenu = false
                    _this.clickMenu1 = true
                    _this.graphID  = params.data.id
                    _this.xuekeId  = params.data.khId
                  }

                  console.log(params,22)
              }
              // 右键禁用
              document.getElementsByClassName('J_chartFocusBox')[i].oncontextmenu = function() {
                return false;
              }
              this.$echarts.init(document.getElementsByClassName('J_chartFocusBox')[i]).on('contextmenu', rightBT)
          }
        },
        initChartgx1(){
          for (var i=0;i<document.getElementsByClassName('J_chartFocusBox1').length;i++){
          this.$echarts.init(document.getElementsByClassName('J_chartFocusBox1')[i]).showLoading();
          this.$echarts.init(document.getElementsByClassName('J_chartFocusBox1')[i]).hideLoading();
        
           var option = {
                tooltip : {
                      show : true,   //默认显示
                      showContent:true, //是否显示提示框浮层
                      trigger:'item',//触发类型，默认数据项触发
                      triggerOn:'mousemove',//提示触发条件，mousemove鼠标移至触发，还有click点击触发
                      alwaysShowContent:false, //默认离开提示框区域隐藏，true为一直显示
                      showDelay:0,//浮层显示的延迟，单位为 ms，默认没有延迟，也不建议设置。在 triggerOn 为 'mousemove' 时有效。
                      hideDelay:200,//浮层隐藏的延迟，单位为 ms，在 alwaysShowContent 为 true 的时候无效。
                      enterable:false,//鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
                      position:'right',//提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。只在 trigger 为'item'的时候有效。
                      confine:false,//是否将 tooltip 框限制在图表的区域内。外层的 dom 被设置为 'overflow: hidden'，或者移动端窄屏，导致 tooltip 超出外界被截断时，此配置比较有用。
                      transitionDuration:0.4,//提示框浮层的移动动画过渡时间，单位是 s，设置为 0 的时候会紧跟着鼠标移动。
                      formatter: function (params) {
                        if(params.data.name) {
                          return '姓名'+ ':' +params.data.name +'<br>' +'年龄'+ ':' + params.data.value;//  设置提示框的内容和格式 节点和边都显示name属性
                        }
                      }
                },
                series: [{
                    type : 'graph', //关系图
                    name : "考核管理系统", //系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                    layout : 'force', //图的布局，类型为力导图，'circular' 采用环形布局，见示例 Les Miserables
                    legendHoverLink : true,//是否启用图例 hover(悬停) 时的联动高亮。
                    hoverAnimation : true,//是否开启鼠标悬停节点的显示动画
                    coordinateSystem : null,//坐标系可选
                    xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
                    yAxisIndex : 0, //y轴坐标 
                    animation: true,
                    symbolSize: 50,
                    label: {
                        normal: {
                          show: true,
                            position: 'inside',
                            formatter: function(params){
                              return params.data.name;
                            },
                        }
                    },
                    draggable: true,
                    data: this.webkitDep1[i].map(function (node, idx) {
                        // node.id = idx;
                        return node;
                    }),
                    roam: 'move',
                    symbol:'circle',//关系图节点标记的图形。ECharts 提供的标记类型包括 'circle'(圆形), 'rect'（矩形）, 'roundRect'（圆角矩形）, 'triangle'（三角形）, 'diamond'（菱形）, 'pin'（大头针）, 'arrow'（箭头）  也可以通过 'image://url' 设置为图片，其中 url 为图片的链接。'path:// 这种方式可以任意改变颜色并且抗锯齿
                    nodeScaleRatio : 0.6,//鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
                    draggable : true,//节点是否可拖拽，只在使用力引导布局的时候有用。
                    focusNodeAdjacency : true,//是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
                    itemStyle : {//===============图形样式，有 normal 和 emphasis 两个状态。normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                        normal : { //默认样式
                            label : {
                                show : true
                            },
                            borderType : 'dotted', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                            borderColor : '#dce8e391', //设置图形边框为淡金色,透明度为0.4
                            borderWidth : 0, //图形的描边线宽。为 0 时无描边。
                            opacity : 1
                        // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5

                        },
                        emphasis : {//高亮状态
                            borderType : 'dotted', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                            borderColor : '#dce8e391', //设置图形边框为淡金色,透明度为0.4
                            borderWidth : 4, //图形的描边线宽。为 0 时无描边。
                            opacity : 1
                        }
                    },
                    lineStyle : { //==========关系边的公用线条样式。
                        normal : {
                            show: true,
                            color : '#dce8e391',
                            width : '2',
                            type : 'dashed', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                            curveness : 0.1, //线条的曲线程度，从0到1
                            opacity : 1
                        // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
                        },
                        emphasis : {//高亮状态
                            show: true,
                            color : '#dce8e391',
                            width : '2',
                            type : 'dashed', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                            curveness : 0.1, //线条的曲线程度，从0到1
                            opacity : 1
                        }
                    },
                    edgeLabel : {//==============线条的边缘标签 
                          normal : {
                              show : false
                          },
                          emphasis : {//高亮状态

                          }
                    },
                    categories: [{ name: "学科" }, {name: "知识"},{ name: "知识点"},{ name: "相关"},{ name: "知识点1"}],
                    force: {
                      //initLayout: ,//力引导的初始化布局，默认使用xy轴的标点
                      repulsion : 100,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                      gravity : 0.03,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                      edgeLength :120,//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
                      layoutAnimation : true
                    },
                    edges: this.links[i]
                }]
            };
            this.$echarts.init(document.getElementsByClassName('J_chartFocusBox1')[i]).setOption(option);

          }
        }


    }
}
</script>
<style>
    #menu {
        position: fixed;
        left: 0;
        top: 0;
        /*display: none*/
    }
    .chart-box {
      height: 500px;
    }
    .el-card {
      background-color: transparent;
 
    }
</style>