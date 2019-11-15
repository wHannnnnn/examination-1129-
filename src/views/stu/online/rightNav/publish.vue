<template>
    <div class="publishTopic">
        <div class="topic">
            <el-cascader
                placeholder="选择话题标签"
                :options="ZSDdata"
                :props="ZSDprops"
                ref="cascader2"
                v-model="subjectsIdsStrs"
                :show-all-levels="false"
                filterable
                change-on-select>
            </el-cascader>
        </div>
        <div class="topic">
            <el-input
                placeholder="请输入话题名称"
                v-model="title"
                clearable>
            </el-input>
        </div>
        <div class="reply">
            <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
            </quill-editor>
            <el-button type="primary" style="margin-top: 20px" @click='saveHtml'>发 表</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            content: ``,
            searchContent: '',
            replyinput: '',
            title: '',
            editorOption: {
                 placeholder: '请输入文本',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }], // 标题一、标题二
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
                        [{ 'color': [] }, { 'background': [] }],
                        ['image']
                    ]
                }
            },
            ZSDdata: [],
            ZSDprops:{
                value:'name',
                label:'name',
                children:'knowledgePoints',
            },
            subjectsIdsStrs: [],
        }
    },
    methods: {
        handleSizeChange(){},
        handleCurrentChange(){},
        focus(){},
        onEditorFocus(){},
        handleClose(){},
        onEditorChange(){},
        saveHtml: function (val) {
            if(this.subjectsIdsStrs == []){
               this.$message.error('请选择话题标签')
               return 
            }
            if(this.title == ''){
                this.$message.error('请输入话题名称')
               return 
            }
            if(this.content == ''){
                this.$message.error('请输入文本内容')
                return 
            }
            this.searchContent = this.content.replace(/<[^>]+>|\s+/g, "")
            console.log(this.$store.state.loginUser)
            var loginUser = this.$store.state.loginUser
            var params = {
                topiclabel: this.subjectsIdsStrs[this.subjectsIdsStrs.length -1],
                userid: loginUser.id,
                username: loginUser.username,
                title: this.title,
                createtime: Date.parse(new Date()),
                updatetime: Date.parse(new Date()),
                textcontent: this.content,
                content: ''
            }
            console.log(params)
            this.$axiosStuResBody('post', this.$axiosURL.Fr_topic + 'insert', params).then((res) => {
                console.log(res)
                if(res.error == "invalid_token"){
                    this.$message.error('请登录')
                }
            })

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
        
    },
    mounted() {
        this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
            this.ZSDdata = this.getTreeData(res);
        })
    },
}
</script>
<style lang="scss">
    .publishTopic{
        padding: 10px
    }
    .topic{
        margin: 10px 0
    }
</style>