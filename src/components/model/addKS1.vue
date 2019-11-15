<template>
  <div class="tableChange">
  	<el-dialog
	    title="提示"
	    :visible.sync=" this.$store.state.addKS.dialogVisible"
	    width="1200px"
	    top='30px'
	    :close-on-click-modal=false
	    :before-close="handleClose">
	      <el-steps :active="active" simple>
	        <el-step title="试卷选取" icon="el-icon-edit"></el-step>
	        <el-step title="信息录入" icon="el-icon-upload"></el-step>
	        <el-step title="参与人选择" icon="el-icon-picture"></el-step>
	      </el-steps>
	      <!-- 试卷选取  -->
	      <div v-show="this.active==1" class='SJXQ' style='height: 600px' >
	        <el-row type="flex" style="height: 70% ;padding-top:200px" justify="space-around" >
	          <el-col :span="6">
	            <el-container @click.native='clickSTJXQ' :class='demoId==1?demo:""'>
	              <el-header>
	                <i class="el-icon-circle-plus" style="font-size: 50px;margin-top: 15px"></i>
	              </el-header>
	              <el-main>试题库选取</el-main>
	            </el-container>
	          </el-col>
	          <el-col :span="6">
	            <el-container @click.native='clickCJXSJ' :class='demoId==2?demo:""'>
	              <el-header>
	                <i class="el-icon-circle-plus" style="font-size: 50px;margin-top: 15px"></i>
	              </el-header>
	              <el-main>创建新试卷</el-main>
	            </el-container>
	          </el-col>
<!-- 	          <el-col :span="4">
	            <el-container @click.native='clickSJDR' :class='demoId==3?demo:""'>
	              <el-header>
	                <i class="el-icon-circle-plus" style="font-size: 50px;margin-top: 15px"></i>
	              </el-header>
	              <el-main>试卷导入</el-main>
	            </el-container>
	          </el-col> -->
	        </el-row>
			<el-row style="margin-left: 35%" v-show="demoId==1">
				<el-form  label-width="80px">
				  <el-form-item label="选择试卷">
				    <el-select v-model="SJdata" filterable multiple placeholder="可查询">
				      <el-option :key='index' :label="item.paperName" :value="item.id" v-for="(item,index) in this.allSJData"></el-option>
				    </el-select>
				  </el-form-item>
				</el-form>
			</el-row>
	         
	      </div>
	      <!-- 信息录入  -->   
	      <div v-show="this.active==2" style='height: 600px;width: 700px' >
	        <el-row :gutter="20" style="margin-top: 20px">
	            <el-col :span="8">
	               <el-input v-model="formXXLR.ksName" placeholder="考试名称"></el-input>
	            </el-col>
	            <el-col :span="8">
	              <el-select v-model="formXXLR.kslx" placeholder="考试类型">
	                <el-option v-for = 'item in this.$store.state.dictionarys.exam_type'
	                  :label="item.dictName"
	                  :value="item.value"
	                ></el-option>
	              </el-select>
	            </el-col>
	            <el-col :span="8">
	              <el-select v-model="formXXLR.ksxs" placeholder="考试形式">
	                <el-option v-for = 'item in this.$store.state.dictionarys.exam_modality'
		              :label="item.dictName"
		              :value="item.value"
		            ></el-option>
	              </el-select>
	            </el-col>
	          </el-row>
	          <el-row :gutter="20" style="margin-top: 20px">
	            <el-col :span="8">
				    <el-date-picker
				      v-model="formXXLR.KSdate"
				      format="yyyy-MM-dd HH:mm:ss"
				      value-format="timestamp"
				      type="datetime"
				      default-time="12:00:00"
				      placeholder="选择考试开始时间">
				    </el-date-picker>
	            </el-col>
	            <el-col :span="8">
	              <el-input v-model="formXXLR.KSSC" type='number' :min="0" placeholder="考试时长(分钟)"></el-input>
	            </el-col>
	          </el-row>
	          <div v-show="formXXLR.kslx =='等级考试' ">
	          	<el-card class="box-card" style='margin-top: 20px'>
	                <div slot="header" class="clearfix">
	                  <span>等级考试</span> <el-button @click="addDomain" type="primary"  size="mini">新增</el-button>
	                </div>
	                <div style="height: 100px">
	                  <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" size="small" label-position="right">
	            		<el-form-item
					    v-for="(item, index) in dynamicValidateForm.list"
					    :label="'等级' + (index+1)"
					    :key="item.key"
					    :prop="'list.' + index + '.value'">
					    <el-row>
					    	<el-col :span='12'>
					    		<el-input v-model="item.value" type='number' :min="0"></el-input>
					    	</el-col>
					    	<el-col :span='4'>
					    		<el-button @click.prevent="removeDomain(item)">删除</el-button>
					    	</el-col>
					    </el-row>
					    
					  </el-form-item>
	            	</el-form>
	                </div>  
	              </el-card>	        
	          </div>

	          <div v-show="formXXLR.kslx =='过关考试' ">
	          	<el-card class="box-card" style='margin-top: 20px'>
	                <div slot="header" class="clearfix">
	                  <span>过关考试</span> 
	                </div>
	                <div style="height: 100px">
	                  	<el-radio-group v-model="value3" style="margin-bottom: 20px;" size="mini">
						  <el-radio-button :label="false">分数</el-radio-button>
						  <el-radio-button :label="true">过关率</el-radio-button>
						</el-radio-group>
						<el-row>
							<el-form ref="form" :model="formGGKS" label-width="80px">
							  <el-form-item label="分数" v-show='!value3'>
							    <el-input v-model="formGGKS.FS" type='number' :min="0"></el-input>
							  </el-form-item>
							  <el-form-item label="通过率" v-show='value3'>
							    <el-input v-model="formGGKS.TGL" type='number' :min="0">
							    	<template slot="append">%</template>
							    </el-input>
							  </el-form-item>
							</el-form>
						</el-row>
	                </div>  
	              </el-card>	        
	          </div>
	      </div> 
	      <!-- 参与人选择  --> 
	      <div v-show="this.active==3" style='height: 600px' >
	          <el-row :gutter="20" style="margin-top: 20px">
	            <el-col :span="11">
	                <el-card class="box-card">
	                  <div slot="header" class="clearfix">
	                    <span>参考人员</span>
	                  </div>
	                  <div style="height: 500px">
	                    <el-input
	                      placeholder="输入关键字进行过滤"
	                      v-model="filterText">
	                    </el-input>
	                    <el-scrollbar style='height: 490px;'>
		                    <el-tree
		                      class="filter-tree"
		                      :data="studentData"
		                      :props="defaultProps"
		                      node-key="id"
		                      show-checkbox
		                      :filter-node-method="filterNode"
		                      @check-change = 'checkChange'
		                      ref="tree2">
		                    </el-tree>
		                </el-scrollbar>
	                  </div>  
	                </el-card>
	            </el-col>
	            <el-col :span="13">
	              <el-card class="box-card">
	                <div slot="header" class="clearfix">
	                  <span>评审人员</span>
	                </div>
	                <div style="height: 300px">
	                    <el-transfer
	                      filterable
	                      :filter-method="filterMethod"
	                      :titles="['全部人员', '评审人员']"
	                      :button-texts="['删除', '添加']"
	                      filter-placeholder="请输入评审人员"
	                      :props="{
				            key: 'id',
				            label: 'realname',
				            value:'id'
				          }"
	                      v-model="valuePSRY"
	                      :data="teacherData">
	                    </el-transfer>
	                </div>  
	              </el-card>
	              <el-card class="box-card" style='margin-top: 20px'>
	                <div slot="header" class="clearfix">
	                  <span>主审人</span>
	                </div>
	                <div style="height: 100px">
	                  <el-select v-model="ZSR" placeholder="主审人">
	                    <el-option v-for = 'item in this.teacherData'
					              :key="item.id"
					              :label="item.nickname"
					              :value="item.id"
					            ></el-option>
	                  </el-select>
	                </div>  
	              </el-card>
	            </el-col>
	          </el-row>

	      </div>   
	    <span slot="footer" class="dialog-footer">
	      <el-button style="margin-top: 12px;" v-if="this.active<3" @click="next">下一步</el-button>
	      <el-button type="primary" v-if="this.active==3&&!changeYL" @click="clickAddKS">添 加</el-button>
	      <el-button type="primary" v-if="this.active==3&&changeYL" @click="clickChange">修 改</el-button>
	    </span>
	  </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
      return {
      	formXXLR:{
          ksName: '',
          ksxs: '',
          kslx: '',
          KSdate: null,
          KSSC: '',
        },
        active:2,  //步骤条
        demoId:0,
        demo:'demo',

        filterText: '',

        dynamicValidateForm:{
        	list:[{
	            value: ''
	        }],
        },
        
        defaultProps: {
        	key:'id',
            children: 'stus',
            label: 'realname'
        },
        filterMethod(query, item) {
          return item.realname.indexOf(query) > -1;
        },

        changeYL:false, //修改按钮

        ZSR:null,  //选中主审人

        allSJData:[], // 所有试卷data
        SJdata:[], // 试卷data
        pdgz:'',
        studentData:[],  //学生信息

        checkedStudentData:[],  //选中学生信息
        valuePSRY: [],  //选中判卷老师
        teacherData:[],  //老师信息

        oldKSdata:{},  //修改考试之前临时保存

        value3:false,  //过关考试 分数/通过率
        formGGKS:{
        	FS:'',
        	TGL:''
        }

  	}
  },
  watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
  methods: {
  	addDomain() {
        this.dynamicValidateForm.list.push({
          value: '',
          key: Date.now()
        });
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.list.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.list.splice(index, 1)
        }
      },
  	checkChange:function(){
  		this.checkedStudentData = []
  		this.$refs.tree2.getCheckedNodes().forEach((element,index)=>{
  			if (typeof(element.roleID) != 'undefined') {
  				this.checkedStudentData.push(element.id)
  			}
  		})
  	},
  	clearnAllData:function(){
  		this.active = 1  //步骤条
        this.demoId = 0
        this.formXXLR = {ksName:'',ksxs:'',kslx:'',KSdate:null,KSSC:''},
        this.SJdata = []
        this.ZSR = null,  //选中主审人
        this.checkedStudentData=[],  //选中学生信息
        this.valuePSRY=[]  //选中判卷老师
        this.changeYL = false  //修改按钮
        this.value3 = false,  //过关考试 分数/通过率
        this.formGGKS = {FS:'',TGL:''}
        this.dynamicValidateForm = {list:[{value: ''}]}
  	},
    //人员过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.realname.indexOf(value) !== -1;
    },
    clickSJDR:function(){
        this.demoId = 3
    },
    clickCJXSJ:function(){
       this.demoId = 2
       // this.$confirm('是否跳转到试卷添加界面?', '提示', {
       //    confirmButtonText: '确定',
       //    cancelButtonText: '返回',
       //    type: 'warning'
       //  }).then(() => {
       //    	this.$bus.$emit('createdJS','')
       //  }).catch(() => {
            
       //  });
       this.$bus.$emit('createdJS','')
    },
    clickSTJXQ:function(){
       this.demoId = 1
    },
    //时间戳转时间
    getYMDHMS:function(time){
    	var myDate = new Date(time)
    	var mm = (myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1)
    	var dd = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate()
    	var hh = myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours()
    	var minutes = myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes()
    	var ss = myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds()
    	var YMD = myDate.getFullYear()+'-'+mm+'-'+ dd
    	var HMS = hh+':'+minutes+':'+ss
    	return YMD+' '+HMS
    },
    clickAddKS:function() {
    	var Papers = [{paper:{id:this.SJdata[0],addStus:this.checkedStudentData,delStus:[]}}]
    	var endTime = this.formXXLR.KSdate+Number(this.formXXLR.KSSC)*60*1000
    	this.pdgz = ''
    	if (this.formXXLR.kslx == '等级考试') {
    		for (var i =0 ; i <= this.dynamicValidateForm.list.length - 1; i++) {
    			if (i==0) {
                    this.pdgz = this.pdgz + this.dynamicValidateForm.list[i].value
    			}else{
    				this.pdgz = this.pdgz  +this.dynamicValidateForm.list[i].value+ ','
    			}
    		}
    	}else if(this.formXXLR.kslx == '过关考试' && !this.value3){
    		this.pdgz = this.formGGKS.FS
    	}else if(this.formXXLR.kslx == '过关考试' && this.value3){
    		this.pdgz = this.formGGKS.TGL + '%'
    	}
    	var param ={
	      examName:this.formXXLR.ksName,
	      totalTime:this.formXXLR.KSSC,
	      startTime:this.getYMDHMS(this.formXXLR.KSdate),
	      endTime:this.getYMDHMS(endTime),
	      examModality:this.formXXLR.ksxs,
	      examType:this.formXXLR.kslx,
	      pdgz:this.pdgz,
	      addPapers:this.SJdata,
	      addStus:this.checkedStudentData,
	      addJudges:this.valuePSRY,
	      addChief:this.ZSR,
	      papers:Papers,
	    }
	    //判断
	    if (param.addStus.length == 0) {
	    	this.$message.error('参考人员不能为空')
	    	return
	    } else if(param.addJudges.length == 0){
	    	this.$message.error('评审人员不能为空')
	    	return
	    } else if(param.addChief == null){
	    	this.$message.error('主审人不能为空')
	    	return
	    }
	    if ($.inArray(param.addChief,param.addJudges)>-1) {
	    	this.$message.error('主审人不能不能与评审人相同')
	    	return
	    }
	    console.log(12,param);
	    this.$axiosResBody('post',this.$axiosURL.e_examination+'addExam',param).then((res)=>{
	        console.log(21,res);
	        this.$confirm('创建成功', {
	        confirmButtonText: '发布考试',
	        cancelButtonText: '查看创建结果',
	        type: 'success',
	        center: true
	      }).then(() => {
	        	this.$axiosRes1('post',this.$axiosURL.e_examination+'launchExam',{examId:res.id}).then((res)=>{
	        		this.$message.success('考试发布成功')
	        		this.clearnAllData()
			        this.$store.state.addKS.dialogVisible=false
			        this.$bus.$emit('findPaperPageKS','')
	        	})
	        }).catch(() => {
		      	this.clearnAllData()
		        this.$store.state.addKS.dialogVisible=false
		        this.$bus.$emit('findPaperPageKS','') 
	      })
	    })
	      
    },
    clickChange:function(){
    	var Papers = [{id:this.SJdata[0],addStus:this.checkedStudentData,delStus:[]}]
    	var endTime = this.formXXLR.KSdate+Number(this.formXXLR.KSSC)*60*1000
    	//删除的试卷
    	var delPapers = []
    	delPapers.push(this.oldKSdata.papers[0].id)

    	function changeData(data1,data2){
			var newdata = []
			data1.forEach((element,index)=>{
				if (data2.indexOf(element)<0) {
					newdata.push(element)
				}
			})
			return newdata
		}
		//old student数据
		var oldStudent = []
		this.oldKSdata.students.forEach((element,index)=>{
            oldStudent.push(element.mysqlID) 
		})	
		//old Judges数据
		var oldJudges = []
		this.oldKSdata.judgeTeacher.forEach((element,index)=>{
            oldJudges.push(element.mysqlID) 
		})

    	var param ={
    		id:this.oldKSdata.id,
	        examName:this.formXXLR.ksName,
	        totalTime:this.formXXLR.KSSC,
	        startTime:this.getYMDHMS(this.formXXLR.KSdate),
	        endTime:this.getYMDHMS(endTime),
	        examModality:this.formXXLR.ksxs,
	        examType:this.formXXLR.kslx,
	        pdgz:this.pdgz,
	        delPapers:delPapers,
	        delStus:changeData(oldStudent,this.checkedStudentData),
	        delJudges:changeData(oldJudges,this.valuePSRY),
	        delChief:this.oldKSdata.chiefTeacher.mysqlID,
	        addPapers:this.SJdata,
	        addStus:changeData(this.checkedStudentData,oldStudent),
	        addJudges:changeData(this.valuePSRY,oldJudges),
	        addChief:this.ZSR,
	        Papers:Papers,
	    }
	    console.log('修改',param);
	    this.$axiosResBody('post',this.$axiosURL.e_examination+'updateExam',param).then((res)=>{
	        this.$confirm('创建成功', {
	        confirmButtonText: '发布考试',
	        cancelButtonText: '返回列表',
	        type: 'success',
	        center: true
	      }).then(() => {
	        	this.$axiosRes1('post',this.$axiosURL.e_examination+'launchExam',{examId:res.id}).then((res)=>{
	        		this.$message.success('考试发布成功')
	        		this.clearnAllData()
			        this.$store.state.addKS.dialogVisible=false
			        this.$bus.$emit('findPaperPageKS','')
	        	})
	        }).catch(() => {
		      	this.clearnAllData()
		        this.$store.state.addKS.dialogVisible=false
		        this.$bus.$emit('findPaperPageKS','') 
	      })
	    })

    },
    //步骤条下一步
    next() {
    	if (this.active == 1&& this.SJdata.length == 0) {
    		this.$message.error('所选试卷不能为空')
    		return
    	}
    	if (this.active == 2) {
    		if (this.formXXLR.ksName&&this.formXXLR.ksxs&&this.formXXLR.kslx&&this.formXXLR.KSdate&&this.formXXLR.KSSC) {
    			if (this.formXXLR.kslx == '过关考试') {
    				if (this.formGGKS.FS||this.formGGKS.TGL) {
	    			}else{
	    				this.$message.error('请填写全部信息')
	    				return
	    			}
    			} else if(this.formXXLR.kslx == '等级考试') {
    				if(this.checkDynamicValidateForm(this.dynamicValidateForm.list)){
	    			}else{
	    				this.$message.error('请填写全部信息')
	    				return
	    			}
    			}
    		}else{
    			this.$message.error('请填写全部信息')
    			return
    		} 
    	}
        this.active++
      },
      checkDynamicValidateForm:function(list){
      	for (var i = list.length - 1; i >= 0; i--) {
      		if (list[i].value) {
      		} else {
      			return false
      		}
      	}
      	return true
      },
      handleSelectionChange(val){

      },
      handleEdit(index, row){
            this.$store.state.addKS.dialogVisible = true;
      },

      prevClick(val){},
      nextClick(val){},
      // 右上角X
      handleClose(){
        this.$store.state.addKS.dialogVisible=false         
      },
      
      paperExport(index, row){

      },
      initdata:function(){
      
      	this.$axiosGet(this.$axiosURL.u_user+'depts/allWithStus',{}).then((res)=>{
            this.studentData = res
            res.forEach((element,index)=>{
            	element['realname'] = element.name
            })	
        })
        this.$axiosGet(this.$axiosURL.u_user+'users',{start:0,length:10000,type:4}).then((res)=>{
            console.log('teacherData',res.data);
            this.teacherData = res.data
        })

        //获取所有试卷列表
		var a = this.$store.state.dictionarys.paper_type.find((item)=>(item.dictName=='普通试卷'))
	    var param ={
	      //paperType:a.value,
	      //rel:true
	    }
	    this.$axiosResBody('get',this.$axiosURL.e_examinationPaper+'findOptionalPapers',param).then((res)=>{
	        this.allSJData = res
	    })
        
      }
  },
  created:function(){
  	this.initdata()
  },
  mounted:function(){
  	
  	
  	this.$bus.$on('clickXJKS',()=>{
  		this.clearnAllData()
  		//this.clickSTJXQ()
  		this.$store.state.addKS.dialogVisible = true;
  		this.initdata()
  	})
  	this.$bus.$on('createdKS',(res)=>{
  		this.clearnAllData()
  		this.SJdata.push(res.id)
        this.$router.push({path: '/examManagement'});
        this.$store.state.addSJ.dialogVisible = false
        this.$store.state.addKS.dialogVisible = true
	    this.active = 2
    })       

    //考试编辑
	this.$bus.$on('EditKS',(row)=>{
		this.oldKSdata = row
		this.clearnAllData()
		this.clickSTJXQ()
		this.demoId = 1
		this.changeYL = true  //改为修改按钮
		console.log(11,row);
		this.formXXLR = {
          ksName: row.examName,
          ksxs: row.examModality,
          kslx: row.examType,
          KSdate: new Date(row.startTime).getTime() ,
          KSSC: row.totalTime,
        }
        var judgeTea = []
        row.judgeTeacher.forEach((element,index)=>{
        	judgeTea.push(element.mysqlID)
        })
        var stu = []
        row.students.forEach((element,index)=>{
        	stu.push(element.mysqlID)
        })
        this.pdgz = row.pdgz
	    this.SJdata.push(row.papers[0].paper.id)
	    this.checkedStudentData = stu
	    this.valuePSRY = judgeTea
	    this.ZSR = row.chiefTeacher.mysqlID

	    //评定规则
	    if (row.pdgz.indexOf(',')!= '-1') {
	    	console.log(111,row.pdgz);
	    	this.dynamicValidateForm.list = []
	    	row.pdgz.split(',').forEach((element,index)=>{
	    		this.dynamicValidateForm.list.push({value:element})
	    	})
	    }else if(row.pdgz.indexOf('%')!= '-1'){
	    	this.value3 = true
	    	this.formGGKS.TGL = row.pdgz.split('%')[0]
	    	console.log(222,row.pdgz);
	    }else if(row.pdgz){
	    	this.value3 = false
	    	this.formGGKS.FS = row.pdgz
	    	console.log(333,row.pdgz);
	    }

	    setTimeout(()=>{
	    	this.$refs.tree2.setCheckedKeys(stu,true)
	    },2000)
	    
		
	})
                 
  }
}
</script>
<style scoped>

</style>