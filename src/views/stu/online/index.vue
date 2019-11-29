<template>
    <div class="online change">
        <div class="app_header">
            <impheader></impheader>
        </div>
        <div class="search">
            <el-input placeholder="请输入内容" v-model="formInline.GJZ" class="input-with-select" @keyup.enter.native="onlineSearch">
                <el-button slot="append" icon="el-icon-search" @click='onlineSearch'></el-button>
            </el-input>
        </div>
        <div class="online_con">
            <div id="left-nav" :class="headerFixed?'isFixed':''"  v-if="this.$route.path == '/hotTopic'">
                <el-menu default-active="0" class="el-menu-vertical-demo" @select="menuSelected"  @open="menuOpen" :collapse="true"
                    active-text-color="black">
                    <nav-menu :navMenus="leftMenus"></nav-menu>
                </el-menu>
            </div>
            <div id="right-nav" class="rightNav">
                <el-menu class="el-menu-vertical-demo" :default-active="$route.path" mode="horizontal" @select="navChange" router :unique-opened='true'>
        
                    <el-menu-item index="/hotTopic"><i class="el-icon-menu"></i>热门话题</el-menu-item>
                    <el-menu-item index="/myTopic"><i class="el-icon-menu"></i>我的话题</el-menu-item>
                    <el-menu-item index="/myNews"  @click.native="removeCount"><i class="el-icon-menu"></i>
                        <el-badge :value="count" :max="99" class="item" v-if="count!==0">
                            个人消息
                        </el-badge>
                        <span v-if="count==0">
                            个人消息
                        </span>
                    </el-menu-item>
                    <el-menu-item index="/myReplies"><i class="el-icon-menu"></i>我的回帖</el-menu-item>
                    <!-- <el-menu-item index="/publish"><i class="el-icon-menu"></i>发表话题</el-menu-item> -->
                    <el-menu-item index="/myCollect"><i class="el-icon-menu"></i>我的收藏</el-menu-item>
                </el-menu>
                <div class="asdasdsad">
                    <transition name="custom-classes-transition" enter-active-class="animated slideInRight">
                        <router-view v-if="ishow"></router-view>
                    </transition>
                </div>
                <el-button id="drag" v-drag type="primary" icon="el-icon-plus" circle @click.native="saveTopic"></el-button>
                <el-dialog title="发表话题" :visible.sync="saveShow">
                    <div class="detailList">
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
                            <el-button @click="saveShow = false">取 消</el-button>
                        </div>
                    </div>
                </el-dialog>

            </div>
        </div>
        <div class="app_bottom">
              <bottom/>
        </div>
        <el-dialog title="请先登录" :visible.sync="loginShow" width="30%" @close="loginShowClose">
            <newlogin></newlogin>
        </el-dialog>
    </div>
</template>
<script>
import impheader from '@/components/layout/header1'
import NavMenu from './navMenu.vue'
import newlogin from '@/components/layout/newlogin'
import bottom from "@/components/layout/bottom.vue"
export default {
    data () {
        return {
            loginShow: false,
            headerFixed: 0,
            formInline:{
                GJZ: ''
            },
            leftMenus:[],
            ishow: true,
            saveShow:false,
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
            count: 0
        }
    },
    // 自定义指令
    directives: {
     drag: {
        // 指令的定义
        bind: function (el) {
          let odiv = el;  //获取当前元素
          let firstTime='',lastTime='';
          odiv.onmousedown = (e) => {
            document.getElementById('drag').setAttribute('data-flag',false)
            firstTime = new Date().getTime();
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            document.onmousemove = (e) => {
                //  用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let top = e.clientY - disY;
                let left = e.clientX - disX;
                
                //绑定元素位置到positionX和positionY上面
                // this.positionX = top;
                // this.positionY = left;

                //移动当前元素
                odiv.style.left = left + 'px';
                odiv.style.top = top + 'px';

              //  页面范围内移动元素
            //   if (top > 0 && top < document.body.clientHeight - 48) {
            //     odiv.style.top = top + 'px';
            //   }
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
                // onmouseup 时的时间，并计算差值
                lastTime = new Date().getTime();
                console.log(lastTime - firstTime)
                if( (lastTime - firstTime) < 200){
                  document.getElementById('drag').setAttribute('data-flag',true)
                }
            };
          };
        }
      }
    },
    components:{
        impheader,
        NavMenu,
        newlogin,
        bottom
    },
    methods:{
        handleSizeChange(){},
        handleCurrentChange(){},
        focus(){},
        onEditorFocus(){},
        handleClose(){},
        onEditorChange(){},
        saveHtml: function () {
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
                userid: loginUser==null?null:loginUser.id,
                username: loginUser==null?null:loginUser.username,
                title: this.title,
                createtime: Date.parse(new Date()),
                updatetime: Date.parse(new Date()),
                textcontent: this.content,
                content: ''
            }
            this.$axiosStuResBody('post', this.$axiosURL.Fr_topic + 'insert', params).then((res) => {
                if(res.error == 'invalid_token'){
                    this.loginShow = true
                    return
                }
                this.saveShow = false
                if(this.$route.path == '/hotTopic'){
                    this.ishow = false 
                    this.$nextTick(()=>{
                        this.ishow = true
                    })
                } else {
                    this.$router.push({path:'/hotTopic'})
                }

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
        removeCount(){
            var id = this.$store.state.loginUser==null?null:this.$store.state.loginUser.id
            this.$axiosStuRes1('put', this.$axiosURL.Fr_personMsg + 'updateHasRed/' + id + '/batch').then((res) => {
                console.log(res,88)
                if(res.status == 1){
                    setTimeout(() => {
                        this.count = 0            
                    }, 1000);
                }
                // this.count = res
            }) 
        },
        saveTopic(){
            let isClick = document.getElementById('drag').getAttribute('data-flag')
            console.log(isClick)
            if(isClick !== 'true') {
                return false
            }
            this.saveShow = true
        },
        handleScroll() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            this.headerFixed = scrollTop > this.offsetTop
        },
        onlineSearch(){
            this.$bus.$emit('allsearchTopic',this.formInline.GJZ)
        },
        menuSelected(index,indexPath){
        },
        navChange(){
            this.ishow = false 
            this.$nextTick(()=>{
                this.ishow = true
                console.log(this.$route.path)
                if(this.$tools.userid('id')==null&&this.$route.path !=="/hotTopic"){
                    this.loginShow = true
                }
            })
        },
        menuOpen(index,indexPath){
        },
        loginShowClose(){
            this.ishow = false 
            this.$nextTick(()=>{
                this.ishow = true
            })
        },
        getCount(){
            var loginUser = this.$store.state.loginUser
            var params = {
                userid: loginUser==null?null:loginUser.id
            }
            this.$axiosStuRes('get', this.$axiosURL.Fr_personMsg + 'count/hasNotRed', params).then((res) => {
                console.log(res,88)
                if(!res.error){
                    this.count = res
                }
            }) 
        }
    },
    created() {        
        this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
            this.ZSDdata = this.getTreeData(res);
        })
        this.$axiosStuRes('get',this.$axiosURL.k_knowledgeHierachy+ '4/all',{}).then((res)=>{
            this.leftMenus = res
        })
    },
    mounted() {
        this.getCount()

    },
    beforeDestroy() {
      this.$bus.$off('allsearchTopic')      
    },
}
</script>
