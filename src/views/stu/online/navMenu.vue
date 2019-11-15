<template>
  <div class="navMenu">
 
    <label v-for="navMenu in navMenus">
    	<!--只有一级菜单-->
      <el-menu-item v-if="navMenu.knowledgePoints.length==0&&navMenu"
                    :key="navMenu.id" :data="navMenu" :index="navMenu.name"
                    @click.native="changeId(navMenu.name)"
                    >
        <!--标题-->
        <span slot="title">{{navMenu.name}}</span>
      </el-menu-item>
      <!--有多级菜单-->
      <el-submenu v-if="navMenu.knowledgePoints.length!==0&&navMenu"
                  @click.native="changeId(navMenu.name)"
                  :key="navMenu.id" :data="navMenu" :index="navMenu.name">
        <template slot="title">
          <span> {{navMenu.name}}</span>
        </template>
        <!--递归组件，把遍历的值传回子组件，完成递归调用-->
        <nav-menu :navMenus="navMenu.knowledgePoints"></nav-menu>
      </el-submenu>
    </label>
 
  </div>
</template>
 
<script>
  export default {
    name: 'navMenu', //使用递归组件必须要有
    props: ['navMenus'], // 传入子组件的数据
    data() {
      return {
            pageNum: 1,
            pageSize: 5,
      }
    },
    methods: {
      changeId(name){
          this.$bus.$emit('searchTopic',name)
      }
    }
  }
</script>