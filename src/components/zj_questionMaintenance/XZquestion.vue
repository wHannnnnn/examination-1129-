<template>
	<el-form :model="multipleChoiceForm" ref="multipleChoiceForm" class="SJleft">
			<el-row>
				<el-col :span="20" :offset="1">
					<el-form-item label="题干部分：">
						<el-input type="textarea" v-model="multipleChoiceForm.questionBody"></el-input>
            <div v-if="imgshow">
              <viewer :images="multipleChoiceForm.eqBodyImageNameList1" class="tImg" v-if="multipleChoiceForm.eqBodyImageNameList1">
                <div>
                  <img
                    v-for="(src,index) in multipleChoiceForm.eqBodyImageNameList1"
                    :src="getImgUrl(src)"
                    :key="index"
                  >
                </div>
                <div class="edit" v-for="(src,index) in multipleChoiceForm.eqBodyImageNameList1" :key="index">
                  <el-upload
                    :action="uploadUrl"
                    :on-success="uploadSuccess"
                    :show-file-list="false"
                    :beforeUpload="beforeAvatarUpload1"
                    accept=".jpg,.jpeg,.png,.bmp,.gif,.svg"
                    >
                    <i class="el-icon-edit" @click='editImg(multipleChoiceForm.id,index,true)'></i>
                  </el-upload>
                  <div><i class="el-icon-delete" :data-id="multipleChoiceForm.id" @click="delImg(multipleChoiceForm.id,true,index)"></i></div>
                </div>
              </viewer>
            </div>
            <div @click="addImg(multipleChoiceForm.id,true,index)" v-if="newList.questionBody != ''">
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
				<el-form-item label="选项">
						<el-checkbox-group v-model="choices">
							<el-row>
							<el-col :span="8" >
								<el-checkbox v-for="(item, index) in multipleChoiceForm.questionOption" :label="item.key" :key="index" @change="changeXX">
									<span class="xuanx">{{item.key}}  </span>
									<el-input v-model="item.value">
                    <el-button slot="append" icon="el-icon-close" @click.prevent="removeDomain(item, index)" v-if="ashow"></el-button>
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
                          <i v-if="item.img" class="el-icon-edit" @click='editImg(multipleChoiceForm.id,index,false)'></i>
                          <i v-if="!item.img" class="el-icon-plus" @click='addImg(multipleChoiceForm.id,false,index)'></i>
                        </el-upload>
                  </div>
                  <div class="aedit" v-if="newList.questionBody == ''">
                    <input type="file" name="optionFile" @change="tirggerFile($event,index)" />
                  </div>
								</el-checkbox>
							</el-col>
							</el-row>
						</el-checkbox-group>
				</el-form-item>
				</el-col>
		 	</el-row>
			<el-row>
				<el-col :span="20" :offset="1">
                  	<el-button type="primary" @click="addDomain" size="mini">添加选项</el-button>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="20" :offset="1">
					<el-form-item label="解析：">
						<el-input type="textarea" v-model="multipleChoiceForm.questionAnalyze"></el-input>
					</el-form-item>
				</el-col>
		 	</el-row>
 	  		<slot name="handleQuestionData"></slot>
        <slot name="editQuestionData"></slot>
    </el-form>
</template>

<script>
  export default {
    props: [ 'multipleChoiceForm','isZH','fileListArr', 'propressNum'],
    created () {
      this.newList = JSON.parse(JSON.stringify(this.multipleChoiceForm))
      this.$bus.$on('uploadFile',()=>{
            // this.uploadFile()
            this.optionSubmit()
      })
    },
    mounted () {
      this.num = this.multipleChoiceForm.questionOption.length
      this.choices = this.multipleChoiceForm.questionAnswer
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
    computed: {
      
    },
    data () {
      return {
        fileList:[],
        uploadUrl: '',
        index: 0,
        bodyOroption: null,
        choices: [],
        num: 4,
        checkXX: [''],
        option: ['A', 'B', 'C', 'D', 'E', 'F'],
        optionFileList:[{},{},{},{}],
        bodtFileList: [],
        ashow: false,
        imgshow: true,
        src: '',
        addBody: false,
        newList: null
      }
    },
    methods: {
      tirggerFile(event,index){
          let self = this;
          let file = event.target.files[0]
          this.optionFileList[index] = file
          this.multipleChoiceForm.optionFileList = this.optionFileList
          console.log(this.optionFileList)
      },
      optionSubmit(){
        let formData = new FormData() // 创建form对象
        if(this.optionFileList[0].name){
          this.optionFileList.forEach(ele => {
            formData.append('optionFile', ele, ele.name) // 通过append向form对象添加数据
          });
        }
        if(this.bodyFileList != []){
          this.bodyFileList.forEach(ele => {
            formData.append('bodyFile', ele.raw, ele.name) // 通过append向form对象添加数据
          });
        }
        if(this.bodyFileList.length > 0 || this.optionFileList[0].name){
          this.$uploadImg(this.$axiosURL.k_examinationQuestion + 'save/andRefersTqweqweo', formData).then((res) => {
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
          if(this.bodyOroption == true) {
            this.imgshow = false
            this.multipleChoiceForm.eqBodyImageNameList1.push(val)
            this.imgshow = true
            console.log(this.multipleChoiceForm.eqBodyImageNameList1,this.addBody)
          } else {
            this.imgshow = false
            this.multipleChoiceForm.questionOption[this.index].img = val
            this.imgshow = true
            console.log(this.multipleChoiceForm.questionOption,99)
          }
            this.addBody = false
        }else {
          if(this.bodyOroption == true) {
            this.imgshow = false
            this.multipleChoiceForm.eqBodyImageNameList1.splice(this.index,1,val)
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
      addImg(id,i,index){
        this.uploadUrl = this.$axiosURL.fm_fileManipulate + '/add/' + id + '/image/' + i
        if(i == true) {
            this.bodyOroption = true
        } else {
            this.bodyOroption = false
        }
        this.addBody = true
        this.index = index
      },
      delImg(id,i,index){
        this.$axiosResBody1('delete',this.$axiosURL.fm_fileManipulate + '/delete/' + id + '/image/' + i  + '/' + index).then((res)=>{
          if(i == true) {
            this.imgshow = false
            this.multipleChoiceForm.eqBodyImageNameList1.splice(index,1)
            this.imgshow = true
          } else {
            // this.imgshow = false
            // this.multipleChoiceForm.eqBodyImageNameList1.splice(index,1)
            // this.imgshow = true
          }

        })
      },
    	// 添加选项
    	addDomain(){
  	  		if(this.multipleChoiceForm.questionOption.length <6){
				    this.multipleChoiceForm.questionOption.push({
    			   value: '',
    			   key: this.option[this.num]
           })
           this.optionFileList.push({})
    			 this.num++
  	  		}
          if(this.multipleChoiceForm.questionOption.length >4){
            this.ashow = true
          } else {
            this.ashow = false
          }
    	},
      	removeDomain (item, indexs) {
    	 // this.choices.pop()
      	  // this.choices.pop()

      	  	if(this.multipleChoiceForm.questionOption.length >4){
              this.ashow = true
	      	  	this.num--
  	  		  	// var choicesikndex = this.choices.indexOf(item.key)
  	  		  	// if(choicesikndex !== -1) {
  	  		  	// 	this.choices.splice(choicesikndex, 1)
  	  		  	// 	console.log(choicesikndex)
  	  		  	// }
	      	  	var index = this.multipleChoiceForm.questionOption.indexOf(item)
      	  		if (index !== -1) {
                  this.multipleChoiceForm.questionOption.splice(indexs, 1)
                  console.log(indexs)
                  this.optionFileList.splice(indexs, 1)
      	  		   	this.choices = []
         			    this.multipleChoiceForm.questionAnswer = this.choices.join(',')
      	  		  // this.choices.splice()
      	  		}
      	  		for ( var i= 0; i< this.multipleChoiceForm.questionOption.length; i++) {
      	  			// console.log(this.multipleChoiceForm.questionOption[i].key)
      	  			this.multipleChoiceForm.questionOption[i].key = this.option[i]
      	  		}
              if(item.img){
                this.delImg(this.multipleChoiceForm.id,false,indexs)
              }
      	  	} else {
              // this.ashow = false
      	  		return false
      	  	}
            if(this.multipleChoiceForm.questionOption.length <= 4){
              this.ashow = false
            }

	    	// var choicesikndex = this.choices.indexOf(item.key)
      // 	  	if (choicesikndex !== -1) {
      // 	  	  this.choices.splice(choicesikndex, 1)
      // 	  	  console.log(this.choices)
      // 	  	}
      	  	// console.log(this.multipleChoiceForm.questionOption)
      	},
      	changeXX(){
      		// this.multipleChoiceForm.questionAnswer = val
      		console.log(this.choices)
      		this.multipleChoiceForm.questionAnswer = this.choices
      		// this.cho
      	}
    },
    beforeDestroy() {
      this.$bus.$off('uploadFile')
    },

}
</script>
<style scoped>
.el-radio+.el-radio,.el-checkbox+.el-checkbox {
	margin-left: 0;
}
.el-radio,.el-checkbox{
	margin-bottom: 6px;
}
.el-row {
	margin-bottom: -4px;
}
/*.xuanx {
  color: #fff
}*/
  img{
    width: 200px;
    height: 200px;
    vertical-align: middle;
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
  .edit {
    display: inline-flex;
    justify-content: flex-end;
    text-align: right;
    font-size: 20px;
    width: 200px;
    margin-left: 6px;
  }
  .aedit{
    display: inline-block;
    font-size: 20px;
  }
  .add{
    width: 200px;
    height: 200px
  }
</style>
