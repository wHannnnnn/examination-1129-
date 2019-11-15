<template>
	<div class="tableChange">
		<el-dialog
		title="创建试卷"
		:visible.sync="this.$store.state.addSJ.dialogVisible"
		width="1200px"
		top = "20px"
		:close-on-click-modal=false
		:before-close="handleClose">
		<div v-show='!showYL' style="height: 660px">
			<el-row >
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>基本信息</span>
					</div>
					<el-row :gutter="20">
						<el-col :span="5">
							<el-input v-model="formInline.SJMC" placeholder="试卷名称"></el-input>
						</el-col>
						<el-col :span="6">
							<el-select v-model="formInline.ZJFS" placeholder="组卷方式" @change='clearnSTZL'>
								 <el-option v-for = 'item in this.dictionarys.paper_gen_method'
					              :key="item.dictName"
					              :label="item.dictName"
					              :value="item.value"
					            ></el-option>
							</el-select>
						</el-col>
					</el-row>
				</el-card>
			</el-row>
			<el-row >
				<el-col :span="formInline.ZJFS != '随机组卷'?14:24">
					<el-card class="box-card" v-show="formInline.ZJFS == '人工组卷'">
						<div slot="header" class="clearfix">
							<span>组卷信息</span>
						</div>
						<div style="height: 450px;">
							<el-tabs type="border-card">
								<el-tab-pane label="抽题组卷">
									<el-row :gutter="10">
										<el-col :span="6">
											<el-cascader
											placeholder="知识点,可搜索"
											v-model="formCTZJ.ZSD"
											:options="ZSDdata"
											:props="ZSDprops"
											:show-all-levels="false"
											filterable
											change-on-select
											ref='cascader1'
											@change='changeformCTZJZSD'
											></el-cascader>
										</el-col>
										<el-col :span="6">
											<el-select v-model="formCTZJ.STLX" placeholder="试题类型" value-key='value' @change = 'checkNum'>
												<el-option :key='index' v-for = '(item,index) in removelast(this.dictionarys.question_type)'
												:label="item.dictName"
												:value="item.value"
												></el-option>
											</el-select>
										</el-col>
										<el-col :span="6">
											<el-input v-model="formCTZJ.STSL" :min='0' :max='numInBD' type='number' :placeholder="'试题数量：'+numInBD"></el-input>
										</el-col>
										<el-col :span="6">
											<el-input type='number' min='0'  v-model="formCTZJ.DTFZ" placeholder="单题分值" ></el-input>
										</el-col>
									</el-row>
									<el-row :gutter="20" style="margin-top: 10px">
										<el-col :span="5">
											<el-button @click="addCTZJdata" type="primary">添 加</el-button>
										</el-col>
										<el-col :span="5">
											<el-button @click="clearCTZJdata">重 置</el-button>
										</el-col>
									</el-row>
									<el-table
									:data="CTZJdata"
									border
									style="width: 100%"
									max-height="240"
									size='mini'>
									<el-table-column
									prop="ZSD"
									label="知识点"> 
								</el-table-column>
								<el-table-column
								prop="STLXlabel"
								label="试题类型"> 
							</el-table-column>
							<el-table-column
							prop="STSL"
							label="试题数量"> 
						</el-table-column>
						<el-table-column
						prop="DTFZ"
						label="分值/题"> 
					</el-table-column>
					<el-table-column
					prop="FZXJ"
					label="分值小计"> 
				</el-table-column>
				<el-table-column label="操作"  >
					<template slot-scope="scope">
						<el-button
						size="small"
						type="default"
						icon="edit"
						@click="removeCTZJdata(scope.$index, scope.row)">删除
					</el-button> 
				</template>
			</el-table-column>
		</el-table>
	</el-tab-pane>
	<el-tab-pane label="选题组卷">
		<el-row :gutter="10">
			<el-col :span="6">
				<el-cascader
				placeholder="知识点,可搜索"
				v-model="formXTZJ.ZSD"
				:options="ZSDdata"
				:props="ZSDprops"
				:show-all-levels="false"
				filterable
				change-on-select
				ref='cascader2'
				></el-cascader>
			</el-col>
			<el-col :span="6">
				<el-select v-model="formXTZJ.STLX" placeholder="试题类型">
					<el-option :key='index' v-for = '(item,index) in this.dictionarys.question_type'
					:label="item.dictName"
					:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="6">
				<el-input v-model="formXTZJ.GJZ" placeholder="关键字"></el-input>
			</el-col>
			<el-col :span="3">
				<el-button @click="searchXTZJdata" type="primary">查 询</el-button>
			</el-col>
			<el-col :span="3">
				<el-button @click="clearXTZJdata">重 置</el-button>
			</el-col>
		</el-row>
		<el-table
			:data="XTZJdata"
			border
			style="width: 100% ; margin-top: 10px"
			max-height="240"
			size='mini'>
			<el-table-column
			prop="questionBody"
			label="题干"> 
		</el-table-column>
		<el-table-column label="操作"  width='160px'>
			<template slot-scope="scope">
				<!-- <el-button
					size="small"
					type="default"
					icon="edit"
					@click="clickXTXQ(scope.$index, scope.row)">详情
				</el-button>  -->
				<el-popover
				  placement="top"
				  width="400"
				  @show = "STEdit(scope.row)"
				  trigger="click">
				  	<el-row>
			          <el-col :span="23" :offset="1">
			          	<el-form label-position="right" inline labelWidth="80px">
			            <div style="overflow: hidden" class="STNR">
			               <el-col>
			                  <el-form-item label="题干: ">
			                    <b>{{details.questionBody}}</b>
                               	<viewer :images="details.eqBodyImageNameList" class="tImg" v-if="details.eqBodyImageNameList"> 
           							  <img
           							    v-for="(src,index) in details.eqBodyImageNameList"
           							    :src="getImgUrl(src)"
           							    :key="index"
           							  >
       							</viewer>
			                  </el-form-item>
			                </el-col>

			                <el-col v-if="details.questionType == 'MULTIPLE_CHOICE' || details.questionType == 'SINGLE_CHOICE'">
			                  <el-form-item label="选项内容: ">
			                    <p v-for="(item,index) in details.questionOption">
			                    <span>{{item.key}}</span> &nbsp;:&nbsp;<b>{{item.value}}</b>
                    			<viewer class="aImg" v-if="item.img">
                    			 <img
                    			     :src="getImgUrl(item.img)" 
                    			     :key="index"
                    			   >
                    			 </viewer>
			                    </p>
			                  </el-form-item>
			                </el-col>

			                <el-col v-if="details.questionType == 'GAP_FILLING'">
			                  <el-form-item label="参考答案: ">
			                    <b v-for="item in details.questionAnswer">&nbsp;&nbsp;<b>{{item.value}}</b></b>
			                  </el-form-item>
			                </el-col>

			                <el-col v-else-if="details.questionType == 'MULTIPLE_CHOICE'">
			                  <el-form-item label="参考答案: ">
			                    <b v-for="item in details.questionAnswer"><b>&nbsp;&nbsp;{{item}}</b></b>
			                  </el-form-item>
			                </el-col>

			                <el-col>
			                  <el-form-item label="参考答案: " v-if="details.questionType !== 'MULTIPLE_CHOICE' && details.questionType !== 'GAP_FILLING' && details.questionType !== 'COMPREHENSIVE'">
			                    <b>{{details.questionAnswer}}</b>
			                  </el-form-item>
			                </el-col>

			                <el-col v-if="details.keys">
			                  <el-form-item label="关键字: ">
			                    <b v-for="item in details.keys"><b>&nbsp;&nbsp;{{item}}</b></b>
			                  </el-form-item>
			                </el-col>

			                <el-col>
			                  <el-form-item label="解析: " v-if="details.questionAnalyze && (details.questionAnalyze !== '')">
			                    <b>{{details.questionAnalyze}}</b>
			                  </el-form-item>
			                </el-col>
			            </div>
			            </el-form>                                      
			          </el-col>
			        </el-row>
				  <el-button slot="reference" size="small">详情</el-button>
				</el-popover>
			<el-popover
			placement="top"
			width="260"
			v-model="scope.row.visible">
			<el-input v-if="scope.row.questionType!='COMPREHENSIVE'" type='number' min='0'  v-model="XTZJFZ" size="mini" placeholder="请输入分值"></el-input>
			<div v-if="scope.row.questionType=='COMPREHENSIVE'">
				<div v-for='(item,index) in scope.row.examinationSubquestions'>
					第{{index+1}}小题、{{item.questionBody}}<el-input type='number' min='0'  v-model="item.singleScore" size="mini" placeholder="请输入分值"></el-input>
				</div>
				
			</div>
			<div style="text-align: right; margin: 10px 0 0 0">
				<el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
				<el-button type="primary" size="mini" @click="addXTZJchooseData(scope.$index, scope.row)">确定</el-button>
			</div>
			<el-button slot="reference" size="small">添加</el-button>
		</el-popover>
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
</el-tab-pane>
<el-tab-pane label="人工录入">
	<el-row :gutter="6">
		<el-col :span="6">
			<el-cascader
			placeholder="知识点,可搜索"
			v-model="directoryCreate.subjectsIdsStr"
			:options="ZSDdata"
			:props="ZSDprops2"
			:show-all-levels="false"
			filterable
			change-on-select
			ref='cascader2'
			></el-cascader>
		</el-col>
		<el-col :span="6">
			<el-select v-model="directoryCreate.question_ability_norm" placeholder="选择能力指标" value-key='value' >
				<el-option :key='index' v-for = '(item,index) in this.dictionarys.question_ability_norm'
				:label="item.dictName"
				:value="item.value"
				></el-option>
			</el-select>
		</el-col>
		<!-- <el-col :span="5">
			<el-select v-model="directoryCreate.exam_modality" placeholder="选择用途" value-key='value' >
				<el-option :key='index' v-for = '(item,index) in this.dictionarys.exam_modality'
				:label="item.dictName"
				:value="item.value"
				></el-option>
			</el-select>
		</el-col> -->
		<el-col :span="6">
			<el-select v-model="directoryCreate.question_difficulty" placeholder="试题难度" value-key='value' >
				<el-option :key='index' v-for = '(item,index) in this.dictionarys.question_difficulty'
				:label="item.dictName"
				:value="item.value"
				></el-option>
			</el-select>
		</el-col>
		<el-col :span="6">
			<el-input  type='number' min='0'  v-model="directoryCreate.FZ" placeholder="分值"></el-input>
		</el-col>
	</el-row>
	<el-row style="margin-top: 10px">
		<el-radio-group v-model="directoryCreate.questionsTestingType" @change="changeRadio()">
			<el-radio-button :key='index' v-for = '(item,index) in removelast(this.dictionarys.question_type)'
			:label="item.value"
			>{{item.dictName}}</el-radio-button>
		</el-radio-group>
	</el-row>
	<el-row style="margin-top: 10px;height: 300px;overflow-y: auto">
		<createquestion2></createquestion2>
	</el-row>
</el-tab-pane>
</el-tabs>
</div>	
</el-card>
<el-card class="box-card" v-show="formInline.ZJFS == '随机组卷'">
	<div slot="header" class="clearfix">
		<span>随机组卷</span>
	</div>
	<div style="height: 450px;">
		<el-row :gutter="10">
			<el-col :span="6">
				<el-cascader
				placeholder="知识点,可搜索"
				v-model="formSJZJ.ZSD"
				@change='changeformSJZJZSD'
				:options="ZSDdata"
				:props="ZSDprops2"
				:show-all-levels="false"
				filterable
				change-on-select
				ref='cascader3'
				></el-cascader>
			</el-col>
			<el-col :span="6">
				<el-select v-model="formSJZJ.STLX" placeholder="试题类型" @change = 'checkNumSJ' value-key='value'>
					<el-option :key='index' v-for = '(item,index) in removelast(this.dictionarys.question_type)'
					:label="item.dictName"
					:value="item.value"
					></el-option>
				</el-select>
			</el-col>
			<el-col :span="6">
				<el-input v-model="formSJZJ.STSL"  :min='0' :max='numInBDSJ' type='number' :placeholder="'试题数量：'+numInBDSJ"></el-input>
			</el-col>
			<el-col :span="6">
				<el-input type='number' min='0' v-model="formSJZJ.DTFZ" placeholder="单题分值" ></el-input>
			</el-col>
		</el-row>
		<el-row :gutter="20" style="margin-top: 10px">
			<el-col :span="2">
				<el-button @click="addSJZJdata" type="primary">添 加</el-button>
			</el-col>
			<el-col :span="2">
				<el-button @click="clearSJZJdata">重 置</el-button>
			</el-col>
		</el-row>
		<el-table
		:data="SJZJdata"
		border
		style="width: 100%"
		max-height="240"
		size='mini'>
		<el-table-column
		prop="ZSD"
		label="知识点"> 
			</el-table-column>
			<el-table-column
				prop="STLXlabel"
				label="试题类型"> 
			</el-table-column>
			<el-table-column
			prop="STSL"
			label="试题数量"> 
			</el-table-column>
			<el-table-column
			prop="DTFZ"
			label="分值/题"> 
			</el-table-column>
			<el-table-column
			prop="FZXJ"
			label="分值小计"> 
			</el-table-column>
			<el-table-column label="操作"  >
		<template slot-scope="scope">
		<el-button
			size="small"
			type="default"
			icon="edit"
			@click="removeSJZJdata(scope.$index, scope.row)">删除
		</el-button> 
</template>
</el-table-column>
</el-table>
</div>
</el-card>
<el-card class="box-card" v-if="formInline.ZJFS == '试卷导入'">
	<div slot="header" class="clearfix">
		<span>试卷导入</span>
	</div>
	<div style="height: 450px">
		<el-row :gutter='20'>
	        <!-- <el-col :span="9">
	            <el-button size="medium" type="primary" @click="wordxaizai" icon="el-icon-download">下载Word格式模板</el-button>
	        </el-col>
	        <el-col :span="9">
              <el-upload
                class="upload-demo"
                name="eqFile"
                :action="uploadUrl"
                :on-success="uploadSuccess"
                :show-file-list="false"
                :beforeUpload="beforeAvatarUpload1"
                >
                <el-button size="medium" type="primary">导入Word格式模板</el-button>
              </el-upload>
            </el-col> -->
            <div style='font-size: 24px'>
            	1、试卷模板导出
            </div>
            <div style='font-size: 20px'>

				
            </div>
            <div>
            	<el-button size="medium" type="primary" @click="wordxaizai" icon="el-icon-download">下载Word格式模板</el-button>
            </div>
            <div style='font-size: 24px;margin-top: 30px;'>
            	2、试卷导入
            </div>
            <div style='font-size: 20px'>

			温馨提示：<br>
			尊敬的用户:<br>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您好!<br>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请您根据您的上传文件格式选择对应的上传文档模版，先进行模版下载，并详细阅读模版说明，之后再按照模版格式要求对自己相应的文档进行排版，最后再将自己要上传的文档进行上传。
            </div>
            <div>
            	<el-upload
                class="upload-demo"
                name="eqFile"
                :action="uploadUrl"
                :on-success="uploadSuccess"
                :show-file-list="false"
                :on-progress="uploadProgress"
                :beforeUpload="beforeAvatarUpload1"
                >
                <el-button size="medium" type="primary">导入Word格式模板</el-button>
              </el-upload>
            </div>
      </el-row>
	</div>
</el-card>
</el-col>
<el-col :span="10"  v-if="formInline.ZJFS != '随机组卷'">
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>试题总览</span>
		</div>
		<div style="height: 450px">
			<el-container style='background-color: #a8affb;text-align: center;'>
				<el-header style='padding: 0px;height: 30px;line-height: 30px'>
					<el-row>
						<el-col :span="10">知识点</el-col>
						<el-col :span="6">题型</el-col>
						<el-col :span="4">题量</el-col>
						<el-col :span="4">分值</el-col>
					</el-row>
				</el-header>
				<el-main style='padding: 0px;text-align: center;'>
					<el-row>	
						<el-container v-for='item in this.STallZL' style='padding: 0px;margin-top:2px;text-align: center;background-color: #6e6ea2;'>
							<el-aside width="160px">{{item.knowledgePoints}}</el-aside>
							<el-main style='padding: 0px'>
								<el-row :key='index' v-for='(it,index) in item.questionType'>
									<el-col :span="12">{{it.questionType}}</el-col>
									<el-col :span="6">{{it.num}}</el-col>
									<el-col :span="6">{{it.FS}}</el-col>
								</el-row>
							</el-main>
						</el-container>
					</el-row>
				</el-main>
			</el-container>
		</div>
	</el-card>
</el-col>
</el-row>
</div>
<div v-show='showYL' style="height: 660px;">
	<!-- <el-row :gutter="20">
		<el-col :span='5' style="height: 660px;overflow-y: auto;">
			<el-menu
			default-active="2"
			class="el-menu-vertical-demo"
			background-color="#1b528a"
			text-color="#fff"
			active-text-color="#ffd04b">
			<el-submenu :index="item.value" v-for='item in this.STYLdata'>
				<template slot="title">
					<i class="el-icon-location"></i>
					<span>{{item.dictName}} (共{{item.ST.length}}道)</span>
				</template>
				<el-menu-item-group>
					<el-menu-item :index="it.id+''" @click="clickST(it)" v-for='(it,index) in item.ST'>第{{index+1}}道</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>
	</el-col>
	<el-col :span='19' style="height: 600px;overflow-y: auto;">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>试题详情</span>
			</div>
			<div style="height: 510px">
				<div v-if="showSTXQ"> 
					<el-row>
						<el-col :span="3" style='padding:4px;font-size:18px;text-align: right;'>
							<span >当前分值</span>
						</el-col>
						<el-col :span="3" >
							<el-input-number v-model="FSnum" controls-position="right" @change="ChangeFSnum" size="small" :min="1" :max="100"></el-input-number>
						</el-col>
						<el-col :span="4" style='padding:4px;font-size:18px;text-align: right;'>
							<el-button
								size="small"
								type="default"
								icon="edit"
								@click="removeST()">删除
							</el-button> 
						</el-col>						
					</el-row>
					<el-row >
			          <el-col :span="23" :offset="1">
			          	<el-form label-position="right" inline labelWidth="80px">
			            <div style="overflow: hidden">
			               <el-col>
			                  <el-form-item label="题干: ">
			                    <b>{{details.questionBody}}</b>
			                  </el-form-item>
			                </el-col>

			                <el-col v-if="details.questionOption">
			                  <el-form-item label="选项内容: ">
			                    <p v-for="item in details.questionOption"><span>{{item.key}}</span> &nbsp;:&nbsp;<b>{{item.value}}</b></p>
			                  </el-form-item>
			                </el-col>

			                <el-col v-if="details.questionType == 'GAP_FILLING'">
			                  <el-form-item label="参考答案: ">
			                    <b v-for="item in details.questionAnswer">&nbsp;&nbsp;<b>{{item.value}}</b></b>
			                  </el-form-item>
			                </el-col>

			                <el-col v-else-if="details.questionType == 'MULTIPLE_CHOICE'">
			                  <el-form-item label="参考答案: ">
			                    <b v-for="item in details.questionAnswer"><b>&nbsp;&nbsp;{{item}}</b></b>
			                  </el-form-item>
			                </el-col>

			                <el-col>
			                  <el-form-item label="参考答案: " v-if="details.questionType !== 'MULTIPLE_CHOICE' && details.questionType !== 'GAP_FILLING' && details.questionType !== 'COMPREHENSIVE'">
			                    <b>{{details.questionAnswer}}</b>
			                  </el-form-item>
			                </el-col>

			                <el-col v-if="details.keys">
			                  <el-form-item label="关键字: ">
			                    <b v-for="item in details.keys"><b>&nbsp;&nbsp;{{item}}</b></b>
			                  </el-form-item>
			                </el-col>

			                <el-col>
			                  <el-form-item label="解析: " v-if="details.questionAnalyze && (details.questionAnalyze !== '')">
			                    <b>{{details.questionAnalyze}}</b>
			                  </el-form-item>
			                </el-col>
			            </div>
			            </el-form>                                      
			          </el-col>
			        </el-row>
			     </div>
			</div>
		</el-card>
	</el-col>
</el-row> -->
<el-card class="box-card">
	<div slot="header" class="clearfix">
		<span>试卷预览</span>
	</div>
	<div style="height: 590px">
		<el-scrollbar style='height: 590px;'>
			<el-alert
			    title="基本信息"
			    type="success"
			    :closable="false">
			</el-alert>
			<el-row :gutter="20" style="font-size: 18px;margin-bottom:20px">
			    <el-col :span="8">试卷名称：{{formInline.SJMC}}</el-col>
			    <el-col :span="8">组卷方式：{{formInline.ZJFS}}</el-col>
			    <el-col :span="8">试题总分{{STallScore}}</el-col>
			</el-row>
			<el-alert
			    title="试题内容"
			    type="success"
			    :closable="false">
			</el-alert>
			<div v-if="formInline.ZJFS=='人工组卷'||formInline.ZJFS=='试卷导入'" style="margin-top: 20px">
				<div v-if="CTZJdata.length != 0">
					抽题组卷
					<el-table
					:data="CTZJdata"
					border
					style="width: 100%"
					max-height="240"
					size='mini'>
					<el-table-column
					prop="ZSD"
					label="知识点"> 
						</el-table-column>
						<el-table-column
						prop="STLXlabel"
						label="试题类型"> 
						</el-table-column>
						<el-table-column
						prop="STSL"
						label="试题数量"> 
						</el-table-column>
						<el-table-column
						prop="DTFZ"
						label="分值/题"> 
						</el-table-column>
						<el-table-column
						prop="FZXJ"
						label="分值小计"> 
						</el-table-column>
						<el-table-column label="操作"  >
							<template slot-scope="scope">
								<el-button
								size="small"
								type="default"
								icon="edit"
								@click="removeCTZJdata(scope.$index, scope.row)">删除
							</el-button> 
						</template>
					</el-table-column>
				</el-table>
				</div>
				<div v-if="XTandRGdataQC.length != 0" class="STNR" >
					<div v-for='item in this.STYLdata'>
						<div style="font-size: 20px" v-if='item.ST.length !=0'>{{item.dictName}}</div>
						<div v-for='details in item.ST'>
						<el-row >
				          <el-col :span="23" :offset="1">
				          	<el-form label-position="right" inline labelWidth="80px">
				            <div style="overflow: hidden">
				               <el-col>
				                  <el-form-item label="题干: ">
				                    <b>{{details.questionBody}}</b>
	                               	<viewer :images="details.eqBodyImageNameList" class="tImg" v-if="details.eqBodyImageNameList"> 
           							  <img
           							    v-for="(src,index) in details.eqBodyImageNameList"
           							    :src="getImgUrl(src)"
           							    :key="index"
           							  >
           							</viewer>
				                    <span >当前分值</span>
				                    <el-input-number v-model="details.singleScore" controls-position="right"  size="small" :min="0" :disabled="details.questionType == 'COMPREHENSIVE'" @change="ChangeFSnum(details,details.singleScore)" ></el-input-number>
				                  </el-form-item>
				                  <el-button
									size="mini"
									type="default"
									icon="edit"
									@click="removeST(details.id)">删除
								</el-button> 
				                </el-col>

				                <el-col v-if="details.questionOption">
				                  <el-form-item label="选项内容: ">
				                    <p v-for="(item2,index) in details.questionOption">
				                    <span>{{item2.split(';')[0]}}</span> &nbsp;&nbsp;<b>{{item2.split(';')[1]}}</b>
                     				<viewer class="aImg" v-if="details.eqOptionImageNameList">
                     				 <img
                     				     :src="getImgUrl(details.eqOptionImageNameList[index])" 
                     				     :key="index"
                     				   >
                     				 </viewer>
				                    </p>
				                  </el-form-item>
				                </el-col>

				                <el-col v-if="details.questionType == 'GAP_FILLING'">
				                  <el-form-item label="参考答案: ">
				                    <b v-for="item2 in details.questionAnswer">&nbsp;&nbsp;<b>{{item2.value}}</b></b>
				                  </el-form-item>
				                </el-col>

				                <el-col v-else-if="details.questionType == 'MULTIPLE_CHOICE'">
				                  <el-form-item label="参考答案: ">
				                    <b v-for="item2 in details.questionAnswer"><b>&nbsp;&nbsp;{{item2}}</b></b>
				                  </el-form-item>
				                </el-col>

				                <el-col>
				                  <el-form-item label="参考答案: " v-if="details.questionType !== 'MULTIPLE_CHOICE' && details.questionType !== 'GAP_FILLING' && details.questionType !== 'COMPREHENSIVE'">
				                    <b>{{details.questionAnswer}}</b>
				                  </el-form-item>
				                </el-col>

				                <el-col v-if="details.keys">
				                  <el-form-item label="关键字: ">
				                    <b v-for="item2 in details.keys"><b>&nbsp;&nbsp;{{item2}}</b></b>
				                  </el-form-item>
				                </el-col>

				                <el-col>
				                  <el-form-item label="解析: " v-if="details.questionAnalyze && (details.questionAnalyze !== '')">
				                    <b>{{details.questionAnalyze}}</b>
				                  </el-form-item>
				                </el-col>
				            </div>
				            </el-form>                                      
				          </el-col>
				        </el-row>
						</div>
					</div>
				</div>
			</div>
			<div v-if="formInline.ZJFS=='随机组卷'" style="margin-top: 20px">
				随机组卷
				<el-table
				:data="SJZJdata"
				border
				style="width: 100%"
				max-height="240"
				size='mini'>
					<el-table-column
					prop="ZSD"
					label="知识点"> 
						</el-table-column>
						<el-table-column
							prop="STLXlabel"
							label="试题类型"> 
						</el-table-column>
						<el-table-column
						prop="STSL"
						label="试题数量"> 
						</el-table-column>
						<el-table-column
						prop="DTFZ"
						label="分值/题"> 
						</el-table-column>
						<el-table-column
						prop="FZXJ"
						label="分值小计"> 
						</el-table-column>
						<el-table-column label="操作"  >
					<template slot-scope="scope">
					<el-button
						size="small"
						type="default"
						icon="edit"
						@click="removeSJZJdata(scope.$index, scope.row)">删除
					</el-button> 
					</template>
				</el-table-column>
			</el-table>
			</div>
			
		</el-scrollbar>
	</div>
</el-card>
</div>
<span slot="footer" class="dialog-footer">
	<el-button v-if='!showYL' @click="handleClose">取 消</el-button>
	<el-button v-if='!showYL' type="primary" @click="showYL = true">预览</el-button>
	<el-button v-if='showYL' @click="showYL = false">返回</el-button>
	<el-button v-if='showYL&& !changeYL && isNotEdit' type="primary" @click="handleTJ">提交</el-button>
	<el-button v-if='showYL&& changeYL && isNotEdit' type="primary" @click="handleChange">修改</el-button>
</span>
</el-dialog>
</div>
</template>

<script>
	import createquestion2 from '@/components/zj_questionMaintenance/createquestion2.vue'

	export default {
		name: 'addSJ',
		data() {
			return {
				activeNames:1,
				TJ:'添加',
				CZ:'重置',
				activeName:'first',
				stepsActive: 0,
				// 表单内容
				formInline:{
					SJMC: '',
					ZJFS: '人工组卷',
				},
		        formCTZJ:{  //抽题组卷
		        	ZSD: null,
		        	STLX: '',
		        	STLXlabel: '',
		        	STSL: '',
		        	DTFZ: '',
		        },
		        formXTZJ:{ //选题组卷
		        	ZSD: [],
		        	STLX: '',
		        	GJZ: '',
		        },

		        directoryCreate: {     //人工录入
		        	subjectsIdsStr: null,
		        	question_difficulty: '',
		        	exam_modality: '',
		        	questionsTestingType: '',
		        	question_ability_norm: '',
		        	FZ:''
		        },
		        formSJZJ:{  //随机组卷
		        	ZSD: null,
		        	STLX: '',
		        	STLXlabel: '',
		        	STSL: '',
		        	DTFZ: '',
		        },
		        visible: false,
		        ZSDdata:this.$store.state.knowledgeHierachy,
		        ZSDprops:{
		        	value:'name',
		        	label:'name',
		        	children:'knowledgePoints',
		        },
		        ZSDprops2:{
		        	value:'id',
		        	label:'name',
		        	children:'knowledgePoints',
		        },
		        STall:[],  //总试题列表
		        STallQC:[], //总试题去重
		        STallZL:[], //总试题总览
		        STallScore:0, //总试题总分
		        XTZJFZ:'',//选题组卷分值
		        CTZJdata:[],  //抽题组卷table data

		        XTZJdata:[],  //选题组卷table data
		        XTandRGdata:[],  //选题和人工所有 
		        XTandRGdataQC:[],  //选题和人工所有去重 
		        STYLdata:[{dictName:'单选题',value:'1',ST:[]},{dictName:'多选题',value:'2',ST:[]},{dictName:'填空题',value:'3',ST:[]},{dictName:'判断题',value:'4',ST:[]},{dictName:'简答题',value:'5',ST:[]},{dictName:'论述题',value:'6',ST:[]},{dictName:'综合题',value:'7',ST:[]}], //抽题和人工试题预览data

		        SJZJdata:[],  //随机组卷table data

		        numInBD:0,  //题库中对应数量
		        numInBDSJ:0,  //题库中对应数量(随机组卷)
		        pageNum:1,  //页码
		        pageSize:10,  //每页数量
		        total:0,   //总数

		        showYL:false, //添加预览切换
		        changeYL:false, //修改按钮
		        isNotEdit:true,  //不是预览
		        dictionarys:{
		        	paper_gen_method:[],
		        	paper_type:[],
		        	exam_type:[]
		        }, //字典表
		        
		        showSTXQ:false, // 控制知识点详情显示
        		details: {}, // 知识点详情数据
        		FSnum:1, //分数number
        		nowSTdata:{},  //临时储存当前预览试题

        		oldSJdata:{},  //修改试卷之前临时保存

        		uploadUrl: this.$axiosURL.fm_fileManipulate + '/upload/bashImport/wordOrExcel/' + this.$store.state.aId + '/' + 0,
		    }
		},
		components: {
			createquestion2
		},
		watch:{
			STall:function(val){
				console.log('STall去重前',val);	
				var oldData = val
				var newData = [];
				var arr = []
				for (var i = oldData.length - 1; i >= 0; i--) {
					if(arr.indexOf(oldData[i].id) == -1){
						arr.push(oldData[i].id);
						newData.push(oldData[i])
					}
				}
				this.STallQC = newData
				console.log('去重',newData);
			},
			STallQC:function(val){	
				console.log(val,33333)
				var test = []
				if (val.length == 0) {
					this.STallZL = []
					return []
				}
				this.STallScore = 0
				val.forEach((element, index)=> {
					if(this.formInline.ZJFS == '人工组卷') {
						this.STallScore+= element.singleScore
					} else {
						this.STallScore+= element.singleScore*element.num
					}
					
					if (element.knowledgePoints.length == 0) {
						element.knowledgePoints = [{name:'其他'}]
					}
					//questionType转中文 、区分模板试题
					var newQuestionType = '模板试题'
					if (element.questionType) {
						var a = this.dictionarys.question_type.find((item)=>(item.value==element.questionType))
						var newQuestionType = a.dictName
					} 
					
					var a = test.find((item)=>(item.knowledgePoints == element.knowledgePoints[0].name))
					if (typeof(a) != 'undefined') {
						var b = a.questionType.find((item)=>(item.questionType == newQuestionType))
						if (typeof(b) != 'undefined') {
							b.num++
							b.FS = Number(b.FS) + Number(element.singleScore)
						}else{
							var demo = {questionType:newQuestionType,num:1,FS:element.singleScore}
							a.questionType.push(demo)
						}
					}else{
						var demo = {knowledgePoints:element.knowledgePoints[0].name,questionType:[{questionType:newQuestionType,num:1,FS:element.singleScore}]}
						test.push(demo)
					}
				});
				this.STallZL = test;
				console.log('筛选',this.STallZL);
			},
			CTZJdata:function(val){
				if (val) {
					this.STall = [] //清空所有重新添加，因为涉及到删除
					for (var i = val.length - 1; i >= 0; i--) {
						this.STall = val[i].info.concat(this.STall)
					}
					this.STall = this.XTandRGdata.concat(this.STall)
				}
			},
			SJZJdata:function(val){
			    console.log(val);	
			    if (val) {
			    	this.STall = [] //清空所有重新添加，因为涉及到删除
					for (var i = val.length - 1; i >= 0; i--) {
						this.STall.push(val[i].info)
					}
			    }	
			},
			XTandRGdata:function(val){
				if (val) {
					//添加到总试题	
					this.STall = val
					for (var i = this.CTZJdata.length - 1; i >= 0; i--) {
						this.STall = this.CTZJdata[i].info.concat(this.STall)
					}

					//去重
					console.log('XTandRGdata',val);	
					var oldData = val
					var newData = [];
					var arr = []
					for (var i = oldData.length - 1; i >= 0; i--) {
						if(arr.indexOf(oldData[i].id) == -1){
							arr.push(oldData[i].id);
							newData.push(oldData[i])
						}
					}
					this.XTandRGdataQC = newData	
					console.log('XTandRGdataQC',this.XTandRGdataQC);
				}	
			},
			XTandRGdataQC:function(val){	
				var test1 = []
				var id = 10000000
				this.dictionarys.question_type.forEach((element, index)=>{
					let a = {id:id++, dictName:element.dictName , value:element.value , ST:[]}
					test1.push(a)
				})
				val.forEach( function(element, index) {
					let a = test1.find((item)=>(item.value == element.questionType))
					a.ST.push(element)
				})
				this.STYLdata = test1
				console.log('预览试题',this.STYLdata);
			},
		},
		methods: {
		    getImgUrl:function(url){
    		  return this.$imgThumbUrl + url
    		},
			changeformSJZJZSD:function(){
				this.formSJZJ.STLX = ''
			},
			changeformCTZJZSD:function(){
				this.formCTZJ.STLX = ''
			},
			beforeAvatarUpload1(file){
		      const extension2 = file.name.split('.')[1] === 'doc'
		      const extension3 = file.name.split('.')[1] === 'docx'
		      if(!extension2 && !extension3) {
		        this.$message({
		          message: '请上传doc、docx格式文件',
		          type: 'error'
		        })
		        return extension2 || extension3
		      }
		    },
		    uploadProgress(){
		       this.$loading({
		          lock: true,
		          text: 'Loading',
		          spinner: 'el-icon-loading',
		          background: 'rgba(0, 0, 0, 0.7)'
		      });
		    },
			uploadSuccess(res,file){
				this.XTandRGdata=[]
				res.examinationQuestions.forEach((element)=>{
                   element.singleScore = 1
                   this.XTandRGdata.push(element)
				})
			},
			wordxaizai(){
		      var url =this.$axiosURL.fm_fileManipulate + '/download/model/'+ '试卷综合试题批量导入模版.docx'
		      window.location.href = url
		    },
			clearnSTZL:function(){
				this.clearnAllDataNoJBXX()
			},
			removelast:function(data){
				var m = []
				for (var i = 0; i < data.length-1; i++) {
					m.push(data[i])
				}
				return m
			},
			removeST:function(id){
				// this.CTZJdata.forEach((element,index)=>{
				// 	if (element.id == id) {
				// 		this.CTZJdata.splice(index,1)
				// 	}
				// })
				this.XTandRGdata.forEach((element,index)=>{
					if (element.id == id) {
						this.XTandRGdata.splice(index,1)
					}
				})
				//this.CTZJdata = JSON.parse(JSON.stringify(this.CTZJdata))
				this.XTandRGdata = JSON.parse(JSON.stringify(this.XTandRGdata))
				//this.showSTXQ = false // 控制知识点详情显示
			},
			ChangeFSnum:function(details,val){
				// this.CTZJdata.forEach((element,index)=>{
				// 	if (element.id == this.nowSTdata.id) {
				// 		element.singleScore = Number(val)
				// 	}
				// })
				this.XTandRGdata.forEach((element,index)=>{
					if (element.id == details.id) {
						element.singleScore = Number(val)
					}
				})
				//this.CTZJdata = JSON.parse(JSON.stringify(this.CTZJdata))
				this.XTandRGdata = JSON.parse(JSON.stringify(this.XTandRGdata))
			},
			clickXTXQ:function(index,row){

			},
			changeRadio:function(){
				if (!this.directoryCreate.subjectsIdsStr||!this.directoryCreate.question_difficulty||!this.directoryCreate.questionsTestingType||!this.directoryCreate.question_ability_norm||!this.directoryCreate.FZ) {
		    		this.$message.error('所填信息不能为空')
		    		return false
		    	}else {
		    		console.log(5555);
		    		this.$bus.$emit('changeRadio',this.directoryCreate)
		    	}
			},
			clearnAllData:function(){
				this.clearnAllDataNoJBXX()
				this.formInline={SJMC: '',ZJFS: '人工组卷'}
			},
			clearnAllDataNoJBXX:function(){
				this.subjectsIdsStrs=[]
		        this.directoryCreate= {subjectsIdsStr: null,question_difficulty: '',exam_modality: '',questionsTestingType: '',question_ability_norm: '',FZ:''}
		        this.visible= false
		        this.XTZJFZ=''//选题组卷分值
		        this.XTandRGdata=[]
		        this.XTandRGdataQC=[]
		        this.XTZJdata=[]  //选题组卷table data
		        this.SJZJdata=[]  //随机组卷table data
		        this.CTZJdata=[] //抽题组卷table data
		        this.STall=[]  //总试题列表
		        this.STallZL=[]  //试题总览列表
		        this.details={} //试题预览
		        this.showYL=false //添加预览切换
		        this.showSTXQ = false
		        this.changeYL = false
		        this.isNotEdit = true
		        this.clearXTZJdata()
		        this.clearCTZJdata()
		        this.clearSJZJdata()
			},
			handleTJ:function(){
				if (!this.formInline.SJMC) {
					this.$message.error('请先填写试卷名称！')
					return
				}
				var totalScore = 0;
				this.STallQC.forEach((element,index)=>{
					totalScore += Number(element.singleScore)
				})
				var addKnowledgePoints = []
				this.STallQC.forEach((element,index)=>{
					if (addKnowledgePoints.indexOf(element.knowledgePoints[0].id)<0) {
						addKnowledgePoints.push(element.knowledgePoints[0].id)
					}
				})
				var param ={
		          paperName:this.formInline.SJMC,
		          totalScore:totalScore,
		          paperType:this.formInline.ZJFS != '人工组卷' ?'模板试卷':'普通试卷',
		          paperGenMethod:this.formInline.ZJFS,
		          addQuestions:this.STallQC,
		          addKnowledgePoints:addKnowledgePoints,
		          ctzj:JSON.stringify(this.CTZJdata),
		          xtzj:JSON.stringify(this.XTandRGdataQC),
		          sjzj:JSON.stringify(this.SJZJdata)
		        }
		        if (this.CTZJdata.length==0&&this.XTandRGdataQC.length==0&&this.SJZJdata.length==0) {
					this.$message.error('试题不能为空！')
					return
				}
				this.$axiosResBody('post',this.$axiosURL.e_examinationPaper+ 'addPaper',param).then((res)=>{
					console.log(333,res);
					this.$confirm('试卷已添加，是否发布考试?', '提示', {
			          confirmButtonText: '发布考试',
			          cancelButtonText: '返回列表',
			          type: 'success'
			        }).then(() => {
			          	this.$bus.$emit('createdKS',res)
			        }).catch(() => {
			            this.clearnAllData()
						this.$store.state.addSJ.dialogVisible=false
						this.$bus.$emit('findPaperPageSJ','')     
			        });
				})
				
			},
			handleChange:function(){
				var totalScore = 0;
				this.STallQC.forEach((element,index)=>{
					totalScore += Number(element.singleScore)
				})
				function changeData(data1,data2){
					var newdata = []
					data1.forEach((element,index)=>{
						if (data2.indexOf(element)<0) {
							newdata.push(element)
						}
					})
					return newdata
				}
				function changeSTData(data1,data2){
					var newdata = []
					data1.forEach((element,index)=>{
						if (data2.indexOf(element.id)<0) {
							newdata.push(element.id)
						}
					})
					return newdata
				}
				//新知识点
				var newAddKnowledgePoints = []
				this.STallQC.forEach((element,index)=>{
					if (newAddKnowledgePoints.indexOf(element.knowledgePoints[0].id)<0) {
						newAddKnowledgePoints.push(element.knowledgePoints[0].id)
					}
				})
				console.log('new',newAddKnowledgePoints);
				//旧知识点
				var oldAddKnowledgePoints = []
				this.oldSJdata.knowledgePoints.forEach((element,index)=>{
					if (oldAddKnowledgePoints.indexOf(element.id)<0) {
						oldAddKnowledgePoints.push(element.id)
					}
				})
				console.log('old',oldAddKnowledgePoints);
				//新试题
				var newQuestions = this.STallQC
				console.log('new',newQuestions);
				//旧试题
				var oldQuestions = this.oldSJdata.examinationQuestions
				console.log('old',oldQuestions);
				
				var param ={
				  id:this.oldSJdata.id,
		          paperName:this.formInline.SJMC,
		          totalScore:totalScore,
		          paperType:'普通试卷',
		          paperGenMethod:this.formInline.ZJFS,
		          addQuestions:this.STallQC,
		          delQuestions:changeSTData(oldQuestions,newQuestions),
		          addKnowledgePoints:changeData(newAddKnowledgePoints,oldAddKnowledgePoints),
		          delKnowledgePoints:changeData(oldAddKnowledgePoints,newAddKnowledgePoints),
		          ctzj:JSON.stringify(this.CTZJdata),
		          xtzj:JSON.stringify(this.XTandRGdataQC),
		          sjzj:JSON.stringify(this.SJZJdata)
		        }
		        console.log(param);
				this.$axiosResBody('post',this.$axiosURL.e_examinationPaper+ 'updatePaper',param).then((res)=>{
					console.log(res);
					this.clearnAllData()
					this.$message.success('修改成功')
					this.$store.state.addSJ.dialogVisible=false
					this.$bus.$emit('findPaperPageSJ','')
				})
			},
			clickST:function(val){
				this.nowSTdata = val
				this.FSnum = Number(val.singleScore)
				this.showSTXQ = true
				this.STEdit(val)
			},
			//选题 添加
			addXTZJchooseData:function(index,row){
				if(this.XTZJFZ == ''&&row.questionType!='COMPREHENSIVE') {
					this.$message.error('请输入分值')
					return
				}
				row.visible = false
				if (row.examinationSubquestions.length>0) {
					row.singleScore = 0
					row.examinationSubquestions.forEach((element,index)=>{
						row.singleScore = Number(row.singleScore)+Number(element.singleScore)
					})
				} else {
					//Object.assign(row,{singleScore:Number(this.XTZJFZ)})
					row.singleScore = Number(this.XTZJFZ)
				}
				var a = this.STallQC.find((element)=>{
					return element.id == row.id
				})
				console.log(a);
				if (typeof(a) == 'undefined') {
					this.XTandRGdata.push(row)
				}else{
					this.$message.error('所选试题已存在！')
				}	
				this.XTZJFZ = ''  
			}, 
			//抽题 改变知识点 获取试题数量 判断
			checkNum:function(val){
				console.log(this.formCTZJ.ZSD);
				if (this.formCTZJ.ZSD&&this.formCTZJ.STLX) {
					var params = {
						kpName:this.formCTZJ.ZSD[this.formCTZJ.ZSD.length - 1],
						questionType:this.formCTZJ.STLX,
					}
					this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ 'find/countBy/kpNameAndQT',params).then((res)=>{
						if (typeof(res) == 'number') {
							this.numInBD = res
						} 
					})
				    //同时获取label显示在table中
				    var obj ={}
				    obj = this.dictionarys.question_type.find((item)=>{
				    	return item.value == val
				    })
				    this.formCTZJ.STLXlabel = obj.dictName
				}
			},
			//随机 改变知识点 获取试题数量 判断
			checkNumSJ:function(val){
				if (this.formSJZJ.ZSD&&this.formSJZJ.STLX) {
					var params = {
						kpName:this.$refs.cascader3.currentLabels[this.formSJZJ.ZSD.length - 1],
						questionType:this.formSJZJ.STLX,
					}
					this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ 'find/countBy/kpNameAndQT',params).then((res)=>{
						if (typeof(res) == 'number') {
							this.numInBDSJ = res
						} 
					})
				    //同时获取label显示在table中
				    var obj ={}
				    obj = this.dictionarys.question_type.find((item)=>{
				    	return item.value == val
				    })
				    this.formSJZJ.STLXlabel = obj.dictName
				}
			},

		    // 右上角X
		    handleClose(){
		    	this.$store.state.addSJ.dialogVisible=false          
		    },

		    // 选题组卷查找
		    searchXTZJdata:function(){
		    	console.log(this.formXTZJ.ZSD);
		    	var params = {
		    		pageNum:this.pageNum,
		    		itemSize:this.pageSize,
		    		kpName:this.formXTZJ.ZSD[this.formXTZJ.ZSD.length - 1],
		    		questionType:this.formXTZJ.STLX,
		    		bodyKey:this.formXTZJ.GJZ,
		    	}
		    	this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ 'find/1/chooseQuestion/1',params).then((res)=>{
		    		console.log('选题',res);
		        	//添加visible，控制选题添加时的Popover
		        	res.nonRepeatedEntities.forEach((element, index)=> {
		        		Object.assign(element,{visible:false})
		        	});
		        	this.XTZJdata = res.nonRepeatedEntities
		        	this.total = res.total
		        })
		    },
		    handleSizeChange(val) {
		    	this.pageNum = 1
		    	this.pageSize = val
		    	this.searchXTZJdata()
		    },
		    handleCurrentChange(val) {
		    	this.pageNum = val
		    	this.searchXTZJdata()
		    },
		    clearXTZJdata:function(){
		    	if (typeof(this.$refs.cascader2)=='undefined') return
		    	//清空cascader
		    	var obj = {}
		    	obj.stopPropagation = () =>{}
	    		this.$refs.cascader2.clearValue(obj)
		    	this.formXTZJ.STLX = ''
		    	this.formXTZJ.GJZ = ''    	
		    },
		    // 抽题组卷添加
		    addCTZJdata:function(){   	
		    	if (this.formCTZJ.STSL>this.numInBD) {
		    		this.$message.error('抽取数量超出数据库已有数量')
		    		return false
		    	}
		    	if (!this.formCTZJ.ZSD||!this.formCTZJ.STLX||!this.formCTZJ.STSL||!this.formCTZJ.DTFZ) {
		    		this.$message.error('所填信息不能为空')
		    		return false
		    	}
		    	var params = {
		    		kpName:this.formCTZJ.ZSD[this.formCTZJ.ZSD.length - 1],
		    		questionType:this.formCTZJ.STLX,
		    		num:this.formCTZJ.STSL,
		    	}
		    	console.log(this.formCTZJ.ZSD);
		    	this.$axiosRes('get',this.$axiosURL.k_examinationQuestion+ 'find/1/drawOutQuestion',params).then((res)=>{
		    		var ress =res //临时数据
		    		var a = [] //重复数据
		    		var b = [] //不重复数据
		    		ress.forEach((element)=>{
		    			var aa =this.STallQC.find((element1)=>{
		    				return element1.id == element.id
		    			})
		    			if (typeof(aa) == 'undefined') {
		    				b.push(element)
		    			}else{
		    				a.push(element)
		    			}
		    		})
		    		if (a.length != 0) {
		    			this.$message.error('选中试题中存才'+a.length+'重复试题，已添加'+b.length+'道试题')
		    		}

		    		for (var i = b.length - 1; i >= 0; i--) {
		    			b[i].singleScore = Number(this.formCTZJ.DTFZ)
		    		}
		    		var arr = {
		    			ZSD:this.formCTZJ.ZSD[this.formCTZJ.ZSD.length - 1],
		    			STLX:this.formCTZJ.STLX,
		    			STLXlabel:this.formCTZJ.STLXlabel,
		    			//STSL:this.formCTZJ.STSL,
		    			STSL:b.length,
		    			DTFZ:this.formCTZJ.DTFZ,
		    			//FZXJ:this.formCTZJ.STSL * this.formCTZJ.DTFZ,
		    			FZXJ:b.length * this.formCTZJ.DTFZ,
		    			info:b
		    		}
		    		if (b.length != 0) {
		    			this.CTZJdata.push(arr)
		    		}
		    		
		    		this.clearCTZJdata()
		    	})
		    	

		    },
		    // 随机组卷添加
		    addSJZJdata:function(){
		    	if (this.formSJZJ.STSL>this.numInBDSJ) {
		    		this.$message.error('抽取数量超出数据库已有数量')
		    		return false
		    	}
		    	if (!this.formSJZJ.ZSD||!this.formSJZJ.STLX||!this.formSJZJ.STSL||!this.formSJZJ.DTFZ) {
		    		this.$message.error('所填信息不能为空')
		    		return false
		    	}
		    	var UserId = this.$store.state.loginUser.id

		    	this.$axiosRes('get',this.$axiosURL.k_neoUser+ 'find/'+UserId,{}).then((id)=>{
		    		var params ={
			    		questionFunctionType:"MODEL",		    		
			    		examinationQuestion:{
			    			questionType:this.formSJZJ.STLX,
			    			num:this.formSJZJ.STSL,
			    			singleScore:Number(this.formSJZJ.DTFZ),
			    			createTime:new Date().getTime(),
			    			createUserID:id.id
			    		}
			    	}
			    	if (this.formSJZJ.ZSD.length>1) {
			    		params['kpId'] = this.formSJZJ.ZSD[this.formSJZJ.ZSD.length - 1]
			    	}else{
			    		params['khId'] = this.formSJZJ.ZSD[this.formSJZJ.ZSD.length - 1]
			    	}    	
			    	console.log(params);
			    	this.$axiosResBody1('post',this.$axiosURL.k_examinationQuestion+ 'save/andRefersTo',params).then((res)=>{
			    		console.log('随机',res);
			    		if (typeof(res.code) != 'undefined') {
			    			this.$message.error('添加失败')
			    		} else {
			    			var ress =res
				    		for (var i = ress.length - 1; i >= 0; i--) {
				    			ress[i].singleScore = Number(this.formCTZJ.DTFZ)
				    		}
				    		var arr = {
				    			ZSD:this.formSJZJ.ZSD[this.formSJZJ.ZSD.length - 1],
				    			STLX:this.formSJZJ.STLX,
				    			STLXlabel:this.formSJZJ.STLXlabel,
				    			STSL:this.formSJZJ.STSL,
				    			DTFZ:this.formSJZJ.DTFZ,
				    			FZXJ:this.formSJZJ.STSL * this.formSJZJ.DTFZ,
				    			info:ress
				    		}
				    		this.SJZJdata.push(arr)
				    		this.clearSJZJdata()
			    		}	
			    	})
		    	})
		    	
		    },
		    //抽题组卷清空
		    clearCTZJdata:function(){
		    	if (typeof(this.$refs.cascader2)=='undefined') return
		    	//清空cascader
		    	var obj = {}
		    	obj.stopPropagation = () =>{}
		    	this.$refs.cascader1.clearValue(obj)
		    	this.formCTZJ.STLX = ''
		    	this.formCTZJ.STSL = ''
		    	this.formCTZJ.DTFZ = ''
		    	this.numInBD = 0 	
		    },
		    //随机组卷清空
		    clearSJZJdata:function(){
		    	if (typeof(this.$refs.cascader3)=='undefined') return
		    	//清空cascader
		    	var obj = {}
		    	obj.stopPropagation = () =>{}
	    		this.$refs.cascader3.clearValue(obj)
		    	this.formSJZJ.STLX = ''
		    	this.formSJZJ.STSL = ''
		    	this.formSJZJ.DTFZ = ''	
		    	this.numInBDSJ = 0 
		    	
		    },
		    removeCTZJdata:function(index,row){
		    	this.CTZJdata.splice(index,1)
		    },
		    removeSJZJdata:function(index,row){
		    	this.SJZJdata.splice(index,1)
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
			// 预览
			submitLook(formName) {
				
			},
			STEdit(res){
		          this.details = JSON.parse(JSON.stringify(res))
		          console.log(this.details,99999997777)      
		          // 题型
		          var obj1 ={}
		          obj1 = this.$store.state.dictionarys.question_type.find((item)=>{
		            return item.value == this.details.questionType
		          })
		          this.details.questionTypes = obj1.dictName         

		          // 选择选项内容
		          if(this.details.questionType == "MULTIPLE_CHOICE" || this.details.questionType == "SINGLE_CHOICE") {
		          	console.log(this.details.questionOption);
		            var questionOptions = this.details.questionOption
		            this.details['questionOptions'] = questionOptions
		            var newquestionOption =[]
		            for (var i = 0; i < this.details.questionOptions.length; i++) {
		              var obj = {}
		              var xx = this.details.questionOptions[i].substr(0,1)
		              var nr = this.details.questionOptions[i].substr(2,this.details.questionOptions[i].length)
		              obj['key'] = xx
		              obj['value'] = nr
                    	if(this.details.eqOptionImageNameList){
              			  obj['img'] = this.details.eqOptionImageNameList[i]
              			}
		              newquestionOption.push(obj)
		            }
		            this.details.questionOption = newquestionOption
		          }

		          // 选择答案
		          if(this.details.questionType == "MULTIPLE_CHOICE") {
		              this.details.questionAnswer = this.details.questionAnswer.split(",")
		          }

		          // 填空答案
		          if(this.details.questionType == "GAP_FILLING") {
		            var tkquestionAnswer = this.details.questionAnswer.split(",")
		            var tkquestionAnswerArr = []
		            for (var i = 0; i < tkquestionAnswer.length; i++) {
		              var obj1 = {}
		              obj1['value'] = tkquestionAnswer[i]
		              tkquestionAnswerArr.push(obj1)
		            }
		            this.details.questionAnswer = tkquestionAnswerArr
		            // var tkquestionAnswerarr = []
		          }

		          // 综合题
		          if(this.details.questionType == "COMPREHENSIVE") {
		            for (var i = 0; i < this.details.examinationSubquestions.length; i++) {
		              // 综合题下的填空题答案数据转换
		              if(this.details.examinationSubquestions[i].questionType == "GAP_FILLING") {
		                  var zhtkquestionAnswer = this.details.examinationSubquestions[i].questionAnswer.split(",")
		                  var zhtkquestionAnswerArr = []
		                  for (var j = 0; j < zhtkquestionAnswer.length; j++) {
		                    var obj2 ={}
		                    obj2['value'] = zhtkquestionAnswer[j]
		                    zhtkquestionAnswerArr.push(obj2)
		                  }
		                this.details.examinationSubquestions[i].questionAnswer = zhtkquestionAnswerArr
		              }

		              // 综合题下的选择题选项
		            if(this.details.examinationSubquestions[i].questionType == "MULTIPLE_CHOICE" || this.details.examinationSubquestions[i].questionType == "SINGLE_CHOICE") {
		              var questionOptions = this.details.examinationSubquestions[i].questionOption
		              this.details.examinationSubquestions[i]['questionOptions'] = questionOptions
		              var newquestionOption =[]
		              for (var k = 0; k < this.details.examinationSubquestions[i].questionOptions.length; k++) {
		                var obj3 = {}
		                var xx = this.details.examinationSubquestions[i].questionOptions[k].substr(0,1)
		                var nr = this.details.examinationSubquestions[i].questionOptions[k].substr(2,this.details.examinationSubquestions[i].questionOptions[k].length)
		                obj3['key'] = xx
		                obj3['value'] = nr
               			if(this.details.examinationSubquestions[i].eqOptionImageNameList){
               			  obj3['img'] = this.details.examinationSubquestions[i].eqOptionImageNameList1[k]
               			}
		                newquestionOption.push(obj3)
		              }
		              this.details.examinationSubquestions[i].questionOption = newquestionOption
		            }

		              // 综合题下的选择题答案
		              if(this.details.examinationSubquestions[i].questionType == "MULTIPLE_CHOICE") {
		                  this.details.examinationSubquestions[i].questionAnswer = this.details.examinationSubquestions[i].questionAnswer.split(",")
		              }
		            }
		          }    
		      },		
		},
		created:function(){
		    this.dictionarys = JSON.parse(sessionStorage.getItem('dictionarys'))
		},
		updated:function(){
		    var that = this
  			$('.STNR').on("click",".tImg img",function(){
  			    console.log('asd')
  			    if($(this).attr("name") == '1'){
  			      return
  			    }
  			    var arr = $(this).attr("src").split('/')
  			    var pos = arr[arr.length-1].indexOf('__')
  			    $(this).attr("src", that.$imgUrl + arr[arr.length-1].substr(pos + 2))
  			    $(this).attr("name", '1')
  			})
  			$('.STNR').on("click",".aImg img",function(){
  			    if($(this).attr("name") == '1'){
  			      return
  			    }
  			    var arr = $(this).attr("src").split('/')
  			    var pos = arr[arr.length-1].indexOf('__')
  			    $(this).attr("src", that.$imgUrl + arr[arr.length-1].substr(pos + 2))
  			    $(this).attr("name", '1')
  			})
		},
		mounted:function(){
			
			this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
				this.ZSDdata = this.getTreeData(res);
			})

			//试卷编辑
			this.$bus.$on('EditSJ',(row)=>{
				this.oldSJdata = row
				this.clearnAllData()
				this.changeYL = true
				this.formInline.SJMC= row.paperName
				this.formInline.ZJFS= row.paperGenMethod
				this.CTZJdata = JSON.parse(row.ctzj)
				this.XTandRGdata = JSON.parse(row.xtzj)
				this.SJZJdata = JSON.parse(row.sjzj)
			})

			//试卷预览
			this.$bus.$on('EditLook',(row)=>{
				this.oldSJdata = row
				this.clearnAllData()
				this.isNotEdit = false
				console.log(this.changeYL);
				console.log(this.showYL);
				this.formInline.SJMC= row.paperName
				this.formInline.ZJFS= row.paperGenMethod
				this.CTZJdata = JSON.parse(row.ctzj)
				this.XTandRGdata = JSON.parse(row.xtzj)
				this.SJZJdata = JSON.parse(row.sjzj)
			})

			this.$bus.$on('clickXJ',()=>{
				this.$store.state.addSJ.dialogVisible = true;
				this.clearnAllData()
				// this.XTZJdata=[]  //选题组卷table data
		  //       this.SJZJdata=[]  //随机组卷table data
		  //       this.CTZJdata=[] //抽题组卷table data
		  //       this.STall=[]  //总试题列表
		  //       this.STallZL=[]  //试题总览列表
		  //       this.details={} //试题预览
				console.log(this.XTZJdata);
				console.log(this.SJZJdata);
				console.log(this.CTZJdata);
				console.log(this.STall);
				console.log(this.STallZL);
				console.log(this.details);
			})

			this.$bus.$on('clickLook',()=>{
				this.formInline.SJMC= row.paperName
				this.formInline.ZJFS= row.paperGenMethod
				this.CTZJdata = JSON.parse(row.ctzj)
				this.XTandRGdata = JSON.parse(row.xtzj)
				this.SJZJdata = JSON.parse(row.sjzj)
			})
			//人工录入获取
			this.$bus.$on('createdRes',(res)=>{
				Object.assign(res,{singleScore:Number(this.directoryCreate.FZ)})
				this.XTandRGdata.push(res)
				 // this.directoryCreate= {subjectsIdsStr: null,question_difficulty: '',exam_modality: '',questionsTestingType: '',question_ability_norm: '',FZ:''}
				 this.directoryCreate.question_difficulty = ''
				 this.directoryCreate.exam_modality = ''
				 this.directoryCreate.questionsTestingType = ''
				 this.directoryCreate.question_ability_norm = ''
				 this.directoryCreate.FZ = ''
			})

			this.$bus.$on('createdJS',()=>{
				this.$router.push({path: '/testMaintenance'});
				this.$store.state.addSJ.dialogVisible = true;
				this.clearnAllData()
			})
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-menu-vertical-demo{
	text-align: center;
}
img{
  vertical-align: middle;
  width: 100px;
  height: 100px;
  margin-left: 6px;

}
.viewer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border: 1px solid red;
}
.aImg, .tImg {
  display: inline-block;
}
p {
	padding-top: 4px;
}
</style>
