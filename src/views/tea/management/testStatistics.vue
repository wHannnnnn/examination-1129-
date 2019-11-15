<template>
<div class="teatable">
<!--       <el-row :gutter="20">
        <el-col :span="20">
            <el-card>
              <div class="chart-box" ref='zxcharts'></div>
            </el-card>
        </el-col>
      </el-row> -->
    <el-row :gutter="20" v-if="this.txtjList.singleChoiceNum">
        <el-col :span="24">
            <el-card>
              <div class="chart-box" ref='piecharts'></div>
            </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
            <el-card>
              <div class="chart-box" ref='barcharts'></div>
            </el-card>
        </el-col>
      </el-row>
<!--         <el-row :gutter="20">
        <el-col :span="20">
            <el-card>
              <div class="chart-box" ref='CJZXcharts'></div>
            </el-card>
        </el-col>
      </el-row> -->
      </div>
</template>

<script>

export default {
  data() {
    return {
      txtjList:{},
      zsdtjList: []
    };
  },
  created(){},
  mounted(){
    this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ 'find/questions/classified/statistic').then((res)=>{
      this.txtjList = res
      if(this.txtjList.singleChoiceNum){
           console.log(res)
          this.$nextTick(function(){
              this.initChartpie()
          })   
      }

    })
    this.$axiosRes('get',this.$axiosURL.k_common+ 'count/subjectsAndPoints').then((res)=>{
      this.zsdtjList = res
      for (var i = 0; i < this.zsdtjList.length; i++) {
        this.zsdtjList[i].name = this.zsdtjList[i].subjectName
        this.zsdtjList[i].value = this.zsdtjList[i].pointsNum
      }
      console.log(this.zsdtjList)
      // this.txtjList = res
      if(this.zsdtjList.length > 0){
          this.$nextTick(function(){
              this.initChartbar()
          })   
      }

    })

  },
  methods: {
    initChartpie(){
        this.$echarts.init(this.$refs.piecharts).showLoading();
        this.$echarts.init(this.$refs.piecharts).hideLoading();
        var option = {
            title: {
                text: '试题统计',
                textStyle:{
                  color: '#00ceff'
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['单选题','多选题','填空题','判断题','简答题','论述题','综合题'],
                textStyle:{
                  color: '#00ceff'
                },
                top: '15%'
            },
            toolbox: {
                show: true,
                feature: {
                    restore: {},
                    saveAsImage: {
                      show: true,
                      excludeComponents: ['toolbox'],
                      pixelRatio: 2,
                      backgroundColor:"transparent"
                    }
                }
            },
            series: [
                {
                    name:'试题数量',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '60%'],
        
                    label: {
                        normal: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                // abg: {
                                //     backgroundColor: '#333',
                                //     width: '100%',
                                //     align: 'right',
                                //     height: 22,
                                //     borderRadius: [4, 4, 0, 0]
                                // },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    data:[
                          {value:this.txtjList.singleChoiceNum, name:'单选题', selected:true},
                          {value:this.txtjList.multipleChoiceNum, name:'多选题'},
                          {value:this.txtjList.gapFillingNum, name:'填空题'},
                          {value:this.txtjList.checkingNum, name:'判断题'},
                          {value:this.txtjList.shortAnswerNum, name:'简答题'},
                          {value:this.txtjList.expoundNum, name:'论述题'},
                          {value:this.txtjList.comprehensiveNum, name:'综合题'},
                        ]
                },

            ]
                    }
        this.$echarts.init(this.$refs.piecharts).setOption(option);
    },
    initChartbar(){
        this.$echarts.init(this.$refs.barcharts).showLoading();
        this.$echarts.init(this.$refs.barcharts).hideLoading();
        var option = {
            title: {
                text: '知识点统计',
                textStyle:{
                  color: '#00ceff'
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: this.zsdtjList.name,
                textStyle:{
                  color: '#00ceff'
                },
                top: '15%'
            },
            toolbox: {
                show: true,
                feature: {
                    restore: {},
                    saveAsImage: {
                      show: true,
                      excludeComponents: ['toolbox'],
                      pixelRatio: 2,
                      backgroundColor:"transparent"
                    }
                }
            },
            series: [
                {
                    name:'知识点数量',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '60%'],
        
                    label: {
                        normal: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                // abg: {
                                //     backgroundColor: '#333',
                                //     width: '100%',
                                //     align: 'right',
                                //     height: 22,
                                //     borderRadius: [4, 4, 0, 0]
                                // },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    data: this.zsdtjList
                },

            ]
                    }
        this.$echarts.init(this.$refs.barcharts).setOption(option);
    }
  }
}
</script>
<style scoped>
    .chart-box {
      min-height: 300px;
      max-height: 300px;
      background: transparent;
    }
    .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover{
      background-color: transparent
    }
    .el-card {
        border: 1px solid #265f8666;
    }
</style>