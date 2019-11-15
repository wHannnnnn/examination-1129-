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
      <el-col :span='4'>
        已完成{{progress.DQST}}题/共{{progress.ST}}题
      </el-col>
      <el-col :span='1'>
        <el-progress type="circle" :percentage="overtime.BFS" :width="42"></el-progress>
      </el-col>
      <el-col :span='5' style="font-size: 16px">
        <p>剩余时长:{{overtime.value}}</p>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="height: calc(100vh - 170px);overflow: hidden;width: 100%;">
      <el-col :span='18' style="height:100%;overflow:auto">
        <div class='SJleft'>
        <!-- 答题样式 -->
        <div style='text-align: left;'  v-for="item in STdataFL" v-if="item.question.length!=0">
          <b class="SJTitle">{{item.dictName}}</b>
          <!-- 单选题 -->
          <div v-if="item.dictName == '单选题'">
            <el-row :key='index' v-for="(question,index) in item.question" class="STRow" :id="'top0_'+index">
              <el-col :span="1">
                <div class="STnum">{{index+1}}</div>
              </el-col>
              <el-col :span="23">
                {{question.questionBody}} ({{question.singleScore}}分)

                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer>
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
                <div class='XZTbody'  v-for='(val,index) in analysisDXT(question.questionOption)'> 
                  <el-radio v-model="question.studentAnswer" :label="val">{{val}}</el-radio>
                  <!-- <img :src="question.eqOptionImageNameList1[index]" v-if="question.eqOptionImageNameList1.length>0"> -->
                  <viewer class="aImg" v-if="question.eqOptionImageNameList1.length>0">
                    <img
                        :src="getImgUrl(question.eqOptionImageNameList1[index])" 
                        :key="index"
                      >
                  </viewer>
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
                {{question.questionBody}} ({{question.singleScore}}分)

                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer>
            
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
                <el-checkbox-group v-model="question.DXTAnswer">
                  <div class='XZTbody'  v-for='(val1,index) in analysisDXT(question.questionOption)'> 
                    <el-checkbox :label="val1"></el-checkbox>
                    <!-- <img :src="question.eqOptionImageNameList1[index]" v-if="question.eqOptionImageNameList1.length>0"> -->
                    <viewer class="aImg" v-if="question.eqOptionImageNameList1.length>0">
                       <img
                        :src="getImgUrl(question.eqOptionImageNameList1[index])" 
                        :key="index"
                      >
                    </viewer>
                  </div>
                </el-checkbox-group>
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
                {{question.questionBody}} ({{question.singleScore}}分)

                 <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer>
          
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
                {{question.questionBody}} ({{question.singleScore}}分)

                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer>
                          
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
                <div class='XZTbody'  v-for='(val,index) in analysisDXT(question.questionOption)'> 
                  <el-radio v-model="question.studentAnswer" :label="val">{{val}}</el-radio>
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
{{question.questionBody}} ({{question.singleScore}}分)

                 <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer>
          
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
                  :autosize="{minRows: 3}"
                  placeholder="请输入答案"
                  v-model="question.studentAnswer">
                </el-input>
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
                {{question.questionBody}} ({{question.singleScore}}分)

                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer>
          
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
                {{question.questionBody}} ({{question.singleScore}}分)
                <viewer :images="question.eqBodyImageNameList1" class="tImg" v-if="question.eqBodyImageNameList1.length>0"> 
                  <img
                    v-for="(src,index) in question.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </viewer> 

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

                <!-- 循环examinationSubquestions -->
                <div style='text-align: left;' v-for="(ZHT,index) in question.examinationSubquestions" v-if="question.examinationSubquestions.length!=0">

                  <!-- 综合题——单选题 -->
                  <div v-if="ZHT.questionType == 'SINGLE_CHOICE'">
                    <el-row :key='index'  class="STRow">
                      <el-col :span="1">
                        <div class="STnum">●</div>
                      </el-col>
                      <el-col :span="23">
                        {{ZHT.questionBody}} ({{ZHT.singleScore}}分)
                        <viewer :images="ZHT.eqBodyImageNameList1" class="tImg" v-if="ZHT.eqBodyImageNameList1"> 
                          <img
                            v-for="(src,index) in ZHT.eqBodyImageNameList1"
                            :src="getImgUrl(src)"
                            @click="clickImg(src,index,0)"
                            :key="index"
                          >
                        </viewer>
                        <div class='XZTbody'  v-for='(val,index) in analysisDXT(ZHT.questionOption)'>
                          <el-radio v-model="ZHT.studentAnswer" :label="val">{{val}}</el-radio>
                          <viewer class="aImg" v-if="ZHT.eqOptionImageNameList1.length>0">
                          <img
                              :src="getImgUrl(ZHT.eqOptionImageNameList1[index])" 
                              :key="index"
                            >
                          </viewer>
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
                        {{ZHT.questionBody}} ({{ZHT.singleScore}}分)
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
                        {{ZHT.questionBody}} ({{ZHT.singleScore}}分)
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
                        {{ZHT.questionBody}} ({{ZHT.singleScore}}分)
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
                        {{ZHT.questionBody}} ({{ZHT.singleScore}}分)
                          <viewer :images="ZHT.eqBodyImageNameList1" class="tImg" v-if="ZHT.eqBodyImageNameList1">
                              <img
                                v-for="(src,index) in ZHT.eqBodyImageNameList1"
                                :src="getImgUrl(src)"
                                @click="clickImg(src,index,0)"
                                :key="index"
                              >
                          </viewer>
                        <br/>
                        <el-input
                          type="textarea"
                          :autosize="{minRows: 3}"
                          placeholder="请输入答案"
                          v-model="ZHT.studentAnswer">
                        </el-input>
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
                        {{ZHT.questionBody}} ({{ZHT.singleScore}}分)
                          <viewer :images="ZHT.eqBodyImageNameList1" class="tImg" v-if="ZHT.eqBodyImageNameList1">
                              <img
                                v-for="(src,index) in ZHT.eqBodyImageNameList1"
                                :src="getImgUrl(src)"
                                @click="clickImg(src,index,0)"
                                :key="index"
                              >
                          </viewer>
                        <br/>
                        <el-input
                          type="textarea"
                          :autosize="{minRows: 4}"
                          placeholder="请输入答案"
                          v-model="ZHT.studentAnswer">
                        </el-input>
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
                  <el-tag @click.native='returnTop(queIndex,index)' :type="question.ZT==1?'warning':''">{{index+1}}</el-tag>
                </el-col>
              </el-row>
            </div>
          <div class="SJright_bottom">
             <el-button type="primary"  @click='submitSJ'>交卷</el-button>
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
      dialogVisibleFJ:false,
      nowFJ:null,
    }
  },
  watch:{
    //深度监听
    STdataFL:{
      handler(val){
        console.log('pppp');
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
        this.progress.BFS = parseInt(a/JSON.parse(sessionStorage.getItem('KSdata')).papers[0].paper.examinationQuestions.length*100)

        //localstorage存储
        if (this.STdataFL) {
          localStorage.setItem(sessionStorage.getItem('ticket'), JSON.stringify(this.STdataFL))
        }
        
      },
      deep:true,
      immediate:false
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
      console.log(data,998)
    },
    //获取综合题小题分值
    ZHTscore:function(id){
      for (var i = this.sub.length - 1; i >= 0; i--) {
        if (this.sub[i].split(':')[0] == id) {
          return this.sub[i].split(':')[1]
        }
      }
      return 0
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
      
      var params = {
        ticket:sessionStorage.getItem('ticket'),
        realName:sessionStorage.getItem('realName'),
        examId:JSON.parse(sessionStorage.getItem('KSdata')).id,
        paperId: JSON.parse(sessionStorage.getItem('KSdata')).papers[0].paper.id,
        answers: []
     }
     this.STdataFL.forEach((element,index)=>{
        element.question.forEach((val,index)=>{
          params.answers.push(val)
        })
     })
     console.log(params);
     this.$axiosStuResBody1('post',this.$axiosURL.e_examinationPaper+ 'submitPaper',params).then((res)=>{
      if (res) {
        localStorage.removeItem(sessionStorage.getItem('ticket'))
        this.$message.success('交卷成功！')
        clearInterval(this.time)
        this.$router.push({path:'/test_login'})
      }
     })
    },
     initData:function(){
      //所有试题
      this.STdata = JSON.parse(sessionStorage.getItem('KSdata')).papers[0].paper
      console.log('所有试题',this.STdata);
      //试题数量
      this.progress.ST = this.STdata.examinationQuestions.length
      //考试倒计时
      this.$axiosStuRes('get',this.$axiosURL.e_examination+ 'serverTime','').then((res)=>{
        var endTime = new Date(JSON.parse(sessionStorage.getItem('KSdata')).endTime).getTime()
        var serverTime = res
        if (endTime && serverTime) {
          var isOver = serverTime-endTime<= 0 ? false:true
          if (isOver) {
            this.$message({
              showClose: true,
              message: '考试已结束!',
              type: 'error',
              duration:0
            });
            this.$router.push({path:'/test_login'})
            return
          }else{
            var timeC = endTime-serverTime
            this.time = window.setInterval(()=>{
              console.log(timeC);
              timeC -= 1000
              this.overtime.BFS = parseInt(100 - (timeC/1000)/(JSON.parse(sessionStorage.getItem('KSdata')).totalTime*60)*100)
              this.overtime.value = this.$tools.MtoSFM(timeC/1000)
              //停止
              if (timeC<=0) {
                clearInterval(this.time)
                this.submitPaper()
              }
            },1000)
            var timeC = endTime-serverTime
          }
        }else{
          this.$message({
            showClose: true,
            message: '请重新登录考试!',
            type: 'error',
            duration:0
          });
        }  
     })     
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

     //循环出综合题小题分值集合
     this.STdata.examinationQuestions.forEach((element,index)=>{
        if (element.sub) {
          this.sub = this.sub.concat(element.sub)
        }
     })


     //添加试题到STdataFL
     this.STdata.examinationQuestions.forEach((element,index)=>{

      if(element.question.eqBodyImageNameList){
          element.question.eqBodyImageNameList1 = element.question.eqBodyImageNameList
        //element.question.eqBodyImage1 = this.$imgThumbUrl + element.question.eqBodyImage
      }
      if(element.question.eqOptionImageNameList){
          element.question.eqOptionImageNameList1 = element.question.eqOptionImageNameList
      }


      //普通试题初始化
      var ST = {ZT:0,id:element.question.id,singleScore:element.singleScore,studentAnswer:'',questionBody:element.question.questionBody,questionOption:element.question.questionOption,questionType:element.question.questionType,
      questionAccessories:element.question.questionAccessories,      
      eqBodyImageNameList1:element.question.eqBodyImageNameList1?element.question.eqBodyImageNameList1:[],
      eqOptionImageNameList1:element.question.eqOptionImageNameList1?element.question.eqOptionImageNameList1:[]}

      //多选题试题初始化
      var DXTST = {ZT:0,id:element.question.id,singleScore:element.singleScore,studentAnswer:'',DXTAnswer:[],questionBody:element.question.questionBody,questionOption:element.question.questionOption,questionType:element.question.questionType,
      questionAccessories:element.question.questionAccessories, 
      eqBodyImageNameList1:element.question.eqBodyImageNameList1?element.question.eqBodyImageNameList1:[],
      eqOptionImageNameList1:element.question.eqOptionImageNameList1?element.question.eqOptionImageNameList1:[]}

      //填空题试题初始化
      var TKTST = {ZT:0,id:element.question.id,singleScore:element.singleScore,studentAnswer:'',TKTAnswer:[{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''}],questionBody:element.question.questionBody,
      questionAccessories:element.question.questionAccessories, 
      questionOption:element.question.questionOption,questionType:element.question.questionType,
      eqBodyImageNameList1:element.question.eqBodyImageNameList1?element.question.eqBodyImageNameList1:[]}

        var a = STdata1.find((item)=>(item.value==element.question.questionType))
        if (a.dictName == '多选题') {
          a.question.push(DXTST)
        }else if (a.dictName == '填空题') {
          a.question.push(TKTST)
        }else if (a.dictName == '综合题') {
          for (var i = 0; i < element.question.examinationSubquestions.length; i++) {
            if(element.question.examinationSubquestions[i].eqBodyImageNameList){
              element.question.examinationSubquestions[i].eqBodyImageNameList1 = element.question.examinationSubquestions[i].eqBodyImageNameList
            }
            if(element.question.examinationSubquestions[i].eqOptionImageNameList){
              element.question.examinationSubquestions[i].eqOptionImageNameList1 = element.question.examinationSubquestions[i].eqOptionImageNameList
            }
          }
          element.question.examinationSubquestions.forEach((ele,index)=>{
            //添加小题分值
            ele.singleScore = this.ZHTscore(ele.id)
            if (ele.questionType == 'MULTIPLE_CHOICE') {
              ele['DXTAnswer'] = []
            }else if (ele.questionType == 'GAP_FILLING') {
              ele['TKTAnswer'] = [{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''},{value:''}]
            } 
          })  

        //综合题试题初始化(经上一步处理)
        var ZHTST = {ZT:0,id:element.question.id,singleScore:element.singleScore,studentAnswer:'',questionBody:element.question.questionBody,questionOption:element.question.questionOption,questionType:element.question.questionType,examinationSubquestions:element.question.examinationSubquestions,eqBodyImageNameList1:element.question.eqBodyImageNameList1?element.question.eqBodyImageNameList1:[],
        questionAccessories:element.question.questionAccessories, 
      eqOptionImageNameList1:element.question.eqOptionImageNameList1?element.question.eqOptionImageNameList1:[]}

          a.question.push(ZHTST)
        }else{
          a.question.push(ST)
        }

        
     })
     this.STdataFL=JSON.parse(JSON.stringify(STdata1))
     console.log(this.STdataFL,999999)
   },

  },
  created:function(){
    this.$store.state.dictionarys = JSON.parse(sessionStorage.getItem('dictionarys'))
  },
  mounted:function(){
    window.onbeforeunload=function(){return '确定要离开吗？'}
    this.initData()

    //判断localStorage中是否有值
    if (localStorage.getItem(sessionStorage.getItem('ticket'))) {
      
      this.$confirm('检测到试题答案缓存,是否恢复?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.STdataFL = JSON.parse(localStorage.getItem(sessionStorage.getItem('ticket')))
            this.$message.success('本地缓存已恢复！')
        }).catch(() => {
            this.initSTdataFL()
        });
    }else {
      this.initSTdataFL()
    }

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
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
