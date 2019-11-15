<template>
    <div>
      <hottopic></hottopic>
    </div>
</template>
<script>
import hottopic from '../online/rightNav/hotTopic.vue'
export default {
    data() {
      return {
        tableData: [
            {
                examName: 'aa',
                examType: 'bb',
                examState: 'cc',
                examModality: 'dd',
                createTime: 'aa',
                startTime: 'aa',
                endTime: 'aa',
                updateBy: 'aa',
            }
        ]
      }
    },
    components:{
      hottopic
    },
    methods: {
      shuaxin(){
        this.$bus.$emit('shuaxin','')
      },
      checkselectable(){}
    },
}
</script>