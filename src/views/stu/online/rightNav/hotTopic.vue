<template>
    <div class="hotTopic" v-if="ishow">
        <el-backtop :bottom="60"></el-backtop>
        <!-- 热门话题 -->
        <ul>
            <li v-for="(item,index) in topicList" :key="item.id">
                <div class="content">
                    <router-link tag='a' target='_blank' :to="{name: '/topicDetails', params: {id:item.id}}">
                        <div class="topic-name">
                            <span class="pointName"><div v-html="item.sourceAsMap?item.sourceAsMap.topiclabel:item.topiclabel"></div></span>
                            <!-- <span class="pointName" v-if="!item.index"><div v-html="item.topiclabel"></span> -->
                        </div>
                        <div class="topic-title">
                            <span class="title-value"><div v-html="item.sourceAsMap?item.sourceAsMap.title:item.title"></div></span>
                            <!-- <span class="title-value" v-if="!item.index">{{item.title}}</span> -->
                        </div>
                        <div>
                            <div class="topic-detail" v-html="item.sourceAsMap?item.sourceAsMap.textcontent:item.textcontent">
                        </div>
                        <!-- <div v-if="!item.index">
                            <div class="topic-detail" v-html="item.textcontent">
                        </div> -->
                        <!-- <div class="topic-detail" v-html="item.textcontent"> -->
                        </div>
                        <div class="topic-info">
                            <div class="userInfo">
                                <span class="userInfoName"><div v-html="item.sourceAsMap?item.sourceAsMap.username:item.username"></div></span>
                                <!-- <span class="userInfoName" v-if="!item.index">{{item.username}}</span> -->
                            </div>
                            <div class="dataNum">
                                <!-- <span class="watchNum"><img :src="watchImg">{{itemcommentnum}}</span> -->
                                <span class="commentNum"><img :src="commentImg">{{item.sourceAsMap?item.sourceAsMap.commentnum:item.commentnum}}</span>
                                <!-- <span class="commentNum" v-if="!item.index"><img :src="commentImg">{{item.commentnum}}</span> -->
                            </div>
                            <div class="topicTime">
                                <span>{{UTCtoDate(item.sourceAsMap?item.sourceAsMap.createtime:item.createtime)}}</span>
                                <!-- <span v-if="!item.index">{{UTCtoDate(item.createtime)}}</span> -->
                            </div>
                        </div>
                    </router-link>
                </div>
            </li>
        </ul>
        <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading">
            <span slot="no-more">
                <div slot="no-more">已加载全部</div>
            </span>
        </infinite-loading>
    </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading';
export default {
    data() {
        return {
            commentImg: require("@/assets/img/comment.png"),
            topicList: [],
            pageNum: 1,
            pageSize: 5,
            isLoading: false,
            ishow: true,
            name: '',
            topicName: '',
            allSearchName: ''
        }
    },
    components: {
        InfiniteLoading,
    },
    methods: {
        infiniteHandler() {
            if(this.isLoading){
                return
            } else {
                this.isLoading = true
                if(this.topicName == '' && this.allSearchName == ''){
                    var params = {
                        currentPageNum: this.pageNum,
                        perPageNum: this.pageSize
                    }
                    this.$axiosStuRes('get', this.$axiosURL.Fr_topic + 'anon/find/hot',params).then((res) => {
                        console.log(res)
                        if(res.dataList.length){
                            this.pageNum += 1
                            this.topicList = this.topicList.concat(res.dataList)
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                            if (res.dataList.length < 5) {
                                this.isLoading = false
                                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                            }
                            this.isLoading = false
                        } else {
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
                            this.isLoading = false
                        }
                    })
                } else if(this.allSearchName !== '' && this.topicName == ''){
                    var params = {
                        currentPageNum: this.pageNum,
                        perPageNum: this.pageSize,
                        text:  this.allSearchName,
                        flag: false
                    }
                    this.$axiosStuRes('get',this.$axiosURL.Fr_es + 'anon/find/all',params).then((res)=>{
                        for (let i = 0; i < res.searchHits.length; i++) {
                            for (const key in res.highlightResults[i][0]) {
                                if(res.searchHits[i].sourceAsMap.hasOwnProperty(key)) {
                                    res.searchHits[i].sourceAsMap[key] = res.highlightResults[i][0][key]
                                }
                            }
                        }
                        if(res.searchHits.length){
                            this.pageNum += 1
                            this.topicList = this.topicList.concat(res.searchHits)
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                            if (res.searchHits.length < 5) {
                                this.isLoading = false
                                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                            }
                            this.isLoading = false
                        } else {
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
                            this.isLoading = false
                        }
                    })   
                } else if(this.allSearchName == '' && this.topicName !== ''){
                    var params = {
                        currentPageNum: this.pageNum,
                        perPageNum: this.pageSize,
                        topicLabel:  this.topicName
                    }
                    this.$axiosStuRes('get', this.$axiosURL.Fr_topic + 'anon/find/relateTopic',params).then((res) => {
                        if(res.dataList.length){
                            this.pageNum += 1
                            this.topicList = this.topicList.concat(res.dataList)
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                            if (res.dataList.length < 5) {
                                this.isLoading = false
                                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                            }
                            this.isLoading = false
                        } else {
                            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
                            this.isLoading = false
                        }
                    })              
                }
            }
        },
        UTCtoDate:function(date){
            return this.$tools.UTCtoDate(date)
        },
    },
    mounted() {
        this.infiniteHandler()
        this.$bus.$on('searchTopic',(name) => {
            this.allSearchName = ''
            this.topicName = name
            this.pageNum = 1
            this.topicList = []
            this.ishow = false 
            this.$nextTick(()=>{
                this.ishow = true
            })
            // this.infiniteHandler()
        })
        this.$bus.$on('allsearchTopic',(name) => {
            this.topicName = ''
            this.allSearchName = name
            this.pageNum = 1
            this.topicList = []
            this.ishow = false 
            this.$nextTick(()=>{
                this.ishow = true
            })
            // this.infiniteHandler()
        })
    },
}
</script>
