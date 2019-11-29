<template>
	<el-form :model="radioChoiceForm" ref="radioChoiceForm" class="STleft">
			<el-row>
				<el-col :span="20" :offset="1">
					<el-form-item label="题干部分：">
						<el-input type="textarea" v-model="radioChoiceForm.questionBody"></el-input>

            <div v-if="imgshow">
              <viewer :images="radioChoiceForm.eqBodyImageNameList1" style="width: 100%" class="tImg" v-if="radioChoiceForm.eqBodyImageNameList1">
                <div v-for="(src,index) in radioChoiceForm.eqBodyImageNameList1" :key="src">
                  <img
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                  <div class="imgList">
                    <el-upload
                      :action="uploadUrl"
                      :on-success="uploadSuccess"
                      :show-file-list="false"
                      :beforeUpload="beforeAvatarUpload1"
                      accept=".jpg,.jpeg,.png,.bmp,.gif,.svg"
                      >
                      <i class="el-icon-edit" @click='editImg(radioChoiceForm.id,index,true)'></i>
                    </el-upload>
                    <div><i class="el-icon-delete" :data-id="radioChoiceForm.id" @click="delImg(radioChoiceForm.id,index)"></i></div>
                  </div>
                </div>
              </viewer>
            </div>
            <div @click="addImg(radioChoiceForm.id)" v-if="newList.questionBody != ''">
              <el-upload
                class="add"
                :action="uploadUrl"
                list-type="picture-card"
                :on-success="uploadSuccess"
                :show-file-list="false"
                >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <div class="createImg" v-if="newList.questionBody == ''">
                <el-upload
                  action="#"
                  name="bodyFile"
                  list-type="picture-card"
                  :auto-upload="false"
                  :on-change="createChange"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  ref="upload"
                  >
                    <i slot="default" class="el-icon-plus"></i>
                    <!-- <el-button type="success" @click="uploadFile" style="display: none"></el-button> -->
                </el-upload>
            </div>
              <!-- <input type="file" name="bodyFile" @change="tirggerFile($event)"/> -->
					</el-form-item>
				</el-col>
		 	</el-row>
			<el-row>
			<el-col :span="20" :offset="1">
				<el-form-item label="选项">
						<el-radio-group v-model="choices">
							<el-row>
							<el-col :span="16" >
								<el-radio v-for="(item, index) in radioChoiceForm.questionOption" :label="item.key" :key="index" @change="changeXX">
									<span class="xuanx">{{item.key}}  </span>
									<el-input v-model="item.value">
									</el-input>									
                  <viewer class="aImg" v-if="item.img">
                    <img
                        :src="getImgUrl(item.img)" 
                        :key="index"
                      >
                  </viewer>
                  <div class="aedit" v-if="newList.questionBody != ''">
                      <el-upload
                          :action="uploadUrl"
                          :on-success="uploadSuccess"
                          :show-file-list="false"
                          :beforeUpload="beforeAvatarUpload1"
                          accept=".jpg,.jpeg,.png,.bmp,.gif,.svg"
                          >
                          <i class="el-icon-edit" @click='editImg(radioChoiceForm.id,index,false)'></i>
                        </el-upload>
                  </div>
                  <div class="aedit" v-if="newList.questionBody == ''">
                    <input type="file" name="optionFile" @change="tirggerFile($event,index)" />
                      <i class="el-icon-plus" v-if="!optionFileList[index].name"></i>
                      <div v-if="optionFileList[index].name">
                        <span>{{optionFileList[index].name?optionFileList[index].name : ''}}</span>
                        <i class="el-icon-close" @click.stop="delOptionImg(index)"></i>
                      </div>
                  </div>
								</el-radio>
							</el-col>
							</el-row>
						</el-radio-group>
				</el-form-item>
				</el-col>
		 	</el-row>
			
			<el-row>
				<el-col :span="20" :offset="1">
					<el-form-item label="解析：">
						<el-input type="textarea" v-model="radioChoiceForm.questionAnalyze"></el-input>
					</el-form-item>
				</el-col>
		 	</el-row>
 	  		<slot name="handleQuestionData"></slot>
        	<slot name="editQuestionData"></slot>
    </el-form>
</template>

<script>
  import Vue from 'vue'
  export default {
    props: [ 'radioChoiceForm', 'fileListArr', 'propressNum'],
    created () {
      this.newList = JSON.parse(JSON.stringify(this.radioChoiceForm))
      this.$bus.$on('stUploadFile',(id)=>{
            this.optionSubmit(id)
      })
    },
    mounted () {
    	this.choices = this.radioChoiceForm.questionAnswer
      var that = this
      $('.SJleft').on("click",".tImg img",function(){
          if($(this).attr("name") == '1'){
            return
          }
          this.imgshow = false
          console.log(this.src)
          var arr = this.src.split('/')
          var pos = arr[arr.length-1].indexOf('__')
          console.log(that.$imgUrl + arr[arr.length-1].substr(pos + 2))
          $(this).attr("src", that.$imgUrl + arr[arr.length-1].substr(pos + 2))
          $(this).attr("name", '1')
          this.imgshow = true
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
    watch: {

    },
    data () {
      return {
        choices: '',
         fileList:[],
         optionFileList:[{},{},{},{}],
         bodyFileList:[],
         allList:[],
        uploadUrl: '',
        index: 0,
        bodyOroption: null,
        src: '',
        addBody: false,
        imgshow: true,
        ashow: false,
        newList: null,
      }
    },
    watch: {
      fileListArr: function (val) {
        if (val.length === 0) {
          this.$refs.upload.clearFiles()
        }
      }
    },
    methods: {
      tirggerFile(event,index){
          let self = this;
          let file = event.target.files[0]
          Vue.set(this.optionFileList,index,file)
          this.radioChoiceForm.optionFileList = this.optionFileList
          console.log(this.radioChoiceForm.optionFileList)
      },
      optionSubmit(id){
        let formData = new FormData() // 创建form对象
        if(this.optionFileList[0].name){
          this.optionFileList.forEach(ele => {
            formData.append('optionFile', ele) // 通过append向form对象添加数据
          });
        }
        if(this.bodyFileList != []){
          this.bodyFileList.forEach(ele => {
            formData.append('bodyFile', ele.raw) // 通过append向form对象添加数据
          });
        }
        if(this.bodyFileList.length > 0 || this.optionFileList[0].name){
          this.$uploadImg('post', this.$axiosURL.fm_fileManipulate + '/add/' + id + '/images', formData).then((res) => {
            console.log(res)
          })
        }
      },
  		changeXX(){
  			console.log(this.choices)
  			this.radioChoiceForm.questionAnswer = this.choices
  		},
      uploadSuccess (val) {
        if(this.addBody == true) {
          this.imgshow = false
          this.radioChoiceForm.eqBodyImageNameList1.push(val)
          this.imgshow = true
          this.addBody = false
          console.log(this.radioChoiceForm.eqBodyImageNameList1,this.addBody)
        }else {
          if(this.bodyOroption == true) {
            this.imgshow = false
            this.radioChoiceForm.eqBodyImageNameList1.splice(this.index,1,val)
            this.imgshow = true
          } else {
            $('.aImg img').eq(this.index).attr('src',this.$imgThumbUrl + val)
          }
        }
         this.src = val
      },
      handleRemove(file,fileList) {
        this.bodyFileList = fileList
      },
      createChange(file,fileList) {
        this.bodyFileList = fileList
        console.log(this.bodyFileList)
      },
      createOptionChange(file,fileList){
        console.log(file)
        // this.optionFileList = fileList
      },
      handleOptionRemove(file,fileList){
        // this.optionFileList = fileList
      },
      beforeAvatarUpload1(file){
        console.log(file)
      },
      getImgUrl:function(url){
        return this.$imgThumbUrl + url
      },
      editImg(id,index,i){
        this.uploadUrl = this.$axiosURL.fm_fileManipulate + '/modify/' + id + '/image/' + i  + '/' + index
        if(i == true) {
            this.bodyOroption = true
        } else {
            this.bodyOroption = false
        }
        this.index = index
      },
      addImg(id){
        this.uploadUrl = this.$axiosURL.fm_fileManipulate + '/add/' + id + '/image/' + true
        this.addBody = true
      },
      delImg(id,index){
        this.$axiosResBody1('delete',this.$axiosURL.fm_fileManipulate + '/delete/' + id + '/image/' + true  + '/' + index).then((res)=>{
          this.imgshow = false
          this.radioChoiceForm.eqBodyImageNameList1.splice(index,1)
          this.imgshow = true
        })
      },
      delOptionImg(index){
        var obj = {}
        Vue.set(this.optionFileList,index,obj)
      },
    }, 
    beforeDestroy() {
      this.$bus.$off('stUploadFile')
    },

}
</script>
<style scoped>
.el-radio+.el-radio,.el-radio+.el-radio {
	margin-left: 0;
}
.el-radio {
  margin-bottom: 6px;
  width: 100%
}
.el-row {
	margin-bottom: -4px;
}
</style>
