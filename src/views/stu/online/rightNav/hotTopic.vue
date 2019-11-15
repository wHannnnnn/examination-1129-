<template>
    <div class="hotTopic" v-if="ishow">
        <el-backtop :bottom="60"></el-backtop>
        <!-- 热门话题 -->
        <ul>
            <li v-for="(item,index) in topicList" :key="item.id">
                <div class="content">
                    <router-link tag='a' target='_blank' :to="{name: '/topicDetails', params: {id:item.id}}">
                        <div class="topic-name">
                            <span class="pointName">{{item.topiclabel}}</span>
                        </div>
                        <div class="topic-title">
                            <span class="title-value">{{item.title}}</span>
                        </div>
                        <div class="topic-detail" v-html="item.textcontent">
                        </div>
                        <div class="topic-info">
                            <div class="userInfo">
                                <span class="userInfoName">{{item.username}}</span>
                            </div>
                            <div class="dataNum">
                                <!-- <span class="watchNum"><img :src="watchImg">{{itemcommentnum}}</span> -->
                                <span class="commentNum"><img :src="commentImg">{{item.commentnum}}</span>
                            </div>
                            <div class="topicTime">
                                <span>{{UTCtoDate(item.createtime)}}</span>
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
            name: ''
        }
    },
    components: {
        InfiniteLoading,
    },
    methods: {
        infiniteHandler() {
            console.log(this.$store.state.topicName,333)
            if(this.isLoading){
                return
            } else {
                this.isLoading = true
                if( this.$store.state.topicName == ''){
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
                } else {
                    var params = {
                        currentPageNum: this.pageNum,
                        perPageNum: this.pageSize,
                        topicLabel:  this.$store.state.topicName
                    }
                    this.$axiosStuRes('get', this.$axiosURL.Fr_topic + 'anon/find/relateTopic',params).then((res) => {
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
                }
            }
        },
        search(){
            this.$axiosStuRes('get', this.$axiosURL.Fr_topic + 'anon/find/relateTopic',params).then((res) => {
                console.log(res)
            })
        },
        UTCtoDate:function(date){
            return this.$tools.UTCtoDate(date)
        },
    },
    mounted() {
        this.infiniteHandler()

        this.$bus.$on('searchTopic',(name) => {
            this.$store.state.topicName = name
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
