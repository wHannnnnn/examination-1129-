 <template>
    <div class="mytopicDetails">
        <el-backtop :bottom="60"></el-backtop>
        <div class="listContent">
            <div :class="detailIsFixed?'detailIsFixed':'detailTitle'">
                <h5 class="left-title">{{detailList.title}}</h5>
                <div class="right-comment">
                    <el-button size="small">只看楼主</el-button>
                    <el-button @click="click" size="small" icon="el-icon-chat-dot-round">回复</el-button>
                </div>
            </div>
            <ul class="listContent-ul">
                <li class="listContent-ul-li">
                    <img :src="louzhuImg" class="louzhuImg">
                     <!-- v-if="detailList.userid == this.$store.state.loginUser.id" -->
                        <el-dropdown trigger="click" @command='change' v-if="aid!=null&&detailList.userid == aid">
                            <span class="el-dropdown-link">
                                <i class="el-icon-arrow-down"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="delete" @click.native="adelete(detailList.id)">删除</el-dropdown-item>
                                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    <div class="detail">
                        <div class="leftMine">
                            <el-avatar :size="60" :src="circleUrl"></el-avatar>
                            <span class="detailName">{{detailList.username}}</span>
                        </div>
                        <div class="rightCon">
                            <div class="text-content" v-html="detailList.textcontent">
                                <!-- {{detailList.textcontent}} -->
                            </div>
                            <div class="clickpointer" @click="pointer">
                                <i class="el-icon-thumb"></i>
                                <p>{{this.shouc==false? '收藏': '取消收藏'}}</p>
                            </div>
                            <div class="text-comment">
                                <div class="commentNum">
                                    <div class="commentleft">
                                        <span style="margin-right: 10px">楼主</span>
                                         {{UTCtoDate(detailList.createtime)}}
                                    </div>       
                                    <div class="commentright">
                                        <el-button @click="click" size="mini" icon="el-icon-chat-dot-round">回复</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="listContent-ul-li" v-for="(item,index) in detailList.comment" :key="item.id">
                    <img :src="louzhuImg" v-if="item.username == detailList.username" class="louzhuImg">
                     <!-- v-if="detailList.userid == this.$store.state.loginUser.id" -->
                    <el-dropdown trigger="click" v-if="aid!=null&&item.userid == aid">
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="deleteComment(item.id)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div class="detail">
                        <div class="leftMine">
                            <el-avatar :size="60" :src="circleUrl"></el-avatar>
                            <span class="detailName">{{item.username}}</span>
                        </div>
                        <div class="rightCon">
                            <div class="text-content" v-html="item.textcontent">
                            </div>
                            <div class="text-comment">
                                <div class="commentNum">
                                    <div class="commentleft">
                                        <span style="margin-right: 10px">{{index + 1}}楼</span> {{UTCtoDate(item.createtime)}}
                                    </div>
                                    <div class="commentright">
                                        <i class="el-icon-chat-dot-round"></i>
                                        <span class="pointer" @click="getReply(index,item)">{{item.ListIsShow==true? '收起回复': '回复'}}({{item.commentnum==null? '0' : item.commentnum}})</span>
                                    </div>
                                </div>
                                <div class="commentList" v-show="item.ListIsShow">
                                    <div class="commentValue">
                                        <!-- 评论列表 -->
                                        <ul>

                                            <li class="commentList-li" v-for="(replyItem,replyIndex) in item.reply" :key="replyItem.id">
                                                <div class="list-in">
                                                    <div class="list-pic">
                                                        <el-avatar :size="30" :src="circleUrl"></el-avatar>
                                                    </div>
                                                    <div class="list-con">
                                                        <div class="list-con-top">
                                                            <p >
                                                                <span>{{replyItem.username}}</span> 
                                                                <span v-if="replyItem.replyid !== item.userid ||replyItem.seccomtid!==null">：回复 {{replyItem.replyname}}</span>
                                                                ：<span>{{replyItem.textcontent}}</span>
                                                            </p>
                                                        </div>
                                                        <div class="list-con-bottom">
                                                            <span style="color: #8a8a8a">{{UTCtoDate(replyItem.createtime)}}</span>
                                                            <span class="pointer">
                                                                <span @click="replayClick(index,replyItem.username,3,replyIndex)" style="margin-right: 10px">回复</span>
                                                                <span @click="deleteReply(index,item,replyItem)" v-if="replyItem.userid == aid">删除</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                            <!-- <li class="commentList-li" v-show="item.addReplyShow" v-for="(replyItem,replyIndex) in replyData" :key="replyItem.id">
                                                 <div class="list-in">
                                                    <div class="list-pic">
                                                        <el-avatar :size="30" :src="circleUrl"></el-avatar>
                                                    </div>
                                                    <div class="list-con">
                                                        <div class="list-con-top">
                                                            <p >
                                                                <span>{{replyItem.username}}</span> 
                                                                <span v-if="replyItem.replyid !== item.userid ||replyItem.seccomtid!==null">：回复 {{replyItem.replyname}}</span>
                                                                ：<span>{{replyItem.textcontent}}</span>
                                                            </p>
                                                        </div>
                                                        <div class="list-con-bottom">
                                                            <span>1周前</span>
                                                            <span class="pointer">
                                                                <span @click="replayClick(index,replyItem.username,3,replyIndex)" style="margin-right: 10px">回复</span>
                                                                <span @click="deleteReply(index,item,replyItem)" v-if="replyItem.userid == aid">删除</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li> -->

                                            <div class="commentPage">
                                                <div v-if="item.commentnum>0">
                                                    <el-pagination background @size-change="comHandleSizeChange(replyItem)" @current-change="(val)=>comHandleCurrentChange(val,index,item)" :current-page="item.pageNum"
                                                        :page-size="item.pageSize" layout="total, prev, pager, next, jumper"
                                                        :total="item.commentnum">
                                                    </el-pagination>
                                                </div>
                                                <el-button size="small" @click="replayClick(index,item.username,2)">我也说一句</el-button>
                                            </div>
                                        </ul>
                                        <!-- 评论分页 -->
                                        <!-- 回复框 -->
                                        <div class="replyInput" :id="'top' + index" v-show="item.isShow">
                                            <el-input v-model="replyinput" v-focus="focus"  :placeholder="inputPlaceHolder"></el-input>
                                            <el-button type="primary" size="mini" style="margin-top: 10px" @click='saveReply(index,item)'>发 表</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="page">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalNum">
            </el-pagination>
        </div>
        <div id="scroll" class="reply">
            <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
            </quill-editor>
            <el-button type="primary" style="margin-top: 20px" @click='saveHtml' v-if="this.edit == false">发 表</el-button>
            <el-button type="primary" style="margin-top: 20px" @click='editHtml' v-if="this.edit == true">修 改</el-button>
        </div>
        <el-dialog title="请先登录" :visible.sync="loginShow" width="30%">
            <newlogin></newlogin>
        </el-dialog>
    </div>
</template>
<script>
import Vue from 'vue'
import newlogin from '@/components/layout/newlogin'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            loginShow: false,
            louzhuImg: require("@/assets/img/louzhu.png"),
            detailIsFixed: 0,
            comtotal: null,
            compageNum: 1,
            compageSize: 5,
            acompageNum: 1,
            totalNum: 0,
            pageNum: 1,
            pageSize: 5,
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            content: ``,
            replyinput: '',
            edit: false,
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
            detailList:{},
            replyData:[],
            inputPlaceHolder: '回复:',
            shouc: false,
            replyNum: 2,
            replyIndex: null
        }
    },
    components:{
        newlogin
    },
    computed: {
        ...mapState(['loginUser']),
        aid(){
            return this.loginUser==null? null: this.loginUser.id
        }
    },
    methods: {
        // handleScroll() {
        //     let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        //     this.detailIsFixed = scrollTop > this.offsetTop
        // },
        UTCtoDate:function(date){
            return this.$tools.UTCtoDate(date)
        },
        handleSizeChange(val){
            console.log(val)
            this.getComment()
        },
        handleCurrentChange(val){
            console.log(val)
            this.pageNum = val
            this.getComment()
        },
        comHandleCurrentChange(val,index,item){
            console.log(val,index,item)
            this.acompageNum = val
            this.detailList.comment[index].pageNum = val
            this.detailList.comment.forEach((ele,i)=>{
                ele.isShow = false
            })
            this.detailList.comment[index].isShow = true
            this.getReplyItem(index,item.id,item.pageNum,item.pageSize)
            this.detailList.comment[index].addReplyShow = false
            this.replyData = []
        },
        focus(){},
        onEditorFocus(){
            this.detailList.comment.forEach((ele,i)=>{
                ele.isShow = false
            })
        },
        onEditorChange(){},
        handleClose(){},
        editTopic(){
            document.getElementById('scroll').scrollIntoView()
            console.log('asd')
        },
        replayClick(index, username,num,replyIndex){
            //二级回复的回复
            this.replyNum = num
            this.replyIndex = replyIndex
            console.log(this.replyIndex)
            this.replyinput = ''
            //元素距离顶部的距离 < 浏览器高度 + 浏览器滚动的距离
            this.inputPlaceHolder = '回复:'
            this.inputPlaceHolder +=  username
            // 
            // var a = 'top' + index
            // var first = $('#'+ a).offset().top - $(document).scrollTop() - $(window).height();
            // var second = $('#'+ a).height() + $(window).height();
            // if (first > 0 || first < -second) {
            //     document.getElementById(a).scrollIntoView()
            //     window.scrollBy(0, -200)
            // }
            if (this.detailList.comment[index].isShow !== true) {
                this.detailList.comment.forEach((ele,i)=>{
                    ele.isShow = false
                    ele.addReplyShow = false
                    console.log(ele)
                })
                this.detailList.comment[index].isShow = true
                this.detailList.comment[index].addReplyShow = true
                this.replyData = []
            }
        },
        click(){
            document.getElementById('scroll').scrollIntoView()
            this.edit = false
            this.content = ''
        },
        change(val){
            console.log(val)
            if(val == 'edit'){
                this.edit = true
                document.getElementById('scroll').scrollIntoView()
                this.content = this.detailList.textcontent
            }
        },
        // 是否收藏
        colletion(){
            this.$axiosStuRes1('get', this.$axiosURL.Fr_userTopic + 'judge/' + this.$tools.userid('id') + '/' + this.topicId).then((res) => {
                console.log(res)
                if(res.status == 1){
                    this.shouc = res
                }
            })
        },
        // 收藏或取消
        pointer(){
            if(this.shouc == true){
                this.$axiosStuResBody('delete', this.$axiosURL.Fr_userTopic + 'cancel/' + this.$tools.userid('id') + '/' + this.detailList.id).then((res) => {
                    if(res.error == 'invalid_token'){
                        this.loginShow = true
                        return
                    }
                    if(res.status == 1){
                        this.shouc = false
                    }
                })
            } else {
                var params = {
                    userid: this.$tools.userid('id'),
                    topicid: this.detailList.id,
                    createtime: Date.parse(new Date())
                }
                this.$axiosStuResBody('post', this.$axiosURL.Fr_userTopic + 'insert', params).then((res) => {
                    if(res.error == 'invalid_token'){
                        this.loginShow = true
                        return
                    }
                    if(res.status == 1){
                        this.shouc = true
                    }
                })
            }

        },
        // 编辑话题
        editHtml(){
            var params = {
                updatetime: Date.parse(new Date()),
                textcontent: this.content,
                id: this.detailList.id
            }
            this.$axiosStuResBody('put', this.$axiosURL.Fr_topic + 'update', params).then((res) => {
                if(res.status == 1){
                    this.detailList.textcontent = this.content
                    this.content = ''
                }
            })
        },
        // 删除话题
        adelete(id){
            this.$confirm('此操作将永久删除该话题, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.$axiosStuResBody('delete', this.$axiosURL.Fr_topic + 'delete/' + id).then((res) => {
                    this.$router.push({path:'/hotTopic'})
                    // this.$router.go(-1)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 删除一级评论
        deleteComment(id){
            this.$confirm('此操作将永久删除该话题, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.$axiosStuResBody('delete', this.$axiosURL.Fr_comment + 'delete/' + id).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getComment()
                }).then((data)=>{
                    this.$axiosStuResBody('put', this.$axiosURL.Fr_topic + 'update/' + this.topicId + '/comtNum/false').then((res) => {
                        console.log(res,9988)
                    }) 
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //删除二级回复
        deleteReply(index,item,replyItem){
            this.$confirm('此操作将永久删除该话题, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.$axiosStuResBody('delete', this.$axiosURL.Fr_comment + 'delete/' + replyItem.id).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    console.log(res)
                    this.getReplyItem(index,item.id,item.pageNum,item.pageSize)
                    this.detailList.comment[index].addReplyShow = false
                    this.detailList.comment[index].commentnum -= 1
                    this.replyData = []
                }).then(()=>{
                        this.$axiosStuResBody('put', this.$axiosURL.Fr_topic + 'update/' + this.topicId + '/comtNum/false').then((res) => {
                        }) 
                }).then(()=>{
                        this.$axiosStuResBody('put', this.$axiosURL.Fr_comment + 'update/' + item.id + '/comtNum/false').then((res) => {
                        })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 发表一级评论
        saveHtml: function (val) {
            var params = {
                topicid: this.topicId,
                userid: this.$tools.userid('id'),
                username: this.$tools.userid('username'),
                replyid: Number(this.detailList.userid),
                replyname: this.detailList.username,
                textcontent: this.content,
                createtime: Date.parse(new Date()),
                updatetime: Date.parse(new Date())
            }
            this.$axiosStuResBody('post', this.$axiosURL.Fr_comment + 'insert', params).then((res) => {
                if(res.error == 'invalid_token'){
                    this.loginShow = true
                    return
                }
                if(res.status == 1){
                    this.getComment()
                    this.content = ''
                    return res.data
                }
            }).then((data)=>{
                var params = {
                    userid: this.$store.state.loginUser.id,
                    username: this.$store.state.loginUser.username,
                    replyuserid: Number(this.detailList.userid),
                    replyusername: this.detailList.username,
                    topicid: this.topicId,
                    topictitle: this.detailList.title,
                    topictext: this.detailList.textcontent,
                    comtid: data.id,
                    comttext: data.textcontent,
                    comttime: Date.parse(new Date()),
                    hasred: 0
                }
                console.log(params)
                this.$axiosStuResBody('post', this.$axiosURL.Fr_personMsg + 'insert', params).then((res) => {
                    console.log(res)
                })
            }).then(()=>{
                this.$axiosStuResBody('put', this.$axiosURL.Fr_topic + 'update/' + this.topicId + '/comtNum/true').then((res) => {
                    console.log(res,9988)
                }) 
            })

        },
        // 发表二级回复
        saveReply(index,item){
            if(this.replyIndex == undefined){
                var params = {
                    replycomtid: item.id,//
                    seccomtid: item.id,
                    userid: this.$tools.userid('id'),
                    username: this.$tools.userid('username'),
                    replyid: item.userid, //bian
                    replyname: item.username, //
                    textcontent: this.replyinput,
                    createtime: Date.parse(new Date()),
                    updatetime: Date.parse(new Date())
                }
            } else {
                var params = {
                    replycomtid: item.id,
                    seccomtid: item.reply[this.replyIndex].id,
                    userid: this.$store.state.loginUser.id,
                    username: this.$store.state.loginUser.username,
                    replyid: item.reply[this.replyIndex].userid,
                    replyname: item.reply[this.replyIndex].username,
                    textcontent: this.replyinput,
                    createtime: Date.parse(new Date()),
                    updatetime: Date.parse(new Date())
                }
            }
            console.log(params)
            this.$axiosStuResBody('post', this.$axiosURL.Fr_comment + 'insert', params).then((res) => {
                if(res.error == 'invalid_token'){
                    this.loginShow = true
                    return
                }
                if(res.status == 1){
                    this.$nextTick(()=>{
                        this.getReplyItem(index,item.id,item.pageNum,item.pageSize)
                        // this.replyData.push(res.data)
                        // this.detailList.comment[index].addReplyShow = true
                        this.detailList.comment[index].commentnum += 1
                        this.replyinput = ''
                    })
                }
                return res.data
            }).then((data)=>{
                if(this.replyIndex == undefined){
                    var params = {
                        topicid: this.topicId,
                        topictitle: this.detailList.title,
                        topictext: this.detailList.textcontent,
                        userid: this.$store.state.loginUser.id,
                        username: this.$store.state.loginUser.username,
                        replyuserid: item.userid,
                        replyusername: item.username,
                        replycomttext: item.textcontent,
                        replycomtid: item.id, //被恢复的评论id
                        comtid: item.id, //一级
                        comttext: item.textcontent,
                        seccomtid: data.id,
                        seccomttext: data.textcontent,
                        comttime: Date.parse(new Date()),
                        hasred: 0
                    }
                } else {
                    var params = {
                        topicid: this.topicId,
                        topictitle: this.detailList.title,
                        topictext: this.detailList.textcontent,
                        userid: this.$store.state.loginUser.id,
                        username: this.$store.state.loginUser.username,
                        replyuserid: item.reply[this.replyIndex].userid,
                        replyusername: item.reply[this.replyIndex].username,
                        replycomttext: item.reply[this.replyIndex].textcontent,
                        replycomtid: item.reply[this.replyIndex].id, //被恢复的评论id
                        comtid: item.id, //一级
                        comttext: item.textcontent,
                        seccomtid: data.id,
                        seccomttext: data.textcontent,
                        comttime: Date.parse(new Date()),
                        hasred: 0
                    }
                }
                this.$axiosStuResBody('post', this.$axiosURL.Fr_personMsg + 'insert', params).then((res) => {
                    console.log(res)
                })
            }).then(()=>{
                this.$axiosStuResBody('put', this.$axiosURL.Fr_topic + 'update/' + this.topicId + '/comtNum/true').then((res) => {
                })
            }).then(()=>{
                //判断非空
                this.$axiosStuResBody('get', this.$axiosURL.Fr_comment + 'find/' + item.id).then((res) => {
                    if(res == null){
                        return
                    } else {
                        this.$axiosStuResBody('put', this.$axiosURL.Fr_comment + 'update/' + item.id + '/comtNum/true').then((res) => {
                        })
                    }
                })
            })
        },
        // 获取话题内容
        getTopic(){
            this.$axiosStuRes('get', this.$axiosURL.Fr_topic + 'anon/find/' + this.topicId).then((res) => {
                this.comtotal = res.data.commentnum
                this.detailList = res.data
            })
        },
        // 获取一级评论
        getComment(){
            var params = {
                currentPageNum: this.pageNum,
                perPageNum: this.pageSize,
                topicid: this.topicId
            }
            this.$axiosStuRes('get', this.$axiosURL.Fr_comment + 'anon/find/levelOne', params).then((res) => {
                this.totalNum = res.totalNum
                if(res.dataList){
                    res.dataList.forEach(ele => {
                        ele.pageNum = 1
                        ele.pageSize = 5
                    });
                }
                Vue.set(this.detailList, 'comment', res.dataList)
                console.log(this.detailList,999)
            })
        },
        // 获取二级评论
        getReply(index, item){
            console.log(index,item)
            // 获取二级评论接口

            this.replyinput = ''
            this.inputPlaceHolder = '回复:'
            this.inputPlaceHolder += item.username
            if (this.detailList.comment[index].isShow !== true) {
                this.detailList.comment.forEach((ele, i) => {
                    ele.isShow = false
                    ele.addReplyShow = false
                })
                this.detailList.comment[index].isShow = true
            }
            console.log(this.detailList.comment[index].ListIsShow)
            // if(!this.detailList.comment[index].aListIsShow){
                //     this.getReplyItem(index,item.id,item.pageNum,item.pageSize)
            // }
            this.detailList.comment[index].ListIsShow = !this.detailList.comment[index].ListIsShow
            if(this.detailList.comment[index].ListIsShow == true){
                this.getReplyItem(index,item.id,item.pageNum,item.pageSize)
            }
            // this.detailList.comment[index].aListIsShow = true
            this.detailList.comment[index].addReplyShow = true
            this.replyData = []
        },
        // 获取二级评论接口
        getReplyItem(index,id,pageNum=1,pageSize=5){
            var params = {
                currentPageNum: pageNum,
                perPageNum: pageSize,
                replycomtid: id
            }
            this.$axiosStuRes('get', this.$axiosURL.Fr_comment + 'anon/find/levelTwo', params).then((res) => {
                Vue.set(this.detailList.comment[index], 'reply', res.dataList)
            })
        }
    },
    mounted() {
        // this.$nextTick(function () {
        //     let top = document.getElementsByClassName("detailTitle")[0];
        //     this.offsetTop = top.offsetTop;
        // });
        // window.addEventListener('scroll', this.handleScroll);
    },
    created() {
        this.topicId = this.$route.params.id
        // this.aid = this.$tools.userid('id')
        this.getTopic()
        this.getComment()
        this.colletion()
    },
    updated() {
        // this.aid = this.$tools.userid('id')
    },
    destroyed() {
        // window.removeEventListener('scroll', this.handleScroll);
    },
}
</script>