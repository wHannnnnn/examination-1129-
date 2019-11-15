<template>
    <div class="allSearch">
        <el-backtop :bottom="60"></el-backtop>
        <!-- 热门话题 -->
        <ul class="allSearchUl">
        
            <li class="allSearchLi" v-for="(item,index) in searchList" :key="item.id">
                <!-- 话题 -->
                <div class="content" v-if="item.index == 'topic'">
                    <router-link tag='a' target='_blank' :to="{name: '/topicDetails', params: {id:item.sourceAsMap.id}}">
                        <!-- <div class="topic-name">
                            <span class="pointName">{{item.sourceAsMap.title}}</span>
                        </div> -->
                        <div class="topic-name">
                            <span class="pointName" v-html="item.sourceAsMap.title"></span>
                        </div>
                        <div class="topic-title">
                            <span class="title-value">{{item.sourceAsMap.topiclabel}}</span>
                        </div>
                        <div class="topic-detail" v-html="item.sourceAsMap.textcontent">
                            <!-- {{item.textcontent}} -->
                        </div>
                        <div class="topic-info">
                            <div class="userInfo">
                                <span class="userInfoName">{{item.sourceAsMap.username}}</span>
                            </div>
                            <div class="dataNum">
                                <!-- <span class="watchNum"><img :src="watchImg">{{itemcommentnum}}</span> -->
                                <span class="commentNum"><img :src="commentImg">{{item.sourceAsMap.commentnum}}</span>
                            </div>
                            <div class="userInfo" style="color: #333">
                                <span class="topicTime">{{item.sourceAsMap.createtime}}</span>
                            </div>
                        </div>
                    </router-link>
                </div>
                <!-- 回复 -->
                <div class="commentSearch" v-if="item.index == 'comment'">
                    <router-link tag='a' target='_blank' :to="{name: '/topicDetails', params: {id:item.sourceAsMap.topicid}}">
                        <div class="com-title" >
                            <span class="pointName">{{item.sourceAsMap.username}}:<span v-html="item.sourceAsMap.textcontent"></span></span>
                        </div>
                        <div class="myComTop">
                            <div class="myComTopCen myComName">
                                <span>{{item.sourceAsMap.replyname}}:</span>
                            </div>
                            <div class="myComTopCen myComCon" v-if="item.sourceAsMap.secComtTextcontent">
                                <span v-html="item.sourceAsMap.secComtTextcontent"></span>
                            </div>
                            <div class="myComTopCen myComCon" v-if="!item.sourceAsMap.secComtTextcontent">
                                <span v-html="item.sourceAsMap.title"></span>
                            </div>
                        </div>
                        <!-- <div class="reply replyCon" v-if="item.seccomttext == null">
                            <span v-html="item.comttext"></span>
                        </div>
                        <div class="reply replyCon" v-if="item.seccomttext !== null">
                            <span v-html="item.seccomttext"></span>
                        </div> -->
                        <div class="reply replyTopic">
                            <span>来自：<span v-html="item.sourceAsMap.title"></span></span>
                            <span>话题发起人：{{item.sourceAsMap.topicUserName}}</span>
                            <span class="topicTime">{{item.sourceAsMap.createtime}}</span>
                        </div>
                    </router-link>
                </div>
                <!-- 文件 -->
                <div class="fileList" v-if="item.index == 'fileinfo'" @click="clickZL(item.sourceAsMap)">
                    <div class="listLi">
                        <div class="file-title">
                            <span class="pointName" v-html="item.sourceAsMap.fileTitle"></span>
                        </div>
                        <div class="listImg">
                        <img :src="imgSrc(item.sourceAsMap)" alt="">
                        </div>
                        <h3 class="listTiele">{{item.sourceAsMap.fileName}}</h3>
                        <p>{{item.sourceAsMap.summary}}</p>
                        <p style="display: flex;justify-content: space-between">
                            <span>
                                浏览量:<span class="biao">{{item.sourceAsMap.browsingNum?item.sourceAsMap.browsingNum:0}}</span>
                            </span>
                            <span>
                                收藏次数:<span class="biao">{{item.sourceAsMap.collectionNum?item.sourceAsMap.collectionNum:0}}</span>
                            </span>
                            <span class="topicTime">{{item.sourceAsMap.updateTime}}</span>
                        </p>
                    </div>
                </div>
            </li>
        </ul>
        <infinite-loading @infinite="searchAll" ref="infiniteLoading">
            <span slot="no-more">
                <div slot="no-more">已加载全部</div>
            </span>
        </infinite-loading>
    </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading';
export default {
  name: 'Index',
  data () {
    return {
        commentImg: require("@/assets/img/comment.png"),
        pathName: this.$route.name,
        input3: '',
        pageNum: 1,
        pageSize: 5,
        searchListShow: false,
        pageNum: 1,
        pageSize: 5,
        searchList: [],
        isLoading: false

    }
  },
    components: {
        InfiniteLoading,
    },
    computed: {
        allsearchValue() {
            return this.searchValue
        }
    },
  props: ['searchValue'],
  methods: {
    clickZL:function(item){
      sessionStorage.setItem('LSKJ',JSON.stringify(item))
      const route = this.$router.resolve({name:'classRoom'})
      window.open(route.href,'_blank',)
    },
    imgSrc:function(item){
      if (item.fileType == 0) {
        return this.wordImg
      } else if(item.fileType == 1){
        return item.onlinePath? this.$BASEURL + item.onlinePath:this.pictureImg
      }else if(item.fileType == 3){
        return item.videoImg? this.$BASEURL + item.videoImg:this.videoImg
      }
    },
    searchAll(){
            if(this.isLoading){
                return
            } else {
                this.isLoading = true
                var params = {
                    currentPageNum: this.pageNum,
                    perPageNum: this.pageSize,
                    text:  this.allsearchValue
                }
                this.$axiosStuRes('get',this.$axiosURL.Fr_es + 'anon/find/all',params).then((res)=>{
                    // console.log(res.searchHits)
                    for (let i = 0; i < res.searchHits.length; i++) {
                        // console.log(res.searchHits[i].sourceAsMap)
                        // console.log(res.highlightResults[i][0])
                        for (const key in res.highlightResults[i][0]) {
                            // console.log(key)
                            if(res.searchHits[i].sourceAsMap.hasOwnProperty(key)) {
                                // if(res.highlightResults[i][0][key].length <= 100){
                                    res.searchHits[i].sourceAsMap[key] = res.highlightResults[i][0][key]
                                // }
                                // if(res.highlightResults[i][0][key].length > 100){
                                //     console.log(res.searchHits[i].sourceAsMap[key],999)
                                // }
                                // console.log(res.searchHits[i].sourceAsMap[key])
                                // console.log(res.highlightResults[i][0][key])
                            }
                        }
                    }
                    // console.log(res.highlightResults)
                    if(res.searchHits.length){
                        this.pageNum += 1
                        this.searchList = this.searchList.concat(res.searchHits)
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
            }
        }
      // this.$router.push({name:'learning_index',params:{keyword:this.input3}})
    //   var params = {
    //       currentPageNum: this.pageNum,
    //       perPageNum: this.pageSize,
    //       text:  this.allsearchValue
    //   }
    //   this.$axiosStuRes('get',this.$axiosURL.Fr_es + 'anon/find/all',params).then((res)=>{
    //     console.log(res.searchHits)
    //     // res.searchHits.forEach((ele,index) => {          
    //     //   Vue.set(this.searchList, index, ele)
    //     // });
    //     this.searchListShow = true
    //     this.searchList = res.searchHits
    //   })
  },

  mounted(){
    this.searchAll()
  },
  created:function(){
      
  }
}
</script>