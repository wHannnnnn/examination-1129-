<template>
    <div class="learning">
        <div class="rightList">
        <ul>
            <li v-for="(item,index) in hotPicList" @click="clickZL(item)">
            <div class="listImg">
                <img :src="imgSrc(item)" alt="">
            </div>
            <h3 class="listTiele">{{item.fileTitle}}</h3>
            <p>{{item.summary}}</p>
            <p>
                浏览量:<a class="biao">{{item.browsingNum?item.browsingNum:0}}</a>
                收藏次数:<a class="biao">{{item.collectionNum?item.collectionNum:0}}</a>
            </p>
            </li>
        </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            hotPicList: []
        }
    },
    methods: {
        getPic(){
            this.$axiosStuRes('get',this.$axiosURL.f_file + 'hotFile/1',{pageNum:1,pageSize:6}).then((res)=>{
                console.log(res)
                this.hotPicList = res.data
            })
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
        clickZL:function(item){
            sessionStorage.setItem('LSKJ',JSON.stringify(item))
            const route = this.$router.resolve({name:'classRoom'})
            window.open(route.href,'_blank',)
        },
    },
    created() {
        this.getPic()
    },
}
</script>