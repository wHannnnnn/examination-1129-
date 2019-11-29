<template>
<div class="test change">
  <div class="app_header">
      <impheader></impheader>
  </div>
 	<div class="indexDiv">
    <el-row style="height: 43px;line-height: 43px;text-align: left;">
      <el-col :span='14' style="padding-top: 10px">
        <el-progress :text-inside="true" :stroke-width="20" :percentage="progress.BFS"></el-progress>
      </el-col>
      <el-col :span='5'>
        已完成{{progress.DQST}}题/共{{progress.ST}}题
      </el-col>
      <el-col :span='1'>
        <el-progress type="circle" :percentage="overtime.BFS" :width="42"></el-progress>
      </el-col>
      <el-col :span='4' style="font-size: 16px">
        <p>剩余时长:{{overtime.value}}</p>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span='18' >
        <div class='SJleft'>
        <!-- 答题样式 -->
        <div style='text-align: left;'  v-for="item in STdataFL" v-if="item.question.length!=0">
          <b class="SJTitle">{{item.dictName}}</b>
          <!-- 单选题 -->
          <div v-if="item.dictName == '单选题'" >
            <el-row :key='index' v-for="(question,index) in item.question" class="STRow" :id="'top0_'+index">
              <el-col :span="1">
                <div class="STnum">{{index+1}}</div>
              </el-col>
              <el-col :span="23">
                {{question.questionBody}}
                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer>
                <!-- <span v-for="item in question.eqBodyImageNameList1" v-if="question.eqBodyImageNameList1.length>0"><img :src="getImgUrl(item)" alt=""></span> -->

                <div v-for='(it,index1) in question.questionAccessories'>
 <!--                  <el-tag type="success" @click.native='clickAccessories(it)'>附件{{index1+1}}</el-tag> -->
                  <av-bars
                    v-if="it.questionAccessoryType == 'VOICE'"
                    caps-color="#FFF"
                    :bar-color="['#f00', '#ff0', '#0f0']"
                    canv-fill-color="#000"
                    :caps-height="2"
                    :cors-anonym="true"
                    :audio-src= "getAudioUrl(it.accessUrl)"
                  ></av-bars>

                  <video v-if="it.questionAccessoryType == 'VIDEO'" controls width="300" :src="getAudioUrl(it.accessUrl)"></video>
                </div> 
                <div class='XZTbody'  v-for='(val,index) in analysisDXT(question.questionOption)'> 
                  <el-radio v-model="question.studentAnswer" :label="val">{{val}}</el-radio>

                   <!-- <img :src="getImgUrl(question.eqOptionImageNameList1[index])" alt="" v-if="question.eqOptionImageNameList1.length>0"> -->

                   <viewer class="aImg" v-if="question.eqOptionImageNameList1.length>0">
                   <img
                       :src="getImgUrl(question.eqOptionImageNameList1[index])" 
                       :key="index"
                     >
                   </viewer>
                </div>
                <div v-if='isGoHome' class="rightque">
                  正确答案：{{question.questionAnswer}}
                </div>
                <div v-if='isGoHome' class="rightque">
                  解析：{{question.questionAnalyze?question.questionAnalyze:'无'}}
                </div>
              </el-col>
            </el-row>
            
          </div>
          <!-- 多选题 -->
          <div v-if="item.dictName == '多选题'">
            <el-row :key='index' v-for="(question,index) in item.question" class="STRow" :id="'top1_'+index">
              <el-col :span="1">
                <div class="STnum">{{index+1}}</div>
              </el-col>
              <el-col :span="23">
                {{question.questionBody}}
                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer>
                <div v-for='(it,index1) in question.questionAccessories'>
<!--                   <el-tag type="success" @click.native='clickAccessories(it)'>附件{{index1+1}}</el-tag> -->
                  <av-bars
                    v-if="it.questionAccessoryType == 'VOICE'"
                    caps-color="#FFF"
                    :bar-color="['#f00', '#ff0', '#0f0']"
                    canv-fill-color="#000"
                    :caps-height="2"
                    :cors-anonym="true"
                    :audio-src= "getAudioUrl(it.accessUrl)"
                  ></av-bars>

                  <video v-if="it.questionAccessoryType == 'VIDEO'" controls width="300" :src="getAudioUrl(it.accessUrl)"></video>
                </div> 
                <el-checkbox-group v-model="question.DXTAnswer">
                  <div class='XZTbody'  v-for='(val1,index) in analysisDXT(question.questionOption)'> 
                    <el-checkbox :label="val1"></el-checkbox>
                    <!-- <img :src="getImgUrl(question.eqOptionImageNameList1[index])" alt="" v-if="question.eqOptionImageNameList1.length>0"> -->
                   <viewer class="aImg" v-if="question.eqOptionImageNameList1.length>0">
                      <img
                       :src="getImgUrl(question.eqOptionImageNameList1[index])" 
                       :key="index"
                     >
                   </viewer>
                  </div>
                </el-checkbox-group>
                <div v-if='isGoHome' class="rightque">
                  正确答案：{{question.questionAnswer}}
                </div>
                <div v-if='isGoHome' class="rightque">
                  解析：{{question.questionAnalyze?question.questionAnalyze:'无'}}
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 填空题 -->
          <div v-if="item.dictName == '填空题'">
            <el-row :key='index' v-for="(question,index) in item.question" class="STRow" :id="'top2_'+index">
              <el-col :span="1">
                <div class="STnum">{{index+1}}</div>
              </el-col>
              <el-col :span="23">
                {{question.questionBody}}
                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer> 
                <div v-for='(it,index1) in question.questionAccessories'>
  <!--                 <el-tag type="success" @click.native='clickAccessories(it)'>附件{{index1+1}}</el-tag> -->
                    <av-bars
                    v-if="it.questionAccessoryType == 'VOICE'"
                    caps-color="#FFF"
                    :bar-color="['#f00', '#ff0', '#0f0']"
                    canv-fill-color="#000"
                    :caps-height="2"
                    :cors-anonym="true"
                    :audio-src= "getAudioUrl(it.accessUrl)"
                  ></av-bars>

                  <video v-if="it.questionAccessoryType == 'VIDEO'" controls width="300" :src="getAudioUrl(it.accessUrl)"></video>
                </div>
                <div class='XZTbody'> 
                  <el-row :gutter="10">
                    <el-col :span='4' :key='index1' v-for='(val,index1) in analysisTKT(question.questionBody)'>
                      <el-input
                        size="small"
                        :placeholder="'内容'+(index1+1)"
                        v-model="question.TKTAnswer[index1].value"
                        clearable>
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
                <div v-if='isGoHome' class="rightque">
                  正确答案：{{question.questionAnswer}}
                </div>
                <div v-if='isGoHome' class="rightque">
                  解析：{{question.questionAnalyze?question.questionAnalyze:'无'}}
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 判断题 -->
          <div v-if="item.dictName == '判断题'">
            <el-row :key='index' v-for="(question,index) in item.question" class="STRow" :id="'top3_'+index">
              <el-col :span="1">
                <div class="STnum">{{index+1}}</div>
              </el-col>
              <el-col :span="23">
                {{question.questionBody}}
                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer> 
                <div v-for='(it,index1) in question.questionAccessories'>
 <!--                  <el-tag type="success" @click.native='clickAccessories(it)'>附件{{index1+1}}</el-tag> -->
                   <av-bars
                    v-if="it.questionAccessoryType == 'VOICE'"
                    caps-color="#FFF"
                    :bar-color="['#f00', '#ff0', '#0f0']"
                    canv-fill-color="#000"
                    :caps-height="2"
                    :cors-anonym="true"
                    :audio-src= "getAudioUrl(it.accessUrl)"
                  ></av-bars>

                  <video v-if="it.questionAccessoryType == 'VIDEO'" controls width="300" :src="getAudioUrl(it.accessUrl)"></video>
                </div>
                <div class='XZTbody'  v-for='(val,index) in analysisDXT(question.questionOption)'> 
                  <el-radio v-model="question.studentAnswer" :label="val">{{val}}</el-radio>
                </div>
                <div v-if='isGoHome' class="rightque">
                  正确答案：{{question.questionAnswer}}
                </div>
                <div v-if='isGoHome' class="rightque">
                  解析：{{question.questionAnalyze?question.questionAnalyze:'无'}}
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 简答题 -->
          <div v-if="item.dictName == '简答题'">
            <el-row :key='index' v-for="(question,index) in item.question" class="STRow" :id="'top4_'+index">
              <el-col :span="1">
                <div class="STnum">{{index+1}}</div>
              </el-col>
              <el-col :span="23">
                {{question.questionBody}}
                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer> <br/>
                <div v-for='(it,index1) in question.questionAccessories'>
<!--                   <el-tag type="success" @click.native='clickAccessories(it)'>附件{{index1+1}}</el-tag> -->
                  <av-bars
                    v-if="it.questionAccessoryType == 'VOICE'"
                    caps-color="#FFF"
                    :bar-color="['#f00', '#ff0', '#0f0']"
                    canv-fill-color="#000"
                    :caps-height="2"
                    :cors-anonym="true"
                    :audio-src= "getAudioUrl(it.accessUrl)"
                  ></av-bars>

                  <video v-if="it.questionAccessoryType == 'VIDEO'" controls width="300" :src="getAudioUrl(it.accessUrl)"></video>
                </div>
                <el-input
                  type="textarea"
                  :autosize="{minRows: 3}"
                  placeholder="请输入答案"
                  v-model="question.studentAnswer">
                </el-input>
                <div v-if='isGoHome' class="rightque">
                  正确答案：{{question.questionAnswer}}
                </div>
                <div v-if='isGoHome' class="rightque">
                  关键字：{{question.keys.join(',')}}
                </div>
                <div v-if='isGoHome' class="rightque">
                  解析：{{question.questionAnalyze?question.questionAnalyze:'无'}}
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 论述题 -->
          <div v-if="item.dictName == '论述题'">
            <el-row :key='index' v-for="(question,index) in item.question" class="STRow" :id="'top5_'+index">
              <el-col :span="1">
                <div class="STnum">{{index+1}}</div>
              </el-col>
              <el-col :span="23">
                {{question.questionBody}}
                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer> <br/>
                <div v-for='(it,index1) in question.questionAccessories'>
                  <!-- <el-tag type="success" @click.native='clickAccessories(it)'>附件{{index1+1}}</el-tag> -->
                  <av-bars
                    v-if="it.questionAccessoryType == 'VOICE'"
                    caps-color="#FFF"
                    :bar-color="['#f00', '#ff0', '#0f0']"
                    canv-fill-color="#000"
                    :caps-height="2"
                    :cors-anonym="true"
                    :audio-src= "getAudioUrl(it.accessUrl)"
                  ></av-bars>

                  <video v-if="it.questionAccessoryType == 'VIDEO'" controls width="300" :src="getAudioUrl(it.accessUrl)"></video>
                </div>
                <el-input
                  type="textarea"
                  :autosize="{minRows: 4}"
                  placeholder="请输入答案"
                  v-model="question.studentAnswer">
                </el-input>
                <div v-if='isGoHome' class="rightque">
                  正确答案：{{question.questionAnswer}}
                </div>
                <div v-if='isGoHome' class="rightque">
                  关键字：{{question.keys.join(',')}}
                </div>
                <div v-if='isGoHome' class="rightque">
                  解析：{{question.questionAnalyze?question.questionAnalyze:'无'}}
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 综合题 -->
          <div v-if="item.dictName == '综合题'">
            <el-row :key='index' v-for="(question,index) in item.question" class="STRow" :id="'top6_'+index">
              <el-col :span="1">
                <div class="STnum">{{index+1}}</div>
              </el-col>
              <el-col :span="23">
                {{question.questionBody}}
                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer> 
                <div v-for='(it,index1) in question.questionAccessories'>
<!--                   <el-tag type="success" @click.native='clickAccessories(it)'>附件{{index1+1}}</el-tag> -->
                  <av-bars
                    v-if="it.questionAccessoryType == 'VOICE'"
                    caps-color="#FFF"
                    :bar-color="['#f00', '#ff0', '#0f0']"
                    canv-fill-color="#000"
                    :caps-height="2"
                    :cors-anonym="true"
                    :audio-src= "getAudioUrl(it.accessUrl)"
                  ></av-bars>

                  <video v-if="it.questionAccessoryType == 'VIDEO'" controls width="300" :src="getAudioUrl(it.accessUrl)"></video>
                </div>
                <!-- 循环examinationSubquestions -->
                <div style='text-align: left;' v-for="(ZHT,index) in question.examinationSubquestions" v-if="question.examinationSubquestions.length!=0">

                  <!-- 综合题——单选题 -->
                  <div v-if="ZHT.questionType == 'SINGLE_CHOICE'">
                    <el-row :key='index'  class="STRow">
                      <el-col :span="1">
                        <div class="STnum">●</div>
                      </el-col>
                      <el-col :span="23">
                        {{ZHT.questionBody}}
                        <viewer :images="ZHT.eqBodyImageNameList1" class="tImg" v-if="ZHT.eqBodyImageNameList1"> 
                          <img
                            v-for="(src,index) in ZHT.eqBodyImageNameList1"
                            :src="getImgUrl(src)"
                            @click="clickImg(src,index,0)"
                            :key="index"
                          >
                        </viewer>
                        <div class='XZTbody'  v-for='(val,index) in analysisDXT(ZHT.questionOption)'>
                          <!-- <el-radio v-model="ZHT.studentAnswer" :label="val">{{val}}</el-radio> -->
                          <viewer class="aImg" v-if="ZHT.eqOptionImageNameList1.length>0">
                          <img
                              :src="getImgUrl(ZHT.eqOptionImageNameList1[index])" 
                              :key="index"
                            >
                          </viewer>
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          正确答案：{{ZHT.questionAnswer}}
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          解析：{{ZHT.questionAnalyze?ZHT.questionAnalyze:'无'}}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <!-- 综合题——多选题 -->
                  <div v-if="ZHT.questionType == 'MULTIPLE_CHOICE'">
                    <el-row :key='index'  class="STRow">
                      <el-col :span="1">
                        <div class="STnum">●</div>
                      </el-col>
                      <el-col :span="23">
                        {{ZHT.questionBody}}
                        <viewer :images="ZHT.eqBodyImageNameList1" class="tImg" v-if="ZHT.eqBodyImageNameList1"> 
                          <img
                            v-for="(src,index) in ZHT.eqBodyImageNameList1"
                            :src="getImgUrl(src)"
                            @click="clickImg(src,index,0)"
                            :key="index"
                          >
                        </viewer>
                        <el-checkbox-group v-model="ZHT.DXTAnswer">
                          <div class='XZTbody'  v-for='(val1,index) in analysisDXT(ZHT.questionOption)'> 
                            <el-checkbox :label="val1"></el-checkbox>
                            <viewer class="aImg" v-if="ZHT.eqOptionImageNameList1.length>0">
                              <img
                                  :src="getImgUrl(ZHT.eqOptionImageNameList1[index])" 
                                  :key="index"
                                >
                            </viewer>
                          </div>
                        </el-checkbox-group>
                        <div v-if='isGoHome' class="rightque">
                          正确答案：{{ZHT.questionAnswer}}
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          解析：{{ZHT.questionAnalyze?ZHT.questionAnalyze:'无'}}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <!-- 综合题——填空题 -->
                  <div v-if="ZHT.questionType == 'GAP_FILLING'">
                    <el-row :key='index'  class="STRow">
                      <el-col :span="1">
                        <div class="STnum">●</div>
                      </el-col>
                      <el-col :span="23">
                        {{ZHT.questionBody}}
                        <viewer :images="ZHT.eqBodyImageNameList1" class="tImg" v-if="ZHT.eqBodyImageNameList1"> 
                          <img
                            v-for="(src,index) in ZHT.eqBodyImageNameList1"
                            :src="getImgUrl(src)"
                            @click="clickImg(src,index,0)"
                            :key="index"
                          >
                        </viewer> 
                        <div class='XZTbody'> 
                          <el-row :gutter="10">
                            <el-col :span='4' :key='index1' v-for='(val,index1) in analysisTKT(ZHT.questionBody)'>
                              <el-input
                                size="small"
                                :placeholder="'内容'+(index1+1)"
                                v-model="ZHT.TKTAnswer[index1].value"
                                clearable>
                              </el-input>
                            </el-col>
                          </el-row>
                          
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          正确答案：{{ZHT.questionAnswer}}
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          解析：{{ZHT.questionAnalyze?ZHT.questionAnalyze:'无'}}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                   <!-- 综合题——判断题 -->
                  <div v-if="ZHT.questionType == 'CHECKING'">
                    <el-row :key='index'  class="STRow">
                      <el-col :span="1">
                        <div class="STnum">●</div>
                      </el-col>
                      <el-col :span="23">
                        {{ZHT.questionBody}}
                        <viewer :images="ZHT.eqBodyImageNameList1" class="tImg" v-if="ZHT.eqBodyImageNameList1"> 
                          <img
                            v-for="(src,index) in ZHT.eqBodyImageNameList1"
                            :src="getImgUrl(src)"
                            @click="clickImg(src,index,0)"
                            :key="index"
                          >
                        </viewer> 
                        <div class='XZTbody' v-for='(val,index) in analysisDXT(ZHT.questionOption)'> 
                          <el-radio v-model="ZHT.studentAnswer" :label="val">{{val}}</el-radio>
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          正确答案：{{ZHT.questionAnswer}}
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          解析：{{ZHT.questionAnalyze?ZHT.questionAnalyze:'无'}}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <!-- 综合题——简答题 -->
                  <div v-if="ZHT.questionType == 'SHORT_ANSWER'">
                    <el-row :key='index'  class="STRow">
                      <el-col :span="1">
                        <div class="STnum">●</div>
                      </el-col>
                      <el-col :span="23">
                        {{ZHT.questionBody}}
                        <viewer :images="ZHT.eqBodyImageNameList1" class="tImg" v-if="ZHT.eqBodyImageNameList1"> 
                          <img
                            v-for="(src,index) in ZHT.eqBodyImageNameList1"
                            :src="getImgUrl(src)"
                            @click="clickImg(src,index,0)"
                            :key="index"
                          >
                        </viewer> <br/>
                        <el-input
                          type="textarea"
                          :autosize="{minRows: 3}"
                          placeholder="请输入答案"
                          v-model="ZHT.studentAnswer">
                        </el-input>
                        <div v-if='isGoHome' class="rightque">
                          正确答案：{{ZHT.questionAnswer}}
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          关键字：{{ZHT.keys.join(',')}}
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          解析：{{ZHT.questionAnalyze?ZHT.questionAnalyze:'无'}}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <!-- 综合题——论述题 -->
                  <div v-if="ZHT.questionType == 'EXPOUND'">
                    <el-row :key='index' class="STRow">
                      <el-col :span="1">
                        <div class="STnum">●</div>
                      </el-col>
                      <el-col :span="23">
                        {{ZHT.questionBody}}
                        <viewer :images="ZHT.eqBodyImageNameList1" class="tImg" v-if="ZHT.eqBodyImageNameList1"> 
                          <img
                            v-for="(src,index) in ZHT.eqBodyImageNameList1"
                            :src="getImgUrl(src)"
                            @click="clickImg(src,index,0)"
                            :key="index"
                          >
                        </viewer> <br/>
                        <el-input
                          type="textarea"
                          :autosize="{minRows: 4}"
                          placeholder="请输入答案"
                          v-model="ZHT.studentAnswer">
                        </el-input>
                        <div v-if='isGoHome' class="rightque">
                          正确答案：{{ZHT.questionAnswer}}
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          关键字：{{ZHT.keys.join(',')}}
                        </div>
                        <div v-if='isGoHome' class="rightque">
                          解析：{{ZHT.questionAnalyze?ZHT.questionAnalyze:'无'}}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      </el-col>
      <el-col :span='6'>
        <div class="SJright">
            <div class="examType" v-for="(item,queIndex) in STdataFL" v-if="item.question.length!=0">
              <p class="SJTitle">{{item.dictName}}</p>
              <el-row>
                <el-col :span='5' :key='index' v-for="(question,index) in item.question">
                  <el-tag @click.native='returnTop(queIndex,index)' :type="question.ZT==0?'':question.ZT==1?'warning':question.ZT==2?'success':'danger'">{{index+1}}</el-tag>
                </el-col>
              </el-row>
            </div>
          <div class="SJright_bottom">
             <el-button type="primary" v-if='!isGoHome'  @click='submitSJ'>交卷</el-button>
             <el-button type="primary" v-if='isGoHome'  @click='goHome'>返回</el-button>
          </div>
         
        </div>
      </el-col>
    </el-row>
  </div>
  <el-dialog
      :visible.sync="dialogVisibleFJ"
      top='100px'
      width="1000px">
      <div style='height:600px;' v-if='dialogVisibleFJ == true'>
        <uniPlayer :FJdata='nowFJ' ></uniPlayer>
      </div>   
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleFJ = false">关 闭</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
import uniPlayer from '../unit/unit_player.vue'
import impheader from '@/components/layout/header1'
export default {
  name: 'index',
  components:{
    uniPlayer,
    impheader
  },
  data () {
    return {
      progress:{
        BFS:30,
        DQST:0,
        ST:0
      },
      overtime:{
        value:'',
        BFS:0
      },
      STdata:[],  //所有考试试题
      STdataFL:[],  //试题dataf分类
      
      sub:[],  //综合题小题分值
      time:null,   //定时任务
      isGoHome:false,
      dialogVisibleFJ:false,
      nowFJ:null,
    }
  },
  watch:{
    //深度监听
    STdataFL:{
      handler(val){
        console.log('pppp');
        if (!this.isGoHome) {
          val.forEach((element,index)=>{
          element.question.forEach((val,index)=>{
            //多选题临时更新到正式
            if (val.DXTAnswer) {
              if (val.DXTAnswer.length != 0) {
                val.studentAnswer = val.DXTAnswer.join(';')
              }else {
                val.studentAnswer = ''
              }
            }else if (val.TKTAnswer) {   //填空题临时更新到正式
              if (val.TKTAnswer[0].value||val.TKTAnswer[1].value||val.TKTAnswer[2].value||val.TKTAnswer[3].value||val.TKTAnswer[4].value||val.TKTAnswer[5].value||val.TKTAnswer[6].value||val.TKTAnswer[7].value||val.TKTAnswer[8].value||val.TKTAnswer[9].value) {
                var a = val.TKTAnswer[0].value
                for (var i = 1; i <= val.TKTAnswer.length -1 ; i++) {
                  if (val.TKTAnswer[i].value) {
                    a = a + ';' +val.TKTAnswer[i].value
                  }
                }
                val.studentAnswer = a
              }else {
                val.studentAnswer = ''
              }
            }else if(val.examinationSubquestions){
              var studentAnswer = 0 //多选题答题数量
              val.examinationSubquestions.forEach((elem,index)=>{
                //综合题多选题临时更新到正式
                if (elem.DXTAnswer) {
                  if (elem.DXTAnswer.length != 0) {
                    elem.studentAnswer = elem.DXTAnswer.join(';')
                    studentAnswer += 1
                  }else {
                    elem.studentAnswer = ''
                  }
                }else if (elem.TKTAnswer) {   //综合题填空题临时更新到正式
                  if (elem.TKTAnswer[0].value||elem.TKTAnswer[1].value||elem.TKTAnswer[2].value||elem.TKTAnswer[3].value||elem.TKTAnswer[4].value||elem.TKTAnswer[5].value||elem.TKTAnswer[6].value||elem.TKTAnswer[7].value||elem.TKTAnswer[8].value||elem.TKTAnswer[9].value) {
                    var a = elem.TKTAnswer[0].value
                    for (var i = 1; i <= elem.TKTAnswer.length -1 ; i++) {
                      if (elem.TKTAnswer[i].value) {
                        a = a + ';' +elem.TKTAnswer[i].value
                      }
                    }
                    elem.studentAnswer = a
                    studentAnswer += 1
                  }else {
                    elem.studentAnswer = ''
                  }
                }else{
                  if (elem.studentAnswer) {
                    studentAnswer += 1
                  }
                }
              })
              if (studentAnswer != 0) {
                val.studentAnswer = '已答题'
              } else {
                val.studentAnswer = ''
              }
            }
          })
        })

        //填空题临时更新到正式
        val.forEach((element,index)=>{
          element.question.forEach((val,index)=>{
            
          })
        })

        //更新考试进度
        var a = 0
        val.forEach((element,index)=>{
          element.question.forEach((val,index)=>{
            if (val.studentAnswer) {
              a += 1
              val.ZT = 1
            }else {
              val.ZT = 0
            }
          })
        })
        this.progress.DQST = a
        this.progress.BFS = parseInt(a/this.progress.ST*100)
        }  
      },
      deep:true,
      immediate:false,
      iIndex: 0
    }

  },

  methods: {
    getImgUrl:function(url){
      return this.$imgThumbUrl + url
    },
    getAudioUrl(url){
      return this.$BASEURL + url
    },
    //锚点
    returnTop:function(queIndex,index){
      var a = '#top'+queIndex+'_'+index
      document.querySelector(a).scrollIntoView(true)
    },
    clickAccessories:function(data){
      this.dialogVisibleFJ= true
      this.nowFJ = data
    },
    //单选题解析
    analysisDXT:function(data){
      return data
    },
    analysisTKT:function(data){
      var a = data.split('_')
      var b = []
      for (var i = a.length - 2; i >= 0; i--) {
        b.push({})
      }
      return b
    },
    submitSJ:function(){
      this.$confirm('确认是否交卷?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
            this.submitPaper()
        }).catch(() => {
            
        });
    },
    submitPaper:function(){
      this.isGoHome = true
      this.$message.success('判卷成功')
      clearInterval(this.time)
      //判卷

      this.STdataFL.forEach((element,index)=>{
        element.question.forEach((val,index1)=>{
          console.log('判卷',val);
          if (val.questionType == 'SINGLE_CHOICE') {
            if (val.studentAnswer&&val.studentAnswer.substring(0,1) == val.questionAnswer) {
              val.ZT = 2
            }else {
              val.ZT = 3
              this.wrongQuestions(val)   
            }
          } else if(val.questionType == "MULTIPLE_CHOICE"){
              var a = ''
                for (var i = 0; i <= val.studentAnswer.split(';').sort().length-1; i++) {
                  a += val.studentAnswer.split(';').sort()[i].substring(0,1)
                }
               if (a == val.questionAnswer.split(',').join('')) {
                  val.ZT = 2
               }else {
                  val.ZT = 3
                  this.wrongQuestions(val)
               }
          }else if(val.questionType == "CHECKING"){
            if (val.studentAnswer&&val.studentAnswer.split('.')[1] == val.questionAnswer) {
               val.ZT = 2
            }else {
              val.ZT = 3
              this.wrongQuestions(val)   
            }
          }else if(val.questionType == "GAP_FILLING"){
            if (val.studentAnswer.split(';').join(',') == val.questionAnswer) {
              val.ZT = 2
            } else {
              val.ZT = 3
              this.wrongQuestions(val)
            }
          }else if(val.questionType == "SHORT_ANSWER"||val.questionType == "EXPOUND"){
            var istrue = val.keys.length==0?false:true
            if (val.keys) {
              val.keys.forEach((element2,index2)=>{
                if (val.studentAnswer.indexOf(element2) == -1) {
                  istrue = false
                }
              })
             if (istrue) {
                val.ZT = 2
              } else {
                val.ZT = 3
                this.wrongQuestions(val)
              }
            } else {
              val.ZT = 3
              this.wrongQuestions(val)
            }

          }else if(val.questionType == "COMPREHENSIVE"){
            var ZHTistrue = true
            val.examinationSubquestions.forEach((element6)=>{
              if (element6.questionType == 'SINGLE_CHOICE') {
                if (element6.studentAnswer&&element6.studentAnswer.substring(0,1) == element6.questionAnswer) {
                }else {
                  ZHTistrue = false
                }
              } else if(element6.questionType == "MULTIPLE_CHOICE"){
                  var a = ''
                    for (var i = 0; i <= element6.studentAnswer.sort().length-1; i++) {
                      a += element6.studentAnswer.sort()[i].substring(0,1)
                    }
                   if (a == element6.questionAnswer.split(',').join('')) {

                   }else {
                      ZHTistrue = false
                   }
              }else if(element6.questionType == "CHECKING"){
                if (element6.studentAnswer&&element6.studentAnswer.split('.')[1] == element6.questionAnswer) {

                }else {
                  ZHTistrue = false
                }
              }else if(element6.questionType == "GAP_FILLING"){
                if (element6.studentAnswer.split(';').join(',') == element6.questionAnswer) {

                } else {
                  ZHTistrue = false
                }
              }else if(element6.questionType == "SHORT_ANSWER"||element6.questionType == "EXPOUND"){
                var istrue =true
                if (element6.keys) {
                  element6.keys.forEach((element2,index2)=>{
                    if (element6.studentAnswer.indexOf(element2) == -1) {
                      istrue = false
                    }
                  })
                 if (istrue) {

                  } else {
                    ZHTistrue = false
                  }
                } else {
                  ZHTistrue = false
                }

              }
            })
            if (ZHTistrue) {
                val.ZT = 2
              } else {
                val.ZT = 3
                this.wrongQuestions(val)
              }
          }
        })
     })
      console.log(this.STdataFL,887);

    },
    wrongQuestions:function(val){
      var aId = localStorage.getItem('student_aId')
      this.$axiosStuResBody('post',this.$axiosURL.K_neoUser+'bash/create/'+aId+'/wrongQuestions',[val.id]).then((res)=>{
      })
    },
    goHome:function(){
      this.$router.push({name:'mockExam_index'})
    },
     initData:function(){
      //所有试题
      var nowData = JSON.parse(localStorage.getItem('mockExam_test'))
      this.STdata = nowData.STdata
      console.log('所有试题',this.STdata);
      //试题数量
      this.progress.ST = this.STdata.length
      //考试倒计时
        var timeC = nowData.time*60000
        this.time = window.setInterval(()=>{
          //console.log(timeC,this.$route.params.time,this.overtime.value);
          timeC -= 1000
          console.log((timeC/1000),(nowData.time*60))
          this.overtime.BFS = parseInt((timeC/1000)/(nowData.time*60)*100)
          // this.overtime.BFS = parseInt(100 - (timeC/1000)/(this.$store.state.KSdata.totalTime*60)*100)
          this.overtime.value = this.$tools.MtoSFM(timeC/1000)
          //停止
          console.log(this.overtime.BFS);
          if (timeC<=0) {
            clearInterval(this.time)
            this.submitPaper()
          }
        },1000)
   },

   //STdataFL初始化
   initSTdataFL:function(){
    var STdata1 = []  //创建临时数据
    this.sub = []

      this.$store.state.dictionarys.question_type.forEach((element,index)=>{
        var a = {dictName:element.dictName,value:element.value,question:[]}
        STdata1.push(a)
     })
     console.log('STdataFL初始化',STdata1);
      for (var i = 0; i < this.STdata.length; i++) {
        if(this.STdata[i].eqBodyImageNameList){
          this.STdata[i].eqBodyImageNameList1 = this.STdata[i].eqBodyImageNameList

        }
        if(this.STdata[i].eqOptionImageNameList){
          this.STdata[i].eqOptionImageNameList1 = this.STdata[i].eqOptionImageNameList

        }
      }
     //添加试题到STdataFL
     this.STdata.forEach((element,index)=>{

      //普通试题初始化
      var ST = {ZT:0,id:element.id,singleScore:element.singleScore,studentAnswer:'',questionBody:element.questionBody,questionOption:element.questionOption,questionType:element.questionType,questionAnswer:element.questionAnswer,keys:element.keys,questionAnalyze:element.questionAnalyze,questionAccessories:element.questionAccessories,
      eqBodyImageNameList1:element.eqBodyImageNameList1?element.eqBodyImageNameList1:[],
      eqOptionImageNameList1:element.eqOptionImageNameList1?element.eqOptionImageNameList1:[]}

      //多选题试题初始化
      var DXTST = {ZT:0,id:element.id,singleScore:element.singleScore,studentAnswer:'',DXTAnswer:[],questionBody:element.questionBody,questionOption:element.questionOption,questionType:element.questionType,questionAnswer:element.questionAnswer,keys:element.keys,questionAnalyze:element.questionAnalyze,questionAccessories:element.questionAccessories,
      eqBodyImageNameList1:element.eqBodyImageNameList1?element.eqBodyImageNameList1:[],
      eqOptionImageNameList1:element.eqOptionImageNameList1?element.eqOptionImageNameList1:[]}

      //填空题试题初始化
      var TKTST = {ZT:0,id:element.id,singleScore:element.singleScore,studentAnswer:'',TKTAnswer:[{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''}],questionBody:element.questionBody,questionOption:element.questionOption,questionType:element.questionType,questionAnswer:element.questionAnswer,keys:element.keys,questionAnalyze:element.questionAnalyze,questionAccessories:element.questionAccessories,eqBodyImageNameList1:element.eqBodyImageNameList1?element.eqBodyImageNameList1:[]}

        var a = STdata1.find((item)=>(item.value==element.questionType))
        if (a.dictName == '多选题') {
          a.question.push(DXTST)
        }else if (a.dictName == '填空题') {
          a.question.push(TKTST)
        }else if (a.dictName == '综合题') {

          for (var i = 0; i < element.examinationSubquestions.length; i++) {
            if(element.examinationSubquestions[i].eqBodyImageNameList){
              element.examinationSubquestions[i].eqBodyImageNameList1 = element.examinationSubquestions[i].eqBodyImageNameList
            }
            if(element.examinationSubquestions[i].eqOptionImageNameList){
              element.examinationSubquestions[i].eqOptionImageNameList1 = element.examinationSubquestions[i].eqOptionImageNameList
            }
          };
          element.examinationSubquestions.forEach((ele,index)=>{
            ele.eqBodyImageNameList1 = ele.eqBodyImageNameList1?ele.eqBodyImageNameList1:[]
            ele.eqOptionImageNameList1 = ele.eqOptionImageNameList1?ele.eqOptionImageNameList1:[]
            if (ele.questionType == 'MULTIPLE_CHOICE') {
              ele['DXTAnswer'] = []
            }else if (ele.questionType == 'GAP_FILLING') {
              ele['TKTAnswer'] = [{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''}]
            } 
          })  

        //综合题试题初始化(经上一步处理)
        var ZHTST = {ZT:0,id:element.id,singleScore:element.singleScore,studentAnswer:'',questionBody:element.questionBody,questionOption:element.questionOption,questionType:element.questionType,questionAnswer:element.questionAnswer,keys:element.keys,questionAnalyze:element.questionAnalyze,examinationSubquestions:element.examinationSubquestions,questionAccessories:element.questionAccessories,eqBodyImageNameList1:element.eqBodyImageNameList1?element.eqBodyImageNameList1:[],
      eqOptionImageNameList1:element.eqOptionImageNameList1?element.eqOptionImageNameList1:[]}

          a.question.push(ZHTST)
        }else{
          a.question.push(ST)
        }

        
     })
     this.STdataFL=JSON.parse(JSON.stringify(STdata1))
     console.log(this.STdataFL,8989898)
   },

  },
  created:function(){
    this.$store.state.dictionarys = JSON.parse(localStorage.getItem('dictionarys'))
  },
  mounted:function(){
    var that = this
    $('.SJleft').on("click",".tImg img",function(){
        if($(this).attr("name") == '1'){
          return
        }
        var arr = $(this).attr("src").split('/')
        var pos = arr[arr.length-1].indexOf('__')
        $(this).attr("src", that.$imgUrl + arr[arr.length-1].substr(pos + 2))
        $(this).attr("name", '1')
    })
    $('.SJleft').on("click",".aImg img",function(){
        if($(this).attr("name") == '1'){
          return
        }
        var arr = $(this).attr("src").split('/')
        var pos = arr[arr.length-1].indexOf('__')
        $(this).attr("src", that.$imgUrl + arr[arr.length-1].substr(pos + 2))
        $(this).attr("name", '1')
    })
    this.initData()
    this.initSTdataFL()
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
