<template>
	<el-form :model="judgeForm" ref="judgeForm" :rules="rules" class="STleft">
			<el-row>
				<el-col :span="20" :offset="1">
					<el-form-item label="题干：">
              <el-input type="textarea" :autosize="autosize" v-model="judgeForm.questionBody"></el-input>

            <div v-if="imgshow">
              <viewer :images="judgeForm.eqBodyImageNameList1" class="tImg" v-if="judgeForm.eqBodyImageNameList1">
                <div v-for="(src,index) in judgeForm.eqBodyImageNameList1" :key="src">
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
                      <i class="el-icon-edit" @click='editImg(judgeForm.id,index,true)'></i>
                    </el-upload>
                    <div><i class="el-icon-delete" :data-id="judgeForm.id" @click="delImg(judgeForm.id,index)"></i></div>
                  </div>
                </div>
                <!-- <div class="edit" v-for="(src,index) in judgeForm.eqBodyImageNameList1" :key="index">
                  <el-upload
                    :action="uploadUrl"
                    :on-success="uploadSuccess"
                    :show-file-list="false"
                    :beforeUpload="beforeAvatarUpload1"
                    accept=".jpg,.jpeg,.png,.bmp,.gif,.svg"
                    >
                    <i class="el-icon-edit" @click='editImg(judgeForm.id,index,true)'></i>
                  </el-upload>
                  <div><i class="el-icon-delete" :data-id="judgeForm.id" @click="delImg(judgeForm.id,index)"></i></div>
                </div> -->
              </viewer>
            </div>
            <div @click="addImg(judgeForm.id)" v-if="newList.questionBody != ''">
              <el-upload
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
          </el-form-item>
				</el-col>
		 	</el-row>

      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item label="添加答案：" prop="questionAnswer">
           <br />
            <el-radio-group v-model="judgeForm.questionAnswer" @change='changexx'>
              <el-radio-button label="对" value="对">对</el-radio-button>
              <el-radio-button label="错" value="错">错</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="judgeForm.questionAnswer" @change='changexx'>
              <el-radio-button label="是" value="是">是</el-radio-button>
              <el-radio-button label="否" value="否">否</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="judgeForm.questionAnswer" @change='changexx'>
              <el-radio-button label="yes" value="yes">yes</el-radio-button>
              <el-radio-button label="no" value="no">no</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="judgeForm.questionAnswer" @change='changexx'>
              <el-radio-button label="√" value="√">√</el-radio-button>
              <el-radio-button label="×" value="×">×</el-radio-button>
            </el-radio-group>                        
         </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col :span="20" :offset="1">
					<el-form-item label="解析：">
						<el-input type="textarea" v-model="judgeForm.questionAnalyze"></el-input>
					</el-form-item>
				</el-col>
		 	</el-row>
 	  		<slot name="handleQuestionData"></slot>
        <slot name="editQuestionData"></slot>
    </el-form>
</template>

<script>
  export default {
    props: [ 'judgeForm', 'fileListArr', 'propressNum'],
    created () {
      this.newList = JSON.parse(JSON.stringify(this.judgeForm))
      this.$bus.$on('stUploadFile',(id)=>{
            this.optionSubmit(id)
      })
    },
    mounted () {
      var that = this
      $('.STleft').on("click",".tImg img",function(){
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
      $('.STleft').on("click",".aImg img",function(){
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
        autosize: {minRows: 2},
        rules: {
          questionBody: [
            { required: true, message: '请填写题干', trigger: 'blur' }
          ],
          questionAnswer: [
            { required: true, message: '请选择答案', trigger: 'change' }
          ]
        },
        fileList:[],
        uploadUrl: '',
        index: 0,
        bodyOroption: null,
        ashow: false,
        imgshow: true,
        src: '',
        addBody: false,
        newList: null,
        bodyFileList: []
      }
    },
    methods: {
        optionSubmit(id){
          let formData = new FormData() // 创建form对象
          if(this.bodyFileList != []){
            this.bodyFileList.forEach(ele => {
              formData.append('bodyFile', ele.raw, ele.name) // 通过append向form对象添加数据
            });
          }
          if(this.bodyFileList.length > 0){
            this.$uploadImg('post', this.$axiosURL.fm_fileManipulate + '/add/' + id + '/images', formData).then((res) => {
              console.log(res)
            })
          }
        },
        handleRemove(file,fileList) {
          this.bodyFileList = fileList
        },
        createChange(file,fileList) {
          this.bodyFileList = fileList
          console.log(this.bodyFileList)
        },
        handleExceed (files, fileList) {
//        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
        this.$message({
          showClose: true,
          message: '警告,最多上传四个文件',
          type: 'warning'
        })
      },
      uploadSuccess (val) {
        console.log(this.addBody)
        if(this.addBody == true) {
          this.imgshow = false
          this.judgeForm.eqBodyImageNameList1.push(val)
          this.imgshow = true
          this.addBody = false
          console.log(this.judgeForm.eqBodyImageNameList1,this.addBody)
        }else {
          if(this.bodyOroption == true) {
            this.imgshow = false
            this.judgeForm.eqBodyImageNameList1.splice(this.index,1,val)
            this.imgshow = true
          } else {
            $('.aImg img').eq(this.index).attr('src',this.$imgThumbUrl + val)
          }
        }
         this.src = val
      },
      beforeAvatarUpload1(file){
        console.log(file)
      },
    	changexx(val){
          if(val == '对' || val == '错') {
              this.judgeForm.questionOption = ['A.对','B.错']
          }
          if(val == '是' || val == '否') {
              this.judgeForm.questionOption = ['A.是','B.否']
          }
          if(val == 'yes' || val == 'no') {
              this.judgeForm.questionOption = ['A.yes','B.no']
          }
          if(val == '√' || val == '×') {
              this.judgeForm.questionOption = ['A.√','B.×']
          }
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
          this.judgeForm.eqBodyImageNameList1.splice(index,1)
          this.imgshow = true
        })
      }
    },
    beforeDestroy() {
      this.$bus.$off('stUploadFile')
    },
}
</script>