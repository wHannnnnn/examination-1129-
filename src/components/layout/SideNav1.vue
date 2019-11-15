<template>
  <div class="nav">
      <el-menu class="el-menu-vertical-demo" router :unique-opened='true' disabled>
         <!-- v-if="this.$store.state.role =='ADMIN' ||  this.$store.state.role =='EXAM_PLAN_TEACHER'" -->
            <!-- v-if="this.$store.state.role =='ADMIN' || this.$store.state.role =='QUESTIONS_BANK_TEACHER'" -->
          <!-- 系统2 -->
          <el-menu-item data-index="/blog" index="/blog"><i class="el-icon-menu"></i>焦点话题</el-menu-item>
          <el-menu-item data-index="/teaplan" index="/teaplan"><i class="el-icon-menu"></i>优秀教案</el-menu-item>
          <el-menu-item data-index="/hot_video" index="/hot_video"><i class="el-icon-menu"></i>热门视频</el-menu-item>
          <el-menu-item data-index="/hot_music" index="/hot_music"><i class="el-icon-menu"></i>流行音乐</el-menu-item>
          <el-menu-item data-index="/hot_pic" index="/hot_pic"><i class="el-icon-menu"></i>热点图片</el-menu-item>
          <!-- </div> -->
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'login',
    data() {
      return {
        
      }
    },
    methods: {
      shuaxin(){
        this.$bus.$emit('shuaxin','')
      },
    },
    mounted(){
      var that = this
       that.$router.push({path: '/blog'})
      $('.el-menu-item:eq(0)').addClass('is-active') 
      $('.el-menu-item').hover(function(){
        $('.el-menu-item').removeClass('is-active')
        $(this).addClass('is-active') 
        // console.log($(this).data('index'))
        that.$router.push({path:$(this).data('index')})
      })
    }
  }
</script>>

<style>

</style>