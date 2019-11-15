<template>
    <div class="myNews">
        <el-card class="box-card">
            <div v-for="item in replyList" :key="item.id" class="textitem">
                <div class="myComTop">
                    <div class="myComTopCen myComName">
                        <span>{{item.replyusername}}</span>
                    </div>
                    <div class="myComTopCen myComCon">
                        <span v-html="item.topictext"></span>
                    </div>
                </div>
                <div class="reply replyCon" v-if="item.seccomttext == null">
                    <span v-html="item.comttext"></span>
                </div>
                <div class="reply replyCon" v-if="item.seccomttext !== null">
                    <span v-html="item.seccomttext"></span>
                </div>
                <div class="reply replyTopic">
                    来自话题：{{item.topictitle}}
                </div>
            </div>
        </el-card>
        <infinite-loading @infinite="myReply" ref="infiniteLoading">
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
            replyList:[],
            replayPageNum: 1,
            replayPageSize: 5,
            isLoading: false,
        }
    },
    components: {
        InfiniteLoading,
    },
    methods: {
        // 我的回复
        myReply(){
           if(this.isLoading){
                return
            } else {
                this.isLoading = true
                var params = {
                    currentPageNum: this.replayPageNum,
                    perPageNum: this.replayPageSize,
                    userid: this.$tools.userid('id')
                }
                 this.$axiosStuRes1('get', this.$axiosURL.Fr_personMsg + 'find/myComment', params).then((res) => {
                    console.log(res)
                    if(res.dataList.length){
                        this.replayPageNum += 1
                        this.replyList = this.replyList.concat(res.dataList)
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
        },

    },
    mounted() {
        this.myReply()
        this.$nextTick(()=>{
            console.log($('img'))
        })
    },
    updated() {
        console.log($('img'))
    },
}
</script>