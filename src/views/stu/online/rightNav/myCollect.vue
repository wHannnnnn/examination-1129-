<template>
    <div>
        <el-table  
            :data="newsList"
            style="width: 100%"
            max-height="350"
            @row-click='RMClick'
            >
            <el-table-column
            type="index"
            :index="indexMethod">
            </el-table-column>
            <el-table-column
            prop="topicTitle"
            label="标题"
            >
            </el-table-column>
            <el-table-column
            prop="topicUserName"
            label="作者"
            >
            </el-table-column>
            <el-table-column
            prop="createtime"
            label="收藏时间"
            >
            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="small"
                icon="edit"
                @click="handleLook(scope.$index, scope.row)">取消收藏
                </el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="prev, pager, next">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            newsList: [],
            pageNum: 1,
            pageSize: 5
        }
    },
    methods: {
        handleSizeChange(){},
        handleCurrentChange(){},
         RMClick(row){},
         handleLook(index,item){
            this.$axiosStuResBody('delete', this.$axiosURL.Fr_userTopic + 'delete/' + item.id).then((res) => {
                if(res.status == 1){
                    this.getCollection()
                }
            })
         },
        indexMethod(index) {
            return index + 1;
        },
        getCollection(){
            var params = {
                currentPageNum: this.pageNum,
                perPageNum: this.pageSize,
                userid: this.$tools.userid('id')
            }
            this.$axiosStuRes1('get', this.$axiosURL.Fr_userTopic + 'find/collection',params).then((res) => {
                console.log(res)
                this.newsList = res.dataList
            })
        }
    },
    mounted() {
        this.getCollection()
    },
}
</script>
<style lang="scss">
    .textitem {
        padding: 10px
    }
</style>