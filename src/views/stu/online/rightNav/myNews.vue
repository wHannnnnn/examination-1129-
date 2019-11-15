<template>
    <div class="myNews">
        <el-card class="box-card">
            <div v-for="item in msgList" :key="item.id" class="textitem">
                <div class="reply replyCon">
                    <div><span>我的主题：</span><div v-html="item.topictext" class="myComName" style="disply: inline-block"></div></div>
                </div>
                <div class="myComTop">
                    <div class="myComTopCen myComName">
                        <span>{{item.username}}</span>
                    </div>
                    <div class="myComTopCen myComCon" v-if="item.seccomttext == null">
                        <span v-html="item.comttext"></span>
                    </div>
                    <div class="myComTopCen myComCon" v-if="item.seccomttext !== null">
                        <span v-html="item.seccomttext"></span>
                    </div>
                </div>
                <div class="reply replyTopic">
                    <span>来自话题：<span class="myComName" style="cursor:pointer">{{item.topictitle}}</span></span>
                    <!-- <el-button size="mini">回復</el-button> -->
                </div>
            </div>
        </el-card>
        <infinite-loading @infinite="myMsg" ref="infiniteLoading">
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
            msgList:[],
            comPageNum: 1,
            comPageSize: 5,
            isLoading: false,
        }
    },
    components: {
        InfiniteLoading,
    },
    methods: {
        // 我的消息
        myMsg(){
            if(this.isLoading){
                return
            } else {
                this.isLoading = true
                var params = {
                    currentPageNum: this.comPageNum,
                    perPageNum: this.comPageSize,
                    replyuserid: this.$tools.userid('id')
                }
                this.$axiosStuRes1('get', this.$axiosURL.Fr_personMsg + 'find/myMessage', params).then((res) => {
                    console.log(res)
                    if(res.dataList.length){
                        this.comPageNum += 1
                        this.msgList = this.msgList.concat(res.dataList)
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
    created() {
        this.myMsg()
    },
}
</script>