<template>
<div class="tableChange">
	<el-row type="flex" :gutter="100" justify="center" style="margin-top: 100px">
        <el-col :span="7">
			<div class='home_img' @click='to1'>
				<img src="./../../assets/img/home11.png">试卷信息维护
			</div>
		</el-col>
        <el-col :span="7">
			<div class='home_img' @click='to2'>
				<img src="./../../assets/img/home12.png">考试信息管理
			</div>
		</el-col>
        <el-col :span="7">
			<div class='home_img' @click='to3'>
				<img src="./../../assets/img/home13.png">试卷分析
			</div>
		</el-col>		
	</el-row>
	<el-row>
	  	<el-row type="flex" :gutter="100" justify="center" style="margin-top: 30px">
	  		<el-col :span="8">
				<div class='home_img' @click='to4'>
					<img src="./../../assets/img/home14.png">试卷评分
				</div>
			</el-col>
	  		<el-col :span="8">
				<div class='home_img' @click='to5'>
				     <img src="./../../assets/img/home15.png">试卷归档
				</div>
			</el-col>
		</el-row>	
	</el-row>
</div>
</template>
<script>
	export default {
   		data() {
   		  return {
   		  };
   		},
   		methods: {
   			to1:function() {
   				this.$router.push({path:'/testMaintenance'})
   			},
   			to2:function() {
   				this.$router.push({path:'/examManagement'})
   			},
   			to3:function() {
   				this.$router.push({path:'/examEvaluation'})
   			},
   			to4:function() {
   				this.$router.push({path:'/examScore'})
   			},
   			to5:function() {
   				this.$router.push({path:'/examGD'})
   			},
   		}
  	};
</script>

<style scoped>
	.el-main {
		padding: 10px;
	}
	.el-tabs__active-bar {
		background-color: transparent;
	}
	.home_img{
		width: 400px;
		height: 250px;
		line-height: 250px;
		text-align: center;
		font-size: 25px;
		color: #fff;
		background: url('./../../assets/img/home.png') center center no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
	}
	.home_img img{
		position: relative;
		top: 40px;
		width: 100px;
		height: 100px;
	}
	.home_img:hover{
		width: 400px;
		height: 250px;
		line-height: 250px;
		text-align: center;
		font-size: 32px;
		color: #fff;
		background: url('./../../assets/img/home1.png') center center no-repeat;
        background-size: 100% 100%;
	}
</style>
