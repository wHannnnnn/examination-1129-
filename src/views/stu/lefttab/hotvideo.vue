<template>
    <div class="index_bottom">
        <el-table  
            :data="RMTable"
            style="width: 100%"
            max-height="250"
            @row-click='RMClick'
            >
            <el-table-column
            type="index"
            :index="indexMethod">
            </el-table-column>
            <el-table-column
            prop="fileTitle"
            label="视频名称"
            >
            </el-table-column>
            <el-table-column
            prop="browsingNum"
            label="点击量"
            >
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data(){
        return {
            RMTable: [],
        }
    },
    methods: {
        getVideo(){
            this.$axiosStuRes('get',this.$axiosURL.f_file + 'hotFile/3',{pageNum:1,pageSize:6}).then((res)=>{
                console.log(res)
                this.RMTable = res.data
            })
        },
        RMClick:function(item){
            sessionStorage.setItem('LSKJ',JSON.stringify(item))
            const route = this.$router.resolve({name:'classRoom'})
            window.open(route.href,'_blank',)
        },
    },
    created:function(){
        this.getVideo()
    },

}
</script>