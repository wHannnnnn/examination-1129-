<template>
	<el-form :model="gapFillingForm" ref="gapFillingForm" class="STleft">
			<el-row>
				<el-col :span="20" :offset="1">
					<el-form-item label="题干：">
            <el-input type="textarea" :autosize="autosize" v-model="text" ref="topicInput"></el-input>
            <el-button type="primary" style="color: #fff" @click="addDomain" plain size="mini">添加填空</el-button>
            <div v-if="imgshow">
              <viewer :images="gapFillingForm.eqBodyImageNameList1" class="tImg" v-if="gapFillingForm.eqBodyImageNameList1">
                <div v-for="(src,index) in gapFillingForm.eqBodyImageNameList1" :key="src">
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
                      <i class="el-icon-edit" @click='editImg(gapFillingForm.id,index,true)'></i>
                    </el-upload>
                    <div><i class="el-icon-delete" :data-id="gapFillingForm.id" @click="delImg(gapFillingForm.id,index)"></i></div>
                  </div>
                </div>
              </viewer>
            </div>
            <div @click="addImg(gapFillingForm.id)" v-if="newList.questionBody != ''">
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
					</el-form-item>
				</el-col>
		 	</el-row>

      <el-row>
        <el-col :span="20" :offset="1">
            <el-form-item label="答案：" prop="questionAnswer">
              <br>
              <el-form-item
                  v-for="(domain, index) in gapFillingForm.questionAnswer"
                  :label="'填空'+ (index + 1) + ':'"
                  label-width="70px"
                  :prop="'questionAnswer.' + index + '.value'"
                  :rules="{
                    required: true, message: '填空内容不能为空', trigger: 'blur'
                  }"
                >
              <el-input v-model="domain.value">
                <el-button slot="append" icon="el-icon-close" @click.prevent="removeDomain(domain, index)" maxlength="200"></el-button>
              </el-input>
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>


			<el-row>
				<el-col :span="20" :offset="1">
					<el-form-item label="解析：">
						<el-input type="textarea" v-model="gapFillingForm.questionAnalyze"></el-input>
					</el-form-item>
				</el-col>
		 	</el-row>
 	  		<slot name="handleQuestionData"></slot>
        <slot name="editQuestionData"></slot>

    </el-form>
</template>

<script>
  export default {
    props: [ 'gapFillingForm', 'fileListArr', 'propressNum'],
    created () {
      this.newList = JSON.parse(JSON.stringify(this.gapFillingForm))
      this.$bus.$on('stUploadFile',(id)=>{
            this.optionSubmit(id)
      })
    },
    watch: {
      text: function (val, old) {
        var n = 0
        for (var i = 0; i < val.length; i++) {
          if (this.text[i] === '_') {
            n += 1
          }
        }
//        console.log('length', this.gapFillingForm.questionAnswer.length)
        this.gapFillingForm.questionAnswer.length = n
        this.gapFillingForm.questionBody = this.text
      },
      'gapFillingForm.questionBody': function (val) {
        this.text = val
      }
    },
    data () {
      return {
        text: '',
        selectionStart: 0,
        autosize: {minRows: 2},
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
    mounted(){
      this.text = this.gapFillingForm.questionBody
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
      uploadSuccess (val) {
        console.log(this.addBody)
        if(this.addBody == true) {
          this.imgshow = false
          this.gapFillingForm.eqBodyImageNameList1.push(val)
          this.imgshow = true
          this.addBody = false
          console.log(this.gapFillingForm.eqBodyImageNameList1,this.addBody)
        }else {
          if(this.bodyOroption == true) {
            this.imgshow = false
            this.gapFillingForm.eqBodyImageNameList1.splice(this.index,1,val)
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
      handleExceed (files, fileList) {
//        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
        this.$message({
          showClose: true,
          message: '警告,最多上传四个文件',
          type: 'warning'
        })
      },
      uploadSuccess (val) {
        console.log(val)
      },
      addDomain () {
        let rangeData = {text: '', start: 0, end: 0}
        let topicInput = this.$refs.topicInput.$refs.textarea
        if (topicInput.setSelectionRange) {
          topicInput.focus()
          rangeData.start = topicInput.selectionStart
          rangeData.end = topicInput.selectionEnd
          rangeData.text = (rangeData.start !== rangeData.end) ? topicInput.value.substring(rangeData.start, rangeData.end) : '_'
        }
        this.text = this.text.substring(0, rangeData.start) + rangeData.text + this.text.substring(rangeData.start, this.text.length)
        var a = this.gapFillingForm.questionAnswer.length
        this.gapFillingForm.questionAnswer.push({
          value: ''
        })
        console.log(this.gapFillingForm.questionAnswer)
      },
      //   移除 填空项
      removeDomain (item, indexs) {
        var arr = []
        for (var k = 0; k < this.text.length; k++) {
          if (this.text[k] === '_') {
            arr.push(k)
          }
        }
        this.text = this.text.substring(0, arr[indexs]) + this.text.substring(arr[indexs] + 1, this.text.length)
        if (indexs !== -1) {
          this.gapFillingForm.questionAnswer.splice(indexs, 1)
        }
      },
      addImg(id){
        this.uploadUrl = this.$axiosURL.fm_fileManipulate + '/add/' + id + '/image/' + true
        this.addBody = true
      },
      delImg(id,index){
        this.$axiosResBody1('delete',this.$axiosURL.fm_fileManipulate + '/delete/' + id + '/image/' + true  + '/' + index).then((res)=>{
          this.imgshow = false
          this.gapFillingForm.eqBodyImageNameList1.splice(index,1)
          this.imgshow = true
        })
      }
    },
    beforeDestroy() {
      this.$bus.$off('stUploadFile')
    },

}
</script>
